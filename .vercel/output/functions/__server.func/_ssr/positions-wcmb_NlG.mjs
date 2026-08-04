import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { T as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Badge, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { n as AGE_BAND_SHORT } from "./levels-yAZNJoGC.mjs";
import { n as positions } from "./positions-G0lvLfYs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/positions-wcmb_NlG.js
var import_jsx_runtime = require_jsx_runtime();
function PositionsLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname !== "/positions" && pathname.startsWith("/positions/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PositionsPage, {});
}
function PositionsPage() {
	const ageBand = useProgressStore((s) => s.ageBand);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Positions",
		subtitle: `${AGE_BAND_SHORT[ageBand]} focus`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 text-sm leading-relaxed text-[var(--color-muted)]",
				children: "Position rooms with keys, age notes, and linked drills — youth through adult."
			}),
			[
				{
					id: "offense",
					label: "Offense"
				},
				{
					id: "defense",
					label: "Defense"
				},
				{
					id: "special",
					label: "Special teams"
				}
			].map((g) => {
				const items = positions.filter((p) => p.group === g.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-lg font-semibold tracking-tight",
						children: g.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: items.map((pos) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/positions/$positionId",
							params: { positionId: pos.id },
							className: "flex items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-[border-color,transform] active:scale-[0.99] hover:border-[var(--color-border-strong)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: pos.shortName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg font-semibold tracking-tight",
										children: pos.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2",
									children: pos.summary
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-5 shrink-0 text-[var(--color-subtle)]",
								"aria-hidden": true
							})]
						}, pos.id))
					})]
				}, g.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/safety",
				className: "mb-2 block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-4 py-3 text-center text-sm font-medium text-[var(--color-primary)]",
				children: "Safety & contact standards →"
			})
		]
	});
}
//#endregion
export { PositionsLayout as component };
