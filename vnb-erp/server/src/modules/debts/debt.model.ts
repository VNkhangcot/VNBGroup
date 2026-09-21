import mongoose, { Schema, Document } from 'mongoose';

export interface IDebtTransaction {
  date: Date;
  type: 'charge' | 'repayment'; // charge = nợ thêm, repayment = trả nợ bớt
  amount: number;
  orderCode?: string;
  note?: string;
}

export interface ICustomerDebt extends Document {
  customerName: string;
  phone?: string;
  address?: string;
  totalDebt: number;
  history: IDebtTransaction[];
  lastTransactionDate: Date;
  status: 'unpaid' | 'partial' | 'settled';
  createdAt: Date;
  updatedAt: Date;
}

const DebtTransactionSchema = new Schema<IDebtTransaction>(
  {
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['charge', 'repayment'], required: true },
    amount: { type: Number, required: true },
    orderCode: { type: String },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const CustomerDebtSchema = new Schema<ICustomerDebt>(
  {
    customerName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    totalDebt: { type: Number, required: true, default: 0 },
    history: { type: [DebtTransactionSchema], default: [] },
    lastTransactionDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['unpaid', 'partial', 'settled'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

export const CustomerDebtModel = mongoose.model<ICustomerDebt>(
  'CustomerDebt',
  CustomerDebtSchema
);
