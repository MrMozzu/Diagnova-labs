import type { PackageItem } from '../types';

export const FEATURED_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-healthy-india-2026',
    slug: 'healthy-india-2026-advance-plus',
    title: 'Healthy India 2026 Full Body Checkup Advance Plus',
    category: 'Full Body Checkup',
    tagline: 'Premier preventative health evaluation with full vital organ & metabolic screening',
    parametersCount: 85,
    parametersSummary: 'Complete Blood • Liver • Kidney • Thyroid • Urine • Sugar',
    tatText: 'Report in 24 hours',
    baseMrp: 2499,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Most Popular',
    pricing: {
      1: { price: 1099, mrp: 2499, discount: 56 },
      2: { price: 2099, mrp: 4998, discount: 58 },
      3: { price: 2999, mrp: 7497, discount: 60 },
      4: { price: 3799, mrp: 9996, discount: 62 }
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
    slug: 'be-healthy-comprehensive',
    title: 'Be Healthy Comprehensive Package (With HbA1c)',
    category: 'Comprehensive Checkup',
    tagline: 'Gold-standard 3-month glycemic control & total body metabolic panel with vital organ assessment',
    parametersCount: 75,
    parametersSummary: 'HbA1c • Cardiac Risk • Liver • Kidney • Vitamins • CBC',
    tatText: 'Report in 24 hours',
    baseMrp: 3499,
    fastingHours: 10,
    iconType: 'shield',
    badge: 'Best Value',
    pricing: {
      1: { price: 1599, mrp: 3499, discount: 54 },
      2: { price: 2999, mrp: 6998, discount: 57 },
      3: { price: 4299, mrp: 10497, discount: 59 },
      4: { price: 5399, mrp: 13996, discount: 61 }
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
        category: 'Complete Blood Count (CBC - 24 tests)',
        tests: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'ESR']
      },
      {
        category: 'Liver Function Evaluation (LFT)',
        tests: ['Bilirubin Total & Direct', 'SGOT/AST', 'SGPT/ALT', 'Alkaline Phosphatase', 'Total Protein', 'Albumin']
      },
      {
        category: 'Kidney Function Evaluation (KFT)',
        tests: ['Blood Urea Nitrogen (BUN)', 'Serum Creatinine', 'Uric Acid', 'BUN/Creatinine Ratio']
      },
      {
        category: 'Lipid & Cardiac Profile',
        tests: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL Cholesterol']
      },
      {
        category: 'Thyroid Function',
        tests: ['TSH Ultra-sensitive']
      }
    ]
  },
  {
    id: 'pkg-diabetic-checkup-prime',
    slug: 'diabetic-checkup-prime',
    title: 'Diagnova Diabetic Checkup Prime',
    category: 'Diabetes Care',
    tagline: 'Vital preventative diabetes screening powered by gold-standard 3-month HbA1c & metabolic markers',
    parametersCount: 16,
    parametersSummary: 'HbA1c HPLC • Fasting Glucose • Lipid Profile • Microalbumin',
    tatText: 'Report in 6 hours',
    baseMrp: 1499,
    fastingHours: 10,
    iconType: 'droplet',
    badge: 'Diabetes Prime',
    pricing: {
      1: { price: 699, mrp: 1499, discount: 53 },
      2: { price: 1299, mrp: 2998, discount: 57 },
      3: { price: 1849, mrp: 4497, discount: 59 },
      4: { price: 2299, mrp: 5996, discount: 62 }
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
    id: 'pkg-life-maximiser-plus-male',
    slug: 'life-maximiser-plus-male',
    title: 'Diagnova Life Maximiser Plus Health Checkup Package - Male',
    category: 'Executive Health',
    tagline: 'Exclusive male executive health screening covering PSA prostate, testosterone & complete vital organs',
    parametersCount: 92,
    parametersSummary: 'Testosterone • PSA Prostate • Vit D & B12 • Cardiac • KFT',
    tatText: 'Report in 24 hours',
    baseMrp: 6499,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Executive Male',
    pricing: {
      1: { price: 2999, mrp: 6499, discount: 54 },
      2: { price: 5699, mrp: 12998, discount: 56 },
      3: { price: 8199, mrp: 19497, discount: 58 },
      4: { price: 10399, mrp: 25996, discount: 60 }
    },
    allParameters: [
      {
        category: 'Male Hormone & Reproductive Health',
        tests: ['Total Testosterone', 'Free Testosterone Index', 'PSA Total (Prostate Specific Antigen)']
      },
      {
        category: 'Vitamin & Neurological Markers',
        tests: ['Vitamin D Total (25-OH)', 'Vitamin B12 (Cyanocobalamin)', 'Serum Ferritin']
      },
      {
        category: 'Cardiac & Lipid Risk Profile',
        tests: ['hs-CRP (Cardiac Risk Marker)', 'Apolipoprotein A1', 'Apolipoprotein B', 'Lipid Profile Complete']
      },
      {
        category: 'Comprehensive Organ Panels',
        tests: ['Complete Hemogram (CBC)', 'Liver Function Tests (LFT)', 'Kidney Function Tests (KFT)', 'Thyroid Panel (TSH)']
      }
    ]
  },
  {
    id: 'pkg-life-maximiser-male',
    slug: 'life-maximiser-male',
    title: 'Diagnova Life Maximiser Health Checkup Package - Male',
    category: 'Men Health',
    tagline: 'Deep hormonal, cardiac and metabolic profiling tailored for proactive men',
    parametersCount: 84,
    parametersSummary: 'Testosterone • Heart Profile • Liver • Kidney • Pancreas',
    tatText: 'Report in 24 hours',
    baseMrp: 5499,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Advanced Male',
    pricing: {
      1: { price: 2499, mrp: 5499, discount: 55 },
      2: { price: 4699, mrp: 10998, discount: 57 },
      3: { price: 6799, mrp: 16497, discount: 59 },
      4: { price: 8599, mrp: 21996, discount: 61 }
    },
    allParameters: [
      {
        category: 'Hormonal Baseline',
        tests: ['Total Testosterone', 'DHEA-S']
      },
      {
        category: 'Metabolic & Cardiac Health',
        tests: ['HbA1c Glycated Hemoglobin', 'Lipid Profile 8 Parameters', 'Fasting Blood Sugar']
      },
      {
        category: 'Vital Organ Function',
        tests: ['Liver Function Panel (9 tests)', 'Renal Function Panel (5 tests)', 'Complete Blood Count (24 tests)']
      }
    ]
  },
  {
    id: 'pkg-summer-wellness-male',
    slug: 'summer-wellness-male',
    title: 'Diagnova Summer Wellness Package - Male',
    category: 'Men Health',
    tagline: 'Essential electrolyte, hydration, hepatic & metabolic recovery monitoring for active lifestyles',
    parametersCount: 68,
    parametersSummary: 'Electrolytes • Hydration Index • LFT • KFT • CBC',
    tatText: 'Report in 24 hours',
    baseMrp: 4299,
    fastingHours: 8,
    iconType: 'droplet',
    badge: 'Seasonal Wellness',
    pricing: {
      1: { price: 1999, mrp: 4299, discount: 53 },
      2: { price: 3799, mrp: 8598, discount: 56 },
      3: { price: 5499, mrp: 12897, discount: 57 },
      4: { price: 6999, mrp: 17196, discount: 59 }
    },
    allParameters: [
      {
        category: 'Hydration & Electrolyte Balance',
        tests: ['Sodium', 'Potassium', 'Chloride', 'Serum Osmolality']
      },
      {
        category: 'Hepatic & Renal Protection',
        tests: ['SGOT', 'SGPT', 'Bilirubin Total', 'Serum Creatinine', 'Uric Acid', 'BUN']
      },
      {
        category: 'Blood & Infection Screening',
        tests: ['CBC Complete Blood Count', 'ESR']
      }
    ]
  },
  {
    id: 'pkg-cancer-screening-female',
    slug: 'cancer-screening-female',
    title: 'Cancer Screening Package For Female',
    category: 'Cancer Screening',
    tagline: 'Targeted clinical oncological screening markers including CA-125 ovarian biomarker and CEA',
    parametersCount: 12,
    parametersSummary: 'CA-125 (Ovarian) • CEA • Complete Blood • ESR • Smear',
    tatText: 'Report in 24 hours',
    baseMrp: 2199,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Women Oncology',
    pricing: {
      1: { price: 999, mrp: 2199, discount: 55 },
      2: { price: 1899, mrp: 4398, discount: 57 },
      3: { price: 2699, mrp: 6597, discount: 59 },
      4: { price: 3399, mrp: 8796, discount: 61 }
    },
    allParameters: [
      {
        category: 'Tumor Markers & Oncology Screening',
        tests: [
          'CA-125 (Ovarian Cancer Marker)',
          'CEA (Carcinoembryonic Antigen - GI & General Marker)',
          'AFP (Alpha-Fetoprotein)'
        ]
      },
      {
        category: 'Cellular & Hematological Analysis',
        tests: [
          'Complete Blood Count (CBC)',
          'Peripheral Blood Smear Examination',
          'ESR (Erythrocyte Sedimentation Rate)'
        ]
      }
    ]
  },
  {
    id: 'pkg-cancer-screening-male',
    slug: 'cancer-screening-male',
    title: 'Cancer Screening Package For Male',
    category: 'Cancer Screening',
    tagline: 'Targeted clinical oncological screening markers including PSA prostate biomarker and CEA',
    parametersCount: 12,
    parametersSummary: 'PSA Total (Prostate) • CEA • Complete Blood • ESR • Smear',
    tatText: 'Report in 24 hours',
    baseMrp: 2199,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Men Oncology',
    pricing: {
      1: { price: 999, mrp: 2199, discount: 55 },
      2: { price: 1899, mrp: 4398, discount: 57 },
      3: { price: 2699, mrp: 6597, discount: 59 },
      4: { price: 3399, mrp: 8796, discount: 61 }
    },
    allParameters: [
      {
        category: 'Tumor Markers & Oncology Screening',
        tests: [
          'PSA Total (Prostate Specific Antigen)',
          'CEA (Carcinoembryonic Antigen - GI & Colorectal Marker)',
          'AFP (Alpha-Fetoprotein)'
        ]
      },
      {
        category: 'Cellular & Hematological Analysis',
        tests: [
          'Complete Blood Count (CBC)',
          'Peripheral Blood Smear Examination',
          'ESR (Erythrocyte Sedimentation Rate)'
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
