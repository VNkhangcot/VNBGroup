import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  code: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  activeModules: string[];
  limits: {
    maxProducts: number;
    maxUsers: number;
    maxBranches: number;
  };
  badgeText?: string;
  isPopular?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    priceMonthly: { type: Number, required: true, default: 0 },
    priceYearly: { type: Number, required: true, default: 0 },
    activeModules: {
      type: [String],
      default: ['pos', 'products', 'debts'],
    },
    limits: {
      maxProducts: { type: Number, default: 500 },
      maxUsers: { type: Number, default: 2 },
      maxBranches: { type: Number, default: 1 },
    },
    badgeText: { type: String, default: '' },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PackageModel = mongoose.model<IPackage>('Package', PackageSchema);
