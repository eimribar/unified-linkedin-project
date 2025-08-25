import { Clock, CheckCircle2, XCircle, BarChart3, MoveUpRight, MoveDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentStatsProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  className?: string;
  loading?: boolean;
}

function ContentStats({ stats, className, loading = false }: ContentStatsProps) {
  // Calculate percentages for trends (mock data for demo)
  const approvalRate = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : "0";
  const rejectionRate = stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : "0";
  
  const statsData = [
    {
      value: stats.pending,
      label: "Pending Review",
      icon: Clock,
      trend: stats.pending > 0 ? "neutral" : "down",
      trendValue: null,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      value: stats.approved,
      label: "Approved",
      icon: CheckCircle2,
      trend: "up",
      trendValue: `${approvalRate}%`,
      iconColor: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      value: stats.rejected,
      label: "Rejected",
      icon: XCircle,
      trend: stats.rejected > 0 ? "down" : "neutral",
      trendValue: `${rejectionRate}%`,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    {
      value: stats.total,
      label: "Total Content",
      icon: BarChart3,
      trend: "up",
      trendValue: "+100%",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    }
  ];

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-0 flex-col justify-between p-6 border rounded-xl bg-card animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-muted mb-6" />
              <div className="h-10 bg-muted rounded w-24 mb-2" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const showTrendUp = stat.trend === "up" && stat.value > 0;
          const showTrendDown = stat.trend === "down" && stat.value > 0;
          
          return (
            <div 
              key={index} 
              className="group flex gap-0 flex-col justify-between p-6 border rounded-xl bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={cn("p-2.5 rounded-lg transition-colors", stat.bgColor)}>
                  <Icon className={cn("w-5 h-5", stat.iconColor)} />
                </div>
                {showTrendUp && (
                  <MoveUpRight className="w-4 h-4 text-green-500" />
                )}
                {showTrendDown && (
                  <MoveDownLeft className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div>
                <h2 className="text-3xl lg:text-4xl tracking-tighter font-semibold flex flex-row gap-3 items-end mb-1">
                  <span className="tabular-nums">{stat.value.toLocaleString()}</span>
                  {stat.trendValue && (
                    <span className="text-muted-foreground text-sm font-normal tracking-normal">
                      {stat.trendValue}
                    </span>
                  )}
                </h2>
                <p className="text-sm lg:text-base leading-relaxed tracking-tight text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ContentStats };