import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { positions } from "@/data/positions";
import { AGE_BAND_SHORT } from "@/data/levels";
import { useProgressStore } from "@/store/progress";

export const Route = createFileRoute("/positions")({
  component: PositionsLayout,
});

function PositionsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/positions" && pathname.startsWith("/positions/")) {
    return <Outlet />;
  }
  return <PositionsPage />;
}

function PositionsPage() {
  const ageBand = useProgressStore((s) => s.ageBand);
  const groups = [
    { id: "offense" as const, label: "Offense" },
    { id: "defense" as const, label: "Defense" },
    { id: "special" as const, label: "Special teams" },
  ];

  return (
    <AppShell title="Positions" subtitle={`${AGE_BAND_SHORT[ageBand]} focus`}>
      <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
        Position rooms with keys, age notes, and linked drills — youth through
        adult.
      </p>

      {groups.map((g) => {
        const items = positions.filter((p) => p.group === g.id);
        return (
          <section key={g.id} className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold tracking-tight">
              {g.label}
            </h2>
            <div className="space-y-2">
              {items.map((pos) => (
                <Link
                  key={pos.id}
                  to="/positions/$positionId"
                  params={{ positionId: pos.id }}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-[border-color,transform] active:scale-[0.99] hover:border-[var(--color-border-strong)]"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline">{pos.shortName}</Badge>
                      <span className="font-display text-lg font-semibold tracking-tight">
                        {pos.name}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2">
                      {pos.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className="size-5 shrink-0 text-[var(--color-subtle)]"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <Link
        to="/safety"
        className="mb-2 block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-3 text-center text-sm font-medium text-[var(--color-primary)]"
      >
        Safety & contact standards →
      </Link>
    </AppShell>
  );
}
