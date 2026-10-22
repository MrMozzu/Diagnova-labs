import dotenv from 'dotenv';
dotenv.config();

import { NotificationService } from '../server/services/notification.service';
import type { Booking } from '../src/types';

async function testEmailDelivery() {
  console.log('🚀 [Test Script] Initializing live email & receipt delivery test...');

  const mockBooking: Booking = {
    id: `TBL-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    itemType: 'package',
    itemId: 'pkg-healthy-india-2026',
    itemName: 'Healthy India 2026 Full Body Checkup Advance Plus',
    persons: 1,
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledSlot: '06:30 AM - 07:30 AM (Express Morning)',
    isExpress: true,
    baseAmount: 3663,
    discountAmount: 2564,
    collectionFee: 0,
    totalAmount: 1099,
    paymentMethod: 'online_upi',
    paymentStatus: 'paid',
    status: 'confirmed',
    patient: {
      fullName: 'Aarav Singhania',
      phone: '9826012345',
      email: 'quantumfox20@gmail.com',
      age: 29,
      gender: 'Male',
      address: 'Penthouse 12-A, Green Valley Heights, E-8 Arera Colony',
      landmark: 'Near Shahpura Lake',
      city: 'Bhopal',
      pincode: '462016'
    },
    phlebotomist: {
      name: 'Dr. Rahul Verma (Certified Phlebotomist)',
      phone: '+91 98260 12345'
    }
  };

  console.log(`📦 [Test Script] Created simulated booking: ${mockBooking.id} for patient: ${mockBooking.patient.fullName}`);
  console.log(`📧 [Test Script] Sending official Diagnova confirmation email to: ${mockBooking.patient.email}...`);

  const result = await NotificationService.sendPatientConfirmationEmail(mockBooking);

  console.log('\n📊 [Test Script Result]:', JSON.stringify(result, null, 2));

  if (result.success && result.messageId) {
    console.log(`\n🎉 SUCCESS! Email delivered through Gmail SMTP.`);
    console.log(`📨 Message ID: ${result.messageId}`);
    console.log(`📬 Delivered to: quantumfox@gmail.com`);
  } else {
    console.error(`\n❌ Failed to send email or fell back to simulation.`);
  }

  // Also verify WhatsApp alert formatting for 8217689128
  const waResult = await NotificationService.sendAdminWhatsAppAlert(mockBooking);
  console.log('📲 Admin WhatsApp Link:', waResult.link);
}

testEmailDelivery().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
