import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-primary-dim)] text-[var(--color-primary)]",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]",
        outline: "border-[var(--color-border-strong)] text-[var(--color-muted)]",
        warn: "border-transparent bg-[color-mix(in_oklab,var(--color-warn)_18%,transparent)] text-[var(--color-warn)]",
        info: "border-transparent bg-[color-mix(in_oklab,var(--color-info)_18%,transparent)] text-[var(--color-info)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
