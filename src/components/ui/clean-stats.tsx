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
      trendValue: null
    },
    {
      value: stats.approved.toLocaleString(),
      label: "Approved",
      trend: stats.approved > 0 ? "up" : null,
      trendValue: `+${approvalRate}%`
    },
    {
      value: stats.rejected.toLocaleString(),
      label: "Rejected", 
      trend: stats.rejected > 0 ? "down" : null,
      trendValue: stats.rejected > 0 ? `-${((stats.rejected / stats.total) * 100).toFixed(1)}%` : null
    },
    {
      value: stats.total.toLocaleString(),
      label: "Total Content",
      trend: "up",
      trendValue: "+100%"
    }
  ];

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-0 flex-col justify-between p-6 border rounded-md">
              <div className="h-4 w-4 mb-10" />
              <div className="h-10 bg-gray-100 rounded w-24 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8">
        {statsData.map((stat, index) => (
          <div key={index} className="flex gap-0 flex-col justify-between p-6 border rounded-md hover:border-gray-300 transition-colors">
            {stat.trend === "up" && (
              <MoveUpRight className="w-4 h-4 mb-10 text-primary" />
            )}
            {stat.trend === "down" && (
              <MoveDownLeft className="w-4 h-4 mb-10 text-destructive" />
            )}
            {!stat.trend && (
              <div className="w-4 h-4 mb-10" />
            )}
            
            <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
              {stat.value}
              {stat.trendValue && (
                <span className="text-muted-foreground text-sm tracking-normal">
                  {stat.trendValue}
                </span>
              )}
            </h2>
            <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CleanStats };