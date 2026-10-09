import './style.css';
import { ALL_TESTS, POPULAR_CITIES } from './data/tests';
import { FEATURED_PACKAGES } from './data/packages';
import { store } from './services/store';
import { ApiClient } from './services/api';
import type { Booking, PackageItem, TestItem, CartItem } from './types';

// App Routing & Filter State
type AppRoute = 'home' | 'packages' | 'tests';
let currentRoute: AppRoute = 'home';
let currentCity = store.getCity();

// Search & Catalog Filter State
let searchQuery = '';
let homepageSearchActive = false;
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
  'pkg-senior-citizen': 1,
  'pkg-women-wellness': 1,
  'pkg-diabetic-care': 1
};

// Checkout Drawer State
let activeBookingItem: {
  type: 'package' | 'test' | 'cart';
  id: string;
  name: string;
  price: number;
  mrp: number;
  persons: number;
  fastingHours: number;
  items?: CartItem[];
} | null = null;

let checkoutStep = 1;
let selectedSlot = '07:00 AM - 08:00 AM (Fasting Preferred)';
let isExpressSlot = false;
let selectedPaymentMethod: 'online_upi' | 'cash_on_collection' = 'online_upi';

// Root Element
const app = document.getElementById('app')!;

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

// ==========================================================================
// CORE SHELL RENDER (Header, Main View Container, Cart Drawer, Footer)
// ==========================================================================
function renderApp() {
  const cart = store.getCart();
  const cartCount = cart.length;

  app.innerHTML = `
    <!-- HEADER / NAVBAR -->
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <a href="#/" class="brand-logo" id="brand-logo-btn">
          <div class="logo-symbol">
            <span class="sq-navy"></span>
            <span class="sq-orange"></span>
            <span class="sq-sky"></span>
            <span class="sq-cyan"></span>
          </div>
          <div class="brand-text">
            <span class="brand-name">DIAGNOVA</span>
          </div>
        </a>

        <!-- Desktop Navigation with Dropdowns -->
        <nav class="main-nav" id="desktop-main-nav">
          <!-- Dropdown 1: Tests & Packages -->
          <div class="nav-item-dropdown" data-nav-dropdown="tests">
            <button class="nav-link dropdown-toggle-btn" type="button" aria-expanded="false">
              Tests &amp; Packages
              <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-menu mega-menu-tests">
              <div class="dropdown-columns-grid">
                <div class="dropdown-col">
                  <div class="dropdown-col-title">TOP BOOKED TESTS</div>
                  <a href="#/tests" class="dropdown-menu-item" data-action="nav-tests-search" data-term="Glucose">
                    <div class="menu-item-text">
                      <span class="menu-item-title">Fasting Blood Sugar (Glucose)</span>
                      <span class="menu-item-desc">₹120 · 4h Report</span>
                    </div>
                  </a>
                  <a href="#/tests" class="dropdown-menu-item" data-action="nav-tests-search" data-term="HbA1c">
                    <div class="menu-item-text">
                      <span class="menu-item-title">HbA1c Glycated Hemoglobin</span>
                      <span class="menu-item-desc">₹350 · 6h Report</span>
                    </div>
                  </a>
                  <a href="#/tests" class="dropdown-menu-item" data-action="nav-tests-search" data-term="CBC">
                    <div class="menu-item-text">
                      <span class="menu-item-title">Complete Blood Count (CBC)</span>
                      <span class="menu-item-desc">₹250 · 6h Report</span>
                    </div>
                  </a>
                </div>
                <div class="dropdown-col">
                  <div class="dropdown-col-title">POPULAR PACKAGES</div>
                  <a href="#packages-section" class="dropdown-menu-item" data-action="nav-pkg-book" data-pkg-id="pkg-healthy-india-2026">
                    <div class="menu-item-text">
                      <span class="menu-item-title">Full Body Checkup</span>
                      <span class="menu-item-desc">72 Tests · Report in 24 hours</span>
                    </div>
                  </a>
                  <a href="#packages-section" class="dropdown-menu-item" data-action="nav-pkg-book" data-pkg-id="pkg-be-healthy-comprehensive">
                    <div class="menu-item-text">
                      <span class="menu-item-title">Diabetes Care</span>
                      <span class="menu-item-desc">16 Tests · Fasting + HbA1c</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Dropdown 2: Health Checkups -->
          <div class="nav-item-dropdown" data-nav-dropdown="checkups">
            <button class="nav-link dropdown-toggle-btn" type="button" aria-expanded="false">
              Health Checkups
              <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-menu single-menu">
              <a href="#packages-section" class="dropdown-menu-item" data-action="nav-pkg-book" data-pkg-id="pkg-healthy-india-2026">
                <div class="menu-item-text">
                  <span class="menu-item-title">Full Body Checkup</span>
                  <span class="menu-item-desc">72 Parameters comprehensive checkup</span>
                </div>
              </a>
              <a href="#packages-section" class="dropdown-menu-item" data-action="nav-pkg-book" data-pkg-id="pkg-senior-citizen">
                <div class="menu-item-text">
                  <span class="menu-item-title">Thyroid Profile</span>
                  <span class="menu-item-desc">T3, T4, TSH &amp; Free T3</span>
                </div>
              </a>
              <a href="#packages-section" class="dropdown-menu-item" data-action="nav-pkg-book" data-pkg-id="pkg-women-wellness">
                <div class="menu-item-text">
                  <span class="menu-item-title">Women's Health</span>
                  <span class="menu-item-desc">CBC, Iron, Vitamin D &amp; Thyroid</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Dropdown 3: Diagnostics -->
          <div class="nav-item-dropdown" data-nav-dropdown="diagnostics">
            <button class="nav-link dropdown-toggle-btn" type="button" aria-expanded="false">
              Diagnostics
              <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-menu single-menu">
              <a href="#trust-section" class="dropdown-menu-item" data-action="nav-home-section" data-target-id="trust-section">
                <div class="menu-item-text">
                  <span class="menu-item-title">NABL Accredited Labs</span>
                  <span class="menu-item-desc">High quality automated clinical analyzers</span>
                </div>
              </a>
              <a href="#how-it-works-section" class="dropdown-menu-item" data-action="nav-home-section" data-target-id="how-it-works-section">
                <div class="menu-item-text">
                  <span class="menu-item-title">Smart Digital Reports</span>
                  <span class="menu-item-desc">Instant online report delivery on WhatsApp</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Dropdown 4: For Business -->
          <div class="nav-item-dropdown" data-nav-dropdown="business">
            <button class="nav-link dropdown-toggle-btn" type="button" aria-expanded="false">
              For Business
              <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-menu single-menu">
              <a href="#" class="dropdown-menu-item" data-action="nav-callback">
                <div class="menu-item-text">
                  <span class="menu-item-title">Corporate Employee Wellness</span>
                  <span class="menu-item-desc">Preventive on-site &amp; voucher checkups</span>
                </div>
              </a>
            </div>
          </div>

          <a href="#packages-section" class="nav-link">Health Library</a>
        </nav>

        <!-- Header Actions: Location, Help & Support, Cart, Book a Test -->
        <div class="header-actions">
          <!-- Location Pill -->
          <button class="location-pill-btn" id="open-city-modal-btn" type="button">
            <svg class="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span id="header-city-text">${currentCity}</span>
            <svg class="pill-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <!-- Help & Support -->
          <button class="header-support-btn" id="header-support-btn" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            <span>Help &amp; Support</span>
          </button>

          <!-- Cart Button -->
          <button class="header-cart-btn" id="header-cart-btn" title="View Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span class="cart-badge-count" id="header-cart-count">${cartCount}</span>
          </button>

          <button class="btn-header-cta" id="header-book-cta">
            Book a Test
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-nav-toggle-btn" id="mobile-nav-toggle-btn" aria-label="Open Navigation Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN VIEW CONTAINER -->
    <main class="main-content" id="main-content-view">
      <!-- Injected by renderRouteView() -->
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="container footer-grid">
        <!-- Col 1: Brand -->
        <div class="footer-col footer-col-brand">
          <div class="brand-logo footer-logo">
            <div class="logo-symbol">
              <span class="sq-navy"></span>
              <span class="sq-orange"></span>
              <span class="sq-sky"></span>
              <span class="sq-cyan"></span>
            </div>
            <div class="brand-text">
              <span class="brand-name">DIAGNOVA</span>
            </div>
          </div>
          <p class="footer-tagline">Better Diagnosis. Healthier Tomorrow.</p>
        </div>

        <!-- Col 2: Quick Links -->
        <div class="footer-col footer-col-links">
          <h4 class="footer-col-title">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#" id="footer-home-link">Home</a></li>
            <li><a href="#" id="footer-packages-link">Health Packages</a></li>
            <li><a href="#" id="footer-tests-link">All Lab Tests</a></li>
            <li><a href="#packages-section">Special Offers</a></li>
            <li><a href="#why-choose-section">Why Diagnova</a></li>
          </ul>
        </div>

        <!-- Col 3: Support -->
        <div class="footer-col footer-col-support">
          <h4 class="footer-col-title">Support</h4>
          <ul class="footer-links">
            <li><a href="#" id="footer-contact-link">Help &amp; Support</a></li>
            <li><a href="#" id="footer-track-order-link">Track Your Order</a></li>
            <li><a href="#" id="footer-contact-us-link">Request Callback</a></li>
            <li><a href="#" id="footer-faqs-link">FAQs &amp; Guidance</a></li>
          </ul>
        </div>

        <!-- Col 4: Our Locations -->
        <div class="footer-col footer-col-locations">
          <h4 class="footer-col-title">Our Locations</h4>
          <ul class="footer-links footer-locations-list">
            <li><a href="#" class="footer-city-switch" data-city="Bhopal">Bhopal</a></li>
            <li><a href="#" class="footer-city-switch" data-city="Indore">Indore</a></li>
            <li><a href="#" class="footer-city-switch" data-city="Jabalpur">Jabalpur</a></li>
            <li><a href="#" id="footer-all-cities-link" class="footer-link-highlight">View All Locations ➔</a></li>
          </ul>
        </div>

        <!-- Col 5: Download App -->
        <div class="footer-col footer-col-app">
          <h4 class="footer-col-title">Download Our App</h4>
          <p class="footer-app-subtitle">Book tests &amp; get reports faster</p>
          <div class="app-store-badges">
            <a href="#" class="store-badge-card" aria-label="Get it on Google Play">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3.6 1.9A1.5 1.5 0 0 0 3 3.3v17.4c0 .6.2 1.1.6 1.4l9.7-9.7L3.6 1.9z" fill="#4285F4"/><path d="M16.9 9L13.3 12.4l3.6 3.6 4.2-2.4c1.2-.7 1.2-1.8 0-2.5L16.9 9z" fill="#FBBC04"/><path d="M13.3 12.4L3.6 22.1c.4.3 1 .3 1.6 0l11.7-6.7-3.6-3z" fill="#EA4335"/><path d="M13.3 12.4l3.6-3.6L5.2 2c-.6-.3-1.2-.3-1.6 0l9.7 10.4z" fill="#34A853"/></svg>
              <div class="badge-text">
                <span class="badge-sub">GET IT ON</span>
                <span class="badge-main">Google Play</span>
              </div>
            </a>
            <a href="#" class="store-badge-card" aria-label="Download on App Store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.95 1.08.08 2.16-.47 2.81-1.29z"/></svg>
              <div class="badge-text">
                <span class="badge-sub">Download on the</span>
                <span class="badge-main">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="container footer-bottom-bar">
        <div class="footer-copyright">
          &copy; 2026 Diagnova. All rights reserved.
        </div>
        <div class="footer-legal-links">
          <a href="#">Privacy Policy</a>
          <span class="legal-sep">|</span>
          <a href="#">Terms &amp; Conditions</a>
          <span class="legal-sep">|</span>
          <a href="#">Sitemap</a>
        </div>
        <div class="footer-social-icons">
          <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
        </div>
      </div>
    </footer>

    <!-- MOBILE SIDE DRAWER -->
    <div class="mobile-drawer-overlay" id="mobile-drawer-overlay">
      <div class="mobile-drawer-content" id="mobile-drawer-content">
        <div class="mobile-drawer-header">
          <div class="brand-logo">
            <div class="logo-symbol">
              <span class="sq-navy"></span>
              <span class="sq-orange"></span>
              <span class="sq-sky"></span>
              <span class="sq-cyan"></span>
            </div>
            <div class="brand-text">
              <span class="brand-name">DIAGNOVA</span>
            </div>
          </div>
          <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close Menu">✕</button>
        </div>

        <div class="mobile-drawer-body">
          <div class="mobile-city-strip">
            <button class="mobile-city-pill" id="mobile-drawer-city-btn">
              📍 <span id="mobile-city-text">${currentCity}</span> ▾
            </button>
          </div>

          <div class="mobile-menu-links">
            <a href="#/" class="mobile-nav-link" data-action="nav-home">
              <span>🏠 Home</span>
            </a>
            <a href="#packages-section" class="mobile-nav-link" data-action="nav-packages">
              <span>📦 Health Packages</span>
            </a>
            <a href="#catalog-section" class="mobile-nav-link" data-action="nav-tests">
              <span>🔬 Tests Directory</span>
            </a>
          </div>

          <div class="mobile-drawer-cta-box">
            <button class="btn-drawer-primary" id="mobile-drawer-book-btn">
              Book a Test Now
            </button>
            <button class="btn-drawer-cart" id="mobile-drawer-cart-btn">
              <span>🛒 View Cart</span>
              <span class="drawer-cart-badge" id="mobile-cart-badge">${cartCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE BOTTOM NAVIGATION BAR -->
    <nav class="mobile-bottom-nav" id="mobile-bottom-nav">
      <button class="mob-nav-item active" data-target="home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>Home</span>
      </button>

      <button class="mob-nav-item" data-target="packages">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>Packages</span>
      </button>

      <button class="mob-nav-item" data-target="tests">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Tests</span>
      </button>

      <button class="mob-nav-item mob-cart-trigger" data-target="cart">
        <div class="mob-cart-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          <span class="mob-cart-badge" id="mob-cart-count">${cartCount}</span>
        </div>
        <span>Cart</span>
      </button>

      <button class="mob-nav-item mob-book-btn" data-target="book">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Book</span>
      </button>
    </nav>

    <!-- CART DRAWER OVERLAY & PANEL -->
    <div class="cart-drawer-overlay" id="cart-drawer-overlay">
      <div class="cart-drawer-panel">
        <div class="cart-drawer-header">
          <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
            <span>Your Health Cart</span>
            <span id="cart-drawer-count" style="font-size: 0.85rem; color: #64748b; font-weight: normal;">(${cartCount} items)</span>
          </h3>
          <button class="modal-close-btn" id="cart-drawer-close-btn">✕</button>
        </div>
        <div class="cart-drawer-body" id="cart-drawer-body">
          <!-- Rendered dynamically -->
        </div>
        <div class="cart-drawer-footer" id="cart-drawer-footer">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>

    <!-- MODALS ROOT CONTAINER -->
    <div id="modals-root"></div>
    <div class="toast-container" id="toast-container"></div>
  `;

  bindGlobalEvents();
  renderRouteView();
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

  if (currentRoute === 'packages') {
    container.innerHTML = renderPackagesPageView();
    bindPackagesPageEvents();
  } else if (currentRoute === 'tests') {
    container.innerHTML = renderTestsPageView();
    bindTestsPageEvents();
  } else {
    container.innerHTML = renderHomePageView();
    bindHomePageEvents();
  }

  updateCartBadges();
}

