import './style.css';
import { ALL_TESTS } from './data/tests';
import { FEATURED_PACKAGES } from './data/packages';
import { store } from './services/store';
import type { PackageItem, TestItem } from './types';
import { showToast } from './utils/toast';

// App Routing & Filter State
type AppRoute = 'home' | 'packages' | 'tests';
let currentRoute: AppRoute = 'home';
let currentCity = store.getCity();

// Search & Catalog Filter State
let searchQuery = '';
let homepageResultFilter: 'all' | 'tests' | 'packages' = 'all';
let activeDropdownIndex = -1;
let selectedCategory = 'All';
let selectedSort = 'popular';
let currentPage = 1;
const pageSize = 9;

// Package Page Filter Pill State
let selectedPackageFilter: string = 'all';

// Multi-person counts per package
const packagePersons: Record<string, number> = {
  'pkg-healthy-india-2026': 1,
  'pkg-be-healthy-comprehensive': 1,
  'pkg-diabetic-checkup-prime': 1,
  'pkg-life-maximiser-plus-male': 1,
  'pkg-life-maximiser-male': 1,
  'pkg-summer-wellness-male': 1,
  'pkg-cancer-screening-female': 1,
  'pkg-cancer-screening-male': 1,
  'pkg-senior-citizen': 1,
  'pkg-women-wellness': 1
};

let initialHomeHtml = '';

// ==========================================================================
// ROUTING HELPERS
// ==========================================================================
function syncRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'packages' || hash === 'packages-section') {
    currentRoute = 'packages';
  } else if (hash === 'tests' || hash === 'catalog-section') {
    currentRoute = 'tests';
  } else {
    currentRoute = 'home';
  }
}

function navigateTo(route: AppRoute, options?: { category?: string; search?: string }) {
  currentRoute = route;
  if (options?.category) {
    selectedCategory = options.category;
    currentPage = 1;
  }
  if (options?.search !== undefined) {
    searchQuery = options.search;
    currentPage = 1;
  }

  // Update hash without double triggering
  const newHash = route === 'home' ? '' : `#/${route}`;
  if (window.location.hash !== newHash) {
    window.location.hash = newHash;
  }

  renderRouteView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getCurrentRouteViewHtml(): string {
  if (currentRoute === 'packages') {
    return renderPackagesPageView();
  } else if (currentRoute === 'tests') {
    return renderTestsPageView();
  } else {
    return initialHomeHtml;
  }
}

function bindCurrentRouteEvents() {
  if (currentRoute === 'packages') {
    bindPackagesPageEvents();
  } else if (currentRoute === 'tests') {
    bindTestsPageEvents();
  } else {
    bindHomePageEvents();
  }
}

// ==========================================================================
// ROUTE VIEW CONTROLLER
// ==========================================================================
function renderRouteView() {
  const container = document.getElementById('main-content-view');
  if (!container) return;

  // Sync mobile bottom nav active tab
  document.querySelectorAll('.mob-nav-item').forEach(b => {
    const target = b.getAttribute('data-target');
    if (target === currentRoute) {
      b.classList.add('active');
    } else if (target !== 'book' && target !== 'cart') {
      b.classList.remove('active');
    }
  });

  container.innerHTML = getCurrentRouteViewHtml();
  bindCurrentRouteEvents();
  updateCartBadges();
}

function getFilteredPackages(filter: string): PackageItem[] {
  if (filter === 'fullbody') {
    return FEATURED_PACKAGES.filter(p => p.category === 'Full Body Checkup' || p.category === 'Comprehensive Checkup');
  } else if (filter === 'male') {
    return FEATURED_PACKAGES.filter(p => p.category === 'Men Health' || p.category === 'Executive Health' || p.id === 'pkg-cancer-screening-male');
  } else if (filter === 'female') {
    return FEATURED_PACKAGES.filter(p => p.category === 'Women Health' || p.id === 'pkg-cancer-screening-female');
  } else if (filter === 'cancer') {
    return FEATURED_PACKAGES.filter(p => p.category === 'Cancer Screening');
  } else if (filter === 'diabetic') {
    return FEATURED_PACKAGES.filter(p => p.category === 'Diabetes Care' || p.id === 'pkg-diabetic-checkup-prime');
  } else if (filter === 'senior') {
    return FEATURED_PACKAGES.filter(p => p.id === 'pkg-senior-citizen');
  }
  return FEATURED_PACKAGES;
}

function renderPackagesPageView(): string {
  const displayedPackages = getFilteredPackages(selectedPackageFilter);

  return `
    <!-- PAGE HERO BANNER -->
    <section class="page-banner">
      <div class="container">
        <div class="page-banner-content">
          <span class="page-banner-eyebrow">PREVENTIVE HEALTHCARE</span>
          <h1 class="page-banner-title">Comprehensive Health Packages</h1>
          <p class="page-banner-desc">
            NABL accredited full-body checkups, senior citizen care, diabetic monitoring, and women's wellness profiles with 60-minute doorstep sample collection in ${currentCity}.
          </p>
          <div class="page-banner-features">
            <div class="banner-feat-pill">✓ 60-Min Doorstep Sample Pickup</div>
            <div class="banner-feat-pill">✓ Up to 70% Bundle Savings</div>
            <div class="banner-feat-pill">✓ Free Doctor Consultation</div>
          </div>
        </div>
      </div>
    </section>

    <!-- PACKAGES MAIN CONTENT -->
    <section class="packages-section" style="padding-top: 36px;">
      <div class="container">
        <!-- FILTER PILLS BAR -->
        <div class="packages-filter-bar">
          <button class="package-filter-pill ${selectedPackageFilter === 'all' ? 'active' : ''}" data-pkg-filter="all">
            All Packages (${FEATURED_PACKAGES.length})
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'fullbody' ? 'active' : ''}" data-pkg-filter="fullbody">
            Full Body Checkups
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'male' ? 'active' : ''}" data-pkg-filter="male">
            Men's Health
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'female' ? 'active' : ''}" data-pkg-filter="female">
            Women's Health
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'cancer' ? 'active' : ''}" data-pkg-filter="cancer">
            Cancer Screening
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'diabetic' ? 'active' : ''}" data-pkg-filter="diabetic">
            Diabetes Care
          </button>
        </div>

        <!-- PACKAGES GRID -->
        <div class="packages-grid" id="packages-page-grid">
          ${displayedPackages.map(pkg => renderPackageCard(pkg)).join('')}
        </div>

        <!-- COMPREHENSIVE PACKAGES COMPARISON TABLE -->
        <div class="packages-comparison-card">
          <div style="margin-bottom: 20px;">
            <span class="section-eyebrow">COMPREHENSIVE MATRIX</span>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Compare All Health Packages</h3>
            <p style="font-size: 0.88rem; color: #64748b;">Detailed side-by-side inclusion matrix across vital organ systems.</p>
          </div>

          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th style="min-width: 180px;">Package Details</th>
                  <th>Healthy India 2026</th>
                  <th>Be Healthy Comprehensive</th>
                  <th>Senior Citizen Profile</th>
                  <th>Women's Wellness</th>
                  <th>Diabetic Care</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Total Parameters</strong></td>
                  <td><strong style="color: #1b449c;">70+ Tests</strong></td>
                  <td><strong style="color: #1b449c;">60+ Tests</strong></td>
                  <td><strong style="color: #1b449c;">65+ Tests</strong></td>
                  <td><strong style="color: #1b449c;">55+ Tests</strong></td>
                  <td><strong style="color: #1b449c;">38+ Tests</strong></td>
                </tr>
                <tr>
                  <td><strong>Complete Blood Count (CBC)</strong></td>
                  <td>✓ Included (24 params)</td>
                  <td>✓ Included (24 params)</td>
                  <td>✓ Included (24 params)</td>
                  <td>✓ Included (24 params)</td>
                  <td>✓ Included (24 params)</td>
                </tr>
                <tr>
                  <td><strong>Blood Glucose / Sugar</strong></td>
                  <td>✓ Fasting Glucose</td>
                  <td>✓ Fasting + PP Glucose</td>
                  <td>✓ Fasting + PP Glucose</td>
                  <td>✓ Fasting Glucose</td>
                  <td>✓ Fasting + HbA1c + PP</td>
                </tr>
                <tr>
                  <td><strong>HbA1c (Glycated Hb)</strong></td>
                  <td>Optional Addon</td>
                  <td>✓ Included (3 Month Avg)</td>
                  <td>✓ Included</td>
                  <td>Optional Addon</td>
                  <td>✓ Key Test (Gold Standard)</td>
                </tr>
                <tr>
                  <td><strong>Lipid Profile (Cholesterol)</strong></td>
                  <td>✓ Full 8 Parameters</td>
                  <td>✓ Full 8 Parameters</td>
                  <td>✓ Full 8 Parameters</td>
                  <td>✓ Full 8 Parameters</td>
                  <td>✓ Full 8 Parameters</td>
                </tr>
                <tr>
                  <td><strong>Liver Function (LFT)</strong></td>
                  <td>✓ Full 11 Parameters</td>
                  <td>✓ Full 11 Parameters</td>
                  <td>✓ Full 11 Parameters</td>
                  <td>✓ Full 11 Parameters</td>
                  <td>✓ Basic Liver Panel</td>
                </tr>
                <tr>
                  <td><strong>Kidney Function (KFT)</strong></td>
                  <td>✓ Full 6 Parameters</td>
                  <td>✓ Full 6 Parameters</td>
                  <td>✓ Full 6 Parameters</td>
                  <td>✓ Full 6 Parameters</td>
                  <td>✓ Creatinine + BUN</td>
                </tr>
                <tr>
                  <td><strong>Thyroid Profile (TSH)</strong></td>
                  <td>✓ TSH Ultrasensitive</td>
                  <td>✓ TSH Ultrasensitive</td>
                  <td>✓ TSH, Total T3, T4</td>
                  <td>✓ TSH, Total T3, T4</td>
                  <td>✓ TSH Ultrasensitive</td>
                </tr>
                <tr>
                  <td><strong>Vitamin D3 &amp; B12</strong></td>
                  <td>Optional Addon</td>
                  <td>Optional Addon</td>
                  <td>✓ Included (Both)</td>
                  <td>✓ Included (Both)</td>
                  <td>Optional Addon</td>
                </tr>
                <tr>
                  <td><strong>Calcium &amp; Bone Health</strong></td>
                  <td>✓ Serum Calcium</td>
                  <td>✓ Serum Calcium</td>
                  <td>✓ Calcium + Phosphorus</td>
                  <td>✓ Calcium + Bone Baseline</td>
                  <td>✓ Serum Calcium</td>
                </tr>
                <tr>
                  <td><strong>Free Doctor Consultation</strong></td>
                  <td>✓ Included</td>
                  <td>✓ Included</td>
                  <td>✓ Included</td>
                  <td>✓ Included</td>
                  <td>✓ Included</td>
                </tr>
                <tr>
                  <td><strong>Starting Price</strong></td>
                  <td><strong style="color: #0284c7; font-size: 1.05rem;">₹ 1,199</strong></td>
                  <td><strong style="color: #0284c7; font-size: 1.05rem;">₹ 899</strong></td>
                  <td><strong style="color: #0284c7; font-size: 1.05rem;">₹ 1,499</strong></td>
                  <td><strong style="color: #0284c7; font-size: 1.05rem;">₹ 1,299</strong></td>
                  <td><strong style="color: #0284c7; font-size: 1.05rem;">₹ 699</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PACKAGES FAQ ACCORDION -->
        <div style="margin-top: 56px; max-width: 800px; margin-left: auto; margin-right: auto;">
          <div class="text-center" style="margin-bottom: 28px;">
            <span class="section-eyebrow">HELP &amp; GUIDELINES</span>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a;">Frequently Asked Questions</h3>
          </div>

          <div class="mobile-accordion-item active" style="border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #ffffff;">
            <button class="mobile-accordion-header" style="padding: 16px 20px; font-weight: 700; color: #0f172a;">
              <span>How do I prepare for fasting before a full body checkup?</span>
              <span class="acc-chevron">▾</span>
            </button>
            <div class="mobile-accordion-content" style="padding: 0 20px 16px 20px; font-size: 0.88rem; color: #475569; line-height: 1.6;">
              Fasting requires 10 to 12 hours of overnight fasting before the morning sample collection. You may drink plain water, but refrain from tea, coffee, milk, or breakfast until the blood sample is drawn.
            </div>
          </div>

          <div class="mobile-accordion-item" style="border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #ffffff;">
            <button class="mobile-accordion-header" style="padding: 16px 20px; font-weight: 700; color: #0f172a;">
              <span>When will I get my digital test reports?</span>
              <span class="acc-chevron">▾</span>
            </button>
            <div class="mobile-accordion-content" style="padding: 0 20px 16px 20px; font-size: 0.88rem; color: #475569; line-height: 1.6;">
              Most full body checkup and blood reports are delivered within 6 hours of sample collection directly to your registered WhatsApp number and Email.
            </div>
          </div>

          <div class="mobile-accordion-item" style="border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #ffffff;">
            <button class="mobile-accordion-header" style="padding: 16px 20px; font-weight: 700; color: #0f172a;">
              <span>Can I book for multiple family members together?</span>
              <span class="acc-chevron">▾</span>
            </button>
            <div class="mobile-accordion-content" style="padding: 0 20px 16px 20px; font-size: 0.88rem; color: #475569; line-height: 1.6;">
              Yes! You can choose 1, 2, 3 or 4 persons on any package card to receive an instant family bundle discount, or use our "Add to Cart" feature to mix different packages and tests in a single home visit.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// PAGE 3: TESTS CATALOG PAGE (1000+ Pathology Directory, Search, Filters)
// ==========================================================================
function renderTestsPageView(): string {
  return `
    <!-- PAGE HERO BANNER -->
    <section class="page-banner">
      <div class="container">
        <div class="page-banner-content">
          <span class="page-banner-eyebrow">CLINICAL PATHOLOGY DIRECTORY</span>
          <h1 class="page-banner-title">1000+ Pathology &amp; Diagnostic Tests</h1>
          <p class="page-banner-desc">
            Search and book routine blood work, diabetes profiles, thyroid panels, hormone assays, and organ health markers at transparent prices with 60-minute home collection in ${currentCity}.
          </p>
          <div class="page-banner-features">
            <div class="banner-feat-pill">✓ NABL Accredited Reporting</div>
            <div class="banner-feat-pill">✓ Single &amp; Multi-Test Cart</div>
            <div class="banner-feat-pill">✓ 4 to 6 Hour Turnaround</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATALOG MAIN CONTENT -->
    <section class="catalog-section" id="catalog-section" style="padding-top: 36px;">
      <div class="container">
        <!-- SEARCH & SORT BAR -->
        <div class="catalog-search-bar-row">
          <div class="catalog-search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <label for="catalog-search-field" class="sr-only">Search by test name, symptom, or biomarker</label>
            <input 
              type="text" 
              id="catalog-search-field" 
              class="catalog-search-input" 
              placeholder="Search by test name, symptom, or biomarker (e.g., Glucose, CBC, Lipid)..." 
              aria-label="Search by test name, symptom, or biomarker"
              value="${searchQuery}" 
            />
          </div>

          <label for="catalog-sort-select" class="sr-only">Sort diagnostic tests</label>
          <select class="catalog-sort-select" id="catalog-sort-select" aria-label="Sort diagnostic tests">
            <option value="popular" ${selectedSort === 'popular' ? 'selected' : ''}>Most Popular</option>
            <option value="price-low" ${selectedSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-high" ${selectedSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
            <option value="tat" ${selectedSort === 'tat' ? 'selected' : ''}>Fastest Turnaround</option>
          </select>
        </div>

        <!-- CATEGORY FILTER CHIPS -->
        <div class="catalog-filter-chips" id="category-filter-chips">
          ${['All', 'Blood Sugar', 'Blood Tests', 'Kidney Function', 'Electrolytes', 'Protein Profile', 'Bone & Minerals'].map(cat => `
            <button class="filter-chip ${selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span class="page-indicator" id="catalog-count-badge">Showing 1–9 of ${ALL_TESTS.length} tests</span>
          <span style="font-size: 0.8rem; color: #64748b;">Click <strong>+ Add</strong> to book multiple tests together</span>
        </div>

        <!-- TESTS GRID -->
        <div class="tests-catalog-grid" id="tests-grid-container">
          ${getCatalogTestsHtml()}
        </div>

        <!-- PAGINATION CONTROLS -->
        <div class="catalog-pagination">
          <button class="btn-page-nav" id="btn-prev-page" disabled>Previous</button>
          <span class="page-indicator" id="page-indicator-text">Page 1</span>
          <button class="btn-page-nav" id="btn-next-page">Next ➔</button>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// PACKAGE CARD RENDERER (Reusable with Multi-person & Add to Cart)
// ==========================================================================
function renderPackageCard(pkg: PackageItem): string {
  const persons = packagePersons[pkg.id] || 1;
  const tier = pkg.pricing[persons] || pkg.pricing[1];

  let iconClass = 'pkg-circle-icon icon-bg-blue';
  let iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  if (pkg.iconType === 'droplet' || pkg.slug.includes('diabetes')) {
    iconClass = 'pkg-circle-icon icon-bg-blue';
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  } else if (pkg.iconType === 'shield' || pkg.slug.includes('thyroid')) {
    iconClass = 'pkg-circle-icon icon-bg-purple';
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M6 8c2 2 4 2 6 0 2 2 4 2 6 0M6 16c2-2 4-2 6 0 2-2 4-2 6 0"/></svg>`;
  } else if (pkg.iconType === 'female' || pkg.slug.includes('women')) {
    iconClass = 'pkg-circle-icon icon-bg-pink';
    iconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 17h6"/><path d="M5 8c0 4 3 7 7 7s7-3 7-7"/></svg>`;
  }

  return `
    <div class="package-card" data-pkg-id="${pkg.id}">
      <div class="${iconClass}">
        ${iconSvg}
      </div>

      <h3 class="package-card-title">${pkg.title}</h3>
      <div class="package-params-count">Parameters: ${pkg.parametersCount} tests</div>
      <div class="package-params-sub">${pkg.parametersSummary}</div>

      <div class="package-tat-pill">${pkg.tatText}</div>

      <div class="package-price-row">
        <span class="price-current">₹ ${tier.price.toLocaleString('en-IN')}</span>
        <span class="price-mrp">₹ ${tier.mrp.toLocaleString('en-IN')}</span>
        <span class="badge-discount">${tier.discount}% OFF</span>
      </div>

      <div class="package-card-actions">
        <button class="btn-card-book-now" data-action="book-package" data-pkg-id="${pkg.id}">
          Book Now
        </button>
        <button class="btn-card-cart-toggle ${store.isInCart(pkg.id) ? 'added' : ''}" data-action="toggle-cart-pkg" data-pkg-id="${pkg.id}" title="${store.isInCart(pkg.id) ? 'In Cart' : 'Add to Cart'}" aria-label="Add package to cart">
          ${store.isInCart(pkg.id) ? '✓' : '+'}
        </button>
      </div>
    </div>
  `;
}
function renderTestCatalogCard(test: TestItem): string {
  const isInCart = store.isInCart(test.id);

  return `
    <div class="test-catalog-card" data-test-id="${test.id}">
      <span class="test-cat-tag">${test.category}</span>
      <h3 class="test-title">${test.name}</h3>
      <p class="test-desc">${test.shortDesc}</p>
      
      <div class="test-meta-pills">
        <span class="meta-pill">Sample: ${test.sampleType}</span>
        <span class="meta-pill ${test.fastingRequired ? 'fasting' : ''}">
          ${test.fastingRequired ? `${test.fastingHours}h Fasting` : 'No Fasting'}
        </span>
        <span class="meta-pill tat">${test.tatHours}h Report</span>
      </div>

      <div class="test-card-footer">
        <div class="test-price-box">
          <span class="test-current-price">₹ ${test.price.toLocaleString('en-IN')}</span>
          <span class="test-mrp-price">₹ ${test.mrp.toLocaleString('en-IN')}</span>
          <span class="badge-discount">${test.discountPercent}% OFF</span>
        </div>

        <div class="card-buttons-row">
          <button class="btn-add-cart ${isInCart ? 'added' : ''}" data-action="toggle-cart-test" data-test-id="${test.id}">
            ${isInCart ? '✓ Added' : '+ Add'}
          </button>
          <button class="btn-book-test-sm" data-action="book-test" data-test-id="${test.id}">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `;
}

function getFilteredAndSortedTests(): TestItem[] {
  let filtered = ALL_TESTS.filter(test => {
    const matchesSearch = !searchQuery || 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === 'All' || selectedCategory === 'Blood Tests') {
      matchesCategory = true;
    } else if (selectedCategory === 'Blood Sugar' || selectedCategory === 'Diabetes') {
      matchesCategory = test.name.toLowerCase().includes('glucose') || test.name.toLowerCase().includes('hba1c');
    } else if (selectedCategory === 'Kidney Function' || selectedCategory === 'Kidney') {
      matchesCategory = test.name.toLowerCase().includes('bun') || test.name.toLowerCase().includes('creatinine') || test.name.toLowerCase().includes('kft') || test.name.toLowerCase().includes('urine');
    } else if (selectedCategory === 'Electrolytes') {
      matchesCategory = test.name.toLowerCase().includes('sodium') || 
                        test.name.toLowerCase().includes('potassium') || 
                        test.name.toLowerCase().includes('chloride') || 
                        test.name.toLowerCase().includes('carbon dioxide');
    } else if (selectedCategory === 'Bone & Minerals' || selectedCategory === 'Vitamins') {
      matchesCategory = test.name.toLowerCase().includes('calcium') || test.name.toLowerCase().includes('vitamin');
    } else if (selectedCategory === 'Protein Profile' || selectedCategory === 'Liver') {
      matchesCategory = test.name.toLowerCase().includes('protein') || test.name.toLowerCase().includes('liver') || test.name.toLowerCase().includes('lft');
    } else {
      matchesCategory = test.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  if (selectedSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'tat') {
    filtered.sort((a, b) => a.tatHours - b.tatHours);
  } else {
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  return filtered;
}

function getCatalogTestsHtml(): string {
  const filtered = getFilteredAndSortedTests();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  if (paginated.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔍</span>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">No tests found matching "${escapeHtml(searchQuery)}"</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">Try adjusting your keyword or reset filters to explore our full 1000+ catalog.</p>
        <button class="btn-pill-primary" id="btn-reset-catalog-filter" style="padding: 8px 20px; font-size: 0.85rem;">Reset Filters</button>
      </div>
    `;
  }

  return paginated.map(test => renderTestCatalogCard(test)).join('');
}

function renderCatalogTests() {
  const container = document.getElementById('tests-grid-container');
  const countBadge = document.getElementById('catalog-count-badge');
  const prevBtn = document.getElementById('btn-prev-page') as HTMLButtonElement;
  const nextBtn = document.getElementById('btn-next-page') as HTMLButtonElement;
  const pageIndicator = document.getElementById('page-indicator-text');

  if (!container) return;

  const filtered = getFilteredAndSortedTests();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  if (countBadge) {
    countBadge.textContent = `Showing ${Math.min(startIndex + 1, totalItems)}–${Math.min(startIndex + paginated.length, totalItems)} of ${totalItems} tests`;
  }

  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  container.innerHTML = getCatalogTestsHtml();

  const resetBtn = document.getElementById('btn-reset-catalog-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchQuery = '';
      selectedCategory = 'All';
      currentPage = 1;
      const input = document.getElementById('catalog-search-field') as HTMLInputElement;
      if (input) input.value = '';
      renderCatalogTests();
    });
  }

  bindTestCardEvents();
}

// ==========================================================================
// DYNAMIC DRAWERS & MODALS MODULE LAZY LOADER
// ==========================================================================
let drawersModule: typeof import('./modules/drawers') | null = null;
async function getDrawers() {
  if (!drawersModule) {
    drawersModule = await import('./modules/drawers');
  }
  return drawersModule;
}

// Prefetch drawers on idle without blocking initial critical path or LCP
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  window.requestIdleCallback(() => {
    getDrawers();
  });
}

function openCartDrawer() {
  getDrawers().then(m => m.openCartDrawer({ navigateTo, updateCartBadges }));
}

function closeCartDrawer() {
  getDrawers().then(m => m.closeCartDrawer());
}

function updateCartBadges() {
  const cart = store.getCart();
  const count = cart.length;

  const headerBadge = document.getElementById('header-cart-count');
  if (headerBadge) headerBadge.textContent = String(count);

  const mobBadge = document.getElementById('mob-cart-count');
  if (mobBadge) mobBadge.textContent = String(count);

  const mobDrawerBadge = document.getElementById('mobile-drawer-cart-count');
  if (mobDrawerBadge) mobDrawerBadge.textContent = String(count);

  const drawerHeaderBadge = document.getElementById('cart-drawer-count');
  if (drawerHeaderBadge) drawerHeaderBadge.textContent = `(${count} item${count === 1 ? '' : 's'})`;

  // Update "+ Add to Cart" buttons on screen
  document.querySelectorAll('[data-action="toggle-cart-test"]').forEach(btn => {
    const testId = btn.getAttribute('data-test-id');
    if (testId && store.isInCart(testId)) {
      btn.classList.add('added');
      btn.textContent = '✓ Added';
    } else {
      btn.classList.remove('added');
      btn.textContent = '+ Add';
    }
  });

  document.querySelectorAll('[data-action="toggle-cart-pkg"]').forEach(btn => {
    const pkgId = btn.getAttribute('data-pkg-id');
    if (pkgId && store.isInCart(pkgId)) {
      btn.classList.add('added');
      btn.textContent = '✓';
      btn.setAttribute('title', 'In Cart');
      btn.setAttribute('aria-label', 'Package in cart');
    } else {
      btn.classList.remove('added');
      btn.textContent = '+';
      btn.setAttribute('title', 'Add to Cart');
      btn.setAttribute('aria-label', 'Add package to cart');
    }
  });
}

function openBookingDrawerForPackage(pkgId: string) {
  getDrawers().then(m => m.openBookingDrawerForPackage(pkgId, packagePersons[pkgId] || 1));
}

function openBookingDrawerForTest(testId: string) {
  getDrawers().then(m => m.openBookingDrawerForTest(testId));
}

function openParametersModal(pkgId: string) {
  getDrawers().then(m => m.openParametersModal(pkgId));
}

function openLocationModal() {
  getDrawers().then(m => m.openLocationModal(newCity => {
    currentCity = newCity;
    updateCityInUI();
  }));
}

function openCallbackModal() {
  getDrawers().then(m => m.openCallbackModal());
}

function updateCityInUI() {
  const headerCity = document.getElementById('header-city-text');
  if (headerCity) headerCity.textContent = currentCity;
  const mobileCity = document.getElementById('mobile-city-text');
  if (mobileCity) mobileCity.textContent = currentCity;
  const bannerCity = document.getElementById('banner-city-name');
  if (bannerCity) bannerCity.textContent = currentCity;
}

// ==========================================================================
// SEARCH & AUTOCOMPLETE LOGIC
// ==========================================================================
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return escapeHtml(text);
  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark class="search-hl">$1</mark>');
}

function searchItems(query: string): { matchingTests: TestItem[]; matchingPackages: PackageItem[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { matchingTests: [], matchingPackages: [] };

  const matchingTests = ALL_TESTS.filter(test => {
    const nameMatch = test.name.toLowerCase().includes(q);
    const catMatch = test.category.toLowerCase().includes(q);
    const descMatch = test.shortDesc.toLowerCase().includes(q);
    const paramMatch = test.parameters.some(p => p.toLowerCase().includes(q));

    const synonymMatch =
      ((q.includes('sugar') || q.includes('diabetes')) && (test.name.toLowerCase().includes('glucose') || test.name.toLowerCase().includes('hba1c'))) ||
      ((q.includes('kidney') || q.includes('renal') || q.includes('creatinine') || q.includes('bun') || q.includes('kft') || q.includes('rft')) && (test.name.toLowerCase().includes('bun') || test.name.toLowerCase().includes('creatinine') || test.name.toLowerCase().includes('kidney') || test.name.toLowerCase().includes('urine'))) ||
      ((q.includes('heart') || q.includes('cardiac') || q.includes('cholesterol') || q.includes('lipid')) && test.name.toLowerCase().includes('lipid')) ||
      ((q.includes('liver') || q.includes('hepatic') || q.includes('lft')) && (test.name.toLowerCase().includes('liver') || test.name.toLowerCase().includes('protein'))) ||
      ((q.includes('bone') || q.includes('calcium') || q.includes('vitamin')) && (test.name.toLowerCase().includes('calcium') || test.name.toLowerCase().includes('vitamin'))) ||
      ((q.includes('blood') || q.includes('cbc') || q.includes('hemoglobin') || q.includes('platelet')) && (test.name.toLowerCase().includes('cbc') || test.name.toLowerCase().includes('blood') || test.category.toLowerCase().includes('blood'))) ||
      ((q.includes('electrolyte') || q.includes('salt') || q.includes('sodium') || q.includes('potassium')) && (test.name.toLowerCase().includes('sodium') || test.name.toLowerCase().includes('potassium') || test.name.toLowerCase().includes('chloride') || test.name.toLowerCase().includes('carbon dioxide'))) ||
      ((q.includes('urine') || q.includes('uti')) && test.name.toLowerCase().includes('urine'));

    return nameMatch || catMatch || descMatch || paramMatch || synonymMatch;
  });

  const matchingPackages = FEATURED_PACKAGES.filter(pkg => {
    const titleMatch = pkg.title.toLowerCase().includes(q);
    const catMatch = pkg.category.toLowerCase().includes(q);
    const tagMatch = pkg.tagline.toLowerCase().includes(q);
    const sumMatch = pkg.parametersSummary.toLowerCase().includes(q);
    const paramMatch = pkg.allParameters.some(cat => 
      cat.category.toLowerCase().includes(q) ||
      cat.tests.some(t => t.toLowerCase().includes(q))
    );

    const synonymMatch =
      (q.includes('full body') || q.includes('body checkup') || q.includes('checkup') || q.includes('preventative') || q.includes('package') || q.includes('healthy india')) ||
      ((q.includes('diabetes') || q.includes('diabetic') || q.includes('sugar') || q.includes('hba1c') || q.includes('prime')) && pkg.id === 'pkg-be-healthy-comprehensive') ||
      (q.includes('cbc') || q.includes('lft') || q.includes('kft') || q.includes('lipid'));

    return titleMatch || catMatch || tagMatch || sumMatch || paramMatch || synonymMatch;
  });

  return { matchingTests, matchingPackages };
}

function closeRecommendationsDropdown() {
  const dropdown = document.getElementById('hero-search-dropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
  }
  activeDropdownIndex = -1;
}

function renderRecommendationsDropdown(query: string) {
  const dropdown = document.getElementById('hero-search-dropdown');
  if (!dropdown) return;

  const q = query.trim();
  activeDropdownIndex = -1;

  if (!q) {
    dropdown.innerHTML = `
      <div class="dropdown-section">
        <div class="dropdown-section-title">POPULAR HEALTH PACKAGES</div>
        ${FEATURED_PACKAGES.map(pkg => `
          <div class="dropdown-item" data-type="package" data-id="${pkg.id}">
            <div class="item-icon-col pkg">🛡️</div>
            <div class="item-info-col">
              <div class="item-name">${escapeHtml(pkg.title)}</div>
              <div class="item-desc">${pkg.parametersCount} tests · NABL Accredited</div>
            </div>
            <div class="item-price-col">
              <span class="item-price">₹${pkg.pricing[1].price.toLocaleString('en-IN')}</span>
              <span class="item-badge-pill">Package</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="dropdown-section">
        <div class="dropdown-section-title">TOP SEARCHED TESTS</div>
        ${ALL_TESTS.filter(t => t.popular).slice(0, 4).map(test => `
          <div class="dropdown-item" data-type="test" data-id="${test.id}">
            <div class="item-icon-col test">🔬</div>
            <div class="item-info-col">
              <div class="item-name">${escapeHtml(test.name)}</div>
              <div class="item-desc">${test.fastingRequired ? `${test.fastingHours}h Fasting` : 'No Fasting'} · ${test.tatHours}h Report</div>
            </div>
            <div class="item-price-col">
              <span class="item-price">₹${test.price.toLocaleString('en-IN')}</span>
              <span class="item-badge-pill test">Test</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    dropdown.style.display = 'block';
    bindDropdownEvents(dropdown);
    return;
  }

  const { matchingTests, matchingPackages } = searchItems(q);
  const totalMatches = matchingPackages.length + matchingTests.length;

  if (totalMatches === 0) {
    dropdown.innerHTML = `
      <div class="dropdown-empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No matching tests or packages found</div>
        <div class="empty-desc">We offer 1000+ pathology tests. Need help finding a specialized marker?</div>
        <button class="btn-pill-primary btn-empty-cta" id="dropdown-request-call-btn">
          Request Doctor Callback
        </button>
      </div>
    `;
    dropdown.style.display = 'block';
    document.getElementById('dropdown-request-call-btn')?.addEventListener('click', () => {
      closeRecommendationsDropdown();
      openCallbackModal();
    });
    return;
  }

  let html = `<div class="dropdown-scroll-container">`;

  if (matchingPackages.length > 0) {
    html += `
      <div class="dropdown-section">
        <div class="dropdown-section-title">HEALTH PACKAGES (${matchingPackages.length})</div>
        ${matchingPackages.map(pkg => `
          <div class="dropdown-item" data-type="package" data-id="${pkg.id}">
            <div class="item-icon-col pkg">🛡️</div>
            <div class="item-info-col">
              <div class="item-name">${highlightMatch(pkg.title, q)}</div>
              <div class="item-desc">${pkg.parametersCount} tests · ${escapeHtml(pkg.parametersSummary.slice(0, 50))}...</div>
            </div>
            <div class="item-price-col">
              <span class="item-price">₹${pkg.pricing[1].price.toLocaleString('en-IN')}</span>
              <span class="item-badge-pill">Package</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (matchingTests.length > 0) {
    html += `
      <div class="dropdown-section">
        <div class="dropdown-section-title">CLINICAL TESTS (${matchingTests.length})</div>
        ${matchingTests.map(test => `
          <div class="dropdown-item" data-type="test" data-id="${test.id}">
            <div class="item-icon-col test">🔬</div>
            <div class="item-info-col">
              <div class="item-name">${highlightMatch(test.name, q)}</div>
              <div class="item-desc">${test.fastingRequired ? `${test.fastingHours}h Fasting` : 'No Fasting'} · Sample: ${test.sampleType}</div>
            </div>
            <div class="item-price-col">
              <span class="item-price">₹${test.price.toLocaleString('en-IN')}</span>
              <span class="item-badge-pill test">Test</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += `</div>`;

  html += `
    <div class="dropdown-footer" id="dropdown-view-all-footer">
      <span>View all ${totalMatches} results on Tests Directory</span>
      <span class="footer-arrow">➔</span>
    </div>
  `;

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
  bindDropdownEvents(dropdown);
}

function bindDropdownEvents(dropdown: HTMLElement) {
  dropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      const id = item.getAttribute('data-id')!;
      closeRecommendationsDropdown();

      if (type === 'package') {
        openBookingDrawerForPackage(id);
      } else if (type === 'test') {
        openBookingDrawerForTest(id);
      }
    });
  });

  const footer = dropdown.querySelector('#dropdown-view-all-footer');
  footer?.addEventListener('click', () => {
    const input = document.getElementById('hero-search-input') as HTMLInputElement;
    const term = input?.value.trim() || searchQuery;
    closeRecommendationsDropdown();
    navigateTo('tests', { search: term });
  });
}

function executeHomepageSearch(query: string) {
  searchQuery = query.trim();
  closeRecommendationsDropdown();

  if (!searchQuery) {
    clearHomepageSearch();
    return;
  }

  homepageResultFilter = 'all';

  const clearBtn = document.getElementById('hero-search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'flex';

  const resultsSection = document.getElementById('homepage-search-results-section');
  if (resultsSection) {
    resultsSection.style.display = 'block';
    renderHomepageSearchResults();
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // If not on homepage, navigate to tests page
    navigateTo('tests', { search: searchQuery });
  }
}

function clearHomepageSearch() {
  searchQuery = '';

  const heroInput = document.getElementById('hero-search-input') as HTMLInputElement;
  if (heroInput) heroInput.value = '';

  const clearBtn = document.getElementById('hero-search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'none';

  const resultsSection = document.getElementById('homepage-search-results-section');
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }

  closeRecommendationsDropdown();
}

function renderHomepageSearchResults() {
  const container = document.getElementById('homepage-search-results-container');
  if (!container) return;

  const { matchingTests, matchingPackages } = searchItems(searchQuery);
  const totalCount = matchingPackages.length + matchingTests.length;

  let showPackages = homepageResultFilter === 'all' || homepageResultFilter === 'packages';
  let showTests = homepageResultFilter === 'all' || homepageResultFilter === 'tests';

  if (totalCount === 0) {
    container.innerHTML = `
      <div class="hp-results-header">
        <div class="hp-results-title-row">
          <h2 class="hp-results-title">Search Results for "<span class="hp-query-highlight">${escapeHtml(searchQuery)}</span>"</h2>
          <button class="hp-clear-btn" id="hp-clear-search-btn">✕ Clear Search</button>
        </div>
      </div>
      <div class="hp-no-results-card">
        <div class="empty-icon" style="font-size: 2.4rem; margin-bottom: 12px;">🔍</div>
        <h3>No matching tests or packages found</h3>
        <p>We offer 1000+ pathology tests. You can reset your search, request a medical callback, or explore our full directory.</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-pill-primary" id="hp-empty-reset-btn" style="padding: 10px 24px;">Reset Search</button>
          <button class="btn-pill-secondary" id="hp-empty-callback-btn" style="padding: 10px 24px;">Request Doctor Callback</button>
        </div>
      </div>
    `;
    bindHomepageSearchResultsEvents();
    return;
  }

  container.innerHTML = `
    <div class="hp-results-header">
      <div class="hp-results-title-row">
        <div>
          <span class="section-eyebrow">INSTANT SEARCH RESULTS</span>
          <h2 class="hp-results-title">Found ${totalCount} Result${totalCount === 1 ? '' : 's'} for "<span class="hp-query-highlight">${escapeHtml(searchQuery)}</span>"</h2>
        </div>
        <button class="hp-clear-btn" id="hp-clear-search-btn">✕ Clear Search</button>
      </div>

      <div class="hp-filter-tabs">
        <button class="hp-filter-tab ${homepageResultFilter === 'all' ? 'active' : ''}" data-filter="all">
          All Matches (${totalCount})
        </button>
        <button class="hp-filter-tab ${homepageResultFilter === 'packages' ? 'active' : ''}" data-filter="packages">
          Packages (${matchingPackages.length})
        </button>
        <button class="hp-filter-tab ${homepageResultFilter === 'tests' ? 'active' : ''}" data-filter="tests">
          Individual Tests (${matchingTests.length})
        </button>
      </div>
    </div>

    <!-- PACKAGES MATCHES -->
    ${showPackages && matchingPackages.length > 0 ? `
      <div class="hp-results-subgroup">
        <h3 class="hp-subgroup-title">Matching Health Packages (${matchingPackages.length})</h3>
        <div class="packages-grid">
          ${matchingPackages.map(pkg => renderPackageCard(pkg)).join('')}
        </div>
      </div>
    ` : ''}

    <!-- TESTS MATCHES -->
    ${showTests && matchingTests.length > 0 ? `
      <div class="hp-results-subgroup">
        <h3 class="hp-subgroup-title">Matching Clinical Tests (${matchingTests.length})</h3>
        <div class="tests-catalog-grid">
          ${matchingTests.map(test => {
            const isInCart = store.isInCart(test.id);
            return `
              <div class="test-catalog-card" data-test-id="${test.id}">
                <span class="test-cat-tag">${test.category}</span>
                <h3 class="test-title">${highlightMatch(test.name, searchQuery)}</h3>
                <p class="test-desc">${test.shortDesc}</p>
                
                <div class="test-meta-pills">
                  <span class="meta-pill">Sample: ${test.sampleType}</span>
                  <span class="meta-pill ${test.fastingRequired ? 'fasting' : ''}">
                    ${test.fastingRequired ? `${test.fastingHours}h Fasting` : 'No Fasting'}
                  </span>
                  <span class="meta-pill tat">${test.tatHours}h Report</span>
                </div>

                <div class="test-card-footer">
                  <div class="test-price-box">
                    <span class="test-current-price">₹ ${test.price.toLocaleString('en-IN')}</span>
                    <span class="test-mrp-price">₹ ${test.mrp.toLocaleString('en-IN')}</span>
                    <span class="badge-discount">${test.discountPercent}% OFF</span>
                  </div>

                  <div class="card-buttons-row">
                    <button class="btn-add-cart ${isInCart ? 'added' : ''}" data-action="toggle-cart-test" data-test-id="${test.id}">
                      ${isInCart ? '✓ Added' : '+ Add'}
                    </button>
                    <button class="btn-book-test-sm" data-action="book-test" data-test-id="${test.id}">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}

    <div class="hp-results-footer">
      <a href="#/tests" id="hp-explore-full-catalog-link">Browse Full 1000+ Test Directory ➔</a>
    </div>
  `;

  bindHomepageSearchResultsEvents();
}

function bindHomepageSearchResultsEvents() {
  document.getElementById('hp-clear-search-btn')?.addEventListener('click', clearHomepageSearch);
  document.getElementById('hp-empty-reset-btn')?.addEventListener('click', clearHomepageSearch);
  document.getElementById('hp-empty-callback-btn')?.addEventListener('click', () => {
    clearHomepageSearch();
    openCallbackModal();
  });

  document.querySelectorAll('.hp-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      homepageResultFilter = tab.getAttribute('data-filter') as any;
      renderHomepageSearchResults();
    });
  });

  document.getElementById('hp-explore-full-catalog-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('tests', { search: searchQuery });
  });

  bindTestCardEvents();
  bindPackageCardEvents();
}

// ==========================================================================
// EVENT BINDINGS
// ==========================================================================
function bindGlobalEvents() {
  // Brand Logo
  document.getElementById('brand-logo-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Direct nav links
  document.getElementById('nav-direct-packages')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('packages');
  });

  document.getElementById('nav-direct-tests')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('tests');
  });

  // Header Cart Button
  document.getElementById('header-cart-btn')?.addEventListener('click', () => {
    openCartDrawer();
  });

  // Mobile Drawer Cart Button
  document.getElementById('mobile-drawer-cart-btn')?.addEventListener('click', () => {
    closeMobileDrawer();
    openCartDrawer();
  });

  // Cart Drawer Close Button
  document.getElementById('cart-drawer-close-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-drawer-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('cart-drawer-overlay')) closeCartDrawer();
  });

  // Location picker in header
  document.getElementById('open-city-modal-btn')?.addEventListener('click', openLocationModal);

  // Support link in header
  document.getElementById('header-support-btn')?.addEventListener('click', openCallbackModal);

  // Header primary CTA
  document.getElementById('header-book-cta')?.addEventListener('click', () => {
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });

  // Desktop Dropdown Toggles (Healthians mega menu)
  document.querySelectorAll('.dropdown-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.nav-item-dropdown');
      const wasActive = parent?.classList.contains('active');
      document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('active'));
      if (!wasActive) parent?.classList.add('active');
    });
  });

  // Close desktop dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.nav-item-dropdown')) {
      document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('active'));
    }
  });

  // Dropdown action items
  document.querySelectorAll('.nav-dropdown-menu [data-action]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('active'));
      const action = el.getAttribute('data-action');
      if (action === 'nav-pkg-book') {
        const pkgId = el.getAttribute('data-pkg-id')!;
        openBookingDrawerForPackage(pkgId);
      } else if (action === 'nav-pkg-route') {
        const filter = el.getAttribute('data-pkg-filter') || 'all';
        selectedPackageFilter = filter;
        navigateTo('packages');
      } else if (action === 'nav-tests-cat') {
        const cat = el.getAttribute('data-cat') || 'All';
        navigateTo('tests', { category: cat });
      } else if (action === 'nav-tests-search') {
        const term = el.getAttribute('data-term') || '';
        navigateTo('tests', { search: term });
      } else if (action === 'nav-callback') {
        openCallbackModal();
      } else if (action === 'nav-home-section') {
        const targetId = el.getAttribute('data-target-id');
        navigateTo('home');
        setTimeout(() => {
          if (targetId) document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  });

  // Mobile Drawer Toggle
  const mobileToggleBtn = document.getElementById('mobile-nav-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  mobileToggleBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-drawer-open');
  });

  const closeMobileDrawer = () => {
    mobileDrawer?.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('mobile-drawer-open');
  };

  mobileDrawerClose?.addEventListener('click', closeMobileDrawer);
  mobileDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) closeMobileDrawer();
  });

  // Mobile Drawer City Button
  document.getElementById('mobile-drawer-city-btn')?.addEventListener('click', () => {
    closeMobileDrawer();
    openLocationModal();
  });

  // Mobile Drawer Book Button
  document.getElementById('mobile-drawer-book-btn')?.addEventListener('click', () => {
    closeMobileDrawer();
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });

  // Mobile Accordion items
  document.querySelectorAll('[data-mobile-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.mobile-accordion-item');
      item?.classList.toggle('active');
    });
  });

  // Mobile Drawer Sublinks
  document.querySelectorAll('.mobile-sublink').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
      const action = link.getAttribute('data-action');
      if (action === 'nav-pkg-book') {
        const pkgId = link.getAttribute('data-pkg-id')!;
        openBookingDrawerForPackage(pkgId);
      } else if (action === 'nav-pkg-route') {
        const filter = link.getAttribute('data-pkg-filter') || 'all';
        selectedPackageFilter = filter;
        navigateTo('packages');
      } else if (action === 'nav-tests-cat') {
        const cat = link.getAttribute('data-cat') || 'All';
        navigateTo('tests', { category: cat });
      } else if (action === 'nav-tests-search') {
        const term = link.getAttribute('data-term') || '';
        navigateTo('tests', { search: term });
      }
    });
  });

  // Mobile Drawer Home link
  document.querySelectorAll('[data-action="nav-home"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      navigateTo('home');
    });
  });

  // Mobile Bottom Nav Bar
  document.querySelectorAll('.mob-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      if (target === 'home') {
        navigateTo('home');
      } else if (target === 'packages') {
        navigateTo('packages');
      } else if (target === 'tests') {
        navigateTo('tests');
      } else if (target === 'cart') {
        openCartDrawer();
      } else if (target === 'book') {
        openBookingDrawerForPackage('pkg-healthy-india-2026');
      }
    });
  });

  // Footer navigation links
  document.getElementById('footer-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });
  document.getElementById('footer-packages-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('packages');
  });
  document.getElementById('footer-tests-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('tests');
  });
  document.getElementById('footer-track-order-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('📦 Tracking: Enter your Booking ID in the live console.');
  });
  document.getElementById('footer-contact-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCallbackModal();
  });
  document.getElementById('footer-contact-us-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCallbackModal();
  });
  document.getElementById('footer-faqs-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('packages');
  });
  document.getElementById('footer-all-cities-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openLocationModal();
  });

  document.querySelectorAll('.footer-city-switch').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const city = el.getAttribute('data-city')!;
      store.setCity(city);
      currentCity = city;
      updateCityInUI();
      showToast(`📍 Switched city to ${city}`);
    });
  });

  // Listen for Cart Updates
  window.addEventListener('cart-updated', () => {
    updateCartBadges();
  });
}

