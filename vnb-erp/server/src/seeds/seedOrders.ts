import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { OrderModel } from '../modules/pos/order.model.js';

const seedOrders = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnb_erp';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for order seeding...');

  const now = new Date();
  const makeDate = (daysAgo: number, hours: number, minutes: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const sampleOrders = [
    // Today Orders
    {
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
      createdAt: makeDate(0, 8, 15),
    },
    {
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
      createdAt: makeDate(0, 9, 45),
    },
    {
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
      createdAt: makeDate(0, 11, 20),
    },
    {
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
      createdAt: makeDate(0, 13, 50),
    },
    {
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
      createdAt: makeDate(0, 15, 30),
    },

    // Yesterday Orders
    {
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
      createdAt: makeDate(1, 10, 15),
    },
    {
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
      createdAt: makeDate(1, 16, 40),
    },

    // 2 Days Ago
    {
      orderCode: 'HD-780',
      items: [
        { productId: 'prod_7', name: 'Nước Mắm Nam Ngư Đệ Nhị 900ml', barcode: '893456124007', unit: 'Chai', quantity: 1, price: 28000, costPrice: 22000, subtotal: 28000 },
        { productId: 'prod_9', name: 'Trứng Gà Ba Huân (Vỉ 10 quả)', barcode: '893456124009', unit: 'Vỉ', quantity: 2, price: 33000, costPrice: 26000, subtotal: 66000 },
        { productId: 'prod_1', name: 'Mì Hảo Hảo Tôm Chua Cay', barcode: '893456124001', unit: 'Gói', quantity: 10, price: 4500, costPrice: 3800, subtotal: 45000 },
      ],
      subtotal: 139000,
      discount: 0,
      totalAmount: 139000,
      costTotal: 112000,
      profit: 27000,
      paymentMethod: 'cash',
      cashGiven: 150000,
      changeReturned: 11000,
      customerName: 'Bác Tư Hàng Xóm',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: makeDate(2, 9, 30),
    },
    {
      orderCode: 'HD-781',
      items: [
        { productId: 'prod_8', name: 'Bánh ChocoPie Hộp 12 Cái', barcode: '893456124008', unit: 'Hộp', quantity: 2, price: 55000, costPrice: 42000, subtotal: 110000 },
        { productId: 'prod_3', name: 'Sữa Tươi Vinamilk 100% Ít Đường 220ml', barcode: '893456124003', unit: 'Hộp', quantity: 8, price: 9000, costPrice: 7200, subtotal: 72000 },
      ],
      subtotal: 182000,
      discount: 0,
      totalAmount: 182000,
      costTotal: 141600,
      profit: 40400,
      paymentMethod: 'vietqr',
      cashGiven: 182000,
      changeReturned: 0,
      customerName: 'Chị Hà Mầm Non',
      cashierName: 'Anh Vũ - Chủ Tiệm VNB',
      status: 'completed',
      createdAt: makeDate(2, 14, 15),
    },

    // 3 Days Ago
    {
      orderCode: 'HD-770',
      items: [
        { productId: 'prod_10', name: 'Bột Giặt OMO Đỏ 3kg', barcode: '893456124010', unit: 'Túi', quantity: 2, price: 165000, costPrice: 135000, subtotal: 330000 },
        { productId: 'prod_4', name: 'Dầu Ăn Simply 1 Lít', barcode: '893456124004', unit: 'Chai', quantity: 2, price: 56000, costPrice: 46000, subtotal: 112000 },
      ],
      subtotal: 442000,
      discount: 12000,
      totalAmount: 430000,
      costTotal: 362000,
      profit: 68000,
      paymentMethod: 'vietqr',
      cashGiven: 430000,
      changeReturned: 0,
      customerName: 'Khách mua nhiều',
      cashierName: 'Anh Vũ - Chủ Tiệm VNB',
      status: 'completed',
      createdAt: makeDate(3, 11, 0),
    },

    // 4 Days Ago
    {
      orderCode: 'HD-760',
      items: [
        { productId: 'prod_2', name: 'Nước Ngọt Coca-Cola 330ml', barcode: '893456124002', unit: 'Lon', quantity: 8, price: 10000, costPrice: 7500, subtotal: 80000 },
        { productId: 'prod_6', name: 'Nước Tăng Lực Sting Dâu 330ml', barcode: '893456124006', unit: 'Chai', quantity: 5, price: 11000, costPrice: 8000, subtotal: 55000 },
      ],
      subtotal: 135000,
      discount: 0,
      totalAmount: 135000,
      costTotal: 100000,
      profit: 35000,
      paymentMethod: 'cash',
      cashGiven: 200000,
      changeReturned: 65000,
      customerName: 'Đội Thợ Xây',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: makeDate(4, 16, 20),
    },

    // 5 Days Ago
    {
      orderCode: 'HD-750',
      items: [
        { productId: 'prod_5', name: 'Bia Heineken Silver 330ml', barcode: '893456124005', unit: 'Lon', quantity: 8, price: 22000, costPrice: 17500, subtotal: 176000 },
        { productId: 'prod_1', name: 'Mì Hảo Hảo Tôm Chua Cay', barcode: '893456124001', unit: 'Gói', quantity: 6, price: 4500, costPrice: 3800, subtotal: 27000 },
      ],
      subtotal: 203000,
      discount: 3000,
      totalAmount: 200000,
      costTotal: 162800,
      profit: 37200,
      paymentMethod: 'cash',
      cashGiven: 200000,
      changeReturned: 0,
      customerName: 'Khách quen xóm',
      cashierName: 'Cô Hoa - Thu Ngân Ca Sáng',
      status: 'completed',
      createdAt: makeDate(5, 17, 30),
    },
  ];

  // Insert or Upsert sample orders
  for (const ord of sampleOrders) {
    await OrderModel.findOneAndUpdate(
      { orderCode: ord.orderCode },
      { $set: ord },
      { upsert: true, new: true }
    );
  }

  console.log(`✔ Successfully seeded ${sampleOrders.length} realistic orders across past 6 days!`);
  await mongoose.disconnect();
};

seedOrders().catch((err) => {
  console.error('Order seeding error:', err);
  process.exit(1);
});