// ==========================================================================
// PAGE 1: HOMEPAGE (Complete Care Portal: Hero, Packages, Categories, Catalog Directory, How it Works, Trust)
// ==========================================================================
function renderHomePageView(): string {
  return `
    <!-- HERO SECTION -->
    <section class="hero-section" id="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-kicker">
            ACCURATE &nbsp;|&nbsp; RELIABLE &nbsp;|&nbsp; ALWAYS FOR YOU
          </div>
          <h1 class="hero-title">
            Better Health Starts With<br />
            <span class="hero-title-highlight">Better Diagnosis</span>
          </h1>
          <p class="hero-description">
            Trusted diagnostic tests, expert analysis and convenient home sample collection – all in one place.
          </p>

          <!-- HERO SEARCH BOX -->
          <div class="hero-search-wrapper" id="hero-search-wrapper">
            <div class="hero-search-bar" id="hero-search-bar">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                id="hero-search-input" 
                class="hero-search-input" 
                placeholder="Search tests, packages or health concerns" 
                value="${searchQuery}"
                autocomplete="off"
              />
              <button class="hero-search-clear-btn" id="hero-search-clear-btn" style="display: ${searchQuery ? 'flex' : 'none'};">✕</button>
              <button class="hero-search-arrow-btn" id="hero-search-btn" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

            <!-- SEARCH RECOMMENDATIONS AUTOCOMPLETE DROPDOWN -->
            <div class="hero-search-dropdown" id="hero-search-dropdown" style="display: none;"></div>
          </div>

          <!-- Hero Action Buttons -->
          <div class="hero-action-row">
            <button class="btn-hero-primary" id="hero-book-btn">
              Book a Test
            </button>
            <a href="#packages-section" class="btn-hero-outline" id="hero-packages-btn">
              View Packages
            </a>
          </div>
        </div>

        <!-- HERO RIGHT VISUAL -->
        <div class="hero-visual">
          <div class="hero-image-wrapper">
            <div class="hero-image-glow-bg"></div>
            <img src="/hero-doctor.jpg" alt="Pathologist Scientist" class="hero-doctor-img" />
            <div class="hero-floating-quote">
              <div class="quote-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div class="quote-content">
                <span class="quote-title">NABL Accredited</span>
                <span class="quote-sub">10M+ Trusted Checks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOMEPAGE IN-PLACE SEARCH RESULTS -->
    <section class="homepage-search-results-section" id="homepage-search-results-section" style="${homepageSearchActive && searchQuery ? 'display: block;' : 'display: none;'}">
      <div class="container" id="homepage-search-results-container">
        <!-- Rendered dynamically by renderHomepageSearchResults() -->
      </div>
    </section>

    <!-- 5-ITEM TRUST STRIP -->
    <section class="trust-strip" id="trust-section">
      <div class="container">
        <div class="trust-strip-inner">
          <div class="trust-item">
            <div class="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div class="trust-text">
              <h4>NABL Accredited Labs</h4>
              <p>High quality &amp; accurate results</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div class="trust-text">
              <h4>Home Sample Collection</h4>
              <p>Safe, convenient &amp; hygienic</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <div class="trust-text">
              <h4>Digital Reports</h4>
              <p>Access your reports online</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="trust-text">
              <h4>Experienced Phlebotomists</h4>
              <p>Trained &amp; professional staff</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="trust-text">
              <h4>10M+ Tests Delivered</h4>
              <p>Trusted by lakhs of customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- POPULAR HEALTH PACKAGES -->
    <section class="packages-section" id="packages-section">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-eyebrow">POPULAR HEALTH PACKAGES</span>
            <h2 class="section-heading">Complete Care for a Healthier You</h2>
          </div>
          <a href="#packages-section" class="section-view-all-link" id="home-view-all-packages-link">
            View All Packages ➔
          </a>
        </div>

        <div class="packages-grid">
          ${FEATURED_PACKAGES.slice(0, 4).map(pkg => renderPackageCard(pkg)).join('')}
        </div>
      </div>
    </section>

    <!-- EXPLORE BY CATEGORY -->
    <section class="categories-section" id="categories-section">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-eyebrow">EXPLORE BY CATEGORY</span>
            <h2 class="section-heading">Find the Right Test for Your Needs</h2>
          </div>
          <a href="#catalog-section" class="section-view-all-link">
            View All Categories ➔
          </a>
        </div>

        <div class="categories-row-grid">
          <div class="category-card ${selectedCategory === 'Blood Tests' ? 'active' : ''}" data-cat="Blood Tests">
            <div class="cat-circle-box cat-circle-blood">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </div>
            <span class="cat-title">Blood Tests</span>
          </div>

          <div class="category-card ${selectedCategory === 'Diabetes' || selectedCategory === 'Blood Sugar' ? 'active' : ''}" data-cat="Diabetes">
            <div class="cat-circle-box cat-circle-diabetes">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="4"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="12" cy="14" r="3"/></svg>
            </div>
            <span class="cat-title">Diabetes</span>
          </div>

          <div class="category-card ${selectedCategory === 'Thyroid' ? 'active' : ''}" data-cat="Thyroid">
            <div class="cat-circle-box cat-circle-thyroid">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M6 8c2 2 4 2 6 0 2 2 4 2 6 0M6 16c2-2 4-2 6 0 2-2 4-2 6 0"/></svg>
            </div>
            <span class="cat-title">Thyroid</span>
          </div>

          <div class="category-card ${selectedCategory === 'Heart' ? 'active' : ''}" data-cat="Heart">
            <div class="cat-circle-box cat-circle-heart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 11h2l1-2 2 4 1-2h2"/></svg>
            </div>
            <span class="cat-title">Heart</span>
          </div>

          <div class="category-card ${selectedCategory === 'Vitamins' || selectedCategory === 'Bone & Minerals' ? 'active' : ''}" data-cat="Vitamins">
            <div class="cat-circle-box cat-circle-vitamins">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            </div>
            <span class="cat-title">Vitamins</span>
          </div>

          <div class="category-card ${selectedCategory === 'Liver' || selectedCategory === 'Protein Profile' ? 'active' : ''}" data-cat="Liver">
            <div class="cat-circle-box cat-circle-liver">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14c0 4 4 6 8 6s8-2 8-6-4-8-8-8-8 4-8 8Z"/><path d="M12 6v14"/></svg>
            </div>
            <span class="cat-title">Liver</span>
          </div>

          <div class="category-card ${selectedCategory === 'Kidney' || selectedCategory === 'Kidney Function' ? 'active' : ''}" data-cat="Kidney">
            <div class="cat-circle-box cat-circle-kidney">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4c-2.5 0-4 2-4 5.5s2 6.5 4 6.5c1.5 0 2.5-1 3-2.5V4H8z"/><path d="M16 4c2.5 0 4 2 4 5.5s-2 6.5-4 6.5c-1.5 0-2.5-1-3-2.5V4h3z"/></svg>
            </div>
            <span class="cat-title">Kidney</span>
          </div>

          <div class="category-card ${selectedCategory === "Women's Health" ? 'active' : ''}" data-cat="Women's Health">
            <div class="cat-circle-box cat-circle-women">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M12 15v6"/><path d="M9 18h6"/></svg>
            </div>
            <span class="cat-title">Women's Health</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SEARCH & 1000+ TESTS CATALOG SECTION -->
    <section class="catalog-section" id="catalog-section" style="padding-top: 56px;">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-eyebrow">COMPREHENSIVE DIAGNOSTIC DIRECTORY</span>
            <h2 class="section-heading">Search &amp; Explore 1000+ Tests</h2>
          </div>
          <span class="page-indicator" id="catalog-count-badge">Loading tests...</span>
        </div>

        <div class="catalog-search-bar-row">
          <div class="catalog-search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              id="catalog-search-field" 
              class="catalog-search-input" 
              placeholder="Search tests by condition, organ, or keyword (e.g., Glucose, CBC, Creatinine)..." 
              value="${searchQuery}" 
            />
          </div>

          <select class="catalog-sort-select" id="catalog-sort-select">
            <option value="popular" ${selectedSort === 'popular' ? 'selected' : ''}>Most Popular</option>
            <option value="price-low" ${selectedSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-high" ${selectedSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
            <option value="tat" ${selectedSort === 'tat' ? 'selected' : ''}>Fastest Turnaround</option>
          </select>
        </div>

        <div class="catalog-filter-chips" id="category-filter-chips">
          ${['All', 'Blood Sugar', 'Blood Tests', 'Kidney Function', 'Electrolytes', 'Protein Profile', 'Bone & Minerals'].map(cat => `
            <button class="filter-chip ${selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Tests Cards Grid -->
        <div class="tests-catalog-grid" id="tests-grid-container">
          <!-- Injected by renderCatalogTests() -->
        </div>

        <!-- Pagination Controls -->
        <div class="catalog-pagination">
          <button class="btn-page-nav" id="btn-prev-page" disabled>Previous</button>
          <span class="page-indicator" id="page-indicator-text">Page 1</span>
          <button class="btn-page-nav" id="btn-next-page">Next ➔</button>
        </div>
      </div>
    </section>

    <!-- TESTS BY HEALTH RISK SECTION (From Healthians) -->
    <section class="health-risks-section" id="health-risks-section">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-eyebrow">PREVENTIVE SCREENING BY CONDITION</span>
            <h2 class="section-heading">Tests by Health Risk</h2>
          </div>
          <a href="#catalog-section" class="section-view-all-link" id="view-all-risks-link">
            View All Health Risks ➔
          </a>
        </div>

        <p class="section-subheading-text">
          Identify potential health conditions early with specialized clinical profiles designed by medical experts.
        </p>

        <div class="health-risks-grid">
          <!-- Risk 1: Diabetes -->
          <div class="risk-card risk-card-diabetes" data-risk-cat="Blood Sugar">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-diabetes">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="4"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="12" cy="14" r="3"/></svg>
              </div>
              <span class="risk-badge">High Risk</span>
            </div>
            <h3 class="risk-title">Diabetes Risk Profile</h3>
            <p class="risk-desc">Assess your risk of prediabetes and type-2 diabetes with essential blood sugar metrics.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">HbA1c</span>
              <span class="risk-test-tag">Fasting Glucose</span>
              <span class="risk-test-tag">Lipid Screen</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Blood Sugar">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 2: Heart Health -->
          <div class="risk-card risk-card-heart" data-risk-cat="Heart">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-heart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 11h2l1-2 2 4 1-2h2"/></svg>
              </div>
              <span class="risk-badge">Critical</span>
            </div>
            <h3 class="risk-title">Heart Health Risk</h3>
            <p class="risk-desc">Screen cardiovascular profile and lipid levels to detect coronary and hypertension risks.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">Lipid Profile</span>
              <span class="risk-test-tag">Cholesterol</span>
              <span class="risk-test-tag">Triglycerides</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Heart">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 3: Thyroid -->
          <div class="risk-card risk-card-thyroid" data-risk-cat="Thyroid">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-thyroid">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M6 8c2 2 4 2 6 0 2 2 4 2 6 0M6 16c2-2 4-2 6 0 2-2 4-2 6 0"/></svg>
              </div>
              <span class="risk-badge">Common</span>
            </div>
            <h3 class="risk-title">Thyroid Dysfunction</h3>
            <p class="risk-desc">Detect hyper- or hypothyroidism early to regulate energy, metabolism, and mood.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">Total T3</span>
              <span class="risk-test-tag">Total T4</span>
              <span class="risk-test-tag">TSH Ultra</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Thyroid">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 4: Kidney -->
          <div class="risk-card risk-card-kidney" data-risk-cat="Kidney Function">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-kidney">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4c-2.5 0-4 2-4 5.5s2 6.5 4 6.5c1.5 0 2.5-1 3-2.5V4H8z"/><path d="M16 4c2.5 0 4 2 4 5.5s-2 6.5-4 6.5c-1.5 0-2.5-1-3-2.5V4h3z"/></svg>
              </div>
              <span class="risk-badge">Renal</span>
            </div>
            <h3 class="risk-title">Kidney Function Risk</h3>
            <p class="risk-desc">Evaluate renal filtration efficiency and monitor early markers of chronic kidney stress.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">Creatinine</span>
              <span class="risk-test-tag">BUN</span>
              <span class="risk-test-tag">Uric Acid</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Kidney Function">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 5: Liver -->
          <div class="risk-card risk-card-liver" data-risk-cat="Protein Profile">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-liver">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14c0 4 4 6 8 6s8-2 8-6-4-8-8-8-8 4-8 8Z"/><path d="M12 6v14"/></svg>
              </div>
              <span class="risk-badge">Hepatic</span>
            </div>
            <h3 class="risk-title">Liver Health &amp; Detox</h3>
            <p class="risk-desc">Monitor liver enzymes, screening for fatty liver disease, jaundice, and cellular toxicity.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">SGPT (ALT)</span>
              <span class="risk-test-tag">SGOT (AST)</span>
              <span class="risk-test-tag">Bilirubin</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Protein Profile">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 6: Vitamins -->
          <div class="risk-card risk-card-vitamins" data-risk-cat="Bone & Minerals">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-vitamins">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
              </div>
              <span class="risk-badge">Deficiency</span>
            </div>
            <h3 class="risk-title">Vitamin &amp; Bone Health</h3>
            <p class="risk-desc">Identify severe Vitamin D &amp; Calcium depletion leading to osteoporosis and muscle fatigue.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">Vitamin D Total</span>
              <span class="risk-test-tag">Calcium</span>
              <span class="risk-test-tag">Phosphorus</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Bone & Minerals">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 7: Fatigue / Blood -->
          <div class="risk-card risk-card-blood" data-risk-cat="Blood Tests">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-blood">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <span class="risk-badge">Vitality</span>
            </div>
            <h3 class="risk-title">Fatigue &amp; Anaemia</h3>
            <p class="risk-desc">Uncover causes of chronic exhaustion, low hemoglobin, and cellular oxygenation deficits.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">CBC 24 Tests</span>
              <span class="risk-test-tag">Hemoglobin</span>
              <span class="risk-test-tag">RBC Indices</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Blood Tests">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Risk 8: Electrolytes / Hypertension -->
          <div class="risk-card risk-card-electrolytes" data-risk-cat="Electrolytes">
            <div class="risk-card-header">
              <div class="risk-icon-box risk-icon-electrolytes">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <span class="risk-badge">Electrolytes</span>
            </div>
            <h3 class="risk-title">Fluid Balance &amp; BP</h3>
            <p class="risk-desc">Check electrolyte balance to prevent muscle cramping, cardiac arrhythmias, and dehydration.</p>
            <div class="risk-key-tests">
              <span class="risk-test-tag">Sodium</span>
              <span class="risk-test-tag">Potassium</span>
              <span class="risk-test-tag">Chloride</span>
            </div>
            <div class="risk-card-footer">
              <button class="btn-risk-explore" data-action="explore-risk" data-risk="Electrolytes">
                <span>Check Risk Tests</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works-section" id="how-it-works-section">
      <div class="container">
        <div class="section-title-row">
          <div>
            <span class="section-eyebrow">HOW IT WORKS</span>
            <h2 class="section-heading">Simple Steps to Better Health</h2>
          </div>
        </div>

        <div class="how-it-works-grid">
          <!-- 3 Steps with horizontal arrows -->
          <div class="steps-flow-container">
            <div class="flow-step-item">
              <div class="flow-step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M9.5 12h5"/></svg>
              </div>
              <span class="step-counter-badge">01</span>
              <h3 class="step-title">Choose Your Test</h3>
              <p class="step-desc">Select from our wide range of tests and health packages.</p>
            </div>

            <div class="flow-arrow-separator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>

            <div class="flow-step-item">
              <div class="flow-step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <span class="step-counter-badge">02</span>
              <h3 class="step-title">Home Sample Collection</h3>
              <p class="step-desc">Our trained phlebotomists collect your sample at your convenience.</p>
            </div>

            <div class="flow-arrow-separator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>

            <div class="flow-step-item">
              <div class="flow-step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </div>
              <span class="step-counter-badge">03</span>
              <h3 class="step-title">Get Digital Report</h3>
              <p class="step-desc">View your reports online, anytime, from anywhere.</p>
            </div>
          </div>

          <!-- Phone mockup -->
          <div class="how-phone-mockup-wrapper">
            <img src="/phone-report.jpg" alt="Your Report is Ready" class="how-phone-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US SECTION (Healthians 6 Pillars) -->
    <section class="why-choose-section" id="why-choose-section">
      <div class="container">
        <div class="why-choose-header-center">
          <span class="section-eyebrow">OUR COMMITMENT TO CLINICAL EXCELLENCE</span>
          <h2 class="section-heading">Why Choose Diagnova</h2>
          <p class="why-choose-subtitle">
            Setting India's gold standard in clinical diagnostic precision, certified laboratories, and seamless doorstep healthcare.
          </p>
        </div>

        <div class="why-choose-grid">
          <!-- Pillar 1 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">01</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
            </div>
            <h3 class="why-card-title">Free &amp; On-Time Sample Collection</h3>
            <p class="why-card-desc">
              Safe, hygienic doorstep sample collection by vaccinated phlebotomists at your preferred morning slot.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">02</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle></svg>
              </div>
            </div>
            <h3 class="why-card-title">Free Report &amp; Diet Consultation</h3>
            <p class="why-card-desc">
              Complimentary telephonic report counselling and tailored dietary guidance from licensed doctors.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">03</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
            </div>
            <h3 class="why-card-title">NABL &amp; CAP Certified Precision</h3>
            <p class="why-card-desc">
              State-of-the-art robotic analyzers with AI-backed 3-level quality checks ensure 99.98% diagnostic accuracy.
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">04</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
            </div>
            <h3 class="why-card-title">Smart Digital Reports in 6 Hours</h3>
            <p class="why-card-desc">
              Interactive health reports delivered straight to WhatsApp and email with intuitive trend graphs and historical comparisons.
            </p>
          </div>

          <!-- Pillar 5 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">05</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <h3 class="why-card-title">Presence in 350+ Indian Cities</h3>
            <p class="why-card-desc">
              India's widest dedicated diagnostic footprint, serving millions of families from tier-1 capitals to tier-3 towns.
            </p>
          </div>

          <!-- Pillar 6 -->
          <div class="why-card">
            <div class="why-card-top">
              <span class="why-step-number">06</span>
              <div class="why-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
            </div>
            <h3 class="why-card-title">1 Crore+ Satisfied Customers</h3>
            <p class="why-card-desc">
              Over 10 million test reports delivered with complete transparency, zero hidden charges, and a 4.8/5 user satisfaction score.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUSTED BY MILLIONS PRE-FOOTER BANNER -->
    <section class="trusted-banner-section">
      <div class="container">
        <div class="trusted-banner-inner">
          <div class="trusted-banner-left">
            <span class="trusted-kicker">YOUR HEALTH. OUR PRIORITY.</span>
            <h2 class="trusted-title">Trusted by Millions<br />Across India</h2>
          </div>

          <div class="trusted-banner-middle">
            <div class="trusted-feature-item">
              <div class="trusted-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div class="trusted-feature-text">
                <strong>Accurate</strong>
                <span>&amp; Reliable Results</span>
              </div>
            </div>

            <div class="trusted-feature-item">
              <div class="trusted-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="trusted-feature-text">
                <strong>10M+</strong>
                <span>Happy Customers</span>
              </div>
            </div>

            <div class="trusted-feature-item">
              <div class="trusted-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <div class="trusted-feature-text">
                <strong>Dedicated</strong>
                <span>Customer Support</span>
              </div>
            </div>
          </div>

          <div class="trusted-banner-right">
            <button class="btn-trusted-cta" id="banner-bottom-book-cta">
              <span>Book a Test</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <div class="trusted-reassurance">Quick &bull; Easy &bull; Secure</div>
          </div>
        </div>
      </div>
    </section>

  `;
}
function renderPackagesPageView(): string {
  // Filter packages based on selectedPackageFilter
  let displayedPackages = FEATURED_PACKAGES;
  if (selectedPackageFilter === 'fullbody') {
    displayedPackages = FEATURED_PACKAGES.filter(p => p.id === 'pkg-healthy-india-2026' || p.id === 'pkg-be-healthy-comprehensive');
  } else if (selectedPackageFilter === 'senior') {
    displayedPackages = FEATURED_PACKAGES.filter(p => p.id === 'pkg-senior-citizen');
  } else if (selectedPackageFilter === 'women') {
    displayedPackages = FEATURED_PACKAGES.filter(p => p.id === 'pkg-women-wellness');
  } else if (selectedPackageFilter === 'diabetic') {
    displayedPackages = FEATURED_PACKAGES.filter(p => p.id === 'pkg-diabetic-care');
  }

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
            All Packages (5)
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'fullbody' ? 'active' : ''}" data-pkg-filter="fullbody">
            Full Body Screening
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'senior' ? 'active' : ''}" data-pkg-filter="senior">
            Senior Citizen (50+)
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'women' ? 'active' : ''}" data-pkg-filter="women">
            Women's Wellness
          </button>
          <button class="package-filter-pill ${selectedPackageFilter === 'diabetic' ? 'active' : ''}" data-pkg-filter="diabetic">
            Diabetic Care
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
            <input 
              type="text" 
              id="catalog-search-field" 
              class="catalog-search-input" 
              placeholder="Search by test name, symptom, or biomarker (e.g., Glucose, CBC, Lipid)..." 
              value="${searchQuery}" 
            />
          </div>

          <select class="catalog-sort-select" id="catalog-sort-select">
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
          <span class="page-indicator" id="catalog-count-badge">Loading tests...</span>
          <span style="font-size: 0.8rem; color: #64748b;">Click <strong>+ Add</strong> to book multiple tests together</span>
        </div>

        <!-- TESTS GRID -->
        <div class="tests-catalog-grid" id="tests-grid-container">
          <!-- Injected by renderCatalogTests() -->
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
function renderCatalogTests() {
  const container = document.getElementById('tests-grid-container');
  const countBadge = document.getElementById('catalog-count-badge');
  const prevBtn = document.getElementById('btn-prev-page') as HTMLButtonElement;
  const nextBtn = document.getElementById('btn-next-page') as HTMLButtonElement;
  const pageIndicator = document.getElementById('page-indicator-text');

  if (!container) return;

  // Filter tests by search & category
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

  // Sort tests
  if (selectedSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'tat') {
    filtered.sort((a, b) => a.tatHours - b.tatHours);
  } else {
    filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

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

  if (paginated.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🔍</span>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">No tests found matching "${searchQuery}"</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">Try adjusting your keyword or reset filters to explore our full 1000+ catalog.</p>
        <button class="btn-pill-primary" id="btn-reset-catalog-filter" style="padding: 8px 20px; font-size: 0.85rem;">Reset Filters</button>
      </div>
    `;
    document.getElementById('btn-reset-catalog-filter')?.addEventListener('click', () => {
      searchQuery = '';
      selectedCategory = 'All';
      currentPage = 1;
      const input = document.getElementById('catalog-search-field') as HTMLInputElement;
      if (input) input.value = '';
      renderCatalogTests();
    });
    return;
  }

  container.innerHTML = paginated.map(test => {
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
  }).join('');

  bindTestCardEvents();
}

