import { g as Link, j as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { j as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Badge, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { a as getDrillById } from "./drills-DBQZjy_r.mjs";
import { t as AGE_BAND_LABELS } from "./levels-yAZNJoGC.mjs";
import { t as DrillCard } from "./drill-card-DkBx0-r-.mjs";
import { t as getPositionById } from "./positions-G0lvLfYs.mjs";
import { t as Route } from "./positions._positionId-BiugLQ3t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/positions._positionId-BkFkpJy8.js
var import_jsx_runtime = require_jsx_runtime();
function PositionDetailPage() {
	const { positionId } = Route.useParams();
	const pos = getPositionById(positionId);
	if (!pos) throw notFound();
	const ageBand = useProgressStore((s) => s.ageBand);
	const ageNote = pos.ageNotes[ageBand];
	const drills = pos.drillIds.map((id) => getDrillById(id)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				className: "-ml-2 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/positions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }), " Positions"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "default",
					children: pos.shortName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: pos.group
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[2rem] font-semibold leading-none tracking-tight",
				children: pos.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-[var(--color-muted)]",
				children: pos.summary
			}),
			ageNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_30%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_35%,var(--color-surface))] p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]",
					children: [AGE_BAND_LABELS[ageBand], " emphasis"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm leading-relaxed text-[var(--color-fg)]",
					children: ageNote
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Keys to the room"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: pos.keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-muted)]",
						children: k
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Featured drills"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: drills.map((d) => d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillCard, { drill: d }, d.id))
				})]
			})
		]
	});
}
//#endregion
export { PositionDetailPage as component };