function bindHomePageEvents() {
  // Explore Risk Cards Click
  document.querySelectorAll('[data-action="explore-risk"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const riskCat = btn.getAttribute('data-risk') || 'All';
      selectedCategory = riskCat;
      currentPage = 1;
      
      document.querySelectorAll('#category-filter-chips .filter-chip').forEach(b => {
        if (b.getAttribute('data-category') === riskCat) b.classList.add('active');
        else b.classList.remove('active');
      });

      document.querySelectorAll('.category-card').forEach(c => {
        if (c.getAttribute('data-cat') === riskCat) c.classList.add('active');
        else c.classList.remove('active');
      });

      renderCatalogTests();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.risk-card').forEach(card => {
    card.addEventListener('click', () => {
      const riskCat = card.getAttribute('data-risk-cat') || 'All';
      selectedCategory = riskCat;
      currentPage = 1;

      document.querySelectorAll('#category-filter-chips .filter-chip').forEach(b => {
        if (b.getAttribute('data-category') === riskCat) b.classList.add('active');
        else b.classList.remove('active');
      });

      document.querySelectorAll('.category-card').forEach(c => {
        if (c.getAttribute('data-cat') === riskCat) c.classList.add('active');
        else c.classList.remove('active');
      });

      renderCatalogTests();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hero CTAs
  document.getElementById('hero-book-btn')?.addEventListener('click', () => {
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });
  document.getElementById('hero-packages-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('hero-visual-card-book-btn')?.addEventListener('click', () => {
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });

  // Hero Search Input
  const heroInput = document.getElementById('hero-search-input') as HTMLInputElement;
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const heroClearBtn = document.getElementById('hero-search-clear-btn');

  heroInput?.addEventListener('input', () => {
    const val = heroInput.value;
    if (heroClearBtn) heroClearBtn.style.display = val ? 'flex' : 'none';
    renderRecommendationsDropdown(val);
  });

  heroInput?.addEventListener('focus', () => {
    renderRecommendationsDropdown(heroInput.value);
  });

  heroInput?.addEventListener('keydown', (e) => {
    const dropdown = document.getElementById('hero-search-dropdown');
    if (!dropdown || dropdown.style.display === 'none') {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeHomepageSearch(heroInput.value);
      }
      return;
    }

    const items = dropdown.querySelectorAll('.dropdown-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeDropdownIndex = (activeDropdownIndex + 1) % items.length;
      updateDropdownSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeDropdownIndex = (activeDropdownIndex - 1 + items.length) % items.length;
      updateDropdownSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeDropdownIndex >= 0 && activeDropdownIndex < items.length) {
        (items[activeDropdownIndex] as HTMLElement).click();
      } else {
        executeHomepageSearch(heroInput.value);
      }
    } else if (e.key === 'Escape') {
      closeRecommendationsDropdown();
    }
  });

  heroSearchBtn?.addEventListener('click', () => {
    if (heroInput) executeHomepageSearch(heroInput.value);
  });

  heroClearBtn?.addEventListener('click', () => {
    clearHomepageSearch();
    heroInput?.focus();
  });


  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    const searchWrapper = document.getElementById('hero-search-wrapper');
    if (searchWrapper && !searchWrapper.contains(e.target as Node)) {
      closeRecommendationsDropdown();
    }
  });

  // Explore by Category Cards click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat') || 'All';
      selectedCategory = cat;
      currentPage = 1;
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      document.querySelectorAll('#category-filter-chips .filter-chip').forEach(b => {
        if (b.getAttribute('data-category') === cat) b.classList.add('active');
        else b.classList.remove('active');
      });

      renderCatalogTests();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Catalog Search Input
  const catalogSearchField = document.getElementById('catalog-search-field') as HTMLInputElement;
  catalogSearchField?.addEventListener('input', () => {
    searchQuery = catalogSearchField.value.trim();
    if (heroInput) heroInput.value = searchQuery;
    currentPage = 1;
    renderCatalogTests();
  });

  // Catalog Sort Select
  const sortSelect = document.getElementById('catalog-sort-select') as HTMLSelectElement;
  sortSelect?.addEventListener('change', () => {
    selectedSort = sortSelect.value;
    currentPage = 1;
    renderCatalogTests();
  });

  // Category Filter Chips
  document.querySelectorAll('#category-filter-chips .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-category') || 'All';
      currentPage = 1;
      document.querySelectorAll('#category-filter-chips .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.category-card').forEach(c => {
        if (c.getAttribute('data-cat') === selectedCategory) c.classList.add('active');
        else c.classList.remove('active');
      });

      renderCatalogTests();
    });
  });

  // Pagination buttons
  document.getElementById('btn-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderCatalogTests();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('btn-next-page')?.addEventListener('click', () => {
    currentPage++;
    renderCatalogTests();
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Banner book home CTA
  document.getElementById('banner-book-home-btn')?.addEventListener('click', () => {
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });

  // Pre-footer bottom CTA
  document.getElementById('banner-bottom-book-cta')?.addEventListener('click', () => {
    openBookingDrawerForPackage('pkg-healthy-india-2026');
  });

  // Callback modal button
  document.getElementById('open-callback-modal-btn')?.addEventListener('click', openCallbackModal);

  // Bind Package Cards & Test Cards events
  bindPackageCardEvents();
  bindTestCardEvents();
}

