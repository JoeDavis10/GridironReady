import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Shapes, p as Search } from "../_libs/lucide-react.mjs";
import { r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { o as getDrillsForAge, t as CATEGORY_LABELS } from "./drills-DBQZjy_r.mjs";
import { t as DrillCard } from "./drill-card-DkBx0-r-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drills.index-CdRD7XB_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var filters = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "cones",
		label: "Cone sheet"
	},
	{
		id: "fundamentals",
		label: CATEGORY_LABELS.fundamentals
	},
	{
		id: "warmup",
		label: CATEGORY_LABELS.warmup
	},
	{
		id: "conditioning",
		label: CATEGORY_LABELS.conditioning
	},
	{
		id: "agility",
		label: CATEGORY_LABELS.agility
	},
	{
		id: "strength",
		label: CATEGORY_LABELS.strength
	},
	{
		id: "position",
		label: CATEGORY_LABELS.position
	},
	{
		id: "team",
		label: CATEGORY_LABELS.team
	},
	{
		id: "special-teams",
		label: CATEGORY_LABELS["special-teams"]
	},
	{
		id: "cooldown",
		label: CATEGORY_LABELS.cooldown
	}
];
function DrillsPage() {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const completedDrills = useProgressStore((s) => s.completedDrills);
	const ageBand = useProgressStore((s) => s.ageBand);
	const contactCap = useProgressStore((s) => s.contactCap);
	const scrollerRef = (0, import_react.useRef)(null);
	const chipRefs = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const [canScrollLeft, setCanScrollLeft] = (0, import_react.useState)(false);
	const [canScrollRight, setCanScrollRight] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return getDrillsForAge(ageBand, contactCap).filter((d) => {
			if (category === "cones") {
				if (d.series !== "cone-agilities") return false;
			} else if (category !== "all" && d.category !== category) return false;
			if (!q) return true;
			return d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.equipment.some((e) => e.toLowerCase().includes(q)) || (d.movementMix?.some((m) => m.toLowerCase().includes(q)) ?? false);
		});
	}, [
		category,
		query,
		ageBand,
		contactCap
	]);
	const updateScrollHints = () => {
		const el = scrollerRef.current;
		if (!el) return;
		const max = el.scrollWidth - el.clientWidth;
		setCanScrollLeft(el.scrollLeft > 2);
		setCanScrollRight(max - el.scrollLeft > 2);
	};
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		updateScrollHints();
		el.addEventListener("scroll", updateScrollHints, { passive: true });
		const ro = new ResizeObserver(updateScrollHints);
		ro.observe(el);
		const t = window.setTimeout(updateScrollHints, 100);
		return () => {
			el.removeEventListener("scroll", updateScrollHints);
			ro.disconnect();
			window.clearTimeout(t);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const chip = chipRefs.current.get(category);
		if (!chip) return;
		chip.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest"
		});
		const t = window.setTimeout(updateScrollHints, 320);
		return () => window.clearTimeout(t);
	}, [category]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Drill library",
		subtitle: "Non-contact",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/cones",
				className: "mb-4 flex items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_45%,var(--color-surface))] p-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shapes, {
							className: "size-5",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-[var(--color-fg)]",
						children: "Cone Agilities sheet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[var(--color-muted)]",
						children: "12 patterns with diagrams · Box, M, 360, 8, X"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					tabIndex: -1,
					children: "Open"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-subtle)]",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search drills, equipment…",
					className: "h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-3 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-subtle)] focus:border-[var(--color-border-strong)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-primary)_35%,transparent)]"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative -mx-4 mb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: scrollerRef,
						role: "tablist",
						"aria-label": "Filter drills by category. Swipe sideways for more filters.",
						className: cn("flex w-full max-w-none flex-nowrap gap-2 overflow-x-auto overflow-y-hidden", "overscroll-x-contain px-4 pb-1.5", "touch-pan-x [-webkit-overflow-scrolling:touch]", "[scrollbar-width:thin] [scrollbar-color:var(--color-border-strong)_transparent]"),
						children: [filters.map((f) => {
							const active = category === f.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								ref: (node) => {
									if (node) chipRefs.current.set(f.id, node);
									else chipRefs.current.delete(f.id);
								},
								type: "button",
								role: "tab",
								"aria-selected": active,
								onClick: () => setCategory(f.id),
								className: cn("h-9 shrink-0 grow-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)]", active ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
								children: f.label
							}, f.id);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block w-3 shrink-0 grow-0 basis-3",
							"aria-hidden": true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: cn("pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent transition-opacity duration-[var(--duration-fast)]", canScrollLeft ? "opacity-100" : "opacity-0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: cn("pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent transition-opacity duration-[var(--duration-fast)]", canScrollRight ? "opacity-100" : "opacity-0")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-xs text-[var(--color-subtle)]",
				children: [
					filtered.length,
					" drill",
					filtered.length === 1 ? "" : "s",
					" · all non-contact"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [filtered.map((drill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillCard, {
					drill,
					done: completedDrills.includes(drill.id)
				}, drill.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-muted)]",
					children: "No drills match that search."
				})]
			})
		]
	});
}
//#endregion
export { DrillsPage as component };
