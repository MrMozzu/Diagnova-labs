import type { TestItem, PackageItem } from '../types';
import { ALL_TESTS } from '../data/tests';
import { FEATURED_PACKAGES } from '../data/packages';

export interface CatalogFilterParams {
  query?: string;
  category?: string;
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'tat';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Enterprise Decoupled Catalog Search & Filtering Engine
 * Category 1 In-House Modular Service
 */
export class CatalogService {
  /**
   * Search and filter individual pathology tests
   */
  public static filterTests(params: CatalogFilterParams): PaginatedResult<TestItem> {
    const query = (params.query || '').trim().toLowerCase();
    const category = params.category || 'All';
    const sort = params.sort || 'popular';
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, params.pageSize || 9);

    let filtered = [...ALL_TESTS];

    // 1. Category Filter
    if (category !== 'All') {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Query Multi-term Search
    if (query.length > 0) {
      const tokens = query.split(/\s+/).filter(Boolean);
      filtered = filtered.filter(t => {
        const searchable = `${t.name} ${t.category} ${t.shortDesc} ${t.parameters.join(' ')} ${t.sampleType}`.toLowerCase();
        return tokens.every(tok => searchable.includes(tok));
      });
    }

    // 3. Sorting
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'tat':
        filtered.sort((a, b) => a.tatHours - b.tatHours);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  /**
   * Search and filter preventative packages
   */
  public static filterPackages(query?: string, categoryFilter?: string): PackageItem[] {
    const q = (query || '').trim().toLowerCase();
    const cat = (categoryFilter || 'all').toLowerCase();

    return FEATURED_PACKAGES.filter(pkg => {
      // Category match
      if (cat !== 'all') {
        const matchesCategory = pkg.category.toLowerCase().includes(cat) ||
          pkg.title.toLowerCase().includes(cat) ||
          (cat === 'popular' && pkg.badge?.toLowerCase().includes('popular'));
        if (!matchesCategory) return false;
      }

      // Query match
      if (q.length > 0) {
        const searchable = `${pkg.title} ${pkg.tagline} ${pkg.category} ${pkg.parametersSummary}`.toLowerCase();
        return searchable.includes(q);
      }

      return true;
    });
  }

  /**
   * Unified Instant Search (Tests + Packages) for Hero Search Box
   */
  public static getUnifiedSearchResults(query: string, limit: number = 8): { tests: TestItem[]; packages: PackageItem[] } {
    const q = (query || '').trim().toLowerCase();
    if (!q) return { tests: [], packages: [] };

    const tests = ALL_TESTS.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) ||
      t.parameters.some(p => p.toLowerCase().includes(q))
    ).slice(0, limit);

    const packages = FEATURED_PACKAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.parametersSummary.toLowerCase().includes(q)
    ).slice(0, 3);

    return { tests, packages };
  }
}
