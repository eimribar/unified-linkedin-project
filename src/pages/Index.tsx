import NavBar from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <NavBar />

      <main role="main" className="mx-auto max-w-[1440px] px-4">
        <section className="pt-12 md:pt-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight animate-fade-in">
              LinkedIn Content Engine
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              A premium, minimal workflow to ideate, refine, and schedule impactful LinkedIn content — designed with Apple-grade clarity and polish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="premium" size="pill">Create New Post</Button>
              <Button variant="soft" size="pill">Import Ideas</Button>
            </div>
          </div>
        </section>



      </main>
    </div>
  );
};

export default Index;
