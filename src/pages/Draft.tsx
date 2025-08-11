import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";

const Draft = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Draft – LinkedIn Content Engine"
        description="Draft premium LinkedIn posts with clarity, minimalism, and polish."
        canonicalPath="/draft"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Draft</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Compose high-impact drafts with a focused, distraction-free editor.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="soft" size="pill">
            <Link to="/research">Back to Research</Link>
          </Button>
          <Button asChild variant="premium" size="pill">
            <Link to="/review">Send to Review</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Draft;
