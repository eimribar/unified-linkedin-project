import { useMemo, useState, useEffect } from "react";
import SwipeCard from "@/components/swipe/SwipeCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Hash,
  Sparkles,
  TrendingUp,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PostItem {
  id: string;
  text: string;
  author?: string;
  tags?: string[];
  scheduledDate?: string;
  image?: string;
  category?: string;
  engagement?: string;
}

const initialPosts: PostItem[] = [
  {
    id: "1",
    text: `🚀 Just shipped a feature that cut our load time by 70%.

The secret? We stopped trying to be clever.

Instead of building a complex caching layer with Redis, Kafka, and a custom invalidation strategy, we just... pre-computed the data at build time.

Sometimes the best solution is the boring one.

Your users don't care about your architecture. They care about speed.

What "clever" solution are you maintaining that could be replaced with something simple?`,
    tags: ["ProductDevelopment", "Engineering", "Simplicity", "Performance"],
    category: "Technical Insight",
    engagement: "High",
    scheduledDate: "Tomorrow, 9:00 AM"
  },
  {
    id: "2",
    text: `Unpopular opinion: Most user research is procrastination in disguise.

You don't need 50 interviews to know if your checkout flow is broken.
You don't need a focus group to see users dropping off.
You don't need personas when you have real usage data.

Ship something small. Watch what happens. Iterate.

The best insights come from production, not PowerPoints.

(Yes, research has its place. But it's not a substitute for shipping.)`,
    tags: ["ProductManagement", "UserResearch", "ShipIt", "Data"],
    category: "Contrarian Take",
    engagement: "Very High",
    scheduledDate: "Thursday, 11:30 AM"
  },
  {
    id: "3",
    text: `From 0 to 40% DAU in 3 months. Here's what actually moved the needle:

Week 1-4: Killed 6 features nobody used
→ 15% faster load time
→ 8% increase in engagement

Week 5-8: Made the onboarding 80% shorter
→ 3x completion rate
→ 12% increase in DAU

Week 9-12: Added ONE feature power users begged for
→ 90% feature adoption
→ Rest is history

The lesson? Subtraction before addition. Always.`,
    tags: ["Growth", "ProductStrategy", "Metrics", "StartupLessons"],
    category: "Success Story",
    engagement: "Very High",
    scheduledDate: "Friday, 8:00 AM"
  },
  {
    id: "4",
    text: `Your daily reminder that "AI-powered" is becoming the new "blockchain-enabled" 🤖

If your product needs to advertise that it uses AI, you're already losing.

The best AI products don't talk about AI. They talk about outcomes:
• "Write better emails in half the time"
• "Never miss an important contract clause"
• "Turn your sketches into production designs"

AI should be invisible infrastructure, not a marketing badge.

What do you think—are we past peak "AI-washing" yet?`,
    tags: ["AI", "ProductMarketing", "Technology", "FutureOfWork"],
    category: "Industry Commentary",
    engagement: "Medium",
    scheduledDate: "Monday, 2:00 PM"
  }
];