function updateDropdownSelection(items: NodeListOf<Element>) {
  items.forEach((it, idx) => {
    if (idx === activeDropdownIndex) {
      it.classList.add('selected');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('selected');
    }
  });
}

function bindPackagesPageEvents() {
  // Filter pills
  document.querySelectorAll('.package-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      selectedPackageFilter = pill.getAttribute('data-pkg-filter') || 'all';
      document.querySelectorAll('.package-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const grid = document.getElementById('packages-page-grid');
      if (grid) {
        const filtered = getFilteredPackages(selectedPackageFilter);
        grid.innerHTML = filtered.map(pkg => renderPackageCard(pkg)).join('');
        bindPackageCardEvents();
      }
    });
  });

  bindPackageCardEvents();
}

function bindTestsPageEvents() {
  // Catalog search input
  const searchInput = document.getElementById('catalog-search-field') as HTMLInputElement;
  searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    renderCatalogTests();
  });

  // Catalog sort
  const sortSelect = document.getElementById('catalog-sort-select') as HTMLSelectElement;
  sortSelect?.addEventListener('change', () => {
    selectedSort = sortSelect.value;
    currentPage = 1;
    renderCatalogTests();
  });

  // Category filter chips
  document.querySelectorAll('#category-filter-chips .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-category') || 'All';
      currentPage = 1;
      document.querySelectorAll('#category-filter-chips .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalogTests();
    });
  });

  // Pagination buttons
  document.getElementById('btn-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderCatalogTests();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('btn-next-page')?.addEventListener('click', () => {
    currentPage++;
    renderCatalogTests();
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  bindTestCardEvents();
}

