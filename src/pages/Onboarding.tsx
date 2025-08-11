import SEO from "@/components/seo/SEO";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
const QUESTIONS = [{
  id: 1,
  prompt: "Tell us about a big win (project/achievement you're proud of)"
}, {
  id: 2,
  prompt: "Share a failure/mistake that taught you something important"
}, {
  id: 3,
  prompt: "What's the hardest problem you've solved in your career?"
}, {
  id: 4,
  prompt: "What's your contrarian take that most people in your field disagree with?"
}, {
  id: 5,
  prompt: "What principle/rule do you always follow that others should know?"
}, {
  id: 6,
  prompt: "What common advice in your field is actually terrible?"
}, {
  id: 7,
  prompt: "What surprised you most about joining Bounce AI?"
}, {
  id: 8,
  prompt: "What are we doing differently here that you haven't seen elsewhere?"
}, {
  id: 9,
  prompt: "Describe a recent 'aha moment' working on our product/team"
}, {
  id: 10,
  prompt: "What will your industry/field look like in 3 years?"
}];
const Onboarding = () => {
  const total = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(total).fill(""));
  const [xp, setXp] = useState(0);
  const confettiRef = useRef<ConfettiRef>(null);
  const current = useMemo(() => QUESTIONS[step], [step]);
  const completed = useMemo(() => answers.filter(a => a.trim().length > 0).length, [answers]);
  const percent = useMemo(() => Math.round(completed / total * 100), [completed, total]);
  const examples = useMemo(() => {
    switch (current.id) {
      case 1:
        return ["Shipped X in 6 weeks and grew Y%.", "Closed a $Z deal with a 2-person team.", "Reduced costs by 20% via automation."];
      case 2:
        return ["Launched too early; learned to validate first.", "Missed a deadline, then fixed scope and cadence.", "Picked the wrong stack and refactored in a week."];
      case 3:
        return ["Built a caching layer that cut latency by 80%.", "Refactored legacy code to unblock scaling.", "Optimized a job from 1h to 5m with batching."];
      case 4:
        return ["Meetings are overrated without written context.", "Velocity beats perfect specs in most cases.", "Docs-first > tickets-first for alignment."];
      case 5:
        return ["Default to simple architectures.", "Measure before optimizing anything.", "Write code others can delete easily."];
      case 6:
        return ["100% coverage often slows teams.", "After X complexity, rewrite beats patching.", "MVPs shouldn't look perfect—ship learnings."];
      case 7:
        return ["How fast we ship surprised me.", "The no-meeting blocks are real.", "Feedback cycles are hours, not days."];
      case 8:
        return ["Ownership feels different here.", "We prototype in prod safely.", "Design and eng pair weekly."];
      case 9:
        return ["Users loved Y, not X—data revealed it.", "A small toggle changed adoption.", "We found a hidden power-user segment."];
      case 10:
        return ["Agents will handle 80% of workflows.", "Tooling becomes outcomes APIs.", "Open models win via ecosystem."];
      default:
        return ["Share your answer...", "Keep it concise (1–2 sentences)", "Press Enter to submit"];
    }
  }, [current.id]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector("input[type='text']") as HTMLInputElement | null;
    const val = input?.value?.trim();
    if (!val) return;
    setAnswers(prev => {
      const next = [...prev];
      next[step] = val;
      return next;
    });
    setXp(x => x + 10);
    if (confettiRef.current) {
      confettiRef.current.fire({
        particleCount: 120,
        spread: 60,
        startVelocity: 35,
      });
    } else {
      confetti({
        particleCount: 120,
        spread: 60,
        startVelocity: 35,
        zIndex: 9999,
      });
    }

    // Advance with a smooth transition small delay to let vanish effect start
    setTimeout(() => {
      if (step < total - 1) setStep(s => s + 1);
    }, 150);
  };
  return <div className="relative min-h-screen bg-background text-foreground">
      <SEO title="Onboarding – Story Questions" description="Answer premium one-by-one prompts to shape your narrative." canonicalPath="/onboarding" />

      {/* Confetti Canvas Overlay */}
      <Confetti ref={confettiRef} manualstart className="pointer-events-none fixed inset-0 z-[9999]" />

      <header className="fixed top-0 inset-x-0 z-20 px-4 py-3">
        <div className="mx-auto w-full max-w-2xl">
          <Progress value={percent} aria-label="Onboarding progress" className="h-1.5" />
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-14 -mt-6 sm:-mt-8">
        {/* Headline shows the current question (1:1 minimal) */}
        <AnimatePresence mode="wait">
          <motion.h1 key={current.id} initial={{
          opacity: 0,
          y: 8
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -8
        }} transition={{
          duration: 0.25,
          ease: "easeOut"
        }} className="mb-4 sm:mb-8 text-3xl font-semibold tracking-tight text-center sm:text-3xl text-gradient-brand mx-0 px-0 py-[30px]">
            {current.prompt}
          </motion.h1>
        </AnimatePresence>

        {/* Input form with the custom vanish animation */}
        <section className="w-full max-w-2xl -mt-1 sm:-mt-2 md:-mt-3">
          <PlaceholdersAndVanishInput placeholders={examples} onChange={() => {}} onSubmit={handleSubmit} />

          {/* Controls: Back and Skip */}
          <nav className="mt-3 flex items-center justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="py-[30px]">
              Back
            </Button>
            <Button type="button" variant="outline" onClick={() => {
            if (step < total - 1) setStep(s => s + 1);
          }} className="py-[30px]">
              Skip
            </Button>
          </nav>
        </section>
        <aside className="fixed bottom-6 inset-x-0 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-border bg-card/80 supports-[backdrop-filter]:bg-card/60 backdrop-blur shadow-sm text-xs sm:text-sm">
            <Trophy className="h-4 w-4 text-foreground/70" />
            <span>{xp} XP</span>
          </div>
        </aside>
      </main>
    </div>;
};
export default Onboarding;