const SwipeDeck = () => {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [current, setCurrent] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<'direct' | 'ai'>('direct');
  const [draftText, setDraftText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [draftSchedule, setDraftSchedule] = useState("");
  const [approvedCount, setApprovedCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);

  const total = posts.length;
  const active = posts[current];
  const hasNext = current < total - 1;
  const hasPrev = current > 0;

  const progress = useMemo(() => ((current + 1) / Math.max(1, total)) * 100, [current, total]);

  const moveNext = () => {
    if (hasNext) {
      setCurrent((i) => i + 1);
    } else {
      confetti({ 
        particleCount: 200, 
        spread: 90, 
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6']
      });
      toast.success("🎉 All posts reviewed!", {
        description: `${approvedCount} approved, ${declinedCount} need revision`
      });
    }
  };

  const movePrev = () => {
    if (hasPrev) setCurrent((i) => i - 1);
  };

  const approve = () => {
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        <div>
          <div className="font-medium">Approved!</div>
          <div className="text-xs opacity-90">Scheduled for {active?.scheduledDate || 'later'}</div>
        </div>
      </div>
    );
    setApprovedCount(c => c + 1);
    
    // Mini celebration every 3 approvals
    if ((approvedCount + 1) % 3 === 0) {
      confetti({ 
        particleCount: 50, 
        spread: 45, 
        startVelocity: 20,
        origin: { x: 0.5, y: 0.5 }
      });
    }
    
    moveNext();
  };

  const decline = () => {
    toast.error(
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4" />
        <div>
          <div className="font-medium">Needs revision</div>
          <div className="text-xs opacity-90">Moved back to drafts</div>
        </div>
      </div>
    );
    setDeclinedCount(c => c + 1);
    moveNext();
  };

  const openEdit = () => {
    setDraftText(active?.text ?? "");
    setDraftTags(active?.tags ?? []);
    setDraftSchedule(active?.scheduledDate ?? "");
    setAiPrompt("");
    setEditMode('direct');
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (editMode === 'direct') {
      setPosts((list) => 
        list.map((p, i) => 
          i === current 
            ? { ...p, text: draftText, tags: draftTags, scheduledDate: draftSchedule } 
            : p
        )
      );
      setEditOpen(false);
      toast.success("Changes saved ✨");
    } else {
      // AI mode - in production, this would call an API
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            // Simulate AI processing
            setPosts((list) => 
              list.map((p, i) => 
                i === current 
                  ? { ...p, text: draftText + "\n\n[AI would modify based on: " + aiPrompt + "]" } 
                  : p
              )
            );
            resolve(true);
          }, 1500);
        }),
        {
          loading: 'AI is revising your post...',
          success: 'Post revised successfully!',
          error: 'Failed to revise post',
        }
      );
      setEditOpen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editOpen) return;
      const key = e.key.toLowerCase();
      if (key === "arrowright" || key === "a") approve();
      if (key === "arrowleft" || key === "d") decline();
      if (key === "e") openEdit();
      if (key === "," && hasPrev) movePrev();
      if (key === "." && hasNext) moveNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editOpen, current, hasNext, hasPrev]);

  if (!active) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">All caught up!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've reviewed all pending posts. Great job!
          </p>
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="w-px bg-gray-200 dark:bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{declinedCount}</div>
              <div className="text-sm text-gray-500">Need Revision</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Progress and stats bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Post {current + 1} of {total}
            </span>
            {active.category && (
              <Badge variant="secondary" className="text-xs">
                {active.category}
              </Badge>
            )}
            {active.engagement && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  active.engagement === "Very High" ? "border-green-500 text-green-600" :
                  active.engagement === "High" ? "border-blue-500 text-blue-600" :
                  "border-gray-400 text-gray-600"
                }`}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {active.engagement} engagement
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{active.scheduledDate}</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          <SwipeCard
            text={active.text}
            author={active.author}
            tags={active.tags}
            scheduledDate={active.scheduledDate}
            image={active.image}
            onSwipe={(dir) => {
              if (dir === "right") approve();
              if (dir === "left") decline();
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Action buttons - beautiful and accessible */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center justify-center gap-4">
          {/* Previous button */}
          <Button
            variant="outline"
            size="icon"
            onClick={movePrev}
            disabled={!hasPrev}
            className="rounded-full w-12 h-12"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Main actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={decline}
              className="rounded-full px-8 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950"
            >
              <XCircle className="w-5 h-5 mr-2 text-red-600" />
              Decline
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={openEdit}
              className="rounded-full px-8 border-purple-200 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-900 dark:hover:bg-purple-950"
            >
              <Edit3 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Edit
            </Button>

            <Button
              size="lg"
              onClick={approve}
              className="rounded-full px-8 bg-gradient-brand hover:opacity-90 text-white shadow-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Approve
            </Button>
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="icon"
            onClick={moveNext}
            disabled={!hasNext}
            className="rounded-full w-12 h-12"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs">A</kbd>
              Approve
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs">D</kbd>
              Decline
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs">E</kbd>
              Edit
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs">←→</kbd>
              Swipe
            </span>
          </div>
        </div>
      </div>

      {/* Edit dialog with dual modes */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          
          {/* Mode selector */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <Button
              variant={editMode === 'direct' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditMode('direct')}
              className={editMode === 'direct' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Direct Edit
            </Button>
            <Button
              variant={editMode === 'ai' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditMode('ai')}
              className={editMode === 'ai' ? 'bg-white dark:bg-zinc-900 shadow-sm' : ''}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Revision
            </Button>
          </div>

          {editMode === 'direct' ? (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="post-content">Content</Label>
                <Textarea
                  id="post-content"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="min-h-[300px] mt-2 font-mono text-sm"
                  placeholder="Write your LinkedIn post..."
                />
                <div className="mt-2 text-right text-xs text-gray-500">
                  {draftText.length} / 3000 characters
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Hashtags</Label>
                <Input
                  id="tags"
                  value={draftTags.join(", ")}
                  onChange={(e) => setDraftTags(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                  placeholder="Enter hashtags separated by commas"
                  className="mt-2"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {draftTags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  value={draftSchedule}
                  onChange={(e) => setDraftSchedule(e.target.value)}
                  placeholder="e.g., Tomorrow, 9:00 AM"
                  className="mt-2"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Current Post</Label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
                  <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {active?.text}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="ai-prompt">What would you like to change?</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[120px] mt-2"
                  placeholder="Examples:\n• Make it shorter and more punchy\n• Add more statistics and data\n• Make it more conversational\n• Focus more on the benefits\n• Add a call-to-action at the end"
                />
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-purple-900 dark:text-purple-100">AI-Powered Revision</p>
                    <p className="text-purple-700 dark:text-purple-300 mt-1">
                      Describe your changes in natural language, and AI will revise the post while maintaining your voice and style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              className="bg-gradient-brand text-white"
              disabled={editMode === 'ai' && !aiPrompt.trim()}
            >
              {editMode === 'direct' ? (
                <><Edit3 className="w-4 h-4 mr-2" /> Save Changes</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Apply AI Revision</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwipeDeck;