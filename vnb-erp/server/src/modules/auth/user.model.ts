import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'superadmin' | 'owner' | 'manager' | 'cashier';

export interface IUser extends Document {
  username: string;
  email?: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  pinCode?: string; // 4-digit PIN for rapid POS cashier switch
  tenantId: mongoose.Types.ObjectId;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  comparePin(candidatePin: string): boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'owner', 'manager', 'cashier'],
      default: 'cashier',
      required: true,
    },
    pinCode: {
      type: String,
      default: '1234',
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Method to verify password
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Method to verify PIN code
UserSchema.methods.comparePin = function (candidatePin: string): boolean {
  return this.pinCode === candidatePin;
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);
