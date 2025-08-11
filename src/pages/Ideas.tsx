import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Star, StarOff } from "lucide-react";

interface Idea {
  id: string;
  title: string;
  details: string;
  category: string;
  score: number;
  starred?: boolean;
}

const initialIdeas: Idea[] = [
  { id: "1", title: "Why we ship in public (and how)", details: "Share the 3-step cadence and the outcomes.", category: "Brand", score: 7, starred: true },
  { id: "2", title: "Pricing transparency post", details: "Show our pricing rationale and invite feedback.", category: "Product", score: 6, starred: false },
  { id: "3", title: "Founder lessons: week in review", details: "Short carousel of key learnings.", category: "Founder", score: 5, starred: false },
];

const Ideas = () => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"score-desc" | "recent">("score-desc");
  const [starOnly, setStarOnly] = useState(false);

  const displayIdeas = [...ideas]
    .filter((i) => !starOnly || !!i.starred)
    .sort((a, b) => {
      const starOrder = Number(!!b.starred) - Number(!!a.starred);
      if (starOrder !== 0) return starOrder;
      return sort === "score-desc" ? b.score - a.score : Number(b.id) - Number(a.id);
    });

  const addIdea = () => {
    if (!title.trim()) return toast.error("Please add a title");
    const next: Idea = { id: String(ideas.length + 1), title, details, category: category || "General", score: 5, starred: false };
    setIdeas([next, ...ideas]);
    setTitle("");
    setDetails("");
    setCategory("");
    toast.success("Idea added", { description: next.title });
  };

  const upvote = (id: string) => {
    setIdeas((list) => list.map((i) => (i.id === id ? { ...i, score: i.score + 1 } : i)));
  };

  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Content Ideas – LinkedIn Content Engine"
        description="Brainstorm, refine, and prioritize LinkedIn content ideas with clarity."
        canonicalPath="/ideas"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12 animate-enter">
        <header>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Content Ideas</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            Capture sparks from the lake, score potential, and shape strong angles.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">Ideas: {ideas.length}</span>
              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score-desc">Score (top)</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={starOnly ? "premium" : "outline"} size="sm" onClick={() => setStarOnly((s) => !s)} aria-pressed={starOnly}>
                  <Star className="h-4 w-4 mr-2" aria-hidden />{starOnly ? "Starred only" : "Include all"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayIdeas.map((idea) => (
                <Card key={idea.id} className="elevation-1 hover-scale animate-fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg tracking-tight">{idea.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{idea.category || "General"}</Badge>
                          <span className="text-xs">Score: {idea.score}</span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={idea.starred ? "Unstar" : "Star"}
                        title={idea.starred ? "Unstar" : "Star"}
                        onClick={() => setIdeas((list) => list.map((i) => i.id === idea.id ? { ...i, starred: !i.starred } : i))}
                      >
                        {idea.starred ? (
                          <Star className="h-5 w-5 star-pretty" aria-hidden fill="currentColor" strokeWidth={1.4} />
                        ) : (
                          <StarOff className="h-5 w-5 star-dim" aria-hidden strokeWidth={1.4} />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{idea.details}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="soft" onClick={() => upvote(idea.id)}>Upvote</Button>
                      <Button asChild size="sm" variant="outline" onClick={() => toast("Promoted to Generate", { description: idea.title })}>
                        <Link to="/generate">Promote to Generate</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside className="elevation-2 bg-card rounded-2xl p-6">
            <h3 className="text-lg font-medium tracking-tight">Add idea</h3>
            <p className="mt-2 text-sm text-muted-foreground">Lightweight capture form to keep momentum.</p>
            <div className="mt-4 grid gap-3">
              <Input placeholder="Idea title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} />
              <Textarea placeholder="Details (optional)" value={details} onChange={(e) => setDetails(e.target.value)} className="min-h-[120px]" />
              <Button variant="premium" onClick={addIdea}>Add Idea</Button>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">Tip: Promote strong ideas to the Generation step.</div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Ideas;
