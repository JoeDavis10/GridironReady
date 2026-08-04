import { g as Link, j as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Check, _ as ListOrdered, d as ShieldAlert, j as ArrowLeft, n as Wrench, s as Target, y as Heart } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as ConeDiagram } from "./cone-diagram-CuvlPvSj.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { t as Route } from "./drills._drillId-Clyps6wJ.mjs";
import { n as SessionTimer, t as DrillAnimator } from "./session-timer-6oMD5D05.mjs";
import { a as getDrillById, n as INTENSITY_LABELS, r as POSITION_LABELS, t as CATEGORY_LABELS } from "./drills-DBQZjy_r.mjs";
import { r as CONTACT_LABELS } from "./levels-yAZNJoGC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drills._drillId-D6mh5LDm.js
var import_jsx_runtime = require_jsx_runtime();
function DrillDetailPage() {
	const { drillId } = Route.useParams();
	const drill = getDrillById(drillId);
	if (!drill) throw notFound();
	const completedDrills = useProgressStore((s) => s.completedDrills);
	const favorites = useProgressStore((s) => s.favorites);
	const completeDrill = useProgressStore((s) => s.completeDrill);
	const toggleFavorite = useProgressStore((s) => s.toggleFavorite);
	const done = completedDrills.includes(drill.id);
	const fav = favorites.includes(drill.id);
	const isCone = drill.series === "cone-agilities";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "-ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: isCone ? "/cones" : "/drills",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }),
							" ",
							isCone ? "Cone sheet" : "Library"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": fav ? "Remove favorite" : "Favorite",
					onClick: () => toggleFavorite(drill.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: cn(fav && "fill-[var(--color-primary)] text-[var(--color-primary)]"),
						"aria-hidden": true
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: CATEGORY_LABELS[drill.category] }),
							isCone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: "Cone sheet"
							}),
							drill.contactLevel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: drill.contactLevel === "air" ? "secondary" : "warn",
								children: CONTACT_LABELS[drill.contactLevel]
							}),
							drill.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: drill.level === "advanced" ? "warn" : "secondary",
								children: drill.level
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: drill.intensity === "high" ? "warn" : drill.intensity === "moderate" ? "info" : "secondary",
								children: INTENSITY_LABELS[drill.intensity]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "Non-contact"
							}),
							done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: "Completed"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[2rem] font-semibold leading-none tracking-tight",
						children: drill.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-[var(--color-muted)]",
						children: drill.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
								children: [drill.durationMin, " min"]
							}),
							drill.totalYards && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
								children: [drill.totalYards, " yards"]
							}),
							drill.sets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
								children: [drill.sets, " sets"]
							}),
							drill.reps && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
								children: drill.reps
							}),
							drill.restSec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
								children: [drill.restSec, "s rest"]
							})
						]
					}),
					drill.movementMix && drill.movementMix.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 pt-1",
						children: drill.movementMix.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: m
						}, m))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Guided walkthrough"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillAnimator, { drill })]
			}),
			drill.diagramId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Static pattern"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConeDiagram, { diagramId: drill.diagramId })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimer, {
					initialSeconds: drill.durationMin * 60,
					label: "Drill clock"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-[var(--color-primary)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
						className: "size-4",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium uppercase tracking-[0.12em]",
						children: "Objective"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[var(--color-fg)]",
					children: drill.objective
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Wrench,
				title: "Setup",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: drill.setup.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-sm text-[var(--color-muted)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-[var(--color-primary)]" }), item]
					}, item))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: drill.equipment.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: e
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				icon: ListOrdered,
				title: "How to run it",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-3",
					children: drill.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-elevated)] font-display text-xs font-semibold text-[var(--color-primary)]",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pt-0.5 text-[var(--color-muted)]",
							children: s
						})]
					}, s))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Coaching cues",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: drill.cues.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-fg)]",
						children: c
					}, c))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Progressions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: drill.progressions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-[var(--color-muted)]",
						children: ["· ", p]
					}, p))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				icon: ShieldAlert,
				title: "Safety",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: drill.safety.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-[var(--color-warn)]",
						children: s
					}, s))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Position fit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: drill.positions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: POSITION_LABELS[p]
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					size: "lg",
					variant: done ? "secondary" : "default",
					onClick: () => completeDrill(drill.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { "aria-hidden": true }), done ? "Marked complete" : "Mark drill complete"]
				})
			})
		]
	});
}
function Section({ title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-[var(--color-primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
				children: title
			})]
		}), children]
	});
}
//#endregion
export { DrillDetailPage as component };
