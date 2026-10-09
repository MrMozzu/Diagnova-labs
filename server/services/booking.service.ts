import { db } from './database.service';
import { ServerPricingService } from './pricing.service';
import { ServerSlotService } from './slot.service';
import { AppError } from '../middleware/errorHandler';
import type { Booking, PatientInfo, CartItem } from '../../src/types';

export interface CreateBookingDTO {
  itemType: 'package' | 'test' | 'cart';
  itemId: string;
  itemName: string;
  items?: CartItem[];
  persons: number;
  scheduledDate: string;
  scheduledSlot: string;
  isExpress: boolean;
  baseAmount?: number;
  discountAmount?: number;
  collectionFee?: number;
  totalAmount?: number;
  paymentMethod: 'online_upi' | 'online_card' | 'cash_on_collection';
  patient: PatientInfo;
}

export class ServerBookingService {
  public static validatePatient(p: PatientInfo) {
    if (!p.fullName || p.fullName.trim().length < 2) {
      throw new AppError('Patient full name must be at least 2 characters.', 422, 'VALIDATION_FAILED');
    }
    const cleanPhone = (p.phone || '').replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new AppError('Valid 10-digit Indian mobile number starting with 6-9 is required.', 422, 'VALIDATION_FAILED');
    }
    if (p.age === undefined || isNaN(p.age) || p.age < 0 || p.age > 125) {
      throw new AppError('Age must be between 0 and 125.', 422, 'VALIDATION_FAILED');
    }
    if (!['Male', 'Female', 'Other'].includes(p.gender)) {
      throw new AppError('Gender must be Male, Female, or Other.', 422, 'VALIDATION_FAILED');
    }
    if (!p.address || p.address.trim().length < 5) {
      throw new AppError('Home address must be at least 5 characters.', 422, 'VALIDATION_FAILED');
    }
    if (!p.pincode || !/^[1-9][0-9]{5}$/.test(p.pincode.trim())) {
      throw new AppError('A valid 6-digit Indian PIN code is required.', 422, 'VALIDATION_FAILED');
    }
  }

  public static async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    // 1. Validate Patient Info
    this.validatePatient(dto.patient);

    // 2. Validate Date & Slot Availability
    const isAvailable = await ServerSlotService.isSlotAvailable(
      dto.scheduledDate,
      dto.scheduledSlot,
      dto.patient.pincode
    );
    if (!isAvailable) {
      throw new AppError(
        `Selected time slot '${dto.scheduledSlot}' is fully booked for area ${dto.patient.pincode}. Please choose another slot.`,
        409,
        'SLOT_UNAVAILABLE'
      );
    }

    // 3. Authoritative Server Pricing Verification (Stops ₹1 client tampering)
    const verification = ServerPricingService.verifyBooking({
      itemType: dto.itemType,
      itemId: dto.itemId,
      items: dto.items,
      persons: dto.persons,
      isExpress: dto.isExpress,
      totalAmount: dto.totalAmount
    });

    if (!verification.isValid) {
      throw new AppError(
        verification.errorMessage || 'Price verification failed. Submitted amount does not match catalog.',
        400,
        'PRICE_TAMPERING_DETECTED'
      );
    }

    // 4. Construct Immutable Server-Authoritative Booking Record
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `TBL-${randomSuffix}`;

    const newBooking: Booking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      itemType: dto.itemType,
      itemId: dto.itemId,
      itemName: dto.itemName,
      items: dto.items,
      persons: dto.persons,
      scheduledDate: dto.scheduledDate,
      scheduledSlot: dto.scheduledSlot,
      isExpress: dto.isExpress,
      baseAmount: verification.serverCalculation.baseAmount,
      discountAmount: verification.serverCalculation.discountAmount,
      collectionFee: verification.serverCalculation.collectionFee,
      totalAmount: verification.serverCalculation.totalAmount,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === 'cash_on_collection' ? 'pending' : 'paid',
      status: 'confirmed',
      patient: {
        fullName: dto.patient.fullName.trim(),
        phone: dto.patient.phone.trim(),
        email: (dto.patient.email || '').trim(),
        age: Number(dto.patient.age),
        gender: dto.patient.gender,
        address: dto.patient.address.trim(),
        landmark: (dto.patient.landmark || '').trim(),
        city: dto.patient.city || 'Bhopal',
        pincode: dto.patient.pincode.trim()
      },
      phlebotomist: {
        name: 'Dr. Rahul Verma (Certified Phlebotomist)',
        phone: '+91 98260 12345'
      }
    };

    // 5. Persist to Database
    await db.insertBooking(newBooking);

    return newBooking;
  }

  public static async getBookingById(id: string): Promise<Booking> {
    const booking = await db.getBookingById(id);
    if (!booking) {
      throw new AppError(`Booking '${id}' not found.`, 404, 'NOT_FOUND');
    }
    return booking;
  }

  public static async listBookings(): Promise<Booking[]> {
    return db.getBookings();
  }

  public static async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    const updated = await db.updateBookingStatus(id, status);
    if (!updated) {
      throw new AppError(`Booking '${id}' not found.`, 404, 'NOT_FOUND');
    }
    return updated;
  }
}
