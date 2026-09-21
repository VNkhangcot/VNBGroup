export interface ProductRecord {
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

export interface OrderRecord {
  _id: string;
  orderCode: string;
  items: any[];
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

export interface DebtRecord {
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

export interface TenantRecord {
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
    customQrUrl?: string;
  };
  receiptFooterNote: string;
}

export const memoryStore = {
  tenant: {
    _id: 'tenant_1',
    name: 'Tập Đoàn VNB Group',
    phone: '0988 888 888',
    address: 'Trụ sở chính VNB Group',
    mode: 'sme_pro' as const,
    activeModules: ['pos', 'products', 'inventory', 'debts', 'analytics', 'crm', 'hrm', 'multiBranch'],
    vietqrConfig: {
      bankId: '970422',
      bankName: 'MBBank',
      accountNo: '0988888888',
      accountName: 'VNB GROUP',
    },
    receiptFooterNote: 'Cảm ơn Quý khách đã tin tưởng và đồng hành cùng VNB Group!',
  } as TenantRecord,

  products: [] as ProductRecord[],

  debts: [] as DebtRecord[],

  orders: [] as OrderRecord[],
};
