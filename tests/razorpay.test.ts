import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../server/app';
import { config } from '../server/config';
import type { Express } from 'express';

describe('Razorpay Standard Web Checkout - API Integration Suite', () => {
  let app: Express;
  const testKeySecret = config.razorpay.keySecret || '3rPJmsbewtftm7cOnXZTa6TG';

  beforeAll(() => {
    app = createApp();
  });

  describe('STEP 1: POST /api/create-order', () => {
    it('returns 400 if amount is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/create-order')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Amount is required');
    });

    it('returns 400 if amount is less than 100 paise (< ₹1.00)', async () => {
      const res = await request(app)
        .post('/api/create-order')
        .send({ amount: 50 }); // 50 paise is below minimum 100 paise

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('at least 100 paise');
    });

    it('creates a Razorpay order with valid amount and returns order_id, amount, currency', async () => {
      const testAmountPaise = 109900; // ₹1,099
      const res = await request(app)
        .post('/api/create-order')
        .send({
          amount: testAmountPaise,
          currency: 'INR',
          receipt: 'test_rcpt_101'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order_id).toBeDefined();
      expect(res.body.order_id).toMatch(/^order_/);
      expect(res.body.amount).toBe(testAmountPaise);
      expect(res.body.currency).toBe('INR');
    });

    it('supports alternative endpoint path /api/payments/create-order', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({
          amount: 50000,
          currency: 'INR',
          receipt: 'alt_path_test'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order_id).toBeDefined();
      expect(res.body.amount).toBe(50000);
    });
  });

  describe('STEP 3: POST /api/verify-payment', () => {
    it('returns 400 if required verification fields are missing', async () => {
      const res = await request(app)
        .post('/api/verify-payment')
        .send({
          order_id: 'order_test_123'
          // payment_id and signature missing
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Missing required payment verification fields');
    });

    it('returns 400 when signature does not match (tampering / invalid signature)', async () => {
      const orderId = 'order_fake_12345';
      const paymentId = 'pay_fake_67890';
      const forgedSignature = 'forged_signature_0000000000000000000000000000000000000000';

      const res = await request(app)
        .post('/api/verify-payment')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: forgedSignature
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.isVerified).toBe(false);
      expect(res.body.error).toContain('Invalid payment signature');
    });

    it('returns 200 and verifies payment when signature matches HMAC-SHA256(order_id|payment_id, KEY_SECRET)', async () => {
      const orderId = 'order_authentic_1001';
      const paymentId = 'pay_authentic_2002';

      // Compute authentic signature
      const validSignature = crypto
        .createHmac('sha256', testKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const res = await request(app)
        .post('/api/verify-payment')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: validSignature
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isVerified).toBe(true);
      expect(res.body.message).toContain('Payment signature verified successfully');
      expect(res.body.order_id).toBe(orderId);
      expect(res.body.payment_id).toBe(paymentId);
    });

    it('supports alternative endpoint path /api/payments/verify-payment', async () => {
      const orderId = 'order_alt_555';
      const paymentId = 'pay_alt_777';

      const validSignature = crypto
        .createHmac('sha256', testKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const res = await request(app)
        .post('/api/payments/verify-payment')
        .send({
          order_id: orderId,
          payment_id: paymentId,
          signature: validSignature
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isVerified).toBe(true);
    });
  });
});
