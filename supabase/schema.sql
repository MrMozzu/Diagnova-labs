-- ==============================================================================
-- TestBuddyLabs - Enterprise Supabase PostgreSQL Schema
-- High-concurrency architecture supporting 10,000+ orders, tests, and bookings
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast fuzzy test catalog searching

-- 1. DIAGNOSTIC TESTS TABLE
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    sample_type VARCHAR(100) NOT NULL DEFAULT 'Blood', -- 'Blood', 'Serum', 'Urine', 'Plasma'
    fasting_required BOOLEAN NOT NULL DEFAULT false,
    fasting_hours INT NOT NULL DEFAULT 0,
    tat_hours INT NOT NULL DEFAULT 24, -- Turnaround time in hours
    home_collection BOOLEAN NOT NULL DEFAULT true,
    parameters JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of parameter names or objects
    preparation_guidelines TEXT,
    popular_score INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast text search index for sub-second test queries
CREATE INDEX IF NOT EXISTS idx_tests_category ON public.tests(category);
CREATE INDEX IF NOT EXISTS idx_tests_price ON public.tests(price);
CREATE INDEX IF NOT EXISTS idx_tests_name_trgm ON public.tests USING gin (name gin_trgm_ops);

-- 2. FEATURED HEALTH PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Diabetes', 'Heart Health', 'Full Body Checkup', 'Cancer Screening'
    tagline VARCHAR(255),
    description TEXT,
    base_mrp NUMERIC(10, 2) NOT NULL,
    -- Multi-Person Dynamic Pricing Tiers
    price_1_person NUMERIC(10, 2) NOT NULL,
    price_2_person NUMERIC(10, 2) NOT NULL,
    price_3_person NUMERIC(10, 2) NOT NULL,
    price_4_person NUMERIC(10, 2) NOT NULL,
    parameter_count INT NOT NULL,
    fasting_hours INT DEFAULT 10,
    tat_hours INT DEFAULT 24,
    recommended_for VARCHAR(255),
    badge_label VARCHAR(50), -- 'Most Popular', 'Best Value', 'Doctors Choice'
    parameters JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    age INT,
    gender VARCHAR(20), -- 'Male', 'Female', 'Other'
    address TEXT NOT NULL,
    landmark TEXT,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_city ON public.patients(city);

-- 4. BOOKINGS TABLE (ACID Compliant)
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(30) PRIMARY KEY, -- e.g., 'TBL-784912'
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    booking_type VARCHAR(20) NOT NULL DEFAULT 'test', -- 'test' or 'package'
    item_id UUID,
    item_name VARCHAR(255) NOT NULL,
    number_of_persons INT DEFAULT 1,
    scheduled_date DATE NOT NULL,
    scheduled_slot VARCHAR(50) NOT NULL, -- '07:00 AM - 08:00 AM' or 'Express 60-Min'
    is_express BOOLEAN DEFAULT false,
    
    -- Financials & Payment
    base_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    collection_fee NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- 'online_upi', 'online_card', 'cash_on_collection'
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'paid', 'pending', 'failed'
    
    -- Fulfillment Life Cycle
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed', 
    -- 'confirmed', 'phlebotomist_assigned', 'sample_collected', 'in_lab', 'report_ready', 'cancelled'
    
    phlebotomist_name VARCHAR(150),
    phlebotomist_phone VARCHAR(20),
    report_url TEXT,
    report_data JSONB, -- Smart report parameter values & alerts
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at DESC);

-- 5. CALLBACK LEADS TABLE ("Are You Confused?" Section)
CREATE TABLE IF NOT EXISTS public.callbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    preferred_time VARCHAR(50),
    prescription_url TEXT,
    status VARCHAR(30) DEFAULT 'new', -- 'new', 'called', 'converted', 'closed'
    advisor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callbacks ENABLE ROW LEVEL SECURITY;

-- Allow public read of active tests & packages
CREATE POLICY "Public tests are viewable by everyone" 
ON public.tests FOR SELECT USING (is_active = true);

CREATE POLICY "Public packages are viewable by everyone" 
ON public.packages FOR SELECT USING (is_featured = true);

-- Allow public insertion of patients, bookings, and callback leads
CREATE POLICY "Public can insert patients" 
ON public.patients FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert bookings" 
ON public.bookings FOR INSERT WITH CHECK (
    total_amount > 0 AND base_amount > 0 AND scheduled_date >= CURRENT_DATE
);

-- Secure Booking Read: Restrict public select to only specific booking ID lookups
CREATE POLICY "Patients can view specific booking by ID" 
ON public.bookings FOR SELECT USING (
    id = current_setting('request.headers', true)::json->>'x-booking-id'
    OR auth.role() = 'authenticated'
    OR auth.role() = 'service_role'
);

CREATE POLICY "Public can request callbacks" 
ON public.callbacks FOR INSERT WITH CHECK (true);

-- Functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tests_modtime 
BEFORE UPDATE ON public.tests 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_bookings_modtime 
BEFORE UPDATE ON public.bookings 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Database-Level Anti-Tampering & Financial Sanity Trigger
CREATE OR REPLACE FUNCTION verify_booking_financial_integrity()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent zero or negative amounts
    IF NEW.total_amount <= 0 OR NEW.base_amount <= 0 THEN
        RAISE EXCEPTION 'Security Exception: Invalid booking financials. Total and base amount must be greater than zero.';
    END IF;

    -- Ensure total_amount is logically consistent with base_amount, discount, and collection fees
    IF NEW.total_amount < (NEW.base_amount - NEW.discount_amount) THEN
        RAISE EXCEPTION 'Security Exception: Total amount cannot be less than discounted base price. Price tampering detected.';
    END IF;

    -- Prevent bookings in the past
    IF NEW.scheduled_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Scheduling Exception: Cannot book clinical home collection for past dates.';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_booking_financials_before_insert
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE verify_booking_financial_integrity();

