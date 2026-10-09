import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/app';
import { db } from '../server/services/database.service';
import type { Express } from 'express';

describe('Enterprise Backend API - Full Stack Integration Suite', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
    db.clearAll();
  });

  afterAll(() => {
    db.clearAll();
  });

  describe('Health & Observability', () => {
    it('GET /api/health returns 200 OK with system telemetry', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('HEALTHY');
      expect(res.body.service).toBe('TestBuddyLabs-Diagnova-API');
      expect(res.body.memoryUsageMB).toBeDefined();
    });
  });

  describe('Catalog & Inventory API', () => {
    it('GET /api/tests returns tests with pagination', async () => {
      const res = await request(app).get('/api/tests?page=1&pageSize=4');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(4);
      expect(res.body.data.total).toBeGreaterThan(0);
    });

    it('GET /api/tests/:idOrSlug returns specific test details', async () => {
      const res = await request(app).get('/api/tests/test-glucose-fasting');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toContain('Glucose');
    });

    it('GET /api/tests/unknown-id returns 404 NOT_FOUND', async () => {
      const res = await request(app).get('/api/tests/non-existent-test-id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('GET /api/packages returns packages list', async () => {
      const res = await request(app).get('/api/packages');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/cities returns serviceable cities', async () => {
      const res = await request(app).get('/api/cities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((c: any) => c.name === 'Bhopal')).toBe(true);
    });
  });

  describe('Hyperlocal Pincode & Smart Lab Detection API', () => {
    it('GET /api/pincode/462016 returns 60-min express tier with nearest lab', async () => {
      const res = await request(app).get('/api/pincode/462016');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isServiceable).toBe(true);
      expect(res.body.data.serviceTier).toBe('express_60min');
      expect(res.body.data.city).toBe('Bhopal');
      expect(res.body.data.nearestLab).toContain('MP Nagar');
    });

    it('GET /api/pincode/799001 returns unserviceable status for out-of-network area', async () => {
      const res = await request(app).get('/api/pincode/799001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isServiceable).toBe(false);
      expect(res.body.data.serviceTier).toBe('unserviceable');
      expect(res.body.data.badgeColor).toBe('red');
    });

    it('GET /api/pincode/invalid-pin returns 422 validation error', async () => {
      const res = await request(app).get('/api/pincode/123');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_PINCODE_FORMAT');
    });
  });

  describe('Server Pricing & Fraud Engine', () => {
    it('POST /api/pricing/calculate calculates canonical cart total', async () => {
      const payload = {
        items: [
          {
            id: 'c1',
            itemType: 'package',
            itemId: 'pkg-healthy-india-2026',
            name: 'Full Body Checkup',
            category: 'Package',
            price: 1999,
            mrp: 3499,
            persons: 1,
            fastingHours: 10
          }
        ],
        isExpress: true
      };

      const res = await request(app).post('/api/pricing/calculate').send(payload);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.collectionFee).toBe(0); // >= 500 threshold
      expect(res.body.data.expressFee).toBe(150);
      expect(res.body.data.totalAmount).toBe(1999 + 150);
    });
  });

  describe('Phlebotomist Slot Availability', () => {
    it('GET /api/slots/availability returns time slots with capacity', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const res = await request(app).get(`/api/slots/availability?date=${dateStr}&pincode=462016`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slots.length).toBeGreaterThan(0);
      expect(res.body.data.slots[0].isAvailable).toBe(true);
    });
  });

  describe('Transactional Bookings API', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const validBookingPayload = {
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      itemName: 'Full Body Checkup',
      persons: 1,
      scheduledDate: dateStr,
      scheduledSlot: '07:00 AM - 08:00 AM (Fasting Preferred)',
      isExpress: false,
      totalAmount: 1999, // Canonical price
      paymentMethod: 'cash_on_collection',
      patient: {
        fullName: 'Vikramaditya Rao',
        phone: '9826011111',
        email: 'vikram@example.com',
        age: 42,
        gender: 'Male',
        address: 'Villa 14, Windsor Park, Kolar Road',
        city: 'Bhopal',
        pincode: '462042'
      }
    };

    it('rejects booking when client attempts ₹1 price tampering', async () => {
      const tampered = { ...validBookingPayload, totalAmount: 1 };
      const res = await request(app).post('/api/bookings').send(tampered);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PRICE_TAMPERING_DETECTED');
    });

    it('rejects booking when patient phone number is invalid', async () => {
      const invalidPhone = {
        ...validBookingPayload,
        patient: { ...validBookingPayload.patient, phone: '123' }
      };
      const res = await request(app).post('/api/bookings').send(invalidPhone);

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('successfully creates booking with canonical server amounts', async () => {
      const res = await request(app).post('/api/bookings').send(validBookingPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^TBL-\d{6}$/);
      expect(res.body.data.totalAmount).toBe(1999);
      expect(res.body.data.status).toBe('confirmed');

      const createdId = res.body.data.id;

      // Verify retrieval by ID
      const getRes = await request(app).get(`/api/bookings/${createdId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.id).toBe(createdId);

      // Verify status update
      const patchRes = await request(app)
        .patch(`/api/bookings/${createdId}/status`)
        .send({ status: 'sample_collected' });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.status).toBe('sample_collected');
    });

    it('supports Idempotency-Key header to prevent duplicate orders', async () => {
      const idempotencyKey = `idemp-${Date.now()}`;
      const payload = {
        ...validBookingPayload,
        patient: { ...validBookingPayload.patient, phone: '9826022222' }
      };

      // First call
      const res1 = await request(app)
        .post('/api/bookings')
        .set('X-Idempotency-Key', idempotencyKey)
        .send(payload);

      expect(res1.status).toBe(201);
      const bookingId1 = res1.body.data.id;

      // Second identical call with same idempotency key
      const res2 = await request(app)
        .post('/api/bookings')
        .set('X-Idempotency-Key', idempotencyKey)
        .send(payload);

      expect(res2.status).toBe(201);
      expect(res2.headers['x-cache-lookup']).toBe('HIT');
      expect(res2.body.data.id).toBe(bookingId1);
    });
  });

  describe('Consultation Callbacks API', () => {
    it('POST /api/callbacks creates callback lead and GET /api/callbacks retrieves it', async () => {
      const res = await request(app).post('/api/callbacks').send({
        customerName: 'Pooja Verma',
        phone: '9826033333',
        city: 'Indore',
        notes: 'Needs help selecting senior citizen profile'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^CB-/);

      const listRes = await request(app).get('/api/callbacks');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.some((c: any) => c.customerName === 'Pooja Verma')).toBe(true);
    });
  });
});
