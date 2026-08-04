import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { i as SEASON_LABELS, r as CONTACT_LABELS, t as AGE_BAND_LABELS } from "./levels-yAZNJoGC.mjs";
import { i as getPlansForTrack, s as programTracks } from "./programs-C5ej9dd4.mjs";
import { t as PlanCard } from "./plan-card-C8oop9yy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans.index-DR9OBhM7.js
var import_jsx_runtime = require_jsx_runtime();
function PlansPage() {
	const completedPlans = useProgressStore((s) => s.completedPlans);
	const selectedTrackId = useProgressStore((s) => s.selectedTrackId);
	const setSelectedTrackId = useProgressStore((s) => s.setSelectedTrackId);
	const ageBand = useProgressStore((s) => s.ageBand);
	const recommended = programTracks.filter((t) => t.ageBands.includes(ageBand));
	const other = programTracks.filter((t) => !t.ageBands.includes(ageBand));
	const ordered = [...recommended, ...other];
	const trackId = selectedTrackId;
	const plans = getPlansForTrack(trackId);
	const activeTrack = programTracks.find((t) => t.id === trackId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Programs",
		subtitle: "Youth → adult",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm leading-relaxed text-[var(--color-muted)]",
				children: "Multi-day camps, shells progressions, install weeks, and in-season game week templates — filtered by your level on Home."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:thin]",
				children: ordered.map((t) => {
					const active = t.id === trackId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedTrackId(t.id),
						className: cn("h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap", active ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
						children: t.shortName
					}, t.id);
				})
			}),
			activeTrack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: SEASON_LABELS[activeTrack.season] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: CONTACT_LABELS[activeTrack.contactCap]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								children: [activeTrack.days, " days"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: activeTrack.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[var(--color-muted)]",
						children: activeTrack.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-[var(--color-subtle)]",
						children: ["Ages: ", activeTrack.ageBands.map((a) => AGE_BAND_LABELS[a]).join(" · ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1",
						children: activeTrack.goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm text-[var(--color-fg)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--color-primary)]",
									children: "·"
								}),
								" ",
								g
							]
						}, g))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, {
					plan,
					completed: completedPlans.includes(plan.id)
				}, plan.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/safety",
				className: "mt-8 mb-2 block text-center text-sm font-medium text-[var(--color-primary)]",
				children: "Review safety & contact standards →"
			})
		]
	});
}
//#endregion
export { PlansPage as component };
