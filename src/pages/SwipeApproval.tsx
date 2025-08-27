import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/utils/authHelpers';
import { SwipeableCard } from '@/components/swipe/SwipeableCard';
import { Check, X, Edit3, RotateCcw, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface GeneratedContent {
  id: string;
  client_id: string;
  variant_number: number;
  content_text: string;
  hook?: string;
  hashtags?: string[];
  status: string;
  created_at: string;
  llm_provider: string;
  llm_model?: string;
}

const SwipeApproval = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: isLoading } = useSimpleAuth();
  const [client, setClient] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{item: GeneratedContent, action: string}[]>([]);
  const [editingContent, setEditingContent] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GeneratedContent | null>(null);

  // Animation for card stack
  const stackAnimation = useSpring({
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 300, friction: 30 }
  });

  // Load client data
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
    }
  }, [client]);

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
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An unexpected error occurred');
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
          approved_at: new Date().toISOString(),
          approved_by: client?.id
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Add to history
      setHistory(prev => [...prev, { item, action: 'approved' }]);
      
      // Move to next
      setCurrentIndex(prev => prev + 1);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast.success('Content approved!', {
        icon: '✅',
        duration: 2000
      });
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Failed to approve content');
    }
  };

  const handleDecline = async (item: GeneratedContent) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          status: 'client_rejected',
          revision_notes: 'Rejected by client'
        })
        .eq('id', item.id);

      if (error) throw error;
      
      // Add to history
      setHistory(prev => [...prev, { item, action: 'declined' }]);
      
      // Move to next
      setCurrentIndex(prev => prev + 1);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast.success('Content declined', {
        icon: '❌',
        duration: 2000
      });
    } catch (error) {
      console.error('Error declining content:', error);
      toast.error('Failed to decline content');
    }
  };

  const handleEdit = (item: GeneratedContent) => {
    setEditingItem(item);
    setEditingContent(item.content_text);
    setShowEditModal(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({
          content_text: editingContent,
          status: 'client_edited',
          revision_notes: `Edited by ${client?.name}`
        })
        .eq('id', editingItem.id);

      if (error) throw error;
      
      // Add to history
      setHistory(prev => [...prev, { item: editingItem, action: 'edited' }]);
      
      // Move to next
      setCurrentIndex(prev => prev + 1);
      
      toast.success('Content edited and sent for review', {
        icon: '✏️',
        duration: 2000
      });
      
      setShowEditModal(false);
      setEditingItem(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error editing content:', error);
      toast.error('Failed to save edits');
    }
  };

  const handleUndo = async () => {
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    
    try {
      // Revert the last action
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          status: 'admin_approved',
          approved_at: null,
          approved_by: null,
          revision_notes: null
        })
        .eq('id', lastAction.item.id);

      if (error) throw error;
      
      // Remove from history
      setHistory(prev => prev.slice(0, -1));
      
      // Go back one card
      setCurrentIndex(prev => Math.max(0, prev - 1));
      
      // Reload content to get the item back
      await loadContent();
      
      toast.success(`Undid ${lastAction.action}`, {
        icon: '↩️',
        duration: 2000
      });
    } catch (error) {
      console.error('Error undoing action:', error);
      toast.error('Failed to undo');
    }
  };

  const handleClientChange = (clientId: string) => {
    const newClient = allClients.find(c => c.id === clientId);
    if (newClient) {
      setSelectedClientId(clientId);
      setClient(newClient);
      setContent([]);
      setCurrentIndex(0);
      setHistory([]);
    }
  };

  const currentCards = content.slice(currentIndex, currentIndex + 3);
  const remainingCount = content.length - currentIndex;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h1 className="text-lg font-semibold text-zinc-900">
                {remainingCount} to review
              </h1>
            </div>

            {/* Admin Client Selector */}
            {isAdminMode && allClients && allClients.length > 0 && (
              <div className="relative">
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="appearance-none bg-white border border-zinc-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Client</option>
                  {allClients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.company || c.email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            )}

            <button
              onClick={signOut}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-screen flex flex-col pt-16 pb-24">
        {/* Card Stack */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : remainingCount === 0 ? (
            <div className="flex items-center justify-center h-full px-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">All done!</h2>
                <p className="text-zinc-500 mb-6">You've reviewed all pending content</p>
                {history.length > 0 && (
                  <button
                    onClick={handleUndo}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-full font-medium"
                  >
                    Undo last action
                  </button>
                )}
              </div>
            </div>
          ) : (
            <animated.div style={stackAnimation} className="relative h-full">
              {currentCards.map((item, index) => (
                <SwipeableCard
                  key={item.id}
                  content={item}
                  onApprove={() => handleApprove(item)}
                  onDecline={() => handleDecline(item)}
                  onEdit={() => handleEdit(item)}
                  isTop={index === 0}
                  index={index}
                  style={{
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 15}px)`,
                    opacity: 1 - index * 0.2
                  }}
                />
              ))}
            </animated.div>
          )}
        </div>

        {/* Action Buttons */}
        {remainingCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t">
            <div className="px-6 py-4">
              <div className="flex items-center justify-center gap-6">
                {/* Undo Button */}
                {history.length > 0 && (
                  <button
                    onClick={handleUndo}
                    className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
                    title="Undo last action"
                  >
                    <RotateCcw className="w-5 h-5 text-zinc-600" />
                  </button>
                )}

                {/* Main Action Buttons */}
                <button
                  onClick={() => currentCards[0] && handleDecline(currentCards[0])}
                  className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  title="Decline"
                >
                  <X className="w-8 h-8 text-white" strokeWidth={3} />
                </button>

                <button
                  onClick={() => currentCards[0] && handleEdit(currentCards[0])}
                  className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  title="Edit"
                >
                  <Edit3 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => currentCards[0] && handleApprove(currentCards[0])}
                  className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  title="Approve"
                >
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-zinc-900">Edit Content</h3>
            </div>
            <div className="p-6">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full min-h-[300px] p-4 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                autoFocus
              />
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setEditingContent('');
                }}
                className="px-6 py-2.5 text-zinc-600 hover:text-zinc-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeApproval;