import { db } from './database.service';
import { config } from '../config';

export class ServerSlotService {
  public static readonly DEFAULT_SLOTS = [
    '06:00 AM - 07:00 AM (Early Fasting)',
    '07:00 AM - 08:00 AM (Fasting Preferred)',
    '08:00 AM - 09:00 AM (Fasting Preferred)',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM (Post-Prandial)',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM (Evening)'
  ];

  public static validateDate(dateStr: string): { isValid: boolean; error?: string } {
    if (!dateStr) return { isValid: false, error: 'Scheduled date is required.' };
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return { isValid: false, error: 'Invalid scheduled date format (YYYY-MM-DD).' };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selected = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    if (selected < today) return { isValid: false, error: 'Cannot book sample collection in the past.' };

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + config.business.bookingWindowDays);
    if (selected > maxDate) {
      return { isValid: false, error: `Bookings can only be scheduled up to ${config.business.bookingWindowDays} days in advance.` };
    }

    return { isValid: true };
  }

  public static async getSlotAvailability(date: string, pincode: string) {
    const dateCheck = this.validateDate(date);
    if (!dateCheck.isValid) {
      throw new Error(dateCheck.error);
    }

    const bookings = await db.getBookings();
    const activeBookings = bookings.filter(b => b.status !== 'cancelled');

    return this.DEFAULT_SLOTS.map(slot => {
      const bookedCount = activeBookings.filter(b => 
        b.scheduledDate === date && 
        b.scheduledSlot === slot &&
        (!b.patient?.pincode || b.patient.pincode === pincode)
      ).length;

      const remaining = Math.max(0, config.business.maxSlotCapacity - bookedCount);
      return {
        slot,
        totalCapacity: config.business.maxSlotCapacity,
        bookedCount,
        remainingCapacity: remaining,
        isAvailable: remaining > 0
      };
    });
  }

  public static async isSlotAvailable(date: string, slot: string, pincode: string): Promise<boolean> {
    const slots = await this.getSlotAvailability(date, pincode);
    const target = slots.find(s => s.slot === slot);
    return target ? target.isAvailable : false;
  }
}
