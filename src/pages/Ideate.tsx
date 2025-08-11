import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";

const Ideate = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Ideate – LinkedIn Content Engine"
        description="Generate high-quality LinkedIn content ideas with a premium, minimal workflow."
        canonicalPath="/ideate"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Ideate LinkedIn Content</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Capture, refine, and prioritize content ideas with absolute clarity and focus.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="premium" size="pill">Start Ideating</Button>
          <Button asChild variant="soft" size="pill">
            <Link to="/draft">Go to Drafts</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Ideate;
