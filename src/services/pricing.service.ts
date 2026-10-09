import type { CartItem, Booking } from '../types';
import { ALL_TESTS } from '../data/tests';
import { FEATURED_PACKAGES } from '../data/packages';

export interface VerifiedFinancials {
  baseAmount: number;
  discountAmount: number;
  collectionFee: number;
  expressFee: number;
  totalAmount: number;
}

export interface PriceVerificationResult {
  isValid: boolean;
  tamperingDetected: boolean;
  errorMessage?: string;
  verifiedFinancials: VerifiedFinancials;
}

/**
 * Enterprise Canonical Pricing & Fraud Prevention Engine
 * Recomputes all totals from authoritative catalog definitions.
 * Category 1 Zero-Cost In-House Security Service.
 */
export class PricingService {
  public static readonly FREE_COLLECTION_THRESHOLD = 500;
  public static readonly STANDARD_COLLECTION_FEE = 100;
  public static readonly EXPRESS_SURCHARGE = 150;

  /**
   * Look up authoritative item from catalog
   */
  public static getAuthoritativeTest(testId: string) {
    return ALL_TESTS.find(t => t.id === testId);
  }

  public static getAuthoritativePackage(pkgId: string) {
    return FEATURED_PACKAGES.find(p => p.id === pkgId);
  }

  /**
   * Authoritatively calculate price for an individual test
   */
  public static calculateTestPrice(testId: string, persons: number = 1): { price: number; mrp: number; discount: number } {
    const test = this.getAuthoritativeTest(testId);
    if (!test) {
      throw new Error(`Test with ID '${testId}' does not exist in authoritative catalog.`);
    }
    const safePersons = Math.max(1, Math.min(persons, 10));
    const price = test.price * safePersons;
    const mrp = test.mrp * safePersons;
    const discount = mrp - price;
    return { price, mrp, discount };
  }

  /**
   * Authoritatively calculate package price across 1, 2, 3, 4 persons tiers
   */
  public static calculatePackagePrice(packageId: string, persons: number = 1): { price: number; mrp: number; discount: number } {
    const pkg = this.getAuthoritativePackage(packageId);
    if (!pkg) {
      throw new Error(`Package with ID '${packageId}' does not exist in authoritative catalog.`);
    }
    const safePersons = Math.max(1, Math.min(persons, 4));
    const tier = pkg.pricing[safePersons];
    if (!tier) {
      throw new Error(`Invalid tier for package '${packageId}' with ${safePersons} persons.`);
    }
    const discount = tier.mrp - tier.price;
    return { price: tier.price, mrp: tier.mrp, discount };
  }

  /**
   * Authoritatively calculate cart totals
   */
  public static calculateCartTotals(cartItems: CartItem[], isExpress: boolean = false): VerifiedFinancials {
    let baseAmount = 0; // Total MRP
    let calculatedSellingPrice = 0; // Price to pay

    for (const item of cartItems) {
      if (item.itemType === 'package') {
        const canonical = this.calculatePackagePrice(item.itemId, item.persons);
        baseAmount += canonical.mrp;
        calculatedSellingPrice += canonical.price;
      } else {
        const canonical = this.calculateTestPrice(item.itemId, item.persons);
        baseAmount += canonical.mrp;
        calculatedSellingPrice += canonical.price;
      }
    }

    const discountAmount = Math.max(0, baseAmount - calculatedSellingPrice);
    
    // Sample collection fee waiver logic
    const collectionFee = (calculatedSellingPrice >= this.FREE_COLLECTION_THRESHOLD || cartItems.length === 0)
      ? 0
      : this.STANDARD_COLLECTION_FEE;

    const expressFee = isExpress ? this.EXPRESS_SURCHARGE : 0;
    const totalAmount = calculatedSellingPrice + collectionFee + expressFee;

    return {
      baseAmount,
      discountAmount,
      collectionFee,
      expressFee,
      totalAmount
    };
  }

  /**
   * Verifies the financial integrity of a submitted booking.
   * Compares client-submitted totals against canonical server calculation.
   * Rejects any client-side price tampering.
   */
  public static verifyBookingIntegrity(booking: Partial<Booking>): PriceVerificationResult {
    let verified: VerifiedFinancials;

    if (booking.itemType === 'cart' && booking.items && booking.items.length > 0) {
      const cartItems: CartItem[] = booking.items.map(i => ({
        id: i.id,
        itemType: i.itemType,
        itemId: i.id,
        name: i.name,
        category: 'Diagnostic',
        price: i.price,
        mrp: i.mrp,
        persons: i.persons,
        fastingHours: i.fastingHours
      }));
      verified = this.calculateCartTotals(cartItems, !!booking.isExpress);
    } else if (booking.itemType === 'package' && booking.itemId) {
      const canonical = this.calculatePackagePrice(booking.itemId, booking.persons || 1);
      const isExpress = !!booking.isExpress;
      const collectionFee = canonical.price >= this.FREE_COLLECTION_THRESHOLD ? 0 : this.STANDARD_COLLECTION_FEE;
      const expressFee = isExpress ? this.EXPRESS_SURCHARGE : 0;
      verified = {
        baseAmount: canonical.mrp,
        discountAmount: canonical.discount,
        collectionFee,
        expressFee,
        totalAmount: canonical.price + collectionFee + expressFee
      };
    } else if (booking.itemId) {
      const canonical = this.calculateTestPrice(booking.itemId, booking.persons || 1);
      const isExpress = !!booking.isExpress;
      const collectionFee = canonical.price >= this.FREE_COLLECTION_THRESHOLD ? 0 : this.STANDARD_COLLECTION_FEE;
      const expressFee = isExpress ? this.EXPRESS_SURCHARGE : 0;
      verified = {
        baseAmount: canonical.mrp,
        discountAmount: canonical.discount,
        collectionFee,
        expressFee,
        totalAmount: canonical.price + collectionFee + expressFee
      };
    } else {
      return {
        isValid: false,
        tamperingDetected: false,
        errorMessage: 'Invalid booking payload: Missing target test or package items.',
        verifiedFinancials: { baseAmount: 0, discountAmount: 0, collectionFee: 0, expressFee: 0, totalAmount: 0 }
      };
    }

    // Tamper detection: Check if client submitted amount diverges by more than 1 rupee
    const submittedTotal = booking.totalAmount !== undefined ? Number(booking.totalAmount) : 0;
    const diff = Math.abs(submittedTotal - verified.totalAmount);

    if (diff > 1) {
      return {
        isValid: false,
        tamperingDetected: true,
        errorMessage: `Security Violation: Submitted amount ₹${submittedTotal} does not match authoritative catalog calculation ₹${verified.totalAmount}.`,
        verifiedFinancials: verified
      };
    }

    return {
      isValid: true,
      tamperingDetected: false,
      verifiedFinancials: verified
    };
  }
}
