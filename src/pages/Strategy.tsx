import SEO from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const Pill = ({ children }: { children: string }) => (
  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{children}</Badge>
);

const Strategy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Amnon Cohen – Content Strategy"
        description="Core narrative, pillars, cadence, hooks, and themes tailored to Amnon's voice."
        canonicalPath="/strategy"
      />

      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 animate-enter">
        <header>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Amnon Cohen — Content Strategy</h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Ex‑Microsoft PM who learned the hard way that simple beats complex. Ships daily at Bounce AI. Believes in data over opinions.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Narrative */}
            <section className="border-gradient-brand rounded-2xl p-6">
              <h2 className="text-lg font-medium tracking-tight">Core Narrative</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Ex‑Microsoft PM who learned the hard way that simple beats complex. Ships daily at Bounce AI. Believes in data over opinions.
              </p>
            </section>

            {/* Pillars */}
            <section className="border-gradient-brand rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium tracking-tight">Content Pillars + Unique Angles</h2>
                <div className="hidden md:flex flex-wrap gap-2">
                  <Pill>Leadership</Pill>
                  <Pill>Team & Culture</Pill>
                  <Pill>AI Industry</Pill>
                  <Pill>Product Craft</Pill>
                  <Pill>Career</Pill>
                  <Pill>Bounce AI</Pill>
                </div>
              </div>
              <Accordion type="multiple" className="mt-3">
                <AccordionItem value="pillar-1">
                  <AccordionTrigger>1. Product Leadership</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Why I killed our personalization engine (failure story)</li>
                      <li>The "mom test" for every feature decision</li>
                      <li>How we went from 0 to 40% DAU in 3 months</li>
                      <li>My scoring framework that says "no" to 70% of features</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pillar-2">
                  <AccordionTrigger>2. Team & Culture</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Why our engineers talk directly to customers</li>
                      <li>Breaking down the wall between product and engineering</li>
                      <li>How we replaced 50-page PRDs with 5 bullet points</li>
                      <li>The day our backend engineer fixed a bug live on a customer call</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pillar-3">
                  <AccordionTrigger>3. AI Industry</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>AI will be invisible in 3 years (here's why)</li>
                      <li>Stop advertising "AI-powered" — it's already cringe</li>
                      <li>Why simple UX beats fancy AI features</li>
                      <li>The real AI moat isn't technology</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pillar-4">
                  <AccordionTrigger>4. Product Craft</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>User research is overrated (controversial take)</li>
                      <li>Production data &gt; 100 user interviews</li>
                      <li>Ship in 2 weeks or kill it</li>
                      <li>Why building for power users ruins products</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pillar-5">
                  <AccordionTrigger>5. Career Growth</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>My $10M mistake taught me this</li>
                      <li>From Microsoft bureaucracy to startup speed</li>
                      <li>How to align engineering and sales (without losing your mind)</li>
                      <li>Why PMs hide behind research</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pillar-6">
                  <AccordionTrigger>6. Bounce AI Stories</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>We ship to production daily (here's how)</li>
                      <li>Our customer saved 15 hours/week with one simple change</li>
                      <li>Why we reject 70% of feature requests</li>
                      <li>How Bounce AI makes AI invisible</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Monthly Themes */}
            <section className="border-gradient-brand rounded-2xl p-6">
              <h2 className="text-lg font-medium tracking-tight">Monthly Themes</h2>
              <ol className="mt-3 space-y-2 text-sm md:text-base text-muted-foreground list-decimal pl-5">
                <li><span className="text-foreground font-medium">Month 1:</span> Simplicity beats complexity (her core belief)</li>
                <li><span className="text-foreground font-medium">Month 2:</span> Speed over perfection (shipping philosophy)</li>
                <li><span className="text-foreground font-medium">Month 3:</span> Data over opinions (decision making)</li>
                <li>Repeat with new stories/angles</li>
              </ol>
            </section>
          </div>

          {/* Right column */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            {/* Weekly Mix */}
            <section className="border-gradient-brand rounded-2xl p-6">
              <h2 className="text-lg font-medium tracking-tight">Content Mix (Weekly)</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <div className="text-foreground font-medium">Monday — Contrarian Take</div>
                  <p className="text-muted-foreground">“User interviews are overrated. Here's what I do instead...”</p>
                </li>
                <li>
                  <div className="text-foreground font-medium">Tuesday — How‑To</div>
                  <p className="text-muted-foreground">“My framework for saying no to 70% of feature requests”</p>
                </li>
                <li>
                  <div className="text-foreground font-medium">Wednesday — Story Time</div>
                  <p className="text-muted-foreground">“I wasted 6 months and $2M. Here's what I learned”</p>
                </li>
                <li>
                  <div className="text-foreground font-medium">Thursday — Bounce AI Win</div>
                  <p className="text-muted-foreground">“Our customer saved 15 hrs/week. Not from AI, from simplicity”</p>
                </li>
                <li>
                  <div className="text-foreground font-medium">Friday — Industry Prediction</div>
                  <p className="text-muted-foreground">“In 2027, ‘AI‑powered’ will sound as dated as ‘cyber’ does now”</p>
                </li>
              </ul>
            </section>

            {/* Hooks */}
            <section className="border-gradient-brand rounded-2xl p-6">
              <h2 className="text-lg font-medium tracking-tight">Hook Templates</h2>
              <ol className="mt-3 space-y-2 list-decimal pl-5 text-sm text-muted-foreground">
                <li><span className="text-foreground">The Failure Hook:</span> “I built a feature nobody wanted. 6 months. 2% adoption. Here's what I learned:”</li>
                <li><span className="text-foreground">The Contrarian Hook:</span> “Everyone says ‘talk to users.’ I say watch the data. Here's why:”</li>
                <li><span className="text-foreground">The Comparison Hook:</span> “Microsoft: 50‑page PRDs. Bounce AI: 5 bullet points. Guess who ships faster?”</li>
                <li><span className="text-foreground">The Simple Truth Hook:</span> “If you can't explain it to your mom, don't build it.”</li>
                <li><span className="text-foreground">The Metric Hook:</span> “0 to 40% daily active users in 3 months. One simple change:”</li>
              </ol>
            </section>

            {/* Integration */}
            <section className="border-gradient-brand rounded-2xl p-6">
              <h2 className="text-lg font-medium tracking-tight">Natural Bounce AI Integration</h2>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• 30% of posts mention Bounce directly (customer wins, culture, differentiation)</li>
                <li>• 70% pure value (product advice, industry takes, lessons learned)</li>
                <li>Always position Bounce as the “simple” alternative in a complex AI world</li>
              </ul>
            </section>

            {/* CTA */}
            <section className="rounded-2xl p-6 bg-secondary/40">
              <h3 className="text-base font-medium">Ready to generate posts?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use your strategy to create on‑brand posts automatically.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="/ideate">Open Ideation Engine</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/ideas">View Ideas</a>
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </main>

    </div>
  );
};

export default Strategy;
