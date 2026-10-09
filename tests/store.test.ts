import { describe, it, expect, beforeEach } from 'vitest';
import { store, safeStorage } from '../src/services/store';
import type { PatientInfo, CartItem } from '../src/types';

describe('AppStore - State Management & In-House Security Gateways', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  const validPatient: PatientInfo = {
    fullName: 'Ananya Deshmukh',
    phone: '9826055555',
    email: 'ananya@example.com',
    age: 29,
    gender: 'Female',
    address: 'B-12, Shalimar Heights, MP Nagar',
    city: 'Bhopal',
    pincode: '462011'
  };

  it('manages cart items correctly with person counts', () => {
    const item: CartItem = {
      id: 'cart-1',
      itemType: 'test',
      itemId: 'test-glucose-fasting',
      name: 'Glucose Fasting',
      category: 'Blood Tests',
      price: 120,
      mrp: 200,
      persons: 1,
      fastingHours: 10
    };

    const addRes = store.addToCart(item);
    expect(addRes.success).toBe(true);

    const cart = store.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].itemId).toBe('test-glucose-fasting');

    // Duplicate prevention
    const dupRes = store.addToCart(item);
    expect(dupRes.success).toBe(false);
    expect(dupRes.alreadyExists).toBe(true);

    // Removal
    store.removeFromCart('cart-1');
    expect(store.getCart().length).toBe(0);
  });

  it('INTEGRATION: Rejects booking if patient phone is invalid', async () => {
    const invalidPatient = { ...validPatient, phone: '00000' };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await expect(store.createBooking({
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      itemName: 'Full Body Checkup',
      persons: 1,
      scheduledDate: tomorrow.toISOString().split('T')[0],
      scheduledSlot: '07:00 AM - 08:00 AM (Fasting Preferred)',
      isExpress: false,
      baseAmount: 3499,
      discountAmount: 1500,
      collectionFee: 0,
      totalAmount: 1999,
      paymentMethod: 'cash_on_collection',
      paymentStatus: 'pending',
      patient: invalidPatient
    })).rejects.toThrow('Patient validation failed');
  });

  it('INTEGRATION: Rejects booking if client price tampering is detected', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await expect(store.createBooking({
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      itemName: 'Full Body Checkup',
      persons: 1,
      scheduledDate: tomorrow.toISOString().split('T')[0],
      scheduledSlot: '07:00 AM - 08:00 AM (Fasting Preferred)',
      isExpress: false,
      baseAmount: 3499,
      discountAmount: 3498,
      collectionFee: 0,
      totalAmount: 1, // Tampered ₹1 amount!
      paymentMethod: 'cash_on_collection',
      paymentStatus: 'pending',
      patient: validPatient
    })).rejects.toThrow('Security Violation');
  });

  it('INTEGRATION: Successfully persists valid booking with canonical amounts', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const booking = await store.createBooking({
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      itemName: 'Full Body Checkup',
      persons: 1,
      scheduledDate: dateStr,
      scheduledSlot: '07:00 AM - 08:00 AM (Fasting Preferred)',
      isExpress: false,
      baseAmount: 3499,
      discountAmount: 1500,
      collectionFee: 0,
      totalAmount: 1999, // Canonical price
      paymentMethod: 'cash_on_collection',
      paymentStatus: 'pending',
      patient: validPatient
    });

    expect(booking.id).toMatch(/^TBL-\d{6}$/);
    expect(booking.totalAmount).toBe(1999);
    expect(booking.status).toBe('confirmed');

    const stored = store.getLocalBookings();
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(booking.id);
  });
});
