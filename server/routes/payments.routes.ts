import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config';

export const paymentsRouter = Router();

function getRazorpayInstance(): Razorpay {
  const { keyId, keySecret } = config.razorpay;
  if (!keyId || !keySecret) {
    const error: any = new Error('Razorpay credentials missing');
    error.statusCode = 401;
    throw error;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order or POST /api/payments/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise
 */
paymentsRouter.post(['/create-order', '/orders'], async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount is present and is a number
    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required and must be an integer or number in paise.'
      });
    }

    // Minimum amount: 100 paise
    if (amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Minimum amount must be at least 100 paise (₹1.00).'
      });
    }

    let razorpay: Razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch (authErr: any) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed: Razorpay Key ID or Secret is not configured.'
      });
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount),
        currency: String(currency).toUpperCase(),
        receipt: String(orderReceipt).substring(0, 40),
        notes: notes || {}
      });

      return res.status(201).json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        id: order.id,
        receipt: order.receipt
      });
    } catch (apiErr: any) {
      console.error('❌ [Razorpay] Order creation error:', apiErr);
      const statusCode = apiErr.statusCode === 401 ? 401 : (apiErr.statusCode || 500);
      return res.status(statusCode).json({
        success: false,
        error: apiErr.error?.description || apiErr.message || 'Failed to create order on Razorpay API.'
      });
    }
  } catch (err: any) {
    console.error('❌ [Razorpay] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while processing order creation.'
    });
  }
});

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment or POST /api/payments/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
paymentsRouter.post(['/verify-payment', '/verify'], (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      order_id = razorpay_order_id,
      razorpay_payment_id,
      payment_id = razorpay_payment_id,
      razorpay_signature,
      signature = razorpay_signature
    } = req.body;

    // Missing fields: return 400
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields (order_id, payment_id, signature).'
      });
    }

    const keySecret = config.razorpay.keySecret;
    if (!keySecret) {
      return res.status(401).json({
        success: false,
        error: 'Razorpay secret key not configured on server.'
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(String(signature), 'utf-8');

    const isMatch =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    // Signature mismatch: return 400, do NOT mark as paid
    if (!isMatch) {
      console.warn(`⚠️ [Razorpay] Signature mismatch for order: ${order_id}`);
      return res.status(400).json({
        success: false,
        isVerified: false,
        error: 'Invalid payment signature. Verification failed.'
      });
    }

    console.log(`✅ [Razorpay] Payment verified successfully: order ${order_id}, payment ${payment_id}`);
    return res.status(200).json({
      success: true,
      isVerified: true,
      message: 'Payment signature verified successfully.',
      order_id,
      payment_id
    });
  } catch (err: any) {
    console.error('❌ [Razorpay] Payment verification error:', err);
    return res.status(400).json({
      success: false,
      isVerified: false,
      error: err.message || 'Failed to verify payment signature.'
    });
  }
});
