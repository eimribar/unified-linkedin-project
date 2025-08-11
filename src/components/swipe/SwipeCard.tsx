import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
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
  
  // Get user info from authenticated context - fallback to Amnon Cohen sample
  const userName = user?.profile?.fullName || "Amnon Cohen";
  const userHeadline = user?.profile?.headline || "Product Leader | Innovation & Strategy | Impact & Goals (OKRs) | Coach & Mentor";
  const userAvatar = user?.profile?.profilePicHighQuality || user?.profile?.profilePic || "https://media.licdn.com/dms/image/v2/D4D03AQFVlSGlwEFO-w/profile-displayphoto-crop_800_800/B4DZfF1qBOHAAI-/0/1751370868423?e=1757548800&v=beta&t=rbBDnJfbwbw71odeLIVqwY39DJiK6HWrt7Uif0dfsjM";
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
        {/* Clean LinkedIn-style card */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
          {/* Approval/Decline overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-500/30 pointer-events-none z-10" 
            style={{ opacity: approveOverlay }} 
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-red-500/30 pointer-events-none z-10" 
            style={{ opacity: declineOverlay }} 
          />

          {/* LinkedIn Post Header */}
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Avatar className="w-12 h-12">
                  {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                  <AvatarFallback className="bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300">
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


        </div>
      </motion.div>
    </div>
  );
};

export default SwipeCard;