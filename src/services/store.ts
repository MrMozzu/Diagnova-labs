import type { Booking, CallbackLead, PatientInfo, CartItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PricingService } from './pricing.service';
import { ValidationService } from './validation.service';
import { SlotService } from './slot.service';

const LOCAL_STORAGE_BOOKINGS_KEY = 'tbl_bookings_v1';
const LOCAL_STORAGE_CALLBACKS_KEY = 'tbl_callbacks_v1';
const LOCAL_STORAGE_CITY_KEY = 'tbl_selected_city_v1';
const LOCAL_STORAGE_CART_KEY = 'tbl_cart_v1';

/**
 * Isomorphic Safe Storage Engine
 * Category 1 Zero-Cost In-House Storage Abstraction
 * Gracefully operates across Browser LocalStorage, SSR, and Node/Vitest test environments.
 */
export class SafeStorage {
  private memory = new Map<string, string>();

  public getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        // Fallback to memory
      }
    }
    return this.memory.get(key) || null;
  }

  public setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Fallback to memory
      }
    }
    this.memory.set(key, value);
  }

  public removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {
        // Fallback to memory
      }
    }
    this.memory.delete(key);
  }

  public clear(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch {
        // Fallback to memory
      }
    }
    this.memory.clear();
  }
}

export const safeStorage = new SafeStorage();

class AppStore {
  private currentCity: string = 'Bhopal'; // Default matching theme reference image

  constructor() {
    const savedCity = safeStorage.getItem(LOCAL_STORAGE_CITY_KEY);
    if (savedCity) {
      this.currentCity = savedCity;
    }
  }

  public getCity(): string {
    return this.currentCity;
  }

