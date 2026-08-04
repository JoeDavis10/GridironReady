import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as ArrowRight, b as Gamepad2, f as Shapes, k as BookOpen, r as Users, u as Shield } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as ConeDiagram } from "./cone-diagram-CuvlPvSj.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { i as drills } from "./drills-DBQZjy_r.mjs";
import { r as CONTACT_LABELS, t as AGE_BAND_LABELS } from "./levels-yAZNJoGC.mjs";
import { t as DrillCard } from "./drill-card-DkBx0-r-.mjs";
import { i as getPlansForTrack, o as getTrackById, s as programTracks } from "./programs-C5ej9dd4.mjs";
import { t as PlanCard } from "./plan-card-C8oop9yy.mjs";
import { t as Progress } from "./progress-CayiJjUR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C6o0ekvA.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const completedPlans = useProgressStore((s) => s.completedPlans);
	const activeDay = useProgressStore((s) => s.activeDay);
	const ageBand = useProgressStore((s) => s.ageBand);
	const contactCap = useProgressStore((s) => s.contactCap);
	const selectedTrackId = useProgressStore((s) => s.selectedTrackId);
	const setAgeBand = useProgressStore((s) => s.setAgeBand);
	const setContactCap = useProgressStore((s) => s.setContactCap);
	const setSelectedTrackId = useProgressStore((s) => s.setSelectedTrackId);
	const track = getTrackById(selectedTrackId) ?? programTracks[2];
	const trackPlans = getPlansForTrack(track.id);
	const today = trackPlans.find((p) => p.day === activeDay) ?? trackPlans[0] ?? trackPlans[0];
	const trackDone = trackPlans.filter((p) => completedPlans.includes(p.id)).length;
	const progressPct = trackPlans.length ? Math.round(trackDone / trackPlans.length * 100) : 0;
	const featuredDrills = drills.filter((d) => [
		"form-tackle-fit-progression",
		"cone-base-inside-box",
		"seven-on-seven",
		"inside-run-thud"
	].includes(d.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 opacity-[0.14]",
				style: { background: "radial-gradient(ellipse 80% 60% at 100% 0%, var(--color-primary), transparent 55%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							children: "Youth → adult"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Tackle football"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-subtle)]",
						children: "Gridiron Ready"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-[2.25rem] font-semibold leading-[0.95] tracking-tight text-[var(--color-fg)]",
						children: [
							"Full-field",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"football training."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-sm text-sm leading-relaxed text-[var(--color-muted)]",
						children: "Programs, fundamentals, position rooms, contact progressions, and competitive games — built for youth through adult tackle football."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/plans/$planId",
								params: { planId: today.id },
								children: [
									"Continue day ",
									today.day,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { "aria-hidden": true })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/plans",
								children: "Programs"
							})
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Your level"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none]",
					children: Object.keys(AGE_BAND_LABELS).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setAgeBand(a);
							const next = programTracks.find((t) => t.ageBands.includes(a));
							if (next) setSelectedTrackId(next.id);
						},
						className: cn("h-9 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap", ageBand === a ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
						children: AGE_BAND_LABELS[a]
					}, a))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Contact ceiling"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none]",
					children: Object.keys(CONTACT_LABELS).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setContactCap(c),
						className: cn("h-9 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap", contactCap === c ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
						children: CONTACT_LABELS[c]
					}, c))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_7.5rem] gap-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-[var(--color-primary)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shapes, {
								className: "size-4",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.12em]",
								children: "Animated COD"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold leading-tight tracking-tight",
							children: "Cone Agilities"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-[var(--color-muted)]",
							children: "12 patterns with step-by-step motion and coaching cues."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cones",
								children: ["Open sheet ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { "aria-hidden": true })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-l border-[var(--color-border)] bg-[var(--color-elevated)] p-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConeDiagram, {
						diagramId: "advanced-inside-box",
						compact: true,
						showLegend: false
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/positions",
					className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
							className: "mb-2 size-4 text-[var(--color-primary)]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Positions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-[var(--color-muted)]",
							children: "9 rooms"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/safety",
					className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
							className: "mb-2 size-4 text-[var(--color-primary)]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Safety"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-[var(--color-muted)]",
							children: "Standards"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/drills",
					className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
							className: "mb-2 size-4 text-[var(--color-primary)]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Drill library"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-[var(--color-muted)]",
							children: [drills.length, "+ drills"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/games",
					className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {
							className: "mb-2 size-4 text-[var(--color-primary)]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Games"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-[var(--color-muted)]",
							children: "Compete"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/progress",
			className: "mt-4 block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: [track.shortName, " progress"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-2xl font-semibold tabular",
					children: [
						trackDone,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[var(--color-subtle)]",
							children: ["/", trackPlans.length]
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-medium text-[var(--color-muted)]",
							children: "days"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm tabular text-[var(--color-primary)]",
					children: [progressPct, "%"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progressPct })]
		}),
		today && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: "Today's practice"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/plans",
					className: "text-sm font-medium text-[var(--color-primary)]",
					children: "All programs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, {
				plan: today,
				featured: true,
				completed: completedPlans.includes(today.id)
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: "Featured drills"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/drills",
					className: "text-sm font-medium text-[var(--color-primary)]",
					children: "Library"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: featuredDrills.map((drill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillCard, {
					drill,
					compact: true
				}, drill.id))
			})]
		})
	] });
}
//#endregion
export { HomePage as component };
