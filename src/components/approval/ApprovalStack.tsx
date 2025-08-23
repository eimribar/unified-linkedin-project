// =====================================================
// APPROVAL STACK COMPONENT
// Tinder-style card stack for content approval
// Mobile-first design with beautiful animations
// =====================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApprovalCard from './ApprovalCard';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Edit2,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';

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

interface ApprovalStackProps {
  content: GeneratedContent[];
  clientName?: string;
  onApprove: (item: GeneratedContent) => Promise<void>;
  onReject: (item: GeneratedContent) => Promise<void>;
  onEdit: (item: GeneratedContent) => void;
  className?: string;
}

const ApprovalStack: React.FC<ApprovalStackProps> = ({
  content,
  clientName,
  onApprove,
  onReject,
  onEdit,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: 'approve' | 'reject'; item: GeneratedContent } | null>(null);

  const currentItem = content[currentIndex];
  const hasNext = currentIndex < content.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleApprove = async () => {
    if (!currentItem || processing) return;
    
    setProcessing(true);
    try {
      await onApprove(currentItem);
      setLastAction({ type: 'approve', item: currentItem });
      moveToNext();
    } catch (error) {
      console.error('Error approving content:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentItem || processing) return;
    
    setProcessing(true);
    try {
      await onReject(currentItem);
      setLastAction({ type: 'reject', item: currentItem });
      moveToNext();
    } catch (error) {
      console.error('Error rejecting content:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = () => {
    if (!currentItem) return;
    onEdit(currentItem);
  };

  const moveToNext = () => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const moveToPrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(prev => prev - 1);
      setLastAction(null); // Clear last action when going back
    }
  };

  if (content.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] ${className}`}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">All caught up!</h3>
          <p className="text-zinc-600 mb-6">
            You've reviewed all available content. Great job on staying on top of your approvals!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Check back later for new content</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
          <span>Progress</span>
          <span>{currentIndex + 1} of {content.length}</span>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-zinc-900 to-zinc-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / content.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs text-zinc-500 uppercase tracking-wide">Approved</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{currentIndex}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-zinc-500 uppercase tracking-wide">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{content.length - currentIndex}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-zinc-500 uppercase tracking-wide">Quality</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">A+</p>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative mb-8" style={{ minHeight: '600px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.3
            }}
          >
            <ApprovalCard
              content={currentItem}
              clientName={clientName}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              isProcessing={processing}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next card preview (behind current) */}
        {hasNext && (
          <div className="absolute top-4 left-2 right-2 -z-10">
            <div className="bg-zinc-100 rounded-2xl h-32 opacity-50" />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={moveToPrevious}
          variant="outline"
          size="lg"
          disabled={!hasPrevious || processing}
          className="w-16 h-16 rounded-full border-2"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button
          onClick={handleReject}
          variant="outline"
          size="lg"
          disabled={processing}
          className="w-16 h-16 rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
        >
          <XCircle className="w-6 h-6" />
        </Button>

        <Button
          onClick={handleEdit}
          variant="outline"
          size="lg"
          disabled={processing}
          className="w-16 h-16 rounded-full border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600"
        >
          <Edit2 className="w-6 h-6" />
        </Button>

        <Button
          onClick={handleApprove}
          size="lg"
          disabled={processing}
          className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Last Action Indicator */}
      {lastAction && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`px-4 py-2 rounded-full shadow-lg ${
            lastAction.type === 'approve' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {lastAction.type === 'approve' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {lastAction.type === 'approve' ? 'Approved!' : 'Rejected!'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ApprovalStack;