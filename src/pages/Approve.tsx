import { useState, useEffect } from 'react';
import SEO from "@/components/seo/SEO";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Calendar, Building, Sparkles, Edit2, X, Save, UserPlus } from 'lucide-react';
import { generatedContentService, scheduledPostsService, type GeneratedContent } from '@/services/database.service';
import { cn } from '@/lib/utils';
import { ClientApprovalActionBar } from '@/components/ui/gradient-action-buttons';
import toast from 'react-hot-toast';

const Approve = () => {
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(-1);
  const [editingContent, setEditingContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPendingContent();
  }, []);

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
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isEditing) return;
      
      if (!selectedContent) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleApprove(selectedContent);
          }
          break;
        case 'd':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleReject(selectedContent);
          }
          break;
        case 'e':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleEdit(selectedContent);
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'arrowright':
          e.preventDefault();
          goToNext();
          break;
        case 'escape':
          setSelectedContent(null);
          setSelectedContentIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedContent, selectedContentIndex, isEditing, content]);

  const loadPendingContent = async () => {
    setLoading(true);
    
    try {
      // Get ALL content that's been approved by admin (no user filter)
      const allContent = await generatedContentService.getAllAdminApproved();
      setContent(allContent);
    } catch (error) {
      console.error('❌ Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: GeneratedContent) => {
    setProcessing(item.id);
    try {
      // Update status to client_approved
      const success = await generatedContentService.update(item.id, {
        status: 'client_approved',
        approved_at: new Date().toISOString() as any,
        approved_by: 'client'
      });
      
      if (success) {
        // Auto-schedule for next available slot
        const scheduledFor = new Date();
        scheduledFor.setDate(scheduledFor.getDate() + 1);
        scheduledFor.setHours(10, 0, 0, 0);
        
        await scheduledPostsService.schedule(
          item.id,
          item.client_id || 'no-client',
          scheduledFor,
          'linkedin'
        );
        
        // Find the current index before filtering
        const currentIndex = content.findIndex(c => c.id === item.id);
        
        // Remove approved content from view
        const updatedContent = content.filter(c => c.id !== item.id);
        setContent(updatedContent);
        
        // If this was the selected content in modal, navigate to next or close
        if (selectedContent?.id === item.id) {
          if (updatedContent.length > 0 && currentIndex < updatedContent.length) {
            // Move to the item that's now at the same index (was next)
            setSelectedContent(updatedContent[Math.min(currentIndex, updatedContent.length - 1)]);
            setSelectedContentIndex(Math.min(currentIndex, updatedContent.length - 1));
          } else if (currentIndex > 0 && updatedContent.length > 0) {
            // If we were at the end, move to previous (now last)
            setSelectedContent(updatedContent[currentIndex - 1]);
            setSelectedContentIndex(currentIndex - 1);
          } else {
            // No more content, close modal
            setSelectedContent(null);
            setSelectedContentIndex(-1);
          }
        }
        
        toast.success('Content approved and scheduled!', {
          duration: 2000,
          icon: '✅'
        });
      } else {
        toast.error('Failed to approve content');
      }
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Error approving content');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (item: GeneratedContent) => {
    setProcessing(item.id);
    
    try {
      const reason = prompt('Why are you declining this content? (optional)');
      
      const success = await generatedContentService.update(item.id, {
        status: 'client_rejected',
        revision_notes: reason || 'Declined by client'
      });
      
      if (success) {
        // Find the current index before filtering
        const currentIndex = content.findIndex(c => c.id === item.id);
        
        // Remove rejected content from view
        const updatedContent = content.filter(c => c.id !== item.id);
        setContent(updatedContent);
        
        // If this was the selected content in modal, navigate to next or close
        if (selectedContent?.id === item.id) {
          if (updatedContent.length > 0 && currentIndex < updatedContent.length) {
            setSelectedContent(updatedContent[Math.min(currentIndex, updatedContent.length - 1)]);
            setSelectedContentIndex(Math.min(currentIndex, updatedContent.length - 1));
          } else if (currentIndex > 0 && updatedContent.length > 0) {
            setSelectedContent(updatedContent[currentIndex - 1]);
            setSelectedContentIndex(currentIndex - 1);
          } else {
            setSelectedContent(null);
            setSelectedContentIndex(-1);
          }
        }
        
        toast.success('Content declined', {
          duration: 2000,
          icon: '❌'
        });
      } else {
        toast.error('Failed to reject content');
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Error rejecting content');
    } finally {
      setProcessing(null);
    }
  };

  const handleEdit = (item: GeneratedContent) => {
    setSelectedContent(item);
    setEditingContent(item.content_text);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedContent) return;
    
    setProcessing(selectedContent.id);
    try {
      const success = await generatedContentService.update(selectedContent.id, {
        content_text: editingContent,
        revision_notes: 'Edited by client'
      });
      
      if (success) {
        // Update the content locally
        setContent(prevContent => 
          prevContent.map(item => 
            item.id === selectedContent.id 
              ? { ...item, content_text: editingContent }
              : item
          )
        );
        
        // Update selectedContent with the edited text
        setSelectedContent({ ...selectedContent, content_text: editingContent });
        
        // Only close the edit modal, keep preview modal open
        setIsEditing(false);
        
        toast.success('Content updated successfully');
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error('Error saving edit');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'admin_approved':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Pending Your Approval</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Approve Content – LinkedIn Content Engine"
        description="Review and approve your LinkedIn content before it goes live."
        canonicalPath="/approve"
      />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Content Approval</h1>
            <p className="text-zinc-600 mt-2">
              Review and approve content prepared by your ghostwriter
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Pending Review</p>
              <p className="text-2xl font-bold text-zinc-900">{content.length}</p>
            </div>
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Auto-Schedule</p>
              <p className="text-2xl font-bold text-green-600">Enabled</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Quick Actions</p>
              <p className="text-2xl font-bold text-blue-600">A, D, E</p>
            </div>
            <Edit2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="text-center py-12">
          <Clock className="w-8 h-8 text-zinc-400 mx-auto mb-4 animate-spin" />
          <p className="text-zinc-600">Loading content...</p>
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl border border-zinc-200">
          <Sparkles className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-zinc-600">All caught up!</p>
          <p className="text-zinc-500 mt-2">No content pending your review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-xl hover:border-zinc-300 transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(item.status)}
                    <span className="text-sm text-zinc-500">
                      Variant {item.variant_number} • 
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {/* Gradient Action Buttons */}
                <ClientApprovalActionBar
                  onApprove={() => handleApprove(item)}
                  onDecline={() => handleReject(item)}
                  onEdit={() => handleEdit(item)}
                  disableAll={processing === item.id}
                />
              </div>

              {/* Content Preview */}
              <div className="prose prose-zinc max-w-none">
                <p className="text-sm text-zinc-700 leading-relaxed line-clamp-4">
                  {item.content_text}
                </p>
              </div>

              {/* Hashtags */}
              {item.hashtags && item.hashtags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Expand Button */}
              <button
                onClick={() => openContentModal(item)}
                className="mt-4 text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
              >
                View full content
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Content</h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full h-96 p-4 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={processing === selectedContent.id}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Full Content Modal with Actions and Navigation */}
      {selectedContent && !isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative transition-all duration-300 ease-out">
            {/* Navigation Arrows */}
            {selectedContentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 hidden lg:block"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-700" />
              </button>
            )}
            {selectedContentIndex < content.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 hidden lg:block"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6 text-zinc-700" />
              </button>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Content Review</h3>
                <span className="text-sm text-zinc-500 font-medium">
                  {selectedContentIndex + 1} of {content.length}
                </span>
                {getStatusBadge(selectedContent.status)}
              </div>
              <button
                onClick={() => {
                  setSelectedContent(null);
                  setSelectedContentIndex(-1);
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div 
                key={selectedContent.id} 
                className="prose prose-zinc max-w-none animate-fadeIn"
              >
                <div className="whitespace-pre-wrap text-base text-zinc-700 leading-relaxed">
                  {selectedContent.content_text}
                </div>
              </div>
              
              {selectedContent.hashtags && selectedContent.hashtags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-200">
                  <p className="text-sm font-medium text-zinc-600 mb-3">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Bar - Fixed at Bottom */}
            <div className="border-t border-zinc-200 p-6 bg-zinc-50">
              <div className="flex items-center justify-center">
                <ClientApprovalActionBar
                  onApprove={() => handleApprove(selectedContent)}
                  onDecline={() => handleReject(selectedContent)}
                  onEdit={() => handleEdit(selectedContent)}
                  disableAll={processing === selectedContent.id}
                />
              </div>
              
              {/* Schedule info */}
              <div className="text-center mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">
                  ✅ Approved content will be automatically scheduled for posting
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approve;