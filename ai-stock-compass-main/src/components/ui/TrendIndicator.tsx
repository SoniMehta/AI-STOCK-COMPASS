import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  trend: "bullish" | "bearish" | "neutral";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TrendIndicator({
  trend,
  showLabel = true,
  size = "md",
  className,
}: TrendIndicatorProps) {
  const getTrendStyles = () => {
    switch (trend) {
      case "bullish":
        return "bg-success/10 text-success";
      case "bearish":
        return "bg-destructive/10 text-destructive";
      case "neutral":
        return "bg-warning/10 text-warning";
    }
  };

  const getIcon = () => {
    const iconSize = size === "sm" ? 14 : size === "md" ? 18 : 22;
    switch (trend) {
      case "bullish":
        return <TrendingUp size={iconSize} />;
      case "bearish":
        return <TrendingDown size={iconSize} />;
      case "neutral":
        return <Minus size={iconSize} />;
    }
  };

  const getLabel = () => {
    switch (trend) {
      case "bullish":
        return "Bullish";
      case "bearish":
        return "Bearish";
      case "neutral":
        return "Neutral";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1 gap-1";
      case "md":
        return "text-sm px-3 py-1.5 gap-1.5";
      case "lg":
        return "text-base px-4 py-2 gap-2";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        getTrendStyles(),
        getSizeStyles(),
        className
      )}
    >
      {getIcon()}
      {showLabel && getLabel()}
    </span>
  );
}
