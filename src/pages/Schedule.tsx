import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";

const Schedule = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Schedule – LinkedIn Content Engine"
        description="Schedule approved LinkedIn posts with precision and ease."
        canonicalPath="/schedule"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Schedule</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Plan your publishing calendar with confidence.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="soft" size="pill">
            <Link to="/approve">Back to Approve</Link>
          </Button>
          <Button asChild variant="premium" size="pill">
            <Link to="/analytics">View Analytics</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
