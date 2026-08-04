import type { AgeBand, ContactLevel } from "./levels";

export interface SafetyTopic {
  id: string;
  title: string;
  category: "heat" | "contact" | "concussion" | "equipment" | "culture";
  summary: string;
  points: string[];
  ageFocus?: AgeBand[];
}

export const safetyTopics: SafetyTopic[] = [
  {
    id: "heat-acclimation",
    title: "Heat & hydration protocol",
    category: "heat",
    summary:
      "Most early-camp emergencies are heat-related. Build volume gradually and never shame water breaks.",
    points: [
      "Days 1–2: shorter sessions, more shade breaks, lighter conditioning",
      "Water available on every period — schedule mandatory drink times",
      "Watch for dizziness, stop sweating, confusion, or extreme fatigue — stop and cool immediately",
      "Never use conditioning as punishment in extreme heat",
      "Cold tubs / ice towels staged for high-risk days",
    ],
  },
  {
    id: "contact-progression",
    title: "Contact progression ladder",
    category: "contact",
    summary:
      "Players earn contact. Air → shells fit → thud wrap → limited live. Skipping steps raises injury risk.",
    points: [
      "Air: technique, pursuit, and competition without wrapping people up",
      "Shells: pad level and hand placement; no takedowns",
      "Thud: form tackle to a controlled stop or wrap-and-release",
      "Live: short windows, clear whistle, matched size when possible",
      "Youth and middle school: cap live periods; emphasize form over collision seeking",
    ],
    ageFocus: ["youth", "middle", "high-school"],
  },
  {
    id: "head-safety",
    title: "Head & neck safety",
    category: "concussion",
    summary:
      "Heads up. No launching. No helmet-as-weapon. Remove and evaluate any suspected concussion.",
    points: [
      "Teach see-what-you-hit: eyes up through contact",
      "No leading with the crown of the helmet — ever",
      "Any suspected concussion: remove from play, no same-day return without medical clearance",
      "Coach language matters — never praise 'blowing someone up' with the head",
      "Neck strength and proper fit of helmets are non-negotiable",
    ],
  },
  {
    id: "equipment-fit",
    title: "Equipment fit checklist",
    category: "equipment",
    summary:
      "Ill-fitting gear is an injury multiplier. Check before the first contact period.",
    points: [
      "Helmet: snug, proper inflation, chinstrap secured, no excessive movement",
      "Shoulder pads: cover AC joints, straps tight, no riding up into the neck",
      "Mouthguard: always for contact periods",
      "Cleats appropriate for surface; no metal where banned",
      "Youth: re-check fit mid-season — kids grow",
    ],
  },
  {
    id: "practice-culture",
    title: "Practice culture & whistle discipline",
    category: "culture",
    summary:
      "Pro-grade teams are loud on communication and quiet on cheap shots. Standards start on day one.",
    points: [
      "Whistle means freeze — no extra hits after the echo",
      "Match effort without targeting smaller or injured teammates",
      "Celebrate technique and teamwork louder than highlight hits",
      "Water, shade, and recovery are part of toughness — not softness",
      "Parents/athletes know the contact plan for the week in advance",
    ],
  },
  {
    id: "youth-limits",
    title: "Youth contact limits",
    category: "contact",
    summary:
      "Young athletes need reps that teach, not wars that grind. Limit full-speed player-vs-player contact.",
    points: [
      "Prioritize bags, shields, and form tackling circuits over live pileups",
      "Keep live periods short and purposeful with clear teaching goals",
      "Equalize matchups by size when contact is scheduled",
      "No bull-in-the-ring or survivor-style elimination contact games",
      "If technique collapses under fatigue, end the period",
    ],
    ageFocus: ["youth", "middle"],
  },
];

export const contactRulesByAge: Record<
  AgeBand,
  { maxDefault: ContactLevel; notes: string[] }
> = {
  youth: {
    maxDefault: "shells",
    notes: [
      "Default to air + form circuits on soft surfaces",
      "Shells only after stance, start, and fit technique look clean",
      "Avoid multi-player pileups and blindside teaching periods",
    ],
  },
  middle: {
    maxDefault: "thud",
    notes: [
      "Shells and thud after a multi-day air base",
      "Live only in short, coached windows if program allows",
      "Emphasize wrap-and-release over driving through every rep",
    ],
  },
  "high-school": {
    maxDefault: "live",
    notes: [
      "Follow a written weekly contact plan",
      "Protect key skill players late week when possible",
      "Full live periods require medical coverage plan and heat awareness",
    ],
  },
  "college-adult": {
    maxDefault: "live",
    notes: [
      "Periodize contact across the week (heavy early, light late)",
      "Scout-team safety and look-team rules are non-negotiable",
      "Load management for veterans is performance, not weakness",
    ],
  },
};

export function getSafetyByCategory(category: SafetyTopic["category"]) {
  return safetyTopics.filter((t) => t.category === category);
}
