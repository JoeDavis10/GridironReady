import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as Trophy, m as RotateCcw, y as Heart } from "../_libs/lucide-react.mjs";
import { n as Badge, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { a as getDrillById, i as drills } from "./drills-DBQZjy_r.mjs";
import { a as getProgramPlanById, n as allProgramPlans } from "./programs-C5ej9dd4.mjs";
import { t as Progress } from "./progress-CayiJjUR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-QLAayE11.js
var import_jsx_runtime = require_jsx_runtime();
function ProgressPage() {
	const completedPlans = useProgressStore((s) => s.completedPlans);
	const completedDrills = useProgressStore((s) => s.completedDrills);
	const favorites = useProgressStore((s) => s.favorites);
	const activeDay = useProgressStore((s) => s.activeDay);
	const resetProgress = useProgressStore((s) => s.resetProgress);
	const planPct = Math.round(completedPlans.length / allProgramPlans.length * 100);
	const drillPct = Math.round(completedDrills.length / drills.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Progress",
		subtitle: "Program tracking",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
							className: "size-5",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: "Active day"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-2xl font-semibold",
						children: ["Day ", activeDay]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[var(--color-muted)]",
							children: "Practices complete"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-[var(--color-fg)]",
							children: [
								completedPlans.length,
								"/",
								allProgramPlans.length
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: planPct })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[var(--color-muted)]",
							children: "Drills logged"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-[var(--color-fg)]",
							children: [
								completedDrills.length,
								"/",
								drills.length
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: drillPct })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Completed practices"
				}), completedPlans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					text: "Finish a practice day to track camp progress.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/plans",
							children: "Open camp plan"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: completedPlans.map((id) => {
						const plan = getProgramPlanById(id);
						if (!plan) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/plans/$planId",
							params: { planId: id },
							className: "flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: plan.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-[var(--color-subtle)]",
								children: ["Day ", plan.day]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Done" })]
						}) }, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "size-4 text-[var(--color-primary)]",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "Favorites"
					})]
				}), favorites.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Heart drills you want in every practice." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: favorites.map((id) => {
						const drill = getDrillById(id);
						if (!drill) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/drills/$drillId",
							params: { drillId: id },
							className: "block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm font-medium",
							children: drill.name
						}) }, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl font-semibold tracking-tight",
					children: "Recently logged drills"
				}), completedDrills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Mark drills complete from the library or a live session." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: [...completedDrills].reverse().slice(0, 8).map((id) => {
						const drill = getDrillById(id);
						if (!drill) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-muted)]",
							children: drill.name
						}, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: () => {
						if (typeof window !== "undefined" && window.confirm("Reset all camp progress on this device?")) resetProgress();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Reset progress"]
				})
			})
		]
	});
}
function Empty({ text, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-[var(--color-muted)]",
			children: text
		}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex justify-center",
			children: action
		})]
	});
}
//#endregion
export { ProgressPage as component };
