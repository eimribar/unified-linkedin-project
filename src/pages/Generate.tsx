import { useMemo, useState } from "react";
import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Generate = () => {
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [draft, setDraft] = useState("Here’s a concise insight: Consistency compounds. Share daily improvements and the why behind them.");
  const navigate = useNavigate();

  const charCount = useMemo(() => draft.length, [draft]);

  const mockGenerate = () => {
    const suffix = tone === "Bold"
      ? " Make it punchy and direct."
      : tone === "Friendly"
      ? " Keep it warm and inclusive."
      : " Keep it clear and actionable.";

    const sized = length === "Short" ? " (<= 120 chars)" : length === "Long" ? " (~200-300 words)" : " (~120-180 words)";
    setDraft((d) => `${d}\n\nRefinement:${suffix}${sized}`);
    toast.success("Generated suggestion");
  };

  const sendToApprovals = () => {
    toast.success("Sent to Approvals", { description: "Review it in the Approvals queue." });
    navigate("/approvals");
  };

  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Content Generation – LinkedIn Content Engine"
        description="Generate premium LinkedIn posts with a focused, minimal workflow."
        canonicalPath="/generate"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12 animate-enter">
        <header>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Content Generation</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            Turn ideas into polished drafts with a distraction-free editor.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="elevation-1 animate-fade-in">
            <CardHeader>
              <CardTitle className="tracking-tight">Editor</CardTitle>
              <CardDescription>Choose tone and length, then iterate quickly.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue placeholder="Tone" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue placeholder="Length" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[240px]" aria-label="Draft editor" />
              <div className="flex flex-wrap gap-2">
                <Button variant="soft" onClick={mockGenerate}>Generate Suggestion</Button>
                <Button variant="premium" onClick={sendToApprovals}>Send to Approvals</Button>
              </div>
            </CardContent>
          </Card>

          <aside className="elevation-2 bg-card rounded-2xl p-6 animate-fade-in">
            <h3 className="text-lg font-medium tracking-tight">Preview</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tone: {tone} • Length: {length} • {charCount} chars</p>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-6">{draft}</div>
            <div className="mt-6 text-xs text-muted-foreground">Tip: Keep the first 2 lines scannable. Use a crisp hook and a concrete takeaway.</div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Generate;
