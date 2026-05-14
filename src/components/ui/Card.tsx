import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-8 shadow-sm border border-brand-navy/20",
        className
      )}
    >
      {children}
    </div>
  );
}
