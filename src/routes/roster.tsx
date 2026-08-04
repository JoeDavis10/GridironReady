import { useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import {
  ArrowRightLeft,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS, type PositionId } from "@/data/positions";
import { analyzePlayer } from "@/lib/roster-analysis";
import {
  playerDisplayName,
  playerSortKey,
  useRosterStore,
} from "@/store/roster";
import { cn } from "@/lib/utils";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { supabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/roster")({
  component: RosterLayout,
});

function RosterLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/roster" && pathname.startsWith("/roster/")) {
    return <Outlet />;
  }
  return <RosterPage />;
}

function RosterPage() {
  const players = useRosterStore((s) => s.players);
  const evalLogs = useRosterStore((s) => s.evalLogs);
  const compareIds = useRosterStore((s) => s.compareIds);
  const toggleCompare = useRosterStore((s) => s.toggleCompare);
  const seedDemoRoster = useRosterStore((s) => s.seedDemoRoster);
  const clearRoster = useRosterStore((s) => s.clearRoster);
  const cloudStatus = useRosterStore((s) => s.cloudStatus);
  const cloudError = useRosterStore((s) => s.cloudError);
  const { user, signOut, isPending: authPending } = useSupabaseAuth();

  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState<PositionId | "all">("all");

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...players]
      .filter((p) => {
        if (posFilter !== "all") {
          const best = analyzePlayer(p, evalLogs).best.positionId;
          if (p.listedPosition !== posFilter && best !== posFilter) return false;
        }
        if (!q) return true;
        const name = playerDisplayName(p).toLowerCase();
        return (
          name.includes(q) ||
          (p.number ?? "").includes(q) ||
          (p.gradeOrYear ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => playerSortKey(a).localeCompare(playerSortKey(b)));
  }, [players, query, posFilter, evalLogs]);

  return (
    <AppShell
      title="Roster"
      subtitle="Eval & position fit"
      action={
        <Button asChild size="sm">
          <Link to="/roster/new">
            <Plus aria-hidden /> Add
          </Link>
        </Button>
      }
    >
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]">
            <Users className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Build the depth chart with data
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
              Rate traits, log drill evals, compare athletes, and see best-fit
              positions — not just listed ones.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to="/roster/compare">
              <ArrowRightLeft aria-hidden /> Compare
              {compareIds.length > 0 ? ` (${compareIds.length})` : ""}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/positions">Position rooms</Link>
          </Button>
        </div>
      </section>

      {supabaseConfigured && (
        <section className="mt-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-3">
          {authPending || cloudStatus === "loading" ? (
            <p className="text-xs text-[var(--color-muted)]">Syncing account…</p>
          ) : user ? (
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-xs text-[var(--color-muted)]">
                Cloud · {user.email ?? "signed in"}
                {cloudStatus === "ready" ? " · synced" : ""}
              </p>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--color-muted)]">
                Sign in to save roster across devices
              </p>
              <Button asChild size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          )}
          {cloudError && (
            <p className="mt-1 text-xs text-[var(--color-warn)]">{cloudError}</p>
          )}
        </section>
      )}

      {players.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
          <Sparkles className="mx-auto mb-2 size-6 text-[var(--color-primary)]" aria-hidden />
          <p className="text-sm text-[var(--color-muted)]">
            No players yet. Add your roster or load a demo squad to explore
            analysis.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild>
              <Link to="/roster/new">
                <Plus aria-hidden /> Add player
              </Link>
            </Button>
            <Button variant="secondary" onClick={() => seedDemoRoster()}>
              Load demo roster (6)
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mt-5">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-subtle)]"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, number…"
              className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-3 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none]">
            <FilterChip
              active={posFilter === "all"}
              onClick={() => setPosFilter("all")}
              label="All"
            />
            {(Object.keys(POSITION_LABELS) as PositionId[]).map((id) => (
              <FilterChip
                key={id}
                active={posFilter === id}
                onClick={() => setPosFilter(id)}
                label={POSITION_LABELS[id].split(" ")[0]!}
              />
            ))}
          </div>

          <p className="mt-3 text-xs text-[var(--color-subtle)]">
            {sorted.length} player{sorted.length === 1 ? "" : "s"}
            {compareIds.length > 0 && (
              <span className="text-[var(--color-primary)]">
                {" "}
                · {compareIds.length} selected to compare
              </span>
            )}
          </p>

          <ul className="mt-3 space-y-2">
            {sorted.map((p) => {
              const { best } = analyzePlayer(p, evalLogs);
              const inCompare = compareIds.includes(p.id);
              return (
                <li key={p.id}>
                  <div className="flex items-stretch gap-2">
                    <Link
                      to="/roster/$playerId"
                      params={{ playerId: p.id }}
                      className="min-w-0 flex-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 transition-[border-color] hover:border-[var(--color-border-strong)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {p.number && (
                              <Badge variant="outline">#{p.number}</Badge>
                            )}
                            {p.gradeOrYear && (
                              <Badge variant="secondary">{p.gradeOrYear}</Badge>
                            )}
                          </div>
                          <p className="mt-1 font-display text-lg font-semibold tracking-tight truncate">
                            {playerDisplayName(p)}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                            Listed:{" "}
                            {p.listedPosition
                              ? POSITION_LABELS[p.listedPosition]
                              : "—"}
                            {" · "}
                            <span className="text-[var(--color-primary)]">
                              Best fit: {POSITION_LABELS[best.positionId]} (
                              {best.score})
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      aria-label={
                        inCompare ? "Remove from compare" : "Add to compare"
                      }
                      onClick={() => toggleCompare(p.id)}
                      className={cn(
                        "flex w-12 shrink-0 items-center justify-center rounded-[var(--radius-xl)] border text-xs font-semibold",
                        inCompare
                          ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                      )}
                    >
                      {inCompare ? "✓" : "+"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-2 pb-2">
            {compareIds.length >= 2 && (
              <Button asChild size="lg">
                <Link to="/roster/compare">
                  Compare {compareIds.length} players
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => seedDemoRoster()}>
              Reset demo roster
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-subtle)]"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.confirm("Clear entire roster on this device?")
                ) {
                  clearRoster();
                }
              }}
            >
              Clear roster
            </Button>
          </div>
        </>
      )}
    </AppShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap",
        active
          ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
      )}
    >
      {label}
    </button>
  );
}
