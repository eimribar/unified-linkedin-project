import React from 'react';
import { animated } from '@react-spring/web';
import { Check, X, Edit3, Calendar, Hash, ChevronDown } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
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
}

interface SwipeableCardProps {
  content: GeneratedContent;
  onApprove: () => void;
  onDecline: () => void;
  onEdit: () => void;
  isTop?: boolean;
  style?: any;
  index?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  content,
  onApprove,
  onDecline,
  onEdit,
  isTop = false,
  style = {},
  index = 0
}) => {
  const { bind, style: swipeStyle, direction } = useSwipeGestures({
    onSwipeRight: onApprove,
    onSwipeLeft: onDecline,
    onSwipeUp: onEdit,
    threshold: 100
  });

  const [expanded, setExpanded] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <animated.div
      {...(isTop ? bind() : {})}
      style={{
        ...style,
        ...(isTop ? swipeStyle : {}),
        zIndex: 10 - index
      }}
      className={cn(
        "absolute inset-3 bg-white rounded-3xl shadow-2xl overflow-hidden",
        isTop ? "cursor-grab active:cursor-grabbing" : ""
      )}
    >
      {/* Swipe Direction Overlays */}
      {isTop && (
        <>
          {/* Approve Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-green-400/90 to-green-600/90 flex items-center justify-center transition-opacity duration-200 pointer-events-none z-20",
            direction === 'right' ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="text-white">
              <Check className="w-24 h-24 mx-auto mb-4" strokeWidth={3} />
              <p className="text-3xl font-bold">APPROVE</p>
            </div>
          </div>

          {/* Decline Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-red-400/90 to-red-600/90 flex items-center justify-center transition-opacity duration-200 pointer-events-none z-20",
            direction === 'left' ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="text-white">
              <X className="w-24 h-24 mx-auto mb-4" strokeWidth={3} />
              <p className="text-3xl font-bold">DECLINE</p>
            </div>
          </div>

          {/* Edit Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-blue-400/90 to-blue-600/90 flex items-center justify-center transition-opacity duration-200 pointer-events-none z-20",
            direction === 'up' ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="text-white">
              <Edit3 className="w-24 h-24 mx-auto mb-4" strokeWidth={3} />
              <p className="text-3xl font-bold">EDIT</p>
            </div>
          </div>
        </>
      )}

      {/* Card Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-zinc-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                {formatDate(content.created_at)}
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                Variant {content.variant_number}
              </span>
            </div>
            {content.hashtags && content.hashtags.length > 0 && (
              <span className="text-xs text-zinc-500">
                {content.hashtags.length} tags
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className={cn(
            "text-zinc-800 leading-relaxed whitespace-pre-wrap transition-all",
            expanded ? "text-base" : "text-lg line-clamp-[12]"
          )}>
            {content.content_text}
          </div>

          {/* Expand/Collapse for long content */}
          {content.content_text.length > 500 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium"
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expanded ? "rotate-180" : ""
              )} />
            </button>
          )}

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && expanded && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Instructions (only for top card) */}
        {isTop && (
          <div className="px-6 py-4 border-t bg-gradient-to-r from-zinc-50 to-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-1">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs text-zinc-500">Swipe Left</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-zinc-500">Swipe Up</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-zinc-500">Swipe Right</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </animated.div>
  );
};