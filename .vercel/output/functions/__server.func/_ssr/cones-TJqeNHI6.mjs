import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as ConeDiagram } from "./cone-diagram-CuvlPvSj.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { n as coneDrillDefs, t as CONE_SERIES_META } from "./cone-drills-f7Xbkf6-.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cones-TJqeNHI6.js
var import_jsx_runtime = require_jsx_runtime();
var families = [
	{
		id: "box",
		label: "Box",
		blurb: "40-yard squares · inside/outside · base & advanced"
	},
	{
		id: "m",
		label: "M patterns",
		blurb: "30-yard M cuts · sprint, shuffle, carioca valleys"
	},
	{
		id: "specialty",
		label: "Specialty",
		blurb: "360s, Figure 8s, Outside X, Inside X"
	}
];
function ConesPage() {
	const completedDrills = useProgressStore((s) => s.completedDrills);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Cone Agilities",
		subtitle: "Coaching sheet · 12 patterns",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-[var(--color-muted)]",
					children: CONE_SERIES_META.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: CONE_SERIES_META.legend.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: item.label
					}, item.style))
				})]
			}),
			families.map((family) => {
				const items = coneDrillDefs.filter((d) => d.family === family.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold tracking-tight",
							children: family.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[var(--color-subtle)]",
							children: family.blurb
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-3",
						children: items.map((def) => {
							const done = completedDrills.includes(def.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/drills/$drillId",
								params: { drillId: def.id },
								className: cn("block overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-[border-color,transform] duration-[var(--duration-fast)] active:scale-[0.99] hover:border-[var(--color-border-strong)]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[7.5rem_1fr] gap-0 sm:grid-cols-[9rem_1fr]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-r border-[var(--color-border)] bg-[var(--color-elevated)] p-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConeDiagram, {
											diagramId: def.diagramId,
											compact: true,
											showLegend: false
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col justify-center p-3.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-1.5 flex flex-wrap gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: def.level === "advanced" ? "warn" : "default",
														children: def.level
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														children: [def.totalYards, " yd"]
													}),
													done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: "Done"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-lg font-semibold leading-tight tracking-tight",
												children: def.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]",
												children: def.summary
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-[11px] text-[var(--color-subtle)]",
												children: def.movementMix.join(" · ")
											})
										]
									})]
								})
							}, def.id);
						})
					})]
				}, family.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "How to use in camp"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-2 text-sm text-[var(--color-muted)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Days 1–3: Base Inside/Outside Box + Base M only" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Days 4–6: Add Advanced Box/M with carioca & shuffle" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Days 7–10: 360s, Figure 8s, and X patterns for sharpness" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "· Always non-contact — clear lanes, no finish-line collisions" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4 w-full",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/plans",
							children: ["Open camp plan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { "aria-hidden": true })]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ConesPage as component };