// ==========================================================================
// CART DRAWER IMPLEMENTATION
// ==========================================================================
function openCartDrawer() {
  renderCartDrawerContent();
  const overlay = document.getElementById('cart-drawer-overlay');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cart-drawer-open');
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('cart-drawer-open');
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

function renderCartDrawerContent() {
  const cart = store.getCart();
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  if (!body || !footer) return;

  updateCartBadges();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-view">
        <div class="cart-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
        </div>
        <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">Your Cart is Empty</h4>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0; max-width: 280px; line-height: 1.5;">
          Add pathology tests or full-body health packages to book together in a single doorstep visit.
        </p>
        <button class="btn-pill-primary" id="btn-cart-empty-browse" style="margin-top: 12px;">
          Browse Tests &amp; Packages
        </button>
      </div>
    `;
    footer.innerHTML = '';
    document.getElementById('btn-cart-empty-browse')?.addEventListener('click', () => {
      closeCartDrawer();
      navigateTo('tests');
    });
    return;
  }

  // Calculate totals
  const totalMrp = cart.reduce((sum, item) => sum + (item.mrp || item.price), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = Math.max(0, totalMrp - totalPrice);
  const maxFasting = Math.max(...cart.map(item => item.fastingHours || 0));

  body.innerHTML = `
    <!-- FASTING REQUIREMENT NOTICE -->
    ${maxFasting > 0 ? `
      <div class="cart-fasting-alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div>
          <strong>Fasting Notice:</strong> Selected items require up to <strong>${maxFasting} hours</strong> of overnight fasting. Please select a morning slot during checkout.
        </div>
      </div>
    ` : ''}

    <!-- CART ITEMS LIST -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${cart.map(item => `
        <div class="cart-item-card" data-cart-id="${item.id}">
          <div class="cart-item-info">
            <span class="cart-item-badge ${item.itemType === 'package' ? 'pkg' : 'test'}">
              ${item.itemType === 'package' ? 'Health Package' : 'Clinical Test'}
            </span>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">
              ${item.fastingHours > 0 ? `<span class="fasting-pill">${item.fastingHours}h Fasting</span>` : '<span>No Fasting</span>'}
              ${item.persons > 1 ? `<span>• ${item.persons} Persons</span>` : ''}
              ${item.category ? `<span>• ${item.category}</span>` : ''}
            </div>
          </div>
          <div class="cart-item-price-col">
            <div class="cart-item-price">₹ ${item.price.toLocaleString('en-IN')}</div>
            ${item.mrp > item.price ? `<div class="cart-item-mrp">₹ ${item.mrp.toLocaleString('en-IN')}</div>` : ''}
            <button class="cart-item-remove-btn" data-action="remove-cart-item" data-cart-id="${item.id}" title="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></line></svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- BILL DETAILS -->
    <div class="cart-bill-box">
      <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Bill Summary</div>
      <div class="cart-bill-row">
        <span>Item Total (MRP)</span>
        <span>₹ ${totalMrp.toLocaleString('en-IN')}</span>
      </div>
      ${totalSavings > 0 ? `
        <div class="cart-bill-row discount">
          <span>Multi-Test Bundle Discount</span>
          <span>- ₹ ${totalSavings.toLocaleString('en-IN')}</span>
        </div>
      ` : ''}
      <div class="cart-bill-row">
        <span>Home Sample Collection</span>
        <span style="color: #16a34a; font-weight: 700;">FREE <span style="text-decoration: line-through; color: #94a3b8; font-weight: normal; font-size: 0.75rem;">₹150</span></span>
      </div>
      <div class="cart-bill-row">
        <span>NABL Cold-Chain Handling</span>
        <span style="color: #16a34a; font-weight: 700;">FREE</span>
      </div>
      <div class="cart-bill-row total">
        <span>Total Payable</span>
        <span style="color: #e27a3f;">₹ ${totalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-pill-primary" id="btn-proceed-cart-checkout" style="width: 100%; justify-content: space-between; padding: 14px 20px;">
      <span>Proceed to Book (${cart.length} item${cart.length === 1 ? '' : 's'})</span>
      <span>₹ ${totalPrice.toLocaleString('en-IN')} →</span>
    </button>
    <div style="text-align: center; font-size: 0.72rem; color: #64748b;">
      Safe &amp; Secure 256-bit Encrypted Checkout · Pay Online or on Visit
    </div>
  `;

  // Bind remove events
  body.querySelectorAll('[data-action="remove-cart-item"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartId = btn.getAttribute('data-cart-id');
      if (cartId) {
        store.removeFromCart(cartId);
        showToast('Item removed from cart');
        renderCartDrawerContent();
      }
    });
  });

  // Bind checkout proceed
  document.getElementById('btn-proceed-cart-checkout')?.addEventListener('click', () => {
    openBookingDrawerForCart();
  });
}

