import { TRAIT_LABELS, type TraitId } from "@/data/evaluation";
import { cn } from "@/lib/utils";

export function TraitSlider({
  trait,
  value,
  onChange,
  readOnly = false,
}: {
  trait: TraitId;
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted)]">{TRAIT_LABELS[trait]}</span>
        <span className="tabular font-medium text-[var(--color-fg)]">{value}</span>
      </div>
      {readOnly ? (
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-elevated)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: `${(value / 10) * 100}%` }}
          />
        </div>
      ) : (
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-elevated)]",
            "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)]",
          )}
          aria-label={TRAIT_LABELS[trait]}
        />
      )}
    </div>
  );
}
