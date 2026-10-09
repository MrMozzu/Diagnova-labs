import { describe, it, expect } from 'vitest';
import { CatalogService } from '../src/services/catalog.service';

describe('CatalogService - Decoupled Search & Filtering Engine', () => {
  it('filters tests by keyword search across names and descriptions', () => {
    const result = CatalogService.filterTests({ query: 'glucose' });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.some(t => t.name.toLowerCase().includes('glucose'))).toBe(true);
  });

  it('filters tests by medical category', () => {
    const bloodTestsResult = CatalogService.filterTests({ category: 'Blood Tests' });
    expect(bloodTestsResult.items.length).toBeGreaterThan(0);
    expect(bloodTestsResult.items.every(t => t.category === 'Blood Tests')).toBe(true);
  });

  it('sorts tests correctly by price ascending and descending', () => {
    const ascResult = CatalogService.filterTests({ sort: 'price-asc', pageSize: 50 });
    for (let i = 0; i < ascResult.items.length - 1; i++) {
      expect(ascResult.items[i].price).toBeLessThanOrEqual(ascResult.items[i + 1].price);
    }

    const descResult = CatalogService.filterTests({ sort: 'price-desc', pageSize: 50 });
    for (let i = 0; i < descResult.items.length - 1; i++) {
      expect(descResult.items[i].price).toBeGreaterThanOrEqual(descResult.items[i + 1].price);
    }
  });

  it('handles pagination correctly', () => {
    const page1 = CatalogService.filterTests({ page: 1, pageSize: 5 });
    expect(page1.items.length).toBe(5);
    expect(page1.currentPage).toBe(1);

    const page2 = CatalogService.filterTests({ page: 2, pageSize: 5 });
    expect(page2.items.length).toBe(5);
    expect(page2.currentPage).toBe(2);

    // Items between pages should not overlap
    expect(page1.items[0].id).not.toBe(page2.items[0].id);
  });

  it('performs unified multi-entity search for hero bar', () => {
    const unified = CatalogService.getUnifiedSearchResults('blood');
    expect(unified.tests.length).toBeGreaterThan(0);
    expect(unified.tests.every(t => t.name.toLowerCase().includes('blood') || t.category.toLowerCase().includes('blood') || t.parameters.some(p => p.toLowerCase().includes('blood')))).toBe(true);
  });
});