function openBookingDrawerForCart() {
  const cart = store.getCart();
  if (cart.length === 0) {
    showToast('⚠️ Your cart is empty. Please add tests or packages.');
    return;
  }

  closeCartDrawer();

  const totalMrp = cart.reduce((sum, item) => sum + (item.mrp || item.price), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const maxFasting = Math.max(...cart.map(item => item.fastingHours || 0));

  activeBookingItem = {
    type: 'cart',
    id: 'cart-booking-' + Date.now(),
    name: `${cart.length} Tests & Health Packages`,
    price: totalPrice,
    mrp: totalMrp,
    persons: 1,
    fastingHours: maxFasting,
    items: cart
  };

  checkoutStep = 1;
  renderBookingDrawer();
}

// ==========================================================================
// SINGLE ITEM BOOKING TRIGGER HELPERS
// ==========================================================================
function openBookingDrawerForPackage(pkgId: string) {
  const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId) || FEATURED_PACKAGES[0];
  const persons = packagePersons[pkg.id] || 1;
  const tier = pkg.pricing[persons] || pkg.pricing[1];

  activeBookingItem = {
    type: 'package',
    id: pkg.id,
    name: pkg.title,
    price: tier.price,
    mrp: tier.mrp,
    persons: persons,
    fastingHours: pkg.fastingHours
  };

  checkoutStep = 1;
  renderBookingDrawer();
}

