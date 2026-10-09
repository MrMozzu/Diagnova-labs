import { ALL_TESTS } from '../../src/data/tests';
import { FEATURED_PACKAGES } from '../../src/data/packages';
import { config } from '../config';
import type { CartItem, Booking } from '../../src/types';

export interface ServerPricingCalculation {
  baseAmount: number;
  discountAmount: number;
  collectionFee: number;
  expressFee: number;
  totalAmount: number;
}

export class ServerPricingService {
  public static getTest(testId: string) {
    return ALL_TESTS.find(t => t.id === testId);
  }

  public static getPackage(pkgId: string) {
    return FEATURED_PACKAGES.find(p => p.id === pkgId);
  }

  public static calculateItem(itemType: 'test' | 'package', itemId: string, persons: number = 1) {
    if (itemType === 'package') {
      const pkg = this.getPackage(itemId);
      if (!pkg) throw new Error(`Package with ID '${itemId}' not found in authoritative catalog.`);
      const safePersons = Math.max(1, Math.min(persons, 4));
      const tier = pkg.pricing[safePersons];
      if (!tier) throw new Error(`Invalid tier for package '${itemId}' with ${safePersons} persons.`);
      return { price: tier.price, mrp: tier.mrp, discount: tier.mrp - tier.price };
    } else {
      const test = this.getTest(itemId);
      if (!test) throw new Error(`Test with ID '${itemId}' not found in authoritative catalog.`);
      const safePersons = Math.max(1, Math.min(persons, 10));
      const price = test.price * safePersons;
      const mrp = test.mrp * safePersons;
      return { price, mrp, discount: mrp - price };
    }
  }

  public static calculateCart(items: CartItem[], isExpress: boolean = false): ServerPricingCalculation {
    let baseAmount = 0;
    let sellingPrice = 0;

    for (const item of items) {
      const calc = this.calculateItem(item.itemType, item.itemId, item.persons);
      baseAmount += calc.mrp;
      sellingPrice += calc.price;
    }

    const discountAmount = Math.max(0, baseAmount - sellingPrice);
    const collectionFee = (sellingPrice >= config.business.freeCollectionThreshold || items.length === 0)
      ? 0
      : config.business.standardCollectionFee;

    const expressFee = isExpress ? config.business.expressSurcharge : 0;
    const totalAmount = sellingPrice + collectionFee + expressFee;

    return {
      baseAmount,
      discountAmount,
      collectionFee,
      expressFee,
      totalAmount
    };
  }

  public static verifyBooking(booking: Partial<Booking>): {
    isValid: boolean;
    serverCalculation: ServerPricingCalculation;
    errorMessage?: string;
  } {
    let serverCalc: ServerPricingCalculation;

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
      serverCalc = this.calculateCart(cartItems, !!booking.isExpress);
    } else if (booking.itemType === 'package' && booking.itemId) {
      const calc = this.calculateItem('package', booking.itemId, booking.persons || 1);
      const isExpress = !!booking.isExpress;
      const collectionFee = calc.price >= config.business.freeCollectionThreshold ? 0 : config.business.standardCollectionFee;
      const expressFee = isExpress ? config.business.expressSurcharge : 0;
      serverCalc = {
        baseAmount: calc.mrp,
        discountAmount: calc.discount,
        collectionFee,
        expressFee,
        totalAmount: calc.price + collectionFee + expressFee
      };
    } else if (booking.itemId) {
      const calc = this.calculateItem('test', booking.itemId, booking.persons || 1);
      const isExpress = !!booking.isExpress;
      const collectionFee = calc.price >= config.business.freeCollectionThreshold ? 0 : config.business.standardCollectionFee;
      const expressFee = isExpress ? config.business.expressSurcharge : 0;
      serverCalc = {
        baseAmount: calc.mrp,
        discountAmount: calc.discount,
        collectionFee,
        expressFee,
        totalAmount: calc.price + collectionFee + expressFee
      };
    } else {
      return {
        isValid: false,
        serverCalculation: { baseAmount: 0, discountAmount: 0, collectionFee: 0, expressFee: 0, totalAmount: 0 },
        errorMessage: 'Invalid booking items: Must specify test or package itemId.'
      };
    }

    const submittedTotal = booking.totalAmount !== undefined ? Number(booking.totalAmount) : 0;
    const diff = Math.abs(submittedTotal - serverCalc.totalAmount);

    if (diff > 1) {
      return {
        isValid: false,
        serverCalculation: serverCalc,
        errorMessage: `Security Exception: Submitted total amount ₹${submittedTotal} does not match authoritative catalog calculation ₹${serverCalc.totalAmount}.`
      };
    }

    return {
      isValid: true,
      serverCalculation: serverCalc
    };
  }
}
