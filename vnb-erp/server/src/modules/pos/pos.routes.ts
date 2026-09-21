import { Router, Request, Response } from 'express';
import { OrderModel, IOrderItem } from './order.model.js';
import { ProductModel } from '../products/product.model.js';
import { CustomerDebtModel } from '../debts/debt.model.js';
import { isDbConnected } from '../../config/db.js';
import { memoryStore, OrderRecord } from '../../config/memoryStore.js';
import { generateVietQRUrl } from '../../utils/vietqr.js';

const router = Router();

// GET /api/pos/orders - List recent orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, data: orders });
    }
    return res.json({ success: true, data: memoryStore.orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pos/vietqr - Generate dynamic VietQR on the fly
router.get('/vietqr', (req: Request, res: Response) => {
  try {
    const amount = Number(req.query.amount) || 0;
    const orderCode = (req.query.orderCode as string) || `HD${Date.now().toString().slice(-4)}`;
    const note = (req.query.note as string) || `HD ${orderCode}`;

    const tenant = memoryStore.tenant;
    const qrUrl = generateVietQRUrl({
      bankId: tenant.vietqrConfig.bankId,
      accountNo: tenant.vietqrConfig.accountNo,
      accountName: tenant.vietqrConfig.accountName,
      amount,
      orderCode,
      note,
    });

    return res.json({ success: true, data: { qrUrl, amount, orderCode } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pos/orders - Create and checkout order
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const {
      items,
      discount = 0,
      paymentMethod = 'cash',
      cashGiven = 0,
      customerName = 'Khách lẻ',
      customerPhone = '',
      cashierName = 'Cô Hoa',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống' });
    }

    const orderCode = `HD-${Date.now().toString().slice(-6)}`;

    // Calculate financials
    let subtotal = 0;
    let costTotal = 0;

    const validatedItems: IOrderItem[] = items.map((item: any) => {
      const itemSubtotal = item.price * item.quantity;
      const itemCostTotal = (item.costPrice || 0) * item.quantity;
      subtotal += itemSubtotal;
      costTotal += itemCostTotal;

      return {
        productId: item.productId,
        name: item.name,
        barcode: item.barcode || '',
        unit: item.unit || 'Cái',
        quantity: item.quantity,
        price: item.price,
        costPrice: item.costPrice || 0,
        subtotal: itemSubtotal,
      };
    });

    const totalAmount = Math.max(0, subtotal - (Number(discount) || 0));
    const profit = totalAmount - costTotal;
    const changeReturned = paymentMethod === 'cash' ? Math.max(0, cashGiven - totalAmount) : 0;

    // Generate VietQR if needed
    const tenant = memoryStore.tenant;
    const vietqrUrl = tenant.vietqrConfig?.customQrUrl || generateVietQRUrl({
      bankId: tenant.vietqrConfig.bankId,
      accountNo: tenant.vietqrConfig.accountNo,
      accountName: tenant.vietqrConfig.accountName,
      amount: totalAmount,
      orderCode,
      note: `HD ${orderCode}`,
    });

    if (isDbConnected) {
      // 1. Create Order in MongoDB
      const order = await OrderModel.create({
        orderCode,
        items: validatedItems,
        subtotal,
        discount,
        totalAmount,
        costTotal,
        profit,
        paymentMethod,
        cashGiven,
        changeReturned,
        customerName,
        customerPhone,
        cashierName,
        status: 'completed',
        vietqrUrl,
      });

      // 2. Decrement stock in MongoDB
      for (const item of validatedItems) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      // 3. Handle debt if paymentMethod === 'debt'
      if (paymentMethod === 'debt' && customerName) {
        let debtRecord = await CustomerDebtModel.findOne({ customerName });
        if (!debtRecord) {
          debtRecord = await CustomerDebtModel.create({
            customerName,
            phone: customerPhone,
            totalDebt: totalAmount,
            history: [
              {
                date: new Date(),
                type: 'charge',
                amount: totalAmount,
                orderCode,
                note: `Mua hàng ${orderCode}`,
              },
            ],
            status: 'unpaid',
          });
        } else {
          debtRecord.totalDebt += totalAmount;
          debtRecord.history.push({
            date: new Date(),
            type: 'charge',
            amount: totalAmount,
            orderCode,
            note: `Mua hàng ${orderCode}`,
          });
          debtRecord.status = 'unpaid';
          debtRecord.lastTransactionDate = new Date();
          await debtRecord.save();
        }
      }

      return res.status(201).json({ success: true, data: order });
    }

    // Memory store fallback
    const newOrder: OrderRecord = {
      _id: `ord_${Date.now()}`,
      orderCode,
      items: validatedItems,
      subtotal,
      discount,
      totalAmount,
      costTotal,
      profit,
      paymentMethod,
      cashGiven,
      changeReturned,
      customerName,
      customerPhone,
      cashierName,
      status: 'completed',
      vietqrUrl,
      createdAt: new Date().toISOString(),
    };
    memoryStore.orders.unshift(newOrder);

    // Decrement stock in memory
    for (const item of validatedItems) {
      const prod = memoryStore.products.find((p) => p._id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    // Handle debt in memory
    if (paymentMethod === 'debt' && customerName) {
      let debtRecord = memoryStore.debts.find((d) => d.customerName === customerName);
      if (!debtRecord) {
        memoryStore.debts.unshift({
          _id: `debt_${Date.now()}`,
          customerName,
          phone: customerPhone,
          totalDebt: totalAmount,
          history: [
            {
              date: new Date().toISOString(),
              type: 'charge',
              amount: totalAmount,
              orderCode,
              note: `Mua hàng ${orderCode}`,
            },
          ],
          lastTransactionDate: new Date().toISOString(),
          status: 'unpaid',
        });
      } else {
        debtRecord.totalDebt += totalAmount;
        debtRecord.history.unshift({
          date: new Date().toISOString(),
          type: 'charge',
          amount: totalAmount,
          orderCode,
          note: `Mua hàng ${orderCode}`,
        });
        debtRecord.status = 'unpaid';
        debtRecord.lastTransactionDate = new Date().toISOString();
      }
    }

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
