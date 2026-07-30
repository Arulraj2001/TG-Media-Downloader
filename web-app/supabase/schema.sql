-- ==============================================================================
-- TG MEDIA DOWNLOADER WEB EDITION - PRODUCTION DATABASE SCHEMA (SUPABASE)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY, -- 'plan_3m', 'plan_6m', 'plan_12m'
    name TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial plans
INSERT INTO public.subscription_plans (id, name, duration_months, price, currency, description, features)
VALUES 
('plan_3m', '3 Months Pass', 3, 14.99, 'USD', 'Full access for 3 months with unlimited downloads & max speed', '["Unlimited Downloads", "Max Download Speed", "Topic Browser Access", "Zero Ads"]'),
('plan_6m', '6 Months Pass', 6, 24.99, 'USD', 'Best value for 6 months with high priority download slots', '["Unlimited Downloads", "Max Download Speed", "Topic Browser Access", "Zero Ads", "Priority Queue"]'),
('plan_12m', '12 Months VIP', 12, 39.99, 'USD', 'Ultimate 1-Year VIP Pass with all features & future updates', '["Unlimited Downloads", "Max Download Speed", "Topic Browser Access", "Zero Ads", "Priority Queue", "VIP Support"]')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, name = EXCLUDED.name;

-- ------------------------------------------------------------------------------
-- 3. USER SUBSCRIPTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.subscription_plans(id),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PAYMENT MANUAL VERIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL, -- 'qr_code', 'upi', 'paypal', 'bank_transfer', 'crypto'
    txn_ref_id TEXT NOT NULL,
    proof_image_url TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. CONTACT FORM MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. BLOG POSTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    status TEXT DEFAULT 'published', -- 'draft', 'published'
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial blog posts for AdSense approval & SEO
INSERT INTO public.blog_posts (title, slug, content, excerpt, cover_image, category, tags, meta_title, meta_description)
VALUES
(
    'How to Download Telegram Media Files Directly in Your Browser',
    'how-to-download-telegram-media-files-directly',
    '# How to Download Telegram Media Files Directly in Your Browser\n\nTelegram has become one of the most popular platforms for sharing media, documents, educational content, and archives. However, downloading multiple files or extracting specific media types from large Telegram channels can often feel slow or tedious.\n\n## Why Use TG Media Downloader?\n\n1. **Direct Browser Streaming**: No complex setup required. Files download straight into your local downloads directory.\n2. **Categorized Media Browsing**: Filter by Videos, Documents, Music, ZIP Archives, and GIFs.\n3. **Topic Browser**: Full support for Telegram Forum Topics and separated channels.\n4. **Advanced Date & Size Filtering**: Locate the exact files you need in seconds.\n\n### Step-by-Step Download Guide:\n- **Step 1**: Enter the Telegram channel username (e.g., `@example_channel`) or public link.\n- **Step 2**: Select your desired category tab or forum topic.\n- **Step 3**: Use the checkbox selectors to choose specific files or bulk download.\n- **Step 4**: Click Download to save directly to your computer or phone.',
    'A complete step-by-step guide on how to browse and download Telegram channel media files directly into your browser at maximum speed.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'Guides',
    ARRAY['Telegram', 'Downloader', 'Tutorial'],
    'How to Download Telegram Media Files Directly | TG Media Downloader',
    'Learn how to quickly browse, filter, and download videos, documents, music, and zip files from any Telegram channel directly in your browser.'
),
(
    'Understanding Telegram Forum Topics and Categorized Downloads',
    'understanding-telegram-forum-topics-and-categorized-downloads',
    '# Understanding Telegram Forum Topics and Categorized Downloads\n\nTelegram Forum Topics allow large communities to organize discussions into sub-channels. When managing downloads from these forum channels, having a dedicated topic picker is essential.\n\n## Key Benefits of Topic Separation:\n- Easily isolate study materials, movies, or document releases.\n- Avoid fetching unnecessary messages from unrelated topics.\n- Bulk download entire topic archives with a single click.\n\nWith TG Media Downloader, topic structures are parsed automatically, allowing you to select and download topic media with zero hassle.',
    'Learn how Telegram Forum Topics work and how to easily isolate and download media from specific sub-topics.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'Tutorials',
    ARRAY['Telegram Forum', 'Topics', 'Media Filtering'],
    'Telegram Forum Topics & Media Download Guide | TG Media Downloader',
    'Master downloading from Telegram Forum Topics. Extract media from specific channel sub-topics with advanced filters.'
)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. SYSTEM SETTINGS TABLE (Key-Value)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial system settings
INSERT INTO public.system_settings (key, value)
VALUES
('free_fetch_limit', '5'::jsonb),
('ads_enabled_free_users', 'true'::jsonb),
('ads_enabled_paid_users', 'false'::jsonb),
('adsense_pub_id', '"ca-pub-1234567890123456"'::jsonb),
('payment_qr_code_url', '"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"'::jsonb),
('payment_upi_id', '"admin@upi"'::jsonb),
('payment_paypal_me', '"https://paypal.me/admin"'::jsonb),
('payment_bank_details', '"Bank: Global Bank | Acc: 1234567890 | IFSC/SWIFT: GBNK001"'::jsonb),
('payment_crypto_wallet', '"USDT TRC20: T9xXXxxxxxxxxxxxxxxxxxxxxxxxx"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users read/update own profile; admins read all
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subscription Plans: Readable by all
CREATE POLICY "Subscription plans readable by all" ON public.subscription_plans FOR SELECT USING (true);

-- Blog Posts: Readable by all if published
CREATE POLICY "Published blog posts readable by all" ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- User Subscriptions: Read own subscription
CREATE POLICY "Users read own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payment Verifications: Users insert/read own; admins update all
CREATE POLICY "Users create own payment verification" ON public.payment_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own payment verification" ON public.payment_verifications FOR SELECT USING (auth.uid() = user_id);

-- Contact Messages: Anyone can insert contact message
CREATE POLICY "Anyone can insert contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
