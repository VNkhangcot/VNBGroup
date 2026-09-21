import { Router } from 'express';
import {
  register,
  login,
  pinLogin,
  getMe,
  getStaffList,
  createStaff,
} from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/pin-login', pinLogin);
router.get('/staff', getStaffList);

// Protected routes
router.get('/me', requireAuth, getMe);
router.post('/staff', requireAuth, createStaff);

export default router;
