import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Dumbbell, T as ChevronRight, w as Clock3 } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn } from "./badge-D9EcA40i.mjs";
import { n as INTENSITY_LABELS, t as CATEGORY_LABELS } from "./drills-DBQZjy_r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drill-card-DkBx0-r-.js
var import_jsx_runtime = require_jsx_runtime();
var intensityVariant = {
	low: "secondary",
	moderate: "info",
	high: "warn"
};
function DrillCard({ drill, compact = false, done = false }) {
	const isCone = drill.series === "cone-agilities";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/drills/$drillId",
		params: { drillId: drill.id },
		className: cn("group block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-smooth)] active:scale-[0.99]", "hover:border-[var(--color-border-strong)]", done && "border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-border))]"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: isCone ? "Cone" : CATEGORY_LABELS[drill.category]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: intensityVariant[drill.intensity],
								children: INTENSITY_LABELS[drill.intensity]
							}),
							drill.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: drill.level
							}),
							done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "Done"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-semibold leading-tight tracking-tight text-[var(--color-fg)]",
						children: drill.name
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]",
						children: drill.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-xs text-[var(--color-subtle)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									drill.durationMin,
									" min"
								]
							}),
							drill.totalYards && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [drill.totalYards, " yd"] }),
							drill.equipment[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									drill.equipment[0],
									drill.equipment.length > 1 ? ` +${drill.equipment.length - 1}` : ""
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "mt-1 size-5 shrink-0 text-[var(--color-subtle)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5",
				"aria-hidden": true
			})]
		})
	});
}
//#endregion
export { DrillCard as t };
