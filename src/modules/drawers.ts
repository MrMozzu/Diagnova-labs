import { store } from '../services/store';
import { ApiClient } from '../services/api';
import { ALL_TESTS, POPULAR_CITIES } from '../data/tests';
import { FEATURED_PACKAGES } from '../data/packages';
import type { Booking, CartItem } from '../types';
import { showToast } from '../utils/toast';

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

// ==========================================================================
// CART DRAWER IMPLEMENTATION
// ==========================================================================
export function openCartDrawer(options?: { navigateTo?: (route: any) => void; updateCartBadges?: () => void }) {
  renderCartDrawerContent(options);
  const overlay = document.getElementById('cart-drawer-overlay');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cart-drawer-open');
}

export function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('cart-drawer-open');
}

export function renderCartDrawerContent(options?: { navigateTo?: (route: any) => void; updateCartBadges?: () => void }) {
  const cart = store.getCart();
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  if (!body || !footer) return;

  if (options?.updateCartBadges) {
    options.updateCartBadges();
  }

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
      if (options?.navigateTo) options.navigateTo('tests');
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
        renderCartDrawerContent(options);
      }
    });
  });

  // Bind checkout proceed
  document.getElementById('btn-proceed-cart-checkout')?.addEventListener('click', () => {
    openBookingDrawerForCart();
  });
}

