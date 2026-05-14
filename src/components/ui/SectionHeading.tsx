import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "font-body text-xs tracking-[0.2em] uppercase mb-3",
            light ? "text-brand-blue" : "text-brand-blue"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl md:text-4xl leading-tight mb-4",
          light ? "text-white" : "text-brand-navy"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "font-body text-base leading-relaxed",
            light ? "text-brand-light/80" : "text-brand-silver"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
