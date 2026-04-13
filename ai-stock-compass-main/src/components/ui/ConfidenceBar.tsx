import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ConfidenceBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ConfidenceBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  className,
}: ConfidenceBarProps) {
  const getColor = () => {
    if (value >= 70) return "bg-success";
    if (value >= 40) return "bg-warning";
    return "bg-destructive";
  };

  const getHeight = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "md":
        return "h-2";
      case "lg":
        return "h-3";
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-foreground">{value}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", getHeight())}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", getColor())}
        />
      </div>
    </div>
  );
}
