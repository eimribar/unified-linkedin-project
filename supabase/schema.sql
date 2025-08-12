-- LinkedIn Content Engine Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  linkedin_url TEXT,
  company TEXT,
  role TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_answers JSONB,
  content_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LinkedIn Creators table
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  linkedin_url TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  follower_count INTEGER,
  bio TEXT,
  average_reactions INTEGER,
  content_themes TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Posts (scraped from LinkedIn)
CREATE TABLE IF NOT EXISTS public.content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  original_url TEXT UNIQUE NOT NULL,
  content_text TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'document')),
  reactions_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  media_urls TEXT[],
  hashtags TEXT[],
  mentions TEXT[],
  posted_at TIMESTAMPTZ NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  quality_score DECIMAL(3,2),
  is_promotional BOOLEAN DEFAULT false,
  content_themes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Ideas (derived from posts or manually created)
CREATE TABLE IF NOT EXISTS public.content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  source_post_id UUID REFERENCES public.content_posts(id) ON DELETE SET NULL,
  idea_text TEXT NOT NULL,
  hook TEXT,
  key_points TEXT[],
  target_audience TEXT,
  content_format TEXT,
  status TEXT CHECK (status IN ('draft', 'ideation', 'approved', 'rejected')) DEFAULT 'draft',
  llm_provider TEXT CHECK (llm_provider IN ('gemini', 'claude', 'gpt4', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Content Variations
CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES public.content_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  variant_number INTEGER NOT NULL,
  content_text TEXT NOT NULL,
  hook TEXT NOT NULL,
  hashtags TEXT[],
  estimated_read_time INTEGER,
  llm_provider TEXT CHECK (llm_provider IN ('gemini', 'claude', 'gpt4')) NOT NULL,
  llm_model TEXT,
  generation_prompt TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')) DEFAULT 'pending',
  revision_notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, variant_number)
);

-- Scheduled Posts
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  platform TEXT CHECK (platform IN ('linkedin', 'twitter', 'both')) DEFAULT 'linkedin',
  status TEXT CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')) DEFAULT 'scheduled',
  published_at TIMESTAMPTZ,
  published_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Content Ideas (manual submissions)
CREATE TABLE IF NOT EXISTS public.user_content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('link', 'note', 'file', 'video')) NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  platform TEXT CHECK (platform IN ('linkedin', 'twitter', 'youtube', 'reddit', 'article', 'other')),
  file_url TEXT,
  title TEXT,
  description TEXT,
  is_starred BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Analytics
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scheduled_post_id UUID REFERENCES public.scheduled_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval History
CREATE TABLE IF NOT EXISTS public.approval_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('approved', 'rejected', 'revision_requested')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_content_posts_creator_id ON public.content_posts(creator_id);
CREATE INDEX idx_content_posts_quality_score ON public.content_posts(quality_score DESC);
CREATE INDEX idx_content_posts_posted_at ON public.content_posts(posted_at DESC);
CREATE INDEX idx_content_ideas_user_id ON public.content_ideas(user_id);
CREATE INDEX idx_content_ideas_status ON public.content_ideas(status);
CREATE INDEX idx_generated_content_user_id ON public.generated_content(user_id);
CREATE INDEX idx_generated_content_status ON public.generated_content(status);
CREATE INDEX idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_scheduled_for ON public.scheduled_posts(scheduled_for);
CREATE INDEX idx_user_content_ideas_user_id ON public.user_content_ideas(user_id);
CREATE INDEX idx_user_content_ideas_is_starred ON public.user_content_ideas(is_starred);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own content ideas" ON public.content_ideas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own generated content" ON public.generated_content
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_posts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own user content ideas" ON public.user_content_ideas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.content_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own approval history" ON public.approval_history
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access for creators and content posts (content lake)
CREATE POLICY "Anyone can view creators" ON public.creators
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view quality content posts" ON public.content_posts
  FOR SELECT USING (quality_score >= 0.7 OR reactions_count >= 100);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON public.creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_ideas_updated_at BEFORE UPDATE ON public.content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON public.generated_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_content_ideas_updated_at BEFORE UPDATE ON public.user_content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();