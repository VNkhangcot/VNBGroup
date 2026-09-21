import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tenantRoutes from './modules/tenant/tenant.routes.js';
import productRoutes from './modules/products/product.routes.js';
import posRoutes from './modules/pos/pos.routes.js';
import debtRoutes from './modules/debts/debt.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      system: 'VNB Business OS API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Module Endpoints
  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/tenant', tenantRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/pos', posRoutes);
  app.use('/api/debts', debtRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Server Error]', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
};
