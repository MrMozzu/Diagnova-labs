import { describe, it, expect, vi } from 'vitest';
import { ServerPincodeService } from '../server/services/pincode.service';

describe('ServerPincodeService - Hyperlocal Serviceability & Smart Lab Detection (Healthians Spec)', () => {
  describe('Format Validation', () => {
    it('accepts genuine 6-digit Indian PIN codes', () => {
      expect(ServerPincodeService.isValidFormat('462016')).toBe(true);
      expect(ServerPincodeService.isValidFormat('110001')).toBe(true);
      expect(ServerPincodeService.isValidFormat('560001')).toBe(true);
      expect(ServerPincodeService.isValidFormat('400001')).toBe(true);
    });

    it('rejects invalid pincode formats', () => {
      expect(ServerPincodeService.isValidFormat('12345')).toBe(false); // 5 digits
      expect(ServerPincodeService.isValidFormat('4620012')).toBe(false); // 7 digits
      expect(ServerPincodeService.isValidFormat('062016')).toBe(false); // Starts with 0
      expect(ServerPincodeService.isValidFormat('46200A')).toBe(false); // Non-numeric
      expect(ServerPincodeService.isValidFormat('')).toBe(false);
    });
  });

  describe('Authoritative Pincode Lookups', () => {
    it('detects Service Available zone in Bhopal (Arera Colony 462016)', () => {
      const res = ServerPincodeService.lookup('462016');
      expect(res.isServiceable).toBe(true);
      expect(res.serviceTier).toBe('express_60min');
      expect(res.badgeColor).toBe('green');
      expect(res.badgeText).toBe('✅ Service Available in this Area');
      expect(res.city).toBe('Bhopal');
      expect(res.locality).toContain('Arera Colony');
      expect(res.nearestLab).toContain('MP Nagar');
      expect(res.tatHours).toBeLessThanOrEqual(6);
    });

    it('detects Service Available zone (Jahangirabad 462003)', () => {
      const res = ServerPincodeService.lookup('462003');
      expect(res.isServiceable).toBe(true);
      expect(res.serviceTier).toBe('standard_nextday');
      expect(res.badgeColor).toBe('green');
      expect(res.badgeText).toBe('✅ Service Available in this Area');
      expect(res.city).toBe('Bhopal');
    });

    it('detects Express Collection in Bangalore (Koramangala 560034)', () => {
      const res = ServerPincodeService.lookup('560034');
      expect(res.isServiceable).toBe(true);
      expect(res.serviceTier).toBe('express_60min');
      expect(res.city).toBe('Bengaluru');
      expect(res.locality).toContain('Koramangala');
    });
  });

  describe('Regional Cluster Fallback & Unserviceable Zones', () => {
    it('falls back to regional metropolitan hub for unlisted Bhopal pincodes', () => {
      const res = ServerPincodeService.lookup('462099'); // Unlisted 462 PIN
      expect(res.isServiceable).toBe(true);
      expect(res.city).toBe('Bhopal');
      expect(res.nearestLab).toContain('Bhopal');
      expect(res.serviceTier).toBe('standard_nextday');
    });

    it('flags remote / outside-delivery pincodes as unserviceable', () => {
      const res = ServerPincodeService.lookup('799001'); // Remote region outside network
      expect(res.isServiceable).toBe(false);
      expect(res.serviceTier).toBe('unserviceable');
      expect(res.badgeColor).toBe('red');
      expect(res.badgeText).toBe('No service is available in this area');
      expect(res.message).toBe('No service is available in this area');
    });

    it('throws 422 error on malformed input', () => {
      expect(() => ServerPincodeService.lookup('abc')).toThrow('A valid 6-digit');
    });
  });

  describe('ApiClient.checkPincode - Fallback & <!DOCTYPE> Error Immunity', () => {
    it('seamlessly falls back to local dataset when server returns <!DOCTYPE html> string', async () => {
      const originalFetch = globalThis.fetch;
      // Mock fetch returning HTML (e.g. Vite dev server serving index.html on unproxied routes)
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
        text: async () => '<!doctype html><html><head></head><body>Vite App</body></html>',
        json: async () => {
          throw new SyntaxError("Unexpected token '<', \"<!doctype \"... is not valid JSON");
        }
      } as any);

      try {
        const { ApiClient } = await import('../src/services/api');
        const data = await ApiClient.checkPincode('462016');
        expect(data).toBeDefined();
        expect(data.isServiceable).toBe(true);
        expect(data.city).toBe('Bhopal');
        expect(data.locality).toContain('Arera Colony');
        expect(data.badgeColor).toBe('green');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('falls back to local dataset when network throws an offline/unreachable error', async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      try {
        const { ApiClient } = await import('../src/services/api');
        const data = await ApiClient.checkPincode('560034');
        expect(data.isServiceable).toBe(true);
        expect(data.city).toBe('Bengaluru');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it('rejects invalid pincode formats without making a network call', async () => {
      const { ApiClient } = await import('../src/services/api');
      await expect(ApiClient.checkPincode('123')).rejects.toThrow('A valid 6-digit');
    });
  });
});

