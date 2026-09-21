import mongoose from 'mongoose';

export let isDbConnected = false;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnb_erp';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error: any) {
    isDbConnected = false;
    console.warn(`[Database Warning] Could not connect to MongoDB at ${uri}.`);
    console.warn(`[Database Info] Running in Dev/Hybrid mode with fallback storage so the system remains fully functional.`);
  }
};