  public setCity(city: string): void {
    this.currentCity = city;
    safeStorage.setItem(LOCAL_STORAGE_CITY_KEY, city);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('city-changed', { detail: { city } }));
    }
  }

  public async detectBrowserLocation(): Promise<{ city: string; coords?: { lat: number; lng: number } }> {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve({ city: this.currentCity });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Free client-side reverse geocoding
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              const detectedCity = data.city || data.locality || data.principalSubdivision || 'Bhopal';
              this.setCity(detectedCity);
              resolve({ city: detectedCity, coords: { lat, lng } });
              return;
            }
          } catch (e) {
            console.warn('Reverse geocode error, using default city approximation:', e);
          }

          // Geographic coordinate approximation for Indian metros if offline
          let approxCity = 'Bhopal';
          if (lat > 28.3 && lat < 28.9 && lng > 76.8 && lng < 77.5) approxCity = 'Delhi NCR';
          else if (lat > 18.8 && lat < 19.3 && lng > 72.7 && lng < 73.1) approxCity = 'Mumbai';
          else if (lat > 12.8 && lat < 13.2 && lng > 77.4 && lng < 77.8) approxCity = 'Bengaluru';
          else if (lat > 17.2 && lat < 17.6 && lng > 78.2 && lng < 78.6) approxCity = 'Hyderabad';
          else if (lat > 18.4 && lat < 18.7 && lng > 73.7 && lng < 74.0) approxCity = 'Pune';
          else if (lat > 22.6 && lat < 22.8 && lng > 75.8 && lng < 76.0) approxCity = 'Indore';
          else if (lat > 23.1 && lat < 23.4 && lng > 77.3 && lng < 77.6) approxCity = 'Bhopal';

          this.setCity(approxCity);
          resolve({ city: approxCity, coords: { lat, lng } });
        },
        (error) => {
          console.warn('Geolocation permission not granted or error:', error.message);
          resolve({ city: this.currentCity });
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    });
  }

  // --- CART MANAGEMENT ---
  public getCart(): CartItem[] {
    try {
      const data = safeStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addToCart(item: CartItem): { success: boolean; alreadyExists?: boolean } {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id || (c.itemId === item.itemId && c.persons === item.persons));
    if (existing) {
      return { success: false, alreadyExists: true };
    }
    cart.push(item);
    safeStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
    }
    return { success: true };
  }

  public removeFromCart(cartId: string): void {
    const cart = this.getCart().filter(c => c.id !== cartId);
    safeStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
    }
  }

  public isInCart(itemId: string): boolean {
    return this.getCart().some(c => c.itemId === itemId);
  }

  public clearCart(): void {
    safeStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: [] } }));
    }
  }

  // --- BOOKINGS ---
  public getLocalBookings(): Booking[] {
    try {
      const data = safeStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async getAllBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, patient:patients(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            createdAt: b.created_at,
            itemType: b.booking_type,
            itemId: b.item_id,
            itemName: b.item_name,
            persons: b.number_of_persons,
            scheduledDate: b.scheduled_date,
            scheduledSlot: b.scheduled_slot,
            isExpress: b.is_express,
            baseAmount: Number(b.base_amount),
            discountAmount: Number(b.discount_amount),
            collectionFee: Number(b.collection_fee),
            totalAmount: Number(b.total_amount),
            paymentMethod: b.payment_method,
            paymentStatus: b.payment_status,
            status: b.status,
            patient: {
              fullName: b.patient?.full_name || '',
              phone: b.patient?.phone || '',
              email: b.patient?.email || '',
              age: b.patient?.age || 0,
              gender: b.patient?.gender || 'Male',
              address: b.patient?.address || '',
              landmark: b.patient?.landmark || '',
              city: b.patient?.city || '',
              pincode: b.patient?.pincode || ''
            },
            phlebotomist: b.phlebotomist_name ? {
              name: b.phlebotomist_name,
              phone: b.phlebotomist_phone || ''
            } : undefined
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local bookings:', e);
      }
    }
    return this.getLocalBookings();
  }

  public async createBooking(params: {
    itemType: 'package' | 'test' | 'cart';
    itemId: string;
    itemName: string;
    items?: CartItem[];
    persons: number;
    scheduledDate: string;
    scheduledSlot: string;
    isExpress: boolean;
    baseAmount: number;
    discountAmount: number;
    collectionFee: number;
    totalAmount: number;
    paymentMethod: 'online_upi' | 'online_card' | 'cash_on_collection';
    paymentStatus: 'paid' | 'pending';
    patient: PatientInfo;
  }): Promise<Booking> {
    // 1. Patient Info Validation
    const validation = ValidationService.validatePatientInfo(params.patient);
    if (!validation.isValid) {
      const errList = Object.values(validation.errors).join(', ');
      throw new Error(`Patient validation failed: ${errList}`);
    }

    // 2. Slot Capacity & Date Validation
    const localBookings = this.getLocalBookings();
    const slotCheck = SlotService.checkSlotAvailability(
      params.scheduledDate,
      params.scheduledSlot,
      params.patient.pincode,
      localBookings
    );
    if (!slotCheck.isAvailable) {
      throw new Error(slotCheck.reason || 'Requested time slot is unavailable.');
    }

    // 3. In-House Price Integrity Verification (Prevent ₹1 Tampering)
    const verification = PricingService.verifyBookingIntegrity({
      itemType: params.itemType,
      itemId: params.itemId,
      items: params.items,
      persons: params.persons,
      isExpress: params.isExpress,
      totalAmount: params.totalAmount
    });
    if (!verification.isValid) {
      throw new Error(verification.errorMessage || 'Price verification failed. Tampering detected.');
    }

    // Use verified canonical amounts from authoritative catalog
    const safeBaseAmount = verification.verifiedFinancials.baseAmount;
    const safeDiscountAmount = verification.verifiedFinancials.discountAmount;
    const safeCollectionFee = verification.verifiedFinancials.collectionFee;
    const safeTotalAmount = verification.verifiedFinancials.totalAmount;

    // Generate official clinical booking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `TBL-${randomSuffix}`;

    const newBooking: Booking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      itemType: params.itemType,
      itemId: params.itemId,
      itemName: params.itemName,
      items: params.items,
      persons: params.persons,
      scheduledDate: params.scheduledDate,
      scheduledSlot: params.scheduledSlot,
      isExpress: params.isExpress,
      baseAmount: safeBaseAmount,
      discountAmount: safeDiscountAmount,
      collectionFee: safeCollectionFee,
      totalAmount: safeTotalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus,
      status: 'confirmed',
      patient: params.patient,
      phlebotomist: {
        name: 'Dr. Rahul Verma (Certified Phlebotomist)',
        phone: '+91 98260 12345'
      }
    };

    // Save locally
    const existing = this.getLocalBookings();
    existing.unshift(newBooking);
    safeStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(existing));

    // Async sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        // Insert patient first
        const { data: patientRecord } = await supabase
          .from('patients')
          .insert({
            full_name: params.patient.fullName,
            phone: params.patient.phone,
            email: params.patient.email,
            age: params.patient.age,
            gender: params.patient.gender,
            address: params.patient.address,
            landmark: params.patient.landmark || '',
            city: params.patient.city,
            pincode: params.patient.pincode
          })
          .select('id')
          .single();

        // Insert booking record
        await supabase
          .from('bookings')
          .insert({
            id: bookingId,
            patient_id: patientRecord?.id,
            booking_type: params.itemType,
            item_id: params.itemId,
            item_name: params.itemName,
            number_of_persons: params.persons,
            scheduled_date: params.scheduledDate,
            scheduled_slot: params.scheduledSlot,
            is_express: params.isExpress,
            base_amount: safeBaseAmount,
            discount_amount: safeDiscountAmount,
            collection_fee: safeCollectionFee,
            total_amount: safeTotalAmount,
            payment_method: params.paymentMethod,
            payment_status: params.paymentStatus,
            status: 'confirmed',
            phlebotomist_name: newBooking.phlebotomist?.name,
            phlebotomist_phone: newBooking.phlebotomist?.phone
          });
      } catch (err) {
        console.warn('Supabase booking sync error:', err);
      }
    }

    return newBooking;
  }

  public async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const list = this.getLocalBookings();
    const item = list.find(b => b.id === id);
    if (item) {
      item.status = status;
      safeStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(list));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bookings')
          .update({ status })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }
  }

  // --- CALLBACK LEADS ---
  public getLocalCallbacks(): CallbackLead[] {
    try {
      const data = safeStorage.getItem(LOCAL_STORAGE_CALLBACKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async createCallback(params: {
    customerName: string;
    phone: string;
    city: string;
    preferredTime: string;
    notes?: string;
  }): Promise<CallbackLead> {
    const newLead: CallbackLead = {
      id: `CB-${Date.now().toString(36).toUpperCase()}`,
      customerName: params.customerName,
      phone: params.phone,
      city: params.city || this.currentCity,
      preferredTime: params.preferredTime || 'Within 15 minutes',
      notes: params.notes,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    const existing = this.getLocalCallbacks();
    existing.unshift(newLead);
    safeStorage.setItem(LOCAL_STORAGE_CALLBACKS_KEY, JSON.stringify(existing));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('callbacks').insert({
          customer_name: params.customerName,
          phone: params.phone,
          city: params.city || this.currentCity,
          preferred_time: params.preferredTime,
          advisor_notes: params.notes,
          status: 'new'
        });
      } catch (err) {
        console.warn('Supabase callback sync error:', err);
      }
    }

    return newLead;
  }

  public async createCallbackLead(params: {
    name: string;
    phone: string;
    city: string;
    query?: string;
  }): Promise<CallbackLead> {
    return this.createCallback({
      customerName: params.name,
      phone: params.phone,
      city: params.city,
      preferredTime: 'Within 15 minutes',
      notes: params.query
    });
  }
}

export const store = new AppStore();
