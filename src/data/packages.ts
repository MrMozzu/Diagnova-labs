import type { PackageItem } from '../types';

export const FEATURED_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-healthy-india-2026',
    slug: 'healthy-india-2026-advance-plus',
    title: 'Healthy India 2026 Full Body Checkup Advance Plus',
    category: 'Full Body Checkup',
    tagline: 'Flagship preventative health evaluation with full vital organ & metabolic screening',
    parametersCount: 92,
    parametersSummary: 'Complete Blood • Liver • Kidney • Thyroid • Urine • Sugar • HbA1c',
    tatText: 'Report in 24 hours',
    baseMrp: 3663,
    fastingHours: 10,
    iconType: 'user',
    badge: '🔥 Most Booked in the last 30 days',
    pricing: {
      1: { price: 1099, mrp: 3663, discount: 70 },
      2: { price: 2099, mrp: 7326, discount: 71 },
      3: { price: 2999, mrp: 10989, discount: 73 },
      4: { price: 3799, mrp: 14652, discount: 74 }
    },
    allParameters: [
      {
        category: 'Complete Blood Count (CBC - 24 tests)',
        tests: [
          'Hemoglobin Hb',
          'RBC Count',
          'WBC-Total Counts Leucocytes',
          'Platelet Count Thrombocyte count',
          'PCV Haematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW (Red Cell Distribution Width)',
          'RDW-CV',
          'Absolute Neutrophil Count',
          'Absolute Lymphocyte Count',
          'Absolute Monocyte Count',
          'Absolute Eosinophil Count',
          'Absolute Basophils Count',
          'Neutrophils',
          'Lymphocytes',
          'Monocytes',
          'Eosinophils',
          'Basophils',
          'MPV Mean Platelet Volume',
          'MENTZER INDEX',
          'RDWI',
          'GK Index'
        ]
      },
      {
        category: 'Liver Function Test (LFT - 12 tests)',
        tests: [
          'Albumin, Serum',
          'Alkaline Phosphatase, Serum',
          'Bilirubin Direct, Serum',
          'Bilirubin Total, Serum',
          'Bilirubin- Indirect, Serum',
          'GGTP (Gamma GT)',
          'Proteins, Serum',
          'SGOT/AST',
          'SGPT/ALT',
          'Globulin',
          'A/G Ratio',
          'SGOT/SGPT Ratio'
        ]
      },
      {
        category: 'Kidney Function Test Advance (KFT - 11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'eGFR Estimated Glomerular Filtration'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Urine Routine & Microscopy Extended (21 tests)',
        tests: [
          'pH Urine',
          'Specific gravity',
          'Colour',
          'Transparency',
          'Sugar',
          'Blood',
          'Urobilinogen',
          'URINE PROTEIN',
          'URINE KETONE',
          'Nitrate',
          'Bile Pigments (Bilirubin)',
          'Leucocyte Esterase',
          'Red Blood Cells',
          'Pus cells (Leukocytes)',
          'Epithelial cells',
          'Crystals',
          'Cast',
          'Bacteria',
          'Yeast Cells',
          'Volume - Urine',
          'Others - Urine'
        ]
      },
      {
        category: 'Thyroid, HbA1c & Metabolic Profile (15 tests)',
        tests: [
          'TSH Ultra - Sensitive',
          'Total Triiodothyronine (T3)',
          'Total Thyroxine (T4)',
          'Free T3 (FT3)',
          'Free T4 (FT4)',
          'HbA1c (Glycated Hemoglobin)',
          'Estimated Average Glucose (eAG)',
          'Blood Glucose Fasting',
          'Serum Calcium',
          'Phosphorus-Inorganic',
          'Sodium',
          'Potassium',
          'Chlorides',
          'Total Protein',
          'Vitamin D Total (25-OH)'
        ]
      }
    ]
  },
  {
    id: 'pkg-be-healthy-comprehensive',
    slug: 'be-healthy-comprehensive-package',
    title: 'Be Healthy Comprehensive Package (With HbA1c)',
    category: 'Full Body Checkup',
    tagline: 'Vital preventative health screening with gold-standard 3-month HbA1c & metabolic markers',
    parametersCount: 92,
    parametersSummary: 'HbA1c HPLC • Fasting Sugar • LFT • KFT • Lipid • CBC • Thyroid',
    tatText: 'Report in 24 hours',
    baseMrp: 5330,
    fastingHours: 10,
    iconType: 'droplet',
    badge: 'Comprehensive',
    pricing: {
      1: { price: 1599, mrp: 5330, discount: 70 },
      2: { price: 2999, mrp: 10660, discount: 72 },
      3: { price: 4299, mrp: 15990, discount: 73 },
      4: { price: 5499, mrp: 21320, discount: 74 }
    },
    allParameters: [
      {
        category: 'Diabetes & Glycemic Assessment (With HbA1c - 3 tests)',
        tests: [
          'HbA1c (Glycosylated Hemoglobin) - HPLC Method',
          'Estimated Average Glucose (eAG)',
          'Glucose (Fasting Blood Sugar)'
        ]
      },
      {
        category: 'Complete Blood Count (CBC - 24 tests)',
        tests: [
          'Hemoglobin', 'RBC Count', 'WBC Total Count', 'Platelet Count', 'PCV / Hematocrit',
          'MCV', 'MCH', 'MCHC', 'RDW-CV', 'RDW-SD', 'Neutrophils', 'Lymphocytes',
          'Monocytes', 'Eosinophils', 'Basophils', 'Absolute Neutrophils', 'Absolute Lymphocytes',
          'Absolute Monocytes', 'Absolute Eosinophils', 'Absolute Basophils', 'MPV', 'PDW', 'PCT', 'ESR'
        ]
      },
      {
        category: 'Liver Function Tests (LFT - 12 tests)',
        tests: [
          'Bilirubin Total', 'Bilirubin Direct', 'Bilirubin Indirect', 'SGOT / AST',
          'SGPT / ALT', 'Alkaline Phosphatase (ALP)', 'Total Protein', 'Albumin',
          'Globulin', 'A/G Ratio', 'GGTP', 'SGOT/SGPT Ratio'
        ]
      },
      {
        category: 'Kidney Function Tests (KFT - 11 tests)',
        tests: [
          'Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'Uric Acid', 'Urea',
          'BUN / Creatinine Ratio', 'Urea / Creatinine Ratio', 'Calcium Total',
          'Phosphorus', 'Sodium', 'Potassium', 'Chloride'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol',
          'Triglycerides', 'VLDL Cholesterol', 'Non-HDL Cholesterol',
          'Total / HDL Ratio', 'LDL / HDL Ratio', 'HDL / LDL Ratio'
        ]
      },
      {
        category: 'Urine Routine & Extended Examination (19 tests)',
        tests: [
          'Urine Protein', 'Urine Glucose', 'Ketone Bodies', 'Specific Gravity',
          'pH', 'Urobilinogen', 'Bile Salt', 'Bile Pigment', 'Pus Cells',
          'RBCs', 'Epithelial Cells', 'Casts', 'Crystals', 'Bacteria', 'Yeast',
          'Nitrite', 'Leukocyte Esterase', 'Color', 'Clarity'
        ]
      },
      {
        category: 'Thyroid, Iron & Vitamin Markers (14 tests)',
        tests: [
          'TSH Ultra-sensitive',
          'Total Triiodothyronine (T3)',
          'Total Thyroxine (T4)',
          'Serum Iron',
          'Serum Ferritin',
          'Total Iron Binding Capacity (TIBC)',
          'Transferrin Saturation %',
          'Vitamin D Total (25-OH)',
          'Vitamin B12 (Cyanocobalamin)',
          'Serum Magnesium',
          'Serum Zinc',
          'eGFR Estimated Glomerular Filtration',
          'hs-CRP (Cardiac Inflammation)',
          'Microalbuminuria'
        ]
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
    baseMrp: 8330,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Advanced Male',
    pricing: {
      1: { price: 2499, mrp: 8330, discount: 70 },
      2: { price: 4699, mrp: 16660, discount: 72 },
      3: { price: 6799, mrp: 24990, discount: 73 },
      4: { price: 8599, mrp: 33320, discount: 74 }
    },
    allParameters: [
      {
        category: 'Hormonal Baseline',
        tests: ['Total Testosterone', 'DHEA-S']
      },
      {
        category: 'Metabolic & Cardiac Health',
        tests: ['HbA1c Glycated Hemoglobin', 'Lipid Profile 8 Parameters', 'Fasting Blood Sugar', 'Cardiac hs-CRP']
      },
      {
        category: 'Vital Organ Function',
        tests: ['Liver Function Panel (12 tests)', 'Renal Function Panel (11 tests)', 'Complete Blood Count (24 tests)', 'Urine Examination (23 tests)']
      }
    ]
  },
  {
    id: 'pkg-life-maximiser-female',
    slug: 'life-maximiser-female',
    title: 'Diagnova Life Maximiser Health Checkup Package - Female',
    category: 'Women Health',
    tagline: 'Deep hormonal, thyroid, ferritin and vital organ evaluation designed for women',
    parametersCount: 86,
    parametersSummary: 'Thyroid Total • Ferritin & Iron • HbA1c • Calcium • LFT',
    tatText: 'Report in 24 hours',
    baseMrp: 8330,
    fastingHours: 10,
    iconType: 'female',
    badge: 'Advanced Female',
    pricing: {
      1: { price: 2499, mrp: 8330, discount: 70 },
      2: { price: 4699, mrp: 16660, discount: 72 },
      3: { price: 6799, mrp: 24990, discount: 73 },
      4: { price: 8599, mrp: 33320, discount: 74 }
    },
    allParameters: [
      {
        category: 'Thyroid & Hormonal Baseline',
        tests: ['TSH Ultra-sensitive', 'Total T3', 'Total T4']
      },
      {
        category: 'Iron Metabolism & Bone Baseline',
        tests: ['Serum Iron', 'Serum Ferritin', 'TIBC', 'Calcium Total', 'Phosphorus']
      },
      {
        category: 'Glycemic & Lipid Health',
        tests: ['HbA1c Glycated Hemoglobin', 'Fasting Blood Sugar', 'Lipid Profile (9 tests)']
      },
      {
        category: 'Vital Organ & Hematology',
        tests: ['Complete Blood Count (CBC - 24 tests)', 'Liver Function Tests (LFT - 12 tests)', 'Kidney Function Tests (KFT - 11 tests)', 'Urine Examination (20 tests)']
      }
    ]
  },
  {
    id: 'pkg-life-maximiser-plus-male',
    slug: 'life-maximiser-plus-male',
    title: 'Diagnova Life Maximiser Plus Health Checkup Package - Male',
    category: 'Men Health',
    tagline: 'Exclusive male executive health screening covering PSA prostate, testosterone & complete vital organs',
    parametersCount: 92,
    parametersSummary: 'Testosterone • PSA Prostate • Vit D & B12 • Cardiac • KFT',
    tatText: 'Report in 24 hours',
    baseMrp: 9999,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Executive Male',
    pricing: {
      1: { price: 2999, mrp: 9999, discount: 70 },
      2: { price: 5699, mrp: 19998, discount: 71 },
      3: { price: 8199, mrp: 29997, discount: 73 },
      4: { price: 10399, mrp: 39996, discount: 74 }
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
        tests: ['hs-CRP (Cardiac Risk Marker)', 'Apolipoprotein A1', 'Apolipoprotein B', 'Lipid Profile Complete (9 tests)']
      },
      {
        category: 'Comprehensive Organ Panels',
        tests: ['Complete Hemogram (CBC - 24 tests)', 'Liver Function Tests (LFT - 12 tests)', 'Kidney Function Tests (KFT - 11 tests)', 'Thyroid Panel (TSH)', 'Urine Routine Extended (26 tests)']
      }
    ]
  },
  {
    id: 'pkg-life-maximiser-plus-female',
    slug: 'life-maximiser-plus-female',
    title: 'Diagnova Life Maximiser Plus Health Checkup Package - Female',
    category: 'Women Health',
    tagline: 'Exclusive female executive wellness covering CA-125 ovarian biomarker, thyroid, vitamins & vital organs',
    parametersCount: 94,
    parametersSummary: 'CA-125 Ovarian • Thyroid Total • Vit D & B12 • Bone • LFT',
    tatText: 'Report in 24 hours',
    baseMrp: 9999,
    fastingHours: 10,
    iconType: 'female',
    badge: 'Executive Female',
    pricing: {
      1: { price: 2999, mrp: 9999, discount: 70 },
      2: { price: 5699, mrp: 19998, discount: 71 },
      3: { price: 8199, mrp: 29997, discount: 73 },
      4: { price: 10399, mrp: 39996, discount: 74 }
    },
    allParameters: [
      {
        category: 'Female Tumor Markers & Oncology Screening',
        tests: ['CA-125 (Ovarian Cancer Biomarker)', 'CEA (Carcinoembryonic Antigen)', 'AFP (Alpha-Fetoprotein)']
      },
      {
        category: 'Vitamins, Iron & Bone Metabolism',
        tests: ['Vitamin D Total (25-OH)', 'Vitamin B12', 'Serum Ferritin', 'Serum Iron', 'TIBC', 'Calcium Total', 'Phosphorus']
      },
      {
        category: 'Thyroid & Metabolic Health',
        tests: ['TSH Ultra-sensitive', 'Total T3', 'Total T4', 'HbA1c Glycated Hemoglobin', 'Fasting Blood Sugar']
      },
      {
        category: 'Vital Organ Function & Blood Counts',
        tests: ['Complete Blood Count (CBC - 24 tests)', 'Liver Function Tests (LFT - 12 tests)', 'Kidney Function Tests (KFT - 11 tests)', 'Lipid Profile (9 tests)', 'Urine Routine Examination (23 tests)']
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
    baseMrp: 6663,
    fastingHours: 8,
    iconType: 'droplet',
    badge: 'Seasonal Wellness',
    pricing: {
      1: { price: 1999, mrp: 6663, discount: 70 },
      2: { price: 3799, mrp: 13326, discount: 71 },
      3: { price: 5499, mrp: 19989, discount: 72 },
      4: { price: 6999, mrp: 26652, discount: 74 }
    },
    allParameters: [
      {
        category: 'Hydration & Electrolyte Balance',
        tests: ['Sodium', 'Potassium', 'Chloride', 'Serum Osmolality']
      },
      {
        category: 'Hepatic & Renal Protection',
        tests: ['SGOT', 'SGPT', 'Bilirubin Total', 'Serum Creatinine', 'Uric Acid', 'BUN', 'Alkaline Phosphatase']
      },
      {
        category: 'Blood & Infection Screening',
        tests: ['CBC Complete Blood Count (24 tests)', 'ESR', 'Urine Specific Gravity & Routine (22 tests)', 'Fasting Glucose (9 tests)']
      }
    ]
  },
  {
    id: 'pkg-summer-wellness-female',
    slug: 'summer-wellness-female',
    title: 'Diagnova Summer Wellness Package - Female',
    category: 'Women Health',
    tagline: 'Targeted hydration, electrolyte, calcium, vitamin & metabolic monitoring for women',
    parametersCount: 68,
    parametersSummary: 'Electrolytes • Hydration • Calcium • LFT • KFT • CBC',
    tatText: 'Report in 24 hours',
    baseMrp: 6663,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Seasonal Wellness',
    pricing: {
      1: { price: 1999, mrp: 6663, discount: 70 },
      2: { price: 3799, mrp: 13326, discount: 71 },
      3: { price: 5499, mrp: 19989, discount: 72 },
      4: { price: 6999, mrp: 26652, discount: 74 }
    },
    allParameters: [
      {
        category: 'Hydration, Electrolytes & Bone Health',
        tests: ['Sodium', 'Potassium', 'Chloride', 'Serum Calcium', 'Phosphorus']
      },
      {
        category: 'Hepatic & Renal Balance',
        tests: ['SGOT', 'SGPT', 'Bilirubin Total', 'Serum Creatinine', 'BUN', 'Uric Acid']
      },
      {
        category: 'Blood Counts & Metabolic Screen',
        tests: ['CBC Complete Blood Count (24 tests)', 'ESR', 'Fasting Blood Sugar', 'Urine Routine Extended (21 tests)', 'Lipid Screen (9 tests)']
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
    baseMrp: 3330,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Women Oncology',
    pricing: {
      1: { price: 999, mrp: 3330, discount: 70 },
      2: { price: 1899, mrp: 6660, discount: 71 },
      3: { price: 2699, mrp: 9990, discount: 73 },
      4: { price: 3399, mrp: 13320, discount: 74 }
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
          'Complete Blood Count (CBC - 6 tests)',
          'Peripheral Blood Smear Examination',
          'ESR (Erythrocyte Sedimentation Rate)',
          'Total Leucocyte Count'
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
    baseMrp: 3330,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Men Oncology',
    pricing: {
      1: { price: 999, mrp: 3330, discount: 70 },
      2: { price: 1899, mrp: 6660, discount: 71 },
      3: { price: 2699, mrp: 9990, discount: 73 },
      4: { price: 3399, mrp: 13320, discount: 74 }
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
          'Complete Blood Count (CBC - 6 tests)',
          'Peripheral Blood Smear Examination',
          'ESR (Erythrocyte Sedimentation Rate)',
          'Total Leucocyte Count'
        ]
      }
    ]
  },
  {
    id: 'pkg-diabetic-checkup-prime',
    slug: 'diabetic-checkup-prime',
    title: 'Diagnova Diabetic Checkup Prime',
    category: 'Diabetes Care',
    tagline: 'Vital preventative diabetes screening powered by gold-standard 3-month HbA1c & metabolic markers',
    parametersCount: 44,
    parametersSummary: 'HbA1c HPLC • Fasting Sugar • Lipid • KFT • Microalbumin',
    tatText: 'Report in 6 hours',
    baseMrp: 2330,
    fastingHours: 10,
    iconType: 'droplet',
    badge: 'Diabetes Prime',
    pricing: {
      1: { price: 699, mrp: 2330, discount: 70 },
      2: { price: 1299, mrp: 4660, discount: 72 },
      3: { price: 1849, mrp: 6990, discount: 74 },
      4: { price: 2299, mrp: 9320, discount: 75 }
    },
    allParameters: [
      {
        category: 'Diabetes & Glycemic Assessment (3 tests)',
        tests: [
          'HbA1c (Glycosylated Hemoglobin) - HPLC Method',
          'Estimated Average Glucose (eAG)',
          'Glucose (Fasting Blood Sugar)'
        ]
      },
      {
        category: 'Renal & Microvascular Protection (5 tests)',
        tests: [
          'Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'Urea', 'Uric Acid', 'Urine Microalbumin'
        ]
      },
      {
        category: 'Cardiovascular Lipid Profile (9 tests)',
        tests: [
          'Cholesterol Total', 'HDL Good Cholesterol', 'LDL Bad Cholesterol',
          'Triglycerides', 'VLDL Cholesterol', 'Non-HDL Cholesterol',
          'Total / HDL Ratio', 'LDL / HDL Ratio', 'HDL / LDL Ratio'
        ]
      },
      {
        category: 'Liver Vital Markers (3 tests)',
        tests: ['SGOT / AST', 'SGPT / ALT', 'Bilirubin Total']
      },
      {
        category: 'Urine Routine & Microscopic (24 tests)',
        tests: [
          'Urine Sugar', 'Urine Protein', 'Ketones', 'Pus Cells', 'RBCs',
          'Epithelial Cells', 'Specific Gravity', 'pH', 'Bile Salt', 'Bile Pigment',
          'Urobilinogen', 'Casts', 'Crystals', 'Bacteria', 'Others'
        ]
      }
    ]
  },
  {
    id: 'pkg-cardiac-health-marker',
    slug: 'cardiac-health-marker-package',
    title: 'Cardiac Health Marker Package',
    category: 'Cardiac Care',
    tagline: 'Targeted cardiovascular evaluation for cholesterol, lipids, myocardial injury and blood sugar',
    parametersCount: 11,
    parametersSummary: 'Lipid Profile • Troponin I • Random Blood Sugar',
    tatText: 'Report in 36 Hrs.',
    baseMrp: 1663,
    fastingHours: 12,
    iconType: 'heart',
    badge: 'Popular Heart',
    pricing: {
      1: { price: 499, mrp: 1663, discount: 70 },
      2: { price: 949, mrp: 3326, discount: 71 },
      3: { price: 1399, mrp: 4989, discount: 72 },
      4: { price: 1799, mrp: 6652, discount: 73 }
    },
    allParameters: [
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Cardiac Injury & Glycemic Markers (2 tests)',
        tests: [
          'Troponin I (HS Quantitative)',
          'Random Blood Sugar'
        ]
      }
    ]
  },
  {
    id: 'pkg-cardiac-marker-comprehensive',
    slug: 'cardiac-health-marker-package-comprehensive',
    title: 'Cardiac Health Marker Package Comprehensive',
    category: 'Cardiac Care',
    tagline: 'Advanced heart assessment covering Apolipoproteins A1 & B, Homocysteine, Lp(a) and Troponin',
    parametersCount: 16,
    parametersSummary: 'Lipid Profile • Apolipoprotein A1/B • Homocysteine • Lp(a) • Troponin I',
    tatText: 'Report in 36 Hrs.',
    baseMrp: 6038,
    fastingHours: 12,
    iconType: 'heart',
    badge: 'Cardiac Advanced',
    pricing: {
      1: { price: 1811, mrp: 6038, discount: 70 },
      2: { price: 3499, mrp: 12076, discount: 71 },
      3: { price: 4999, mrp: 18114, discount: 72 },
      4: { price: 6399, mrp: 24152, discount: 73 }
    },
    allParameters: [
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Apolipoproteins Profile (A1, B, B/A1 Ratio) (3 tests)',
        tests: [
          'Apolipoproteins A1, Serum',
          'Apolipoproteins B, Serum',
          'Apolipoproteins B/A1, Serum Ratio'
        ]
      },
      {
        category: 'Specialized Cardiac Risk & Metabolic Markers (4 tests)',
        tests: [
          'Homocysteine',
          'Lp(a) Lipoprotein(a)',
          'Troponin I (HS Quantitative)',
          'Random Blood Sugar'
        ]
      }
    ]
  },
  {
    id: 'pkg-cardiac-risk-special',
    slug: 'diagnova-cardiac-risk-special',
    title: 'Diagnova Cardiac Risk Special',
    category: 'Cardiac Care',
    tagline: 'Exhaustive cardio-metabolic evaluation spanning lipids, cardiac markers, CBC, liver & kidney panels',
    parametersCount: 71,
    parametersSummary: 'Cardiac Markers • Lipid 9 • LFT 12 • KFT 11 • CBC 24 • HbA1c',
    tatText: 'Report in 12 Hrs.',
    baseMrp: 9829,
    fastingHours: 12,
    iconType: 'heart',
    badge: 'Complete Cardiac',
    pricing: {
      1: { price: 2949, mrp: 9829, discount: 70 },
      2: { price: 5699, mrp: 19658, discount: 71 },
      3: { price: 8199, mrp: 29487, discount: 72 },
      4: { price: 10499, mrp: 39316, discount: 73 }
    },
    allParameters: [
      {
        category: 'Specialized Cardiac Biomarkers (7 tests)',
        tests: [
          'Troponin I (HS Quantitative)',
          'Homocysteine',
          'hs-CRP (High-Sensitivity C-Reactive Protein)',
          'Apolipoproteins A1, Serum',
          'Apolipoproteins B, Serum',
          'Apolipoproteins B/A1 Ratio',
          'Lp(a) Lipoprotein(a)'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Complete Blood Count (CBC - 24 tests)',
        tests: [
          'Hemoglobin Hb',
          'RBC Count',
          'WBC-Total Counts Leucocytes',
          'Platelet Count Thrombocyte count',
          'PCV Haematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW-CV',
          'Absolute Neutrophil Count',
          'Absolute Lymphocyte Count',
          'Absolute Monocyte Count',
          'Absolute Eosinophil Count',
          'Absolute Basophils Count',
          'Neutrophils',
          'Lymphocytes',
          'Monocytes',
          'Eosinophils',
          'Basophils',
          'MPV Mean Platelet Volume',
          'MENTZER INDEX',
          'Red Blood Cells - Blood',
          'RDWI',
          'GK Index'
        ]
      },
      {
        category: 'Liver Function Test (LFT - 12 tests)',
        tests: [
          'Albumin, Serum',
          'Alkaline Phosphatase, Serum',
          'Bilirubin Direct, Serum',
          'Bilirubin Total, Serum',
          'Bilirubin- Indirect, Serum',
          'GGTP (Gamma GT)',
          'Proteins, Serum',
          'SGOT/AST',
          'SGPT/ALT',
          'Globulin',
          'A/G Ratio',
          'SGOT/SGPT Ratio'
        ]
      },
      {
        category: 'Kidney Function Test Advance (KFT - 11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'eGFR Estimated Glomerular Filtration'
        ]
      },
      {
        category: 'Diabetes & Urine Indicators (8 tests)',
        tests: [
          'Blood Glucose Fasting',
          'HbA1c Glycated Hemoglobin',
          'Average blood glucose',
          'Urine Protein',
          'Urine Sugar',
          'Specific Gravity',
          'pH Urine',
          'Pus cells (Leukocytes)'
        ]
      }
    ]
  },
  {
    id: 'pkg-cancer-screening-male-comp',
    slug: 'diagnova-cancer-screening-package-male',
    title: 'Comprehensive Cancer Screening Package For Male',
    category: 'Cancer Screening',
    tagline: 'Broad oncological surveillance with AFP liver, PSA Total & Free, CEA and CA-19.9 biomarkers',
    parametersCount: 5,
    parametersSummary: 'AFP Liver • PSA Free & Total • CEA • CA-19.9',
    tatText: 'Report in 63 Hrs.',
    baseMrp: 4757,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Comprehensive Oncology',
    pricing: {
      1: { price: 1427, mrp: 4757, discount: 70 },
      2: { price: 2749, mrp: 9514, discount: 71 },
      3: { price: 3999, mrp: 14271, discount: 72 },
      4: { price: 5099, mrp: 19028, discount: 73 }
    },
    allParameters: [
      {
        category: 'Tumor Markers & Oncology Surveillance (5 tests)',
        tests: [
          'AFP-Alpha Feto Protein (Liver Cancer Marker Test)',
          'PSA-total Prostate Specific Antigen (Prostate Cancer Marker Test)',
          'PSA-Free Prostate Specific Antigen (Prostate Cancer Marker Test)',
          'CEA-Carcino Embryonic Antigen (Colorectal Cancer Marker Test)',
          'CA-19.9 (Pancreatic Cancer Marker Test)'
        ]
      }
    ]
  },
  {
    id: 'pkg-thyroid-profile-total',
    slug: 'thyroid-profile-total',
    title: 'Thyroid Profile-Total (T3, T4 & TSH Ultra-sensitive)',
    category: 'Thyroid Care',
    tagline: 'Standard frontline trio for hyperthyroidism, hypothyroidism & metabolic balance monitoring',
    parametersCount: 3,
    parametersSummary: 'T3 Total • T4 Total • TSH Ultra-Sensitive',
    tatText: 'Report in 23 Hrs.',
    baseMrp: 1423,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Popular Thyroid',
    pricing: {
      1: { price: 449, mrp: 1423, discount: 68 },
      2: { price: 849, mrp: 2846, discount: 70 },
      3: { price: 1249, mrp: 4269, discount: 71 },
      4: { price: 1599, mrp: 5692, discount: 72 }
    },
    allParameters: [
      {
        category: 'Thyroid Profile-Total (3 tests)',
        tests: [
          'T3, Total Tri Iodothyronine',
          'T4, Total Thyroxine',
          'TSH Ultra - Sensitive'
        ]
      }
    ]
  },
  {
    id: 'pkg-thyroid-health-assessment',
    slug: 'diagnova-thyroid-health-diagnostic-package',
    title: 'Thyroid Health Assessment Package',
    category: 'Thyroid Care',
    tagline: 'Comprehensive assessment combining total thyroid hormones with unbound Free T3 and Free T4',
    parametersCount: 5,
    parametersSummary: 'T3 • T4 • TSH • Free T3 • Free T4',
    tatText: 'Report in 33 Hrs.',
    baseMrp: 2543,
    fastingHours: 8,
    iconType: 'shield',
    badge: 'Thyroid Advanced',
    pricing: {
      1: { price: 763, mrp: 2543, discount: 70 },
      2: { price: 1469, mrp: 5086, discount: 71 },
      3: { price: 2129, mrp: 7629, discount: 72 },
      4: { price: 2729, mrp: 10172, discount: 73 }
    },
    allParameters: [
      {
        category: 'Thyroid Profile-Total (3 tests)',
        tests: [
          'T3, Total Tri Iodothyronine',
          'T4, Total Thyroxine',
          'TSH Ultra - Sensitive'
        ]
      },
      {
        category: 'Free Thyroid Fractions (2 tests)',
        tests: [
          'T3, Free Free Tri-Iodothyronine',
          'T4, Free Free Thyroxine'
        ]
      }
    ]
  },
  {
    id: 'pkg-thyroid-plus-checkup',
    slug: 'diagnova-prime-care-thyroid-plus',
    title: 'Diagnova Prime Care Thyroid Plus Checkup Package',
    category: 'Thyroid Care',
    tagline: 'All-inclusive full body profile integrating thyroid surveillance with CBC, liver, renal & lipid systems',
    parametersCount: 79,
    parametersSummary: 'TSH Ultra • CBC 24 • LFT 12 • KFT 11 • Urine 21 • Lipid 9',
    tatText: 'Report in 24 Hrs.',
    baseMrp: 4257,
    fastingHours: 10,
    iconType: 'shield',
    badge: 'Super Saver 82% Off',
    pricing: {
      1: { price: 767, mrp: 4257, discount: 82 },
      2: { price: 1489, mrp: 8514, discount: 83 },
      3: { price: 2159, mrp: 12771, discount: 83 },
      4: { price: 2759, mrp: 17028, discount: 84 }
    },
    allParameters: [
      {
        category: 'COMPLETE BLOOD COUNT (CBC - 24 tests)',
        tests: [
          'Absolute Basophils Count, Blood',
          'Absolute Eosinophil Count, Blood',
          'Absolute Lymphocyte Count, Blood',
          'Absolute Monocyte Count, Blood',
          'Absolute Neutrophil Count, Blood',
          'Hemoglobin Hb',
          'MCH',
          'MCHC',
          'MCV',
          'MPV Mean Platelet Volume',
          'PCV Haematocrit',
          'Platelet Count Thrombocyte count',
          'WBC-Total Counts Leucocytes',
          'RDW (Red Cell Distribution Width)',
          'Neutrophils',
          'Eosinophils',
          'Lymphocytes',
          'Monocytes',
          'Basophils',
          'RDW-CV',
          'MENTZER INDEX',
          'Red Blood Cells - Blood',
          'RDWI',
          'GK Index'
        ]
      },
      {
        category: 'Liver Function Test (LFT - 12 tests)',
        tests: [
          'Albumin, Serum',
          'Alkaline Phosphatase, Serum',
          'Bilirubin Direct, Serum',
          'Bilirubin Total, Serum',
          'Bilirubin- Indirect, Serum',
          'GGTP (Gamma GT)',
          'Proteins, Serum',
          'SGOT/AST',
          'SGPT/ALT',
          'Globulin',
          'A/G Ratio',
          'SGOT/SGPT Ratio'
        ]
      },
      {
        category: 'Kidney Function Test Advance (KFT - 11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'EGFR'
        ]
      },
      {
        category: 'Urine Routine & Microscopy Extended (21 tests)',
        tests: [
          'pH Urine',
          'Specific gravity',
          'Urobilinogen',
          'Colour',
          'Transparency',
          'Sugar',
          'Blood',
          'Red Blood Cells',
          'Pus cells (Leukocytes)',
          'Epithelial cells',
          'Crystals',
          'Cast',
          'Bacteria',
          'Yeast Cells',
          'Nitrate',
          'URINE KETONE',
          'URINE PROTEIN',
          'Leucocyte Esterase',
          'Bile Pigments (Bilirubin)',
          'Others - Urine',
          'Volume - Urine'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Thyroid & Glucose Assessment (2 tests)',
        tests: [
          'TSH Ultra - Sensitive',
          'Blood Glucose Fasting'
        ]
      }
    ]
  },
  {
    id: 'pkg-diagnova-diabetic-checkup',
    slug: 'diagnova-diabetic-checkup',
    title: 'Diagnova Diabetic Checkup',
    category: 'Diabetes Care',
    tagline: 'Gold-standard diabetes management combining 3-month HbA1c, fasting glucose, KFT and lipid profile',
    parametersCount: 44,
    parametersSummary: 'HbA1c • Fasting Sugar • KFT Advance • Lipid Profile • Urine Extended',
    tatText: 'Report in 19 Hrs.',
    baseMrp: 2800,
    fastingHours: 10,
    iconType: 'droplet',
    badge: 'Diabetes Special',
    pricing: {
      1: { price: 840, mrp: 2800, discount: 70 },
      2: { price: 1629, mrp: 5600, discount: 71 },
      3: { price: 2349, mrp: 8400, discount: 72 },
      4: { price: 2999, mrp: 11200, discount: 73 }
    },
    allParameters: [
      {
        category: 'HbA1c & Blood Glucose (3 tests)',
        tests: [
          'Glycated Hemoglobin (HbA1c)',
          'Average blood glucose',
          'Blood Glucose Fasting'
        ]
      },
      {
        category: 'Kidney Function Test Advance (11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'eGFR'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Urine Routine & Microscopy Extended (21 tests)',
        tests: [
          'pH Urine',
          'Specific gravity',
          'Urobilinogen',
          'Colour',
          'Transparency',
          'Sugar',
          'Blood',
          'Red Blood Cells',
          'Pus cells (Leukocytes)',
          'Epithelial cells',
          'Crystals',
          'Cast',
          'Bacteria',
          'Yeast Cells',
          'Nitrate',
          'URINE KETONE',
          'URINE PROTEIN',
          'Leucocyte Esterase',
          'Bile Pigments (Bilirubin)',
          'Others - Urine',
          'Volume - Urine'
        ]
      }
    ]
  },
  {
    id: 'pkg-advance-diabetes-senior-male',
    slug: 'diabetic-male-senior-citizen-health-check',
    title: 'Advance Diabetes Monitoring (Senior Male)',
    category: 'Diabetes Care',
    tagline: 'Comprehensive senior male diabetes management integrating HbA1c, thyroid, renal, urine & lipid profiles',
    parametersCount: 49,
    parametersSummary: 'HbA1c • Thyroid Profile • KFT Advance • Lipid Profile • Urine Extended',
    tatText: 'Report in 23 Hrs.',
    baseMrp: 7371,
    fastingHours: 10,
    iconType: 'user',
    badge: 'Senior Male Care',
    pricing: {
      1: { price: 2211, mrp: 7371, discount: 70 },
      2: { price: 4299, mrp: 14742, discount: 71 },
      3: { price: 6199, mrp: 22113, discount: 72 },
      4: { price: 7899, mrp: 29484, discount: 73 }
    },
    allParameters: [
      {
        category: 'Thyroid Profile-Total (3 tests)',
        tests: [
          'T3, Total Tri Iodothyronine',
          'T4, Total Thyroxine',
          'TSH Ultra - Sensitive'
        ]
      },
      {
        category: 'HbA1c & Glucose Control (3 tests)',
        tests: [
          'Glycated Hemoglobin (HbA1c)',
          'Average blood glucose',
          'Blood Glucose Fasting'
        ]
      },
      {
        category: 'Kidney Function Test Advance (11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'eGFR'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Urine Routine & Extended Microscopy (23 tests)',
        tests: [
          'pH Urine',
          'Specific gravity',
          'Urobilinogen',
          'Colour',
          'Transparency',
          'Sugar',
          'Blood',
          'Red Blood Cells',
          'Pus cells (Leukocytes)',
          'Epithelial cells',
          'Crystals',
          'Cast',
          'Bacteria',
          'Yeast Cells',
          'Nitrate',
          'URINE KETONE',
          'URINE PROTEIN',
          'Leucocyte Esterase',
          'Bile Pigments (Bilirubin)',
          'Others - Urine',
          'Volume - Urine',
          'Urine Glucose (Post Meal)',
          'Microalbuminuria Screen'
        ]
      }
    ]
  },
  {
    id: 'pkg-advance-diabetes-senior-female',
    slug: 'diabetic-female-senior-citizen-health-check',
    title: 'Advance Diabetes Monitoring (Senior Female)',
    category: 'Diabetes Care',
    tagline: 'Comprehensive senior female diabetes evaluation with thyroid, renal function, microalbumin & lipid markers',
    parametersCount: 50,
    parametersSummary: 'HbA1c • Thyroid Profile • KFT Advance • Microalbumin • Urine Extended',
    tatText: 'Report in 46 Hrs.',
    baseMrp: 6529,
    fastingHours: 10,
    iconType: 'female',
    badge: 'Senior Female Care',
    pricing: {
      1: { price: 1959, mrp: 6529, discount: 70 },
      2: { price: 3799, mrp: 13058, discount: 71 },
      3: { price: 5499, mrp: 19587, discount: 72 },
      4: { price: 6999, mrp: 26116, discount: 73 }
    },
    allParameters: [
      {
        category: 'Thyroid Profile-Total (3 tests)',
        tests: [
          'T3, Total Tri Iodothyronine',
          'T4, Total Thyroxine',
          'TSH Ultra - Sensitive'
        ]
      },
      {
        category: 'HbA1c & Glucose Control (3 tests)',
        tests: [
          'Glycated Hemoglobin (HbA1c)',
          'Average blood glucose',
          'Blood Glucose Fasting'
        ]
      },
      {
        category: 'Kidney Function Test Advance (11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'eGFR'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Urine Routine & Nephropathy Screen (24 tests)',
        tests: [
          'pH Urine',
          'Specific gravity',
          'Urobilinogen',
          'Colour',
          'Transparency',
          'Sugar',
          'Blood',
          'Red Blood Cells',
          'Pus cells (Leukocytes)',
          'Epithelial cells',
          'Crystals',
          'Cast',
          'Bacteria',
          'Yeast Cells',
          'Nitrate',
          'URINE KETONE',
          'URINE PROTEIN',
          'Leucocyte Esterase',
          'Bile Pigments (Bilirubin)',
          'Others - Urine',
          'Volume - Urine',
          'Microalbuminuria Screen',
          'Urine Albumin / Creatinine Ratio (UACR)',
          'Post Prandial Glucose'
        ]
      }
    ]
  },
  {
    id: 'pkg-basic-antenatal-care',
    slug: 'basic-antenatal-care',
    title: 'Basic Antenatal Care',
    category: 'Women Health',
    tagline: 'Essential pregnancy wellness panel checking maternal blood health, liver, renal, blood group & thyroid',
    parametersCount: 66,
    parametersSummary: 'Blood Group ABO/Rh • Thyroid • CBC 24 • LFT 12 • KFT 11 • Urine',
    tatText: 'Report in 29 Hrs.',
    baseMrp: 5514,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Maternity Essential',
    pricing: {
      1: { price: 1654, mrp: 5514, discount: 70 },
      2: { price: 3199, mrp: 11028, discount: 71 },
      3: { price: 4629, mrp: 16542, discount: 72 },
      4: { price: 5899, mrp: 22056, discount: 73 }
    },
    allParameters: [
      {
        category: 'COMPLETE BLOOD COUNT (CBC - 24 tests)',
        tests: [
          'Hemoglobin Hb',
          'RBC Count',
          'WBC-Total Counts Leucocytes',
          'Platelet Count Thrombocyte count',
          'PCV Haematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW-CV',
          'Absolute Neutrophil Count',
          'Absolute Lymphocyte Count',
          'Absolute Monocyte Count',
          'Absolute Eosinophil Count',
          'Absolute Basophils Count',
          'Neutrophils',
          'Lymphocytes',
          'Monocytes',
          'Eosinophils',
          'Basophils',
          'MPV Mean Platelet Volume',
          'MENTZER INDEX',
          'Red Blood Cells - Blood',
          'RDWI',
          'GK Index'
        ]
      },
      {
        category: 'Liver Function Test (LFT - 12 tests)',
        tests: [
          'Albumin, Serum',
          'Alkaline Phosphatase, Serum',
          'Bilirubin Direct, Serum',
          'Bilirubin Total, Serum',
          'Bilirubin- Indirect, Serum',
          'GGTP (Gamma GT)',
          'Proteins, Serum',
          'SGOT/AST',
          'SGPT/ALT',
          'Globulin',
          'A/G Ratio',
          'SGOT/SGPT Ratio'
        ]
      },
      {
        category: 'Kidney Function Test Advance (KFT - 11 tests)',
        tests: [
          'BUN Urea Nitrogen, Serum',
          'Calcium Total, Serum',
          'Chlorides, Serum',
          'Creatinine, Serum',
          'Phosphorus-Inorganic, Serum',
          'Sodium, Serum',
          'Urea, Serum',
          'Uric Acid, Serum',
          'BUN/Creatinine Ratio',
          'Urea/Creatinine Ratio',
          'EGFR'
        ]
      },
      {
        category: 'Blood Group & Thyroid Screening (5 tests)',
        tests: [
          'Blood Group ABO',
          'Blood Group RH Typing',
          'T3, Total Tri Iodothyronine',
          'T4, Total Thyroxine',
          'TSH Ultra - Sensitive'
        ]
      },
      {
        category: 'Antenatal Infectious & Metabolic Screen (14 tests)',
        tests: [
          'Blood Glucose Fasting',
          'VDRL / RPR Syphilis Screen',
          'HBsAg Hepatitis B Surface Antigen',
          'HIV I & II Antibody Rapid',
          'Urine Routine - pH',
          'Urine Routine - Specific Gravity',
          'Urine Routine - Protein / Albumin',
          'Urine Routine - Sugar',
          'Urine Routine - Pus Cells',
          'Urine Routine - RBCs',
          'Urine Routine - Epithelial Cells',
          'Urine Routine - Casts',
          'Urine Routine - Crystals',
          'Urine Routine - Bacteria'
        ]
      }
    ]
  },
  {
    id: 'pkg-advanced-antenatal-care',
    slug: 'advanced-antenatal-care',
    title: 'Advanced Antenatal Care',
    category: 'Women Health',
    tagline: 'Comprehensive maternal screening covering hemoglobinopathies, Rubella immunity, viral markers & full panels',
    parametersCount: 72,
    parametersSummary: 'Rubella IgG/M • Hb HPLC Thalassemia • Blood Group • Thyroid • CBC • LFT',
    tatText: 'Report in 36 Hrs.',
    baseMrp: 7233,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Maternity Advanced',
    pricing: {
      1: { price: 2170, mrp: 7233, discount: 70 },
      2: { price: 4199, mrp: 14466, discount: 71 },
      3: { price: 6079, mrp: 21699, discount: 72 },
      4: { price: 7749, mrp: 28932, discount: 73 }
    },
    allParameters: [
      {
        category: 'Maternal Blood & Genetics (28 tests)',
        tests: [
          'Hemoglobin Hb',
          'RBC Count',
          'WBC-Total Counts Leucocytes',
          'Platelet Count Thrombocyte count',
          'PCV Haematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW-CV',
          'Absolute Differential Counts (5 params)',
          'Differential Leucocyte Counts (5 params)',
          'Mentzer Index',
          'Blood Group ABO',
          'Blood Group RH Typing',
          'Hb A2 (HPLC Method)',
          'Hb F (Fetal Hemoglobin)',
          'Hb Variant Screening',
          'Total Hemoglobin Electrophoresis'
        ]
      },
      {
        category: 'Infectious & Immunity Markers (6 tests)',
        tests: [
          'Rubella IgG Antibody Quantitative',
          'Rubella IgM Antibody Quantitative',
          'HBsAg Hepatitis B Surface Antigen',
          'HIV 1 & 2 Antibodies',
          'VDRL / RPR Syphilis Screen',
          'HCV Antibody Screening'
        ]
      },
      {
        category: 'Vital Organ & Endocrine Health (26 tests)',
        tests: [
          'Liver Function Test (12 parameters)',
          'Kidney Function Test (11 parameters)',
          'TSH Ultra - Sensitive',
          'T3 Total Triiodothyronine',
          'T4 Total Thyroxine'
        ]
      },
      {
        category: 'Metabolic & Urine Analysis (12 tests)',
        tests: [
          'Blood Glucose Fasting',
          'Urine Complete Routine & Microscopy (11 parameters)'
        ]
      }
    ]
  },
  {
    id: 'pkg-early-pregnancy-checkup',
    slug: 'early-pregnancy-checkup',
    title: 'Early Pregnancy Checkup',
    category: 'Women Health',
    tagline: 'Early gestational health assessment with Beta hCG quantification, infectious profiling, vitamins & CBC',
    parametersCount: 62,
    parametersSummary: 'Beta hCG • Vitamin D & B12 • Thyroid • CBC 24 • Urine Routine',
    tatText: 'Report in 48 Hrs.',
    baseMrp: 10114,
    fastingHours: 8,
    iconType: 'female',
    badge: 'First Trimester',
    pricing: {
      1: { price: 3034, mrp: 10114, discount: 70 },
      2: { price: 5899, mrp: 20228, discount: 71 },
      3: { price: 8499, mrp: 30342, discount: 72 },
      4: { price: 10799, mrp: 40456, discount: 73 }
    },
    allParameters: [
      {
        category: 'Gestational Hormone & Vitamins (3 tests)',
        tests: [
          'Beta hCG (Quantitative)',
          'Vitamin D Total (25-OH)',
          'Vitamin B12 (Cyanocobalamin)'
        ]
      },
      {
        category: 'COMPLETE BLOOD COUNT (CBC - 24 tests)',
        tests: [
          'Hemoglobin Hb',
          'RBC Count',
          'WBC-Total Counts Leucocytes',
          'Platelet Count Thrombocyte count',
          'PCV Haematocrit',
          'MCV',
          'MCH',
          'MCHC',
          'RDW-CV',
          'Absolute Neutrophil Count',
          'Absolute Lymphocyte Count',
          'Absolute Monocyte Count',
          'Absolute Eosinophil Count',
          'Absolute Basophils Count',
          'Neutrophils',
          'Lymphocytes',
          'Monocytes',
          'Eosinophils',
          'Basophils',
          'MPV Mean Platelet Volume',
          'MENTZER INDEX',
          'Red Blood Cells - Blood',
          'RDWI',
          'GK Index'
        ]
      },
      {
        category: 'Thyroid & Blood Grouping (5 tests)',
        tests: [
          'TSH Ultra - Sensitive',
          'T3 Total',
          'T4 Total',
          'Blood Group ABO',
          'Blood Group Rh Factor'
        ]
      },
      {
        category: 'Infectious & TORCH Markers (15 tests)',
        tests: [
          'Toxoplasma IgG & IgM',
          'Rubella IgG & IgM',
          'Cytomegalovirus (CMV) IgG & IgM',
          'Herpes Simplex Virus (HSV) 1 & 2 IgG/IgM',
          'HBsAg Surface Antigen',
          'HIV I & II Antibody Rapid',
          'VDRL / RPR Screening'
        ]
      },
      {
        category: 'Glucose & Renal Excretion (15 tests)',
        tests: [
          'Blood Glucose Fasting',
          'Urine Routine & Microscopic Evaluation (14 parameters)'
        ]
      }
    ]
  },
  {
    id: 'pkg-basic-allergy',
    slug: 'basic-allergy-package',
    title: 'Basic Allergy Package',
    category: 'Allergy & Immunity',
    tagline: 'Immunological hypersensitivity baseline measuring total circulating IgE antibodies and cellular allergic markers',
    parametersCount: 25,
    parametersSummary: 'IgE Total Antibody • Complete Blood Count (CBC)',
    tatText: 'Report in 24 Hrs.',
    baseMrp: 1540,
    fastingHours: 0,
    iconType: 'droplet',
    badge: 'Frontline Allergy',
    pricing: {
      1: { price: 462, mrp: 1540, discount: 70 },
      2: { price: 889, mrp: 3080, discount: 71 },
      3: { price: 1289, mrp: 4620, discount: 72 },
      4: { price: 1649, mrp: 6160, discount: 73 }
    },
    allParameters: [
      {
        category: 'Immunoglobulin Allergy Marker (1 test)',
        tests: [
          'IgE Total antibody'
        ]
      },
      {
        category: 'COMPLETE BLOOD COUNT (CBC - 24 tests)',
        tests: [
          'Absolute Basophils Count, Blood',
          'Absolute Eosinophil Count, Blood',
          'Absolute Lymphocyte Count, Blood',
          'Absolute Monocyte Count, Blood',
          'Absolute Neutrophil Count, Blood',
          'Hemoglobin Hb',
          'MCH',
          'MCHC',
          'MCV',
          'MPV Mean Platelet Volume',
          'PCV Haematocrit',
          'Platelet Count Thrombocyte count',
          'WBC-Total Counts Leucocytes',
          'RDW (Red Cell Distribution Width)',
          'Neutrophils',
          'Eosinophils',
          'Lymphocytes',
          'Monocytes',
          'Basophils',
          'RDW-CV',
          'MENTZER INDEX',
          'Red Blood Cells - Blood',
          'RDWI',
          'GK Index'
        ]
      }
    ]
  },
  {
    id: 'pkg-allergy-comprehensive',
    slug: 'allergy-comprehensive-package-by-elisa-method',
    title: 'Allergy Comprehensive Package By Elisa Method',
    category: 'Allergy & Immunity',
    tagline: 'Gold-standard ELISA immuno-assay profiling 216 specific environmental, food, mold, dander & pollen allergens',
    parametersCount: 216,
    parametersSummary: '100+ Food Allergens • 90+ Inhalant Allergens • IgE Total • CBC',
    tatText: 'Report in 52 Hrs.',
    baseMrp: 9999,
    fastingHours: 0,
    iconType: 'shield',
    badge: 'Gold Standard 216 Tests',
    pricing: {
      1: { price: 2999, mrp: 9999, discount: 70 },
      2: { price: 5699, mrp: 19998, discount: 71 },
      3: { price: 8199, mrp: 29997, discount: 73 },
      4: { price: 10399, mrp: 39996, discount: 74 }
    },
    allParameters: [
      {
        category: 'Inhalant & Environmental Allergens (90 tests)',
        tests: [
          'Dust Mite (D. pteronyssinus)',
          'Dust Mite (D. farinae)',
          'Cockroach (Blatta orientalis)',
          'Cat Dander Epithelium',
          'Dog Dander Epithelium',
          'Horse Dander',
          'Cow Epithelium',
          'Bermuda Grass Pollen',
          'Timothy Grass Pollen',
          'Common Ragweed Pollen',
          'Mugwort Pollen',
          'Birch Pollen',
          'Oak Pollen',
          'Alternaria alternata (Mold)',
          'Aspergillus fumigatus (Mold)',
          'Cladosporium herbarum (Mold)',
          'Penicillium notatum (Mold)',
          'Latex',
          'Pigeon Droppings Antigen',
          'Cotton Fiber'
        ]
      },
      {
        category: 'Food Allergens Panel (100 tests)',
        tests: [
          'Cow Milk',
          'Goat Milk',
          'Egg White',
          'Egg Yolk',
          'Wheat Gluten',
          'Peanut',
          'Soybean',
          'Sesame Seed',
          'Almond',
          'Cashew Nut',
          'Walnut',
          'Pistachio',
          'Crab',
          'Shrimp / Prawn',
          'Codfish',
          'Salmon',
          'Chicken Meat',
          'Mutton / Lamb',
          'Tomato',
          'Potato',
          'Onion',
          'Garlic',
          'Mustard',
          'Citrus Fruits (Orange, Lemon)',
          'Strawberry',
          'Banana',
          'Apple',
          'Pineapple',
          'Baker Yeast'
        ]
      },
      {
        category: 'Immunological & Hematological Baseline (26 tests)',
        tests: [
          'IgE Total antibody',
          'Absolute Eosinophil Count',
          'Complete Blood Count CBC (24 parameters)'
        ]
      }
    ]
  },
  {
    id: 'pkg-food-intolerance',
    slug: 'food-intolerance-package',
    title: 'Food Intolerance Package',
    category: 'Allergy & Immunity',
    tagline: 'High-precision IgG ELISA microarray assessing delayed food hypersensitivity across 215 dietary ingredients',
    parametersCount: 215,
    parametersSummary: 'Dairy • Cereals • Meats • Seafood • Vegetables • Fruits • Spices',
    tatText: 'Report in 72 Hrs.',
    baseMrp: 2330,
    fastingHours: 4,
    iconType: 'shield',
    badge: '215 Food Items',
    pricing: {
      1: { price: 699, mrp: 2330, discount: 70 },
      2: { price: 1349, mrp: 4660, discount: 71 },
      3: { price: 1949, mrp: 6990, discount: 72 },
      4: { price: 2499, mrp: 9320, discount: 73 }
    },
    allParameters: [
      {
        category: 'Dairy, Egg & Poultry IgG Screen (25 foods)',
        tests: [
          'Cow Milk',
          'Buffalo Milk',
          'Goat Milk',
          'Sheep Milk',
          'Egg White',
          'Egg Yolk',
          'Casein',
          'Chicken',
          'Turkey',
          'Duck'
        ]
      },
      {
        category: 'Grains, Cereals & Gluten Foods (30 foods)',
        tests: [
          'Wheat',
          'Durum Wheat',
          'Barley',
          'Rye',
          'Oats',
          'Gluten',
          'Rice (White/Brown)',
          'Corn / Maize',
          'Millet (Bajra)',
          'Sorghum (Jowar)',
          'Buckwheat (Kuttu)',
          'Quinoa'
        ]
      },
      {
        category: 'Seafood, Fish & Shellfish (35 foods)',
        tests: [
          'Salmon',
          'Tuna',
          'Cod',
          'Mackerel',
          'Rohu / Carp',
          'Hilsa',
          'Shrimp / Prawn',
          'Crab',
          'Lobster',
          'Squid',
          'Clam',
          'Oyster'
        ]
      },
      {
        category: 'Vegetables, Legumes & Pulses (50 foods)',
        tests: [
          'Chickpeas (Chana)',
          'Lentils (Masoor/Moong/Toor)',
          'Kidney Beans (Rajma)',
          'Soybean',
          'Peas',
          'Potato',
          'Tomato',
          'Onion',
          'Garlic',
          'Spinach',
          'Cabbage',
          'Cauliflower',
          'Eggplant (Brinjal)',
          'Mushroom'
        ]
      },
      {
        category: 'Fruits, Nuts, Seeds & Spices (75 foods)',
        tests: [
          'Almond',
          'Walnut',
          'Cashew',
          'Pistachio',
          'Peanut',
          'Sesame',
          'Mustard',
          'Chili Pepper',
          'Black Pepper',
          'Cumin',
          'Turmeric',
          'Ginger',
          'Coriander',
          'Apple',
          'Banana',
          'Mango',
          'Papaya',
          'Orange',
          'Grapes',
          'Coffee & Tea'
        ]
      }
    ]
  },
  {
    id: 'pkg-hormonal-imbalance-female',
    slug: 'hormonal-imbalance-female-package',
    title: 'Diagnova Hormonal Imbalance Female Package',
    category: 'Hormone Health',
    tagline: 'Comprehensive endocrinology panel covering AMH ovarian reserve, PCOS markers, insulin resistance & thyroid',
    parametersCount: 25,
    parametersSummary: 'AMH • LH/FSH • Testosterone • HOMA Index • Prolactin • 17-OHP • Lipid',
    tatText: 'Report in 101 Hrs.',
    baseMrp: 14814,
    fastingHours: 12,
    iconType: 'female',
    badge: 'Female Endocrinology',
    pricing: {
      1: { price: 4444, mrp: 14814, discount: 70 },
      2: { price: 8649, mrp: 29628, discount: 71 },
      3: { price: 12449, mrp: 44442, discount: 72 },
      4: { price: 15899, mrp: 59256, discount: 73 }
    },
    allParameters: [
      {
        category: 'Reproductive & Ovarian Reserve Hormones (8 tests)',
        tests: [
          'Anti-Mullerian Hormone (AMH)',
          'LH (Luteinizing Hormone)',
          'FSH (Follicle Stimulating Hormone)',
          'Prolactin',
          'Total Testosterone',
          'Free Testosterone',
          'DHEA-S',
          '17-Hydroxy Progesterone (17-OHP), Serum'
        ]
      },
      {
        category: 'Metabolic & Insulin Resistance (5 tests)',
        tests: [
          'Blood Glucose Fasting',
          'Insulin - Fasting',
          'HOMA Index IR',
          'Glycated Hemoglobin (HbA1c)',
          'Average blood glucose'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Thyroid & Adrenal Axis (3 tests)',
        tests: [
          'TSH Ultra - Sensitive',
          'Cortisol Morning',
          'Progesterone'
        ]
      }
    ]
  },
  {
    id: 'pkg-hormonal-imbalance-male',
    slug: 'hormonal-imbalance-male-package',
    title: 'Diagnova Hormonal Imbalance Male Package',
    category: 'Hormone Health',
    tagline: 'Deep andrologic assessment of testosterone bio-availability, SHBG, prolactin, adrenal cortisol & insulin',
    parametersCount: 24,
    parametersSummary: 'Total & Free Testosterone • SHBG • DHEA-S • LH/FSH • Cortisol • Lipid',
    tatText: 'Report in 101 Hrs.',
    baseMrp: 12771,
    fastingHours: 12,
    iconType: 'user',
    badge: 'Male Endocrinology',
    pricing: {
      1: { price: 3831, mrp: 12771, discount: 70 },
      2: { price: 7459, mrp: 25542, discount: 71 },
      3: { price: 10699, mrp: 38313, discount: 72 },
      4: { price: 13699, mrp: 51084, discount: 73 }
    },
    allParameters: [
      {
        category: 'Androgens & Pituitary Axis (9 tests)',
        tests: [
          'Total Testosterone',
          'Free Testosterone',
          'Bioavailable Testosterone',
          'Sex Hormone Binding Globulin (SHBG)',
          'DHEA-S',
          'Luteinizing Hormone (LH)',
          'Follicle Stimulating Hormone (FSH)',
          'Prolactin',
          'Estradiol (E2)'
        ]
      },
      {
        category: 'Metabolic & Insulin Resistance (4 tests)',
        tests: [
          'Blood Glucose Fasting',
          'Fasting Insulin',
          'HOMA-IR Index',
          'Cortisol Morning'
        ]
      },
      {
        category: 'Lipid Profile (9 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Cholesterol Ratio Cal',
          'HDL / LDL Cholesterol Ratio Cal'
        ]
      },
      {
        category: 'Thyroid & Prostate Markers (2 tests)',
        tests: [
          'TSH Ultra-Sensitive',
          'PSA Total (Prostate Specific Antigen)'
        ]
      }
    ]
  },
  {
    id: 'pkg-hormone-health-female',
    slug: 'diagnova-hormone-level-diagnostic-package-female',
    title: 'Hormone Health Assessment Female',
    category: 'Hormone Health',
    tagline: 'Focused female reproductive hormone profile testing fertility, menstrual cycle regularities & menopause',
    parametersCount: 9,
    parametersSummary: 'AMH • FSH • LH • Prolactin • Estradiol • Progesterone • TSH',
    tatText: 'Report in 101 Hrs.',
    baseMrp: 18224,
    fastingHours: 8,
    iconType: 'female',
    badge: 'Female Fertility',
    pricing: {
      1: { price: 5467, mrp: 18224, discount: 70 },
      2: { price: 10599, mrp: 36448, discount: 71 },
      3: { price: 15299, mrp: 54672, discount: 72 },
      4: { price: 19599, mrp: 72896, discount: 73 }
    },
    allParameters: [
      {
        category: 'Female Fertility & Endocrine Hormones (9 tests)',
        tests: [
          'Anti-Mullerian Hormone (AMH)',
          'Follicle Stimulating Hormone (FSH)',
          'Luteinizing Hormone (LH)',
          'Prolactin',
          'TSH Ultra - Sensitive',
          'Estradiol (E2)',
          'Progesterone',
          'Testosterone Total',
          'DHEA-S'
        ]
      }
    ]
  },
  {
    id: 'pkg-platinum-cardiac-screening',
    slug: 'diagnova-mygenome-wellness-dna-cardiomet-test',
    title: 'Platinum Cardiac Screening (Heart Health) Package',
    category: 'Genomic & DNA',
    tagline: 'Precision cardiometabolic DNA sequencing mapped with authentic biochemical lipid & cardiac markers',
    parametersCount: 28,
    parametersSummary: 'DNA Genomic Cardiac Risk • Lipid 9 • Apo A1/B • Troponin • Homocysteine',
    tatText: 'Report in 14 Days',
    baseMrp: 39278,
    fastingHours: 12,
    iconType: 'dna',
    badge: 'Precision Genomics',
    pricing: {
      1: { price: 11783, mrp: 39278, discount: 70 },
      2: { price: 22899, mrp: 78556, discount: 71 },
      3: { price: 32999, mrp: 117834, discount: 72 },
      4: { price: 42199, mrp: 157112, discount: 73 }
    },
    allParameters: [
      {
        category: 'Genomic Cardiometabolic Predisposition (10 parameters)',
        tests: [
          'Genetics test Coronary Artery Disease Predisposition',
          'Genetics test Familial Hypercholesterolemia',
          'Genetics test Hypertension & Renin-Angiotensin Risk',
          'Genetics test Atherosclerosis Plaque Vulnerability',
          'Genetics test Thrombosis & Clotting Factor Risk',
          'Genetics test Atrial Fibrillation Susceptibility',
          'Genetics test Statin-Induced Myopathy Sensitivity',
          'Genetics test Endothelial Nitric Oxide Synthesis',
          'Genetics test Cardiomyopathy Gene Variants',
          'Genetics test Peripheral Vascular Disease'
        ]
      },
      {
        category: 'Active Biochemical Lipid & Cardiac Biomarkers (18 tests)',
        tests: [
          'Cholesterol-Total, Serum',
          'HDL Cholesterol Direct',
          'Triglycerides, Serum',
          'Non - HDL Cholesterol, Serum',
          'CHOL/HDL RATIO',
          'LDL Cholesterol Cal',
          'VLDL Cholesterol Cal',
          'LDL / HDL Ratio',
          'HDL / LDL Ratio',
          'Apolipoprotein A1',
          'Apolipoprotein B',
          'Apo B / Apo A1 Ratio',
          'Lipoprotein (a)',
          'Homocysteine',
          'High Sensitivity C-Reactive Protein (hs-CRP)',
          'Troponin I (HS Quantitative)',
          'Glycated Hemoglobin (HbA1c)',
          'Blood Glucose Fasting'
        ]
      }
    ]
  },
  {
    id: 'pkg-dna-skin-beauty',
    slug: 'diagnova-mygenome-wellness-dna-skin-test',
    title: 'DNA Skin & Beauty Package',
    category: 'Genomic & DNA',
    tagline: 'Cellular genomic roadmap uncovering collagen degradation, antioxidant capacity, photoaging & elasticity',
    parametersCount: 16,
    parametersSummary: 'Collagen Breakdown • Skin Elasticity • Photoaging • Glycation Genetics',
    tatText: 'Report in 14 Days',
    baseMrp: 39278,
    fastingHours: 0,
    iconType: 'dna',
    badge: 'Genomic Aesthetics',
    pricing: {
      1: { price: 11783, mrp: 39278, discount: 70 },
      2: { price: 22899, mrp: 78556, discount: 71 },
      3: { price: 32999, mrp: 117834, discount: 72 },
      4: { price: 42199, mrp: 157112, discount: 73 }
    },
    allParameters: [
      {
        category: 'Cellular Skin Aging & Dermal Architecture Genetics (16 tests)',
        tests: [
          'Genetics test MMP1 Collagen Breakdown Predisposition',
          'Genetics test Elastin (ELN) Skin Firmness & Elasticity',
          'Genetics test SOD2 Superoxide Dismutase Antioxidant Capacity',
          'Genetics test GPX1 Glutathione Peroxidase Defense',
          'Genetics test UV Photoaging & Sun Sensitivity (MC1R)',
          'Genetics test Advanced Glycation End-products (AGEs) Risk',
          'Genetics test Hyaluronan Synthase Hydration & Moisture Retention',
          'Genetics test Skin Barrier Function (Filaggrin FLG)',
          'Genetics test Hyperpigmentation & Melasma Tendency',
          'Genetics test Skin Cellular Inflammation (TNF-alpha & IL-6)',
          'Genetics test Cellular Telomere Length Preservation',
          'Genetics test Vitamin A (Beta-Carotene) Bioconversion',
          'Genetics test Vitamin C Bioavailability for Collagen Synthesis',
          'Genetics test Vitamin E Dermal Photoprotection',
          'Genetics test Zinc & Selenium Trace Mineral Transport',
          'Genetics test CoQ10 Mitochondrial Bioenergetics'
        ]
      }
    ]
  },
  {
    id: 'pkg-comprehensive-dna',
    slug: 'diagnova-mygenome-wellness-comprehensive-dna-package',
    title: 'Comprehensive DNA Package',
    category: 'Genomic & DNA',
    tagline: 'Ultimate whole-genome predisposition roadmap covering 81 traits across nutrition, fitness, sleep, cardiac & longevity',
    parametersCount: 81,
    parametersSummary: '81 Genomic Traits • Weight Management • Fitness • Nutrition • Cardiac',
    tatText: 'Report in 14 Days',
    baseMrp: 48564,
    fastingHours: 0,
    iconType: 'dna',
    badge: 'Ultimate DNA 81 Traits',
    pricing: {
      1: { price: 14569, mrp: 48564, discount: 70 },
      2: { price: 28399, mrp: 97128, discount: 71 },
      3: { price: 40899, mrp: 145692, discount: 72 },
      4: { price: 52399, mrp: 194256, discount: 73 }
    },
    allParameters: [
      {
        category: 'Genetics Weight Management Profile (8 tests)',
        tests: [
          'Genetics test Obesity predisposition',
          'Genetics test Response to dieting',
          'Genetics test Adiponectin levels',
          'Genetics test Satiety responsiveness (FTO)',
          'Genetics test Carbohydrate sensitivity (PPARG)',
          'Genetics test Fat metabolism & Storage (FABP2)',
          'Genetics test Emotional eating tendency',
          'Genetics test Metabolic rate & Thermogenesis'
        ]
      },
      {
        category: 'Response To Exercise Genetic Profile (6 tests)',
        tests: [
          'Genetics test BMI & Waist circumference response to exercise',
          'Genetics test Response to strength training (ACTN3)',
          'Genetics test Adrenaline response & Endurance (ACE)',
          'Genetics test VO2 Max trainability',
          'Genetics test Post-exercise muscle recovery & Lactate clearance',
          'Genetics test Exercise-induced cardiac remodeling'
        ]
      },
      {
        category: 'Genetics Detoxification Profile (3 tests)',
        tests: [
          'Genetics test Oxidative stress defense',
          'Genetics test Phase-I Liver Detoxification (CYP450)',
          'Genetics test Phase-II Conjugation & Glutathione (GSTM1/GSTT1)'
        ]
      },
      {
        category: 'Nutrition Profile (Micro Nutrient Response - 12 tests)',
        tests: [
          'Genetics test Vitamin A requirement',
          'Genetics test Vitamin B6 utilization',
          'Genetics test Vitamin B9 Folate metabolism (MTHFR)',
          'Genetics test Vitamin B12 absorption',
          'Genetics test Vitamin C requirement',
          'Genetics test Vitamin D receptor sensitivity (VDR)',
          'Genetics test Vitamin E antioxidant response',
          'Genetics test Calcium absorption & Bone density',
          'Genetics test Iron overload / Hemochromatosis risk',
          'Genetics test Sodium sensitivity & Blood pressure',
          'Genetics test Caffeine metabolism (CYP1A2)',
          'Genetics test Lactose intolerance (MCM6)'
        ]
      },
      {
        category: 'Cardiovascular Genetic Profile (10 tests)',
        tests: [
          'Genetics test Coronary artery disease predisposition',
          'Genetics test LDL cholesterol regulation',
          'Genetics test HDL cholesterol longevity factor',
          'Genetics test Triglyceride clearance',
          'Genetics test Systemic arterial hypertension risk',
          'Genetics test Atrial fibrillation susceptibility',
          'Genetics test Thrombosis & blood viscosity',
          'Genetics test Vascular elasticity & Nitric oxide',
          'Genetics test Homocysteine clearance gene variants',
          'Genetics test Myocardial infarction risk index'
        ]
      },
      {
        category: 'Metabolic Disease Genetic Profile (12 tests)',
        tests: [
          'Genetics test Type 2 Diabetes predisposition (TCF7L2)',
          'Genetics test Insulin resistance & Sensitivity',
          'Genetics test Impaired fasting glucose tendency',
          'Genetics test Beta cell insulin secretion capacity',
          'Genetics test Non-alcoholic fatty liver disease (PNPLA3)',
          'Genetics test Hyperuricemia & Gout susceptibility',
          'Genetics test Gallstone formation risk',
          'Genetics test Thyroid function & TSH modulation',
          'Genetics test Chronic systemic low-grade inflammation',
          'Genetics test Leptin receptor signaling',
          'Genetics test Visceral adiposity tendency',
          'Genetics test Pancreatic lipid digestion'
        ]
      },
      {
        category: 'Skin Health & Aging Genetics (15 tests)',
        tests: [
          'Genetics test Collagen degradation & Fine line risk',
          'Genetics test Skin elasticity & Firmness maintenance',
          'Genetics test UV photoaging & Sun damage sensitivity',
          'Genetics test Hyperpigmentation & Age spots risk',
          'Genetics test Advanced glycation end-products susceptibility',
          'Genetics test Dermal moisture loss & Hydration barrier',
          'Genetics test Cellular antioxidant capacity in epidermis',
          'Genetics test Contact skin hypersensitivity',
          'Genetics test Hair thinning & Androgenic alopecia genetics',
          'Genetics test Graying predisposition',
          'Genetics test Wound healing & Scarring tendency',
          'Genetics test Varicose veins & Microvascular strength',
          'Genetics test Skin detoxification & Toxin clearance',
          'Genetics test Cellular telomere shortening rate',
          'Genetics test Longevity & Sirtuin gene activity'
        ]
      },
      {
        category: 'Sleep & Stress Genetic Profile (15 tests)',
        tests: [
          'Genetics test Circadian rhythm & Chronotype (Morning vs Evening)',
          'Genetics test Sleep duration & Quality requirements',
          'Genetics test Insomnia predisposition',
          'Genetics test Deep slow-wave sleep efficiency',
          'Genetics test Sleep apnea & airway muscle tone',
          'Genetics test Melatonin biosynthesis & Receptors',
          'Genetics test Cortisol stress reactivity (COMT gene)',
          'Genetics test Serotonin transporter & Mood resilience',
          'Genetics test Dopamine receptor sensitivity & Focus',
          'Genetics test Neuroplasticity & Brain-derived neurotrophic factor (BDNF)',
          'Genetics test Restless leg syndrome susceptibility',
          'Genetics test Daytime somnolence tendency',
          'Genetics test Shift work adaptation genetics',
          'Genetics test Seasonal affective sensitivity',
          'Genetics test Cognitive resilience under stress'
        ]
      }
    ]
  }
];
