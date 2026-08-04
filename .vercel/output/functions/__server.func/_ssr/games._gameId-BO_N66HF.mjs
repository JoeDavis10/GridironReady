import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, j as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as ShieldAlert, g as Pause, h as Play, i as Trophy, j as ArrowLeft, m as RotateCcw, s as Target, t as Zap } from "../_libs/lucide-react.mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-D9EcA40i.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
import { r as getGameById, t as KIND_LABELS } from "./games-BZ3st5ND.mjs";
import { t as Route } from "./games._gameId-GXj4BBG0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games._gameId-BO_N66HF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MiniGame({ id }) {
	if (id === "reaction") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactionWars, {});
	if (id === "pattern-race") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternRace, {});
	if (id === "whistle-chase") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhistleChase, {});
	if (id === "four-corner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FourCornerCall, {});
	if (id === "mirror-match") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MirrorMatch, {});
	if (id === "ball-secure") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BallSecure, {});
	if (id === "red-light") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedLightGame, {});
	if (id === "steal-bacon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StealBacon, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PursuitTap, {});
}
var CUE_META = {
	forward: {
		label: "Sprint forward",
		blasts: 1
	},
	right: {
		label: "Shuffle right",
		blasts: 2
	},
	left: {
		label: "Shuffle left",
		blasts: 3
	},
	back: {
		label: "Backpedal",
		blasts: 1
	}
};
function ReactionWars() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [lives, setLives] = (0, import_react.useState)(3);
	const [round, setRound] = (0, import_react.useState)(0);
	const [cue, setCue] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("Tap Play, then react to the whistle code.");
	const [flash, setFlash] = (0, import_react.useState)(false);
	const goAt = (0, import_react.useRef)(0);
	const timer = (0, import_react.useRef)(null);
	const clearTimer = () => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = null;
	};
	const startRound = (0, import_react.useCallback)(() => {
		clearTimer();
		setPhase("wait");
		setCue(null);
		setMsg("Listen…");
		setFlash(false);
		const delay = 800 + Math.random() * 1600;
		const opts = [
			"forward",
			"left",
			"right",
			"back"
		];
		const next = opts[Math.floor(Math.random() * opts.length)];
		timer.current = window.setTimeout(() => {
			setCue(next);
			setPhase("go");
			goAt.current = performance.now();
			setFlash(true);
			setMsg(next === "back" ? "LONG whistle — backpedal!" : `${CUE_META[next].blasts} whistle${CUE_META[next].blasts > 1 ? "s" : ""} — ${CUE_META[next].label}!`);
			timer.current = window.setTimeout(() => {
				setLives((l) => {
					const n = l - 1;
					if (n <= 0) {
						setPhase("over");
						setMsg("Out of lives — replay to train again.");
					} else {
						setPhase("result");
						setMsg("Too slow. −1 life");
					}
					return n;
				});
			}, 1400);
		}, delay);
	}, []);
	(0, import_react.useEffect)(() => () => clearTimer(), []);
	function answer(choice) {
		if (phase !== "go" || !cue) return;
		clearTimer();
		const rt = Math.round(performance.now() - goAt.current);
		setFlash(false);
		setRound((r) => r + 1);
		if (choice === cue) {
			const pts = Math.max(50, 400 - rt);
			setScore((s) => s + pts);
			setMsg(`Correct · ${rt}ms · +${pts}`);
			setPhase("result");
		} else setLives((l) => {
			const n = l - 1;
			if (n <= 0) {
				setPhase("over");
				setMsg("Wrong direction — game over.");
			} else {
				setPhase("result");
				setMsg(`Wrong — needed ${CUE_META[cue].label}. −1 life`);
			}
			return n;
		});
	}
	function reset() {
		clearTimer();
		setScore(0);
		setLives(3);
		setRound(0);
		setCue(null);
		setPhase("idle");
		setMsg("Tap Play, then react to the whistle code.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Whistle Reaction",
		subtitle: "1 forward · 2 right · 3 left · long = back",
		score,
		meta: `Lives ${lives} · Round ${round}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-3 rounded-[var(--radius-lg)] border px-3 py-6 text-center transition-colors", flash ? "border-[color-mix(in_oklab,var(--color-primary)_45%,var(--color-border))] bg-[var(--color-primary-dim)]" : "border-[var(--color-border)] bg-[var(--color-elevated)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-[var(--color-fg)]",
					children: msg
				}), cue && phase === "go" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-semibold text-[var(--color-primary)]",
					children: CUE_META[cue].label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					["forward", "Forward"],
					["back", "Back"],
					["left", "Left"],
					["right", "Right"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: phase === "go" ? "default" : "secondary",
					disabled: phase !== "go",
					onClick: () => answer(key),
					className: "h-14",
					children: label
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Replay"]
				}) : phase === "wait" || phase === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: () => {
						clearTimer();
						setPhase("idle");
						setMsg("Stopped.");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: startRound,
					disabled: lives <= 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						phase === "idle" ? "Play" : "Next rep"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function PatternRace() {
	const [seq, setSeq] = (0, import_react.useState)(() => randomPattern(4));
	const [input, setInput] = (0, import_react.useState)([]);
	const [score, setScore] = (0, import_react.useState)(0);
	const [status, setStatus] = (0, import_react.useState)("watch");
	const [level, setLevel] = (0, import_react.useState)(1);
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (status !== "watch") return;
		setTick(0);
		let i = 0;
		const id = window.setInterval(() => {
			i += 1;
			setTick(i);
			if (i >= seq.length) {
				window.clearInterval(id);
				window.setTimeout(() => setStatus("go"), 400);
			}
		}, 550);
		return () => window.clearInterval(id);
	}, [status, seq]);
	function tap(c) {
		if (status !== "go") return;
		const next = [...input, c];
		setInput(next);
		const idx = next.length - 1;
		if (next[idx] !== seq[idx]) {
			setStatus("lost");
			return;
		}
		if (next.length === seq.length) {
			setScore((s) => s + 100 * level);
			setStatus("won");
		}
	}
	function nextLevel() {
		const n = Math.min(7, 3 + level);
		setLevel((l) => l + 1);
		setSeq(randomPattern(n));
		setInput([]);
		setStatus("watch");
	}
	function reset() {
		setLevel(1);
		setScore(0);
		setSeq(randomPattern(4));
		setInput([]);
		setStatus("watch");
	}
	const revealingAt = status === "watch" && tick > 0 && tick <= seq.length ? tick - 1 : -1;
	const revealingCorner = revealingAt >= 0 ? seq[revealingAt] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Pattern Race",
		subtitle: "Memorize cone order, then tap it back",
		score,
		meta: `Level ${level}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-[var(--color-subtle)]",
					children: [
						status === "watch" && "Watch the sequence…",
						status === "go" && "Your turn — tap cones in order",
						status === "won" && "Clean run — next level!",
						status === "lost" && "Missed a cone — try again"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-3 grid max-w-[200px] grid-cols-2 gap-2",
					children: [
						"TL",
						"TR",
						"BL",
						"BR"
					].map((c) => {
						const lit = status === "watch" && revealingCorner === c;
						const isNext = status === "go" && seq[input.length] === c;
						const revealCount = status === "watch" && lit ? seq.slice(0, tick).filter((x) => x === c).length : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: status !== "go",
							onClick: () => tap(c),
							className: cn("relative h-16 rounded-[var(--radius-md)] border text-sm font-semibold transition-colors", lit || isNext ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"),
							children: [c, lit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-[var(--color-primary-fg)]",
								children: revealCount
							})]
						}, c);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] tabular text-[var(--color-subtle)]",
					children: status === "watch" ? `Showing ${Math.min(tick, seq.length)}/${seq.length}` : `Input: ${input.join(" → ") || "—"}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2",
			children: status === "won" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "flex-1",
				onClick: nextLevel,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { "aria-hidden": true }), " Next level"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "flex-1",
				variant: "secondary",
				onClick: reset,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }),
					" ",
					status === "lost" ? "Retry" : "Restart"
				]
			})
		})]
	});
}
function randomPattern(len = 4) {
	const corners = [
		"TL",
		"TR",
		"BR",
		"BL"
	];
	const out = [];
	for (let i = 0; i < len; i++) {
		let c = corners[Math.floor(Math.random() * 4)];
		while (out.length && c === out[out.length - 1]) c = corners[Math.floor(Math.random() * 4)];
		out.push(c);
	}
	return out;
}
function WhistleChase() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	const [hits, setHits] = (0, import_react.useState)(0);
	const [miss, setMiss] = (0, import_react.useState)(0);
	const [windowOpen, setWindowOpen] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Stay on tempo — tap each leave whistle.");
	const nextBeat = (0, import_react.useRef)(0);
	const openRef = (0, import_react.useRef)(false);
	const raf = (0, import_react.useRef)(null);
	const missTimer = (0, import_react.useRef)(null);
	const intervalMs = 1500;
	(0, import_react.useEffect)(() => {
		if (!running) {
			if (raf.current) cancelAnimationFrame(raf.current);
			if (missTimer.current) window.clearTimeout(missTimer.current);
			return;
		}
		nextBeat.current = performance.now() + 900;
		const loop = (ts) => {
			if (ts >= nextBeat.current) {
				setBeat((b) => b + 1);
				openRef.current = true;
				setWindowOpen(true);
				setMsg("LEAVE — tap!");
				nextBeat.current = ts + intervalMs;
				if (missTimer.current) window.clearTimeout(missTimer.current);
				missTimer.current = window.setTimeout(() => {
					if (openRef.current) {
						openRef.current = false;
						setWindowOpen(false);
						setMiss((m) => m + 1);
						setMsg("Missed leave window");
					}
				}, 480);
			}
			raf.current = requestAnimationFrame(loop);
		};
		raf.current = requestAnimationFrame(loop);
		return () => {
			if (raf.current) cancelAnimationFrame(raf.current);
			if (missTimer.current) window.clearTimeout(missTimer.current);
		};
	}, [running]);
	function tap() {
		if (!running) return;
		if (openRef.current) {
			openRef.current = false;
			setWindowOpen(false);
			setHits((h) => h + 1);
			setMsg("Clean leave");
			if (missTimer.current) window.clearTimeout(missTimer.current);
		} else {
			setMiss((m) => m + 1);
			setMsg("Early/late — stay on the clock");
		}
	}
	const score = Math.max(0, hits * 100 - miss * 40);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Tempo Train",
		subtitle: "Tap in the leave window every 1.5s",
		score,
		meta: `Hits ${hits} · Miss ${miss} · Beat ${beat}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: tap,
			className: cn("mb-3 flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-xl)] border text-center transition-colors", windowOpen ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]" : "border-[var(--color-border)] bg-[var(--color-elevated)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-3xl font-semibold tabular text-[var(--color-fg)]",
				children: windowOpen ? "GO" : "…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-xs text-[var(--color-muted)]",
				children: msg
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "flex-1",
				onClick: () => setRunning((r) => !r),
				children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Pause"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }), " Start tempo"] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => {
					setRunning(false);
					setBeat(0);
					setHits(0);
					setMiss(0);
					openRef.current = false;
					setWindowOpen(false);
					setMsg("Stay on tempo — tap each leave whistle.");
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
			})]
		})]
	});
}
var CORNERS = [
	{
		id: "1",
		label: "NW",
		x: "left",
		y: "top"
	},
	{
		id: "2",
		label: "NE",
		x: "right",
		y: "top"
	},
	{
		id: "3",
		label: "SW",
		x: "left",
		y: "bottom"
	},
	{
		id: "4",
		label: "SE",
		x: "right",
		y: "bottom"
	}
];
function FourCornerCall() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [lives, setLives] = (0, import_react.useState)(3);
	const [round, setRound] = (0, import_react.useState)(0);
	const [target, setTarget] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("Coach calls a corner — get there first.");
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(0);
	const goAt = (0, import_react.useRef)(0);
	const timer = (0, import_react.useRef)(null);
	const tick = (0, import_react.useRef)(null);
	const clearAll = () => {
		if (timer.current) window.clearTimeout(timer.current);
		if (tick.current) window.clearInterval(tick.current);
		timer.current = null;
		tick.current = null;
	};
	(0, import_react.useEffect)(() => () => clearAll(), []);
	function startRound() {
		clearAll();
		const next = CORNERS[Math.floor(Math.random() * CORNERS.length)].id;
		setTarget(next);
		setPhase("call");
		setMsg(`Corner ${next}!`);
		goAt.current = performance.now();
		const limit = Math.max(650, 1400 - round * 40);
		setTimeLeft(limit);
		tick.current = window.setInterval(() => {
			setTimeLeft((t) => Math.max(0, t - 50));
		}, 50);
		timer.current = window.setTimeout(() => {
			clearAll();
			setLives((l) => {
				const n = l - 1;
				if (n <= 0) {
					setPhase("over");
					setMsg("Too slow — heat over.");
				} else {
					setPhase("result");
					setMsg("Last to the cone. −1 life");
				}
				return n;
			});
		}, limit);
	}
	function tapCorner(id) {
		if (phase !== "call" || !target) return;
		clearAll();
		const rt = Math.round(performance.now() - goAt.current);
		setRound((r) => r + 1);
		if (id === target) {
			const pts = Math.max(80, 500 - rt);
			setScore((s) => s + pts);
			setMsg(`Beat the call · ${rt}ms · +${pts}`);
			setPhase("result");
		} else setLives((l) => {
			const n = l - 1;
			if (n <= 0) {
				setPhase("over");
				setMsg(`Wrong corner — needed ${target}.`);
			} else {
				setPhase("result");
				setMsg(`Wrong — corner ${target}. −1 life`);
			}
			return n;
		});
	}
	function reset() {
		clearAll();
		setScore(0);
		setLives(3);
		setRound(0);
		setTarget(null);
		setPhase("idle");
		setMsg("Coach calls a corner — get there first.");
		setTimeLeft(0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Four-Corner Call",
		subtitle: "Tap the called corner before the clock",
		score,
		meta: `Lives ${lives} · Round ${round}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-[var(--color-fg)]",
						children: msg
					}),
					phase === "call" && target && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-3xl font-semibold text-[var(--color-primary)]",
						children: ["CORNER ", target]
					}),
					phase === "call" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-[var(--color-surface)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-[var(--color-warn)]",
							style: { width: `${Math.min(100, timeLeft / 1400 * 100)}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mb-3 aspect-square w-full max-w-[240px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-[var(--color-subtle)]",
					children: "Field"
				}), CORNERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: phase !== "call",
					onClick: () => tapCorner(c.id),
					className: cn("absolute flex size-14 items-center justify-center rounded-full border text-sm font-semibold transition-colors", c.x === "left" ? "left-3" : "right-3", c.y === "top" ? "top-3" : "bottom-3", phase === "call" && target === c.id ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]"),
					children: [c.id, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: c.label
					})]
				}, c.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Replay heat"]
				}) : phase === "call" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: startRound,
					disabled: lives <= 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						phase === "idle" ? "Start heat" : "Next call"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function MirrorMatch() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [dir, setDir] = (0, import_react.useState)("N");
	const [score, setScore] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [miss, setMiss] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(20);
	const [msg, setMsg] = (0, import_react.useState)("Mirror the leader — tap the matching cut.");
	const [waiting, setWaiting] = (0, import_react.useState)(false);
	const changeAt = (0, import_react.useRef)(0);
	const dirRef = (0, import_react.useRef)("N");
	const timers = (0, import_react.useRef)([]);
	const clearTimers = () => {
		timers.current.forEach((t) => window.clearTimeout(t));
		timers.current = [];
	};
	(0, import_react.useEffect)(() => () => clearTimers(), []);
	function scheduleNext(delay) {
		const id = window.setTimeout(() => {
			const opts = [
				"N",
				"S",
				"E",
				"W"
			];
			let next = opts[Math.floor(Math.random() * 4)];
			while (next === dirRef.current) next = opts[Math.floor(Math.random() * 4)];
			dirRef.current = next;
			setDir(next);
			setWaiting(true);
			changeAt.current = performance.now();
			setMsg(`Leader cuts ${next}!`);
			const missId = window.setTimeout(() => {
				if (dirRef.current === next) {
					setWaiting(false);
					setMiss((m) => m + 1);
					setCombo(0);
					setMsg("Lost the mirror");
				}
			}, 1100);
			timers.current.push(missId);
			scheduleNext(900 + Math.random() * 700);
		}, delay);
		timers.current.push(id);
	}
	function start() {
		clearTimers();
		setRunning(true);
		setScore(0);
		setCombo(0);
		setMiss(0);
		setTimeLeft(20);
		setMsg("Stay square — match every cut.");
		setWaiting(false);
		scheduleNext(700);
		const clock = window.setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					window.clearInterval(clock);
					clearTimers();
					setRunning(false);
					setWaiting(false);
					setMsg("Bout over — check your score.");
					return 0;
				}
				return t - 1;
			});
		}, 1e3);
		timers.current.push(clock);
	}
	function tap(d) {
		if (!running || !waiting) return;
		if (d === dirRef.current) {
			const rt = Math.round(performance.now() - changeAt.current);
			const pts = Math.max(40, 220 - Math.floor(rt / 4)) + combo * 10;
			setScore((s) => s + pts);
			setCombo((c) => c + 1);
			setWaiting(false);
			setMsg(`Stuck him · ${rt}ms · +${pts}`);
		} else {
			setMiss((m) => m + 1);
			setCombo(0);
			setWaiting(false);
			setMsg("Wrong cut — stay on the leader");
		}
	}
	function reset() {
		clearTimers();
		setRunning(false);
		setScore(0);
		setCombo(0);
		setMiss(0);
		setTimeLeft(20);
		setWaiting(false);
		setMsg("Mirror the leader — tap the matching cut.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Mirror Match",
		subtitle: "20s bout — match every leader cut",
		score,
		meta: `${timeLeft}s · Combo ${combo} · Miss ${miss}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-3 rounded-[var(--radius-lg)] border px-3 py-5 text-center transition-colors", waiting ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]" : "border-[var(--color-border)] bg-[var(--color-elevated)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[var(--color-subtle)]",
					children: msg
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-4xl font-semibold text-[var(--color-fg)]",
					children: waiting ? dir : "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mb-3 grid max-w-[200px] grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "h-14",
						disabled: !running || !waiting,
						onClick: () => tap("N"),
						children: "N"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "h-14",
						disabled: !running || !waiting,
						onClick: () => tap("W"),
						children: "W"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "h-14",
						disabled: !running || !waiting,
						onClick: () => tap("S"),
						children: "S"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "h-14",
						disabled: !running || !waiting,
						onClick: () => tap("E"),
						children: "E"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [!running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: start,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						timeLeft === 0 && score > 0 ? "Rematch" : "Start bout"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " End early"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function BallSecure() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [secure, setSecure] = (0, import_react.useState)(100);
	const [msg, setMsg] = (0, import_react.useState)("Hold secure (tap) through every weave gate.");
	const [gateOpen, setGateOpen] = (0, import_react.useState)(false);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const gates = 8;
	const openRef = (0, import_react.useRef)(false);
	const timers = (0, import_react.useRef)([]);
	const clearTimers = () => {
		timers.current.forEach((t) => window.clearTimeout(t));
		timers.current = [];
	};
	(0, import_react.useEffect)(() => () => clearTimers(), []);
	function armGate(index) {
		if (index >= gates) {
			setRunning(false);
			setFinished(true);
			setGateOpen(false);
			openRef.current = false;
			setMsg(secure > 60 ? "Clean gauntlet — ball stayed high & tight!" : "Finished, but ball security slipped.");
			setScore((s) => s + Math.round(secure * 2));
			return;
		}
		setPos(index);
		setMsg(`Gate ${index + 1}/${gates} — secure the ball!`);
		const delay = 500 + Math.random() * 400;
		const openId = window.setTimeout(() => {
			openRef.current = true;
			setGateOpen(true);
			setMsg("WEAVE — tap to secure!");
			const closeId = window.setTimeout(() => {
				if (openRef.current) {
					openRef.current = false;
					setGateOpen(false);
					setSecure((v) => Math.max(0, v - 18));
					setMsg("Loose ball through the gate");
					armGate(index + 1);
				}
			}, 700);
			timers.current.push(closeId);
		}, delay);
		timers.current.push(openId);
	}
	function start() {
		clearTimers();
		setRunning(true);
		setFinished(false);
		setPos(0);
		setScore(0);
		setSecure(100);
		setGateOpen(false);
		openRef.current = false;
		setMsg("Gauntlet live — eyes up, elbow in.");
		armGate(0);
	}
	function tapSecure() {
		if (!running || !openRef.current) {
			if (running) {
				setSecure((v) => Math.max(0, v - 8));
				setMsg("Early slap — don't panic the ball");
			}
			return;
		}
		openRef.current = false;
		setGateOpen(false);
		setSecure((v) => Math.min(100, v + 4));
		setScore((s) => s + 80 + Math.floor(secure / 5));
		setMsg("High & tight — next cone");
		armGate(pos + 1);
	}
	function reset() {
		clearTimers();
		setRunning(false);
		setFinished(false);
		setPos(0);
		setScore(0);
		setSecure(100);
		setGateOpen(false);
		openRef.current = false;
		setMsg("Hold secure (tap) through every weave gate.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Ball Security Weave",
		subtitle: "Tap in each gate window — keep secure high",
		score,
		meta: `Secure ${secure}% · Gate ${Math.min(pos + 1, gates)}/${gates}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 h-2 overflow-hidden rounded-full bg-[var(--color-elevated)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full transition-[width]", secure > 60 ? "bg-[var(--color-primary)]" : "bg-[var(--color-warn)]"),
					style: { width: `${secure}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex justify-between gap-1",
				children: Array.from({ length: gates }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 flex-1 rounded-full", i < pos ? "bg-[var(--color-primary)]" : i === pos && gateOpen ? "bg-[var(--color-warn)]" : "bg-[var(--color-border)]") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: tapSecure,
				disabled: !running && !finished,
				className: cn("mb-3 flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-xl)] border text-center transition-colors", gateOpen ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]" : "border-[var(--color-border)] bg-[var(--color-elevated)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-3xl font-semibold text-[var(--color-fg)]",
					children: gateOpen ? "SECURE" : finished ? "DONE" : running ? "…" : "READY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 max-w-[16rem] text-xs text-[var(--color-muted)]",
					children: msg
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [!running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: start,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						finished ? "Run again" : "Start gauntlet"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Abort"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function RedLightGame() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [light, setLight] = (0, import_react.useState)("idle");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [strikes, setStrikes] = (0, import_react.useState)(0);
	const [msg, setMsg] = (0, import_react.useState)("Green = hold GO · Red = freeze (don't tap).");
	const [won, setWon] = (0, import_react.useState)(false);
	const lightRef = (0, import_react.useRef)("idle");
	const timers = (0, import_react.useRef)([]);
	const runningRef = (0, import_react.useRef)(false);
	const goal = 8;
	const clearTimers = () => {
		timers.current.forEach((t) => window.clearTimeout(t));
		timers.current = [];
	};
	(0, import_react.useEffect)(() => () => clearTimers(), []);
	function scheduleLight() {
		const next = Math.random() > .42 ? "green" : "red";
		const delay = 500 + Math.random() * 900;
		const id = window.setTimeout(() => {
			if (!runningRef.current) return;
			lightRef.current = next;
			setLight(next);
			setMsg(next === "green" ? "GREEN — tap to advance!" : "RED — FREEZE!");
			const hold = next === "green" ? 900 + Math.random() * 500 : 700 + Math.random() * 600;
			const endId = window.setTimeout(() => {
				if (lightRef.current === "green") setMsg("Missed a green — stay ready");
				lightRef.current = "idle";
				setLight("idle");
				if (runningRef.current) scheduleLight();
			}, hold);
			timers.current.push(endId);
		}, delay);
		timers.current.push(id);
	}
	function start() {
		clearTimers();
		setRunning(true);
		runningRef.current = true;
		setProgress(0);
		setScore(0);
		setStrikes(0);
		setWon(false);
		setLight("idle");
		lightRef.current = "idle";
		setMsg("Race to the finish — freeze on red.");
		scheduleLight();
	}
	function tap() {
		if (!runningRef.current || won) return;
		if (lightRef.current === "green") {
			setProgress((p) => {
				const n = p + 1;
				setScore((s) => s + 100);
				if (n >= goal) {
					setWon(true);
					setRunning(false);
					runningRef.current = false;
					clearTimers();
					setMsg("Finish line! Clean COD freezes win camp.");
					lightRef.current = "idle";
					setLight("idle");
				} else setMsg(`Advance ${n}/${goal}`);
				return n;
			});
			lightRef.current = "idle";
			setLight("idle");
		} else if (lightRef.current === "red") {
			setStrikes((k) => k + 1);
			setProgress((p) => Math.max(0, p - 1));
			setScore((s) => Math.max(0, s - 40));
			setMsg("Moved on red — back 1 yard");
		} else setMsg("Wait for the light…");
	}
	function reset() {
		clearTimers();
		setRunning(false);
		runningRef.current = false;
		setLight("idle");
		lightRef.current = "idle";
		setProgress(0);
		setScore(0);
		setStrikes(0);
		setWon(false);
		setMsg("Green = hold GO · Red = freeze (don't tap).");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Red / Green COD",
		subtitle: "Tap only on green — freeze on red",
		score,
		meta: `Yard ${progress}/${goal} · Strikes ${strikes}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-3 rounded-[var(--radius-lg)] border px-3 py-8 text-center transition-colors", light === "green" ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]" : light === "red" ? "border-[var(--color-warn)] bg-[color-mix(in_oklab,var(--color-warn)_18%,var(--color-elevated))]" : "border-[var(--color-border)] bg-[var(--color-elevated)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl font-semibold text-[var(--color-fg)]",
					children: light === "green" ? "GREEN" : light === "red" ? "RED" : won ? "DONE" : "…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-[var(--color-muted)]",
					children: msg
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex gap-1",
				children: Array.from({ length: goal }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 flex-1 rounded-full", i < progress ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]") }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: tap,
				disabled: !running,
				className: "mb-3 flex h-20 w-full items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] font-display text-xl font-semibold text-[var(--color-fg)] active:scale-[0.99]",
				children: "GO"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [!running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: start,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						won ? "Run again" : "Start heat"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Stop"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function StealBacon() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [round, setRound] = (0, import_react.useState)(0);
	const [myNum, setMyNum] = (0, import_react.useState)(1);
	const [called, setCalled] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("You're number 1. Explode only on your call.");
	const [lives, setLives] = (0, import_react.useState)(3);
	const goAt = (0, import_react.useRef)(0);
	const timer = (0, import_react.useRef)(null);
	const myNumRef = (0, import_react.useRef)(1);
	(0, import_react.useEffect)(() => {
		const n = 1 + Math.floor(Math.random() * 6);
		setMyNum(n);
		myNumRef.current = n;
		setMsg(`You're number ${n}. Explode only on your call.`);
	}, []);
	const clearTimer = () => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = null;
	};
	(0, import_react.useEffect)(() => () => clearTimer(), []);
	function startRound() {
		clearTimer();
		setPhase("listen");
		setCalled(null);
		setMsg("Listen for numbers…");
		const delay = 700 + Math.random() * 1200;
		const num = Math.random() > .35 ? myNumRef.current : 1 + Math.floor(Math.random() * 6);
		timer.current = window.setTimeout(() => {
			setCalled(num);
			setPhase("race");
			goAt.current = performance.now();
			setMsg(`NUMBER ${num}!`);
			timer.current = window.setTimeout(() => {
				if (num === myNumRef.current) setLives((l) => {
					const next = l - 1;
					if (next <= 0) {
						setPhase("over");
						setMsg("Missed your number — heat over.");
					} else {
						setPhase("result");
						setMsg("Too slow on your number. −1 life");
					}
					return next;
				});
				else {
					setPhase("result");
					setMsg("Decoy — good patience.");
					setScore((s) => s + 30);
				}
			}, 1100);
		}, delay);
	}
	function grab() {
		if (phase !== "race" || called == null) return;
		clearTimer();
		const rt = Math.round(performance.now() - goAt.current);
		setRound((r) => r + 1);
		if (called === myNumRef.current) {
			const pts = Math.max(80, 450 - rt);
			setScore((s) => s + pts);
			setMsg(`Bacon secured · ${rt}ms · +${pts}`);
			setPhase("result");
		} else setLives((l) => {
			const next = l - 1;
			if (next <= 0) {
				setPhase("over");
				setMsg("False start on a decoy — out.");
			} else {
				setPhase("result");
				setMsg("Wrong number — false start. −1 life");
			}
			return next;
		});
	}
	function reset() {
		clearTimer();
		setScore(0);
		setRound(0);
		setCalled(null);
		setPhase("idle");
		setLives(3);
		setMsg(`You're number ${myNumRef.current}. Explode only on your call.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Steal the Bacon",
		subtitle: `You are #${myNum} — race only on your number`,
		score,
		meta: `Lives ${lives} · Round ${round}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[var(--color-fg)]",
					children: msg
				}), phase === "race" && called != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-display text-4xl font-semibold text-[var(--color-primary)]",
					children: ["#", called]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mb-3 h-16 w-full",
				disabled: phase !== "race",
				onClick: grab,
				children: "GRAB BACON"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Replay"]
				}) : phase === "listen" || phase === "race" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: startRound,
					disabled: lives <= 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						phase === "idle" ? "Start" : "Next call"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function PursuitTap() {
	const corners = [
		"NW",
		"NE",
		"SW",
		"SE"
	];
	const [score, setScore] = (0, import_react.useState)(0);
	const [round, setRound] = (0, import_react.useState)(0);
	const [carrier, setCarrier] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)("Cut off the carrier — tap the angle cone first.");
	const [lives, setLives] = (0, import_react.useState)(3);
	const goAt = (0, import_react.useRef)(0);
	const timer = (0, import_react.useRef)(null);
	const clearTimer = () => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = null;
	};
	(0, import_react.useEffect)(() => () => clearTimer(), []);
	function startRound() {
		clearTimer();
		const c = corners[Math.floor(Math.random() * 4)];
		setCarrier(c);
		setPhase("go");
		setMsg(`Carrier breaks ${c}!`);
		goAt.current = performance.now();
		timer.current = window.setTimeout(() => {
			setLives((l) => {
				const n = l - 1;
				if (n <= 0) {
					setPhase("over");
					setMsg("Carrier scored — heat over.");
				} else {
					setPhase("result");
					setMsg("Too slow — he beat you to the edge.");
				}
				return n;
			});
		}, 1200);
	}
	function tap(c) {
		if (phase !== "go" || !carrier) return;
		clearTimer();
		const rt = Math.round(performance.now() - goAt.current);
		setRound((r) => r + 1);
		if (c === carrier) {
			const pts = Math.max(70, 420 - rt);
			setScore((s) => s + pts);
			setMsg(`Angle won · ${rt}ms · +${pts}`);
			setPhase("result");
		} else setLives((l) => {
			const n = l - 1;
			if (n <= 0) {
				setPhase("over");
				setMsg(`Trailed to ${c} — needed ${carrier}.`);
			} else {
				setPhase("result");
				setMsg(`Wrong angle — take grass away toward ${carrier}.`);
			}
			return n;
		});
	}
	function reset() {
		clearTimer();
		setScore(0);
		setRound(0);
		setCarrier(null);
		setPhase("idle");
		setLives(3);
		setMsg("Cut off the carrier — tap the angle cone first.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		title: "Pursuit Angles",
		subtitle: "Tap the cut-off corner — never trail",
		score,
		meta: `Lives ${lives} · Round ${round}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[var(--color-fg)]",
					children: msg
				}), phase === "go" && carrier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-display text-2xl font-semibold text-[var(--color-primary)]",
					children: ["→ ", carrier]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto mb-3 aspect-square w-full max-w-[220px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[var(--color-subtle)]",
					children: "Hash"
				}), [
					[
						"NW",
						"left-3",
						"top-3"
					],
					[
						"NE",
						"right-3",
						"top-3"
					],
					[
						"SW",
						"left-3",
						"bottom-3"
					],
					[
						"SE",
						"right-3",
						"bottom-3"
					]
				].map(([c, x, y]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: phase !== "go",
					onClick: () => tap(c),
					className: cn("absolute flex size-14 items-center justify-center rounded-full border text-xs font-semibold", x, y, phase === "go" && carrier === c ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]"),
					children: c
				}, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Replay"]
				}) : phase === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					variant: "secondary",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: startRound,
					disabled: lives <= 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						phase === "idle" ? "Snap" : "Next snap"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: reset,
					"aria-label": "Reset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
function GameShell({ title, subtitle, score, meta, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Mini-game"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[var(--color-muted)]",
					children: subtitle
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "default",
					className: "tabular",
					children: score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[10px] text-[var(--color-subtle)]",
					children: meta
				})]
			})]
		}), children]
	});
}
function GameDetailPage() {
	const { gameId } = Route.useParams();
	const game = getGameById(gameId);
	if (!game) throw notFound();
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
						to: "/games",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": true }), " Games"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: KIND_LABELS[game.kind] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: game.intensity === "high" ? "warn" : "info",
								children: game.intensity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "Non-contact"
							}),
							game.playableId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: "Mini-game"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[2rem] font-semibold leading-none tracking-tight",
						children: game.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-[var(--color-muted)]",
						children: game.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
							children: [game.durationMin, " min"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-[var(--color-border)] px-2.5 py-1",
							children: game.players
						})]
					})
				]
			}),
			game.playableId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Play it here"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGame, { id: game.playableId })]
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
					children: game.objective
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Setup",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: game.setup.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-sm text-[var(--color-muted)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-[var(--color-primary)]" }), s]
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: game.equipment.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: e
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "How to play",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-3",
					children: game.howToPlay.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
				title: "Scoring",
				icon: Trophy,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: game.scoring.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-fg)]",
						children: s
					}, s))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Coaching cues",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: game.coachingCues.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-[var(--color-muted)]",
						children: ["· ", c]
					}, c))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Safety",
				icon: ShieldAlert,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: game.safety.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-[var(--color-warn)]",
						children: s
					}, s))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6" })
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
export { GameDetailPage as component };
