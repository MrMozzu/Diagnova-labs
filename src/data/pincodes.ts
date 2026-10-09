export interface PincodeRecord {
  pincode: string;
  locality: string;
  city: string;
  state: string;
  tier: 'express_60min' | 'standard_nextday' | 'unserviceable';
  nearestLab: string;
  tatHours: number;
  expressAvailable: boolean;
}

export const AUTHORITATIVE_PINCODES: Record<string, PincodeRecord> = {
  // BHOPAL CLUSTER (Core Hub)
  '462016': {
    pincode: '462016',
    locality: 'Arera Colony & Shahpura',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Apex Reference Lab (MP Nagar Zone)',
    tatHours: 6,
    expressAvailable: true
  },
  '462023': {
    pincode: '462023',
    locality: 'MP Nagar & Shivaji Nagar',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Central NABL Hub (Zone-1 MP Nagar)',
    tatHours: 4,
    expressAvailable: true
  },
  '462001': {
    pincode: '462001',
    locality: 'Old City, Chowk & Peer Gate',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova North Processing Lab',
    tatHours: 6,
    expressAvailable: true
  },
  '462003': {
    pincode: '462003',
    locality: 'Jahangirabad & Lily Talkies Area',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'standard_nextday',
    nearestLab: 'Diagnova Central Reference Lab',
    tatHours: 12,
    expressAvailable: false
  },
  '462030': {
    pincode: '462030',
    locality: 'BHEL Township & Govindpura Industrial Area',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova East Satellite Lab',
    tatHours: 6,
    expressAvailable: true
  },
  '462042': {
    pincode: '462042',
    locality: 'Kolar Road, Danish Kunj & Mandakini',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova South Phlebotomy Station',
    tatHours: 6,
    expressAvailable: true
  },
  '462038': {
    pincode: '462038',
    locality: 'Ayodhya Bypass & Karond',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'standard_nextday',
    nearestLab: 'Diagnova Central Reference Lab',
    tatHours: 12,
    expressAvailable: false
  },
  '462044': {
    pincode: '462044',
    locality: 'Hoshangabad Road & Misrod',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova South Peripheral Hub',
    tatHours: 6,
    expressAvailable: true
  },

  // INDORE CLUSTER
  '452001': {
    pincode: '452001',
    locality: 'South Tukoganj & MG Road',
    city: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Malwa Reference Hub (Indore)',
    tatHours: 6,
    expressAvailable: true
  },
  '452010': {
    pincode: '452010',
    locality: 'Vijay Nagar & Scheme 54',
    city: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Vijay Nagar Laboratory',
    tatHours: 6,
    expressAvailable: true
  },
  '452016': {
    pincode: '452016',
    locality: 'Old Palasia & New Palasia',
    city: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Malwa Reference Hub',
    tatHours: 6,
    expressAvailable: true
  },

  // JABALPUR CLUSTER
  '482001': {
    pincode: '482001',
    locality: 'Wright Town, Civil Lines & Russell Chowk',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Mahakaushal NABL Hub',
    tatHours: 8,
    expressAvailable: true
  },
  '482002': {
    pincode: '482002',
    locality: 'Napier Town & Golbazar',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    tier: 'standard_nextday',
    nearestLab: 'Diagnova Mahakaushal NABL Hub',
    tatHours: 12,
    expressAvailable: false
  },

  // DELHI NCR CLUSTER
  '110001': {
    pincode: '110001',
    locality: 'Connaught Place & Barakhamba',
    city: 'Delhi NCR',
    state: 'Delhi',
    tier: 'express_60min',
    nearestLab: 'Diagnova Capital Reference Lab (Delhi Central)',
    tatHours: 4,
    expressAvailable: true
  },
  '110016': {
    pincode: '110016',
    locality: 'Hauz Khas, Green Park & AIIMS Enclave',
    city: 'Delhi NCR',
    state: 'Delhi',
    tier: 'express_60min',
    nearestLab: 'Diagnova South Delhi Reference Center',
    tatHours: 6,
    expressAvailable: true
  },
  '122001': {
    pincode: '122001',
    locality: 'DLF Cyber City, Sector 14 & 29',
    city: 'Delhi NCR',
    state: 'Haryana',
    tier: 'express_60min',
    nearestLab: 'Diagnova Gurgaon Tech Hub',
    tatHours: 6,
    expressAvailable: true
  },
  '201301': {
    pincode: '201301',
    locality: 'Noida Sector 15 & 18',
    city: 'Delhi NCR',
    state: 'Uttar Pradesh',
    tier: 'express_60min',
    nearestLab: 'Diagnova Noida Express Center',
    tatHours: 6,
    expressAvailable: true
  },

  // MUMBAI CLUSTER
  '400001': {
    pincode: '400001',
    locality: 'Fort, Colaba & Ballard Estate',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova South Mumbai Regional Lab',
    tatHours: 6,
    expressAvailable: true
  },
  '400050': {
    pincode: '400050',
    locality: 'Bandra West & Pali Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova Western Suburban Center',
    tatHours: 6,
    expressAvailable: true
  },
  '400053': {
    pincode: '400053',
    locality: 'Andheri West & Lokhandwala',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova Andheri Central Lab',
    tatHours: 6,
    expressAvailable: true
  },

  // BENGALURU CLUSTER
  '560001': {
    pincode: '560001',
    locality: 'MG Road, Brigade Road & Shivajinagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    tier: 'express_60min',
    nearestLab: 'Diagnova Silicon Valley Lab Hub (Bangalore)',
    tatHours: 6,
    expressAvailable: true
  },
  '560034': {
    pincode: '560034',
    locality: 'Koramangala 1st to 8th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    tier: 'express_60min',
    nearestLab: 'Diagnova Koramangala Hub',
    tatHours: 6,
    expressAvailable: true
  },
  '560038': {
    pincode: '560038',
    locality: 'Indiranagar 100ft Road & Defence Colony',
    city: 'Bengaluru',
    state: 'Karnataka',
    tier: 'express_60min',
    nearestLab: 'Diagnova East Bangalore Lab',
    tatHours: 6,
    expressAvailable: true
  },
  '560066': {
    pincode: '560066',
    locality: 'Whitefield & ITPL Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    tier: 'express_60min',
    nearestLab: 'Diagnova Whitefield Tech Hub',
    tatHours: 6,
    expressAvailable: true
  },

  // HYDERABAD CLUSTER
  '500001': {
    pincode: '500001',
    locality: 'Abids & Koti',
    city: 'Hyderabad',
    state: 'Telangana',
    tier: 'express_60min',
    nearestLab: 'Diagnova Deccan Central Lab',
    tatHours: 6,
    expressAvailable: true
  },
  '500081': {
    pincode: '500081',
    locality: 'HITEC City, Madhapur & Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    tier: 'express_60min',
    nearestLab: 'Diagnova Cyberabad Tech Lab',
    tatHours: 6,
    expressAvailable: true
  },

  // PUNE CLUSTER
  '411001': {
    pincode: '411001',
    locality: 'Pune Camp, Station & Dhole Patil Road',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova Pune Central Hub',
    tatHours: 6,
    expressAvailable: true
  },
  '411038': {
    pincode: '411038',
    locality: 'Kothrud & Paud Road',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova Kothrud Lab Center',
    tatHours: 6,
    expressAvailable: true
  },
  '411057': {
    pincode: '411057',
    locality: 'Hinjawadi Phase 1, 2 & Wakad',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'express_60min',
    nearestLab: 'Diagnova Hinjawadi Tech Lab',
    tatHours: 6,
    expressAvailable: true
  }
};

