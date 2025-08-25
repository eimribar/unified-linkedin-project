import { MoveDownLeft, MoveUpRight } from "lucide-react";

interface CleanStatsProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  loading?: boolean;
}

function CleanStats({ stats, loading = false }: CleanStatsProps) {
  // Calculate trends
  const approvalRate = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : "0";
  
  const statsData = [
    {
      value: stats.pending.toLocaleString(),
      label: "Pending Review",
      trend: null,
      trendValue: null,
      accentColor: "border-amber-200 hover:border-amber-300 hover:bg-amber-50/50",
      trendColor: "text-amber-600"
    },
    {
      value: stats.approved.toLocaleString(),
      label: "Approved",
      trend: stats.approved > 0 ? "up" : null,
      trendValue: `+${approvalRate}%`,
      accentColor: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50",
      trendColor: "text-emerald-600"
    },
    {
      value: stats.rejected.toLocaleString(),
      label: "Rejected", 
      trend: stats.rejected > 0 ? "down" : null,
      trendValue: stats.rejected > 0 ? `-${((stats.rejected / stats.total) * 100).toFixed(1)}%` : null,
      accentColor: "border-rose-200 hover:border-rose-300 hover:bg-rose-50/50",
      trendColor: "text-rose-600"
    },
    {
      value: stats.total.toLocaleString(),
      label: "Total Content",
      trend: "up",
      trendValue: "+100%",
      accentColor: "border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50",
      trendColor: "text-indigo-600"
    }
  ];

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col p-3 border rounded-md">
              <div className="h-6 bg-gray-100 rounded w-16 mb-1 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-3">
        {statsData.map((stat, index) => (
          <div key={index} className={`flex flex-col p-3 border rounded-md transition-all duration-200 ${stat.accentColor}`}>
            <h2 className="text-2xl tracking-tight text-gray-900 mb-1">
              {stat.value}
            </h2>
            <p className="text-xs text-gray-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CleanStats };