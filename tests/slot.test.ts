import { describe, it, expect } from 'vitest';
import { SlotService } from '../src/services/slot.service';

describe('SlotService - Phlebotomist Slot Exclusivity & Anti-Double-Booking', () => {
  it('rejects booking dates in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const check = SlotService.isValidBookingDate(dateStr);
    expect(check.isValid).toBe(false);
    expect(check.error).toContain('Cannot schedule sample collection for past dates');
  });

  it('accepts today and valid future dates within 30 days', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(SlotService.isValidBookingDate(today).isValid).toBe(true);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    expect(SlotService.isValidBookingDate(nextWeekStr).isValid).toBe(true);
  });

  it('rejects dates beyond 30 days in advance', () => {
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 45);
    const farDateStr = farFuture.toISOString().split('T')[0];

    const check = SlotService.isValidBookingDate(farDateStr);
    expect(check.isValid).toBe(false);
    expect(check.error).toContain('30 days in advance');
  });

  it('allows booking when slot has remaining capacity', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const slot = '07:00 AM - 08:00 AM (Fasting Preferred)';
    const pincode = '462016';

    const existingBookings = [
      { scheduledDate: dateStr, scheduledSlot: slot, patient: { pincode } }
    ];

    const check = SlotService.checkSlotAvailability(dateStr, slot, pincode, existingBookings);
    expect(check.isAvailable).toBe(true);
    expect(check.remainingCapacity).toBe(SlotService.MAX_SLOT_CAPACITY - 1);
  });

  it('blocks booking when slot reaches maximum concurrent phlebotomist capacity', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const slot = '07:00 AM - 08:00 AM (Fasting Preferred)';
    const pincode = '462016';

    // Populate maximum capacity (3 bookings)
    const maxedBookings = Array(SlotService.MAX_SLOT_CAPACITY).fill(null).map(() => ({
      scheduledDate: dateStr,
      scheduledSlot: slot,
      patient: { pincode }
    }));

    const check = SlotService.checkSlotAvailability(dateStr, slot, pincode, maxedBookings);
    expect(check.isAvailable).toBe(false);
    expect(check.remainingCapacity).toBe(0);
    expect(check.reason).toContain('fully booked');
  });
});
