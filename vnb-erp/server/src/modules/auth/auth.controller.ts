import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from './user.model.js';
import { TenantModel } from '../tenant/tenant.model.js';
import { JWT_SECRET, AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId.toString(),
    },
    JWT_SECRET,
    { expiresIn: '7d' } // 7-day session for retail & POS registers
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeName, storePhone, fullName, username, email, password, pinCode } = req.body;

    if (!storeName || !fullName || !username || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Tên cửa hàng, Họ tên chủ tiệm, Tên đăng nhập và Mật khẩu',
      });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check existing username
    const existing = await UserModel.findOne({ username: cleanUsername });
    if (existing) {
      res.status(400).json({
        success: false,
        message: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác!',
      });
      return;
    }

    // 1. Create Tenant (Cửa hàng / Doanh nghiệp)
    const newTenant = await TenantModel.create({
      name: storeName.trim(),
      phone: storePhone || '0988888888',
      address: 'Việt Nam',
      mode: 'grocery_lite',
      activeModules: ['pos', 'products', 'debts', 'analytics', 'inventory'],
      vietqrConfig: {
        bankId: '970422',
        bankName: 'MBBank (Quân Đội)',
        accountNo: storePhone || '0988888888',
        accountName: fullName.toUpperCase(),
      },
      receiptFooterNote: `Cảm ơn Quý khách đã mua sắm tại ${storeName}!`,
    });

    // 2. Hash password & create Owner User
    const passwordHash = await bcrypt.hash(password, 10);
    const ownerUser = await UserModel.create({
      username: cleanUsername,
      email: email ? email.trim().toLowerCase() : undefined,
      passwordHash,
      fullName: fullName.trim(),
      role: 'owner',
      pinCode: pinCode || '8888',
      tenantId: newTenant._id,
      avatar: '👑',
      lastLoginAt: new Date(),
    });

    // Also create a demo cashier account for this store
    const cashierPasswordHash = await bcrypt.hash('123456', 10);
    await UserModel.create({
      username: `${cleanUsername}_thungan`,
      fullName: 'Thu Ngân 01',
      passwordHash: cashierPasswordHash,
      role: 'cashier',
      pinCode: '1234',
      tenantId: newTenant._id,
      avatar: '💼',
    });

    const token = generateToken(ownerUser);

    res.status(201).json({
      success: true,
      message: 'Đăng ký cửa hàng & tài khoản chủ tiệm thành công!',
      data: {
        token,
        user: {
          id: ownerUser._id,
          username: ownerUser.username,
          fullName: ownerUser.fullName,
          role: ownerUser.role,
          avatar: ownerUser.avatar,
          tenantId: ownerUser.tenantId,
        },
        tenant: newTenant,
      },
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi khi đăng ký tài khoản',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Tên đăng nhập và Mật khẩu',
      });
      return;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by username or email
    const user = await UserModel.findOne({
      $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại trên hệ thống',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Tài khoản này đã bị khóa hoặc tạm ngừng hoạt động',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Mật khẩu không chính xác. Vui lòng thử lại!',
      });
      return;
    }

    // Check if store/tenant is suspended (for non-superadmin)
    const tenant = await TenantModel.findById(user.tenantId);
    if (user.role !== 'superadmin') {
      if (!tenant || tenant.subscription?.status === 'suspended') {
        res.status(403).json({
          success: false,
          isSuspended: true,
          message: `Cửa hàng "${tenant?.name || 'này'}" hiện đang bị TẠM KHÓA bởi Ban Quản Trị VNB Group. Vui lòng liên hệ Hotline: 1900 8888 hoặc Ban Giám Đốc để mở khóa!`,
        });
        return;
      }
    }

    // Update login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Đăng nhập thành công! Xin chào ${user.fullName}`,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
          tenantId: user.tenantId,
        },
        tenant,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi khi đăng nhập',
    });
  }
};

export const pinLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, pinCode } = req.body;

    if (!userId || !pinCode) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng chọn nhân viên và nhập mã PIN 4 số',
      });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên hoặc tài khoản bị khóa',
      });
      return;
    }

    if (!user.comparePin(pinCode)) {
      res.status(401).json({
        success: false,
        message: 'Mã PIN không đúng. Vui lòng kiểm tra lại!',
      });
      return;
    }

    // Check if store/tenant is suspended (for non-superadmin)
    const tenant = await TenantModel.findById(user.tenantId);
    if (user.role !== 'superadmin') {
      if (!tenant || tenant.subscription?.status === 'suspended') {
        res.status(403).json({
          success: false,
          isSuspended: true,
          message: `Cửa hàng "${tenant?.name || 'này'}" hiện đang bị TẠM KHÓA bởi Ban Quản Trị VNB Group. Vui lòng liên hệ Hotline: 1900 8888 hoặc Ban Giám Đốc để mở khóa!`,
        });
        return;
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Chuyển ca thành công! Thu ngân: ${user.fullName}`,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
          tenantId: user.tenantId,
        },
        tenant,
      },
    });
  } catch (err: any) {
    console.error('PIN Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi khi xác thực mã PIN',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const tenant = await TenantModel.findById(req.user.tenantId);

    // If tenant suspended and not superadmin, terminate session
    if (req.user.role !== 'superadmin') {
      if (!tenant || tenant.subscription?.status === 'suspended') {
        res.status(403).json({
          success: false,
          isSuspended: true,
          message: `Cửa hàng "${tenant?.name || 'này'}" hiện đang bị TẠM KHÓA bởi Ban Quản Trị VNB Group. Phiên làm việc đã kết thúc.`,
        });
        return;
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          fullName: req.user.fullName,
          role: req.user.role,
          avatar: req.user.avatar,
          tenantId: req.user.tenantId,
        },
        tenant,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStaffList = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.query.tenantId;
    const filter = tenantId ? { tenantId, isActive: true } : { isActive: true };

    const staffList = await UserModel.find(filter)
      .select('fullName username role avatar pinCode tenantId')
      .sort({ role: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: staffList.map((s) => ({
        id: s._id,
        fullName: s.fullName,
        username: s.username,
        role: s.role,
        avatar: s.avatar,
        hasPin: Boolean(s.pinCode),
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createStaff = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role === 'cashier') {
      res.status(403).json({
        success: false,
        message: 'Chỉ Chủ tiệm hoặc Quản lý mới có quyền thêm nhân viên',
      });
      return;
    }

    const { fullName, username, password, role, pinCode, avatar } = req.body;

    if (!fullName || !username || !password) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Họ tên, Tên đăng nhập và Mật khẩu cho nhân viên',
      });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await UserModel.findOne({ username: cleanUsername });
    if (existing) {
      res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const staff = await UserModel.create({
      fullName: fullName.trim(),
      username: cleanUsername,
      passwordHash,
      role: role || 'cashier',
      pinCode: pinCode || '1234',
      avatar: avatar || '🧑‍💼',
      tenantId: req.user.tenantId,
    });

    res.status(201).json({
      success: true,
      message: 'Thêm nhân viên mới thành công',
      data: {
        id: staff._id,
        fullName: staff.fullName,
        username: staff.username,
        role: staff.role,
        avatar: staff.avatar,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
