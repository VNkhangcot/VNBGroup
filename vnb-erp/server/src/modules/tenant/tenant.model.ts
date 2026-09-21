import mongoose, { Schema, Document } from 'mongoose';

export interface ITenantSubscription {
  planCode: string;
  planName: string;
  status: 'active' | 'trial' | 'expired' | 'suspended';
  startDate: Date;
  expiresAt: Date;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  maxUsers: number;
  maxProducts: number;
}

export interface ITenant extends Document {
  name: string;
  phone: string;
  address: string;
  mode: 'grocery_lite' | 'retail_standard' | 'sme_pro';
  activeModules: string[];
  vietqrConfig: {
    bankId: string;
    bankName: string;
    accountNo: string;
    accountName: string;
  };
  receiptFooterNote: string;
  subscription: ITenantSubscription;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, default: 'Tiệm Tạp Hóa Cô Hoa' },
    phone: { type: String, default: '0988888888' },
    address: { type: String, default: '123 Đường Số 5, P. Tân Quy, Q. 7, TP. HCM' },
    mode: {
      type: String,
      enum: ['grocery_lite', 'retail_standard', 'sme_pro'],
      default: 'grocery_lite',
    },
    activeModules: {
      type: [String],
      default: ['pos', 'products', 'inventory', 'debts', 'analytics'],
    },
    vietqrConfig: {
      bankId: { type: String, default: '970422' }, // MBBank
      bankName: { type: String, default: 'MBBank (Quân Đội)' },
      accountNo: { type: String, default: '0988888888' },
      accountName: { type: String, default: 'NGUYEN THI HOA' },
    },
    receiptFooterNote: { type: String, default: 'Cảm ơn Quý khách & Hẹn gặp lại!' },
    subscription: {
      planCode: { type: String, default: 'free_grocery' },
      planName: { type: String, default: 'Gói Tạp Hóa Khởi Nghiệp (0đ)' },
      status: {
        type: String,
        enum: ['active', 'trial', 'expired', 'suspended'],
        default: 'active',
      },
      startDate: { type: Date, default: Date.now },
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
      },
      billingCycle: { type: String, default: 'yearly' },
      price: { type: Number, default: 0 },
      maxUsers: { type: Number, default: 2 },
      maxProducts: { type: Number, default: 500 },
    },
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model<ITenant>('Tenant', TenantSchema);
