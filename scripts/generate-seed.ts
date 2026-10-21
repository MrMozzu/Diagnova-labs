import fs from 'fs';
import path from 'path';
import { ALL_TESTS } from '../src/data/tests';
import { FEATURED_PACKAGES } from '../src/data/packages';

function escapeSql(str: string | undefined | null): string {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeJson(obj: any): string {
  if (!obj) return `'[]'::jsonb`;
  const jsonStr = JSON.stringify(obj).replace(/'/g, "''");
  return `'${jsonStr}'::jsonb`;
}

let sql = `-- ==============================================================================
-- TestBuddyLabs - Supabase Catalog Seed Data
-- Inserts all flagship health packages and clinical pathology tests
-- ==============================================================================

-- 1. SEED HEALTH PACKAGES
INSERT INTO public.packages (
  slug, title, category, tagline, description, base_mrp,
  price_1_person, price_2_person, price_3_person, price_4_person,
  parameter_count, fasting_hours, tat_hours, recommended_for,
  badge_label, parameters, is_featured
) VALUES
`;

const packageValues = FEATURED_PACKAGES.map(pkg => {
  const p1 = pkg.pricing[1]?.price || 0;
  const p2 = pkg.pricing[2]?.price || p1;
  const p3 = pkg.pricing[3]?.price || p1;
  const p4 = pkg.pricing[4]?.price || p1;

  return `(
  ${escapeSql(pkg.slug)},
  ${escapeSql(pkg.title)},
  ${escapeSql(pkg.category)},
  ${escapeSql(pkg.tagline)},
  ${escapeSql(pkg.parametersSummary)},
  ${pkg.baseMrp},
  ${p1}, ${p2}, ${p3}, ${p4},
  ${pkg.parametersCount},
  ${pkg.fastingHours || 10},
  24,
  ${escapeSql(pkg.badge || 'General Health')},
  ${escapeSql(pkg.badge || 'Recommended')},
  ${escapeJson(pkg.allParameters)},
  true
)`;
});

sql += packageValues.join(',\n');
sql += `
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  base_mrp = EXCLUDED.base_mrp,
  price_1_person = EXCLUDED.price_1_person,
  price_2_person = EXCLUDED.price_2_person,
  price_3_person = EXCLUDED.price_3_person,
  price_4_person = EXCLUDED.price_4_person,
  parameter_count = EXCLUDED.parameter_count,
  fasting_hours = EXCLUDED.fasting_hours,
  tat_hours = EXCLUDED.tat_hours,
  badge_label = EXCLUDED.badge_label,
  parameters = EXCLUDED.parameters;

-- 2. SEED CLINICAL TESTS
INSERT INTO public.tests (
  slug, name, category, short_description, full_description,
  price, mrp, sample_type, fasting_required, fasting_hours,
  tat_hours, home_collection, parameters, preparation_guidelines,
  popular_score, is_active
) VALUES
`;

const testValues = ALL_TESTS.map((t, idx) => {
  return `(
  ${escapeSql(t.slug)},
  ${escapeSql(t.name)},
  ${escapeSql(t.category)},
  ${escapeSql(t.shortDesc)},
  ${escapeSql(t.preparation || t.shortDesc)},
  ${t.price},
  ${t.mrp},
  ${escapeSql(t.sampleType || 'Blood')},
  ${Boolean(t.fastingRequired)},
  ${t.fastingHours || 0},
  ${t.tatHours || 24},
  true,
  ${escapeJson(t.parameters)},
  ${escapeSql(t.preparation || 'No specific preparation required.')},
  ${t.popular ? 100 - idx : 50},
  true
)`;
});

sql += testValues.join(',\n');
sql += `
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  sample_type = EXCLUDED.sample_type,
  fasting_required = EXCLUDED.fasting_required,
  fasting_hours = EXCLUDED.fasting_hours,
  tat_hours = EXCLUDED.tat_hours,
  parameters = EXCLUDED.parameters,
  preparation_guidelines = EXCLUDED.preparation_guidelines;
`;

const outputPath = path.resolve(process.cwd(), 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Generated seed SQL with ${FEATURED_PACKAGES.length} packages and ${ALL_TESTS.length} tests at: ${outputPath}`);
