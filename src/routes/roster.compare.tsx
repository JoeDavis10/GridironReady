import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PositionFitBars } from "@/components/position-fit-bars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TRAIT_LABELS,
  TRAIT_ORDER,
  formatHeight,
  type TraitId,
} from "@/data/evaluation";
import { POSITION_LABELS, type PositionId } from "@/data/positions";
import { analyzePlayer } from "@/lib/roster-analysis";
import {
  playerDisplayName,
  useRosterStore,
} from "@/store/roster";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roster/compare")({
  component: ComparePage,
});

function ComparePage() {
  const players = useRosterStore((s) => s.players);
  const evalLogs = useRosterStore((s) => s.evalLogs);
  const compareIds = useRosterStore((s) => s.compareIds);
  const toggleCompare = useRosterStore((s) => s.toggleCompare);
  const clearCompare = useRosterStore((s) => s.clearCompare);

  const selected = useMemo(
    () =>
      compareIds
        .map((id) => players.find((p) => p.id === id))
        .filter(Boolean) as typeof players,
    [compareIds, players],
  );

  const analyses = useMemo(
    () =>
      Object.fromEntries(
        selected.map((p) => [p.id, analyzePlayer(p, evalLogs)]),
      ),
    [selected, evalLogs],
  );

  const traitWinners = useMemo(() => {
    const map: Partial<Record<TraitId, string>> = {};
    for (const t of TRAIT_ORDER) {
      if (!selected.length) continue;
      const best = [...selected].sort(
        (a, b) => b.traits[t] - a.traits[t],
      )[0]!;
      map[t] = best.id;
    }
    return map;
  }, [selected]);

  const positionWinners = useMemo(() => {
    const map: Partial<Record<PositionId, { playerId: string; score: number }>> =
      {};
    for (const p of selected) {
      const ranks = analyses[p.id]?.rankings ?? [];
      for (const r of ranks) {
        const cur = map[r.positionId];
        if (!cur || r.score > cur.score) {
          map[r.positionId] = { playerId: p.id, score: r.score };
        }
      }
    }
    return map;
  }, [selected, analyses]);

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/roster">
          <ArrowLeft aria-hidden /> Roster
        </Link>
      </Button>

      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        Compare
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Structured side-by-side traits and position-fit winners. Select 2–4
        players on the roster (tap +).
      </p>

      {selected.length < 2 ? (
        <div className="mt-8 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            {selected.length === 0
              ? "No players selected."
              : "Add at least one more player to compare."}
          </p>
          <Button asChild className="mt-4">
            <Link to="/roster">Pick players</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {selected.map((p) => (
              <div
                key={p.id}
                className="min-w-[7.5rem] shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5"
              >
                <p className="truncate text-sm font-semibold">
                  {playerDisplayName(p)}
                </p>
                <p className="text-[11px] text-[var(--color-primary)]">
                  {POSITION_LABELS[analyses[p.id]!.best.positionId]}{" "}
                  {analyses[p.id]!.best.score}
                </p>
                <button
                  type="button"
                  className="mt-1 text-[11px] text-[var(--color-subtle)]"
                  onClick={() => toggleCompare(p.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Position fit winners */}
          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="size-4 text-[var(--color-primary)]" aria-hidden />
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Best fit by position
              </h2>
            </div>
            <ul className="space-y-2">
              {(Object.keys(POSITION_LABELS) as PositionId[]).map((pos) => {
                const w = positionWinners[pos];
                if (!w) return null;
                const pl = selected.find((p) => p.id === w.playerId);
                if (!pl) return null;
                return (
                  <li
                    key={pos}
                    className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5"
                  >
                    <span className="text-sm font-medium">
                      {POSITION_LABELS[pos]}
                    </span>
                    <span className="text-sm text-[var(--color-muted)]">
                      {playerDisplayName(pl)}{" "}
                      <span className="tabular text-[var(--color-primary)]">
                        {w.score}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Trait matrix */}
          <section className="mt-8">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
              Trait matrix
            </h2>
            <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <table className="w-full min-w-[28rem] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-elevated)]">
                    <th className="sticky left-0 bg-[var(--color-elevated)] px-2 py-2 font-medium">
                      Trait
                    </th>
                    {selected.map((p) => (
                      <th
                        key={p.id}
                        className="px-2 py-2 font-medium text-[var(--color-muted)]"
                      >
                        {p.firstName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRAIT_ORDER.map((t) => (
                    <tr
                      key={t}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="sticky left-0 bg-[var(--color-bg)] px-2 py-2 text-[var(--color-muted)]">
                        {TRAIT_LABELS[t]}
                      </td>
                      {selected.map((p) => {
                        const win = traitWinners[t] === p.id;
                        return (
                          <td
                            key={p.id}
                            className={cn(
                              "px-2 py-2 tabular",
                              win &&
                                "font-semibold text-[var(--color-primary)]",
                            )}
                          >
                            {p.traits[t]}
                            {win ? " ★" : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Measurables */}
          <section className="mt-8">
            <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
              Measurables
            </h2>
            <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)]">
              <table className="w-full min-w-[28rem] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-elevated)]">
                    <th className="px-2 py-2">Athlete</th>
                    <th className="px-2 py-2">Ht</th>
                    <th className="px-2 py-2">Wt</th>
                    <th className="px-2 py-2">40</th>
                    <th className="px-2 py-2">5-10-5</th>
                    <th className="px-2 py-2">VJ</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="px-2 py-2 font-medium">
                        {p.firstName}
                      </td>
                      <td className="px-2 py-2 tabular">
                        {formatHeight(p.measurables.heightIn)}
                      </td>
                      <td className="px-2 py-2 tabular">
                        {p.measurables.weightLb ?? "—"}
                      </td>
                      <td className="px-2 py-2 tabular">
                        {p.measurables.fortySec?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-2 py-2 tabular">
                        {p.measurables.proAgilitySec?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-2 py-2 tabular">
                        {p.measurables.verticalIn ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Individual fit charts */}
          <section className="mt-8 space-y-4 pb-4">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Full fit charts
            </h2>
            {selected.map((p) => (
              <div
                key={p.id}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Link
                    to="/roster/$playerId"
                    params={{ playerId: p.id }}
                    className="font-display text-lg font-semibold"
                  >
                    {playerDisplayName(p)}
                  </Link>
                  <Badge variant="outline">
                    {p.listedPosition
                      ? POSITION_LABELS[p.listedPosition]
                      : "Unlisted"}
                  </Badge>
                </div>
                <PositionFitBars
                  rankings={analyses[p.id]!.rankings}
                  compact
                  highlight={p.listedPosition}
                />
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={clearCompare}>
              Clear comparison
            </Button>
          </section>
        </>
      )}
    </AppShell>
  );
}
