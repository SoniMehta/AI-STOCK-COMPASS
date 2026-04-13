import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
  sentiment: "positive" | "negative" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SentimentBadge({
  sentiment,
  size = "md",
  className,
}: SentimentBadgeProps) {
  const getSentimentStyles = () => {
    switch (sentiment) {
      case "positive":
        return "bg-success/10 text-success border-success/20";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "neutral":
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "md":
        return "text-sm px-2.5 py-1";
      case "lg":
        return "text-base px-3 py-1.5";
    }
  };

  const getLabel = () => {
    switch (sentiment) {
      case "positive":
        return "Positive";
      case "negative":
        return "Negative";
      case "neutral":
        return "Neutral";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        getSentimentStyles(),
        getSizeStyles(),
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          sentiment === "positive" && "bg-success",
          sentiment === "negative" && "bg-destructive",
          sentiment === "neutral" && "bg-warning"
        )}
      />
      {getLabel()}
    </span>
  );
}