export interface PincodeLookupResponse {
  pincode: string;
  isServiceable: boolean;
  serviceTier: 'express_60min' | 'standard_nextday' | 'unserviceable';
  badgeText: string;
  badgeColor: 'green' | 'amber' | 'red';
  locality: string;
  city: string;
  state: string;
  nearestLab: string;
  tatHours: number;
  estimatedArrival: string;
  freeCollectionAvailable: boolean;
  message: string;
}

export function isValidPincodeFormat(pincode: string): boolean {
  const clean = (pincode || '').trim();
  return /^[1-9][0-9]{5}$/.test(clean);
}

export function lookupPincode(pincodeInput: string): PincodeLookupResponse {
  const clean = (pincodeInput || '').trim();

  if (!isValidPincodeFormat(clean)) {
    throw new Error('A valid 6-digit Indian postal PIN code is required.');
  }

  // 1. Direct Authoritative Match
  const record = AUTHORITATIVE_PINCODES[clean];
  if (record) {
    if (record.tier === 'express_60min') {
      return {
        pincode: clean,
        isServiceable: true,
        serviceTier: 'express_60min',
        badgeText: '✅ Service Available in this Area',
        badgeColor: 'green',
        locality: record.locality,
        city: record.city,
        state: record.state,
        nearestLab: record.nearestLab,
        tatHours: record.tatHours,
        estimatedArrival: 'Sample collection available for this address',
        freeCollectionAvailable: true,
        message: `Service available in ${record.locality}.`
      };
    } else {
      return {
        pincode: clean,
        isServiceable: true,
        serviceTier: 'standard_nextday',
        badgeText: '✅ Service Available in this Area',
        badgeColor: 'green',
        locality: record.locality,
        city: record.city,
        state: record.state,
        nearestLab: record.nearestLab,
        tatHours: record.tatHours,
        estimatedArrival: 'Sample collection available for this address',
        freeCollectionAvailable: true,
        message: `Service available in ${record.locality}.`
      };
    }
  }

  // 2. Intelligent Regional Cluster Prefix Matching
  const prefix3 = clean.substring(0, 3);
  const prefix2 = clean.substring(0, 2);

  let fallbackCity = '';
  let fallbackState = '';
  let fallbackLab = '';

  if (prefix3 === '462') {
    fallbackCity = 'Bhopal';
    fallbackState = 'Madhya Pradesh';
    fallbackLab = 'Diagnova Central Reference Lab (MP Nagar, Bhopal)';
  } else if (prefix3 === '452') {
    fallbackCity = 'Indore';
    fallbackState = 'Madhya Pradesh';
    fallbackLab = 'Diagnova Malwa Reference Hub (Indore)';
  } else if (prefix3 === '482') {
    fallbackCity = 'Jabalpur';
    fallbackState = 'Madhya Pradesh';
    fallbackLab = 'Diagnova Mahakaushal Hub (Jabalpur)';
  } else if (prefix2 === '11' || prefix3 === '122' || prefix3 === '201') {
    fallbackCity = 'Delhi NCR';
    fallbackState = 'Delhi / NCR';
    fallbackLab = 'Diagnova Capital Reference Lab (Delhi Central)';
  } else if (prefix3 === '400') {
    fallbackCity = 'Mumbai';
    fallbackState = 'Maharashtra';
    fallbackLab = 'Diagnova South Mumbai Regional Lab';
  } else if (prefix3 === '560') {
    fallbackCity = 'Bengaluru';
    fallbackState = 'Karnataka';
    fallbackLab = 'Diagnova Silicon Valley Lab Hub (Bangalore)';
  } else if (prefix3 === '500') {
    fallbackCity = 'Hyderabad';
    fallbackState = 'Telangana';
    fallbackLab = 'Diagnova Deccan Central Lab';
  } else if (prefix3 === '411') {
    fallbackCity = 'Pune';
    fallbackState = 'Maharashtra';
    fallbackLab = 'Diagnova Pune Central Hub';
  }

  if (fallbackCity) {
    return {
      pincode: clean,
      isServiceable: true,
      serviceTier: 'standard_nextday',
      badgeText: '✅ Service Available in this Area',
      badgeColor: 'green',
      locality: `${fallbackCity} Metropolitan Region`,
      city: fallbackCity,
      state: fallbackState,
      nearestLab: fallbackLab,
      tatHours: 12,
      estimatedArrival: 'Sample collection available for this address',
      freeCollectionAvailable: true,
      message: `Service available across ${fallbackCity}.`
    };
  }

  // 3. Unserviceable Region
  return {
    pincode: clean,
    isServiceable: false,
    serviceTier: 'unserviceable',
    badgeText: 'No service is available in this area',
    badgeColor: 'red',
    locality: 'Unserviceable Area',
    city: 'Unlisted City',
    state: 'India',
    nearestLab: 'None',
    tatHours: 0,
    estimatedArrival: 'Not Available',
    freeCollectionAvailable: false,
    message: 'No service is available in this area'
  };
}

