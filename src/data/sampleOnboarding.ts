export interface OnboardingQA {
  id: number;
  category: "Your Experiences" | "Your Beliefs" | "Your Bounce AI Story" | "Your Vision";
  question: string;
  answer: string;
}

export const sampleOnboarding: OnboardingQA[] = [
  {
    id: 1,
    category: "Your Experiences",
    question: "Big win",
    answer: `Launched a feature at my last startup that everyone said was too complex — a visual workflow builder for non-technical users. Went from 0 to 40% daily active usage in 3 months. Revenue jumped 3x.`,
  },
  {
    id: 2,
    category: "Your Experiences",
    question: "Failure/mistake",
    answer: `Built an entire personalization engine based on what I thought users wanted, not what data showed. 6 months wasted. Only 2% adoption. Now I ship MVPs in 2 weeks max and let users tell me what's wrong.`,
  },
  {
    id: 3,
    category: "Your Experiences",
    question: "Hardest problem",
    answer: `Getting engineering and sales aligned on the roadmap at a 500-person company. Engineers wanted technical excellence, sales wanted every custom feature. Created a scoring framework that made trade-offs transparent. Saved us from building 70% of requests.`,
  },
  {
    id: 4,
    category: "Your Beliefs",
    question: "Contrarian take",
    answer: `User research is overrated. Watching what users actually do in production data beats 100 user interviews. Most PMs hide behind research to avoid making hard decisions.`,
  },
  {
    id: 5,
    category: "Your Beliefs",
    question: "Principle/rule",
    answer: `If you can't explain the value prop in one sentence, don't build it. Every feature at Bounce AI has to pass the "mom test" — can I explain it to my mom?`,
  },
  {
    id: 6,
    category: "Your Beliefs",
    question: "Bad advice",
    answer: `"Build for your power users first." That's how you build complex products nobody can figure out. Build for the new user, then layer complexity.`,
  },
  {
    id: 7,
    category: "Your Bounce AI Story",
    question: "Bounce surprise",
    answer: `Engineers here actually talk to customers. At Microsoft, there were 5 layers between eng and users. Here, our backend engineer jumped on a customer call last week to debug in real-time.`,
  },
  {
    id: 8,
    category: "Your Bounce AI Story",
    question: "What's different",
    answer: `We ship to production every day. Not staging. Production. Most places I've worked did monthly releases with 50-page PRDs. We write 5 bullet points and ship.`,
  },
  {
    id: 9,
    category: "Your Bounce AI Story",
    question: "Aha moment",
    answer: `Customer said our AI saved them 15 hours per week. Not because of fancy features — just because we made the UX dead simple. Simplicity is our moat, not technology.`,
  },
  {
    id: 10,
    category: "Your Vision",
    question: "Industry future",
    answer: `In 3 years, nobody will know they're using AI. It'll be like electricity — invisible but everywhere. Products advertising "AI-powered" will sound as dated as "digital" or "online" do now.`,
  },
];
