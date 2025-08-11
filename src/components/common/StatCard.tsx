import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

const StatCard = ({ label, value, icon, className }: StatCardProps) => {
  return (
    <div className={cn("elevation-1 bg-card rounded-xl p-6 transition-transform duration-200 will-change-transform hover:scale-[1.02] hover:elevation-2", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        {icon ? <div className="opacity-60">{icon}</div> : null}
      </div>
      <div className="text-4xl font-semibold tracking-tight">{value}</div>
    </div>
  );
};

export default StatCard;
