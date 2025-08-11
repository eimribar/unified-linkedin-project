import NavBar from "@/components/layout/NavBar";
import SEO from "@/components/seo/SEO";
import SwipeDeck from "@/components/swipe/SwipeDeck";

const Review = () => {
  return (
    <div className="min-h-screen bg-background text-foreground premium-gradient-bg">
      <SEO
        title="Review and Approve Posts – LinkedIn Content Engine"
        description="Tinder-style review flow to approve, decline, or edit LinkedIn drafts with premium spring physics."
        canonicalPath="/review"
      />
      <NavBar />
      <main className="mx-auto max-w-[1440px] px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Review and Approve Posts</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Swipe right to approve, left to decline, or edit inline for quick fixes.
        </p>

        <div className="mt-8">
          <SwipeDeck />
        </div>
      </main>
    </div>
  );
};

export default Review;
