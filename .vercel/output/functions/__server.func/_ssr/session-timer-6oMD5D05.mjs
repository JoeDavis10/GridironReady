import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as FastForward, c as SkipForward, g as Pause, h as Play, l as SkipBack, m as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as formatClock, n as Badge, r as cn } from "./badge-D9EcA40i.mjs";
import { n as coneDiagrams } from "./cone-diagrams-BbRnI_Va.mjs";
import { t as Button } from "./button-Cbkf159W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-timer-6oMD5D05.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STYLE_DURATION = {
	sprint: 1500,
	carioca: 2e3,
	backwards: 1800,
	shuffle: 1900
};
var STYLE_VERB = {
	sprint: "Sprint",
	carioca: "Carioca",
	backwards: "Backpedal",
	shuffle: "Shuffle"
};
function dist$1(a, b) {
	return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
function pathLength(points) {
	let total = 0;
	for (let i = 1; i < points.length; i++) total += dist$1(points[i - 1], points[i]);
	return total;
}
function unit(a, b) {
	const d = dist$1(a, b) || 1;
	return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
}
/** True when heading change is a real plant / cut (not a gentle curve). */
function isHardCorner(a, b, c) {
	const u = unit(a, b);
	const v = unit(b, c);
	return u[0] * v[0] + u[1] * v[1] < .55;
}
function edgesFromDiagram(diagramId) {
	const spec = coneDiagrams[diagramId];
	if (!spec) return [];
	const edges = [];
	for (const path of spec.paths) for (let i = 0; i < path.points.length - 1; i++) {
		const from = path.points[i];
		const to = path.points[i + 1];
		if (dist$1(from, to) < .4) continue;
		edges.push({
			style: path.style,
			from,
			to
		});
	}
	return edges;
}
/**
* Prefer diagram authoring:
* - Multiple path entries = intentional style/leg breaks
* - Single continuous path = split on hard plant corners
* - Bridge legs when path entries are disconnected (X drills)
*/
function legsFromDiagram(diagramId) {
	const spec = coneDiagrams[diagramId];
	if (!spec) return [];
	if (spec.paths.length > 1) {
		const legs = [];
		let prevEnd = null;
		for (const path of spec.paths) {
			if (path.points.length < 2) continue;
			const start = path.points[0];
			if (prevEnd && dist$1(prevEnd, start) > 4) legs.push({
				style: "sprint",
				points: [prevEnd, start],
				bridge: true
			});
			legs.push({
				style: path.style,
				points: path.points.map((p) => [p[0], p[1]])
			});
			prevEnd = path.points[path.points.length - 1];
		}
		return legs.filter((l) => pathLength(l.points) >= 2);
	}
	return legsFromEdges(edgesFromDiagram(diagramId));
}
function legsFromEdges(edges) {
	if (edges.length === 0) return [];
	const legs = [];
	let cur = {
		style: edges[0].style,
		points: [edges[0].from, edges[0].to]
	};
	for (let i = 1; i < edges.length; i++) {
		const e = edges[i];
		const a = cur.points[cur.points.length - 2];
		const b = cur.points[cur.points.length - 1];
		const gap = dist$1(b, e.from);
		if (gap > 2.5) {
			legs.push(cur);
			if (gap > 4) legs.push({
				style: "sprint",
				points: [b, e.from],
				bridge: true
			});
			cur = {
				style: e.style,
				points: [e.from, e.to]
			};
			continue;
		}
		if (gap > .5 && gap <= 2.5) cur.points.push(e.from);
		const styleChange = e.style !== cur.style;
		const corner = isHardCorner(a, b, e.to);
		const curLen = pathLength(cur.points);
		const nextSeg = dist$1(e.from, e.to);
		if (styleChange || corner && curLen >= 12 && nextSeg >= 8) {
			legs.push(cur);
			cur = {
				style: e.style,
				points: [b, e.to]
			};
		} else cur.points.push(e.to);
	}
	legs.push(cur);
	return mergeMicroLegs(legs.filter((l) => pathLength(l.points) >= 2));
}
function mergeMicroLegs(legs) {
	if (legs.length <= 1) return legs;
	const out = [];
	for (const leg of legs) {
		const len = pathLength(leg.points);
		const prev = out[out.length - 1];
		if (prev && !leg.bridge && !prev.bridge && len < 9 && prev.style === leg.style) {
			const start = dist$1(prev.points[prev.points.length - 1], leg.points[0]) < 1 ? 1 : 0;
			for (let i = start; i < leg.points.length; i++) prev.points.push(leg.points[i]);
			continue;
		}
		out.push({
			...leg,
			points: [...leg.points]
		});
	}
	return out;
}
function directionLabel(from, to) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const ax = Math.abs(dx);
	const ay = Math.abs(dy);
	if (ax < 4 && ay < 4) return "in place";
	if (ax > ay * 1.35) return dx > 0 ? "right" : "left";
	if (ay > ax * 1.35) return dy > 0 ? "downfield" : "upfield";
	return `${dy > 0 ? "down" : "up"}-${dx > 0 ? "right" : "left"}`;
}
function motionTitle(style, from, to, bridge) {
	if (bridge) return "Reset to next start";
	const dir = directionLabel(from, to);
	if (dir === "in place") return STYLE_VERB[style];
	return `${STYLE_VERB[style]} ${dir}`;
}
/** Compact readable titles — never mid-sentence ellipsis. */
function compactTitle(sheet, fallback) {
	if (!sheet) return fallback;
	const cleaned = sheet.replace(/\.$/, "").trim();
	if (cleaned.length <= 40) return cleaned;
	const clause = cleaned.split(/[,;(—–]/)[0]?.trim() ?? cleaned;
	if (clause.length <= 40 && clause.length >= 8) return clause;
	let t = cleaned.replace(/\bon the inside of the cones\b/gi, "(inside)").replace(/\bon the outside of the cones\b/gi, "(outside)").replace(/\band finish past the start cone\b/gi, "+ finish").replace(/\bacross the top\b/gi, "top").replace(/\bacross the bottom\b/gi, "bottom").replace(/\b\(dots on the sheet\)\b/gi, "").replace(/\b\(squares on the sheet\)\b/gi, "").replace(/\s+/g, " ").trim();
	if (t.length <= 40) return t;
	const words = t.split(" ");
	if (words.length > 5) return words.slice(0, 5).join(" ");
	return fallback;
}
function cuesForLeg(drill, style, instruction, legIndex) {
	if (style === "setup") return [
		"Athletic base — knees soft",
		"Eyes up before the go",
		"Wait for the whistle — no false starts"
	];
	if (style === "hold") return [
		"Clear the lane fully",
		"Walk recover — hands on hips OK",
		"Reset for reverse or next rep"
	];
	const byStyle = {
		sprint: [
			"Arms drive hard",
			"Hit the plant low",
			"Finish through the cone"
		],
		carioca: [
			"Open the hips",
			"Stay tall — don't spin",
			"Quick feet, controlled"
		],
		shuffle: [
			"Stay low in the base",
			"Feet never cross",
			"Push off the outside foot"
		],
		backwards: [
			"Sit the hips",
			"Short steps",
			"Peek over the lead shoulder"
		]
	};
	const drillCue = drill.cues[legIndex % Math.max(1, drill.cues.length)];
	const styleCues = byStyle[style] ?? byStyle.sprint;
	const lower = instruction.toLowerCase();
	const context = [];
	if (/inside/.test(lower)) context.push("Stay inside the cone line");
	if (/outside/.test(lower)) context.push("Take the outside shoulder");
	if (/plant|cut/.test(lower)) context.push("Drop hips — outside foot drives the cut");
	if (/finish|clear|past/.test(lower)) context.push("Accelerate through the finish");
	if (/valley|center/.test(lower)) context.push("Thread the center gate clean");
	const pool = [
		...context,
		...drillCue ? [drillCue] : [],
		...styleCues
	];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const c of pool) {
		const key = c.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(c);
		if (out.length >= 3) break;
	}
	return out;
}
/**
* Match each sheet line at most once. Prefer style-keyword hits.
* Sequential fallback only for sprint so specialty styles don't steal finish lines.
*/
function matchSheetLine(motionCopy, style, used) {
	if (motionCopy.length === 0 || used.size >= motionCopy.length) return void 0;
	const styleRx = {
		sprint: /sprint|drive|burst|finish|cut|plant|clear|clip|loop|enter|exit|up |down |across|wide|outside|inside|diagonal|post|valley|corner|perimeter|gauntlet/i,
		carioca: /carioca|karaoke/i,
		shuffle: /shuffle|lateral|slide/i,
		backwards: /back|reverse|pedal/i
	};
	for (let i = 0; i < motionCopy.length; i++) {
		if (used.has(i)) continue;
		if (styleRx[style].test(motionCopy[i])) {
			used.add(i);
			return motionCopy[i];
		}
	}
	if (style === "sprint") {
		for (let i = 0; i < motionCopy.length; i++) if (!used.has(i)) {
			used.add(i);
			return motionCopy[i];
		}
	}
}
function buildAnimationSteps(drill) {
	if (drill.diagramId && coneDiagrams[drill.diagramId]) return buildConeSteps(drill);
	return buildGenericSteps(drill);
}
function buildConeSteps(drill) {
	const diagramId = drill.diagramId;
	const legs = legsFromDiagram(diagramId);
	const startCone = coneDiagrams[diagramId].cones.find((c) => c.start);
	const start = legs[0]?.points[0] ? legs[0].points[0] : [startCone?.x ?? 50, startCone?.y ?? 80];
	const motionCopy = drill.steps.filter((s) => !/^\s*rest\b|walk recover|hydrate|full recovery|reverse direction for the next|flip direction on alternate|opposite direction next rep|^\s*reset\b|reset or continuous|reset;/i.test(s));
	const usedLines = /* @__PURE__ */ new Set();
	const steps = [{
		id: `${drill.id}-setup`,
		title: "On your mark",
		instruction: drill.setup[0] ?? "Line up at the start cone. Check the path.",
		cues: cuesForLeg(drill, "setup", "", 0),
		style: "setup",
		points: [start],
		durationMs: 1400
	}];
	legs.forEach((leg, i) => {
		const from = leg.points[0];
		const to = leg.points[leg.points.length - 1];
		const sheet = leg.bridge ? "Jog clear, then reset to the next start mark without rushing the plant." : matchSheetLine(motionCopy, leg.style, usedLines);
		const len = pathLength(leg.points);
		const durationMs = Math.round((leg.bridge ? 1100 : STYLE_DURATION[leg.style]) * Math.max(.75, Math.min(2, len / 38)));
		const fallback = motionTitle(leg.style, from, to, leg.bridge);
		const title = leg.bridge ? fallback : compactTitle(sheet, fallback);
		const instruction = sheet ?? (leg.bridge ? "Reset to the next start. Stay under control." : `${STYLE_VERB[leg.style]} this leg (${directionLabel(from, to)}). Stay tight to the cones.`);
		steps.push({
			id: `${drill.id}-leg-${i}`,
			title,
			instruction,
			cues: cuesForLeg(drill, leg.bridge ? "setup" : leg.style, instruction, i),
			style: leg.bridge ? "sprint" : leg.style,
			points: leg.points,
			durationMs
		});
	});
	const end = legs.length ? legs[legs.length - 1].points[legs[legs.length - 1].points.length - 1] : start;
	steps.push({
		id: `${drill.id}-finish`,
		title: "Finish & recover",
		instruction: drill.steps.find((s) => /rest|recover|reverse|finish|flip direction|opposite/i.test(s)) ?? "Clear the finish. Walk recover. Prepare the next rep.",
		cues: cuesForLeg(drill, "hold", "", legs.length),
		style: "hold",
		points: [end],
		durationMs: 1500
	});
	return steps;
}
function buildGenericSteps(drill) {
	const steps = [{
		id: `${drill.id}-setup`,
		title: "Setup",
		instruction: drill.setup[0] ?? "Set the station and brief the group.",
		cues: cuesForLeg(drill, "setup", "", 0),
		style: "setup",
		points: [[20, 78]],
		durationMs: 1200
	}];
	const n = Math.max(1, drill.steps.length);
	drill.steps.forEach((text, i) => {
		const style = inferStyle(text, drill.category);
		steps.push({
			id: `${drill.id}-s-${i}`,
			title: compactTitle(text, `Motion ${i + 1}`),
			instruction: text,
			cues: cuesForLeg(drill, style, text, i),
			style,
			points: pathForCategory(drill.category, i, n),
			durationMs: style === "hold" ? 1300 : 1600
		});
	});
	const lastPts = steps[steps.length - 1].points;
	steps.push({
		id: `${drill.id}-done`,
		title: "Complete",
		instruction: "Log the set, hydrate, and rotate as prescribed.",
		cues: cuesForLeg(drill, "hold", "", n),
		style: "hold",
		points: [lastPts[lastPts.length - 1] ?? [80, 30]],
		durationMs: 1100
	});
	return steps;
}
function inferStyle(text, category) {
	const t = text.toLowerCase();
	if (/shuffle|lateral/.test(t)) return "shuffle";
	if (/carioca|karaoke/.test(t)) return "carioca";
	if (/backpedal|backward/.test(t)) return "backwards";
	if (/rest|recover|stretch|plank|hold|water/.test(t)) return "hold";
	if (category === "cooldown" || category === "strength") return "hold";
	return "sprint";
}
function pathForCategory(category, i, n) {
	const t0 = i / n;
	const t1 = (i + 1) / n;
	if (category === "conditioning") {
		const y = 28 + i % 4 * 14;
		return i % 2 === 0 ? [[14, y], [86, y]] : [[86, y], [14, y]];
	}
	if (category === "agility") return [[16 + t0 * 68, i % 2 === 0 ? 70 : 30], [16 + t1 * 68, i % 2 === 0 ? 30 : 70]];
	if (category === "warmup") return [[50, 80 - t0 * 55], [50, 80 - t1 * 55]];
	if (category === "strength" || category === "cooldown") {
		const cx = 28 + i % 4 * 16;
		const cy = 38 + Math.floor(i / 4) * 18;
		return [[cx, cy], [cx + .5, cy]];
	}
	return i % 2 === 0 ? [[22, 78 - t0 * 50], [78, 78 - t1 * 50]] : [[78, 78 - t0 * 50], [22, 78 - t1 * 50]];
}
function pointOnPath(points, t) {
	if (points.length === 0) return {
		x: 50,
		y: 50,
		angle: 0
	};
	if (points.length === 1) return {
		x: points[0][0],
		y: points[0][1],
		angle: 0
	};
	const clamped = Math.max(0, Math.min(1, t));
	const total = pathLength(points);
	if (total === 0) return {
		x: points[0][0],
		y: points[0][1],
		angle: 0
	};
	let remain = clamped * total;
	for (let i = 1; i < points.length; i++) {
		const a = points[i - 1];
		const b = points[i];
		const seg = dist$1(a, b);
		if (remain <= seg || i === points.length - 1) {
			const u = seg === 0 ? 0 : Math.min(1, remain / seg);
			return {
				x: a[0] + (b[0] - a[0]) * u,
				y: a[1] + (b[1] - a[1]) * u,
				angle: Math.round(Math.atan2(b[1] - a[1], b[0] - a[0]) * 1800 / Math.PI) / 10
			};
		}
		remain -= seg;
	}
	const last = points[points.length - 1];
	return {
		x: last[0],
		y: last[1],
		angle: 0
	};
}
function samplePartial(points, t) {
	if (points.length < 2) return points.slice();
	const end = pointOnPath(points, t);
	const total = pathLength(points);
	if (total === 0) return [points[0]];
	const target = Math.max(0, Math.min(1, t)) * total;
	const out = [points[0]];
	let acc = 0;
	for (let i = 1; i < points.length; i++) {
		const a = points[i - 1];
		const b = points[i];
		const seg = dist$1(a, b);
		if (acc + seg >= target) {
			out.push([end.x, end.y]);
			return out;
		}
		out.push(b);
		acc += seg;
	}
	out.push([end.x, end.y]);
	return out;
}
var PATH_STROKE = {
	sprint: { width: 2.1 },
	carioca: {
		dash: "0.9 2.6",
		width: 2.3
	},
	backwards: {
		dash: "3.4 2.2",
		width: 2.1
	},
	shuffle: {
		dash: "1.2 2",
		width: 2.4
	}
};
var STYLE_BADGE = {
	sprint: "Sprint",
	carioca: "Carioca",
	backwards: "Backwards",
	shuffle: "Shuffle",
	hold: "Recover",
	setup: "Setup"
};
var SPEEDS = [
	.75,
	1,
	1.5,
	2
];
function isPathStyle(s) {
	return s === "sprint" || s === "carioca" || s === "backwards" || s === "shuffle";
}
function easeInOut(t) {
	return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function r1(n) {
	return Math.round(n * 10) / 10;
}
function dist(a, b) {
	return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
function DrillAnimator({ drill }) {
	const steps = (0, import_react.useMemo)(() => buildAnimationSteps(drill), [drill]);
	const diagram = drill.diagramId ? coneDiagrams[drill.diagramId] : void 0;
	const [stepIndex, setStepIndex] = (0, import_react.useState)(0);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [speedIdx, setSpeedIdx] = (0, import_react.useState)(1);
	const [reducedMotion, setReducedMotion] = (0, import_react.useState)(false);
	const rafRef = (0, import_react.useRef)(null);
	const lastTs = (0, import_react.useRef)(null);
	const stepIndexRef = (0, import_react.useRef)(0);
	const progressRef = (0, import_react.useRef)(0);
	const playingRef = (0, import_react.useRef)(false);
	const speedRef = (0, import_react.useRef)(1);
	const step = steps[stepIndex] ?? steps[0];
	const speed = SPEEDS[speedIdx];
	(0, import_react.useEffect)(() => {
		stepIndexRef.current = stepIndex;
	}, [stepIndex]);
	(0, import_react.useEffect)(() => {
		progressRef.current = progress;
	}, [progress]);
	(0, import_react.useEffect)(() => {
		playingRef.current = playing;
	}, [playing]);
	(0, import_react.useEffect)(() => {
		speedRef.current = speed;
	}, [speed]);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(mq.matches);
		const fn = () => setReducedMotion(mq.matches);
		mq.addEventListener("change", fn);
		return () => mq.removeEventListener("change", fn);
	}, []);
	(0, import_react.useEffect)(() => {
		setStepIndex(0);
		setProgress(0);
		setPlaying(false);
		stepIndexRef.current = 0;
		progressRef.current = 0;
		playingRef.current = false;
		lastTs.current = null;
	}, [drill.id]);
	const goToStep = (0, import_react.useCallback)((index, keepPlaying = false) => {
		const next = Math.max(0, Math.min(steps.length - 1, index));
		stepIndexRef.current = next;
		progressRef.current = 0;
		lastTs.current = null;
		setStepIndex(next);
		setProgress(0);
		if (!keepPlaying) {
			playingRef.current = false;
			setPlaying(false);
		}
	}, [steps.length]);
	const restart = (0, import_react.useCallback)(() => {
		stepIndexRef.current = 0;
		progressRef.current = 0;
		lastTs.current = null;
		playingRef.current = true;
		setStepIndex(0);
		setProgress(0);
		setPlaying(true);
	}, []);
	const rewindStep = (0, import_react.useCallback)(() => {
		if (progressRef.current > .05) {
			progressRef.current = 0;
			lastTs.current = null;
			setProgress(0);
			return;
		}
		goToStep(stepIndexRef.current - 1, playingRef.current);
	}, [goToStep]);
	const forwardStep = (0, import_react.useCallback)(() => {
		if (stepIndexRef.current >= steps.length - 1) {
			progressRef.current = 1;
			setProgress(1);
			playingRef.current = false;
			setPlaying(false);
			return;
		}
		goToStep(stepIndexRef.current + 1, playingRef.current);
	}, [goToStep, steps.length]);
	(0, import_react.useEffect)(() => {
		if (!playing) {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
			lastTs.current = null;
			return;
		}
		if (reducedMotion) {
			const id = window.setTimeout(() => {
				if (stepIndexRef.current >= steps.length - 1) {
					setProgress(1);
					setPlaying(false);
					return;
				}
				goToStep(stepIndexRef.current + 1, true);
			}, Math.max(650, (steps[stepIndexRef.current]?.durationMs ?? 1200) / speed));
			return () => window.clearTimeout(id);
		}
		const tick = (ts) => {
			if (!playingRef.current) return;
			if (lastTs.current == null) lastTs.current = ts;
			const dt = Math.min(64, ts - lastTs.current);
			lastTs.current = ts;
			const current = steps[stepIndexRef.current];
			if (!current) return;
			const hold = current.style === "hold" || current.style === "setup" || current.points.length < 2;
			const duration = Math.max(400, current.durationMs / speedRef.current);
			const next = progressRef.current + dt / duration;
			if (next >= 1) {
				if (stepIndexRef.current >= steps.length - 1) {
					progressRef.current = 1;
					setProgress(1);
					playingRef.current = false;
					setPlaying(false);
					return;
				}
				const ni = stepIndexRef.current + 1;
				stepIndexRef.current = ni;
				progressRef.current = 0;
				setStepIndex(ni);
				setProgress(0);
				lastTs.current = ts;
			} else {
				progressRef.current = next;
				setProgress(hold ? Math.min(1, next) : next);
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
			lastTs.current = null;
		};
	}, [
		playing,
		reducedMotion,
		steps,
		speed,
		goToStep
	]);
	const t = reducedMotion ? 1 : step.points.length < 2 ? 0 : easeInOut(progress);
	const athlete = pointOnPath(step.points, t);
	const legPhase = t * Math.PI * 5;
	const targetPt = step.points.length >= 2 ? step.points[step.points.length - 1] : step.points[0] ?? [50, 50];
	const trail = (0, import_react.useMemo)(() => {
		const pts = [];
		for (let i = 0; i < stepIndex; i++) {
			const s = steps[i];
			if (!s.points.length) continue;
			if (!pts.length) pts.push(s.points[0]);
			else if (dist(pts[pts.length - 1], s.points[0]) > 1) pts.push(s.points[0]);
			for (let p = 1; p < s.points.length; p++) pts.push(s.points[p]);
		}
		if (step.points.length >= 2) {
			const partial = samplePartial(step.points, t);
			if (!pts.length) pts.push(...partial);
			else {
				if (partial[0] && dist(pts[pts.length - 1], partial[0]) > 1) pts.push(partial[0]);
				for (let i = 1; i < partial.length; i++) pts.push(partial[i]);
			}
		} else if (step.points[0]) {
			if (!pts.length || dist(pts[pts.length - 1], step.points[0]) > .5) pts.push(step.points[0]);
		}
		return pts;
	}, [
		stepIndex,
		step,
		steps,
		t
	]);
	const ghostSegments = (0, import_react.useMemo)(() => {
		if (!diagram) return steps.filter((s) => s.points.length >= 2).map((s) => s.points);
		const segs = [];
		let cur = [];
		for (const path of diagram.paths) for (const p of path.points) {
			if (!cur.length) {
				cur.push(p);
				continue;
			}
			if (dist(cur[cur.length - 1], p) > 3) {
				if (cur.length >= 2) segs.push(cur);
				cur = [p];
			} else cur.push(p);
		}
		if (cur.length >= 2) segs.push(cur);
		return segs;
	}, [diagram, steps]);
	const overallPct = Math.round((stepIndex + progress) / Math.max(1, steps.length) * 100);
	const isFirst = stepIndex === 0;
	const finished = stepIndex === steps.length - 1 && progress >= .98;
	const showInstruction = step.instruction.trim().toLowerCase() !== step.title.trim().toLowerCase();
	const destCone = (0, import_react.useMemo)(() => {
		if (!diagram || step.points.length < 2) return null;
		let best = null;
		let bestD = 8;
		for (const c of diagram.cones) {
			const d = Math.hypot(c.x - targetPt[0], c.y - targetPt[1]);
			if (d < bestD) {
				bestD = d;
				best = c;
			}
		}
		return best;
	}, [
		diagram,
		step.points.length,
		targetPt
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-[var(--color-border)] bg-[var(--color-elevated)] p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: "Step-by-step motion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "tabular",
							children: [overallPct, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "tabular",
							children: [
								stepIndex + 1,
								"/",
								steps.length
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 100 100",
						className: "mx-auto aspect-square w-full max-h-72",
						role: "img",
						"aria-label": `${drill.name}: ${step.title}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
								id: "athlete-glow",
								x: "-50%",
								y: "-50%",
								width: "200%",
								height: "200%",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
									stdDeviation: "1.2",
									result: "b"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "3",
								y: "3",
								width: "94",
								height: "94",
								rx: "5",
								className: "fill-[var(--color-surface)] stroke-[var(--color-border)]",
								strokeWidth: "0.7"
							}),
							!diagram && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
								className: "stroke-[var(--color-border)]",
								strokeWidth: "0.35",
								opacity: .6,
								children: [
									24,
									40,
									56,
									72
								].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "10",
									y1: y,
									x2: "90",
									y2: y,
									strokeDasharray: "2 3"
								}, y))
							}),
							diagram?.box && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: diagram.box.x,
								y: diagram.box.y,
								width: diagram.box.w,
								height: diagram.box.h,
								fill: "none",
								className: "stroke-[var(--color-border-strong)]",
								strokeWidth: "0.7",
								opacity: .4
							}),
							ghostSegments.map((pts, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: pts.map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" "),
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.6",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "text-[var(--color-border-strong)]",
								opacity: .32
							}, `ghost-${i}`)),
							diagram?.paths.map((path, i) => {
								if (path.points.length < 2) return null;
								const d = path.points.map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
								const stroke = PATH_STROKE[path.style];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d,
									fill: "none",
									stroke: "currentColor",
									strokeWidth: stroke.width,
									strokeDasharray: stroke.dash,
									strokeLinecap: "round",
									className: "text-[var(--color-muted)]",
									opacity: .4
								}, `style-${i}`);
							}),
							!diagram && steps.map((s, i) => {
								if (i < stepIndex || s.points.length < 2) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: s.points.map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" "),
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.4",
									strokeDasharray: "2 2",
									className: "text-[var(--color-border-strong)]",
									opacity: .35
								}, s.id);
							}),
							step.points.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: step.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" "),
								fill: "none",
								stroke: "currentColor",
								strokeWidth: isPathStyle(step.style) ? PATH_STROKE[step.style].width + 1.1 : 2.6,
								strokeDasharray: isPathStyle(step.style) ? PATH_STROKE[step.style].dash : void 0,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "text-[var(--color-fg)]",
								opacity: .55
							}),
							trail.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: trail.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" "),
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.9",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "text-[var(--color-primary)]",
								opacity: .95
							}),
							step.points.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: targetPt[0],
								cy: targetPt[1],
								r: 4.2,
								fill: "none",
								className: "stroke-[var(--color-primary)]",
								strokeWidth: "0.7",
								opacity: .55 + .35 * Math.sin(progress * Math.PI)
							}), destCone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: destCone.x,
								cy: destCone.y,
								r: 3.4,
								fill: "none",
								className: "stroke-[var(--color-warn)]",
								strokeWidth: "0.9",
								opacity: .75
							}) : null] }),
							diagram?.cones.map((cone, i) => {
								const isDest = destCone && Math.abs(cone.x - destCone.x) < .1 && Math.abs(cone.y - destCone.y) < .1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: cone.x,
									cy: cone.y,
									r: cone.start ? 3 : isDest ? 2.9 : 2.5,
									className: cone.start ? "fill-[var(--color-primary)]" : isDest ? "fill-[var(--color-warn)]" : "fill-[var(--color-muted)]"
								}), cone.start && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: cone.x,
									cy: cone.y,
									r: 4.8,
									fill: "none",
									className: "stroke-[var(--color-primary)]",
									strokeWidth: "0.55",
									opacity: .4
								})] }, i);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: `translate(${r1(athlete.x)} ${r1(athlete.y)})`,
								filter: "url(#athlete-glow)",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									r: "7.5",
									className: "fill-[var(--color-primary)]",
									opacity: .18
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									transform: `rotate(${athlete.angle})`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
											cx: "0",
											cy: "0.2",
											rx: "2.9",
											ry: "3.4",
											className: "fill-[var(--color-primary)] stroke-[var(--color-bg)]",
											strokeWidth: "0.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "0",
											cy: "-4.5",
											r: "1.9",
											className: "fill-[var(--color-fg)]"
										}),
										isPathStyle(step.style) && step.points.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "0",
											y1: "2.4",
											x2: r1(Math.sin(legPhase) * 2.7),
											y2: "5.7",
											stroke: "currentColor",
											strokeWidth: "1.2",
											strokeLinecap: "round",
											className: "text-[var(--color-primary)]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "0",
											y1: "2.4",
											x2: r1(Math.sin(legPhase + Math.PI) * 2.7),
											y2: "5.7",
											stroke: "currentColor",
											strokeWidth: "1.2",
											strokeLinecap: "round",
											className: "text-[var(--color-primary)]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
											points: "3.4,-1.3 6.8,0 3.4,1.3",
											className: "fill-[var(--color-fg)]",
											opacity: .95
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute bottom-2 left-2 right-2 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "max-w-[96%] truncate rounded-full border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_90%,transparent)] px-3 py-1 text-[11px] font-medium text-[var(--color-fg)] backdrop-blur-sm",
							children: [
								STYLE_BADGE[step.style],
								" · ",
								step.title
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-75",
						style: { width: `${Math.round(progress * 100)}%` }
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: STYLE_BADGE[step.style] }), step.points.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Moving"
					}) : step.style === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Brief"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Hold"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
						children: "Now explaining"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-0.5 font-display text-xl font-semibold leading-tight tracking-tight",
						children: step.title
					}),
					showInstruction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]",
						children: step.instruction
					})
				] }),
				step.cues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: "Coaching cues this step"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: step.cues.map((cue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-2.5 py-1.5 text-xs leading-relaxed text-[var(--color-fg)]",
						children: cue
					}, cue))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Jump to ${s.title}`,
						"aria-current": i === stepIndex ? "step" : void 0,
						onClick: () => goToStep(i, false),
						className: cn("h-8 min-w-8 rounded-full border px-2 text-[11px] font-medium tabular transition-colors duration-[var(--duration-fast)]", i === stepIndex ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : i < stepIndex ? "border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border))] bg-[var(--color-primary-dim)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-subtle)]"),
						children: i + 1
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-start gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon-sm",
								"aria-label": "Restart animation",
								onClick: restart,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon-sm",
								"aria-label": "Previous step",
								disabled: isFirst && progress === 0,
								onClick: rewindStep,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { "aria-hidden": true })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "min-w-[8rem]",
							onClick: () => {
								if (finished) restart();
								else setPlaying((p) => !p);
							},
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Pause"] }) : finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true }), " Replay"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }), " Play"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon-sm",
								"aria-label": "Next step",
								disabled: finished,
								onClick: forwardStep,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { "aria-hidden": true })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "min-w-[3.25rem] px-2",
								"aria-label": `Playback speed ${speed}x. Tap to change.`,
								onClick: () => setSpeedIdx((i) => (i + 1) % SPEEDS.length),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FastForward, {
									className: "size-3.5",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-semibold tabular",
									children: [speed, "×"]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-[11px] text-[var(--color-subtle)]",
					children: [
						"Play/pause · prev/next · jump chips · speed ",
						speed,
						"×"
					]
				})
			]
		})]
	});
}
function SessionTimer({ initialSeconds, label = "Block timer" }) {
	const [seconds, setSeconds] = (0, import_react.useState)(initialSeconds);
	const [running, setRunning] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSeconds(initialSeconds);
		setRunning(false);
	}, [initialSeconds]);
	(0, import_react.useEffect)(() => {
		if (!running) {
			if (ref.current) window.clearInterval(ref.current);
			ref.current = null;
			return;
		}
		ref.current = window.setInterval(() => {
			setSeconds((s) => {
				if (s <= 1) {
					setRunning(false);
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => {
			if (ref.current) window.clearInterval(ref.current);
		};
	}, [running]);
	const progress = initialSeconds > 0 ? (initialSeconds - seconds) / initialSeconds * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-[var(--color-muted)] tabular",
					children: [Math.round(progress), "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl font-semibold tabular tracking-tight text-[var(--color-fg)]",
				children: formatClock(seconds)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-[var(--duration-fast)]",
					style: { width: `${progress}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					variant: running ? "secondary" : "default",
					onClick: () => setRunning((r) => !r),
					disabled: seconds === 0 && !running,
					children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true }), " Pause"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }),
						" ",
						seconds === 0 ? "Done" : "Start"
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					"aria-label": "Reset timer",
					onClick: () => {
						setRunning(false);
						setSeconds(initialSeconds);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { "aria-hidden": true })
				})]
			})
		]
	});
}
//#endregion
export { SessionTimer as n, DrillAnimator as t };
