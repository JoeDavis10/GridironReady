import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./badge-D9EcA40i.mjs";
import { n as coneDiagrams, t as PATH_STYLE_LABELS } from "./cone-diagrams-BbRnI_Va.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cone-diagram-CuvlPvSj.js
var import_jsx_runtime = require_jsx_runtime();
var STROKE = {
	sprint: { width: 2.2 },
	carioca: {
		dash: "0.1 3.2",
		width: 2.4
	},
	backwards: {
		dash: "4 2.5",
		width: 2.2
	},
	shuffle: {
		dash: "1.2 2.2",
		width: 2.6
	}
};
function arrowMarkerId(style, uid) {
	return `arrow-${style}-${uid}`;
}
/** Round so SSR and client SVG transforms match exactly */
function angleDeg(from, to) {
	const rad = Math.atan2(to[1] - from[1], to[0] - from[0]);
	return Math.round(rad * 1800 / Math.PI) / 10;
}
function PathWithArrow({ path, uid }) {
	if (path.points.length < 2) return null;
	const d = path.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
	const stroke = STROKE[path.style];
	const mid = path.points[Math.max(1, path.points.length - 1)];
	const prev = path.points[Math.max(0, path.points.length - 2)];
	const angle = angleDeg(prev, mid);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		"aria-label": PATH_STYLE_LABELS[path.style],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: stroke.width,
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeDasharray: stroke.dash,
			className: "text-[var(--color-fg)]",
			markerEnd: `url(#${arrowMarkerId(path.style, uid)})`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
			points: "0,-3.2 7,0 0,3.2",
			transform: `translate(${mid[0]}, ${mid[1]}) rotate(${angle})`,
			className: "fill-[var(--color-fg)]",
			opacity: .95
		})]
	});
}
function ConeDiagram({ diagramId, className, showLegend = true, compact = false }) {
	const spec = coneDiagrams[diagramId];
	if (!spec) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-sm text-[var(--color-muted)]",
		children: "Diagram unavailable"
	});
	const stylesUsed = [...new Set(spec.paths.map((p) => p.style))];
	const uid = diagramId.replace(/[^a-z0-9]/gi, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)]", compact ? "p-2" : "p-3"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: cn("mx-auto w-full text-[var(--color-fg)]", compact ? "max-h-44" : "max-h-64"),
				role: "img",
				"aria-label": `Cone pattern diagram for ${diagramId}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: [
						"sprint",
						"carioca",
						"backwards",
						"shuffle"
					].map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
						id: arrowMarkerId(style, uid),
						markerWidth: "8",
						markerHeight: "8",
						refX: "6",
						refY: "3",
						orient: "auto",
						markerUnits: "strokeWidth",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M0,0 L6,3 L0,6 Z",
							className: "fill-[var(--color-fg)]"
						})
					}, style)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "4",
						y: "4",
						width: "92",
						height: "92",
						rx: "4",
						className: "fill-[var(--color-surface)] stroke-[var(--color-border)]",
						strokeWidth: "0.6"
					}),
					spec.box && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: spec.box.x,
						y: spec.box.y,
						width: spec.box.w,
						height: spec.box.h,
						fill: "none",
						className: "stroke-[var(--color-border-strong)]",
						strokeWidth: "0.8",
						opacity: .5
					}),
					spec.paths.map((path, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathWithArrow, {
						path,
						uid,
						index: i
					}, `${path.style}-${i}`)),
					spec.cones.map((cone, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: cone.x,
						cy: cone.y,
						r: cone.start ? 3.2 : 2.8,
						className: cone.start ? "fill-[var(--color-primary)] stroke-[var(--color-primary-fg)]" : "fill-[var(--color-muted)] stroke-[var(--color-bg)]",
						strokeWidth: "0.8"
					}), cone.start && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: cone.x,
						cy: cone.y,
						r: 5,
						fill: "none",
						className: "stroke-[var(--color-primary)]",
						strokeWidth: "0.7",
						opacity: .55
					})] }, `${cone.x}-${cone.y}-${i}`))
				]
			})
		}), showLegend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-[var(--color-subtle)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[var(--color-primary)]" }), "Start"]
			}), stylesUsed.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "22",
					height: "8",
					viewBox: "0 0 22 8",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "1",
						y1: "4",
						x2: "16",
						y2: "4",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeDasharray: STROKE[style].dash,
						strokeLinecap: "round",
						className: "text-[var(--color-fg)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "16,1.5 21,4 16,6.5",
						className: "fill-[var(--color-fg)]"
					})]
				}), PATH_STYLE_LABELS[style]]
			}, style))]
		})]
	});
}
//#endregion
export { ConeDiagram as t };
