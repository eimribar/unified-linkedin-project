// =====================================================
// APPROVAL CARD COMPONENT
// Beautiful card design for content approval
// Supports swipe gestures and touch interactions
// =====================================================

import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Edit2, 
  Clock, 
  Hash,
  Sparkles,
  Building,
  Calendar,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

interface ApprovalCardProps {
  content: GeneratedContent;
  clientName?: string;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  isProcessing?: boolean;
  className?: string;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({
  content,
  clientName,
  onApprove,
  onReject,
  onEdit,
  isProcessing = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Swipe gesture handling
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // Minimum distance for swipe
    const velocity = 0.5; // Minimum velocity
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      if (info.offset.x > 0) {
        // Swiped right - approve
        onApprove();
      } else {
        // Swiped left - reject
        onReject();
      }
    }
    
    setIsDragging(false);
    setDragDirection(null);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 20) {
      setDragDirection(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  // Estimate reading time
  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, rotate: isDragging ? (dragDirection === 'right' ? 5 : -5) : 0 }}
      animate={{
        x: 0,
        rotate: 0,
        scale: 1
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300
      }}
    >
      {/* Swipe indicators */}
      {isDragging && (
        <>
          <motion.div
            className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-start pl-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: dragDirection === 'right' ? 1 : 0 }}
          >
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="w-8 h-8" />
              <span className="text-xl font-bold">Approve</span>
            </div>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-end pr-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: dragDirection === 'left' ? 1 : 0 }}
          >
            <div className="flex items-center gap-3 text-red-700">
              <span className="text-xl font-bold">Reject</span>
              <XCircle className="w-8 h-8" />
            </div>
          </motion.div>
        </>
      )}

      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-zinc-100 text-zinc-700 font-semibold">
                  {clientName ? clientName.charAt(0).toUpperCase() : 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-zinc-900">
                  {clientName || 'Client'}
                </p>
                <p className="text-sm text-zinc-500">
                  {formatDate(content.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                v{content.variant_number}
              </Badge>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* AI Provider Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {content.llm_provider.charAt(0).toUpperCase() + content.llm_provider.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {estimateReadingTime(content.content_text)} min read
            </Badge>
          </div>
        </div>

        <CardContent className="px-6 pb-6">
          {/* Hook */}
          {content.hook && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="font-semibold text-zinc-900 mb-1">🎯 Hook</p>
              <p className="text-zinc-700">{content.hook}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="mb-6">
            <div className="prose max-w-none">
              <p className="text-zinc-800 leading-relaxed whitespace-pre-line">
                {content.content_text}
              </p>
            </div>
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {content.hashtags.slice(0, 5).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    {tag.replace('#', '')}
                  </Badge>
                ))}
                {content.hashtags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{content.hashtags.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Engagement Preview */}
          <div className="mb-6 p-4 bg-zinc-50 rounded-xl">
            <p className="text-sm font-medium text-zinc-700 mb-3">📊 Expected Engagement</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-zinc-600">
                <Heart className="w-4 h-4" />
                <span>45-89 likes</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600">
                <MessageCircle className="w-4 h-4" />
                <span>12-25 comments</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600">
                <Share className="w-4 h-4" />
                <span>5-12 shares</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onReject}
              variant="outline"
              size="lg"
              disabled={isProcessing}
              className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Reject
            </Button>
            
            <Button
              onClick={onEdit}
              variant="outline"
              size="lg"
              disabled={isProcessing}
              className="px-6"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={onApprove}
              size="lg"
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Approve
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Swipe Hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-400">
              💡 Swipe right to approve, left to reject
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApprovalCard;