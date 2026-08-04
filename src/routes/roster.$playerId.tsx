import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  Ruler,
  Target,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PositionFitBars } from "@/components/position-fit-bars";
import { TraitSlider } from "@/components/trait-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EVAL_DRILLS,
  TRAIT_ORDER,
  formatHeight,
  getProfile,
} from "@/data/evaluation";
import { getDrillById } from "@/data/drills";
import { POSITION_LABELS, type PositionId } from "@/data/positions";
import { analyzePlayer } from "@/lib/roster-analysis";
import {
  playerDisplayName,
  useRosterStore,
} from "@/store/roster";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roster/$playerId")({
  component: PlayerDetailPage,
});

function PlayerDetailPage() {
  const { playerId } = Route.useParams();
  const navigate = useNavigate();
  const player = useRosterStore((s) => s.players.find((p) => p.id === playerId));
  const evalLogs = useRosterStore((s) => s.evalLogs);
  const setTrait = useRosterStore((s) => s.setTrait);
  const setMeasurable = useRosterStore((s) => s.setMeasurable);
  const updatePlayer = useRosterStore((s) => s.updatePlayer);
  const removePlayer = useRosterStore((s) => s.removePlayer);
  const toggleCompare = useRosterStore((s) => s.toggleCompare);
  const compareIds = useRosterStore((s) => s.compareIds);
  const logEval = useRosterStore((s) => s.logEval);
  const removeEval = useRosterStore((s) => s.removeEval);

  const [tab, setTab] = useState<"fit" | "traits" | "measurables" | "evals">(
    "fit",
  );
  const [evalDrill, setEvalDrill] = useState(EVAL_DRILLS[0]!.drillId);
  const [evalScore, setEvalScore] = useState(7);
  const [evalNote, setEvalNote] = useState("");

  if (!player) throw notFound();

  const analysis = useMemo(
    () => analyzePlayer(player, evalLogs),
    [player, evalLogs],
  );
  const playerLogs = evalLogs
    .filter((e) => e.playerId === player.id)
    .sort((a, b) => b.at.localeCompare(a.at));
  const inCompare = compareIds.includes(player.id);
  const bestProfile = getProfile(analysis.best.positionId);

  return (
    <AppShell hideNav>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/roster">
            <ArrowLeft aria-hidden /> Roster
          </Link>
        </Button>
        <Button
          variant={inCompare ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCompare(player.id)}
        >
          {inCompare ? "In compare" : "Compare"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {player.number && <Badge variant="outline">#{player.number}</Badge>}
        {player.gradeOrYear && (
          <Badge variant="secondary">{player.gradeOrYear}</Badge>
        )}
        {player.listedPosition && (
          <Badge>Listed {POSITION_LABELS[player.listedPosition]}</Badge>
        )}
      </div>
      <h1 className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-tight">
        {playerDisplayName(player)}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Best fit{" "}
        <span className="font-semibold text-[var(--color-primary)]">
          {POSITION_LABELS[analysis.best.positionId]} ({analysis.best.score})
        </span>
        {player.listedPosition &&
          player.listedPosition !== analysis.best.positionId && (
            <span>
              {" "}
              · differs from listed {POSITION_LABELS[player.listedPosition]}
            </span>
          )}
      </p>

      <div className="mt-5 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
        {(
          [
            ["fit", "Position fit"],
            ["traits", "Traits"],
            ["measurables", "Measurables"],
            ["evals", "Drill evals"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium",
              tab === id
                ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "fit" && (
        <section className="mt-5 space-y-5">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-1 flex items-center gap-2 text-[var(--color-primary)]">
              <Target className="size-4" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em]">
                Ranked fits
              </p>
            </div>
            <p className="mb-4 text-sm text-[var(--color-muted)]">
              {bestProfile.blurb}
            </p>
            <PositionFitBars
              rankings={analysis.rankings}
              highlight={player.listedPosition}
            />
            <p className="mt-3 text-[11px] text-[var(--color-subtle)]">
              Includes trait weights
              {analysis.best.measurableBonus
                ? ` · measurables +${analysis.best.measurableBonus}`
                : ""}
              {analysis.best.drillBonus
                ? ` · drill eval ${analysis.best.drillBonus > 0 ? "+" : ""}${analysis.best.drillBonus}`
                : ""}
            </p>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Listed position
            </p>
            <select
              value={player.listedPosition ?? ""}
              onChange={(e) =>
                updatePlayer(player.id, {
                  listedPosition: (e.target.value || undefined) as
                    | PositionId
                    | undefined,
                })
              }
              className="mt-2 h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 text-sm"
            >
              <option value="">Unlisted</option>
              {(Object.keys(POSITION_LABELS) as PositionId[]).map((id) => (
                <option key={id} value={id}>
                  {POSITION_LABELS[id]}
                </option>
              ))}
            </select>
            <label className="mt-4 block">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                Coach notes
              </span>
              <textarea
                value={player.notes}
                onChange={(e) =>
                  updatePlayer(player.id, { notes: e.target.value })
                }
                rows={3}
                className="mt-2 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
              Suggested eval drills for top fit
            </p>
            <div className="space-y-2">
              {EVAL_DRILLS.filter((e) => {
                const topTraits = Object.entries(
                  getProfile(analysis.best.positionId).weights,
                )
                  .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                  .slice(0, 4)
                  .map(([t]) => t);
                return e.traits.some((t) => topTraits.includes(t));
              })
                .slice(0, 4)
                .map((e) => {
                  const drill = getDrillById(e.drillId);
                  if (!drill) return null;
                  return (
                    <Link
                      key={e.drillId}
                      to="/drills/$drillId"
                      params={{ drillId: e.drillId }}
                      className="block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm"
                    >
                      <span className="font-medium">{drill.name}</span>
                      <span className="mt-0.5 block text-xs text-[var(--color-subtle)]">
                        {e.label}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {tab === "traits" && (
        <section className="mt-5 space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-muted)]">
            Coach grades 1–10. Fit scores update live.
          </p>
          {TRAIT_ORDER.map((t) => (
            <TraitSlider
              key={t}
              trait={t}
              value={player.traits[t]}
              onChange={(v) => setTrait(player.id, t, v)}
            />
          ))}
        </section>
      )}

      {tab === "measurables" && (
        <section className="mt-5 space-y-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <Ruler className="size-4" aria-hidden />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em]">
              Testing numbers
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumField
              label="Height (in)"
              value={player.measurables.heightIn}
              onChange={(v) => setMeasurable(player.id, "heightIn", v)}
              hint={formatHeight(player.measurables.heightIn)}
            />
            <NumField
              label="Weight (lb)"
              value={player.measurables.weightLb}
              onChange={(v) => setMeasurable(player.id, "weightLb", v)}
            />
            <NumField
              label="40-yard (sec)"
              value={player.measurables.fortySec}
              onChange={(v) => setMeasurable(player.id, "fortySec", v)}
              step={0.01}
            />
            <NumField
              label="Pro agility (sec)"
              value={player.measurables.proAgilitySec}
              onChange={(v) => setMeasurable(player.id, "proAgilitySec", v)}
              step={0.01}
            />
            <NumField
              label="Vertical (in)"
              value={player.measurables.verticalIn}
              onChange={(v) => setMeasurable(player.id, "verticalIn", v)}
            />
            <NumField
              label="Broad jump (in)"
              value={player.measurables.broadIn}
              onChange={(v) => setMeasurable(player.id, "broadIn", v)}
            />
          </div>
        </section>
      )}

      {tab === "evals" && (
        <section className="mt-5 space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-3 flex items-center gap-2 text-[var(--color-primary)]">
              <ClipboardList className="size-4" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em]">
                Log drill grade
              </p>
            </div>
            <label className="block text-xs text-[var(--color-muted)]">
              Evaluation drill
              <select
                value={evalDrill}
                onChange={(e) => setEvalDrill(e.target.value)}
                className="mt-1 h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 text-sm text-[var(--color-fg)]"
              >
                {EVAL_DRILLS.map((e) => {
                  const d = getDrillById(e.drillId);
                  return (
                    <option key={e.drillId} value={e.drillId}>
                      {d?.name ?? e.drillId} — {e.label}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="mt-3 block text-xs text-[var(--color-muted)]">
              Grade (1–10): {evalScore}
              <input
                type="range"
                min={1}
                max={10}
                value={evalScore}
                onChange={(e) => setEvalScore(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <input
              value={evalNote}
              onChange={(e) => setEvalNote(e.target.value)}
              placeholder="Optional note"
              className="mt-2 h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 text-sm"
            />
            <Button
              className="mt-3 w-full"
              onClick={() => {
                logEval(
                  player.id,
                  evalDrill,
                  evalScore,
                  evalNote.trim() || undefined,
                );
                setEvalNote("");
              }}
            >
              Save eval
            </Button>
          </div>

          <div className="space-y-2">
            {playerLogs.length === 0 ? (
              <p className="text-center text-sm text-[var(--color-muted)] py-6">
                No drill grades yet. Log from here or from any eval-linked drill.
              </p>
            ) : (
              playerLogs.map((log) => {
                const drill = getDrillById(log.drillId);
                return (
                  <div
                    key={log.id}
                    className="flex items-start justify-between gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {drill?.name ?? log.drillId}{" "}
                        <span className="text-[var(--color-primary)]">
                          {log.score}/10
                        </span>
                      </p>
                      <p className="text-xs text-[var(--color-subtle)]">
                        {new Date(log.at).toLocaleString()}
                        {log.note ? ` · ${log.note}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove eval"
                      className="text-[var(--color-subtle)]"
                      onClick={() => removeEval(log.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      <Button
        variant="outline"
        className="mt-10 mb-4 w-full text-[var(--color-muted)]"
        onClick={() => {
          if (
            typeof window !== "undefined" &&
            window.confirm(`Remove ${playerDisplayName(player)} from roster?`)
          ) {
            removePlayer(player.id);
            void navigate({ to: "/roster" });
          }
        }}
      >
        <Trash2 aria-hidden /> Remove player
      </Button>
    </AppShell>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
  hint,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[var(--color-muted)]">
        {label}
        {hint ? ` · ${hint}` : ""}
      </span>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") onChange(undefined);
          else onChange(Number(raw));
        }}
        className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 text-sm tabular"
      />
    </label>
  );
}
