import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabase: {
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  },
  business: {
    freeCollectionThreshold: 500, // INR
    standardCollectionFee: 100, // INR
    expressSurcharge: 150, // INR
    maxSlotCapacity: 3, // Phlebotomists per slot/pincode
    bookingWindowDays: 30
  }
};
