import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  target?: string;
  rel?: string;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-brand-navy text-white hover:bg-brand-navy/90",
  secondary:
    "bg-white text-brand-navy hover:bg-brand-light",
  outline:
    "border border-white text-white hover:bg-white hover:text-brand-navy",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className,
  type = "button",
  target,
  rel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-7 py-3 rounded-full font-body font-bold text-sm tracking-wide transition-all duration-200";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(base, styles[variant], className)}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(base, styles[variant], className)}
    >
      {children}
    </button>
  );
}