function bindPackageCardEvents() {
  // Multi-person button clicks in package cards
  document.querySelectorAll('.person-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pkgId = btn.getAttribute('data-pkg-id')!;
      const persons = Number(btn.getAttribute('data-persons')!);
      packagePersons[pkgId] = persons;

      // Re-render package cards on the page
      const card = btn.closest('.package-card');
      const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId);
      if (card && pkg) {
        card.outerHTML = renderPackageCard(pkg);
        bindPackageCardEvents();
      }
    });
  });

  // Book Package CTA
  document.querySelectorAll('[data-action="book-package"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.getAttribute('data-pkg-id')!;
      openBookingDrawerForPackage(pkgId);
    });
  });

  // Add to Cart button on packages
  document.querySelectorAll('[data-action="toggle-cart-pkg"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pkgId = btn.getAttribute('data-pkg-id')!;
      const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId);
      if (!pkg) return;

      const persons = packagePersons[pkg.id] || 1;
      const tier = pkg.pricing[persons] || pkg.pricing[1];

      if (store.isInCart(pkg.id)) {
        // If already in cart, open cart
        openCartDrawer();
      } else {
        store.addToCart({
          id: 'pkg_' + pkg.id + '_' + persons,
          itemId: pkg.id,
          name: pkg.title + (persons > 1 ? ` (${persons} Persons)` : ''),
          itemType: 'package',
          category: pkg.category,
          price: tier.price,
          mrp: tier.mrp,
          persons: persons,
          fastingHours: pkg.fastingHours
        });
        showToast(`✓ Added ${pkg.title} to cart`);
        updateCartBadges();
      }
    });
  });

  // View Parameters button
  document.querySelectorAll('[data-action="view-params"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.getAttribute('data-pkg-id')!;
      openParametersModal(pkgId);
    });
  });
}

