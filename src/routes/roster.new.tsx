import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS, type PositionId } from "@/data/positions";
import { useRosterStore } from "@/store/roster";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roster/new")({
  component: NewPlayerPage,
});

const ALL_POSITIONS = Object.keys(POSITION_LABELS) as PositionId[];

function NewPlayerPage() {
  const navigate = useNavigate();
  const addPlayer = useRosterStore((s) => s.addPlayer);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [gradeOrYear, setGradeOrYear] = useState("");
  const [listedPosition, setListedPosition] = useState<PositionId | "">("");
  const [targetPositions, setTargetPositions] = useState<PositionId[]>([]);
  const [notes, setNotes] = useState("");

  const canSave = firstName.trim() && lastName.trim();

  function toggleTarget(id: PositionId) {
    setTargetPositions((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/roster">
          <ArrowLeft aria-hidden /> Roster
        </Link>
      </Button>
      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        Add player
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Name, number, and position assignments sync to the cloud when signed in.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSave) return;
          const id = addPlayer({
            firstName,
            lastName,
            number: number.trim() || undefined,
            gradeOrYear: gradeOrYear.trim() || undefined,
            listedPosition: listedPosition || undefined,
            targetPositions,
            notes: notes.trim(),
          });
          void navigate({ to: "/roster/$playerId", params: { playerId: id } });
        }}
      >
        <Field label="First name">
          <input
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Last name">
          <input
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jersey number">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={inputClass}
              inputMode="numeric"
              placeholder="#"
            />
          </Field>
          <Field label="Grade / year">
            <input
              value={gradeOrYear}
              onChange={(e) => setGradeOrYear(e.target.value)}
              placeholder="Jr, 10, RS-Fr…"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Listed position">
          <select
            value={listedPosition}
            onChange={(e) =>
              setListedPosition((e.target.value || "") as PositionId | "")
            }
            className={inputClass}
          >
            <option value="">Unlisted</option>
            {ALL_POSITIONS.map((id) => (
              <option key={id} value={id}>
                {POSITION_LABELS[id]}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
            Position assignments{" "}
            <span className="text-[var(--color-subtle)]">(depth / cross-train)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_POSITIONS.map((id) => {
              const on = targetPositions.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTarget(id)}
                  className={cn(
                    "h-9 rounded-full border px-3 text-xs font-medium",
                    on
                      ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                  )}
                >
                  {POSITION_LABELS[id]}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Coach notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Injury history, scheme fit, practice habits…"
            className={cn(inputClass, "h-auto min-h-[5.5rem] py-2.5")}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={!canSave}>
          Create & rate traits
        </Button>
      </form>
    </AppShell>
  );
}

const inputClass =
  "h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-primary)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}
