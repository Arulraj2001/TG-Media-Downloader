-- ==============================================================================
-- TG MEDIA DOWNLOADER WEB — FULL SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this entire file in your Supabase SQL Editor (Project → SQL Editor → New query)
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    -- Free-tier usage tracking
    fetch_count INT NOT NULL DEFAULT 0,
    fetch_date DATE,
    -- Subscription metadata (mirrored from user_subscriptions for quick access)
    subscription_end TIMESTAMP WITH TIME ZONE,
    subscription_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns to existing profiles table (safe migration)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fetch_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fetch_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

-- 2. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    duration_months INT NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_method TEXT,
    reference_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PAYMENT VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
    amount_paid NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    screenshot_url TEXT,          -- Supabase Storage public URL of payment proof image
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- Add missing column to existing table
ALTER TABLE public.payment_verifications ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
ALTER TABLE public.payment_verifications ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id);

-- 5. CONTACT HELPDESK MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'Guides',
    read_time_mins INT DEFAULT 5,
    author TEXT DEFAULT 'TG Downloader Team',
    cover_image_url TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    meta_description TEXT,
    keywords TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INT PRIMARY KEY DEFAULT 1,
    free_fetch_limit INT DEFAULT 5,
    ads_free_users BOOLEAN DEFAULT true,
    ads_paid_users BOOLEAN DEFAULT false,
    payment_upi_id TEXT DEFAULT 'admin@upi',
    payment_paypal_me TEXT DEFAULT 'https://paypal.me/admin',
    payment_qr_url TEXT DEFAULT '',   -- Supabase Storage URL for QR code image
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing column to system_settings
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS payment_qr_url TEXT DEFAULT '';

-- 8. SEED DEFAULT DATA
INSERT INTO public.subscription_plans (id, name, duration_months, price_usd, description, features, is_popular)
VALUES
    ('plan_3m',  '3 Months Pass',     3,  14.99, 'Great for medium batch downloading tasks.',
     '["Unlimited bulk media fetches","Priority MTProto streaming","Category filtering & topic isolator","Zero ad interruptions"]', false),
    ('plan_6m',  '6 Months Pass',     6,  24.99, 'Most popular for regular channel managers.',
     '["Unlimited bulk media fetches","Priority MTProto streaming","Category filtering & topic isolator","Zero ad interruptions","24/7 Priority Support"]', true),
    ('plan_12m', '12 Months VIP Pass',12, 39.99, 'Best value for heavy archiving & power users.',
     '["Unlimited bulk media fetches","Priority MTProto streaming","Category filtering & topic isolator","Zero ad interruptions","24/7 VIP Direct Support"]', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.system_settings (id, free_fetch_limit, ads_free_users, ads_paid_users)
VALUES (1, 5, true, false)
ON CONFLICT (id) DO NOTHING;

-- 9. AUTOMATIC PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        CASE WHEN NEW.email = 'arulraj8637@gmail.com' THEN 'admin' ELSE 'user' END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies before recreating to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Subscription plans readable by all" ON public.subscription_plans;
DROP POLICY IF EXISTS "Published blog posts readable by all" ON public.blog_posts;
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admins read all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users create own payment verification" ON public.payment_verifications;
DROP POLICY IF EXISTS "Users view own payment verification" ON public.payment_verifications;
DROP POLICY IF EXISTS "Admins manage payment verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Anyone can insert contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins update system settings" ON public.system_settings;

-- Profiles
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subscription plans (public read)
CREATE POLICY "Subscription plans readable by all" ON public.subscription_plans FOR SELECT USING (true);

-- Blog posts
CREATE POLICY "Published blog posts readable by all" ON public.blog_posts
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- User subscriptions
CREATE POLICY "Users read own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all subscriptions" ON public.user_subscriptions
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payment verifications
CREATE POLICY "Users create own payment verification" ON public.payment_verifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own payment verification" ON public.payment_verifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage payment verifications" ON public.payment_verifications
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contact messages
CREATE POLICY "Anyone can insert contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- System settings (admin only)
CREATE POLICY "Admins read system settings" ON public.system_settings
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins update system settings" ON public.system_settings
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 11. PROMOTE ADMIN (change email to yours if different)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'arulraj8637@gmail.com';

-- 12. SUPABASE STORAGE BUCKET (run separately in Storage section OR via SQL)
-- Create bucket 'payment-proofs' with public access for viewing screenshots
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Authenticated users can upload proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');
-- CREATE POLICY "Public can view proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs');
