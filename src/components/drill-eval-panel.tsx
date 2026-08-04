import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TRAIT_LABELS,
  getEvalDrill,
  type TraitId,
} from "@/data/evaluation";
import {
  playerDisplayName,
  playerSortKey,
  useRosterStore,
} from "@/store/roster";

export function DrillEvalPanel({ drillId }: { drillId: string }) {
  const evalMap = getEvalDrill(drillId);
  const players = useRosterStore((s) => s.players);
  const logEval = useRosterStore((s) => s.logEval);
  const evalLogs = useRosterStore((s) => s.evalLogs);

  const [playerId, setPlayerId] = useState("");
  const [score, setScore] = useState(7);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  if (!evalMap) return null;

  const sorted = [...players].sort((a, b) =>
    playerSortKey(a).localeCompare(playerSortKey(b)),
  );
  const recent = evalLogs
    .filter((e) => e.drillId === drillId)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  return (
    <section className="mt-6 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_28%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_30%,var(--color-surface))] p-4">
      <div className="mb-2 flex items-center gap-2 text-[var(--color-primary)]">
        <ClipboardList className="size-4" aria-hidden />
        <h2 className="text-xs font-medium uppercase tracking-[0.12em]">
          Roster eval · {evalMap.label}
        </h2>
      </div>
      <p className="text-sm text-[var(--color-muted)]">
        Grade players on this drill. Scores feed position-fit analysis.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {evalMap.traits.map((t: TraitId) => (
          <Badge key={t} variant="outline">
            {TRAIT_LABELS[t]}
          </Badge>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Add players on the roster to log evals.
          </p>
          <Button asChild size="sm" className="mt-2">
            <Link to="/roster">Open roster</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <select
            value={playerId}
            onChange={(e) => {
              setPlayerId(e.target.value);
              setSaved(false);
            }}
            className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          >
            <option value="">Select player…</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {playerDisplayName(p)}
                {p.number ? ` #${p.number}` : ""}
              </option>
            ))}
          </select>
          <label className="block text-xs text-[var(--color-muted)]">
            Grade: {score}/10
            <input
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(e) => {
                setScore(Number(e.target.value));
                setSaved(false);
              }}
              className="mt-2 w-full"
            />
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="h-10 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          />
          <Button
            className="w-full"
            disabled={!playerId}
            onClick={() => {
              if (!playerId) return;
              logEval(playerId, drillId, score, note.trim() || undefined);
              setNote("");
              setSaved(true);
            }}
          >
            {saved ? "Saved — log another" : "Log eval grade"}
          </Button>
        </div>
      )}

      {recent.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-[var(--color-border)] pt-3">
          {recent.map((log) => {
            const p = players.find((x) => x.id === log.playerId);
            return (
              <li
                key={log.id}
                className="flex justify-between text-xs text-[var(--color-muted)]"
              >
                <span>
                  {p ? playerDisplayName(p) : "Player"} · {log.score}/10
                </span>
                <span className="text-[var(--color-subtle)]">
                  {new Date(log.at).toLocaleDateString()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
