import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Analytics – LinkedIn Content Engine"
        description="Track performance and iterate with data-driven insights."
        canonicalPath="/analytics"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Measure impact across reach, engagement, and conversion to continuously improve.
        </p>
      </main>
    </div>
  );
};

export default Analytics;
