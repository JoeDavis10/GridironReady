import { g as Link, j as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Check, T as ChevronRight, b as Gamepad2, h as Play, j as ArrowLeft, u as Shield, w as Clock3 } from "../_libs/lucide-react.mjs";
import { n as Badge, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { a as getDrillById, n as INTENSITY_LABELS } from "./drills-DBQZjy_r.mjs";
import { r as CONTACT_LABELS } from "./levels-yAZNJoGC.mjs";
import { t as DrillCard } from "./drill-card-DkBx0-r-.mjs";
import { r as getGameById, t as KIND_LABELS } from "./games-BZ3st5ND.mjs";
import { t as Route } from "./plans._planId-62Dn_Hve.mjs";
import { a as getProgramPlanById, t as PHASE_LABELS } from "./programs-C5ej9dd4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans._planId-C5pM3Y0J.js
var import_jsx_runtime = require_jsx_runtime();
var helmetLabel = {
	none: "No helmets",
	helmets: "Helmets only",
	shells: "Shells / pads posture"
};
function PlanDetailPage() {
	const { planId } = Route.useParams();
	const plan = getProgramPlanById(planId);
	if (!plan) throw notFound();
	const completedPlans = useProgressStore((s) => s.completedPlans);
	const completePlan = useProgressStore((s) => s.completePlan);
	const setActiveDay = useProgressStore((s) => s.setActiveDay);
	const completedDrills = useProgressStore((s) => s.completedDrills);
	const done = completedPlans.includes(plan.id);
	const games = (plan.gameIds ?? []).map((id) => getGameById(id)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "-ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/plans",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }), " Programs"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Day ", plan.day] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: PHASE_LABELS[plan.phase]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: INTENSITY_LABELS[plan.intensity]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: helmetLabel[plan.helmets]
					}),
					"contactCap" in plan && plan.contactCap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "warn",
						children: CONTACT_LABELS[plan.contactCap]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[2rem] font-semibold leading-none tracking-tight",
				children: plan.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[var(--color-muted)]",
				children: plan.focus
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-subtle)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
							className: "size-4",
							"aria-hidden": true
						}),
						plan.totalMinutes,
						" min"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
						className: "size-4",
						"aria-hidden": true
					}), plan.contact === "none" ? "Scripted contact level" : plan.contact]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/session/$planId",
						params: { planId: plan.id },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }), " Run practice"]
					})
				}), !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					size: "lg",
					className: "w-full",
					onClick: () => {
						completePlan(plan.id);
						setActiveDay(Math.min(99, plan.day + 1));
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { "aria-hidden": true }), " Mark day complete"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "justify-center py-2",
					children: "Completed"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Objectives"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: plan.objectives.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-muted)]",
						children: o
					}, o))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Practice blocks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-5",
					children: plan.blocks.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex items-end justify-between gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
								children: [
									"Block ",
									i + 1,
									" · ",
									block.minutes,
									" min"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold tracking-tight",
								children: block.title
							})] })
						}),
						block.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs text-[var(--color-muted)]",
							children: block.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: block.drillIds.map((id) => {
								const drill = getDrillById(id);
								if (!drill) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillCard, {
									drill,
									compact: true,
									done: completedDrills.includes(id)
								}, id);
							})
						})
					] }, `${block.title}-${i}`))
				})]
			}),
			games.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {
						className: "size-4 text-[var(--color-primary)]",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "Competitive games"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: games.map((g) => g ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/games/$gameId",
						params: { gameId: g.id },
						className: "flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: g.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[var(--color-subtle)]",
							children: [
								KIND_LABELS[g.kind],
								" · ",
								g.durationMin,
								" min"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-4 text-[var(--color-subtle)]",
							"aria-hidden": true
						})]
					}) }, g.id) : null)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Coach notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: plan.coachNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5 text-sm text-[var(--color-muted)]",
						children: n
					}, n))
				})]
			})
		]
	});
}
//#endregion
export { PlanDetailPage as component };
