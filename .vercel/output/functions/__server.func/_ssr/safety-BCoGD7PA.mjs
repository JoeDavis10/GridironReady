import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { j as ArrowLeft, u as Shield } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { t as useProgressStore } from "./progress-sc8Z9FnX.mjs";
import { r as CONTACT_LABELS, t as AGE_BAND_LABELS } from "./levels-yAZNJoGC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/safety-BCoGD7PA.js
var import_jsx_runtime = require_jsx_runtime();
var safetyTopics = [
	{
		id: "heat-acclimation",
		title: "Heat & hydration protocol",
		category: "heat",
		summary: "Most early-camp emergencies are heat-related. Build volume gradually and never shame water breaks.",
		points: [
			"Days 1–2: shorter sessions, more shade breaks, lighter conditioning",
			"Water available on every period — schedule mandatory drink times",
			"Watch for dizziness, stop sweating, confusion, or extreme fatigue — stop and cool immediately",
			"Never use conditioning as punishment in extreme heat",
			"Cold tubs / ice towels staged for high-risk days"
		]
	},
	{
		id: "contact-progression",
		title: "Contact progression ladder",
		category: "contact",
		summary: "Players earn contact. Air → shells fit → thud wrap → limited live. Skipping steps raises injury risk.",
		points: [
			"Air: technique, pursuit, and competition without wrapping people up",
			"Shells: pad level and hand placement; no takedowns",
			"Thud: form tackle to a controlled stop or wrap-and-release",
			"Live: short windows, clear whistle, matched size when possible",
			"Youth and middle school: cap live periods; emphasize form over collision seeking"
		],
		ageFocus: [
			"youth",
			"middle",
			"high-school"
		]
	},
	{
		id: "head-safety",
		title: "Head & neck safety",
		category: "concussion",
		summary: "Heads up. No launching. No helmet-as-weapon. Remove and evaluate any suspected concussion.",
		points: [
			"Teach see-what-you-hit: eyes up through contact",
			"No leading with the crown of the helmet — ever",
			"Any suspected concussion: remove from play, no same-day return without medical clearance",
			"Coach language matters — never praise 'blowing someone up' with the head",
			"Neck strength and proper fit of helmets are non-negotiable"
		]
	},
	{
		id: "equipment-fit",
		title: "Equipment fit checklist",
		category: "equipment",
		summary: "Ill-fitting gear is an injury multiplier. Check before the first contact period.",
		points: [
			"Helmet: snug, proper inflation, chinstrap secured, no excessive movement",
			"Shoulder pads: cover AC joints, straps tight, no riding up into the neck",
			"Mouthguard: always for contact periods",
			"Cleats appropriate for surface; no metal where banned",
			"Youth: re-check fit mid-season — kids grow"
		]
	},
	{
		id: "practice-culture",
		title: "Practice culture & whistle discipline",
		category: "culture",
		summary: "Pro-grade teams are loud on communication and quiet on cheap shots. Standards start on day one.",
		points: [
			"Whistle means freeze — no extra hits after the echo",
			"Match effort without targeting smaller or injured teammates",
			"Celebrate technique and teamwork louder than highlight hits",
			"Water, shade, and recovery are part of toughness — not softness",
			"Parents/athletes know the contact plan for the week in advance"
		]
	},
	{
		id: "youth-limits",
		title: "Youth contact limits",
		category: "contact",
		summary: "Young athletes need reps that teach, not wars that grind. Limit full-speed player-vs-player contact.",
		points: [
			"Prioritize bags, shields, and form tackling circuits over live pileups",
			"Keep live periods short and purposeful with clear teaching goals",
			"Equalize matchups by size when contact is scheduled",
			"No bull-in-the-ring or survivor-style elimination contact games",
			"If technique collapses under fatigue, end the period"
		],
		ageFocus: ["youth", "middle"]
	}
];
var contactRulesByAge = {
	youth: {
		maxDefault: "shells",
		notes: [
			"Default to air + form circuits on soft surfaces",
			"Shells only after stance, start, and fit technique look clean",
			"Avoid multi-player pileups and blindside teaching periods"
		]
	},
	middle: {
		maxDefault: "thud",
		notes: [
			"Shells and thud after a multi-day air base",
			"Live only in short, coached windows if program allows",
			"Emphasize wrap-and-release over driving through every rep"
		]
	},
	"high-school": {
		maxDefault: "live",
		notes: [
			"Follow a written weekly contact plan",
			"Protect key skill players late week when possible",
			"Full live periods require medical coverage plan and heat awareness"
		]
	},
	"college-adult": {
		maxDefault: "live",
		notes: [
			"Periodize contact across the week (heavy early, light late)",
			"Scout-team safety and look-team rules are non-negotiable",
			"Load management for veterans is performance, not weakness"
		]
	}
};
var catLabel = {
	heat: "Heat",
	contact: "Contact",
	concussion: "Head",
	equipment: "Gear",
	culture: "Culture"
};
function SafetyPage() {
	const ageBand = useProgressStore((s) => s.ageBand);
	const setAgeBand = useProgressStore((s) => s.setAgeBand);
	const rules = contactRulesByAge[ageBand];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideNav: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				className: "-ml-2 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }), " Home"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 text-[var(--color-primary)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
					className: "size-5",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.14em]",
					children: "Non-negotiables"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[2rem] font-semibold leading-none tracking-tight",
				children: "Safety & standards"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-[var(--color-muted)]",
				children: "Pro-grade tackle football is built on progression, heat sense, and heads-up technique — for youth through adult."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: Object.keys(AGE_BAND_LABELS).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAgeBand(a),
					className: cn("h-9 rounded-full border px-3 text-xs font-medium", ageBand === a ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
					children: AGE_BAND_LABELS[a]
				}, a))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: ["Default contact ceiling · ", AGE_BAND_LABELS[ageBand]]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold text-[var(--color-primary)]",
						children: CONTACT_LABELS[rules.maxDefault]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: rules.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm text-[var(--color-muted)]",
							children: ["· ", n]
						}, n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 space-y-4",
				children: safetyTopics.map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex flex-wrap gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: catLabel[topic.category] ?? topic.category })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold tracking-tight",
							children: topic.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-[var(--color-muted)]",
							children: topic.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1.5",
							children: topic.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm leading-relaxed text-[var(--color-fg)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[var(--color-primary)]",
										children: "·"
									}),
									" ",
									p
								]
							}, p))
						})
					]
				}, topic.id))
			})
		]
	});
}
//#endregion
export { SafetyPage as component };
