export interface Product {
  _id: string;
  name: string;
  barcode: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  stock: number;
  minStockAlert: number;
  expiryDate?: string;
  quickSaleHotKey?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  barcode: string;
  unit: string;
  quantity: number;
  price: number;
  costPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderCode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  costTotal: number;
  profit: number;
  paymentMethod: 'cash' | 'vietqr' | 'debt';
  cashGiven: number;
  changeReturned: number;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  status: 'completed' | 'cancelled';
  vietqrUrl?: string;
  createdAt: string;
}

export interface CustomerDebt {
  _id: string;
  customerName: string;
  phone?: string;
  address?: string;
  totalDebt: number;
  history: Array<{
    date: string;
    type: 'charge' | 'repayment';
    amount: number;
    orderCode?: string;
    note?: string;
  }>;
  lastTransactionDate: string;
  status: 'unpaid' | 'partial' | 'settled';
}

export interface TenantConfig {
  _id: string;
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
  subscription?: TenantSubscription;
}

export interface AnalyticsSummary {
  totalRevenueToday: number;
  totalProfitToday: number;
  orderCountToday: number;
  totalCashGiven: number;
  totalOutstandingDebt: number;
  lowStockCount: number;
  lowStockItems: Product[];
}

export type UserRole = 'superadmin' | 'owner' | 'manager' | 'cashier';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  tenantId: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  avatar?: string;
  hasPin: boolean;
}

export interface TenantSubscription {
  planCode: string;
  planName: string;
  status: 'active' | 'trial' | 'expired' | 'suspended';
  startDate: string;
  expiresAt: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  maxUsers: number;
  maxProducts: number;
}

export interface SubscriptionPackage {
  _id: string;
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
  createdAt?: string;
}

export interface RenewalRecord {
  _id: string;
  tenantId: string;
  tenantName: string;
  planCode: string;
  planName: string;
  durationMonths: number;
  amount: number;
  paymentMethod: 'vietqr' | 'bank_transfer' | 'cash' | 'contract';
  previousExpiryDate: string;
  newExpiryDate: string;
  notes?: string;
  receiptNo: string;
  createdBy: string;
  createdAt: string;
}

export interface HqDashboardData {
  metrics: {
    totalTenants: number;
    activeTenants: number;
    trialTenants: number;
    expiredTenants: number;
    suspendedTenants: number;
    mrr: number;
    arr: number;
    totalProducts: number;
    totalUsers: number;
  };
  expiringSoonTenants: Array<{
    id: string;
    name: string;
    phone: string;
    planName: string;
    expiresAt: string;
    daysLeft: number;
  }>;
  recentRenewals: RenewalRecord[];
  packagesCount: number;
}

export interface TenantAdminView extends TenantConfig {
  owner?: {
    fullName: string;
    username: string;
    email?: string;
    phone?: string;
  };
  stats?: {
    userCount: number;
    productCount: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant: TenantConfig;
}

