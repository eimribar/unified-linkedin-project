import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, CheckCircle, Sparkles } from "lucide-react";

const WelcomeComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const confettiRef = useRef<ConfettiRef>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  // Fire confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.fire({
          particleCount: 200,
          spread: 90,
          startVelocity: 45,
          origin: { y: 0.6 }
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/profile');
  };

  const userName = user?.profile?.fullName || "Amnon Cohen";

  return (
    <div className="relative min-h-screen bg-white text-zinc-900">
      <SEO 
        title="Welcome to Your Portal – LinkedIn Content Engine" 
        description="Your personalized LinkedIn content portal is ready" 
        canonicalPath="/welcome-complete" 
      />

      {/* Confetti Canvas */}
      <Confetti ref={confettiRef} manualstart className="pointer-events-none fixed inset-0 z-[9999]" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* Trophy icon with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-zinc-900 flex items-center justify-center shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Congratulations text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Brilliant Work, {userName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            Your personalized content portal is ready. We've crafted a unique strategy 
            based on your experiences and vision. Time to start creating content 
            that truly resonates.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-border"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-900">10</div>
              <div className="text-sm text-zinc-600 mt-1">Stories Captured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-900">6</div>
              <div className="text-sm text-zinc-600 mt-1">Content Pillars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-900">∞</div>
              <div className="text-sm text-zinc-600 mt-1">Post Ideas</div>
            </div>
          </motion.div>

          {/* What's next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8 text-left bg-muted/30 rounded-lg p-6"
          >
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>View your complete LinkedIn profile and story</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Explore your personalized content strategy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Review and approve your content queue</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={handleContinue}
              className="px-8 py-4 text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Enter Your Portal
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Progress dots - all filled */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex justify-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-zinc-900" />
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <div className="w-2 h-2 rounded-full bg-zinc-400" />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default WelcomeComplete;