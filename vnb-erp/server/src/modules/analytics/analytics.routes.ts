import { Router, Request, Response } from 'express';
import { OrderModel } from '../pos/order.model.js';
import { ProductModel } from '../products/product.model.js';
import { CustomerDebtModel } from '../debts/debt.model.js';
import { isDbConnected } from '../../config/db.js';
import { memoryStore } from '../../config/memoryStore.js';

const router = Router();

// GET /api/analytics/summary - Fast executive summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayOrders = await OrderModel.find({
        createdAt: { $gte: startOfDay },
        status: 'completed',
      });

      const totalRevenueToday = todayOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
      const totalProfitToday = todayOrders.reduce((sum, ord) => sum + ord.profit, 0);
      const totalCashGiven = todayOrders
        .filter((o) => o.paymentMethod === 'cash')
        .reduce((sum, ord) => sum + (ord.totalAmount), 0);

      const allDebts = await CustomerDebtModel.find({ status: { $ne: 'settled' } });
      const totalOutstandingDebt = allDebts.reduce((sum, d) => sum + d.totalDebt, 0);

      const lowStockProducts = await ProductModel.find({
        isActive: true,
        $expr: { $lte: ['$stock', '$minStockAlert'] },
      });

      return res.json({
        success: true,
        data: {
          totalRevenueToday,
          totalProfitToday,
          orderCountToday: todayOrders.length,
          totalCashGiven,
          totalOutstandingDebt,
          lowStockCount: lowStockProducts.length,
          lowStockItems: lowStockProducts.slice(0, 5),
        },
      });
    }

    // Memory store fallback
    const totalRevenueToday = memoryStore.orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const totalProfitToday = memoryStore.orders.reduce((sum, ord) => sum + ord.profit, 0);
    const totalOutstandingDebt = memoryStore.debts.reduce((sum, d) => sum + d.totalDebt, 0);
    const lowStockItems = memoryStore.products.filter((p) => p.stock <= p.minStockAlert && p.isActive);

    return res.json({
      success: true,
      data: {
        totalRevenueToday,
        totalProfitToday,
        orderCountToday: memoryStore.orders.length,
        totalCashGiven: totalRevenueToday,
        totalOutstandingDebt,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.slice(0, 5),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
