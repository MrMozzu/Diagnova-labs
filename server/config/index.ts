import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabase: {
    url: (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_PROJECT_URL ||
      ''
    ).trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''),
    anonKey: (
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ''
    ).trim()
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
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      user: process.env.SMTP_USER || 'diagnovalabs@gmail.com',
      pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
      from: process.env.SMTP_FROM || '"Diagnova Labs" <diagnovalabs@gmail.com>'
    },
    whatsappWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL || '',
    gmailRelayUrl: (
      process.env.GMAIL_RELAY_URL ||
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      process.env.GMAIL_WEBHOOK_URL ||
      ''
    ).trim(),
    gmailRelaySecret: (process.env.GMAIL_RELAY_SECRET || 'diagnova_secure_mail_key_2026').trim()
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || ''
  }
};
