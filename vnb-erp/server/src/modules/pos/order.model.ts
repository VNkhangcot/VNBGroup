import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  barcode: string;
  unit: string;
  quantity: number;
  price: number;
  costPrice: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderCode: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  costTotal: number;
  profit: number;
  paymentMethod: 'cash' | 'vietqr' | 'debt';
  cashGiven: number;
  changeReturned: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  cashierName: string;
  status: 'completed' | 'cancelled';
  vietqrUrl?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    barcode: { type: String, default: '' },
    unit: { type: String, default: 'Cái' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    costTotal: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'vietqr', 'debt'],
      default: 'cash',
    },
    cashGiven: { type: Number, default: 0 },
    changeReturned: { type: Number, default: 0 },
    customerId: { type: String },
    customerName: { type: String, default: 'Khách lẻ' },
    customerPhone: { type: String, default: '' },
    cashierName: { type: String, default: 'Cô Hoa' },
    status: {
      type: String,
      enum: ['completed', 'cancelled'],
      default: 'completed',
    },
    vietqrUrl: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
