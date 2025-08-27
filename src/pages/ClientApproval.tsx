import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/utils/authHelpers';
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Calendar, Building, Sparkles, Edit2, X, Save, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientApprovalActionBar } from '@/components/ui/gradient-action-buttons';
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

const ClientApproval = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: isLoading } = useSimpleAuth();
  const [client, setClient] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(-1);
  const [editingContent, setEditingContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  // Load client data when user is authenticated
  useEffect(() => {
    if (user) {
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

  // Navigation functions
  const navigateToContent = (index: number) => {
    if (index >= 0 && index < content.length) {
      setSelectedContent(content[index]);
      setSelectedContentIndex(index);
    }
  };

  const goToPrevious = () => {
    if (selectedContentIndex > 0) {
      navigateToContent(selectedContentIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedContentIndex < content.length - 1) {
      navigateToContent(selectedContentIndex + 1);
    }
  };

  // Open modal with specific content
  const openContentModal = (item: GeneratedContent) => {
    const index = content.findIndex(c => c.id === item.id);
    setSelectedContent(item);
    setSelectedContentIndex(index);
  };

  // Keyboard shortcuts for modal
  useEffect(() => {
    if (!selectedContent) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (isEditing) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
          if (!processing) handleApprove(selectedContent);
          break;
        case 'd':
          if (!processing) handleReject(selectedContent);
          break;
        case 'e':
          if (!processing) handleEdit(selectedContent);
          break;
        case 'arrowleft':
          goToPrevious();
          break;
        case 'arrowright':
          goToNext();
          break;
        case 'escape':
          if (!isEditing) setSelectedContent(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedContent, selectedContentIndex, content.length, processing, isEditing]);

  const loadClientData = async () => {
    if (!user) return;
    
    try {
      // Check if user is admin
      if (isAdmin(user.email)) {
        setIsAdminMode(true);
        
        // Load all clients for admin
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
        
        // Check URL params for client_id
        const urlParams = new URLSearchParams(window.location.search);
        const clientIdParam = urlParams.get('client_id');
        
        if (clientIdParam) {
          const selectedClient = clients?.find(c => c.id === clientIdParam);
          if (selectedClient) {
            setClient(selectedClient);
            setSelectedClientId(clientIdParam);
          }
        } else if (clients && clients.length > 0) {
          setClient(clients[0]);
          setSelectedClientId(clients[0].id);
        }
        
        setLoading(false);
        return;
      }
      
      // Regular client flow
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (error) {
        // Try by email as fallback
        const { data: emailClient, error: emailError } = await supabase
          .from('clients')
          .select('*')
          .ilike('email', user.email)
          .single();
        
        if (emailError) {
          toast.error('You are not authorized to access this platform.');
          setTimeout(async () => {
            await signOut();
            navigate('/auth?error=unauthorized');
          }, 2000);
          setLoading(false);
          return;
        }
        
        // Update auth_user_id if needed
        if (emailClient && !emailClient.auth_user_id) {
          await supabase
            .from('clients')
            .update({ auth_user_id: user.id })
            .eq('id', emailClient.id);
        }
        setClient(emailClient);
      } else {
        setClient(data);
      }
    } catch (err) {
      console.error('Error in loadClientData:', err);
      toast.error('Failed to load client data');
      setLoading(false);
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
    setProcessing(item.id);
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          status: 'client_approved',
          approved_at: new Date().toISOString(),
          approved_by: client?.id
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Remove from list and update stats
      setContent(prev => prev.filter(c => c.id !== item.id));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
      
      toast.success('Content approved successfully!');
      
      // Auto-advance to next item
      if (selectedContentIndex < content.length - 1) {
        const nextItem = content[selectedContentIndex + 1];
        setSelectedContent(nextItem);
      } else if (content.length > 1) {
        setSelectedContent(null);
        setSelectedContentIndex(-1);
      } else {
        setSelectedContent(null);
      }
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Failed to approve content');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (item: GeneratedContent) => {
    setProcessing(item.id);
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'client_rejected',
          revision_notes: 'Rejected by client'
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Remove from list and update stats
      setContent(prev => prev.filter(c => c.id !== item.id));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
      
      toast.success('Content rejected');
      
      // Auto-advance to next item
      if (selectedContentIndex < content.length - 1) {
        const nextItem = content[selectedContentIndex + 1];
        setSelectedContent(nextItem);
      } else if (content.length > 1) {
        setSelectedContent(null);
        setSelectedContentIndex(-1);
      } else {
        setSelectedContent(null);
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Failed to reject content');
    } finally {
      setProcessing(null);
    }
  };

  const handleEdit = (item: GeneratedContent) => {
    setEditingContent(item.content_text);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (!selectedContent) return;
    
    setProcessing(selectedContent.id);
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          content_text: editingContent,
          status: 'client_edited',
          revision_notes: `Edited by ${client?.name}`
        })
        .eq('id', selectedContent.id);

      if (error) throw error;
      
      // Remove from list and update stats
      setContent(prev => prev.filter(c => c.id !== selectedContent.id));
      loadStats();
      
      toast.success('Content edited and sent back for review');
      setIsEditing(false);
      setEditingContent('');
      
      // Keep modal open but move to next item
      if (selectedContentIndex < content.length - 1) {
        const nextItem = content[selectedContentIndex + 1];
        setSelectedContent(nextItem);
      } else {
        setSelectedContent(null);
      }
    } catch (error) {
      console.error('Error editing content:', error);
      toast.error('Failed to save edits');
    } finally {
      setProcessing(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  const handleClientChange = (clientId: string) => {
    const newClient = allClients.find(c => c.id === clientId);
    if (newClient) {
      setSelectedClientId(clientId);
      setClient(newClient);
      setContent([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-6">
                <h1 className="text-lg sm:text-xl font-semibold text-zinc-900">Content Dashboard</h1>
                
                {/* Admin Client Selector */}
                {isAdminMode && allClients && allClients.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedClientId || ''}
                      onChange={(e) => handleClientChange(e.target.value)}
                      className="appearance-none border border-zinc-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    >
                      <option value="">Select Client</option>
                      {allClients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name || c.company || c.email}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-zinc-900">{client?.name || client?.company || 'Client'}</p>
                  <p className="text-xs text-zinc-500">{client?.email}</p>
                </div>
                
                <button
                  onClick={signOut}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-sm">Pending Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900">{stats.pending}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-sm">Approved</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900">{stats.approved}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-sm">Rejected</span>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900">{stats.rejected}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-sm">Total Content</span>
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900">{stats.total}</p>
            </div>
          </div>

          {/* Content Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              {content.length} posts for review
            </h2>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
            </div>
          ) : content.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-100 p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">All caught up!</h3>
              <p className="text-zinc-500">No content pending your review at this time.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {content.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openContentModal(item)}
                  className="bg-white rounded-xl border border-zinc-100 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                          Pending Your Approval
                        </span>
                        <span className="text-xs text-zinc-500">
                          Variant #{item.variant_number}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <p className="text-zinc-700 mb-4 line-clamp-3">
                    {item.content_text}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      Click to review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          {/* Navigation Arrows - Hidden on mobile */}
          {selectedContentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 hidden sm:block"
              title="Previous (←)"
            >
              <ChevronLeft className="w-6 h-6 text-zinc-700" />
            </button>
          )}
          
          {selectedContentIndex < content.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 hidden sm:block"
              title="Next (→)"
            >
              <ChevronRight className="w-6 h-6 text-zinc-700" />
            </button>
          )}

          <div className="bg-white rounded-xl sm:rounded-2xl max-w-3xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-zinc-900">
                  Review Content
                </h3>
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full">
                  {selectedContentIndex + 1} of {content.length}
                </span>
              </div>
              <button
                onClick={() => setSelectedContent(null)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                  <Clock className="w-3 h-3" />
                  Pending Review
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(selectedContent.created_at)}
                </span>
                <span className="text-sm text-zinc-500">
                  Variant #{selectedContent.variant_number}
                </span>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Content</label>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full min-h-[200px] p-4 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                        disabled={processing === selectedContent.id}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={processing === selectedContent.id}
                        className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing === selectedContent.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-50 rounded-xl">
                    <p className="text-zinc-700 whitespace-pre-wrap">{selectedContent.content_text}</p>
                  </div>
                )}
              </div>

              {/* Hashtags */}
              {selectedContent.hashtags && selectedContent.hashtags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.hashtags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Action Buttons */}
            {!isEditing && (
              <div className="sticky bottom-0 bg-white border-t px-4 sm:px-6 py-3 sm:py-4 z-10">
                <div className="flex justify-center">
                  <ClientApprovalActionBar
                    onApprove={() => handleApprove(selectedContent)}
                    onDecline={() => handleReject(selectedContent)}
                    onEdit={() => handleEdit(selectedContent)}
                    disableAll={processing === selectedContent.id}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientApproval;