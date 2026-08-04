import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link, j as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Check, E as ChevronLeft, T as ChevronRight, j as ArrowLeft, x as Flag } from "../_libs/lucide-react.mjs";
import { n as Badge, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { n as SessionTimer, t as DrillAnimator } from "./session-timer-6oMD5D05.mjs";
import { a as getDrillById } from "./drills-DBQZjy_r.mjs";
import { r as getGameById } from "./games-BZ3st5ND.mjs";
import { a as getProgramPlanById } from "./programs-C5ej9dd4.mjs";
import { t as Progress } from "./progress-CayiJjUR.mjs";
import { t as Route } from "./session._planId-BYpI_ecl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session._planId-CH6OBdHd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionPage() {
	const { planId } = Route.useParams();
	const plan = getProgramPlanById(planId);
	if (!plan) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionRunner, { plan });
}
function SessionRunner({ plan }) {
	const navigate = useNavigate();
	const completePlan = useProgressStore((s) => s.completePlan);
	const completeDrill = useProgressStore((s) => s.completeDrill);
	const setActiveDay = useProgressStore((s) => s.setActiveDay);
	const steps = (0, import_react.useMemo)(() => {
		return plan.blocks.flatMap((block, bi) => block.drillIds.map((drillId, di) => ({
			blockTitle: block.title,
			blockMinutes: block.minutes,
			blockIndex: bi,
			drillIndex: di,
			drillId,
			notes: block.notes
		})));
	}, [plan]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const step = steps[index];
	if (!step) throw notFound();
	const drill = getDrillById(step.drillId);
	if (!drill) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionStep, {
		plan,
		drill,
		step,
		index,
		total: steps.length,
		onPrev: () => setIndex((i) => Math.max(0, i - 1)),
		onNext: () => {
			completeDrill(drill.id);
			setIndex((i) => Math.min(steps.length - 1, i + 1));
		},
		onFinish: () => {
			completeDrill(drill.id);
			completePlan(plan.id);
			setActiveDay(Math.min(10, plan.day + 1));
			navigate({ to: "/progress" });
		}
	});
}
function SessionStep({ plan, drill, step, index, total, onPrev, onNext, onFinish }) {
	const pct = Math.round((index + 1) / total * 100);
	const isLast = index >= total - 1;
	const blockDrillCount = plan.blocks[step.blockIndex]?.drillIds.length ?? 1;
	const timerSeconds = Math.max(60, Math.round(step.blockMinutes * 60 / Math.max(1, blockDrillCount)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "-ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/plans/$planId",
						params: { planId: plan.id },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }), " Exit"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					children: [
						index + 1,
						"/",
						total
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between text-xs text-[var(--color-subtle)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Day ",
						plan.day,
						" · ",
						plan.title
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular",
						children: [pct, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: [step.blockTitle, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[var(--color-muted)]",
							children: [
								" ",
								"· ",
								step.blockMinutes,
								" min block"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-tight",
						children: drill.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[var(--color-muted)]",
						children: drill.objective
					}),
					step.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-xs text-[var(--color-muted)]",
						children: step.notes
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillAnimator, { drill }, drill.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimer, {
				initialSeconds: timerSeconds,
				label: "Block share timer"
			}, `timer-${step.drillId}-${index}`),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-2 gap-2 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					size: "lg",
					disabled: index === 0,
					onClick: onPrev,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { "aria-hidden": true }), " Prev"]
				}), !isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					onClick: onNext,
					children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { "aria-hidden": true })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					onClick: onFinish,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { "aria-hidden": true }), " Finish"]
				})]
			}),
			isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "mb-4 w-full",
				onClick: onFinish,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { "aria-hidden": true }), " Mark practice complete"]
			}),
			isLast && (plan.gameIds?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: "Competitive finishers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[var(--color-muted)]",
						children: "After drills, run these non-contact games to close practice."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: plan.gameIds.map((id) => {
							const game = getGameById(id);
							if (!game) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/games/$gameId",
								params: { gameId: id },
								className: "flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5 text-sm font-medium",
								children: [game.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-[var(--color-subtle)]",
									children: [game.durationMin, " min"]
								})]
							}) }, id);
						})
					})
				]
			})
		]
	});
}
//#endregion
export { SessionPage as component };
