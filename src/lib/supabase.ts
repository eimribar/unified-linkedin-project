import { createClient } from '@supabase/supabase-js';

// Using the same Supabase instance as the ghostwriter portal
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Delay credential check to allow environment variables to load
// This prevents false "NOT SET" errors on initial load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase credentials may not be configured properly');
      console.warn('If you see authentication errors, check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    } else {
      console.log('✅ Supabase client initialized');
    }
  }, 1000);
}

// Create client even with empty strings - Vite will inject the real values
// This prevents initialization errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

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