import { createClient } from '@supabase/supabase-js';

// Using the same Supabase instance as the ghostwriter portal
// These should be set in Vercel environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ifwscuvbtdokljwwbvex.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmd3NjdXZidGRva2xqd3didmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDI0NDMsImV4cCI6MjA3MDU3ODQ0M30.QzxtYT8nbLPx9T3-PLABLXx7XtkjAg77ffUlghnQ0Xc';

// Log initialization status
console.log('🔧 Initializing Supabase client...');
if (import.meta.env.VITE_SUPABASE_URL) {
  console.log('✅ Using environment variables for Supabase');
} else {
  console.warn('⚠️ Using fallback Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching the ghostwriter portal schema
export interface Client {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  industry?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentTheme {
  id: string;
  client_id?: string;
  theme_name: string;
  description?: string;
  keywords?: string[];
  example_posts?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ContentIdea {
  id: string;
  client_id?: string;
  user_id?: string;
  title: string;
  description?: string;
  source?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'draft' | 'in_progress' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface GeneratedContent {
  id: string;
  idea_id?: string;
  client_id?: string;
  ghostwriter_id?: string;
  user_id?: string;
  variant_number: number;
  content_text: string;
  hook: string;
  hashtags?: string[];
  estimated_read_time?: number;
  llm_provider: 'google' | 'anthropic' | 'openai';
  llm_model?: string;
  generation_prompt?: string;
  status: 'draft' | 'admin_approved' | 'admin_rejected' | 'client_approved' | 'client_rejected' | 'scheduled' | 'published';
  revision_notes?: string;
  approved_at?: Date;
  approved_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ScheduledPost {
  id: string;
  content_id: string;
  client_id?: string;
  scheduled_for: Date;
  platform?: string;
  status?: 'scheduled' | 'published' | 'failed';
  published_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: 'admin' | 'ghostwriter' | 'client';
  created_at: Date;
  updated_at: Date;
}