import type { PatientInfo } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Enterprise Validation & Sanitization Engine
 * Category 1 In-House Zero-Dependency Security Service
 */
export class ValidationService {
  /**
   * Validates standard Indian mobile phone numbers (10 digits starting with 6, 7, 8, or 9)
   */
  public static isValidIndianPhone(phone: string): boolean {
    const clean = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
    return /^[6-9]\d{9}$/.test(clean);
  }

  /**
   * Validates 6-digit Indian Postal PIN codes
   */
  public static isValidIndianPincode(pincode: string): boolean {
    const clean = pincode.trim();
    return /^[1-9][0-9]{5}$/.test(clean);
  }

  /**
   * Sanitizes user input to prevent Cross-Site Scripting (XSS)
   * Converts HTML special characters into safe HTML entities
   */
  public static sanitizeHtml(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validates Patient Information contract before any booking or dispatch
   */
  public static validatePatientInfo(patient: Partial<PatientInfo>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!patient.fullName || patient.fullName.trim().length < 2) {
      errors.fullName = 'Patient full name must be at least 2 characters long.';
    }

    if (!patient.phone || !this.isValidIndianPhone(patient.phone)) {
      errors.phone = 'Please provide a valid 10-digit Indian mobile number.';
    }

    if (patient.age === undefined || isNaN(patient.age) || patient.age < 0 || patient.age > 125) {
      errors.age = 'Age must be a valid number between 0 and 125.';
    }

    if (!patient.gender || !['Male', 'Female', 'Other'].includes(patient.gender)) {
      errors.gender = 'Please select a valid gender option (Male, Female, Other).';
    }

    if (!patient.address || patient.address.trim().length < 5) {
      errors.address = 'A complete home address of at least 5 characters is required for sample collection.';
    }

    if (!patient.city || patient.city.trim().length < 2) {
      errors.city = 'Please specify a serviceable city.';
    }

    if (!patient.pincode || !this.isValidIndianPincode(patient.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    if (patient.email && patient.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patient.email.trim())) {
        errors.email = 'Please provide a valid email address.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
