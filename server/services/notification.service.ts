import nodemailer from 'nodemailer';
import { config } from '../config';
import type { Booking } from '../../src/types';

export class NotificationService {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;

    const { smtp } = config.notifications;
    if (smtp.user && smtp.pass) {
      try {
        const isGmail = smtp.user.toLowerCase().includes('@gmail.com') || (smtp.host && smtp.host.includes('gmail'));
        const transportOpts: any = isGmail
          ? {
            service: 'gmail',
            auth: {
              user: smtp.user,
              pass: smtp.pass
            }
          }
          : {
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: {
              user: smtp.user,
              pass: smtp.pass
            }
          };

        this.transporter = nodemailer.createTransport(transportOpts);
        console.log(`📧 [NotificationService] SMTP Transporter initialized successfully (${isGmail ? 'Gmail Service' : smtp.host}).`);
      } catch (err) {
        console.warn('⚠️ [NotificationService] Failed to initialize SMTP transporter:', err);
      }
    }
    return this.transporter;
  }

  /**
   * Generates formatted WhatsApp text message for the admin (+91 8217689128)
   */
  public static formatWhatsAppMessage(booking: Booking): string {
    const isPaid = booking.paymentStatus === 'paid' || booking.paymentMethod === 'online_upi';
    const payModeText = booking.paymentMethod === 'online_upi'
      ? 'Online UPI (Verified Paid)'
      : booking.paymentMethod === 'online_card'
        ? 'Online Card (Verified Paid)'
        : 'Cash on Sample Collection (Pay on Visit)';

    return [
      `🚨 *NEW LAB BOOKING RECEIVED - DIAGNOVA LABS* 🚨`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📋 *Booking ID:* ${booking.id}`,
      `👤 *Patient Name:* ${booking.patient.fullName} (${booking.patient.gender}, ${booking.patient.age} yrs)`,
      `📞 *Mobile:* ${booking.patient.phone}`,
      `✉️ *Email:* ${booking.patient.email || 'Not provided'}`,
      ``,
      `🏥 *Test / Package:* ${booking.itemName}`,
      `👥 *Members:* ${booking.persons} Person${booking.persons > 1 ? 's' : ''}`,
      `📅 *Date:* ${booking.scheduledDate}`,
      `⏰ *Time Slot:* ${booking.scheduledSlot}${booking.isExpress ? ' ⚡ (60-Min Express)' : ''}`,
      `📍 *Address:* ${booking.patient.address}${booking.patient.landmark ? `, Near: ${booking.patient.landmark}` : ''}`,
      `🏙️ *City & PIN:* ${booking.patient.city} - ${booking.patient.pincode}`,
      ``,
      `💰 *Total Amount:* ₹${booking.totalAmount.toLocaleString('en-IN')}`,
      `💳 *Payment Method:* ${payModeText}`,
      `🧪 *Status:* Confirmed (Phlebotomist Required)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Action Required:* Assign phlebotomist for barcoded sample collection.`
    ].join('\n');
  }

  /**
   * Generates direct wa.me link for immediate admin notification
   */
  public static getWhatsAppDeepLink(booking: Booking): string {
    const phone = config.notifications.adminWhatsApp;
    const text = encodeURIComponent(this.formatWhatsAppMessage(booking));
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  }

  /**
   * Dispatches WhatsApp alert to Admin (+91 8217689128)
   */
  public static async sendAdminWhatsAppAlert(booking: Booking): Promise<{ success: boolean; link: string; method: string }> {
    const phone = config.notifications.adminWhatsApp;
    const message = this.formatWhatsAppMessage(booking);
    const deepLink = this.getWhatsAppDeepLink(booking);

    console.log(`\n📲 ============================================================`);
    console.log(`📲 [WHATSAPP ALERT] DISPATCHING TO ADMIN: +${phone}`);
    console.log(`📲 ============================================================`);
    console.log(message);
    console.log(`🔗 Direct WhatsApp Click: ${deepLink}`);
    console.log(`📲 ============================================================\n`);

    // If webhook URL is configured (e.g., Twilio, UltraMsg, Gupshup, or custom bot)
    if (config.notifications.whatsappWebhookUrl) {
      try {
        await fetch(config.notifications.whatsappWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            message,
            bookingId: booking.id,
            booking
          })
        });
        console.log(`✅ [NotificationService] WhatsApp webhook triggered successfully.`);
        return { success: true, link: deepLink, method: 'webhook' };
      } catch (webhookErr) {
        console.warn(`⚠️ [NotificationService] WhatsApp webhook call failed:`, webhookErr);
      }
    }

    return { success: true, link: deepLink, method: 'direct_link_logged' };
  }

  /**
   * Generates responsive, clinical HTML email template for the patient
   */
  public static generateEmailHtml(booking: Booking): string {
    const isPaid = booking.paymentStatus === 'paid' || booking.paymentMethod === 'online_upi';
    const payModeText = isPaid ? 'Online Paid (Confirmed)' : 'Cash on Collection (Pay on Visit)';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Diagnova Labs</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #1b449c 0%, #2563eb 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .brand-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .tagline { font-size: 13px; opacity: 0.9; margin-top: 4px; }
    .status-badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; margin-top: 14px; }
    .body { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .intro-text { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px; }
    .booking-id-box { background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .booking-id-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .booking-id-val { font-size: 22px; font-weight: 800; color: #1b449c; margin-top: 4px; }
    .card-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 14px; }
    .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1b449c; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 500; }
    .val { color: #0f172a; font-weight: 600; text-align: right; }
    .fasting-warning { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #92400e; margin-bottom: 24px; line-height: 1.5; }
    .total-row { border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: 800; color: #0f172a; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-name">DIAGNOVA LABS</h1>
      <div class="tagline">Better Diagnosis. Healthier Tomorrow.</div>
      <div class="status-badge">✓ ORDER CONFIRMED</div>
    </div>

    <div class="body">
      <div class="greeting">Dear ${booking.patient.fullName},</div>
      <p class="intro-text">
        Thank you for choosing Diagnova Labs. Your appointment for home sample collection has been confirmed with temperature-controlled cold-chain preservation.
      </p>

      <div class="booking-id-box">
        <div class="booking-id-label">Official Booking Reference</div>
        <div class="booking-id-val">${booking.id}</div>
      </div>

      <div class="card-section">
        <div class="card-title">Appointment &amp; Doorstep Details</div>
        <div class="row"><span class="label">Package / Test:</span><span class="val">${booking.itemName}</span></div>
        <div class="row"><span class="label">Patient Name:</span><span class="val">${booking.patient.fullName} (${booking.patient.gender}, ${booking.patient.age}y)</span></div>
        <div class="row"><span class="label">Registered Phone:</span><span class="val">${booking.patient.phone}</span></div>
        <div class="row"><span class="label">Date of Collection:</span><span class="val"><strong>${booking.scheduledDate}</strong></span></div>
        <div class="row"><span class="label">Time Window:</span><span class="val"><strong>${booking.scheduledSlot}</strong></span></div>
        <div class="row"><span class="label">Doorstep Address:</span><span class="val">${booking.patient.address}, ${booking.patient.city} (${booking.patient.pincode})</span></div>
      </div>

      <div class="fasting-warning">
        <strong>⚠️ Preparation Notice:</strong> Fasting of 10–12 hours overnight is recommended before morning blood draw. Drinking plain water is permitted. Our certified phlebotomist will arrive equipped with barcoded vacuum tubes.
      </div>

      <div class="card-section">
        <div class="card-title">Payment Summary</div>
        <div class="row"><span class="label">Item Base MRP:</span><span class="val">₹${booking.baseAmount.toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Package Discount:</span><span class="val" style="color: #10b981;">- ₹${booking.discountAmount.toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Home Collection Fee:</span><span class="val" style="color: #10b981;">FREE</span></div>
        <div class="row total-row">
          <span>Total Amount Payable:</span>
          <span style="color: #1b449c;">₹${booking.totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div class="row" style="margin-top: 8px;">
          <span class="label">Payment Mode:</span>
          <span class="val" style="color: #ea580c;">${payModeText}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Guaranteed digital reports delivered to your Email &amp; WhatsApp within 24 hours.</p>
      </div>
    </div>

    <div class="footer">
      <div>Diagnova Labs Ltd. · NABL &amp; ISO 9001 Certified Diagnostic Network</div>
      <div style="margin-top: 6px;">Need Help? Call Toll-Free 1800-8378-283 or reply to this email.</div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generates formatted Partner Lab & Operations Dispatch Ticket for diagnovalabs@gmail.com
   */
  public static generateDispatchTicketHtml(booking: Booking): string {
    const isPaid = booking.paymentStatus === 'paid' || booking.paymentMethod === 'online_upi';
    const cashDirective = isPaid
      ? 'DO NOT COLLECT CASH - PREPAID ONLINE (VERIFIED)'
      : `COLLECT INR ${booking.totalAmount.toLocaleString('en-IN')} IN CASH / UPI AT DOORSTEP`;
    const cashDirectiveColor = isPaid ? '#166534' : '#9a3412';
    const cashDirectiveBg = isPaid ? '#f0fdf4' : '#fff7ed';
    const cashDirectiveBorder = isPaid ? '#bbf7d0' : '#fed7aa';

    const plainTextSlip = [
      `DIAGNOVA PHLEBOTOMIST DISPATCH SLIP`,
      `Booking ID: ${booking.id}`,
      `Patient: ${booking.patient.fullName} (${booking.patient.gender}, ${booking.patient.age} yrs)`,
      `Phone: ${booking.patient.phone}`,
      `Address: ${booking.patient.address}${booking.patient.landmark ? ', Near ' + booking.patient.landmark : ''}`,
      `City & PIN: ${booking.patient.city} - ${booking.patient.pincode}`,
      `Test / Package: ${booking.itemName}`,
      `Date & Slot: ${booking.scheduledDate} | ${booking.scheduledSlot}`,
      `Directive: ${cashDirective}`
    ].join('\n');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partner Lab Dispatch Ticket - ${booking.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; }
    .header { background: #0f172a; padding: 24px; color: #ffffff; text-align: center; }
    .badge { display: inline-block; background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; }
    .title { font-size: 20px; font-weight: 800; margin: 8px 0 0 0; }
    .content { padding: 24px; }
    .directive-box { background: ${cashDirectiveBg}; border: 1.5px solid ${cashDirectiveBorder}; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; color: ${cashDirectiveColor}; font-weight: 700; font-size: 14px; text-align: center; }
    .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .label { color: #64748b; }
    .val { color: #0f172a; font-weight: 600; text-align: right; }
    .copy-box { background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin-top: 8px; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">OPERATIONS DISPATCH TICKET</div>
      <div class="title">Partner Lab Sample Collection Order</div>
      <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">Booking ID: ${booking.id}</div>
    </div>

    <div class="content">
      <div class="directive-box">
        PHLEBOTOMIST CASH DIRECTIVE: ${cashDirective}
      </div>

      <div class="section">
        <div class="section-title">Patient &amp; Doorstep Details</div>
        <div class="row"><span class="label">Patient Name:</span><span class="val">${booking.patient.fullName} (${booking.patient.gender}, ${booking.patient.age}y)</span></div>
        <div class="row"><span class="label">Mobile Phone:</span><span class="val"><a href="tel:${booking.patient.phone}" style="color: #2563eb;">${booking.patient.phone}</a></span></div>
        <div class="row"><span class="label">Email:</span><span class="val">${booking.patient.email || 'Not provided'}</span></div>
        <div class="row"><span class="label">Scheduled Date:</span><span class="val">${booking.scheduledDate}</span></div>
        <div class="row"><span class="label">Arrival Window:</span><span class="val">${booking.scheduledSlot}</span></div>
        <div class="row"><span class="label">Address:</span><span class="val">${booking.patient.address}${booking.patient.landmark ? ', Near ' + booking.patient.landmark : ''}</span></div>
        <div class="row"><span class="label">City &amp; PIN:</span><span class="val">${booking.patient.city} - ${booking.patient.pincode}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Clinical Order Summary</div>
        <div class="row"><span class="label">Test / Package:</span><span class="val">${booking.itemName}</span></div>
        <div class="row"><span class="label">Total Amount:</span><span class="val">INR ${booking.totalAmount.toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Payment Status:</span><span class="val">${isPaid ? 'Paid Online' : 'Pay on Collection'}</span></div>
        <div class="row"><span class="label">Assigned Phlebotomist:</span><span class="val">${booking.phlebotomist?.name || 'To Be Assigned'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Copy-Paste Dispatch Slip for Phlebotomist / Partner Lab</div>
        <div class="copy-box">${plainTextSlip}</div>
      </div>
    </div>

    <div class="footer">
      Diagnova Labs Operations Concierge · Automated Operations Notification
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Dispatches confirmation email to patient
   */
  public static async sendPatientConfirmationEmail(booking: Booking): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
    const toEmail = booking.patient.email;
    if (!toEmail) {
      console.log(`[NotificationService] Patient did not provide email for booking ${booking.id}, skipping email dispatch.`);
      return { success: false };
    }

    const html = this.generateEmailHtml(booking);
    const subject = `Booking Confirmation - ${booking.itemName} [${booking.id}] | Diagnova Labs`;
    const transporter = this.getTransporter();

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: config.notifications.smtp.from,
          to: toEmail,
          subject,
          html
        });
        console.log(`[NotificationService] Patient confirmation email dispatched to ${toEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        console.error(`[NotificationService] Error sending patient confirmation email via SMTP:`, err);
      }
    }

    console.log(`\n[EMAIL CONFIRMATION] DISPATCHED TO: ${toEmail}`);
    console.log(`[SUBJECT] ${subject}\n`);

    return { success: true, simulated: true };
  }

  /**
   * Dispatches Partner Lab Dispatch Ticket to Operations Team (diagnovalabs@gmail.com)
   */
  public static async sendOperationsDispatchEmail(booking: Booking): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
    const operationsEmail = config.notifications.smtp.user || 'diagnovalabs@gmail.com';
    const html = this.generateDispatchTicketHtml(booking);
    const subject = `[DISPATCH TICKET] New Booking ${booking.id} - ${booking.itemName} | ${booking.patient.city}`;
    const transporter = this.getTransporter();

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: config.notifications.smtp.from,
          to: operationsEmail,
          subject,
          html
        });
        console.log(`[NotificationService] Operations dispatch ticket sent to ${operationsEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        console.error(`[NotificationService] Error sending operations dispatch ticket via SMTP:`, err);
      }
    }

    console.log(`\n[OPERATIONS DISPATCH TICKET] DISPATCHED TO: ${operationsEmail}`);
    console.log(`[SUBJECT] ${subject}\n`);

    return { success: true, simulated: true };
  }

  /**
   * Dispatches Patient Email, Operations Dispatch Ticket, and Admin WhatsApp Alert concurrently
   */
  public static async dispatchBookingNotifications(booking: Booking): Promise<{
    email: { success: boolean; simulated?: boolean };
    operationsEmail: { success: boolean; simulated?: boolean };
    whatsapp: { success: boolean; link: string };
  }> {
    const [emailRes, opsRes, waRes] = await Promise.all([
      this.sendPatientConfirmationEmail(booking).catch(err => {
        console.warn('Patient email dispatch error:', err);
        return { success: false };
      }),
      this.sendOperationsDispatchEmail(booking).catch(err => {
        console.warn('Operations email dispatch error:', err);
        return { success: false };
      }),
      this.sendAdminWhatsAppAlert(booking).catch(err => {
        console.warn('WhatsApp alert dispatch error:', err);
        return { success: false, link: this.getWhatsAppDeepLink(booking) };
      })
    ]);

    return {
      email: emailRes,
      operationsEmail: opsRes,
      whatsapp: waRes
    };
  }
}
