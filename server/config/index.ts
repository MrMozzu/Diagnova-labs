import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabase: {
    url: (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''),
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  },
  business: {
    freeCollectionThreshold: 500, // INR
    standardCollectionFee: 100, // INR
    expressSurcharge: 150, // INR
    maxSlotCapacity: 3, // Phlebotomists per slot/pincode
    bookingWindowDays: 30
  },
  notifications: {
    adminWhatsApp: (process.env.ADMIN_WHATSAPP_PHONE || '918217689128').replace(/[\s\-\+\(\)]/g, ''),
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || '"Diagnova Labs" <no-reply@diagnovalabs.com>'
    },
    whatsappWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL || ''
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || ''
  }
};
