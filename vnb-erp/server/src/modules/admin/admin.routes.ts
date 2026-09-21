import { Router } from 'express';
import {
  getHqDashboard,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getAllTenants,
  renewSubscription,
  toggleTenantStatus,
  createTenantWithUser,
  deleteTenant,
} from './admin.controller.js';
import { requireAuth, requireRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all admin routes for superadmin only
router.use(requireAuth);
router.use(requireRoles(['superadmin']));

// Dashboard
router.get('/dashboard', getHqDashboard);

// Packages Management
router.get('/packages', getPackages);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Tenants & Customers Directory
router.get('/tenants', getAllTenants);
router.post('/tenants/renew', renewSubscription);
router.patch('/tenants/:id/toggle-status', toggleTenantStatus);
router.delete('/tenants/:id', deleteTenant);
router.post('/tenants/onboard', createTenantWithUser);

export default router;
