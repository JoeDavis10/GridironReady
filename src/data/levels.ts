/** Program levels for youth → adult tackle football. */

export type AgeBand = "youth" | "middle" | "high-school" | "college-adult";

export type ContactLevel = "air" | "shells" | "thud" | "live";

export type SeasonPhase =
  | "offseason"
  | "preseason"
  | "in-season"
  | "postseason";

export const AGE_BAND_LABELS: Record<AgeBand, string> = {
  youth: "Youth (8–11)",
  middle: "Middle school (12–14)",
  "high-school": "High school",
  "college-adult": "College / adult",
};

export const AGE_BAND_SHORT: Record<AgeBand, string> = {
  youth: "Youth",
  middle: "MS",
  "high-school": "HS",
  "college-adult": "Adult",
};

export const AGE_BAND_BLURBS: Record<AgeBand, string> = {
  youth:
    "Foundations first: stance, start, catch, secure, and form tackling on soft surfaces. Strict contact limits.",
  middle:
    "Expand technique volume, introduce shells/thud progressions, and teach pursuit angles with control.",
  "high-school":
    "Full camp installs, competitive tempo, shells-to-live progression, and position mastery.",
  "college-adult":
    "High-output installs, periodized conditioning, and pro-style detail without wasting reps.",
};

export const CONTACT_LABELS: Record<ContactLevel, string> = {
  air: "Air (no contact)",
  shells: "Shells / fit-up",
  thud: "Thud (wrap & release)",
  live: "Live (controlled)",
};

export const CONTACT_BLURBS: Record<ContactLevel, string> = {
  air: "Movement, technique, and competition without pads or wrapping people up.",
  shells: "Helmets + shoulder pads; fit hands and pad level — no full takedowns.",
  thud: "Full pads; form tackle to the ground stop or wrap-and-release on coach call.",
  live: "Game-speed contact inside rules — limited periods only, age-appropriate.",
};

export const SEASON_LABELS: Record<SeasonPhase, string> = {
  offseason: "Offseason",
  preseason: "Preseason / camp",
  "in-season": "In-season",
  postseason: "Postseason",
};

export const ALL_AGE_BANDS: AgeBand[] = [
  "youth",
  "middle",
  "high-school",
  "college-adult",
];

/** Default contact ceiling by age — coaches can still filter lower. */
export const DEFAULT_CONTACT_CAP: Record<AgeBand, ContactLevel> = {
  youth: "shells",
  middle: "thud",
  "high-school": "live",
  "college-adult": "live",
};

export function contactRank(level: ContactLevel): number {
  return { air: 0, shells: 1, thud: 2, live: 3 }[level];
}

export function contactAllowed(
  drillLevel: ContactLevel,
  cap: ContactLevel,
): boolean {
  return contactRank(drillLevel) <= contactRank(cap);
}
