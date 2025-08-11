import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Lightbulb,
  ArrowRight,
  Hash,
  Clock,
  Star,
  CheckCircle
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEO
        title={`${userName} – Content Strategy`}
        description={`Personalized LinkedIn content strategy for ${userName}`}
        canonicalPath="/strategy"
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-4 pt-8 pb-16"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Content Strategy for {userName}, {userJobTitle}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </motion.header>

        {/* Core Narrative */}
        <motion.section variants={itemVariants} className="mb-12">
          <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-zinc-900 dark:to-zinc-800">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-lg">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3">Core Narrative</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ex-Microsoft PM who learned the hard way that simple beats complex. Ships daily at Bounce AI. 
                  Believes in data over opinions.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Content Pillars */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-yellow-500" />
            Content Pillars + Unique Angles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Product Leadership",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "from-blue-500 to-cyan-500",
                topics: [
                  "Why I killed our personalization engine (failure story)",
                  "The 'mom test' for every feature decision",
                  "How we went from 0 to 40% DAU in 3 months",
                  "My scoring framework that says 'no' to 70% of features"
                ]
              },
              {
                title: "Team & Culture",
                icon: <Users className="w-5 h-5" />,
                color: "from-green-500 to-emerald-500",
                topics: [
                  "Why our engineers talk directly to customers",
                  "Breaking down the wall between product and engineering",
                  "How we replaced 50-page PRDs with 5 bullet points",
                  "The day our backend engineer fixed a bug live on a customer call"
                ]
              },
              {
                title: "AI Industry",
                icon: <Zap className="w-5 h-5" />,
                color: "from-purple-500 to-pink-500",
                topics: [
                  "AI will be invisible in 3 years (here's why)",
                  "Stop advertising 'AI-powered' - it's already cringe",
                  "Why simple UX beats fancy AI features",
                  "The real AI moat isn't technology"
                ]
              },
              {
                title: "Product Craft",
                icon: <Target className="w-5 h-5" />,
                color: "from-orange-500 to-red-500",
                topics: [
                  "User research is overrated (controversial take)",
                  "Production data > 100 user interviews",
                  "Ship in 2 weeks or kill it",
                  "Why building for power users ruins products"
                ]
              },
              {
                title: "Career Growth",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "from-indigo-500 to-purple-500",
                topics: [
                  "My $10M mistake taught me this",
                  "From Microsoft bureaucracy to startup speed",
                  "How to align engineering and sales (without losing your mind)",
                  "Why PMs hide behind research"
                ]
              },
              {
                title: "Bounce AI Stories",
                icon: <Star className="w-5 h-5" />,
                color: "from-yellow-500 to-orange-500",
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
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className={`h-1 w-full bg-gradient-to-r ${pillar.color} rounded-full mb-4`} />
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${pillar.color} text-white`}>
                      {pillar.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {pillar.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Weekly Content Mix */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-500" />
            Weekly Content Mix
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: "Monday", type: "Contrarian Take", example: "User interviews are overrated. Here's what I do instead..." },
              { day: "Tuesday", type: "How-To", example: "My framework for saying no to 70% of feature requests" },
              { day: "Wednesday", type: "Story Time", example: "I wasted 6 months and $2M. Here's what I learned" },
              { day: "Thursday", type: "Bounce AI Win", example: "Our customer saved 15 hrs/week. Not from AI, from simplicity" },
              { day: "Friday", type: "Industry Prediction", example: "In 2027, 'AI-powered' will sound as dated as 'cyber' does now" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="h-full p-4 border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.day}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{item.type}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{item.example}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Hook Templates */}
        <motion.section variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-green-500" />
            Hook Templates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "The Failure Hook",
                template: "I built a feature nobody wanted. 6 months. 2% adoption. Here's what I learned:",
                color: "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
              },
              {
                name: "The Contrarian Hook",
                template: "Everyone says 'talk to users.' I say watch the data. Here's why:",
                color: "border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20"
              },
              {
                name: "The Comparison Hook",
                template: "Microsoft: 50-page PRDs. Bounce AI: 5 bullet points. Guess who ships faster?",
                color: "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20"
              },
              {
                name: "The Simple Truth Hook",
                template: "If you can't explain it to your mom, don't build it.",
                color: "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20"
              },
              {
                name: "The Metric Hook",
                template: "0 to 40% daily active users in 3 months. One simple change:",
                color: "border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/20"
              }
            ].map((hook, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`p-5 border-2 ${hook.color}`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    {hook.name}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 italic">"{hook.template}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Monthly Themes & Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Themes */}
          <motion.section variants={itemVariants}>
            <Card className="p-6 h-full border-0 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Monthly Themes
              </h3>
              <div className="space-y-3">
                {[
                  { month: "Month 1", theme: "Simplicity beats complexity", focus: "her core belief" },
                  { month: "Month 2", theme: "Speed over perfection", focus: "shipping philosophy" },
                  { month: "Month 3", theme: "Data over opinions", focus: "decision making" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2" />
                    <div>
                      <div className="font-medium">{item.month}: {item.theme}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">({item.focus})</div>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
                  Repeat with new stories/angles
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Natural Integration */}
          <motion.section variants={itemVariants}>
            <Card className="p-6 h-full border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Natural Bounce AI Integration
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">30%</div>
                  <div>
                    <div className="font-medium">Direct mentions</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Customer wins, culture, differentiation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">70%</div>
                  <div>
                    <div className="font-medium">Pure value</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Product advice, industry takes, lessons learned</div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-zinc-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Always position Bounce as the "simple" alternative in a complex AI world
                  </p>
                </div>
              </div>
            </Card>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.section variants={itemVariants} className="mt-12">
          <Card className="p-8 border-0 shadow-xl bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-100">
            <div className="text-center text-white dark:text-black">
              <h3 className="text-2xl font-bold mb-3">Ready to generate content?</h3>
              <p className="mb-6 opacity-90">Turn this strategy into actual LinkedIn posts</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 dark:border-black dark:text-black dark:hover:bg-black/10"
                >
                  View Ideas
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      </motion.main>
    </div>
  );
};

// Add missing import
import { Users } from "lucide-react";

export default Strategy;