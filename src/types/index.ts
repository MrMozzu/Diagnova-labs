export interface TestItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDesc: string;
  price: number;
  mrp: number;
  discountPercent: number;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours: number;
  tatHours: number;
  homeCollection: boolean;
  parameters: string[];
  preparation: string;
  popular?: boolean;
}

export interface PackagePricingTier {
  price: number;
  mrp: number;
  discount: number;
}

export interface PackageItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  parametersCount: number;
  parametersSummary: string;
  tatText: string;
  baseMrp: number;
  pricing: Record<number, PackagePricingTier>; // 1, 2, 3, 4 persons
  iconType: 'user' | 'droplet' | 'shield' | 'heart' | 'female' | 'dna';
  badge?: string;
  fastingHours: number;
  allParameters: { category: string; tests: string[] }[];
}

export interface PatientInfo {
  fullName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
}

export interface CartItem {
  id: string; // unique cart item id
  itemType: 'test' | 'package';
  itemId: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  persons: number;
  fastingHours: number;
  sampleType?: string;
  tatHours?: number;
}

export interface Booking {
  id: string; // e.g. TBL-749281
  createdAt: string;
  itemType: 'package' | 'test' | 'cart';
  itemId: string;
  itemName: string;
  items?: {
    id: string;
    itemType: 'test' | 'package';
    name: string;
    price: number;
    mrp: number;
    persons: number;
    fastingHours: number;
  }[];
  persons: number;
  scheduledDate: string;
  scheduledSlot: string;
  isExpress: boolean;
  baseAmount: number;
  discountAmount: number;
  collectionFee: number;
  totalAmount: number;
  paymentMethod: 'online_upi' | 'online_card' | 'cash_on_collection';
  paymentStatus: 'paid' | 'pending';
  status: 'confirmed' | 'phlebotomist_assigned' | 'sample_collected' | 'in_lab' | 'report_ready';
  patient: PatientInfo;
  phlebotomist?: {
    name: string;
    phone: string;
  };
}

export interface CallbackLead {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  preferredTime: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'called' | 'converted';
}

export interface CityLocation {
  name: string;
  state: string;
  expressAvailable: boolean;
  popularPincodes: string[];
}
