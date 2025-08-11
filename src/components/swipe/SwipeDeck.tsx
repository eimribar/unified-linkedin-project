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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface PostItem {
  id: string;
  text: string;
  author?: string;
}

const initialPosts: PostItem[] = [
  {
    id: "1",
    text:
      "Consistency compounds. Ship one improvement daily and share the why. That momentum becomes your personal brand.",
    author: "@you",
  },
  {
    id: "2",
    text:
      "Design for clarity, then add taste. Clean structure outperforms clever copy. Readers reward signal over noise.",
    author: "@you",
  },
  {
    id: "3",
    text:
      "Your unfair advantage: showing your work. Document > perform. People trust the builders they can see.",
    author: "@you",
  },
];

const SwipeDeck = () => {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [current, setCurrent] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  const total = posts.length;
  const active = posts[current];

  const progress = useMemo(() => ((current) / Math.max(1, total)) * 100, [current, total]);

  const moveNext = () => {
    if (current < total - 1) setCurrent((i) => i + 1);
    else toast.success("All done — no more posts in the stack.");
  };

  const approve = () => {
    toast.success("Approved", { description: "Post moved to Schedule." });
    setXp((x) => x + 5);
    setStreak((s) => {
      const ns = s + 1;
      if (ns % 5 === 0) {
        confetti({ particleCount: 100, spread: 60, startVelocity: 35, zIndex: 9999 });
      }
      return ns;
    });
    moveNext();
  };

  const decline = () => {
    toast.error("Needs revision", { description: "Sent back to Drafts." });
    setStreak(0);
    moveNext();
  };

  const openEdit = () => {
    setDraftText(active?.text ?? "");
    setEditOpen(true);
  };

  const saveEdit = () => {
    setPosts((list) => list.map((p, i) => (i === current ? { ...p, text: draftText } : p)));
    setEditOpen(false);
    setXp((x) => x + 2);
    toast("Edited", { description: "Changes saved to this draft." });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editOpen) return;
      const key = e.key.toLowerCase();
      if (key === "arrowright" || key === "a") approve();
      if (key === "arrowleft" || key === "d") decline();
      if (key === "e") openEdit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editOpen]);
  if (!active) {
    return (
      <div className="elevation-1 bg-card rounded-2xl p-8 text-center">
        <h3 className="text-xl font-medium tracking-tight">No posts in the queue</h3>
        <p className="mt-2 text-sm text-muted-foreground">You're fully reviewed. Add more drafts to continue.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-[720px] mx-auto">
      <div className="border-gradient-brand rounded-2xl p-3 md:p-5">
        <SwipeCard
          text={active.text}
          author={active.author}
          onSwipe={(dir) => {
            if (dir === "right") approve();
            if (dir === "left") decline();
          }}
        />
        <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-1 bg-foreground/80" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {current + 1} / {total}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Button variant="destructive" size="pill" onClick={decline} aria-label="Request changes">
          Decline
        </Button>
        <Button variant="outline" size="pill" onClick={openEdit} aria-label="Edit">
          Edit
        </Button>
        <Button variant="premium" size="pill" onClick={approve} aria-label="Approve">
          Approve
        </Button>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Tip: Swipe → approve, ← decline. Press A/D to approve/decline and E to edit.
      </div>

      {/* XP pill bottom-center */}
      <div className="fixed inset-x-0 bottom-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto border-gradient-brand elevation-2 rounded-full px-3 py-1.5 text-xs bg-card">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="opacity-80" />
            <span className="font-medium">{xp} XP</span>
            {streak > 1 && <span className="text-muted-foreground">Streak {streak}</span>}
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit draft</DialogTitle>
          </DialogHeader>
          <Textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="min-h-[200px]"
            aria-label="Draft text"
          />
          <DialogFooter>
            <Button variant="soft" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="premium" onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwipeDeck;
