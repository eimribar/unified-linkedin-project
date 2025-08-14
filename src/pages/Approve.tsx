import { useState, useEffect } from 'react';
import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { generatedContentService, scheduledPostsService, type GeneratedContent } from '@/services/database.service';
import { cn } from '@/lib/utils';

const Approve = () => {
  const { user } = useSupabaseAuth();
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    setLoading(true);
    console.log('🔄 Loading admin-approved content from database...');
    console.log('Current user:', user);
    console.log('User authenticated:', !!user);
    
    try {
      // Get ALL content that's been approved by admin (no client filter for testing)
      const allContent = await generatedContentService.getAllAdminApproved();
      
      console.log('✅ Admin-approved content fetched:', allContent);
      console.log('📊 Number of items:', allContent.length);
      if (allContent.length > 0) {
        console.log('First item status:', allContent[0].status);
        console.log('First item preview:', allContent[0].content_text?.substring(0, 100) + '...');
      } else {
        console.log('⚠️ No admin-approved content found!');
        console.log('Make sure to approve some content in the Ghostwriter Portal first.');
      }
      
      setContent(allContent);
      setCurrentIndex(0);
    } catch (error) {
      console.error('❌ Error loading content:', error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const currentContent = content[currentIndex];
    if (!currentContent) return;
    
    console.log('Approving content:', currentContent.id);
    setProcessing(true);
    try {
      // Update status to client_approved
      console.log('Updating content status to client_approved...');
      const updateSuccess = await generatedContentService.update(currentContent.id, {
        status: 'client_approved',
        approved_at: new Date().toISOString() as any,
        approved_by: user?.id || 'client'
      });
      
      console.log('Update success:', updateSuccess);
      
      // Auto-schedule for next available slot
      const scheduledFor = new Date();
      scheduledFor.setDate(scheduledFor.getDate() + 1);
      scheduledFor.setHours(10, 0, 0, 0);
      
      console.log('Scheduling post for:', scheduledFor);
      const scheduleResult = await scheduledPostsService.schedule(
        currentContent.id,
        currentContent.client_id || 'no-client', // Use content's client_id or default
        scheduledFor,
        'linkedin'
      );
      
      console.log('Schedule result:', scheduleResult);
      
      // Move to next content
      if (currentIndex < content.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reload if we're at the end
        await loadPendingContent();
      }
    } catch (error) {
      console.error('Error approving content:', error);
      alert('Failed to approve content. Check console for details.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const currentContent = content[currentIndex];
    if (!currentContent) return;
    
    setProcessing(true);
    try {
      const reason = prompt('Why are you rejecting this content? (optional)');
      
      await generatedContentService.update(currentContent.id, {
        status: 'client_rejected',
        revision_notes: reason || 'Rejected by client'
      });
      
      // Move to next content
      if (currentIndex < content.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        await loadPendingContent();
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentContent = content[currentIndex];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <SEO
        title="Approve Content – LinkedIn Content Engine"
        description="Review and approve your LinkedIn content before it goes live."
        canonicalPath="/approve"
      />
      <NavBar />
      
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Content Approval</h1>
          <p className="mt-4 text-base md:text-lg text-zinc-600 max-w-2xl">
            Review and approve content prepared by your ghostwriter
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Clock className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-xl">
            <CheckCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900">All caught up!</h3>
            <p className="text-zinc-600 mt-2">No content pending your approval</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {currentIndex + 1} of {content.length} posts to review
              </span>
              <div className="flex gap-1">
                {content.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index === currentIndex ? "bg-zinc-900" : "bg-zinc-200"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    Pending Your Approval
                  </span>
                  <span className="text-xs text-zinc-500">
                    Created {new Date(currentContent.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="prose prose-zinc max-w-none">
                  <p className="whitespace-pre-wrap text-zinc-800 leading-relaxed">
                    {currentContent.content_text}
                  </p>
                </div>

                {currentContent.hashtags && currentContent.hashtags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {currentContent.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-sm px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  currentIndex === 0
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Schedule
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === content.length - 1}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  currentIndex === content.length - 1
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Schedule Info */}
            <div className="text-center p-4 bg-zinc-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>Approved content will be automatically scheduled for posting</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Approve;