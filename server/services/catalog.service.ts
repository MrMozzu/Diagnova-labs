import { ALL_TESTS, POPULAR_CITIES } from '../../src/data/tests';
import { FEATURED_PACKAGES } from '../../src/data/packages';
import type { TestItem, PackageItem } from '../../src/types';

export class ServerCatalogService {
  public static getTests(params: {
    query?: string;
    category?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  }) {
    const q = (params.query || '').trim().toLowerCase();
    const cat = params.category || 'All';
    const sort = params.sort || 'popular';
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, params.pageSize || 12);

    let list = [...ALL_TESTS];

    if (cat !== 'All') {
      list = list.filter(t => t.category.toLowerCase() === cat.toLowerCase());
    }

    if (q.length > 0) {
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter(t => {
        const fullText = `${t.name} ${t.category} ${t.shortDesc} ${t.parameters.join(' ')} ${t.sampleType}`.toLowerCase();
        return tokens.every(tok => fullText.includes(tok));
      });
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'tat':
        list.sort((a, b) => a.tatHours - b.tatHours);
        break;
      case 'popular':
      default:
        list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    const total = list.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const items = list.slice(start, start + pageSize);

    return {
      items,
      total,
      totalPages,
      page,
      pageSize
    };
  }

  public static getTestByIdOrSlug(idOrSlug: string): TestItem | null {
    return ALL_TESTS.find(t => t.id === idOrSlug || t.slug === idOrSlug) || null;
  }

  public static getPackages(params?: { query?: string; category?: string }): PackageItem[] {
    const q = (params?.query || '').trim().toLowerCase();
    const cat = (params?.category || 'all').toLowerCase();

    return FEATURED_PACKAGES.filter(p => {
      if (cat !== 'all') {
        const match = p.category.toLowerCase().includes(cat) || p.title.toLowerCase().includes(cat);
        if (!match) return false;
      }
      if (q.length > 0) {
        const text = `${p.title} ${p.tagline} ${p.category} ${p.parametersSummary}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }

  public static getPackageByIdOrSlug(idOrSlug: string): PackageItem | null {
    return FEATURED_PACKAGES.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  public static getCities() {
    return POPULAR_CITIES;
  }
}
