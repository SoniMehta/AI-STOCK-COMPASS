import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  rows?: number;
}

export function SkeletonCard({ className, rows = 3 }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-4 shadow-card animate-pulse",
        className
      )}
    >
      <div className="h-4 bg-secondary rounded w-1/3 mb-3" />
      <div className="h-8 bg-secondary rounded w-1/2 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-secondary rounded"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
