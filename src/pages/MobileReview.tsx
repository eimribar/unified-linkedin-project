import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import { ReviewStack } from '@/components/mobile/ReviewStack';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogOut, Settings, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface GeneratedContent {
  id: string;
  client_id: string;
  variant_number: number;
  content_text: string;
  hook: string;
  hashtags?: string[];
  status: string;
  created_at: string;
}

const MobileReview: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useSimpleAuth();
  const [client, setClient] = useState<any>(null);
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user) {
      loadClientData();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (client) {
      loadContent();
    }
  }, [client]);

  const loadClientData = async () => {
    if (!user) return;
    
    try {
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .single();

      if (error) {
        console.error('Error loading client:', error);
        toast.error('Error loading your profile');
        return;
      }

      setClient(clientData);
    } catch (error) {
      console.error('Error in loadClientData:', error);
      toast.error('Error loading client data');
    }
  };

  const loadContent = async () => {
    if (!client) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('client_id', client.id)
        .in('status', ['admin_approved', 'client_rejected'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading content:', error);
        toast.error('Error loading content');
        return;
      }

      setContent(data || []);
    } catch (error) {
      console.error('Error in loadContent:', error);
      toast.error('Error loading content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: GeneratedContent) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          status: 'client_approved',
          approved_by: client.id
        })
        .eq('id', item.id);

      if (error) throw error;

      // Remove from current content list
      setContent(prev => prev.filter(c => c.id !== item.id));
      
      toast.success('Content approved! ✅', {
        duration: 2000,
        icon: '🎉'
      });

    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Error approving content');
    }
  };

  const handleDecline = async (item: GeneratedContent) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          status: 'client_rejected',
          revision_notes: 'Declined via mobile app'
        })
        .eq('id', item.id);

      if (error) throw error;

      // Remove from current content list
      setContent(prev => prev.filter(c => c.id !== item.id));
      
      toast.success('Content declined', {
        duration: 2000,
        icon: '❌'
      });

    } catch (error) {
      console.error('Error declining content:', error);
      toast.error('Error declining content');
    }
  };

  const handleEdit = (item: GeneratedContent) => {
    setEditModal({
      open: true,
      item,
      editedText: item.content_text
    });
  };

  const handleSaveEdit = async () => {
    if (!editModal.item || !editModal.editedText.trim()) return;

    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          content_text: editModal.editedText,
          status: 'client_edited'
        })
        .eq('id', editModal.item.id);

      if (error) throw error;

      // Remove from current content list
      setContent(prev => prev.filter(c => c.id !== editModal.item!.id));
      
      // Close modal
      setEditModal({ open: false, item: null, editedText: '' });
      
      toast.success('Content edited and saved! ✏️', {
        duration: 2000,
      });

    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error('Error saving changes');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between safe-area-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">
                {client?.name || 'Content Review'}
              </h1>
              <p className="text-sm text-gray-600">
                {client?.company || user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/client-approve')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ReviewStack
          content={content}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onEdit={handleEdit}
          loading={loading}
        />
      </main>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => 
        setEditModal(prev => ({ ...prev, open }))
      }>
        <DialogContent className="max-w-lg mx-4 max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editModal.editedText}
                onChange={(e) => setEditModal(prev => ({ 
                  ...prev, 
                  editedText: e.target.value 
                }))}
                className="min-h-[200px] resize-none"
                placeholder="Edit your content..."
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditModal({ open: false, item: null, editedText: '' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={!editModal.editedText.trim()}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileReview;