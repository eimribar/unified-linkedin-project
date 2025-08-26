import React from 'react';
import { animated } from '@react-spring/web';
import { Check, X, Edit3, Calendar, Hash } from 'lucide-react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';

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

interface SwipeCardProps {
  content: GeneratedContent;
  onApprove: () => void;
  onDecline: () => void;
  onEdit: () => void;
  isTop?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  content,
  onApprove,
  onDecline,
  onEdit,
  isTop = false
}) => {
  const { bind, style, direction } = useSwipeGestures({
    onSwipeRight: onApprove,
    onSwipeLeft: onDecline, 
    onSwipeUp: onEdit,
    threshold: 120
  });

  return (
    <animated.div
      {...bind()}
      style={style}
      className={`absolute inset-4 bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden ${
        isTop ? 'z-20' : 'z-10 scale-95 opacity-80'
      } touch-pan-y`}
    >
      {/* Swipe Direction Indicators */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
        direction === 'right' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-green-500 text-white rounded-full p-6 shadow-xl">
          <Check size={48} />
        </div>
      </div>
      
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
        direction === 'left' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-red-500 text-white rounded-full p-6 shadow-xl">
          <X size={48} />
        </div>
      </div>

      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
        direction === 'up' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="bg-blue-500 text-white rounded-full p-6 shadow-xl">
          <Edit3 size={48} />
        </div>
      </div>

      {/* Content Area */}
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            {new Date(content.created_at).toLocaleDateString()}
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Variant {content.variant_number}
          </div>
        </div>

        {/* Hook Section */}
        {content.hook && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-sm text-yellow-800 font-medium">Hook</p>
            <p className="text-yellow-900 mt-1">{content.hook}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-lg">
              {content.content_text}
            </p>
          </div>
        </div>

        {/* Hashtags */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Swipe Instructions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-red-600" />
              </div>
              <span>Swipe Left</span>
              <span className="font-medium">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Edit3 size={16} className="text-blue-600" />
              </div>
              <span>Swipe Up</span>
              <span className="font-medium">Edit</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={16} className="text-green-600" />
              </div>
              <span>Swipe Right</span>
              <span className="font-medium">Approve</span>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};