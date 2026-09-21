import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 VNB Business OS Backend Service`);
    console.log(`📡 Listening on: http://localhost:${PORT}`);
    console.log(`📦 Architecture: Modular Monolith (Express + MongoDB)`);
    console.log(`⚡ POS & VietQR API Ready at /api/pos`);
    console.log(`=======================================================`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
