import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";

const Research = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Research – LinkedIn Content Engine"
        description="Research topics, audience pain points, and trends to inform your LinkedIn content."
        canonicalPath="/research"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Research</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Validate ideas through focused research and insights before drafting.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="soft" size="pill">
            <Link to="/ideate">Back to Ideate</Link>
          </Button>
          <Button asChild variant="premium" size="pill">
            <Link to="/draft">Proceed to Draft</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Research;
