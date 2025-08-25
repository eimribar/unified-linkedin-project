import { Stats } from "@/components/ui/stats-section"
import { ContentStats } from "@/components/ui/content-stats-section"

function StatsDemo() {
  // Demo data for content stats
  const contentStatsData = {
    pending: 12,
    approved: 48,
    rejected: 3,
    total: 63
  };

  return (
    <div className="w-full space-y-12 p-8">
      {/* Original Stats Component */}
      <div>
        <h2 className="text-2xl font-bold mb-4">General Stats Section</h2>
        <Stats />
      </div>
      
      {/* Content-specific Stats Component */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Content Stats Section (Currently in Use)</h2>
        <ContentStats stats={contentStatsData} />
      </div>
      
      {/* Loading State Demo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Loading State</h2>
        <ContentStats stats={contentStatsData} loading={true} />
      </div>
    </div>
  );
}

export { StatsDemo };