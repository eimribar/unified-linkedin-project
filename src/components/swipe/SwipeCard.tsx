import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send,
  MoreHorizontal,
  Globe,
  CheckCircle,
  XCircle
} from "lucide-react";

interface SwipeCardProps {
  text: string;
  author?: string;
  onSwipe?: (direction: "left" | "right") => void;
  image?: string;
  tags?: string[];
  scheduledDate?: string;
}

const CHARACTER_LIMIT = 3000; // LinkedIn's actual limit

const SwipeCard = ({ text, author, onSwipe, image, tags, scheduledDate }: SwipeCardProps) => {
  const { user } = useAuth();
  const [isDragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  
  // Overlay opacities
  const approveOverlay = useTransform(x, [0, 100], [0, 0.3]);
  const declineOverlay = useTransform(x, [-100, 0], [0.3, 0]);
  
  // Icon scales for feedback
  const approveScale = useTransform(x, [0, 150], [0, 1.2]);
  const declineScale = useTransform(x, [-150, 0], [1.2, 0]);

  const handleDragEnd = (_: any, info: any) => {
    setDragging(false);
    if (info.offset.x > 120) {
      onSwipe?.("right");
    } else if (info.offset.x < -120) {
      onSwipe?.("left");
    }
  };

  const count = text.length;
  const progress = (count / CHARACTER_LIMIT) * 100;
  const remaining = CHARACTER_LIMIT - count;
  
  // Get user info
  const userName = user?.profile?.fullName || "Your Name";
  const userHeadline = user?.profile?.headline || "Your Headline";
  const userAvatar = user?.profile?.profilePic;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Format text with line breaks preserved
  const formattedText = text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ));

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Swipe indicators */}
      <div className="absolute inset-x-0 -top-12 flex justify-between px-20 pointer-events-none">
        <motion.div 
          style={{ scale: declineScale, opacity: declineScale }}
          className="flex items-center gap-2 text-red-500"
        >
          <XCircle className="w-6 h-6" />
          <span className="text-sm font-medium">Needs Revision</span>
        </motion.div>
        <motion.div 
          style={{ scale: approveScale, opacity: approveScale }}
          className="flex items-center gap-2 text-green-500"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="text-sm font-medium">Ready to Post</span>
        </motion.div>
      </div>

      <motion.div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ x, rotate, scale }}
        drag="x"
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        whileHover={{ scale: isDragging ? 1 : 1.01 }}
      >
        {/* LinkedIn-style card */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
          {/* Approval/Decline overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-green-500/20 pointer-events-none z-10" 
            style={{ opacity: approveOverlay }} 
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-l from-transparent to-red-500/20 pointer-events-none z-10" 
            style={{ opacity: declineOverlay }} 
          />

          {/* LinkedIn Post Header */}
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-gray-100 dark:ring-zinc-800">
                  {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userName}
                    </h3>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">1st</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {userHeadline}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Globe className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {scheduledDate || "Now"} • Public
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed">
              {formattedText}
            </div>
            
            {/* Hashtags */}
            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Image preview if provided */}
            {image && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img src={image} alt="Post attachment" className="w-full object-cover" />
              </div>
            )}
          </div>

          {/* LinkedIn-style engagement preview */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-[8px] text-white">👍</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-[8px] text-white">❤️</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-[8px] text-white">👏</span>
                    </div>
                  </div>
                  <span className="ml-1">Predicted: 150-200</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>~25 comments</span>
                <span>~10 reposts</span>
              </div>
            </div>
          </div>

          {/* Action buttons (visual only) */}
          <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-around">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1">
                <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Comment</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Repost</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1">
                <Send className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Send</span>
              </button>
            </div>
          </div>

          {/* Character count indicator */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="flex items-center gap-2">
              <div className="text-xs text-white">
                {remaining > 0 ? (
                  <span>{remaining} left</span>
                ) : (
                  <span className="text-red-400">{Math.abs(remaining)} over</span>
                )}
              </div>
              <div className="w-8 h-8 relative">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke={remaining > 500 ? "#10b981" : remaining > 0 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - Math.min(1, progress / 100))}`}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeCard;