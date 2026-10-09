import type { Booking, CallbackLead, PatientInfo, CartItem, TestItem, PackageItem } from '../types';
import { lookupPincode, isValidPincodeFormat, type PincodeLookupResponse } from '../data/pincodes';

const API_BASE = '/api';

export class ApiClient {
  private static async requestJson(url: string, init?: RequestInit, defaultErrorMessage = 'Server request failed'): Promise<any> {
    const res = await fetch(url, init);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`${defaultErrorMessage} (Service returned non-JSON response)`);
    }
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error?.message || body.message || defaultErrorMessage);
    }
    return body;
  }

  public static async checkHealth(): Promise<{ status: string; uptimeSeconds: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Backend not running locally
    }
    return null;
  }

  public static async fetchTests(params?: { q?: string; category?: string; page?: number; pageSize?: number }): Promise<{ success: boolean; data: { items: TestItem[]; total: number } }> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.category) query.set('category', params.category);
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));

    return this.requestJson(`${API_BASE}/tests?${query.toString()}`, undefined, 'Failed to fetch tests from backend API');
  }

  public static async fetchPackages(): Promise<PackageItem[]> {
    const body = await this.requestJson(`${API_BASE}/packages`, undefined, 'Failed to fetch packages from backend API');
    return body.data;
  }

  public static async getSlotAvailability(date: string, pincode: string) {
    const body = await this.requestJson(
      `${API_BASE}/slots/availability?date=${encodeURIComponent(date)}&pincode=${encodeURIComponent(pincode)}`,
      undefined,
      'Failed to fetch slot availability'
    );
    return body.data;
  }

  public static async calculatePricing(items: CartItem[], isExpress: boolean = false) {
    const body = await this.requestJson(
      `${API_BASE}/pricing/calculate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, isExpress })
      },
      'Pricing calculation failed'
    );
    return body.data;
  }

  public static async createBooking(payload: {
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
    patient: PatientInfo;
  }): Promise<Booking> {
    const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const body = await this.requestJson(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(payload)
      },
      'Failed to create booking on backend server'
    );
    return body.data;
  }

  public static async createCallback(payload: {
    customerName: string;
    phone: string;
    city?: string;
    notes?: string;
  }): Promise<CallbackLead> {
    const body = await this.requestJson(
      `${API_BASE}/callbacks`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      'Failed to submit callback on backend server'
    );
    return body.data;
  }

  public static async checkPincode(pincode: string): Promise<PincodeLookupResponse> {
    const clean = (pincode || '').trim();
    if (!isValidPincodeFormat(clean)) {
      throw new Error('A valid 6-digit Indian postal PIN code is required.');
    }

    try {
      const res = await fetch(`${API_BASE}/pincode/${encodeURIComponent(clean)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const body = await res.json();
        if (body.data) return body.data;
      }
    } catch {
      // Backend or proxy temporarily unreachable, use local lookup
    }

    // Seamless authoritative fallback so user NEVER experiences a crash
    return lookupPincode(clean);
  }
}
