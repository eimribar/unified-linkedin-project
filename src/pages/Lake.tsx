import { useMemo, useState } from "react";
import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Film, StickyNote, Link as LinkIcon, Star, StarOff } from "lucide-react";

interface LakeItem {
  id: string;
  type: "clip" | "note" | "link";
  title: string;
  source: string;
  tags: string[];
  url?: string;
  starred?: boolean;
}

const initialItems: LakeItem[] = [
  { id: "1", type: "clip", title: "Customer interview – onboarding friction", source: "Notion", tags: ["onboarding", "customer"], starred: true },
  { id: "2", type: "note", title: "3 hooks for talking about pricing transparently", source: "Apple Notes", tags: ["pricing", "messaging"], starred: false },
  { id: "3", type: "link", title: "Report: 2025 SaaS benchmarks", source: "External", tags: ["benchmarks", "saas"], url: "https://example.com/saas-benchmarks", starred: false },
  { id: "4", type: "clip", title: "Founder clip: roadmap tradeoffs", source: "Drive", tags: ["product", "strategy"], starred: false },
];

const Lake = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [items, setItems] = useState<LakeItem[]>(initialItems);
  const [starOnly, setStarOnly] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items
      .filter((it) => {
        const matchesType = type === "all" || it.type === type;
        const matchesQuery = !q || it.title.toLowerCase().includes(q) || it.tags.some((t) => t.toLowerCase().includes(q));
        const matchesStar = !starOnly || !!it.starred;
        return matchesType && matchesQuery && matchesStar;
      })
      .sort((a, b) => Number(!!b.starred) - Number(!!a.starred));
  }, [items, query, type, starOnly]);

  const addMock = () => {
    const next: LakeItem = {
      id: String(items.length + 1),
      type: "note",
      title: "New insight: users prefer concise carousels",
      source: "Manual",
      tags: ["format", "carousels"],
      starred: false,
    };
    setItems([next, ...items]);
    toast.success("Added to Content Lake", { description: next.title });
  };

  const addFromUrl = () => {
    if (!urlInput.trim()) return toast.error("Please paste a URL");
    try {
      const u = new URL(urlInput.trim());
      const host = u.hostname.replace(/^www\./, "");
      const titleGuess = `Saved link – ${host}${u.pathname !== "/" ? u.pathname : ""}`;
      const next: LakeItem = {
        id: String(items.length + 1),
        type: "link",
        title: titleGuess,
        source: host,
        tags: [],
        url: u.toString(),
        starred: false,
      };
      setItems([next, ...items]);
      setUrlInput("");
      toast.success("Link added", { description: host });
    } catch (e) {
      toast.error("Invalid URL");
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Content Lake – LinkedIn Content Engine"
        description="Centralized content lake for raw assets, research, and inspiration."
        canonicalPath="/lake"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12 animate-enter">
        <header>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Content Lake</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            A unified repository for ideas, clips, notes, and references to power your content.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <Input placeholder="Search the lake…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search content lake" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filter type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="clip">Clips</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
            <Button variant={starOnly ? "premium" : "outline"} size="pill" onClick={() => setStarOnly((s) => !s)} aria-pressed={starOnly}>
              <Star className="h-4 w-4 mr-2" aria-hidden />{starOnly ? "Starred only" : "Include all"}
            </Button>
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
            <Input placeholder="Paste post URL…" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} aria-label="Add by URL" className="flex-1" />
            <Button variant="premium" size="pill" onClick={addFromUrl}>Add by URL</Button>
            <Button variant="soft" size="pill" onClick={addMock}>Add mock item</Button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((it) => (
              <Card key={it.id} className="elevation-1 hover-scale animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base tracking-tight flex items-center gap-2">
                        {it.type === "clip" ? <Film className="h-4 w-4 opacity-80" aria-hidden /> : it.type === "note" ? <StickyNote className="h-4 w-4 opacity-80" aria-hidden /> : <LinkIcon className="h-4 w-4 opacity-80" aria-hidden />}
                        <Badge variant="secondary" className="capitalize">{it.type}</Badge>
                        <span className="font-medium">{it.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">Source: {it.source}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={it.starred ? "Unstar" : "Star"}
                      title={it.starred ? "Unstar" : "Star"}
                      onClick={() => setItems((list) => list.map((x) => x.id === it.id ? { ...x, starred: !x.starred } : x))}
                    >
                      {it.starred ? (
                        <Star className="h-5 w-5 star-pretty" aria-hidden fill="currentColor" strokeWidth={1.4} />
                      ) : (
                        <StarOff className="h-5 w-5 star-dim" aria-hidden strokeWidth={1.4} />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {it.tags.map((t) => (
                      <Badge key={t} variant="outline">#{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="elevation-1 bg-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No results. Try a different filter or add a mock item.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Lake;
