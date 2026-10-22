-- ==============================================================================
-- TestBuddyLabs / Diagnova Labs: Fix Row-Level Security (RLS) & Schema Types
-- Run this script once in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Fix item_id column type so it stores text identifiers (e.g. 'pkg-healthy-india-2026', 'test-glucose-fasting')
ALTER TABLE public.bookings ALTER COLUMN item_id TYPE VARCHAR(255);

-- 2. Configure RLS Policies for Patients Table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert patients" ON public.patients;
CREATE POLICY "Public can insert patients" ON public.patients 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select patients" ON public.patients;
CREATE POLICY "Public can select patients" ON public.patients 
FOR SELECT 
USING (true);

-- 3. Configure RLS Policies for Bookings Table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings" ON public.bookings 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select bookings" ON public.bookings;
CREATE POLICY "Public can select bookings" ON public.bookings 
FOR SELECT 
USING (true);

-- 4. Configure RLS Policies for Callbacks Table
ALTER TABLE public.callbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert callbacks" ON public.callbacks;
CREATE POLICY "Public can insert callbacks" ON public.callbacks 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select callbacks" ON public.callbacks;
CREATE POLICY "Public can select callbacks" ON public.callbacks 
FOR SELECT 
USING (true);
