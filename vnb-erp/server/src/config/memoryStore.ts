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
  };
  receiptFooterNote: string;
}

export const memoryStore = {
  tenant: {
    _id: 'tenant_1',
    name: 'Tiệm Tạp Hóa Cô Hoa',
    phone: '0988 888 888',
    address: '123 Đường Số 5, P. Tân Quy, Quận 7, TP. HCM',
    mode: 'grocery_lite' as const,
    activeModules: ['pos', 'products', 'inventory', 'debts', 'analytics'],
    vietqrConfig: {
      bankId: '970422',
      bankName: 'MBBank (Quân Đội)',
      accountNo: '0988888888',
      accountName: 'NGUYEN THI HOA',
    },
    receiptFooterNote: 'Cảm ơn Quý khách & Hẹn gặp lại cô chú anh chị!',
  } as TenantRecord,

  products: [
    {
      _id: 'prod_1',
      name: 'Mì Hảo Hảo Tôm Chua Cay',
      barcode: '893456124001',
      category: 'Thực phẩm ăn liền',
      unit: 'Gói',
      costPrice: 3800,
      sellingPrice: 4500,
      wholesalePrice: 4200,
      stock: 120,
      minStockAlert: 10,
      quickSaleHotKey: 'F1',
      imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_2',
      name: 'Nước Ngọt Coca-Cola 330ml',
      barcode: '893456124002',
      category: 'Nước giải khát',
      unit: 'Lon',
      costPrice: 7500,
      sellingPrice: 10000,
      wholesalePrice: 9000,
      stock: 48,
      minStockAlert: 12,
      quickSaleHotKey: 'F2',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_3',
      name: 'Sữa Tươi Vinamilk 100% Ít Đường 220ml',
      barcode: '893456124003',
      category: 'Sữa & Bơ',
      unit: 'Hộp',
      costPrice: 7200,
      sellingPrice: 9000,
      wholesalePrice: 8500,
      stock: 36,
      minStockAlert: 8,
      quickSaleHotKey: 'F3',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_4',
      name: 'Dầu Ăn Simply 1 Lít',
      barcode: '893456124004',
      category: 'Gia vị & Dầu ăn',
      unit: 'Chai',
      costPrice: 46000,
      sellingPrice: 56000,
      wholesalePrice: 52000,
      stock: 15,
      minStockAlert: 4,
      quickSaleHotKey: 'F4',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_5',
      name: 'Bia Heineken Silver 330ml',
      barcode: '893456124005',
      category: 'Bia & Rượu',
      unit: 'Lon',
      costPrice: 17500,
      sellingPrice: 22000,
      wholesalePrice: 20000,
      stock: 72,
      minStockAlert: 12,
      quickSaleHotKey: 'F5',
      imageUrl: 'https://images.unsplash.com/photo-1608270172550-b49871627403?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_6',
      name: 'Nước Tăng Lực Sting Dâu 330ml',
      barcode: '893456124006',
      category: 'Nước giải khát',
      unit: 'Chai',
      costPrice: 8000,
      sellingPrice: 11000,
      wholesalePrice: 10000,
      stock: 3, // Cảnh báo sắp hết hàng
      minStockAlert: 6,
      quickSaleHotKey: 'F6',
      imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_7',
      name: 'Nước Mắm Nam Ngư Đệ Nhị 900ml',
      barcode: '893456124007',
      category: 'Gia vị & Dầu ăn',
      unit: 'Chai',
      costPrice: 22000,
      sellingPrice: 28000,
      wholesalePrice: 26000,
      stock: 18,
      minStockAlert: 5,
      imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_8',
      name: 'Bánh ChocoPie Hộp 12 Cái',
      barcode: '893456124008',
      category: 'Bánh kẹo',
      unit: 'Hộp',
      costPrice: 42000,
      sellingPrice: 55000,
      wholesalePrice: 50000,
      stock: 10,
      minStockAlert: 3,
      imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_9',
      name: 'Trứng Gà Ba Huân (Vỉ 10 quả)',
      barcode: '893456124009',
      category: 'Thực phẩm tươi',
      unit: 'Vỉ',
      costPrice: 26000,
      sellingPrice: 33000,
      wholesalePrice: 30000,
      stock: 25,
      minStockAlert: 5,
      imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_10',
      name: 'Bột Giặt OMO Đỏ 3kg',
      barcode: '893456124010',
      category: 'Hóa mỹ phẩm',
      unit: 'Túi',
      costPrice: 135000,
      sellingPrice: 165000,
      wholesalePrice: 155000,
      stock: 8,
      minStockAlert: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ] as ProductRecord[],

  debts: [
    {
      _id: 'debt_1',
      customerName: 'Anh Ba Thợ Hồ',
      phone: '0912 345 678',
      address: 'Đầu hẻm 45',
      totalDebt: 185000,
      history: [
        {
          date: '2026-09-18T10:30:00.000Z',
          type: 'charge',
          amount: 185000,
          orderCode: 'HD-1045',
          note: 'Mua 6 lon bia Heineken + 2 gói mì cay',
        },
      ],
      lastTransactionDate: '2026-09-18T10:30:00.000Z',
      status: 'unpaid',
    },
    {
      _id: 'debt_2',
      customerName: 'Chị Lan Bán Chè',
      phone: '0908 777 999',
      address: 'Sát vách tiệm',
      totalDebt: 112000,
      history: [
        {
          date: '2026-09-19T08:15:00.000Z',
          type: 'charge',
          amount: 112000,
          orderCode: 'HD-1049',
          note: 'Lấy 2 chai dầu Simply 1L nấu chè',
        },
      ],
      lastTransactionDate: '2026-09-19T08:15:00.000Z',
      status: 'unpaid',
    },
    {
      _id: 'debt_3',
      customerName: 'Chú Bảy Xe Ôm',
      phone: '0977 123 456',
      address: 'Ngã tư',
      totalDebt: 0,
      history: [
        {
          date: '2026-09-15T17:00:00.000Z',
          type: 'charge',
          amount: 50000,
          orderCode: 'HD-1011',
          note: 'Thiếu gói thuốc và nước Sting',
        },
        {
          date: '2026-09-16T09:00:00.000Z',
          type: 'repayment',
          amount: 50000,
          note: 'Chú Bảy ghé trả đủ tiền',
        },
      ],
      lastTransactionDate: '2026-09-16T09:00:00.000Z',
      status: 'settled',
    },
  ] as DebtRecord[],

  orders: [
    {
      _id: 'ord_1',
      orderCode: 'HD-801',
      items: [
        { productId: 'prod_1', name: 'Mì Hảo Hảo Tôm Chua Cay', barcode: '893456124001', unit: 'Gói', quantity: 5, price: 4500, costPrice: 3800, subtotal: 22500 },
        { productId: 'prod_2', name: 'Nước Ngọt Coca-Cola 330ml', barcode: '893456124002', unit: 'Lon', quantity: 2, price: 10000, costPrice: 7500, subtotal: 20000 },
      ],
      subtotal: 42500,
      discount: 0,
      totalAmount: 42500,
      costTotal: 34000,
      profit: 8500,
      paymentMethod: 'cash',
      cashGiven: 50000,
      changeReturned: 7500,
      customerName: 'Khách vãng lai',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    },
    {
      _id: 'ord_2',
      orderCode: 'HD-802',
      items: [
        { productId: 'prod_10', name: 'Bột Giặt OMO Đỏ 3kg', barcode: '893456124010', unit: 'Túi', quantity: 1, price: 165000, costPrice: 135000, subtotal: 165000 },
        { productId: 'prod_4', name: 'Dầu Ăn Simply 1 Lít', barcode: '893456124004', unit: 'Chai', quantity: 1, price: 56000, costPrice: 46000, subtotal: 56000 },
      ],
      subtotal: 221000,
      discount: 5000,
      totalAmount: 216000,
      costTotal: 181000,
      profit: 35000,
      paymentMethod: 'vietqr',
      cashGiven: 216000,
      changeReturned: 0,
      customerName: 'Chị Mai (Nhà số 12)',
      customerPhone: '0933 111 222',
      cashierName: 'Anh Vũ - Chủ Tiệm VNB',
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      _id: 'ord_3',
      orderCode: 'HD-803',
      items: [
        { productId: 'prod_9', name: 'Trứng Gà Ba Huân (Vỉ 10 quả)', barcode: '893456124009', unit: 'Vỉ', quantity: 1, price: 33000, costPrice: 26000, subtotal: 33000 },
        { productId: 'prod_3', name: 'Sữa Tươi Vinamilk 100% Ít Đường 220ml', barcode: '893456124003', unit: 'Hộp', quantity: 4, price: 9000, costPrice: 7200, subtotal: 36000 },
      ],
      subtotal: 69000,
      discount: 0,
      totalAmount: 69000,
      costTotal: 54800,
      profit: 14200,
      paymentMethod: 'cash',
      cashGiven: 100000,
      changeReturned: 31000,
      customerName: 'Cô Năm Tạp Hóa',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    },
    {
      _id: 'ord_4',
      orderCode: 'HD-804',
      items: [
        { productId: 'prod_6', name: 'Nước Tăng Lực Sting Dâu 330ml', barcode: '893456124006', unit: 'Chai', quantity: 2, price: 11000, costPrice: 8000, subtotal: 22000 },
        { productId: 'prod_8', name: 'Bánh ChocoPie Hộp 12 Cái', barcode: '893456124008', unit: 'Hộp', quantity: 1, price: 55000, costPrice: 42000, subtotal: 55000 },
      ],
      subtotal: 77000,
      discount: 0,
      totalAmount: 77000,
      costTotal: 58000,
      profit: 19000,
      paymentMethod: 'vietqr',
      cashGiven: 77000,
      changeReturned: 0,
      customerName: 'Chú Bảy Xe Ôm',
      customerPhone: '0977 123 456',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      _id: 'ord_5',
      orderCode: 'HD-805',
      items: [
        { productId: 'prod_5', name: 'Bia Heineken Silver 330ml', barcode: '893456124005', unit: 'Lon', quantity: 6, price: 22000, costPrice: 17500, subtotal: 132000 },
        { productId: 'prod_1', name: 'Mì Hảo Hảo Tôm Chua Cay', barcode: '893456124001', unit: 'Gói', quantity: 4, price: 4500, costPrice: 3800, subtotal: 18000 },
      ],
      subtotal: 150000,
      discount: 0,
      totalAmount: 150000,
      costTotal: 120200,
      profit: 29800,
      paymentMethod: 'debt',
      cashGiven: 0,
      changeReturned: 0,
      customerName: 'Anh Ba Thợ Hồ',
      customerPhone: '0912 345 678',
      cashierName: 'Anh Vũ - Chủ Tiệm VNB',
      status: 'completed',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
    {
      _id: 'ord_6',
      orderCode: 'HD-790',
      items: [
        { productId: 'prod_4', name: 'Dầu Ăn Simply 1 Lít', barcode: '893456124004', unit: 'Chai', quantity: 2, price: 56000, costPrice: 46000, subtotal: 112000 },
      ],
      subtotal: 112000,
      discount: 0,
      totalAmount: 112000,
      costTotal: 92000,
      profit: 20000,
      paymentMethod: 'debt',
      cashGiven: 0,
      changeReturned: 0,
      customerName: 'Chị Lan Bán Chè',
      customerPhone: '0908 777 999',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    },
    {
      _id: 'ord_7',
      orderCode: 'HD-791',
      items: [
        { productId: 'prod_5', name: 'Bia Heineken Silver 330ml', barcode: '893456124005', unit: 'Lon', quantity: 12, price: 22000, costPrice: 17500, subtotal: 264000 },
        { productId: 'prod_2', name: 'Nước Ngọt Coca-Cola 330ml', barcode: '893456124002', unit: 'Lon', quantity: 6, price: 10000, costPrice: 7500, subtotal: 60000 },
      ],
      subtotal: 324000,
      discount: 10000,
      totalAmount: 314000,
      costTotal: 255000,
      profit: 59000,
      paymentMethod: 'vietqr',
      cashGiven: 314000,
      changeReturned: 0,
      customerName: 'Anh Trọng (Giao sỉ)',
      cashierName: 'Anh Vũ - Chủ Tiệm VNB',
      status: 'completed',
      createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    },
  ] as OrderRecord[],
};
