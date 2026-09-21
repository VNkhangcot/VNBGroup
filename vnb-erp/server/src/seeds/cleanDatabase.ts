import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ProductModel } from '../modules/products/product.model.js';
import { OrderModel } from '../modules/pos/order.model.js';
import { CustomerDebtModel } from '../modules/debts/debt.model.js';
import { TenantModel } from '../modules/tenant/tenant.model.js';
import { UserModel } from '../modules/auth/user.model.js';

const cleanAndInit = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnb_erp';
  await mongoose.connect(uri);
  console.log('Connecting to MongoDB at:', uri);

  // 1. Delete all mock data
  console.log('Clearing old mock data...');
  await ProductModel.deleteMany({});
  console.log('✔ Deleted all mock products');

  await OrderModel.deleteMany({});
  console.log('✔ Deleted all mock orders');

  await CustomerDebtModel.deleteMany({});
  console.log('✔ Deleted all mock customer debts');

  await UserModel.deleteMany({});
  console.log('✔ Deleted all existing users');

  await TenantModel.deleteMany({});
  console.log('✔ Reset tenant database');

  // 2. Create Official Corporate Tenant for VNB Group
  const tenant = await TenantModel.create({
    name: 'Tập Đoàn VNB Group',
    phone: '0988888888',
    address: 'Trụ sở chính VNB Group',
    mode: 'sme_pro',
    activeModules: ['pos', 'products', 'inventory', 'debts', 'analytics', 'crm', 'hrm', 'multiBranch'],
    subscription: {
      planCode: 'enterprise_pro',
      planName: 'Gói Doanh Nghiệp VIP VNB',
      status: 'active',
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      billingCycle: 'yearly',
      price: 0,
      maxUsers: 999,
      maxProducts: 999999,
    },
    vietqrConfig: {
      bankId: '970422',
      bankName: 'MBBank',
      accountNo: '0988888888',
      accountName: 'VNB GROUP',
    },
    receiptFooterNote: 'Cảm ơn Quý khách đã tin tưởng và đồng hành cùng VNB Group!',
  });
  console.log('✔ Created Official VNB Group Tenant:', tenant._id);

  // 3. Create Sole Highest Super Admin: VNkhangcot / Khang123123
  const passwordHash = await bcrypt.hash('Khang123123', 10);
  const superAdmin = await UserModel.create({
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
  console.log('✔ Created Highest Super Admin: VNkhangcot / Khang123123 (PIN: 9999)');

  console.log('✅ DATABASE CLEANED AND INITIALIZED SUCCESSFULLY!');
  await mongoose.disconnect();
};

cleanAndInit().catch((err) => {
  console.error('Error during database cleanup:', err);
  process.exit(1);
});
