import fs from 'fs';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import type { Booking, CallbackLead, PatientInfo } from '../../src/types';

interface StoreData {
  bookings: Booking[];
  callbacks: CallbackLead[];
}

export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient | null = null;
  private dataFilePath: string;
  private memoryData: StoreData = { bookings: [], callbacks: [] };

  private constructor() {
    this.dataFilePath = path.resolve(process.cwd(), 'server', 'data', 'store.json');
    this.initDataFile();

    if (config.supabase.url && config.supabase.anonKey) {
      try {
        this.supabase = createClient(config.supabase.url, config.supabase.anonKey);
        console.log('✅ [DatabaseService] Connected to Supabase PostgreSQL cluster.');
      } catch (e) {
        console.warn('⚠️ [DatabaseService] Failed to initialize Supabase, fallback active:', e);
      }
    } else {
      console.log('ℹ️ [DatabaseService] Running in local transactional JSON store mode.');
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initDataFile() {
    try {
      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.memoryData = JSON.parse(raw);
      } else {
        this.saveToFile();
      }
    } catch (e) {
      console.warn('⚠️ [DatabaseService] Error loading local file data, using in-memory store:', e);
    }
  }

  private saveToFile() {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (e) {
      console.error('❌ [DatabaseService] Failed to write data file:', e);
    }
  }

  // --- BOOKINGS ---
  public async getBookings(): Promise<Booking[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
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
      } catch (err) {
        console.warn('⚠️ [DatabaseService] Supabase getBookings failed, fallback to local store:', err);
      }
    }

    return [...this.memoryData.bookings];
  }

  public async getBookingById(id: string): Promise<Booking | null> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('bookings')
          .select('*, patient:patients(*)')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            createdAt: data.created_at,
            itemType: data.booking_type,
            itemId: data.item_id,
            itemName: data.item_name,
            persons: data.number_of_persons,
            scheduledDate: data.scheduled_date,
            scheduledSlot: data.scheduled_slot,
            isExpress: data.is_express,
            baseAmount: Number(data.base_amount),
            discountAmount: Number(data.discount_amount),
            collectionFee: Number(data.collection_fee),
            totalAmount: Number(data.total_amount),
            paymentMethod: data.payment_method,
            paymentStatus: data.payment_status,
            status: data.status,
            patient: {
              fullName: data.patient?.full_name || '',
              phone: data.patient?.phone || '',
              email: data.patient?.email || '',
              age: data.patient?.age || 0,
              gender: data.patient?.gender || 'Male',
              address: data.patient?.address || '',
              landmark: data.patient?.landmark || '',
              city: data.patient?.city || '',
              pincode: data.patient?.pincode || ''
            },
            phlebotomist: data.phlebotomist_name ? {
              name: data.phlebotomist_name,
              phone: data.phlebotomist_phone || ''
            } : undefined
          };
        }
      } catch (err) {
        // Fallback to local memoryData below
      }
    }

    const local = this.memoryData.bookings.find(b => b.id.toLowerCase() === id.toLowerCase());
    return local || null;
  }

  public async insertBooking(booking: Booking): Promise<Booking> {
    // 1. Transactional write to local persistent store
    this.memoryData.bookings.unshift(booking);
    this.saveToFile();

    // 2. Synchronous/Async write to Supabase if available
    if (this.supabase) {
      try {
        const { data: patientRecord } = await this.supabase
          .from('patients')
          .insert({
            full_name: booking.patient.fullName,
            phone: booking.patient.phone,
            email: booking.patient.email,
            age: booking.patient.age,
            gender: booking.patient.gender,
            address: booking.patient.address,
            landmark: booking.patient.landmark || '',
            city: booking.patient.city,
            pincode: booking.patient.pincode
          })
          .select('id')
          .single();

        await this.supabase.from('bookings').insert({
          id: booking.id,
          patient_id: patientRecord?.id,
          booking_type: booking.itemType,
          item_id: booking.itemId,
          item_name: booking.itemName,
          number_of_persons: booking.persons,
          scheduled_date: booking.scheduledDate,
          scheduled_slot: booking.scheduledSlot,
          is_express: booking.isExpress,
          base_amount: booking.baseAmount,
          discount_amount: booking.discountAmount,
          collection_fee: booking.collectionFee,
          total_amount: booking.totalAmount,
          payment_method: booking.paymentMethod,
          payment_status: booking.paymentStatus,
          status: booking.status,
          phlebotomist_name: booking.phlebotomist?.name,
          phlebotomist_phone: booking.phlebotomist?.phone
        });
      } catch (e) {
        console.warn('⚠️ [DatabaseService] Supabase insert warning:', e);
      }
    }

    return booking;
  }

  public async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const b = this.memoryData.bookings.find(item => item.id === id);
    if (b) {
      b.status = status;
      this.saveToFile();
    }

    if (this.supabase) {
      try {
        await this.supabase.from('bookings').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('⚠️ [DatabaseService] Supabase status update warning:', e);
      }
    }

    return b || null;
  }

  // --- CALLBACKS ---
  public async getCallbacks(): Promise<CallbackLead[]> {
    return [...this.memoryData.callbacks];
  }

  public async insertCallback(lead: CallbackLead): Promise<CallbackLead> {
    this.memoryData.callbacks.unshift(lead);
    this.saveToFile();

    if (this.supabase) {
      try {
        await this.supabase.from('callbacks').insert({
          customer_name: lead.customerName,
          phone: lead.phone,
          city: lead.city,
          preferred_time: lead.preferredTime,
          advisor_notes: lead.notes,
          status: lead.status
        });
      } catch (e) {
        console.warn('⚠️ [DatabaseService] Supabase callback insert warning:', e);
      }
    }

    return lead;
  }

  public clearAll() {
    this.memoryData = { bookings: [], callbacks: [] };
    this.saveToFile();
  }
}

export const db = DatabaseService.getInstance();
