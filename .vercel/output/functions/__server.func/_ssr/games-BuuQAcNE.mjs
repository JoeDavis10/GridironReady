import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { T as ChevronRight, b as Gamepad2, o as Timer, r as Users, t as Zap } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { n as competitiveGames, t as KIND_LABELS } from "./games-BZ3st5ND.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games-BuuQAcNE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var filters = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "playable",
		label: "Playable"
	},
	{
		id: "relay",
		label: KIND_LABELS.relay
	},
	{
		id: "race",
		label: KIND_LABELS.race
	},
	{
		id: "reaction",
		label: KIND_LABELS.reaction
	},
	{
		id: "team",
		label: KIND_LABELS.team
	},
	{
		id: "skill",
		label: KIND_LABELS.skill
	}
];
function GamesLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname !== "/games" && pathname.startsWith("/games/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GamesPage, {});
}
function GamesPage() {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		return competitiveGames.filter((g) => {
			if (filter === "all") return true;
			if (filter === "playable") return Boolean(g.playableId);
			return g.kind === filter;
		});
	}, [filter]);
	const playableCount = competitiveGames.filter((g) => g.playableId).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Competitive games",
		subtitle: "Non-contact · camp energy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {
							className: "size-5",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "Compete without contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm leading-relaxed text-[var(--color-muted)]",
						children: [
							competitiveGames.length,
							" field games · ",
							playableCount,
							" playable mini-games — relays, reaction wars, and skill gauntlets with zero tackling."
						]
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-3 gap-2",
				children: [
					{
						icon: Zap,
						label: "High energy"
					},
					{
						icon: Users,
						label: "Team vs team"
					},
					{
						icon: Timer,
						label: "8–12 min"
					}
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(x.icon, {
						className: "mx-auto mb-1 size-4 text-[var(--color-primary)]",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium text-[var(--color-muted)]",
						children: x.label
					})]
				}, x.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative -mx-4 mt-6 mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "tablist",
					"aria-label": "Filter games. Swipe sideways for more.",
					className: cn("flex w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden", "overscroll-x-contain px-4 pb-1.5 touch-pan-x", "[-webkit-overflow-scrolling:touch] [scrollbar-width:thin]", "[scrollbar-color:var(--color-border-strong)_transparent]"),
					children: [filters.map((f) => {
						const active = filter === f.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": active,
							onClick: () => setFilter(f.id),
							className: cn("h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)]", active ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
							children: f.label
						}, f.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-2 shrink-0",
						"aria-hidden": true
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-xs text-[var(--color-subtle)]",
				children: [
					filtered.length,
					" game",
					filtered.length === 1 ? "" : "s"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [filtered.map((game) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/games/$gameId",
					params: { gameId: game.id },
					className: "block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color,transform] active:scale-[0.99] hover:border-[var(--color-border-strong)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: KIND_LABELS[game.kind] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: game.intensity === "high" ? "warn" : "info",
											children: game.intensity
										}),
										game.playableId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: "Playable"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl font-semibold leading-tight tracking-tight",
									children: game.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-[var(--color-muted)]",
									children: game.summary
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[var(--color-subtle)]",
									children: [
										game.durationMin,
										" min · ",
										game.players
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "mt-1 size-5 shrink-0 text-[var(--color-subtle)]",
							"aria-hidden": true
						})]
					})
				}, game.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-muted)]",
					children: "No games in that filter."
				})]
			})
		]
	});
}
//#endregion
export { GamesLayout as component };
