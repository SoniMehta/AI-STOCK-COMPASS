import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  variant?: "default" | "bullish" | "bearish" | "neutral";
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  variant = "default",
  className,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "bullish":
        return "border-l-4 border-l-success";
      case "bearish":
        return "border-l-4 border-l-destructive";
      case "neutral":
        return "border-l-4 border-l-warning";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-300",
        getVariantStyles(),
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                change >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