function bindTestCardEvents() {
  // Book Test button
  document.querySelectorAll('[data-action="book-test"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const testId = btn.getAttribute('data-test-id')!;
      openBookingDrawerForTest(testId);
    });
  });

  // Add to Cart button on tests
  document.querySelectorAll('[data-action="toggle-cart-test"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const testId = btn.getAttribute('data-test-id')!;
      const test = ALL_TESTS.find(t => t.id === testId);
      if (!test) return;

      if (store.isInCart(test.id)) {
        openCartDrawer();
      } else {
        store.addToCart({
          id: 'test_' + test.id,
          itemId: test.id,
          name: test.name,
          itemType: 'test',
          category: test.category,
          price: test.price,
          mrp: test.mrp,
          persons: 1,
          fastingHours: test.fastingHours
        });
        showToast(`✓ Added ${test.name} to cart`);
        updateCartBadges();
      }
    });
  });
}



// ==========================================================================
// ==========================================================================
// APPLICATION INITIALIZATION & HASH LISTENER
// ==========================================================================
window.addEventListener('hashchange', () => {
  syncRouteFromHash();
  renderRouteView();
});

// Capture pre-rendered home HTML from DOM
const mainContainer = document.getElementById('main-content-view');
if (mainContainer) {
  initialHomeHtml = mainContainer.innerHTML;
}

// Initialize
syncRouteFromHash();
bindGlobalEvents();
if (currentRoute === 'home') {
  bindCurrentRouteEvents();
  updateCartBadges();
} else {
  renderRouteView();
}
