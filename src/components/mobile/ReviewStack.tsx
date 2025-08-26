import React, { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { ActionBar } from './ActionBar';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

interface ReviewStackProps {
  content: GeneratedContent[];
  onApprove: (item: GeneratedContent) => void;
  onDecline: (item: GeneratedContent) => void;
  onEdit: (item: GeneratedContent) => void;
  loading?: boolean;
}

export const ReviewStack: React.FC<ReviewStackProps> = ({
  content,
  onApprove,
  onDecline,
  onEdit,
  loading = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ item: GeneratedContent; action: 'approve' | 'decline' | 'edit' }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentItem = content[currentIndex];
  const nextItem = content[currentIndex + 1];
  const remainingCount = content.length - currentIndex;

  const handleAction = async (action: 'approve' | 'decline' | 'edit') => {
    if (!currentItem || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Add to history for undo functionality
      setHistory(prev => [...prev, { item: currentItem, action }]);

      // Execute the action
      switch (action) {
        case 'approve':
          await onApprove(currentItem);
          break;
        case 'decline':
          await onDecline(currentItem);
          break;
        case 'edit':
          await onEdit(currentItem);
          break;
      }

      // Move to next item after a brief delay
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsProcessing(false);
      }, 300);

    } catch (error) {
      console.error('Error processing action:', error);
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    
    // Remove last action from history
    setHistory(prev => prev.slice(0, -1));
    
    // Go back to previous item
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  // Haptic feedback for mobile devices
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    // Reset index when content changes
    if (content.length > 0) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [content]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">
            No content to review right now. New posts will appear here when they're ready.
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= content.length) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Review complete!</h3>
          <p className="text-gray-600 mb-4">
            You've reviewed all {content.length} posts. Great work!
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Check for new content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Progress */}
      <div className="p-4 bg-white border-b border-gray-100 safe-area-top">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            <span className="font-medium text-gray-900">
              {currentIndex + 1} of {content.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{remainingCount} remaining</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex) / content.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Current Card */}
        {currentItem && (
          <SwipeCard
            key={currentItem.id}
            content={currentItem}
            onApprove={() => {
              triggerHaptic();
              handleAction('approve');
            }}
            onDecline={() => {
              triggerHaptic();
              handleAction('decline');
            }}
            onEdit={() => {
              triggerHaptic();
              handleAction('edit');
            }}
            isTop={true}
          />
        )}

        {/* Next Card (preview) */}
        {nextItem && (
          <div className="absolute inset-4 bg-white rounded-3xl shadow-lg scale-95 opacity-60 -z-10">
            <div className="h-full p-6 overflow-hidden">
              <div className="text-gray-400 text-sm mb-2">Next</div>
              <p className="text-gray-600 line-clamp-3">
                {nextItem.content_text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <ActionBar
        onApprove={() => {
          triggerHaptic();
          handleAction('approve');
        }}
        onDecline={() => {
          triggerHaptic();
          handleAction('decline');
        }}
        onEdit={() => {
          triggerHaptic();
          handleAction('edit');
        }}
        onUndo={handleUndo}
        canUndo={history.length > 0 && currentIndex > 0}
        disabled={isProcessing}
      />
    </div>
  );
};