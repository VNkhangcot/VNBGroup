import mongoose, { Schema, Document } from 'mongoose';

export interface IRenewalRecord extends Document {
  tenantId: mongoose.Types.ObjectId;
  tenantName: string;
  planCode: string;
  planName: string;
  durationMonths: number;
  amount: number;
  paymentMethod: 'vietqr' | 'bank_transfer' | 'cash' | 'contract';
  previousExpiryDate: Date;
  newExpiryDate: Date;
  notes?: string;
  receiptNo: string;
  createdBy: string;
  createdAt: Date;
}

const RenewalRecordSchema = new Schema<IRenewalRecord>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    tenantName: { type: String, required: true },
    planCode: { type: String, required: true },
    planName: { type: String, required: true },
    durationMonths: { type: Number, required: true },
    amount: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['vietqr', 'bank_transfer', 'cash', 'contract'],
      default: 'vietqr',
    },
    previousExpiryDate: { type: Date, required: true },
    newExpiryDate: { type: Date, required: true },
    notes: { type: String, default: '' },
    receiptNo: { type: String, required: true },
    createdBy: { type: String, default: 'Super Admin' },
  },
  { timestamps: true }
);

export const RenewalRecordModel = mongoose.model<IRenewalRecord>(
  'RenewalRecord',
  RenewalRecordSchema
);