function openBookingDrawerForTest(testId: string) {
  const test = ALL_TESTS.find(t => t.id === testId);
  if (!test) return;

  activeBookingItem = {
    type: 'test',
    id: test.id,
    name: test.name,
    price: test.price,
    mrp: test.mrp,
    persons: 1,
    fastingHours: test.fastingHours
  };

  checkoutStep = 1;
  renderBookingDrawer();
}

// ==========================================================================
// 4-STEP BOOKING DRAWER IMPLEMENTATION
// ==========================================================================
function renderBookingDrawer() {
  if (!activeBookingItem) return;
  document.body.classList.add('has-drawer-open');

  const modalsRoot = document.getElementById('modals-root')!;
  const today = new Date();
  const dateOptions = [0, 1, 2, 3].map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return {
      iso: d.toISOString().split('T')[0],
      display: offset === 0 ? 'Today' : (offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }))
    };
  });

  modalsRoot.innerHTML = `
    <div class="drawer-overlay active" id="drawer-overlay">
      <div class="drawer-panel" id="booking-drawer-panel">
        <div class="drawer-header">
          <div class="drawer-header-left">
            <button class="drawer-header-back-btn" id="drawer-header-back-btn" aria-label="Go back" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>${checkoutStep > 1 ? 'Back' : 'Back to Home'}</span>
            </button>
            <div class="drawer-header-title-box">
              <h3 class="drawer-header-title">Book Home Collection</h3>
              <span class="drawer-header-subtitle">Step ${checkoutStep} of 4 · ${activeBookingItem.name}</span>
            </div>
          </div>
          <button class="drawer-header-close-btn" id="close-drawer-btn" aria-label="Close booking" type="button">✕</button>
        </div>

        <div class="drawer-steps-indicator">
          <div class="drawer-step-pill ${checkoutStep >= 1 ? 'active' : ''}"></div>
          <div class="drawer-step-pill ${checkoutStep >= 2 ? 'active' : ''}"></div>
          <div class="drawer-step-pill ${checkoutStep >= 3 ? 'active' : ''}"></div>
          <div class="drawer-step-pill ${checkoutStep >= 4 ? 'active' : ''}"></div>
        </div>

        <div class="drawer-body" id="drawer-body-content">
          ${renderDrawerStepContent(dateOptions)}
        </div>

        <div class="drawer-footer">
          <div class="drawer-footer-actions">
            ${checkoutStep > 1 ? `
              <button class="drawer-footer-btn drawer-footer-btn-back" id="drawer-prev-step-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back</span>
              </button>
            ` : `
              <button class="drawer-footer-btn drawer-footer-btn-cancel" id="drawer-cancel-btn" type="button">
                <span>← Back</span>
              </button>
            `}
            <button class="drawer-footer-btn drawer-footer-btn-next" id="drawer-next-step-btn" type="button">
              <span>${checkoutStep === 4 ? `Confirm Booking (₹ ${activeBookingItem.price.toLocaleString('en-IN')})` : 'Continue →'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Drawer Events
  document.getElementById('close-drawer-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-cancel-btn')?.addEventListener('click', closeDrawer);
  
  document.getElementById('drawer-header-back-btn')?.addEventListener('click', () => {
    if (checkoutStep > 1) {
      checkoutStep--;
      renderBookingDrawer();
    } else {
      closeDrawer();
    }
  });

  document.getElementById('drawer-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('drawer-overlay')) closeDrawer();
  });

  document.getElementById('drawer-prev-step-btn')?.addEventListener('click', () => {
    if (checkoutStep > 1) {
      checkoutStep--;
      renderBookingDrawer();
    } else {
      closeDrawer();
    }
  });

  document.getElementById('drawer-next-step-btn')?.addEventListener('click', () => {
    handleDrawerNextStep();
  });

  // Slot card clicks
  document.querySelectorAll('.slot-radio-card').forEach(slotCard => {
    slotCard.addEventListener('click', () => {
      document.querySelectorAll('.slot-radio-card').forEach(c => c.classList.remove('active'));
      slotCard.classList.add('active');
      selectedSlot = slotCard.getAttribute('data-slot')!;
      isExpressSlot = slotCard.classList.contains('express');
    });
  });

  // Payment radio clicks
  document.querySelectorAll('[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedPaymentMethod = (e.target as HTMLInputElement).value as any;
    });
  });

  // Step 3 Live Pincode & Smart Lab Detection (Healthians Spec)
  if (checkoutStep === 3) {
    const drawerPinInput = document.getElementById('patient-pincode') as HTMLInputElement;
    const drawerStatusBox = document.getElementById('drawer-pincode-status');
    const cityField = document.getElementById('patient-city') as HTMLInputElement;

    const updateDrawerStatus = async (pin: string) => {
      if (pin.length !== 6 || !drawerStatusBox) return;
      drawerStatusBox.className = 'pincode-smart-badge';
      drawerStatusBox.innerHTML = '<span style="font-size: 0.78rem; color: #64748b;">🔍 Verifying pincode serviceability...</span>';
      try {
        const data = await ApiClient.checkPincode(pin);
        if (data.isServiceable) {
          drawerStatusBox.className = `pincode-smart-badge green`;
          drawerStatusBox.innerHTML = `
            <div style="font-weight: 800; font-size: 0.82rem; margin-bottom: 2px;">
              ${data.badgeText}
            </div>
            <div style="font-size: 0.78rem;"><strong>Address:</strong> ${data.locality} (${data.city})</div>
          `;
          if (cityField && (!cityField.value || cityField.value !== data.city)) {
            cityField.value = data.city;
          }
        } else {
          drawerStatusBox.className = 'pincode-smart-badge red';
          drawerStatusBox.innerHTML = '<div style="font-weight: 700; font-size: 0.8rem; color: #991b1b;">No service is available in this area</div>';
        }
      } catch (_err: any) {
        drawerStatusBox.className = 'pincode-smart-badge red';
        drawerStatusBox.innerHTML = '<div style="font-weight: 700; font-size: 0.8rem; color: #991b1b;">No service is available in this area</div>';
      }
    };

    if (drawerPinInput) {
      if (drawerPinInput.value.length === 6) {
        updateDrawerStatus(drawerPinInput.value);
      }

      drawerPinInput.addEventListener('input', () => {
        const clean = drawerPinInput.value.replace(/\D/g, '').slice(0, 6);
        drawerPinInput.value = clean;
        if (clean.length === 6) {
          updateDrawerStatus(clean);
        } else if (drawerStatusBox) {
          drawerStatusBox.innerHTML = '';
          drawerStatusBox.className = 'pincode-smart-badge';
        }
      });
    }
  }
}

function renderDrawerStepContent(dateOptions: { iso: string; display: string }[]): string {
  if (!activeBookingItem) return '';

  if (checkoutStep === 1) {
    return `
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Patient Information</h4>
      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
        Accurate age and gender are required by NABL pathology labs for clinical reference ranges.
      </p>

      <div class="form-group">
        <label class="form-label">Full Name (as per Aadhaar / ID) *</label>
        <input type="text" id="patient-name" class="form-input" placeholder="e.g., Rajesh Sharma" value="Rajesh Sharma" required />
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label">Mobile Number *</label>
          <input type="tel" id="patient-phone" class="form-input" placeholder="10-digit number" value="9826011223" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email (for Report) *</label>
          <input type="email" id="patient-email" class="form-input" placeholder="rajesh@gmail.com" value="rajesh@gmail.com" />
        </div>
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label">Age (Years) *</label>
          <input type="number" id="patient-age" class="form-input" placeholder="Age" value="38" min="1" max="120" required />
        </div>
        <div class="form-group">
          <label class="form-label">Gender *</label>
          <select id="patient-gender" class="form-input">
            <option value="Male" selected>Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      ${activeBookingItem.fastingHours > 0 ? `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 12px 14px; margin-top: 10px; font-size: 0.82rem; color: #92400e; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 1rem;">⚠️</span>
          <div><strong>Fasting Required:</strong> This booking requires ${activeBookingItem.fastingHours} hours of overnight fasting (water is allowed).</div>
        </div>
      ` : ''}
    `;
  }

  if (checkoutStep === 2) {
    return `
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Select Date &amp; Time Slot</h4>
      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
        Choose your preferred 1-hour arrival window for certified phlebotomist sample collection.
      </p>

      <div class="form-group">
        <label class="form-label">Preferred Date *</label>
        <select id="booking-date-select" class="form-input">
          ${dateOptions.map(d => `
            <option value="${d.iso}">${d.display} (${d.iso})</option>
          `).join('')}
        </select>
      </div>

      <label class="form-label" style="margin-top: 8px; margin-bottom: 8px;">Select 1-Hour Arrival Window *</label>
      <div class="time-slots-grid">
        <div class="slot-radio-card express active" data-slot="06:30 AM - 07:30 AM (Express Morning)">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">06:30 AM - 07:30 AM</strong>
            <span class="slot-badge slot-badge-green">BEST FOR FASTING</span>
          </div>
          <span class="slot-card-desc">Fastest morning turnaround · Minimal fasting discomfort</span>
        </div>

        <div class="slot-radio-card" data-slot="07:30 AM - 08:30 AM (Popular)">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">07:30 AM - 08:30 AM</strong>
            <span class="slot-badge slot-badge-blue">POPULAR</span>
          </div>
          <span class="slot-card-desc">Recommended for full body checkups</span>
        </div>

        <div class="slot-radio-card" data-slot="08:30 AM - 09:30 AM">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">08:30 AM - 09:30 AM</strong>
            <span style="font-size: 0.68rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">STANDARD</span>
          </div>
          <span class="slot-card-desc">Convenient standard morning slot</span>
        </div>

        <div class="slot-radio-card" data-slot="10:00 AM - 12:00 PM (Non-Fasting Only)">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">10:00 AM - 12:00 PM</strong>
            <span style="font-size: 0.68rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">LATE MORNING</span>
          </div>
          <span class="slot-card-desc">For tests that do NOT require strict overnight fasting</span>
        </div>
      </div>
    `;
  }

  if (checkoutStep === 3) {
    return `
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Home Collection Address</h4>
      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
        Our certified phlebotomist will arrive with sealed, sterile barcode sample kits.
      </p>

      <div class="form-group">
        <label class="form-label">Full Street Address &amp; Flat / House No. *</label>
        <textarea id="patient-address" class="form-input" rows="3" placeholder="e.g., Flat 402, Shalimar Heights, Arera Colony" required>Flat 402, Shalimar Heights, Arera Colony</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Landmark (Optional)</label>
        <input type="text" id="patient-landmark" class="form-input" placeholder="e.g., Near Habibganj Station" value="Near Habibganj Station" />
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label">City *</label>
          <input type="text" id="patient-city" class="form-input" value="${currentCity}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Pincode *</label>
          <input type="text" id="patient-pincode" class="form-input" placeholder="e.g., 462016" value="462016" maxlength="6" required />
        </div>
      </div>

      <!-- LIVE SMART LAB & PINCODE SERVICEABILITY BADGE (Healthians Spec) -->
      <div id="drawer-pincode-status" class="pincode-smart-badge"></div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 14px; margin-top: 14px; display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: #166534; line-height: 1.45;">
        <span style="font-size: 1.1rem; flex-shrink: 0;">🛡️</span>
        <div>Phlebotomist temperature verified daily. Sealed sterile BD tubes opened right before your eyes.</div>
      </div>
    `;
  }

  // Step 4: Summary & Payment
  return `
    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Review Order &amp; Confirm</h4>
    <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
      Review order details and select your preferred payment mode.
    </p>

    <!-- Itemized Breakdown -->
    <div class="order-summary-box">
      <div style="font-weight: 700; color: #0f172a; margin-bottom: 10px; font-size: 0.92rem;">Order Inclusions</div>
      ${activeBookingItem.type === 'cart' && activeBookingItem.items ? `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
          ${activeBookingItem.items.map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #334155;">
              <span>• ${item.name}</span>
              <strong>₹ ${item.price.toLocaleString('en-IN')}</strong>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #1e293b; margin-bottom: 12px;">
          <span style="font-weight: 600;">${activeBookingItem.name} (${activeBookingItem.persons} Member${activeBookingItem.persons > 1 ? 's' : ''})</span>
          <strong>₹ ${activeBookingItem.price.toLocaleString('en-IN')}</strong>
        </div>
      `}

      <div style="display: flex; justify-content: space-between; font-size: 0.84rem; color: #64748b; margin-bottom: 6px;">
        <span>Original MRP Total</span>
        <span style="text-decoration: line-through;">₹ ${activeBookingItem.mrp.toLocaleString('en-IN')}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.84rem; color: #16a34a; margin-bottom: 6px; font-weight: 600;">
        <span>Bundle Savings</span>
        <span>- ₹ ${(activeBookingItem.mrp - activeBookingItem.price).toLocaleString('en-IN')}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.84rem; color: #0284c7; margin-bottom: 10px; font-weight: 600;">
        <span>Home Sample Collection Fee</span>
        <span style="color: #16a34a;">FREE</span>
      </div>
      <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 1.15rem; font-weight: 800; color: #0f172a;">
        <span>Total Payable</span>
        <span style="color: #e27a3f;">₹ ${activeBookingItem.price.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <h4 style="font-size: 0.94rem; font-weight: 700; margin-top: 18px; margin-bottom: 10px; color: #0f172a;">Select Payment Method</h4>

    <div class="payment-methods-list">
      <label class="payment-method-card ${selectedPaymentMethod === 'online_upi' ? 'active' : ''}">
        <input type="radio" name="payment-method" value="online_upi" ${selectedPaymentMethod === 'online_upi' ? 'checked' : ''} />
        <div class="payment-method-content">
          <div class="payment-method-title">⚡ Instant Online Payment (UPI / QR / Cards)</div>
          <div class="payment-method-desc">Fastest verification · Google Pay, PhonePe, Paytm, NetBanking</div>
        </div>
      </label>

      <label class="payment-method-card ${selectedPaymentMethod === 'cash_on_collection' ? 'active' : ''}">
        <input type="radio" name="payment-method" value="cash_on_collection" ${selectedPaymentMethod === 'cash_on_collection' ? 'checked' : ''} />
        <div class="payment-method-content">
          <div class="payment-method-title">💵 Cash on Sample Collection (Pay on Visit)</div>
          <div class="payment-method-desc">Pay cash or UPI directly to our certified phlebotomist at doorstep</div>
        </div>
      </label>
    </div>
  `;
}

function handleDrawerNextStep() {
  if (checkoutStep === 1) {
    const name = (document.getElementById('patient-name') as HTMLInputElement)?.value;
    const phone = (document.getElementById('patient-phone') as HTMLInputElement)?.value;
    if (!name || !phone) {
      showToast('⚠️ Please enter Patient Name and Phone number');
      return;
    }
    checkoutStep = 2;
    renderBookingDrawer();
  } else if (checkoutStep === 2) {
    checkoutStep = 3;
    renderBookingDrawer();
  } else if (checkoutStep === 3) {
    const address = (document.getElementById('patient-address') as HTMLTextAreaElement)?.value;
    const pincode = (document.getElementById('patient-pincode') as HTMLInputElement)?.value;
    if (!address || !pincode) {
      showToast('⚠️ Please provide your full address and pincode');
      return;
    }
    checkoutStep = 4;
    renderBookingDrawer();
  } else if (checkoutStep === 4) {
    executeBooking();
  }
}

async function executeBooking() {
  if (!activeBookingItem) return;

  const btn = document.getElementById('drawer-next-step-btn') as HTMLButtonElement;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Securing Booking...';
  }

  const patientName = (document.getElementById('patient-name') as HTMLInputElement)?.value || 'Rajesh Sharma';
  const patientPhone = (document.getElementById('patient-phone') as HTMLInputElement)?.value || '9826011223';
  const patientEmail = (document.getElementById('patient-email') as HTMLInputElement)?.value || 'rajesh@gmail.com';
  const patientAge = Number((document.getElementById('patient-age') as HTMLInputElement)?.value) || 38;
  const patientGender = ((document.getElementById('patient-gender') as HTMLSelectElement)?.value || 'Male') as any;
  const patientAddress = (document.getElementById('patient-address') as HTMLTextAreaElement)?.value || 'Flat 402, Shalimar Heights';
  const patientLandmark = (document.getElementById('patient-landmark') as HTMLInputElement)?.value || '';
  const patientCity = (document.getElementById('patient-city') as HTMLInputElement)?.value || currentCity;
  const patientPincode = (document.getElementById('patient-pincode') as HTMLInputElement)?.value || '462016';
  const scheduledDate = (document.getElementById('booking-date-select') as HTMLSelectElement)?.value || new Date().toISOString().split('T')[0];

  const cartItems = activeBookingItem.type === 'cart' ? store.getCart() : undefined;

  const booking = await store.createBooking({
    itemType: activeBookingItem.type,
    itemId: activeBookingItem.id,
    itemName: activeBookingItem.name,
    items: cartItems,
    persons: activeBookingItem.persons,
    scheduledDate: scheduledDate,
    scheduledSlot: selectedSlot,
    isExpress: isExpressSlot,
    baseAmount: activeBookingItem.mrp,
    discountAmount: activeBookingItem.mrp - activeBookingItem.price,
    collectionFee: 0,
    totalAmount: activeBookingItem.price,
    paymentMethod: selectedPaymentMethod,
    paymentStatus: selectedPaymentMethod === 'online_upi' ? 'paid' : 'pending',
    patient: {
      fullName: patientName,
      phone: patientPhone,
      email: patientEmail,
      age: patientAge,
      gender: patientGender,
      address: patientAddress,
      landmark: patientLandmark,
      city: patientCity,
      pincode: patientPincode
    }
  });

  // If this was a cart checkout, clear cart now
  if (activeBookingItem.type === 'cart') {
    store.clearCart();
    updateCartBadges();
  }

  closeDrawer();

  // Trigger celebration confetti on demand
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }).catch(() => {});

  openConfirmationModal(booking);
}

function closeDrawer() {
  const modalsRoot = document.getElementById('modals-root');
  if (modalsRoot) modalsRoot.innerHTML = '';
  document.body.classList.remove('has-drawer-open', 'modal-open');
  activeBookingItem = null;
  checkoutStep = 1;
}

// ==========================================================================
// CONFIRMATION & RECEIPT MODALS
// ==========================================================================
function openConfirmationModal(booking: Booking) {
  const modalsRoot = document.getElementById('modals-root')!;
  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="confirm-modal-overlay">
      <div class="modal-card" style="max-width: 520px; text-align: center; padding: 36px 28px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 16px;">
          ✓
        </div>

        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Booking Confirmed!</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 20px;">
          Your home sample collection slot has been scheduled with cold-chain tracking.
        </p>

        <!-- Booking ID Badge -->
        <div style="background: #f1f5f9; border-radius: 10px; padding: 12px; margin-bottom: 20px; display: inline-block;">
          <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">BOOKING ID</span>
          <div style="font-size: 1.3rem; font-weight: 800; color: #1b449c;">${booking.id}</div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: left; font-size: 0.85rem; color: #334155; margin-bottom: 24px; line-height: 1.6;">
          <div><strong>Package/Tests:</strong> ${booking.itemName} (${booking.persons} Member${booking.persons > 1 ? 's' : ''})</div>
          <div><strong>Patient:</strong> ${booking.patient.fullName} (${booking.patient.phone})</div>
          <div><strong>Slot:</strong> ${booking.scheduledDate} at ${booking.scheduledSlot}</div>
          <div><strong>Address:</strong> ${booking.patient.address}, ${booking.patient.city}</div>
          <div><strong>Payment:</strong> ${booking.paymentMethod === 'online_upi' ? 'Online (Paid Verified)' : 'Cash on Collection (Pay on Visit)'} - <strong style="color: #e27a3f;">₹ ${booking.totalAmount.toLocaleString('en-IN')}</strong></div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button class="btn-pill-primary" id="btn-download-pdf-receipt" style="width: 100%;">
            📄 Download Official PDF Receipt
          </button>
          
          <button class="btn-pill-secondary" id="btn-view-email-receipt" style="width: 100%;">
            ✉️ View Dispatched Email Receipt
          </button>

          <button class="btn-page-nav" id="btn-done-confirmation" style="margin-top: 4px;">
            Done &amp; Return to Home
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-download-pdf-receipt')?.addEventListener('click', async () => {
    showToast('📥 Generating PDF Booking Voucher...');
    try {
      const { generateBookingReceiptPDF } = await import('./services/pdfGenerator');
      await generateBookingReceiptPDF(booking);
    } catch {
      showToast('⚠️ Could not generate PDF voucher.');
    }
  });

  document.getElementById('btn-view-email-receipt')?.addEventListener('click', () => {
    openEmailSimulationModal(booking);
  });

  document.getElementById('btn-done-confirmation')?.addEventListener('click', () => {
    modalsRoot.innerHTML = '';
  });
}

function openEmailSimulationModal(booking: Booking) {
  const modalsRoot = document.getElementById('modals-root')!;
  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="email-modal-overlay">
      <div class="modal-card" style="max-width: 640px; padding: 0;">
        <div class="modal-header" style="background: #f8fafc;">
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Dispatched To: ${booking.patient.email || 'patient@gmail.com'}</div>
            <h3 style="font-size: 1.1rem; color: #0f172a;">Subject: Booking Confirmation - ${booking.itemName} [${booking.id}]</h3>
          </div>
          <button class="modal-close-btn" id="close-email-modal-btn">✕</button>
        </div>

        <div class="modal-body" style="background: #ffffff; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 0.9rem; line-height: 1.6; color: #1e293b;">
          <div style="text-align: center; border-bottom: 2px solid #1b449c; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #1b449c; font-size: 1.4rem; font-weight: 800; margin: 0;">TESTBUDDY LABS</h2>
            <p style="font-size: 0.78rem; color: #64748b; margin: 4px 0 0 0;">NABL Accredited Diagnostics · 100% Barcoded Cold-Chain</p>
          </div>

          <p>Dear <strong>${booking.patient.fullName}</strong>,</p>
          <p>Thank you for choosing TestBuddy Labs. Your appointment for doorstep sample collection has been confirmed.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 8px; overflow: hidden;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Booking ID</td>
              <td style="padding: 10px 14px; font-weight: 800; color: #1b449c;">${booking.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Tests / Items</td>
              <td style="padding: 10px 14px; font-weight: 700;">${booking.itemName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Date &amp; Time Slot</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #e27a3f;">${booking.scheduledDate} at ${booking.scheduledSlot}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Collection Address</td>
              <td style="padding: 10px 14px;">${booking.patient.address}, ${booking.patient.city} - ${booking.patient.pincode}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Total Amount</td>
              <td style="padding: 10px 14px; font-weight: 800;">₹ ${booking.totalAmount.toLocaleString('en-IN')} (${booking.paymentMethod === 'online_upi' ? 'Paid Online' : 'Pay on Sample Collection'})</td>
            </tr>
          </table>

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 18px; font-size: 0.82rem; color: #92400e;">
            <strong>Pre-Test Preparation:</strong> Please adhere to the recommended 10-12 hours overnight fasting if applicable. Only plain water is permitted. Our certified phlebotomist will arrive with sealed, single-use barcoded vacuum tubes.
          </div>

          <p style="font-size: 0.8rem; color: #64748b;">
            Need to reschedule? Call our toll-free support line at <strong>1800-8378-283</strong> or reply directly to this email.
          </p>
        </div>

        <div class="modal-header" style="justify-content: flex-end; gap: 10px;">
          <button class="btn-pill-primary" id="btn-email-download-pdf">Download PDF Receipt</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-email-modal-btn')?.addEventListener('click', () => {
    openConfirmationModal(booking);
  });

  document.getElementById('btn-email-download-pdf')?.addEventListener('click', async () => {
    showToast('📥 Generating PDF Booking Voucher...');
    try {
      const { generateBookingReceiptPDF } = await import('./services/pdfGenerator');
      await generateBookingReceiptPDF(booking);
    } catch {
      showToast('⚠️ Could not generate PDF voucher.');
    }
  });
}

function openParametersModal(pkgId: string) {
  const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId) || FEATURED_PACKAGES[0];
  const modalsRoot = document.getElementById('modals-root')!;

  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="params-modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3 style="font-size: 1.15rem; color: #0f172a;">${pkg.title}</h3>
            <span style="font-size: 0.8rem; color: #0284c7; font-weight: 700;">Includes ${pkg.parametersCount} Clinical Parameters</span>
          </div>
          <button class="modal-close-btn" id="close-params-modal-btn">✕</button>
        </div>

        <div class="modal-body">
          ${pkg.allParameters.map(group => `
            <div style="margin-bottom: 18px;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: #1b449c; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                ${group.category}
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${group.tests.map(t => `
                  <span style="background: #f1f5f9; color: #334155; font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 6px;">
                    ${t}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.75rem; color: #64748b;">Starting from</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">₹ ${pkg.pricing[1].price.toLocaleString('en-IN')}</div>
            </div>
            <button class="btn-pill-primary" id="modal-book-pkg-now">
              Book This Package
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-params-modal-btn')?.addEventListener('click', () => {
    modalsRoot.innerHTML = '';
  });

  document.getElementById('modal-book-pkg-now')?.addEventListener('click', () => {
    modalsRoot.innerHTML = '';
    openBookingDrawerForPackage(pkg.id);
  });
}

function openLocationModal() {
  const modalsRoot = document.getElementById('modals-root')!;
  document.body.classList.add('modal-open');
  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="city-modal-overlay">
      <div class="modal-card" style="max-width: 480px;">
        <div class="modal-header">
          <h3>Select Your City</h3>
          <button class="modal-close-btn" id="close-city-modal-btn">✕</button>
        </div>

        <div class="modal-body">
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">
            Choose your city to check home collection slots and phlebotomist availability.
          </p>

          <!-- Hyperlocal Pincode Checker (Healthians Spec) -->
          <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
            <label style="display: block; font-size: 0.74rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
              📍 Check Service by PIN Code
            </label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="modal-pincode-input" placeholder="e.g. 462016" maxlength="6" style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none;" />
              <button id="modal-check-pin-btn" class="btn-pill-primary" style="padding: 0 16px; height: 38px; font-size: 0.8rem;">Check</button>
            </div>
            <div id="modal-pincode-result" style="margin-top: 8px; display: none;"></div>
          </div>

          <button class="btn-detect-gps" id="btn-detect-gps">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Detect My Current Location (GPS)</span>
          </button>

          <h4 class="modal-cities-heading">Popular Cities</h4>

          <div class="modal-city-grid">
            ${POPULAR_CITIES.map(city => `
              <button class="modal-city-btn ${city.name === currentCity ? 'active' : ''}" data-city="${city.name}">
                <span class="city-pin">📍</span>
                <span class="city-name">${city.name}</span>
                ${city.name === currentCity ? '<span class="city-check">✓</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-city-modal-btn')?.addEventListener('click', () => {
    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  const modalPinInput = document.getElementById('modal-pincode-input') as HTMLInputElement;
  const modalCheckBtn = document.getElementById('modal-check-pin-btn');
  const modalPinRes = document.getElementById('modal-pincode-result');

  const handleModalPinCheck = async (pinVal: string) => {
    if (pinVal.length !== 6 || !modalPinRes) return;
    modalPinRes.style.display = 'block';
    modalPinRes.className = 'hero-pincode-result';
    modalPinRes.innerHTML = '🔍 Checking serviceability...';
    try {
      const data = await ApiClient.checkPincode(pinVal);
      if (data.isServiceable) {
        modalPinRes.className = `hero-pincode-result green`;
        modalPinRes.innerHTML = `
          <div style="font-weight: 800; font-size: 0.82rem;">${data.badgeText}</div>
          <div><strong>Address:</strong> ${data.locality} (${data.city})</div>
        `;
        store.setCity(data.city);
        currentCity = data.city;
        updateCityInUI();
        showToast(`📍 Coverage confirmed for ${data.locality}`);
      } else {
        modalPinRes.className = 'hero-pincode-result red';
        modalPinRes.innerHTML = `<div style="font-weight: 700; font-size: 0.82rem; color: #991b1b;">No service is available in this area</div>`;
      }
    } catch (_err: any) {
      modalPinRes.className = 'hero-pincode-result red';
      modalPinRes.innerHTML = `<div style="font-weight: 700; font-size: 0.82rem; color: #991b1b;">No service is available in this area</div>`;
    }
  };

  modalCheckBtn?.addEventListener('click', () => {
    if (modalPinInput) handleModalPinCheck(modalPinInput.value);
  });

  modalPinInput?.addEventListener('input', () => {
    const clean = modalPinInput.value.replace(/\D/g, '').slice(0, 6);
    modalPinInput.value = clean;
    if (clean.length === 6) {
      handleModalPinCheck(clean);
    }
  });

  document.querySelectorAll('.modal-city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city')!;
      store.setCity(city);
      currentCity = city;
      updateCityInUI();
      modalsRoot.innerHTML = '';
      document.body.classList.remove('modal-open');
      showToast(`📍 City updated to ${city}`);
    });
  });

  const gpsBtn = document.getElementById('btn-detect-gps');
  gpsBtn?.addEventListener('click', async () => {
    gpsBtn.textContent = 'Detecting location...';
    const result = await store.detectBrowserLocation();
    currentCity = result.city;
    updateCityInUI();
    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    showToast(`📍 Location detected: ${result.city}`);
  });
}

