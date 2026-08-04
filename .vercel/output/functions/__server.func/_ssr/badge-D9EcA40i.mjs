import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as CalendarDays, b as Gamepad2, k as BookOpen, r as Users, v as House } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-D9EcA40i.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatClock(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
var nav = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/plans",
		label: "Programs",
		icon: CalendarDays
	},
	{
		to: "/drills",
		label: "Drills",
		icon: BookOpen
	},
	{
		to: "/positions",
		label: "Positions",
		icon: Users
	},
	{
		to: "/games",
		label: "Games",
		icon: Gamepad2
	}
];
function AppShell({ children, title, subtitle, action, hideNav = false }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] w-full max-w-lg flex-col bg-[var(--color-bg)]",
		children: [
			(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-[var(--grok-banner-h,0px)] z-20 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] px-4 pb-3 pt-3 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-subtle)]",
							children: subtitle
						}), title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-[1.75rem] font-semibold leading-none tracking-tight text-[var(--color-fg)]",
							children: title
						})]
					}), action]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("flex-1 px-4 pt-4", hideNav ? "pb-8" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))]"),
				children
			}),
			!hideNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface)_94%,transparent)] backdrop-blur-md",
				style: { paddingBottom: "env(safe-area-inset-bottom)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-16 max-w-lg items-stretch justify-around px-1",
					children: nav.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors", active ? "text-[var(--color-primary)]" : "text-[var(--color-subtle)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: cn("size-5", active && "stroke-[2.25]"),
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.to);
					})
				})
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-transparent bg-[var(--color-primary-dim)] text-[var(--color-primary)]",
		secondary: "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]",
		outline: "border-[var(--color-border-strong)] text-[var(--color-muted)]",
		warn: "border-transparent bg-[color-mix(in_oklab,var(--color-warn)_18%,transparent)] text-[var(--color-warn)]",
		info: "border-transparent bg-[color-mix(in_oklab,var(--color-info)_18%,transparent)] text-[var(--color-info)]"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { formatClock as i, Badge as n, cn as r, AppShell as t };
