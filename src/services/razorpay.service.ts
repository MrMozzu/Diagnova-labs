import { ApiClient } from './api';
import { showToast } from '../utils/toast';

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  amountInRupees: number;
  itemName: string;
  patient: {
    fullName: string;
    email?: string;
    phone: string;
  };
  receipt?: string;
}

export interface RazorpayVerificationResult {
  success: boolean;
  isVerified: boolean;
  paymentId: string;
  orderId: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export class RazorpayService {
  public static getKeyId(): string {
    return (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) ||
      'rzp_test_Tquwc2rWSBqs49'
    );
  }

  /**
   * Ensures Razorpay checkout.js script is loaded in the DOM
   */
  public static async loadRazorpayScript(): Promise<boolean> {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        if (window.Razorpay) return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay Checkout SDK.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Opens the Razorpay Standard Checkout modal and verifies the returned signature
   */
  public static async openCheckout(options: RazorpayCheckoutOptions): Promise<RazorpayVerificationResult> {
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      showToast('⚠️ Razorpay payment gateway could not be loaded. Please check your connection.');
      throw new Error('Razorpay SDK not loaded');
    }

    const amountInPaise = Math.round(options.amountInRupees * 100);
    if (amountInPaise < 100) {
      throw new Error('Amount must be at least 100 paise (₹1.00)');
    }

    // Step 1: Create Order via Backend API
    showToast('🔒 Initiating secure Razorpay checkout...');
    let orderData;
    try {
      orderData = await ApiClient.createRazorpayOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: options.receipt || `order_${Date.now()}`
      });
    } catch (orderErr: any) {
      console.error('Order creation error:', orderErr);
      showToast(`⚠️ ${orderErr.message || 'Could not initialize payment order'}`);
      throw orderErr;
    }

    const orderId = orderData.order_id || orderData.id;
    const keyId = this.getKeyId();

    return new Promise((resolve, reject) => {
      let isSettled = false;

      const rzpOptions = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Diagnova Labs',
        description: `Booking for ${options.itemName}`,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="35" height="35" rx="6" fill="%231b449c"/><rect x="55" y="10" width="35" height="35" rx="6" fill="%23e27a3f"/><rect x="10" y="55" width="35" height="35" rx="6" fill="%230284c7"/><rect x="55" y="55" width="35" height="35" rx="6" fill="%230f172a"/></svg>',
        order_id: orderId,
        prefill: {
          name: options.patient.fullName,
          email: options.patient.email || 'patient@diagnovalabs.com',
          contact: options.patient.phone.replace(/\D/g, '').slice(-10) || '9876543210'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        theme: {
          color: '#1b449c'
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            if (!isSettled) {
              isSettled = true;
              console.log('Payment modal dismissed by user.');
              showToast('ℹ️ Payment was cancelled. You can retry or choose Cash on Collection.');
              reject(new Error('PAYMENT_CANCELLED_BY_USER'));
            }
          }
        },
        handler: async (response: RazorpayPaymentSuccessResponse) => {
          isSettled = true;
          showToast('🔍 Verifying payment signature with bank...');

          try {
            // Step 3: Verify Payment Signature via Backend API
            const verifyRes = await ApiClient.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success && verifyRes.isVerified) {
              showToast('✅ Payment verified successfully!');
              resolve({
                success: true,
                isVerified: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              });
            } else {
              showToast('❌ Payment verification failed. Signature mismatch.');
              reject(new Error('SIGNATURE_VERIFICATION_FAILED'));
            }
          } catch (verifyErr: any) {
            console.error('Signature verification error:', verifyErr);
            showToast(`⚠️ Payment verification failed: ${verifyErr.message}`);
            reject(verifyErr);
          }
        }
      };

      try {
        const rzpInstance = new window.Razorpay(rzpOptions);

        rzpInstance.on('payment.failed', (failResponse: any) => {
          isSettled = true;
          const desc = failResponse?.error?.description || 'Transaction declined by bank/UPI.';
          console.error('❌ Razorpay payment.failed:', failResponse);
          showToast(`❌ Payment Failed: ${desc}`);
          reject(new Error(desc));
        });

        rzpInstance.open();
      } catch (err: any) {
        console.error('Razorpay initialization exception:', err);
        showToast('⚠️ Could not open Razorpay checkout modal.');
        reject(err);
      }
    });
  }
}
