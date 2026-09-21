import { Router, Request, Response } from 'express';
import { TenantModel } from './tenant.model.js';
import { isDbConnected } from '../../config/db.js';
import { memoryStore } from '../../config/memoryStore.js';

const router = Router();

// GET /api/tenant - Get store settings & active modules
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      let tenant = await TenantModel.findOne();
      if (!tenant) {
        const { _id, ...tenantData } = memoryStore.tenant;
        tenant = await TenantModel.create(tenantData);
      }
      return res.json({ success: true, data: tenant });
    }
    return res.json({ success: true, data: memoryStore.tenant });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/tenant - Update store settings & active modules
router.put('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, address, mode, activeModules, vietqrConfig, receiptFooterNote } = req.body;

    if (isDbConnected) {
      const updated = await TenantModel.findOneAndUpdate(
        {},
        { name, phone, address, mode, activeModules, vietqrConfig, receiptFooterNote },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: updated });
    }

    // Memory store fallback
    memoryStore.tenant = {
      ...memoryStore.tenant,
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(mode && { mode }),
      ...(activeModules && { activeModules }),
      ...(vietqrConfig && { vietqrConfig }),
      ...(receiptFooterNote && { receiptFooterNote }),
    };

    return res.json({ success: true, data: memoryStore.tenant });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
