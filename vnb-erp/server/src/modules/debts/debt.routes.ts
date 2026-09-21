import { Router, Request, Response } from 'express';
import { CustomerDebtModel } from './debt.model.js';
import { isDbConnected } from '../../config/db.js';
import { memoryStore } from '../../config/memoryStore.js';

const router = Router();

// GET /api/debts - List debts with optional status filter ('unpaid', 'all')
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string || '').toLowerCase().trim();

    if (isDbConnected) {
      const filter: any = {};
      if (search) {
        filter.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }
      const debts = await CustomerDebtModel.find(filter).sort({ totalDebt: -1 });
      return res.json({ success: true, data: debts });
    }

    let filtered = [...memoryStore.debts];
    if (search) {
      filtered = filtered.filter(
        (d) => d.customerName.toLowerCase().includes(search) || (d.phone && d.phone.includes(search))
      );
    }
    filtered.sort((a, b) => b.totalDebt - a.totalDebt);
    return res.json({ success: true, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/debts - Create or record new debt
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, amount, note } = req.body;
    const debtAmount = Number(amount) || 0;

    if (!customerName || debtAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên khách và số tiền nợ' });
    }

    if (isDbConnected) {
      let record = await CustomerDebtModel.findOne({ customerName });
      if (!record) {
        record = await CustomerDebtModel.create({
          customerName,
          phone,
          address,
          totalDebt: debtAmount,
          history: [
            {
              date: new Date(),
              type: 'charge',
              amount: debtAmount,
              note: note || 'Ghi nợ mới',
            },
          ],
          status: 'unpaid',
        });
      } else {
        record.totalDebt += debtAmount;
        record.history.unshift({
          date: new Date(),
          type: 'charge',
          amount: debtAmount,
          note: note || 'Ghi nợ thêm',
        });
        record.status = 'unpaid';
        record.lastTransactionDate = new Date();
        await record.save();
      }
      return res.status(201).json({ success: true, data: record });
    }

    // Memory fallback
    let record = memoryStore.debts.find((d) => d.customerName === customerName);
    if (!record) {
      record = {
        _id: `debt_${Date.now()}`,
        customerName,
        phone,
        address,
        totalDebt: debtAmount,
        history: [
          {
            date: new Date().toISOString(),
            type: 'charge',
            amount: debtAmount,
            note: note || 'Ghi nợ mới',
          },
        ],
        lastTransactionDate: new Date().toISOString(),
        status: 'unpaid',
      };
      memoryStore.debts.unshift(record);
    } else {
      record.totalDebt += debtAmount;
      record.history.unshift({
        date: new Date().toISOString(),
        type: 'charge',
        amount: debtAmount,
        note: note || 'Ghi nợ thêm',
      });
      record.status = 'unpaid';
      record.lastTransactionDate = new Date().toISOString();
    }

    return res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/debts/:id/repay - Record a debt repayment
router.post('/:id/repay', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, note } = req.body;
    const repayAmount = Number(amount) || 0;

    if (repayAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền trả nợ phải lớn hơn 0' });
    }

    if (isDbConnected) {
      const record = await CustomerDebtModel.findById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sổ nợ khách hàng' });
      }

      record.totalDebt = Math.max(0, record.totalDebt - repayAmount);
      record.history.unshift({
        date: new Date(),
        type: 'repayment',
        amount: repayAmount,
        note: note || 'Khách trả nợ',
      });
      record.status = record.totalDebt === 0 ? 'settled' : 'partial';
      record.lastTransactionDate = new Date();
      await record.save();

      return res.json({ success: true, data: record });
    }

    const record = memoryStore.debts.find((d) => d._id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sổ nợ khách hàng' });
    }

    record.totalDebt = Math.max(0, record.totalDebt - repayAmount);
    record.history.unshift({
      date: new Date().toISOString(),
      type: 'repayment',
      amount: repayAmount,
      note: note || 'Khách trả nợ',
    });
    record.status = record.totalDebt === 0 ? 'settled' : 'partial';
    record.lastTransactionDate = new Date().toISOString();

    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
