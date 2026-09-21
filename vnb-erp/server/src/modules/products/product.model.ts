import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  barcode: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  stock: number;
  minStockAlert: number;
  expiryDate?: Date;
  quickSaleHotKey?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    barcode: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: 'Hàng tạp hóa', index: true },
    unit: { type: String, default: 'Gói' },
    costPrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 },
    wholesalePrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    minStockAlert: { type: Number, default: 5 },
    expiryDate: { type: Date },
    quickSaleHotKey: { type: String }, // e.g. "F1", "F2", "Q1"
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
