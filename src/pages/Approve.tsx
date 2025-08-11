import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";

const Approve = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Approve – LinkedIn Content Engine"
        description="Approve final LinkedIn posts with confidence and clarity."
        canonicalPath="/approve"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Approve</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Final approval step with premium, minimal controls.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="soft" size="pill">
            <Link to="/review">Back to Review</Link>
          </Button>
          <Button asChild variant="premium" size="pill">
            <Link to="/schedule">Schedule</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Approve;
