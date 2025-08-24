// =====================================================
// CLIENT APPROVAL PAGE - REDESIGNED
// High-quality UI with animations and modern design
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/utils/authHelpers';
import { ClientPortalRedesign } from '@/components/ui/client-portal-redesign';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
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
      // Check if user is admin and redirect
      if (isAdmin(user.email)) {
        setIsAdminMode(true);
      }
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
      console.log('Loading client data for user:', user.email);
      
      // Check if user is admin
      if (isAdmin(user.email)) {
        console.log('Admin mode activated');
        setIsAdminMode(true);
        
        // Load all clients for admin to choose from
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('name');
        
        if (clientsError) {
          console.error('Error loading clients:', clientsError);
          toast.error('Failed to load clients');
          setLoading(false);
          return;
        }
        
        setAllClients(clients || []);
        
        // Check if there's a client ID in URL params (for direct access from Ghostwriter portal)
        const urlParams = new URLSearchParams(window.location.search);
        const clientIdParam = urlParams.get('client_id');
        
        if (clientIdParam) {
          const selectedClient = clients?.find(c => c.id === clientIdParam);
          if (selectedClient) {
            setClient(selectedClient);
            setSelectedClientId(clientIdParam);
          }
        } else if (clients && clients.length > 0) {
          // Default to first client if no specific one selected
          setClient(clients[0]);
          setSelectedClientId(clients[0].id);
        }
        
        setLoading(false);
        return;
      }
      
      // Regular client flow
      // First try to fetch by auth_user_id
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (error) {
        console.log('No client found by auth_user_id, trying email...');
        
        // Try to fetch by email as fallback
        const { data: emailClient, error: emailError } = await supabase
          .from('clients')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (emailError) {
          console.error('Error loading client by email:', emailError);
          
          // Check if this is a case sensitivity issue
          const { data: caseInsensitive, error: caseError } = await supabase
            .from('clients')
            .select('*')
            .ilike('email', user.email)
            .single();
          
          if (caseError) {
            console.error('No client found for email:', user.email);
            toast.error('You are not authorized to access this platform. Please contact your administrator.');
            
            // Sign out unauthorized user
            setTimeout(async () => {
              await signOut();
              navigate('/auth?error=unauthorized');
            }, 2000);
            
            setLoading(false); // Important: stop loading
            return;
          }
          
          // Update the auth_user_id if we found a match
          if (caseInsensitive && !caseInsensitive.auth_user_id) {
            await supabase
              .from('clients')
              .update({ auth_user_id: user.id })
              .eq('id', caseInsensitive.id);
            
            setClient(caseInsensitive);
            console.log('Client found and linked:', caseInsensitive);
          } else {
            setClient(caseInsensitive);
            console.log('Client found:', caseInsensitive);
          }
        } else {
          // Update the auth_user_id if not set
          if (emailClient && !emailClient.auth_user_id) {
            await supabase
              .from('clients')
              .update({ auth_user_id: user.id })
              .eq('id', emailClient.id);
          }
          setClient(emailClient);
          console.log('Client found by email:', emailClient);
        }
      } else {
        setClient(data);
        console.log('Client found by auth_user_id:', data);
      }
    } catch (err) {
      console.error('Error in loadClientData:', err);
      toast.error('Failed to load client data');
      setLoading(false); // Important: stop loading on error
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
          approved_by: client?.name
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Remove from current list
      setContent(prev => prev.filter(c => c.id !== item.id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
      
      toast.success('Content approved successfully!');
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Failed to approve content');
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

  const handleClientChange = (clientId: string) => {
    const newClient = allClients.find(c => c.id === clientId);
    if (newClient) {
      setSelectedClientId(clientId);
      setClient(newClient);
      setContent([]); // Clear content to reload
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientPortalRedesign
        client={client}
        content={content}
        stats={stats}
        loading={loading}
        isAdminMode={isAdminMode}
        allClients={allClients}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onSignOut={signOut}
      />

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => !open && setEditModal({ open: false, item: null, editedText: '' })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Make changes to the content below. Your edits will be sent back for review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Content Text</Label>
              <Textarea
                value={editModal.editedText}
                onChange={(e) => setEditModal(prev => ({ ...prev, editedText: e.target.value }))}
                className="min-h-[200px] mt-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditModal({ open: false, item: null, editedText: '' })}>
                Cancel
              </Button>
              <Button onClick={saveEdit} className="bg-gray-900 text-white hover:bg-black">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectModal.open} onOpenChange={(open) => !open && setRejectModal({ open: false, item: null, reason: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this content (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Rejection Reason</Label>
              <Textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter your feedback..."
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModal({ open: false, item: null, reason: '' })}>
                Cancel
              </Button>
              <Button onClick={confirmReject} className="bg-red-600 text-white hover:bg-red-700">
                Reject Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientApproval;