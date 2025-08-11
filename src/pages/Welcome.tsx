import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  const handleStart = () => {
    navigate('/onboarding');
  };

  const userName = user?.profile?.fullName || user?.email?.split('@')[0] || "there";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SEO 
        title="Welcome – LinkedIn Content Engine" 
        description="Welcome to your personalized LinkedIn content journey" 
        canonicalPath="/welcome" 
      />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-brand-soft flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-foreground/70" />
            </div>
          </motion.div>

          {/* Welcome text */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Welcome, {userName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            Let's create your unique LinkedIn voice. We'll ask you 10 quick questions 
            about your experiences, beliefs, and vision. Your answers will shape 
            a content strategy that's authentically you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              This takes about 5 minutes
            </div>

            <Button
              onClick={handleStart}
              size="lg"
              className="px-8 py-6 text-base"
            >
              Let's Begin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-brand" />
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Welcome;