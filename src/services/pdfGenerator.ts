import type { Booking } from '../types';

export async function generateBookingReceiptPDF(booking: Booking): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [27, 68, 156]; // #1b449c deep ocean blue
  const accentColor = [226, 122, 63]; // #e27a3f warm orange
  const darkTextColor = [30, 41, 59];
  const mutedTextColor = [100, 116, 139];

  // Header Background Banner
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 45, 'F');

  // Top Accent Stripe
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 4, 'F');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TESTBUDDY LABS', 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('DIAGNOSTIC EXCELLENCE · NABL ACCREDITED LABS', 15, 26);

  doc.setFontSize(8);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('Helpline: 1800-8378-283 | support@testbuddylabs.com | www.testbuddylabs.com', 15, 32);

  // Booking Reference Box on Top Right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(130, 10, 65, 26, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('OFFICIAL BOOKING VOUCHER', 135, 16);

  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(booking.id, 135, 23);

  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const dateStr = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Issued: ${dateStr}`, 135, 29);

  // Section 1: Patient Information Grid
  let y = 55;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('PATIENT & APPOINTMENT DETAILS', 15, y);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y + 2, 195, y + 2);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Patient Name:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.patient.fullName} (${booking.patient.age} Yrs / ${booking.patient.gender})`, 50, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact Phone:', 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.patient.phone, 155, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Email Address:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.patient.email || 'Not provided', 50, y);

  doc.setFont('helvetica', 'bold');
  doc.text('City & Pincode:', 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.patient.city} - ${booking.patient.pincode}`, 155, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Collection Address:', 15, y);
  doc.setFont('helvetica', 'normal');
  const splitAddress = doc.splitTextToSize(booking.patient.address + (booking.patient.landmark ? ` (Landmark: ${booking.patient.landmark})` : ''), 140);
  doc.text(splitAddress, 50, y);

  y += (splitAddress.length * 5) + 6;

  // Section 2: Test & Sample Collection Schedule
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TEST & SAMPLE COLLECTION SCHEDULE', 15, y);
  doc.line(15, y + 2, 195, y + 2);

  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y - 4, 180, 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(booking.itemName, 20, y + 2);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Booking Type: ${booking.itemType.toUpperCase()} | Persons: ${booking.persons} Member(s)`, 20, y + 8);
  doc.text(`Collection Slot: ${booking.scheduledDate} at ${booking.scheduledSlot} ${booking.isExpress ? '(60-MIN EXPRESS)' : ''}`, 20, y + 13);

  y += 24;

  // Section 3: Billing & Payment Receipt
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('PAYMENT RECEIPT & INVOICE', 15, y);
  doc.line(15, y + 2, 195, y + 2);

  y += 9;
  // Table Header
  doc.setFillColor(27, 68, 156);
  doc.rect(15, y - 3, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', 20, y + 1.5);
  doc.text('PERSONS', 110, y + 1.5);
  doc.text('PAYMENT MODE', 135, y + 1.5);
  doc.text('AMOUNT', 175, y + 1.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  if (booking.items && booking.items.length > 0) {
    booking.items.forEach(item => {
      const itemTitle = item.name.length > 40 ? item.name.substring(0, 38) + '...' : item.name;
      doc.text(itemTitle, 20, y);
      doc.text(`${item.persons}`, 115, y);
      doc.text(booking.paymentMethod === 'cash_on_collection' ? 'Cash on Visit' : 'Online Prepaid', 135, y);
      doc.text(`Rs. ${item.price.toLocaleString('en-IN')}`, 175, y);
      y += 6;
    });
  } else {
    doc.text(booking.itemName, 20, y);
    doc.text(`${booking.persons}`, 115, y);
    doc.text(booking.paymentMethod === 'cash_on_collection' ? 'Cash on Visit' : 'Online Prepaid', 135, y);
    doc.text(`Rs. ${booking.baseAmount.toLocaleString('en-IN')}`, 175, y);
    y += 6;
  }

  if (booking.discountAmount > 0) {
    y += 6;
    doc.setTextColor(34, 197, 94);
    doc.text('Special Bundle & Promotional Discount', 20, y);
    doc.text('-', 115, y);
    doc.text('Applied', 135, y);
    doc.text(`- Rs. ${booking.discountAmount.toLocaleString('en-IN')}`, 175, y);
  }

  y += 6;
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Home Sample Collection & Cold-Chain Transit', 20, y);
  doc.text('1 Visit', 110, y);
  doc.text('Complimentary', 135, y);
  doc.text('FREE', 175, y);

  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, 195, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TOTAL AMOUNT PAYABLE:', 110, y);
  doc.setFontSize(11);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`Rs. ${booking.totalAmount.toLocaleString('en-IN')}`, 173, y);

  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(booking.paymentStatus === 'paid' ? 34 : 226, booking.paymentStatus === 'paid' ? 197 : 122, booking.paymentStatus === 'paid' ? 94 : 63);
  doc.text(`Status: ${booking.paymentStatus === 'paid' ? 'PAID ONLINE (VERIFIED)' : 'PAYABLE TO PHLEBOTOMIST AT TIME OF SAMPLE COLLECTION'}`, 110, y);

  // Section 4: Clinical Fasting & Sample Preparation Instructions
  y += 18;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, y, 180, 30, 2, 2, 'FD');
  doc.setDrawColor(245, 158, 11);
  doc.rect(15, y, 3, 30, 'F'); // Warning stripe

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('IMPORTANT PRE-TEST CLINICAL INSTRUCTIONS', 22, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(69, 26, 3);
  doc.text('• Fasting Requirement: If your test requires fasting, maintain 10-12 hours of water-only intake overnight.', 22, y + 13);
  doc.text('• Phlebotomist Arrival: Our certified technician will sanitize in front of you and use fresh, barcoded vacuum tubes.', 22, y + 18);
  doc.text('• Smart Lab Report: Official color-coded digital report will be sent directly via WhatsApp & Email once verified by pathologist.', 22, y + 23);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 275, 195, 275);
  doc.setFontSize(7);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('TestBuddyLabs Health Services Pvt. Ltd. · NABL Accredited · Barcoded Cold-Chain Logistics', 15, 281);
  doc.text('For rescheduling or inquiries, call toll-free: 1800-8378-283 or WhatsApp: +91 98260 12345', 15, 285);

  // Trigger browser download
  doc.save(`TestBuddyLabs-Receipt-${booking.id}.pdf`);
}
