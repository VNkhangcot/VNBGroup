import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ProductModel } from '../modules/products/product.model.js';
import { CustomerDebtModel } from '../modules/debts/debt.model.js';
import { TenantModel } from '../modules/tenant/tenant.model.js';
import { UserModel } from '../modules/auth/user.model.js';
import { PackageModel } from '../modules/admin/package.model.js';
import { memoryStore } from '../config/memoryStore.js';

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnb_erp';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding...');

  // 1. Seed Tenant
  let tenant = await TenantModel.findOne();
  if (!tenant) {
    const { _id, ...tenantData } = memoryStore.tenant;
    tenant = await TenantModel.create(tenantData);
    console.log('✔ Tenant created');
  }

  // Ensure tenant has subscription object saved in DB
  await TenantModel.updateOne(
    { _id: tenant._id, 'subscription.expiresAt': { $exists: false } },
    {
      $set: {
        subscription: {
          planCode: 'standard_retail',
          planName: 'Gói Bán Lẻ Tiêu Chuẩn',
          status: 'active',
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          billingCycle: 'yearly',
          price: 1490000,
          maxUsers: 5,
          maxProducts: 5000,
        },
      },
    }
  );
  console.log('✔ Tenant subscription verified');

  // 2. Seed Corporate SaaS Packages
  const pkgCount = await PackageModel.countDocuments();
  if (pkgCount === 0) {
    await PackageModel.create([
      {
        name: 'Gói Tạp Hóa Khởi Nghiệp',
        code: 'free_grocery',
        description: 'Gói cơ bản 0đ trọn đời cho các cô chú bán tiệm tạp hóa gia đình nhỏ lẻ.',
        priceMonthly: 0,
        priceYearly: 0,
        activeModules: ['pos', 'products', 'debts'],
        limits: { maxProducts: 500, maxUsers: 2, maxBranches: 1 },
        badgeText: 'Miễn Phí Trọn Đời',
        isPopular: false,
        isActive: true,
      },
      {
        name: 'Gói Bán Lẻ Tiêu Chuẩn',
        code: 'standard_retail',
        description: 'Đầy đủ quản lý kho, nhập hàng, báo cáo doanh thu & lợi nhuận chuyên sâu.',
        priceMonthly: 149000,
        priceYearly: 1490000,
        activeModules: ['pos', 'products', 'debts', 'analytics', 'inventory'],
        limits: { maxProducts: 5000, maxUsers: 5, maxBranches: 2 },
        badgeText: 'Khuyên Dùng',
        isPopular: true,
        isActive: true,
      },
      {
        name: 'Gói Doanh Nghiệp Chuỗi Pro',
        code: 'enterprise_pro',
        description: 'Giải pháp cấp doanh nghiệp quản lý đa chi nhánh, khách VIP CRM và tài chính tổng.',
        priceMonthly: 499000,
        priceYearly: 4990000,
        activeModules: [
          'pos',
          'products',
          'debts',
          'analytics',
          'inventory',
          'crm',
          'multiBranch',
        ],
        limits: { maxProducts: 50000, maxUsers: 25, maxBranches: 10 },
        badgeText: 'VIP Enterprise',
        isPopular: false,
        isActive: true,
      },
    ]);
    console.log('✔ Seeded 3 Corporate SaaS Packages');
  }

  // 3. Seed Users - Sole Highest Super Admin
  const existingSuperAdmin = await UserModel.findOne({ username: 'vnkhangcot' });
  if (!existingSuperAdmin) {
    const passwordHash = await bcrypt.hash('Khang123123', 10);
    await UserModel.create({
      username: 'VNkhangcot',
      email: 'vnkhangcot@vnb.io.vn',
      passwordHash,
      fullName: 'VNkhangcot',
      role: 'superadmin',
      pinCode: '9999',
      tenantId: tenant._id,
      avatar: '👑',
      isActive: true,
    });
    console.log('✔ Seeded Highest Super Admin: VNkhangcot / Khang123123 (PIN: 9999)');
  }

  console.log('Database verification completed!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
