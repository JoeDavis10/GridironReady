import {
  coneDiagrams,
  PATH_STYLE_LABELS,
  type ConeDiagramSpec,
  type PathStyle,
} from "@/data/cone-diagrams";
import { cn } from "@/lib/utils";

const STROKE: Record<PathStyle, { dash?: string; width: number }> = {
  sprint: { width: 2.2 },
  carioca: { dash: "0.1 3.2", width: 2.4 },
  backwards: { dash: "4 2.5", width: 2.2 },
  shuffle: { dash: "1.2 2.2", width: 2.6 },
};

function arrowMarkerId(style: PathStyle, uid: string) {
  return `arrow-${style}-${uid}`;
}

/** Round so SSR and client SVG transforms match exactly */
function angleDeg(from: [number, number], to: [number, number]): number {
  const rad = Math.atan2(to[1] - from[1], to[0] - from[0]);
  return Math.round((rad * 1800) / Math.PI) / 10;
}

function PathWithArrow({
  path,
  uid,
}: {
  path: ConeDiagramSpec["paths"][number];
  uid: string;
  index: number;
}) {
  if (path.points.length < 2) return null;
  const d = path.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const stroke = STROKE[path.style];
  const mid = path.points[Math.max(1, path.points.length - 1)]!;
  const prev = path.points[Math.max(0, path.points.length - 2)]!;
  const angle = angleDeg(prev, mid);

  return (
    <g aria-label={PATH_STYLE_LABELS[path.style]}>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={stroke.dash}
        className="text-[var(--color-fg)]"
        markerEnd={`url(#${arrowMarkerId(path.style, uid)})`}
      />
      <polygon
        points="0,-3.2 7,0 0,3.2"
        transform={`translate(${mid[0]}, ${mid[1]}) rotate(${angle})`}
        className="fill-[var(--color-fg)]"
        opacity={0.95}
      />
    </g>
  );
}

export function ConeDiagram({
  diagramId,
  className,
  showLegend = true,
  compact = false,
}: {
  diagramId: string;
  className?: string;
  showLegend?: boolean;
  compact?: boolean;
}) {
  const spec = coneDiagrams[diagramId];
  if (!spec) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-sm text-[var(--color-muted)]">
        Diagram unavailable
      </div>
    );
  }

  const stylesUsed = [...new Set(spec.paths.map((p) => p.style))];
  const uid = diagramId.replace(/[^a-z0-9]/gi, "");

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)]",
          compact ? "p-2" : "p-3",
        )}
      >
        <svg
          viewBox="0 0 100 100"
          className={cn("mx-auto w-full text-[var(--color-fg)]", compact ? "max-h-44" : "max-h-64")}
          role="img"
          aria-label={`Cone pattern diagram for ${diagramId}`}
        >
          <defs>
            {(["sprint", "carioca", "backwards", "shuffle"] as PathStyle[]).map((style) => (
              <marker
                key={style}
                id={arrowMarkerId(style, uid)}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-fg)]" />
              </marker>
            ))}
          </defs>

          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="4"
            className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
            strokeWidth="0.6"
          />

          {spec.box && (
            <rect
              x={spec.box.x}
              y={spec.box.y}
              width={spec.box.w}
              height={spec.box.h}
              fill="none"
              className="stroke-[var(--color-border-strong)]"
              strokeWidth="0.8"
              opacity={0.5}
            />
          )}

          {spec.paths.map((path, i) => (
            <PathWithArrow key={`${path.style}-${i}`} path={path} uid={uid} index={i} />
          ))}

          {spec.cones.map((cone, i) => (
            <g key={`${cone.x}-${cone.y}-${i}`}>
              <circle
                cx={cone.x}
                cy={cone.y}
                r={cone.start ? 3.2 : 2.8}
                className={
                  cone.start
                    ? "fill-[var(--color-primary)] stroke-[var(--color-primary-fg)]"
                    : "fill-[var(--color-muted)] stroke-[var(--color-bg)]"
                }
                strokeWidth="0.8"
              />
              {cone.start && (
                <circle
                  cx={cone.x}
                  cy={cone.y}
                  r={5}
                  fill="none"
                  className="stroke-[var(--color-primary)]"
                  strokeWidth="0.7"
                  opacity={0.55}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-[var(--color-subtle)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--color-primary)]" />
            Start
          </span>
          {stylesUsed.map((style) => (
            <span key={style} className="inline-flex items-center gap-1.5">
              <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true">
                <line
                  x1="1"
                  y1="4"
                  x2="16"
                  y2="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={STROKE[style].dash}
                  strokeLinecap="round"
                  className="text-[var(--color-fg)]"
                />
                <polygon points="16,1.5 21,4 16,6.5" className="fill-[var(--color-fg)]" />
              </svg>
              {PATH_STYLE_LABELS[style]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConeDiagramThumb({ diagramId }: { diagramId: string }) {
  return <ConeDiagram diagramId={diagramId} compact showLegend={false} className="pointer-events-none" />;
}
