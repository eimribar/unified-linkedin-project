import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Lightbulb,
  ArrowRight,
  Clock,
  Star,
  CheckCircle,
  Sparkles
} from "lucide-react";

const Strategy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  // Get user's name or use placeholder
  const userName = user?.profile?.fullName || "Amnon Cohen";
  const userJobTitle = user?.profile?.jobTitle || "VP Product";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${userName} – Content Strategy`}
        description={`Personalized LinkedIn content strategy for ${userName}`}
        canonicalPath="/strategy"
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-6 pt-12 pb-20"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Content Strategy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userName}, {userJobTitle} at Bounce AI
          </p>
        </motion.header>

        {/* Core Narrative */}
        <motion.section variants={itemVariants} className="mb-20">
          <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-8 border border-gray-200 dark:border-zinc-800">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Core Narrative</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Ex-Microsoft PM who learned the hard way that simple beats complex. Ships daily at Bounce AI. 
                Believes in data over opinions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Content Pillars */}
        <motion.section variants={itemVariants} className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Content Pillars</h2>
            <p className="text-gray-600 dark:text-gray-400">Your unique angles and perspectives</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Product Leadership",
                icon: <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "Why I killed our personalization engine (failure story)",
                  "The 'mom test' for every feature decision",
                  "How we went from 0 to 40% DAU in 3 months",
                  "My scoring framework that says 'no' to 70% of features"
                ]
              },
              {
                title: "Team & Culture",
                icon: <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "Why our engineers talk directly to customers",
                  "Breaking down the wall between product and engineering",
                  "How we replaced 50-page PRDs with 5 bullet points",
                  "The day our backend engineer fixed a bug live on a customer call"
                ]
              },
              {
                title: "AI Industry",
                icon: <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "AI will be invisible in 3 years (here's why)",
                  "Stop advertising 'AI-powered' - it's already cringe",
                  "Why simple UX beats fancy AI features",
                  "The real AI moat isn't technology"
                ]
              },
              {
                title: "Product Craft",
                icon: <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "User research is overrated (controversial take)",
                  "Production data > 100 user interviews",
                  "Ship in 2 weeks or kill it",
                  "Why building for power users ruins products"
                ]
              },
              {
                title: "Career Growth",
                icon: <Lightbulb className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "My $10M mistake taught me this",
                  "From Microsoft bureaucracy to startup speed",
                  "How to align engineering and sales (without losing your mind)",
                  "Why PMs hide behind research"
                ]
              },
              {
                title: "Bounce AI Stories",
                icon: <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
                topics: [
                  "We ship to production daily (here's how)",
                  "Our customer saved 15 hours/week with one simple change",
                  "Why we reject 70% of feature requests",
                  "How Bounce AI makes AI invisible"
                ]
              }
            ].map((pillar, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-md bg-gray-100 dark:bg-zinc-800">
                      {pillar.icon}
                    </div>
                    <h3 className="font-semibold">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {pillar.topics.map((topic, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        • {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Weekly Content Mix */}
        <motion.section variants={itemVariants} className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Weekly Content Mix</h2>
            <p className="text-gray-600 dark:text-gray-400">Strategic posting schedule for maximum engagement</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: "Monday", type: "Contrarian Take", example: "User interviews are overrated. Here's what I do instead..." },
              { day: "Tuesday", type: "How-To", example: "My framework for saying no to 70% of feature requests" },
              { day: "Wednesday", type: "Story Time", example: "I wasted 6 months and $2M. Here's what I learned" },
              { day: "Thursday", type: "Bounce AI Win", example: "Our customer saved 15 hrs/week. Not from AI, from simplicity" },
              { day: "Friday", type: "Industry Prediction", example: "In 2027, 'AI-powered' will sound as dated as 'cyber' does now" }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-500 mb-1">{item.day}</div>
                <h4 className="font-medium mb-2">{item.type}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.example}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Hook Templates */}
        <motion.section variants={itemVariants} className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Hook Templates</h2>
            <p className="text-gray-600 dark:text-gray-400">Proven opening lines that capture attention</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Failure Story",
                template: "I built a feature nobody wanted. 6 months. 2% adoption. Here's what I learned:"
              },
              {
                name: "Contrarian Take",
                template: "Everyone says 'talk to users.' I say watch the data. Here's why:"
              },
              {
                name: "Comparison",
                template: "Microsoft: 50-page PRDs. Bounce AI: 5 bullet points. Guess who ships faster?"
              },
              {
                name: "Simple Truth",
                template: "If you can't explain it to your mom, don't build it."
              },
              {
                name: "Metric Hook",
                template: "0 to 40% daily active users in 3 months. One simple change:"
              }
            ].map((hook, index) => (
              <div key={index} className="p-5 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
                <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-500">
                  {hook.name}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{hook.template}"
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Monthly Themes & Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Monthly Themes */}
          <motion.section variants={itemVariants}>
            <div className="p-6 h-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-6">Monthly Themes</h3>
              <div className="space-y-3">
                {[
                  { month: "Month 1", theme: "Simplicity beats complexity", focus: "her core belief" },
                  { month: "Month 2", theme: "Speed over perfection", focus: "shipping philosophy" },
                  { month: "Month 3", theme: "Data over opinions", focus: "decision making" }
                ].map((item, i) => (
                  <div key={i} className="pb-3 mb-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                    <div className="font-medium mb-1">{item.month}</div>
                    <div className="text-gray-700 dark:text-gray-300">{item.theme}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.focus}</div>
                  </div>
                ))}
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  → Cycle themes with fresh perspectives
                </div>
              </div>
            </div>
          </motion.section>

          {/* Natural Integration */}
          <motion.section variants={itemVariants}>
            <div className="p-6 h-full bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-6">Bounce AI Integration</h3>
              <div className="space-y-3">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-2xl font-semibold">30%</span>
                      <span className="font-medium">Direct mentions</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer wins, culture, differentiation</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-2xl font-semibold">70%</span>
                      <span className="font-medium">Pure value</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Product advice, industry takes, lessons learned</p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800">
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                    Position Bounce as the simple alternative in a complex AI world
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.section variants={itemVariants}>
          <div className="border-t border-gray-200 dark:border-zinc-800 pt-12">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-3">Ready to create content?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Turn this strategy into LinkedIn posts that resonate</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gray-300 dark:border-zinc-700 px-8"
                >
                  View Examples
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

// Add missing import
import { Users } from "lucide-react";

export default Strategy;