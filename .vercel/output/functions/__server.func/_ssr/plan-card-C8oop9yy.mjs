import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Check, T as ChevronRight, u as Shield, w as Clock3 } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn } from "./badge-D9EcA40i.mjs";
import { n as INTENSITY_LABELS } from "./drills-DBQZjy_r.mjs";
import { r as getPlanDrillCount, t as PHASE_LABELS } from "./programs-C5ej9dd4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plan-card-C8oop9yy.js
var import_jsx_runtime = require_jsx_runtime();
var helmetLabel = {
	none: "No helmets",
	helmets: "Helmets",
	shells: "Shells"
};
function PlanCard({ plan, completed = false, featured = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/plans/$planId",
		params: { planId: plan.id },
		className: cn("block rounded-[var(--radius-xl)] border p-4 transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-smooth)] active:scale-[0.99]", featured ? "border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_55%,var(--color-surface))]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["Day ", plan.day]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: PHASE_LABELS[plan.phase]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: plan.intensity === "high" ? "warn" : plan.intensity === "moderate" ? "info" : "secondary",
								children: INTENSITY_LABELS[plan.intensity]
							}),
							completed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "default",
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-3",
									"aria-hidden": true
								}), "Complete"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-semibold leading-tight tracking-tight",
						children: plan.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[var(--color-muted)]",
						children: plan.focus
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 text-xs text-[var(--color-subtle)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									plan.totalMinutes,
									" min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									helmetLabel[plan.helmets],
									" · Non-contact"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [getPlanDrillCount(plan), " drills"] })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "mt-1 size-5 shrink-0 text-[var(--color-subtle)]",
				"aria-hidden": true
			})]
		})
	});
}
//#endregion
export { PlanCard as t };