export function openBookingDrawerForCart() {
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
export function openBookingDrawerForPackage(pkgId: string, personsCount?: number) {
  const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId) || FEATURED_PACKAGES[0];
  const persons = personsCount || packagePersons[pkg.id] || 1;
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

export function openBookingDrawerForTest(testId: string) {
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
export function renderBookingDrawer() {
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

  const stepTitles = ['Patient Details', 'Date & Slot', 'Home Address', 'Review & Pay'];

  modalsRoot.innerHTML = `
    <div class="drawer-overlay active" id="booking-drawer-overlay">
      <div class="drawer-container active" id="booking-drawer">
        <!-- DRAWER HEADER -->
        <div class="drawer-header">
          <div>
            <div class="drawer-header-subtitle">STEP ${checkoutStep} OF 4 · ${stepTitles[checkoutStep - 1]}</div>
            <h3 class="drawer-header-title">${activeBookingItem.name}</h3>
          </div>
          <button class="drawer-close-btn" id="close-booking-drawer-btn" aria-label="Close drawer">✕</button>
        </div>

        <!-- PROGRESS BAR -->
        <div class="drawer-progress-bar">
          <div class="drawer-progress-track" style="width: ${(checkoutStep / 4) * 100}%;"></div>
        </div>

        <!-- DRAWER BODY (SCROLLABLE) -->
        <div class="drawer-body" id="drawer-body-content">
          ${renderDrawerStepContent(dateOptions)}
        </div>

        <!-- DRAWER FOOTER (ACTIONS) -->
        <div class="drawer-footer">
          <div class="drawer-footer-price-info">
            <span class="drawer-footer-price-label">Total Amount Payable</span>
            <div class="drawer-footer-price">₹ ${activeBookingItem.price.toLocaleString('en-IN')}</div>
          </div>

          <div style="display: flex; gap: 10px;">
            ${checkoutStep > 1 ? `
              <button class="btn-drawer-back" id="drawer-prev-step-btn">
                ← Back
              </button>
            ` : ''}

            <button class="btn-pill-primary" id="drawer-next-step-btn" style="flex: 1; justify-content: center; padding: 13px 20px;">
              ${checkoutStep === 4 ? `Confirm Booking (₹ ${activeBookingItem.price.toLocaleString('en-IN')}) ➔` : 'Proceed to Next Step ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind close buttons
  document.getElementById('close-booking-drawer-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('booking-drawer-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('booking-drawer-overlay')) {
      closeDrawer();
    }
  });

  // Bind previous step
  document.getElementById('drawer-prev-step-btn')?.addEventListener('click', () => {
    if (checkoutStep > 1) {
      checkoutStep--;
      renderBookingDrawer();
    }
  });

  // Bind next step
  document.getElementById('drawer-next-step-btn')?.addEventListener('click', handleDrawerNextStep);

  // Bind time slot selection in step 2
  if (checkoutStep === 2) {
    document.querySelectorAll('.slot-radio-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.slot-radio-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedSlot = card.getAttribute('data-slot') || selectedSlot;
        isExpressSlot = card.classList.contains('express');
      });
    });
  }

  // Bind payment method selection in step 4
  if (checkoutStep === 4) {
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        selectedPaymentMethod = (e.target as HTMLInputElement).value as any;
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
        (radio.closest('.payment-method-card') as HTMLElement)?.classList.add('active');
      });
    });
  }

  // Bind pincode live serviceability in step 3
  if (checkoutStep === 3) {
    const pinInput = document.getElementById('patient-pincode') as HTMLInputElement;
    const pinBadge = document.getElementById('drawer-pincode-status');

    const checkPin = async (pin: string) => {
      if (pin.length !== 6 || !pinBadge) return;
      pinBadge.innerHTML = '🔍 Checking doorstep sample collection coverage...';
      try {
        const data = await ApiClient.checkPincode(pin);
        if (data.isServiceable) {
          pinBadge.className = 'pincode-smart-badge green';
          pinBadge.innerHTML = `
            <strong>✓ ${data.badgeText}</strong> · Nearest Lab: <strong>${data.nearestLab}</strong> (${data.locality})
          `;
        } else {
          pinBadge.className = 'pincode-smart-badge red';
          pinBadge.innerHTML = `⚠️ Pincode ${pin} is outside current express boundary. Standard pickup applies.`;
        }
      } catch {
        pinBadge.className = 'pincode-smart-badge';
        pinBadge.innerHTML = '✓ Serviceable via Regional Reference Pathology Center.';
      }
    };

    if (pinInput && pinInput.value.length === 6) {
      checkPin(pinInput.value);
    }

    pinInput?.addEventListener('input', () => {
      const val = pinInput.value.replace(/\D/g, '').slice(0, 6);
      pinInput.value = val;
      if (val.length === 6) checkPin(val);
    });
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
        <label class="form-label" for="patient-name">Full Name (as per Aadhaar / ID) *</label>
        <input type="text" id="patient-name" class="form-input" placeholder="e.g., Rajesh Sharma" value="Rajesh Sharma" required />
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label" for="patient-phone">Mobile Number *</label>
          <input type="tel" id="patient-phone" class="form-input" placeholder="10-digit number" value="9826011223" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="patient-email">Email (for Report) *</label>
          <input type="email" id="patient-email" class="form-input" placeholder="rajesh@gmail.com" value="rajesh@gmail.com" />
        </div>
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label" for="patient-age">Age (Years) *</label>
          <input type="number" id="patient-age" class="form-input" placeholder="Age" value="38" min="1" max="120" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="patient-gender">Gender *</label>
          <select id="patient-gender" class="form-input" aria-label="Gender">
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
        <label class="form-label" for="booking-date-select">Preferred Date *</label>
        <select id="booking-date-select" class="form-input" aria-label="Preferred Date">
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
          <span class="slot-card-desc">Standard fasting collection window</span>
        </div>

        <div class="slot-radio-card" data-slot="08:30 AM - 09:30 AM">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">08:30 AM - 09:30 AM</strong>
          </div>
          <span class="slot-card-desc">Convenient morning collection slot</span>
        </div>

        <div class="slot-radio-card" data-slot="09:30 AM - 10:30 AM">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">09:30 AM - 10:30 AM</strong>
          </div>
          <span class="slot-card-desc">Late morning collection window</span>
        </div>

        <div class="slot-radio-card" data-slot="10:30 AM - 11:30 AM">
          <div class="slot-card-top-row">
            <strong class="slot-card-time">10:30 AM - 11:30 AM</strong>
          </div>
          <span class="slot-card-desc">Ideal for non-fasting tests and lipid profiles</span>
        </div>
      </div>
    `;
  }

  if (checkoutStep === 3) {
    const currentCity = store.getCity();
    return `
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Sample Collection Address</h4>
      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
        Our certified phlebotomist will arrive with sealed, sterile barcode sample kits.
      </p>

      <div class="form-group">
        <label class="form-label" for="patient-address">Full Street Address &amp; Flat / House No. *</label>
        <textarea id="patient-address" class="form-input" rows="3" placeholder="e.g., Flat 402, Shalimar Heights, Arera Colony" required>Flat 402, Shalimar Heights, Arera Colony</textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="patient-landmark">Landmark (Optional)</label>
        <input type="text" id="patient-landmark" class="form-input" placeholder="e.g., Near Habibganj Station" value="Near Habibganj Station" />
      </div>

      <div class="drawer-form-grid-2col">
        <div class="form-group">
          <label class="form-label" for="patient-city">City *</label>
          <input type="text" id="patient-city" class="form-input" value="${currentCity}" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="patient-pincode">Pincode *</label>
          <input type="text" id="patient-pincode" class="form-input" placeholder="e.g., 462016" value="462016" maxlength="6" required />
        </div>
      </div>

      <!-- LIVE SMART LAB & PINCODE SERVICEABILITY BADGE -->
      <div id="drawer-pincode-status" class="pincode-smart-badge"></div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 14px; margin-top: 14px; display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: #166534; line-height: 1.45;">
        <span style="font-size: 1.1rem; flex-shrink: 0;">🛡️</span>
        <div>Phlebotomist temperature verified daily. Sealed sterile BD tubes opened right before your eyes.</div>
      </div>
    `;
  }

  // Step 4: Summary & Payment Choice
  const patientNameVal = (document.getElementById('patient-name') as HTMLInputElement)?.value || 'Rajesh Sharma';
  const patientPhoneVal = (document.getElementById('patient-phone') as HTMLInputElement)?.value || '9826011223';
  const patientAddressVal = (document.getElementById('patient-address') as HTMLTextAreaElement)?.value || 'Flat 402, Shalimar Heights';
  const currentCity = store.getCity();

  return `
    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #0f172a;">Review Order &amp; Payment</h4>
    <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
      Review your scheduled appointment details before booking confirmation.
    </p>

    <!-- APPOINTMENT SUMMARY CARD -->
    <div class="order-review-box">
      <div class="review-row">
        <span>Patient Name</span>
        <strong>${patientNameVal} (${patientPhoneVal})</strong>
      </div>
      <div class="review-row">
        <span>Scheduled Window</span>
        <strong>${selectedSlot}</strong>
      </div>
      <div class="review-row">
        <span>Doorstep Address</span>
        <span>${patientAddressVal}, ${currentCity}</span>
      </div>
      <div class="review-row">
        <span>Clinical Lab</span>
        <span>NABL Accredited Regional Hub (Barcoded)</span>
      </div>
    </div>

    <!-- BILL BREAKUP -->
    <div class="order-review-box" style="margin-top: 14px; background: #fff;">
      <div class="review-row">
        <span>Item Total (MRP)</span>
        <span>₹ ${activeBookingItem.mrp.toLocaleString('en-IN')}</span>
      </div>
      ${activeBookingItem.mrp > activeBookingItem.price ? `
        <div class="review-row" style="color: #16a34a;">
          <span>Package Bundle Discount</span>
          <span>- ₹ ${(activeBookingItem.mrp - activeBookingItem.price).toLocaleString('en-IN')}</span>
        </div>
      ` : ''}
      <div class="review-row">
        <span>Doorstep Collection Fee</span>
        <span style="color: #16a34a; font-weight: 700;">FREE <span style="text-decoration: line-through; color: #94a3b8; font-size: 0.75rem;">₹150</span></span>
      </div>
      <div class="review-row" style="border-top: 1.5px solid #e2e8f0; padding-top: 10px; margin-top: 8px; font-size: 1.05rem; font-weight: 800; color: #0f172a;">
        <span>Total Payable</span>
        <span style="color: #e27a3f;">₹ ${activeBookingItem.price.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <!-- PAYMENT METHOD OPTIONS -->
    <h5 style="font-size: 0.92rem; font-weight: 700; color: #0f172a; margin: 18px 0 10px 0;">Select Payment Method</h5>

    <div class="payment-methods-list">
      <label class="payment-method-card ${selectedPaymentMethod === 'online_upi' ? 'active' : ''}">
        <input type="radio" name="payment-method" value="online_upi" ${selectedPaymentMethod === 'online_upi' ? 'checked' : ''} />
        <div class="payment-method-content">
          <div class="payment-method-title">⚡ Pay Online via UPI / Cards / NetBanking</div>
          <div class="payment-method-desc">Instant confirmation with digital invoice receipt (GPay, PhonePe, Paytm, Cards)</div>
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
  const patientCity = (document.getElementById('patient-city') as HTMLInputElement)?.value || store.getCity();
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

export function closeDrawer() {
  const modalsRoot = document.getElementById('modals-root');
  if (modalsRoot) modalsRoot.innerHTML = '';
  document.body.classList.remove('has-drawer-open', 'modal-open');
  activeBookingItem = null;
  checkoutStep = 1;
}

// ==========================================================================
// CONFIRMATION & RECEIPT MODALS
// ==========================================================================
export function openConfirmationModal(booking: Booking) {
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
      const { generateBookingReceiptPDF } = await import('../services/pdfGenerator');
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

export function openEmailSimulationModal(booking: Booking) {
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
          <p>Your diagnostic test appointment has been successfully scheduled. Below are your booking credentials:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.88rem;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Booking Reference:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #1b449c;">${booking.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Scheduled Time:</td>
              <td style="padding: 8px 0; font-weight: 700;">${booking.scheduledDate} (${booking.scheduledSlot})</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
              <td style="padding: 8px 0; font-weight: 800; color: #e27a3f;">₹ ${booking.totalAmount.toLocaleString('en-IN')} (${booking.paymentMethod === 'online_upi' ? 'PAID ONLINE' : 'PAY ON VISIT'})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Sample Pickup Address:</td>
              <td style="padding: 8px 0;">${booking.patient.address}, ${booking.patient.city} - ${booking.patient.pincode}</td>
            </tr>
          </table>

          <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; margin-top: 16px; font-size: 0.82rem; color: #475569;">
            💡 <strong>Next Steps:</strong> A certified phlebotomist will arrive during your scheduled window with temperature-controlled cold-chain equipment and sterile collection tubes.
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-pill-primary" id="btn-email-download-pdf" style="margin: 0 auto;">
              📄 Download PDF Booking Voucher
            </button>
          </div>
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
      const { generateBookingReceiptPDF } = await import('../services/pdfGenerator');
      await generateBookingReceiptPDF(booking);
    } catch {
      showToast('⚠️ Could not generate PDF voucher.');
    }
  });
}

export function openParametersModal(pkgId: string) {
  const pkg = FEATURED_PACKAGES.find(p => p.id === pkgId) || FEATURED_PACKAGES[0];
  const modalsRoot = document.getElementById('modals-root')!;
  document.body.classList.add('modal-open');

  const closeModal = () => {
    document.body.classList.remove('modal-open');
    modalsRoot.innerHTML = '';
    document.removeEventListener('keydown', onKeyDown);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', onKeyDown);

  modalsRoot.innerHTML = `
    <div class="modal-overlay active" id="params-modal-overlay">
      <div class="modal-card" style="max-width: 620px; padding: 0 !important; overflow: hidden !important;">
        <div class="modal-header" style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px; border-bottom: 1px solid #e2e8f0;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 3px; word-break: break-word;">${pkg.title}</h3>
            <span style="font-size: 0.8rem; color: #0284c7; font-weight: 700;">Includes All ${pkg.parametersCount} Clinical Tests</span>
          </div>
          <button class="modal-close-btn" id="close-params-modal-btn" aria-label="Close tests popup" style="flex-shrink: 0; margin-top: -2px;">✕</button>
        </div>

        <div class="modal-body" style="padding: 18px 20px; max-height: calc(85vh - 75px); overflow-y: auto;">
          <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px;">
            Full breakdown of all diagnostic parameters included in this package:
          </p>

          ${pkg.allParameters.map(group => `
            <div style="margin-bottom: 18px;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: #1b449c; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span>${group.category}</span>
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">${group.tests.length} tests</span>
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${group.tests.map(t => `
                  <span style="background: #f1f5f9; color: #334155; font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    ✓ ${t}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.75rem; color: #64748b; display: block;">Starting from</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a;">₹ ${pkg.pricing[1].price.toLocaleString('en-IN')}</div>
            </div>
            <button class="btn-pill-primary" id="modal-book-pkg-now" style="padding: 10px 22px; font-weight: 750;">
              Book This Package
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-params-modal-btn')?.addEventListener('click', closeModal);

  document.getElementById('params-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('params-modal-overlay')) {
      closeModal();
    }
  });

  document.getElementById('modal-book-pkg-now')?.addEventListener('click', () => {
    closeModal();
    openBookingDrawerForPackage(pkg.id);
  });
}

export function openLocationModal(onCityChanged?: (city: string) => void) {
  const modalsRoot = document.getElementById('modals-root')!;
  document.body.classList.add('modal-open');
  const currentCity = store.getCity();

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
            <label for="modal-pincode-input" style="display: block; font-size: 0.74rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
              📍 Check Service by PIN Code
            </label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="modal-pincode-input" placeholder="e.g. 462016" maxlength="6" aria-label="Check Service by PIN Code" style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem; outline: none;" />
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
        if (onCityChanged) onCityChanged(data.city);
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
      if (onCityChanged) onCityChanged(city);
      modalsRoot.innerHTML = '';
      document.body.classList.remove('modal-open');
      showToast(`📍 City updated to ${city}`);
    });
  });

  const gpsBtn = document.getElementById('btn-detect-gps');
  gpsBtn?.addEventListener('click', async () => {
    gpsBtn.textContent = 'Detecting location...';
    const result = await store.detectBrowserLocation();
    store.setCity(result.city);
    if (onCityChanged) onCityChanged(result.city);
    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    showToast(`📍 Location detected: ${result.city}`);
  });
}

export function openCallbackModal() {
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
              <label class="form-label" for="lead-name">Your Name *</label>
              <input type="text" id="lead-name" class="form-input" placeholder="e.g., Ananya Verma" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="lead-phone">Phone Number *</label>
              <input type="tel" id="lead-phone" class="form-input" placeholder="10-digit number" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="lead-query">Health Concern / Symptoms (Optional)</label>
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
      query,
      city: store.getCity()
    });

    modalsRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
    showToast('✓ Callback requested! Doctor will call in 15 minutes.');
  });
}
