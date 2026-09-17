-- =========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR PORTFOLIO LANDING PAGE
-- Co-created for Enterprise Software Portfolio
-- =========================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Fullstack',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  mobile_mockup_url TEXT,
  mockup_type TEXT DEFAULT 'iphone',
  video_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  completion_date TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  architecture_highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Posts Table (Blog / Case Studies)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Kiến Trúc Phần Mềm',
  author TEXT DEFAULT 'Admin',
  read_time TEXT DEFAULT '5 phút đọc',
  image_url TEXT,
  video_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Settings Table (Branding, Logo, Hero Text)
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  brand_name TEXT NOT NULL DEFAULT 'DEV',
  brand_suffix TEXT NOT NULL DEFAULT '.PORTFOLIO',
  brand_subtitle TEXT DEFAULT 'SYSTEM ARCHITECT & FULLSTACK',
  brand_logo_url TEXT,
  hero_badge TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  contact_email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  total_projects_count TEXT DEFAULT '15+',
  uptime_metric TEXT DEFAULT '99.9%',
  hostingCostMetric TEXT DEFAULT '0đ',
  projects_title TEXT,
  projects_subtitle TEXT,
  skills_title TEXT,
  skills_subtitle TEXT,
  posts_title TEXT,
  posts_subtitle TEXT,
  contact_title TEXT,
  contact_subtitle TEXT
);

-- 4. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- 6. Create Public Read Policies
CREATE POLICY "Allow Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Skills" ON public.skills FOR SELECT USING (true);

-- 7. Create Storage Bucket for Images and Videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow Public Read Assets" ON storage.objects FOR SELECT USING (bucket_id = 'project-assets');
