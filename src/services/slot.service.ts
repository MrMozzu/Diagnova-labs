export interface SlotAvailabilityResult {
  isAvailable: boolean;
  remainingCapacity: number;
  reason?: string;
}

/**
 * Enterprise Phlebotomist Slot & Anti-Double-Booking Engine
 * Category 1 In-House Concurrency & Dispatch Engine
 */
export class SlotService {
  public static readonly MAX_SLOT_CAPACITY = 3; // Max simultaneous phlebotomists per pincode/slot

  public static readonly AVAILABLE_SLOTS = [
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

  /**
   * Validates if a scheduled date is valid and in the future
   */
  public static isValidBookingDate(dateStr: string): { isValid: boolean; error?: string } {
    if (!dateStr) {
      return { isValid: false, error: 'Scheduled date is required.' };
    }

    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      return { isValid: false, error: 'Invalid date format provided.' };
    }

    // Set time to start of day for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selected = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (selected < today) {
      return { isValid: false, error: 'Cannot schedule sample collection for past dates.' };
    }

    // Max 30 days ahead booking window
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    if (selected > maxDate) {
      return { isValid: false, error: 'Bookings can only be scheduled up to 30 days in advance.' };
    }

    return { isValid: true };
  }

  /**
   * Checks slot availability against simulated active reservation log
   */
  public static checkSlotAvailability(
    date: string,
    slot: string,
    pincode: string,
    existingBookings: { scheduledDate: string; scheduledSlot: string; patient?: { pincode?: string } }[]
  ): SlotAvailabilityResult {
    const dateCheck = this.isValidBookingDate(date);
    if (!dateCheck.isValid) {
      return { isAvailable: false, remainingCapacity: 0, reason: dateCheck.error };
    }

    // Count concurrent bookings for the exact date, slot, and neighborhood pincode
    const bookedCount = existingBookings.filter(b => 
      b.scheduledDate === date && 
      b.scheduledSlot === slot &&
      (!b.patient?.pincode || b.patient.pincode === pincode)
    ).length;

    const remaining = Math.max(0, this.MAX_SLOT_CAPACITY - bookedCount);

    if (remaining <= 0) {
      return {
        isAvailable: false,
        remainingCapacity: 0,
        reason: `Slot '${slot}' in area ${pincode} is fully booked. Please select an alternate time slot.`
      };
    }

    return {
      isAvailable: true,
      remainingCapacity: remaining
    };
  }
}
