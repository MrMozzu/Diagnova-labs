import { describe, it, expect } from 'vitest';
import { PricingService } from '../src/services/pricing.service';
import type { Booking, CartItem } from '../src/types';

describe('PricingService - In-House Security & Pricing Integrity Engine', () => {
  it('correctly calculates single test prices from authoritative catalog', () => {
    // Glucose test has price 120, mrp 200
    const result = PricingService.calculateTestPrice('test-glucose-fasting', 1);
    expect(result.price).toBe(120);
    expect(result.mrp).toBe(200);
    expect(result.discount).toBe(80);

    // 2 persons
    const multi = PricingService.calculateTestPrice('test-glucose-fasting', 2);
    expect(multi.price).toBe(240);
    expect(multi.mrp).toBe(400);
    expect(multi.discount).toBe(160);
  });

  it('correctly calculates package multi-person tier discounts', () => {
    // Full Body Checkup: 1p: 1999, 2p: 3599, 3p: 4999, 4p: 6199
    const tier1 = PricingService.calculatePackagePrice('pkg-healthy-india-2026', 1);
    expect(tier1.price).toBe(1999);
    expect(tier1.mrp).toBe(3499);

    const tier2 = PricingService.calculatePackagePrice('pkg-healthy-india-2026', 2);
    expect(tier2.price).toBe(3599);
    expect(tier2.mrp).toBe(6998);

    const tier4 = PricingService.calculatePackagePrice('pkg-healthy-india-2026', 4);
    expect(tier4.price).toBe(6199);
    expect(tier4.mrp).toBe(13996);
  });

  it('waives home sample collection fee when total exceeds threshold (₹500)', () => {
    const highValueCart: CartItem[] = [
      {
        id: 'c1',
        itemType: 'package',
        itemId: 'pkg-healthy-india-2026',
        name: 'Full Body Checkup',
        category: 'Checkup',
        price: 1999,
        mrp: 3499,
        persons: 1,
        fastingHours: 10
      }
    ];

    const totals = PricingService.calculateCartTotals(highValueCart, false);
    expect(totals.collectionFee).toBe(0); // Free collection
    expect(totals.totalAmount).toBe(1999);
  });

  it('charges standard collection fee (₹100) when order is below ₹500', () => {
    const lowValueCart: CartItem[] = [
      {
        id: 'c2',
        itemType: 'test',
        itemId: 'test-glucose-fasting',
        name: 'Glucose Fasting',
        category: 'Blood Tests',
        price: 120,
        mrp: 200,
        persons: 1,
        fastingHours: 10
      }
    ];

    const totals = PricingService.calculateCartTotals(lowValueCart, false);
    expect(totals.collectionFee).toBe(100);
    expect(totals.totalAmount).toBe(220); // 120 + 100
  });

  it('applies express slot surcharge (₹150) when express is selected', () => {
    const cart: CartItem[] = [
      {
        id: 'c3',
        itemType: 'package',
        itemId: 'pkg-healthy-india-2026',
        name: 'Full Body Checkup',
        category: 'Checkup',
        price: 1999,
        mrp: 3499,
        persons: 1,
        fastingHours: 10
      }
    ];

    const totals = PricingService.calculateCartTotals(cart, true);
    expect(totals.expressFee).toBe(150);
    expect(totals.totalAmount).toBe(1999 + 150);
  });

  it('SECURITY TEST: Flags and rejects ₹1 client price tampering exploit', () => {
    const tamperedBooking: Partial<Booking> = {
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      persons: 1,
      isExpress: false,
      totalAmount: 1 // Malicious user injected ₹1 in DevTools!
    };

    const verification = PricingService.verifyBookingIntegrity(tamperedBooking);
    expect(verification.isValid).toBe(false);
    expect(verification.tamperingDetected).toBe(true);
    expect(verification.errorMessage).toContain('Security Violation');
    expect(verification.verifiedFinancials.totalAmount).toBe(1999);
  });

  it('accepts legitimate bookings where client matches authoritative calculation', () => {
    const validBooking: Partial<Booking> = {
      itemType: 'package',
      itemId: 'pkg-healthy-india-2026',
      persons: 1,
      isExpress: false,
      totalAmount: 1999
    };

    const verification = PricingService.verifyBookingIntegrity(validBooking);
    expect(verification.isValid).toBe(true);
    expect(verification.tamperingDetected).toBe(false);
    expect(verification.verifiedFinancials.totalAmount).toBe(1999);
  });
});
