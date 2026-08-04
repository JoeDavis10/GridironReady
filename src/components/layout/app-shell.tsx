import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  LayoutGrid,
  Home,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/plans", label: "Programs", icon: CalendarDays },
  { to: "/plays", label: "Plays", icon: LayoutGrid },
  { to: "/roster", label: "Roster", icon: Users },
  { to: "/drills", label: "Drills", icon: BookOpen },
];

export function AppShell({
  children,
  title,
  subtitle,
  action,
  hideNav = false,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  hideNav?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full max-w-lg flex-col bg-[var(--color-bg)]">
      {(title || action) && (
        <header className="sticky top-[var(--grok-banner-h,0px)] z-20 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] px-4 pb-3 pt-3 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {subtitle && (
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                  {subtitle}
                </p>
              )}
              {title && (
                <h1 className="font-display text-[1.75rem] font-semibold leading-none tracking-tight text-[var(--color-fg)]">
                  {title}
                </h1>
              )}
            </div>
            {action}
          </div>
        </header>
      )}

      <main
        className={cn(
          "flex-1 px-4 pt-4",
          hideNav ? "pb-8" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
        )}
      >
        {children}
      </main>

      {!hideNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface)_94%,transparent)] backdrop-blur-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
            {nav.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
                    active
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-subtle)]",
                  )}
                >
                  <Icon
                    className={cn("size-5", active && "stroke-[2.25]")}
                    aria-hidden
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
