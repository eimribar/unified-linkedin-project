import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

const isValidLinkedInUrl = (url: string) => {
  try {
    const u = new URL(url);
    return (
      (u.hostname.includes("linkedin.com") || u.hostname.includes("www.linkedin.com")) &&
      (u.pathname.startsWith("/in/") || u.pathname.startsWith("/company/") || u.pathname.startsWith("/pub/"))
    );
  } catch {
    return false;
  }
};

const ImportPage = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "scraping" | "done">("idle");

  useEffect(() => {
    let t: number | undefined;
    if (status === "scraping") {
      setProgress(0);
      const start = Date.now();
      t = window.setInterval(() => {
        const elapsed = Date.now() - start;
        // Ease-out progress mock
        const pct = Math.min(99, Math.round(100 - 100 / (1 + elapsed / 500)));
        setProgress(pct);
      }, 120);
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  }, [status]);

  const canSubmit = useMemo(() => url.length > 0 && isValidLinkedInUrl(url), [url]);

  const handleImport = () => {
    if (!canSubmit) {
      toast({ title: "Enter a valid LinkedIn URL", description: "Use a profile, company or public profile URL." });
      return;
    }
    setStatus("scraping");
    toast({ title: "Connecting…", description: "We’re preparing your profile replica (mock)." });
    // Finish after a short delay to simulate success
    setTimeout(() => {
      setProgress(100);
      setStatus("done");
      confetti({ particleCount: 120, spread: 60, startVelocity: 35, zIndex: 9999 });
      toast({ title: "Imported!", description: "Profile data captured (mock). Continue to onboarding." });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Import LinkedIn Profile – LinkedIn Content Engine"
        description="Connect a LinkedIn URL to generate a clean, on‑brand profile replica."
        canonicalPath="/import"
      />
      <NavBar />
      <main className="mx-auto max-w-[880px] px-4 py-12 animate-enter">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Import your LinkedIn</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Paste your LinkedIn profile URL. We’ll create a sleek, on‑brand replica here. No scraping yet—this is a live mock.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-full grid place-items-center bg-primary/10 text-primary">
                <LinkIcon size={18} />
              </span>
              Link your profile
            </CardTitle>
            <CardDescription>Profile and public data only. You’re always in control.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                aria-label="LinkedIn URL"
                placeholder="https://www.linkedin.com/in/your-handle"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button size="lg" onClick={handleImport} disabled={status === "scraping" || !canSubmit}>
                {status === "scraping" ? "Connecting…" : "Connect & import"}
              </Button>
            </div>

            {status !== "idle" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Sparkles className="opacity-80" size={16} /> Preparing replica
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={14} className="opacity-70" /> Secure by design. Backend connection coming next.
                </div>
              </div>
            )}

            {status === "done" && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild variant="premium">
                  <a href="/onboarding">Continue to onboarding</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/strategy">Preview content strategy</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ImportPage;
