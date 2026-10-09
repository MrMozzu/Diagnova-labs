import { db } from './database.service';
import { AppError } from '../middleware/errorHandler';
import type { CallbackLead } from '../../src/types';

export class ServerCallbackService {
  public static async createCallbackLead(data: {
    customerName: string;
    phone: string;
    city?: string;
    preferredTime?: string;
    notes?: string;
  }): Promise<CallbackLead> {
    if (!data.customerName || data.customerName.trim().length < 2) {
      throw new AppError('Customer name must be at least 2 characters.', 422, 'VALIDATION_FAILED');
    }

    const cleanPhone = (data.phone || '').replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new AppError('Valid 10-digit Indian phone number required.', 422, 'VALIDATION_FAILED');
    }

    const lead: CallbackLead = {
      id: `CB-${Date.now().toString(36).toUpperCase()}`,
      customerName: data.customerName.trim(),
      phone: cleanPhone,
      city: data.city || 'Bhopal',
      preferredTime: data.preferredTime || 'Within 15 minutes',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    return db.insertCallback(lead);
  }

  public static async listCallbacks(): Promise<CallbackLead[]> {
    return db.getCallbacks();
  }
}
