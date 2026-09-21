import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { TenantModel } from '../tenant/tenant.model.js';
import { UserModel } from '../auth/user.model.js';
import { PackageModel } from './package.model.js';
import { RenewalRecordModel } from './renewal.model.js';
import { ProductModel } from '../products/product.model.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export const getHqDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await TenantModel.find().lean();
    const totalTenants = tenants.length;

    let activeTenants = 0;
    let trialTenants = 0;
    let expiredTenants = 0;
    let suspendedTenants = 0;
    let mrr = 0; // Monthly Recurring Revenue

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoonTenants: any[] = [];

    tenants.forEach((t) => {
      const sub = t.subscription || ({} as any);
      const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;

      if (sub.status === 'suspended') {
        suspendedTenants++;
      } else if (expiresAt && expiresAt < now) {
        expiredTenants++;
      } else if (sub.status === 'trial') {
        trialTenants++;
      } else {
        activeTenants++;
      }

      // Check expiring soon within 7 days
      if (expiresAt && expiresAt >= now && expiresAt <= sevenDaysLater) {
        expiringSoonTenants.push({
          id: t._id,
          name: t.name,
          phone: t.phone,
          planName: sub.planName || 'Gói Cửa Hàng',
          expiresAt: sub.expiresAt,
          daysLeft: Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        });
      }

      // Calculate MRR from package price
      if (sub.price && sub.status === 'active') {
        if (sub.billingCycle === 'yearly') {
          mrr += Math.round(sub.price / 12);
        } else {
          mrr += sub.price;
        }
      }
    });

    const totalProducts = await ProductModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const recentRenewals = await RenewalRecordModel.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const packages = await PackageModel.find({ isActive: true }).lean();

    res.json({
      success: true,
      data: {
        metrics: {
          totalTenants,
          activeTenants,
          trialTenants,
          expiredTenants,
          suspendedTenants,
          mrr,
          arr: mrr * 12,
          totalProducts,
          totalUsers,
        },
        expiringSoonTenants,
        recentRenewals,
        packagesCount: packages.length,
      },
    });
  } catch (err: any) {
    console.error('HQ Dashboard error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== PACKAGES ====================

export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await PackageModel.find().sort({ priceMonthly: 1 });
    res.json({ success: true, data: packages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      code,
      description,
      priceMonthly,
      priceYearly,
      activeModules,
      limits,
      badgeText,
      isPopular,
    } = req.body;

    if (!name || !code) {
      res.status(400).json({ success: false, message: 'Tên gói và Mã gói là bắt buộc' });
      return;
    }

    const cleanCode = code.trim().toLowerCase();
    const existing = await PackageModel.findOne({ code: cleanCode });
    if (existing) {
      res.status(400).json({ success: false, message: 'Mã gói cước này đã tồn tại' });
      return;
    }

    const newPkg = await PackageModel.create({
      name: name.trim(),
      code: cleanCode,
      description: description || '',
      priceMonthly: Number(priceMonthly) || 0,
      priceYearly: Number(priceYearly) || 0,
      activeModules: activeModules || ['pos', 'products', 'debts'],
      limits: limits || { maxProducts: 500, maxUsers: 2, maxBranches: 1 },
      badgeText: badgeText || '',
      isPopular: Boolean(isPopular),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo gói dịch vụ mới thành công',
      data: newPkg,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await PackageModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Không tìm thấy gói cước' });
      return;
    }
    res.json({ success: true, message: 'Cập nhật gói cước thành công', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await PackageModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Đã xóa gói cước khỏi hệ thống' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== TENANTS MANAGEMENT ====================

export const getAllTenants = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await TenantModel.find().sort({ createdAt: -1 }).lean();

    // Attach owner info for each tenant
    const enriched = await Promise.all(
      tenants.map(async (t) => {
        const owner = await UserModel.findOne({
          tenantId: t._id,
          role: { $in: ['owner', 'superadmin'] },
        })
          .select('fullName username email phone')
          .lean();

        const userCount = await UserModel.countDocuments({ tenantId: t._id });
        const productCount = await ProductModel.countDocuments(); // In production scoped by tenant

        return {
          ...t,
          owner: owner || { fullName: 'Chưa gán', username: '-' },
          stats: {
            userCount,
            productCount,
          },
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Renew subscription
export const renewSubscription = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { tenantId, durationMonths, planCode, amount, paymentMethod, notes } = req.body;

    if (!tenantId || !durationMonths) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tenantId và thời gian gia hạn (tháng)',
      });
      return;
    }

    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Không tìm thấy cửa hàng/doanh nghiệp' });
      return;
    }

    const pkg = await PackageModel.findOne({ code: planCode });
    const planName = pkg ? pkg.name : tenant.subscription?.planName || 'Gói Cửa Hàng';

    const now = new Date();
    const currentExpiry =
      tenant.subscription?.expiresAt && new Date(tenant.subscription.expiresAt) > now
        ? new Date(tenant.subscription.expiresAt)
        : now;

    // Calculate new expiration date
    const newExpiry = new Date(currentExpiry);
    if (durationMonths === 999) {
      // Lifetime license: 50 years ahead
      newExpiry.setFullYear(newExpiry.getFullYear() + 50);
    } else {
      newExpiry.setMonth(newExpiry.getMonth() + Number(durationMonths));
    }

    const previousExpiryDate = tenant.subscription?.expiresAt || now;

    // Update Tenant subscription
    tenant.subscription = {
      planCode: planCode || tenant.subscription?.planCode || 'standard_retail',
      planName,
      status: 'active',
      startDate: tenant.subscription?.startDate || now,
      expiresAt: newExpiry,
      billingCycle: durationMonths >= 12 ? 'yearly' : 'monthly',
      price: Number(amount) || 0,
      maxUsers: pkg?.limits?.maxUsers || tenant.subscription?.maxUsers || 5,
      maxProducts: pkg?.limits?.maxProducts || tenant.subscription?.maxProducts || 5000,
    };

    // If package includes new modules, activate them
    if (pkg && pkg.activeModules) {
      const merged = Array.from(new Set([...tenant.activeModules, ...pkg.activeModules]));
      tenant.activeModules = merged;
      if (pkg.code === 'enterprise_pro') tenant.mode = 'sme_pro';
      else if (pkg.code === 'standard_retail') tenant.mode = 'retail_standard';
    }

    await tenant.save();

    // Create Renewal Record
    const receiptNo = `VNB-RNW-${Date.now().toString().slice(-6)}`;
    const renewalRecord = await RenewalRecordModel.create({
      tenantId: tenant._id,
      tenantName: tenant.name,
      planCode: tenant.subscription.planCode,
      planName,
      durationMonths,
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || 'vietqr',
      previousExpiryDate,
      newExpiryDate: newExpiry,
      notes: notes || '',
      receiptNo,
      createdBy: req.user?.fullName || 'Super Admin',
    });

    res.json({
      success: true,
      message: `Gia hạn thành công cho "${tenant.name}" đến ngày ${newExpiry.toLocaleDateString(
        'vi-VN'
      )}`,
      data: {
        tenant,
        renewalRecord,
      },
    });
  } catch (err: any) {
    console.error('Renew error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle active / suspended status
export const toggleTenantStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenant = await TenantModel.findById(id);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Không tìm thấy cửa hàng' });
      return;
    }

    const currentStatus = tenant.subscription?.status || 'active';
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';

    tenant.subscription.status = nextStatus;
    await tenant.save();

    res.json({
      success: true,
      message: `Đã ${nextStatus === 'suspended' ? 'TẠM KHÓA' : 'MỞ KHÓA HOẠT ĐỘNG'} cửa hàng "${
        tenant.name
      }"`,
      data: { status: nextStatus },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Direct Onboarding: Super Admin creates Tenant + Owner Account + Assigns Plan
export const createTenantWithUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      storeName,
      storePhone,
      address,
      ownerFullName,
      username,
      password,
      planCode,
      durationMonths,
    } = req.body;

    if (!storeName || !ownerFullName || !username || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Tên cửa hàng, Họ tên chủ tiệm, Tên đăng nhập và Mật khẩu',
      });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await UserModel.findOne({ username: cleanUsername });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Tên đăng nhập này đã có người sử dụng. Vui lòng chọn tên khác!',
      });
      return;
    }

    const pkg = await PackageModel.findOne({ code: planCode || 'standard_retail' });
    const planName = pkg ? pkg.name : 'Gói Bán Lẻ Tiêu Chuẩn';
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + (Number(durationMonths) || 12));

    // 1. Create Tenant
    const newTenant = await TenantModel.create({
      name: storeName.trim(),
      phone: storePhone || '0988888888',
      address: address || 'Việt Nam',
      mode: pkg?.code === 'enterprise_pro' ? 'sme_pro' : 'retail_standard',
      activeModules: pkg?.activeModules || ['pos', 'products', 'debts', 'analytics'],
      vietqrConfig: {
        bankId: '970422',
        bankName: 'MBBank (Quân Đội)',
        accountNo: storePhone || '0988888888',
        accountName: ownerFullName.toUpperCase(),
      },
      receiptFooterNote: `Cảm ơn Quý khách đã mua sắm tại ${storeName}!`,
      subscription: {
        planCode: pkg?.code || 'standard_retail',
        planName,
        status: 'active',
        startDate: now,
        expiresAt,
        billingCycle: 'yearly',
        price: pkg?.priceYearly || 0,
        maxUsers: pkg?.limits?.maxUsers || 5,
        maxProducts: pkg?.limits?.maxProducts || 5000,
      },
    });

    // 2. Create Owner User
    const passwordHash = await bcrypt.hash(password, 10);
    const ownerUser = await UserModel.create({
      username: cleanUsername,
      passwordHash,
      fullName: ownerFullName.trim(),
      role: 'owner',
      pinCode: '8888',
      tenantId: newTenant._id,
      avatar: '👑',
      isActive: true,
    });

    // 3. Create default cashier
    const cashierPasswordHash = await bcrypt.hash('123456', 10);
    await UserModel.create({
      username: `${cleanUsername}_cashier`,
      fullName: 'Thu Ngân 01',
      passwordHash: cashierPasswordHash,
      role: 'cashier',
      pinCode: '1234',
      tenantId: newTenant._id,
      avatar: '💼',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `Khởi tạo doanh nghiệp "${newTenant.name}" và cấp tài khoản thành công!`,
      data: {
        tenant: newTenant,
        owner: {
          id: ownerUser._id,
          username: ownerUser.username,
          fullName: ownerUser.fullName,
          role: ownerUser.role,
        },
      },
    });
  } catch (err: any) {
    console.error('Direct Onboarding error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a tenant/customer business
export const deleteTenant = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const tenant = await TenantModel.findById(id);
    if (!tenant) {
      res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng/doanh nghiệp' });
      return;
    }

    const tenantName = tenant.name;

    // 1. Delete associated users belonging to this tenant, protecting superadmin
    await UserModel.deleteMany({
      tenantId: id,
      role: { $ne: 'superadmin' },
    });

    // 2. Delete renewal records for this tenant
    await RenewalRecordModel.deleteMany({ tenantId: id });

    // 3. Delete tenant
    await TenantModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Đã xóa vĩnh viễn khách hàng "${tenantName}" và toàn bộ tài khoản liên quan khỏi hệ thống.`,
    });
  } catch (err: any) {
    console.error('Delete Tenant error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
