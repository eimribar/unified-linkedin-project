import { supabase } from '@/lib/supabase';
import type { Client, ContentIdea, GeneratedContent, ScheduledPost, User } from '@/lib/supabase';

// Re-export types
export type { GeneratedContent };

// Generated Content Service
export const generatedContentService = {
  async getByClient(clientId: string, status?: string) {
    let query = supabase
      .from('generated_content')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching generated content:', error);
      return [];
    }
    return data || [];
  },
  
  async update(id: string, updates: Partial<GeneratedContent>) {
    const { error } = await supabase
      .from('generated_content')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating content:', error);
      return false;
    }
    return true;
  }
};

// Scheduled Posts Service
export const scheduledPostsService = {
  async schedule(contentId: string, clientId: string, scheduledFor: Date, platform: string = 'linkedin') {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert([{
        content_id: contentId,
        client_id: clientId,
        scheduled_for: scheduledFor.toISOString(),
        platform,
        status: 'scheduled'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error scheduling post:', error);
      return null;
    }
    return data;
  }
};

// Service for client users to view their content
export const clientContentService = {
  // Get all approved content for a specific client
  async getApprovedContent(clientId: string) {
    const { data, error } = await supabase
      .from('generated_content')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching approved content:', error);
      return [];
    }
    return data;
  },

  // Get scheduled posts for a client
  async getScheduledPosts(clientId: string) {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        generated_content (
          content_text,
          hook,
          hashtags
        )
      `)
      .eq('client_id', clientId)
      .order('scheduled_for', { ascending: true });
    
    if (error) {
      console.error('Error fetching scheduled posts:', error);
      return [];
    }
    return data;
  },

  // Get content ideas for a client
  async getContentIdeas(clientId: string) {
    const { data, error } = await supabase
      .from('content_ideas')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching content ideas:', error);
      return [];
    }
    return data;
  },

  // Get analytics for a client's content
  async getContentAnalytics(clientId: string) {
    const { data: approvedContent, error: approvedError } = await supabase
      .from('generated_content')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'approved');
    
    const { data: scheduledPosts, error: scheduledError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('client_id', clientId);
    
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'published');
    
    return {
      totalApproved: approvedContent?.length || 0,
      totalScheduled: scheduledPosts?.filter(p => p.status === 'scheduled').length || 0,
      totalPublished: publishedPosts?.length || 0,
      approvedContent: approvedContent || [],
      scheduledPosts: scheduledPosts || [],
      publishedPosts: publishedPosts || []
    };
  }
};

// User authentication service
export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    // Get user details
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return { ...data, userData };
    }
    
    return data;
  },

  // Sign up new user
  async signUp(email: string, password: string, fullName: string, role: 'client' | 'ghostwriter' = 'client') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    
    if (user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return { ...user, ...userData };
    }
    
    return user;
  }
};

// Client service for managing client data
export const clientService = {
  // Get client details
  async getClient(clientId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error('Error fetching client:', error);
      return null;
    }
    return data;
  },

  // Get all clients (for admin/ghostwriter view)
  async getAllClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('company_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
    return data;
  },

  // Get client by user email (for client users)
  async getClientByEmail(email: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('contact_email', email)
      .single();
    
    if (error) {
      console.error('Error fetching client by email:', error);
      return null;
    }
    return data;
  }
};