function openCallbackModal() {
  const modalsRoot = document.getElementById('modals-root')!;
  document.body.classList.add('modal-open');
  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="callback-modal-overlay">
      <div class="modal-card" style="max-width: 480px;">
        <div class="modal-header">
          <h3>Request Free Doctor Callback</h3>
          <button class="modal-close-btn" id="close-callback-modal-btn">✕</button>
        </div>

        <div class="modal-body">
          <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 16px;">
            Our medical counselors will call you in 15 minutes to guide you on required tests and home collection slots.
          </p>

          <form id="callback-lead-form">
            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input type="text" id="lead-name" class="form-input" placeholder="e.g., Ananya Verma" required />
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" id="lead-phone" class="form-input" placeholder="10-digit number" required />
            </div>

            <div class="form-group">
              <label class="form-label">Health Concern / Symptoms (Optional)</label>
              <textarea id="lead-query" class="form-input" rows="2" placeholder="e.g., Doctor advised blood test for fatigue, diabetes checkup"></textarea>
            </div>

            <button type="submit" class="btn-pill-primary" style="width: 100%; margin-top: 10px;">
              Request Immediate Callback ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-callback-modal-btn')?.addEventListener('click', () => {
    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  document.getElementById('callback-lead-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('lead-name') as HTMLInputElement).value;
    const phone = (document.getElementById('lead-phone') as HTMLInputElement).value;
    const query = (document.getElementById('lead-query') as HTMLTextAreaElement).value;

    await store.createCallbackLead({
      name,
      phone,
      city: currentCity,
      query
    });

    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    showToast('✓ Request received! A medical counselor will call you shortly.');
  });
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
      ((q.includes('diabetes') || q.includes('sugar') || q.includes('hba1c')) && pkg.id === 'pkg-be-healthy-comprehensive') ||
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

  homepageSearchActive = true;
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
  homepageSearchActive = false;

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

  // Bind Package Cards events (+ Add to Cart, Book Now, Person Selector)
  bindPackageCardEvents();

  // Initial render of tests in catalog section
  renderCatalogTests();
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
        let filtered = FEATURED_PACKAGES;
        if (selectedPackageFilter === 'fullbody') {
          filtered = FEATURED_PACKAGES.filter(p => p.id === 'pkg-healthy-india-2026' || p.id === 'pkg-be-healthy-comprehensive');
        } else if (selectedPackageFilter === 'senior') {
          filtered = FEATURED_PACKAGES.filter(p => p.id === 'pkg-senior-citizen');
        } else if (selectedPackageFilter === 'women') {
          filtered = FEATURED_PACKAGES.filter(p => p.id === 'pkg-women-wellness');
        } else if (selectedPackageFilter === 'diabetic') {
          filtered = FEATURED_PACKAGES.filter(p => p.id === 'pkg-diabetic-care');
        }
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

  renderCatalogTests();
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
// TOAST NOTIFICATIONS HELPER
// ==========================================================================
function showToast(message: string) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// APPLICATION INITIALIZATION & HASH LISTENER
// ==========================================================================
window.addEventListener('hashchange', () => {
  syncRouteFromHash();
  renderRouteView();
});

// Auto-run Geolocation on initial load
setTimeout(() => {
  store.detectBrowserLocation().then((res) => {
    currentCity = res.city;
    updateCityInUI();
  });
}, 800);

// Initialize
syncRouteFromHash();
renderApp();
