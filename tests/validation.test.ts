import { describe, it, expect } from 'vitest';
import { ValidationService } from '../src/services/validation.service';
import type { PatientInfo } from '../src/types';

describe('ValidationService - In-House Security & Data Sanitization', () => {
  describe('Indian Mobile Phone Validation', () => {
    it('accepts valid 10-digit Indian numbers', () => {
      expect(ValidationService.isValidIndianPhone('9826012345')).toBe(true);
      expect(ValidationService.isValidIndianPhone('8826012345')).toBe(true);
      expect(ValidationService.isValidIndianPhone('7826012345')).toBe(true);
      expect(ValidationService.isValidIndianPhone('6826012345')).toBe(true);
    });

    it('accepts numbers with +91 country prefix and hyphens', () => {
      expect(ValidationService.isValidIndianPhone('+91 98260 12345')).toBe(true);
      expect(ValidationService.isValidIndianPhone('+91-98260-12345')).toBe(true);
    });

    it('rejects invalid or foreign numbers', () => {
      expect(ValidationService.isValidIndianPhone('1234567890')).toBe(false); // Starts with 1
      expect(ValidationService.isValidIndianPhone('5826012345')).toBe(false); // Starts with 5
      expect(ValidationService.isValidIndianPhone('98260')).toBe(false); // Too short
      expect(ValidationService.isValidIndianPhone('9826012345999')).toBe(false); // Too long
      expect(ValidationService.isValidIndianPhone('abcdefghij')).toBe(false); // Alpha
    });
  });

  describe('Indian PIN Code Validation', () => {
    it('accepts valid 6-digit postal PIN codes', () => {
      expect(ValidationService.isValidIndianPincode('462001')).toBe(true); // Bhopal
      expect(ValidationService.isValidIndianPincode('110001')).toBe(true); // Delhi
      expect(ValidationService.isValidIndianPincode('400001')).toBe(true); // Mumbai
    });

    it('rejects invalid pin codes', () => {
      expect(ValidationService.isValidIndianPincode('062001')).toBe(false); // Starts with 0
      expect(ValidationService.isValidIndianPincode('46200')).toBe(false); // 5 digits
      expect(ValidationService.isValidIndianPincode('4620012')).toBe(false); // 7 digits
      expect(ValidationService.isValidIndianPincode('46200A')).toBe(false); // Alphanumeric
    });
  });

  describe('XSS HTML Sanitization', () => {
    it('converts script tags and special chars to safe entities', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = ValidationService.sanitizeHtml(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('neutralizes malicious event handlers', () => {
      const attack = '<img src=x onerror=alert(1)>';
      const sanitized = ValidationService.sanitizeHtml(attack);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).toContain('&lt;img');
    });
  });

  describe('Patient Information Validation Contract', () => {
    it('validates a complete, accurate patient object', () => {
      const patient: PatientInfo = {
        fullName: 'Aarav Sharma',
        phone: '9826012345',
        email: 'aarav@example.com',
        age: 34,
        gender: 'Male',
        address: 'Flat 402, Green Palms, Arera Colony',
        city: 'Bhopal',
        pincode: '462016'
      };

      const result = ValidationService.validatePatientInfo(patient);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('catches missing or invalid fields', () => {
      const badPatient: Partial<PatientInfo> = {
        fullName: 'A', // Too short
        phone: '123', // Invalid phone
        age: 180, // Impossible age
        address: '', // Missing
        city: 'Bhopal',
        pincode: '99' // Invalid pin
      };

      const result = ValidationService.validatePatientInfo(badPatient);
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBeDefined();
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.age).toBeDefined();
      expect(result.errors.address).toBeDefined();
      expect(result.errors.pincode).toBeDefined();
    });
  });
});
