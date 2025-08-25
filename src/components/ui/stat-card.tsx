import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  variant?: "default" | "primary" | "accent";
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  className,
  variant = "default"
}: StatCardProps) {
  const variantStyles = {
    default: "stat-card",
    primary: "stat-card border-primary/20 bg-primary/5",
    accent: "stat-card border-accent/20 bg-accent/5"
  };

  const trendColors = {
    up: "text-nepal-green",
    down: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <div className={cn(variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          {trend && trendValue && (
            <p className={cn("text-xs mt-1", trendColors[trend])}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}