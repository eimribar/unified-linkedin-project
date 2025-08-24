// =====================================================
// CLIENT APPROVAL PAGE - REDESIGNED
// Modern card-based approval interface with SSO auth
// Beautiful UX with stack view and swipe gestures
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import ApprovalStack from '@/components/approval/ApprovalStack';
import { 
  LogOut,
  Building,
  User,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

interface GeneratedContent {
  id: string;
  client_id: string;
  variant_number: number;
  content_text: string;
  hook: string;
  hashtags?: string[];
  llm_provider: string;
  llm_model?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ClientApproval: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: isLoading } = useSimpleAuth();
  const [client, setClient] = useState<any>(null);
  
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });
  
  // Edit modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    item: GeneratedContent | null;
    editedText: string;
  }>({
    open: false,
    item: null,
    editedText: ''
  });
  
  // Rejection modal state
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    item: GeneratedContent | null;
    reason: string;
  }>({
    open: false,
    item: null,
    reason: ''
  });

  // Load client data when user is authenticated
  useEffect(() => {
    if (user) {
      loadClientData();
    }
  }, [user]);

  // Load content when client is loaded
  useEffect(() => {
    if (client) {
      loadContent();
      loadStats();
    }
  }, [client]);

  const loadClientData = async () => {
    if (!user) return;
    
    try {
      // Fetch client data linked to this auth user
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error loading client:', error);
        // Try to fetch by email as fallback
        const { data: emailClient, error: emailError } = await supabase
          .from('clients')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (emailError) {
          console.error('Error loading client by email:', emailError);
          toast.error('Unable to find your client account');
          return;
        }
        
        setClient(emailClient);
      } else {
        setClient(data);
      }
    } catch (err) {
      console.error('Error in loadClientData:', err);
      toast.error('Failed to load client data');
    }
  };

  const loadContent = async () => {
    if (!client) return;
    
    setLoading(true);
    try {
      // Fetch all admin-approved content for this client
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('client_id', client.id)
        .eq('status', 'admin_approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading content:', error);
        toast.error('Failed to load content');
      } else {
        setContent(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!client) return;
    
    try {
      const { data: allContent } = await supabase
        .from('generated_content')
        .select('status')
        .eq('client_id', client.id);
      
      if (allContent) {
        setStats({
          total: allContent.length,
          approved: allContent.filter(c => c.status === 'client_approved').length,
          rejected: allContent.filter(c => c.status === 'client_rejected').length,
          pending: allContent.filter(c => c.status === 'admin_approved').length
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleApprove = async (item: GeneratedContent) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'client_approved',
          approved_at: new Date().toISOString(),
          revision_notes: `Approved by ${client?.name}`
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Remove from current content and reload stats
      setContent(prev => prev.filter(c => c.id !== item.id));
      loadStats();
      
      toast.success('Content approved! 🎉');
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Failed to approve content');
      throw error; // Re-throw to be handled by ApprovalStack
    }
  };

  const handleReject = async (item: GeneratedContent) => {
    setRejectModal({
      open: true,
      item,
      reason: ''
    });
  };

  const confirmReject = async () => {
    if (!rejectModal.item) return;
    
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'client_rejected',
          revision_notes: rejectModal.reason || 'Rejected by client'
        })
        .eq('id', rejectModal.item.id);

      if (error) throw error;
      
      // Remove from current content and reload stats
      setContent(prev => prev.filter(c => c.id !== rejectModal.item!.id));
      loadStats();
      
      toast.success('Content rejected');
      setRejectModal({ open: false, item: null, reason: '' });
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Failed to reject content');
    }
  };

  const handleEdit = (item: GeneratedContent) => {
    setEditModal({
      open: true,
      item,
      editedText: item.content_text
    });
  };

  const saveEdit = async () => {
    if (!editModal.item) return;
    
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          content_text: editModal.editedText,
          status: 'client_edited',
          revision_notes: `Edited by ${client?.name}`
        })
        .eq('id', editModal.item.id);

      if (error) throw error;
      
      // Remove from current content and reload stats
      setContent(prev => prev.filter(c => c.id !== editModal.item!.id));
      loadStats();
      
      toast.success('Content edited and sent back for review');
      setEditModal({ open: false, item: null, editedText: '' });
    } catch (error) {
      console.error('Error editing content:', error);
      toast.error('Failed to save edits');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Client Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-lg font-semibold text-zinc-900">
                  {client?.company || 'Content Portal'}
                </h1>
                <p className="text-sm text-zinc-600">
                  Welcome, {client?.name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stats.pending}</p>
                  <p className="text-xs text-zinc-600">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stats.approved}</p>
                  <p className="text-xs text-zinc-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stats.rejected}</p>
                  <p className="text-xs text-zinc-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{stats.total}</p>
                  <p className="text-xs text-zinc-600">Total Content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Interface */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-600">Loading your content...</p>
          </div>
        ) : (
          <ApprovalStack
            content={content}
            clientName={client?.name}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        )}
      </main>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => !open && setEditModal({ open: false, item: null, editedText: '' })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Make your changes below. The content will be sent back to your content team for review.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editModal.editedText}
                onChange={(e) => setEditModal(prev => ({ ...prev, editedText: e.target.value }))}
                className="min-h-[200px] mt-2"
                placeholder="Edit your content here..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditModal({ open: false, item: null, editedText: '' })}
              >
                Cancel
              </Button>
              <Button onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, item: null, reason: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide feedback on why this content doesn't meet your needs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for rejection (optional)</Label>
              <Textarea
                id="reason"
                value={rejectModal.reason}
                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                className="mt-2"
                placeholder="Please provide specific feedback to help improve future content..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setRejectModal({ open: false, item: null, reason: '' })}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                Reject Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientApproval;