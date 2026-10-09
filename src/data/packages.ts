import type { PackageItem } from '../types';

export const FEATURED_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-healthy-india-2026',
    slug: 'full-body-checkup',
    title: 'Full Body Checkup',
    category: 'Full Body Checkup',
    tagline: 'Premier preventative health evaluation with full vital organ & metabolic screening',
    parametersCount: 72,
    parametersSummary: 'Liver • Kidney • Thyroid • CBC + more',
    tatText: 'Report in 24 hours',
    baseMrp: 3499,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Popular',
    pricing: {
      1: { price: 1999, mrp: 3499, discount: 43 },
      2: { price: 3599, mrp: 6998, discount: 48 },
      3: { price: 4999, mrp: 10497, discount: 52 },
      4: { price: 6199, mrp: 13996, discount: 55 }
    },
    allParameters: [
      {
        category: 'Essential Blood & Metabolic Panel (9 tests)',
        tests: [
          'Glucose (Fasting Blood Sugar)',
          'Blood Urea Nitrogen (BUN)',
          'Creatinine',
          'Sodium',
          'Potassium',
          'Chloride',
          'Carbon Dioxide (CO2 / Bicarbonate)',
          'Calcium',
          'Total Protein'
        ]
      },
      {
        category: 'Kidney Function Evaluation (KFT)',
        tests: [
          'Serum Creatinine',
          'Blood Urea Nitrogen (BUN)',
          'BUN / Creatinine Ratio',
          'Uric Acid',
          'eGFR Assessment'
        ]
      },
      {
        category: 'Electrolyte & Fluid Balance',
        tests: [
          'Sodium (Na+)',
          'Potassium (K+)',
          'Chloride (Cl-)',
          'Carbon Dioxide (CO2 / Bicarbonate)'
        ]
      },
      {
        category: 'Liver Function & Proteins (LFT)',
        tests: [
          'Total Protein',
          'Albumin',
          'Globulin',
          'A/G Ratio',
          'Bilirubin Total',
          'Bilirubin Direct',
          'SGOT / AST',
          'SGPT / ALT',
          'Alkaline Phosphatase (ALP)'
        ]
      },
      {
        category: 'Complete Blood Count (CBC - 24 tests)',
        tests: [
          'Hemoglobin',
          'RBC Count',
          'WBC Total Count',
          'Platelet Count',
          'Neutrophils',
          'Lymphocytes',
          'Eosinophils',
          'Monocytes',
          'Basophils',
          'PCV / Hematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW-CV',
          'ESR (Erythrocyte Sedimentation Rate)'
        ]
      },
      {
        category: 'Lipid & Cardiac Risk Profile',
        tests: [
          'Total Cholesterol',
          'HDL Good Cholesterol',
          'LDL Bad Cholesterol',
          'Triglycerides',
          'VLDL Cholesterol',
          'Non-HDL Cholesterol',
          'Total / HDL Ratio'
        ]
      },
      {
        category: 'Thyroid & Mineral Health',
        tests: [
          'TSH (Thyroid Stimulating Hormone)',
          'Serum Calcium',
          'Phosphorus',
          'Alkaline Phosphatase'
        ]
      }
    ]
  },
  {
    id: 'pkg-be-healthy-comprehensive',
    slug: 'diabetes-care',
    title: 'Diabetes Care',
    category: 'Diabetes Care',
    tagline: 'Vital preventative health screening powered by gold-standard 3-month HbA1c & metabolic markers',
    parametersCount: 16,
    parametersSummary: 'HbA1c • Fasting Glucose • Lipid Profile',
    tatText: 'Report in 6 hours',
    baseMrp: 1499,
    fastingHours: 10,
    iconType: 'droplet',
    badge: 'Specialist',
    pricing: {
      1: { price: 899, mrp: 1499, discount: 40 },
      2: { price: 1699, mrp: 2998, discount: 43 },
      3: { price: 2399, mrp: 4497, discount: 47 },
      4: { price: 2999, mrp: 5996, discount: 50 }
    },
    allParameters: [
      {
        category: 'Diabetes & Glycemic Assessment (With HbA1c)',
        tests: [
          'HbA1c (Glycosylated Hemoglobin) - HPLC Method',
          'Estimated Average Glucose (eAG)',
          'Glucose (Fasting Blood Sugar)'
        ]
      },
      {
        category: 'Metabolic & Kidney Panel',
        tests: [
          'Blood Urea Nitrogen (BUN)',
          'Creatinine',
          'Calcium',
          'Total Protein'
        ]
      },
      {
        category: 'Lipid Profile',
        tests: [
          'Total Cholesterol',
          'HDL Cholesterol',
          'LDL Cholesterol',
          'Triglycerides',
          'VLDL Cholesterol'
        ]
      },
      {
        category: 'Electrolytes & Fluid Balance',
        tests: [
          'Sodium',
          'Potassium',
          'Chloride'
        ]
      }
    ]
  },
  {
    id: 'pkg-senior-citizen',
    slug: 'thyroid-profile',
    title: 'Thyroid Profile',
    category: 'Thyroid Profile',
    tagline: 'Complete thyroid function evaluation for metabolic balance, energy & weight management',
    parametersCount: 4,
    parametersSummary: 'T3 • T4 • TSH • Free T3',
    tatText: 'Report in 6 hours',
    baseMrp: 999,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Popular',
    pricing: {
      1: { price: 599, mrp: 999, discount: 40 },
      2: { price: 1099, mrp: 1998, discount: 45 },
      3: { price: 1549, mrp: 2997, discount: 48 },
      4: { price: 1949, mrp: 3996, discount: 51 }
    },
    allParameters: [
      {
        category: 'Thyroid Hormone Assessment',
        tests: [
          'Total Triiodothyronine (T3)',
          'Total Thyroxine (T4)',
          'Thyroid Stimulating Hormone (TSH) - Ultra Sensitive',
          'Free Triiodothyronine (FT3)'
        ]
      }
    ]
  },
  {
    id: 'pkg-women-wellness',
    slug: 'womens-health',
    title: "Women's Health",
    category: 'Women Health',
    tagline: 'Tailored clinical evaluation designed for women covering thyroid baselines, iron metabolism & bone strength',
    parametersCount: 24,
    parametersSummary: 'CBC • Iron Profile • Vitamin D • Thyroid',
    tatText: 'Report in 12 hours',
    baseMrp: 2499,
    fastingHours: 10,
    iconType: 'female',
    badge: "Women's Choice",
    pricing: {
      1: { price: 1499, mrp: 2499, discount: 40 },
      2: { price: 2799, mrp: 4998, discount: 44 },
      3: { price: 3899, mrp: 7497, discount: 48 },
      4: { price: 4799, mrp: 9996, discount: 52 }
    },
    allParameters: [
      {
        category: 'Thyroid & Hormonal Health',
        tests: ['TSH (Thyroid Stimulating Hormone)', 'Free T4']
      },
      {
        category: 'Iron & Anemia Screening',
        tests: ['Serum Iron', 'Total Iron Binding Capacity (TIBC)', 'Ferritin']
      },
      {
        category: 'Bone & Vitamin Profile',
        tests: ['25-Hydroxy Vitamin D', 'Serum Calcium', 'Phosphorus']
      },
      {
        category: 'Complete Blood Count (CBC - 16 parameters)',
        tests: [
          'Hemoglobin',
          'RBC Count',
          'WBC Total Count',
          'Platelet Count',
          'PCV / Hematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'ESR'
        ]
      }
    ]
  }
];
