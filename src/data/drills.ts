import { toConeDrills } from "./cone-drills";
import { fundamentalDrills } from "./fundamentals";
import type { AgeBand, ContactLevel } from "./levels";
import type { PositionId } from "./positions";

export type DrillCategory =
  | "warmup"
  | "conditioning"
  | "agility"
  | "strength"
  | "position"
  | "fundamentals"
  | "team"
  | "special-teams"
  | "cooldown";

export type Intensity = "low" | "moderate" | "high";
export type PositionGroup =
  | "all"
  | "skill"
  | "line"
  | "big-skill"
  | "specialists";

export interface Drill {
  id: string;
  name: string;
  category: DrillCategory;
  intensity: Intensity;
  durationMin: number;
  restSec?: number;
  sets?: number;
  reps?: string;
  equipment: string[];
  positions: PositionGroup[];
  positionTags?: PositionId[];
  summary: string;
  objective: string;
  setup: string[];
  steps: string[];
  cues: string[];
  progressions: string[];
  safety: string[];
  nonContact: boolean;
  contactLevel?: ContactLevel;
  ageBands?: AgeBand[];
  diagramId?: string;
  series?: "cone-agilities";
  tags?: string[];
  totalYards?: number;
  movementMix?: string[];
  family?: "box" | "m" | "specialty";
  level?: "base" | "advanced";
}

export const CATEGORY_LABELS: Record<DrillCategory, string> = {
  warmup: "Warm-up",
  conditioning: "Conditioning",
  agility: "Agility",
  strength: "Strength",
  position: "Position",
  fundamentals: "Fundamentals",
  team: "Team / install",
  "special-teams": "Special teams",
  cooldown: "Cool-down",
};

export const INTENSITY_LABELS: Record<Intensity, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

export const POSITION_LABELS: Record<PositionGroup, string> = {
  all: "All positions",
  skill: "Skill (WR/DB/RB)",
  line: "Line (OL/DL)",
  "big-skill": "Big skill (TE/LB)",
  specialists: "Specialists",
};

const coreDrills: Drill[] = [
  {
    id: "dynamic-warmup-circuit",
    name: "Dynamic Warm-up Circuit",
    category: "warmup",
    intensity: "low",
    durationMin: 12,
    equipment: [
      "Cones (optional)",
    ],
    positions: [
      "all",
    ],
    summary: "Full-body activation with separate high-knee and scoop-stretch segments plus multi-plane mobility — raises heart rate and opens hips, ankles, and posterior chain before sprint work.",
    objective: "Prime tissue temperature and movement quality without fatigue.",
    setup: [
      "Mark a 10–15 yard lane on grass or turf",
      "Space players 3–4 yards apart across the lane",
      "Coach stands at the finish to call the next movement",
    ],
    steps: [
      "Jog down and back at 50% effort (1 rep)",
      "High knees 10 yards — drive knee to hip height with arm pump, walk back",
      "Walking scoop stretch 10 yards: heel plant, toe up, reach past the foot (hinge at hips)",
      "Butt kicks 10 yards, walk back",
      "Walking lunges with overhead reach 10 yards",
      "Karaoke / carioca both directions",
      "Open / close the gate hip openers 10 yards",
      "A-skips into light acceleration finish",
    ],
    cues: [
      "Tall posture — eyes up, not at the ground",
      "Quiet feet on high knees; drive the knee, not the heel",
      "Scoop is separate: flat back, hinge at hips — don't lock the knee",
      "Land softly; never force range of motion",
    ],
    progressions: [
      "Increase high-knee distance before adding speed",
      "Add a second scoop pass if hamstrings are tight",
      "Add arm circles and world's greatest stretch between lanes",
      "Finish with 2 build-up sprints to 75%",
    ],
    safety: [
      "Do not skip this on cool mornings",
      "Players with calf/hamstring history go slower on high knees and scoops",
      "Avoid locking the knee on the scoop stretch",
    ],
    nonContact: true,
  },
  {
    id: "hiit-gassers",
    name: "Sideline-to-Sideline Gassers",
    category: "conditioning",
    intensity: "high",
    durationMin: 12,
    restSec: 60,
    sets: 6,
    reps: "1 width out-and-back",
    equipment: [
      "Field hash marks or sidelines",
      "Whistle",
    ],
    positions: [
      "all",
    ],
    summary: "Classic football conditioning: continuous width runs with controlled rest to build repeat sprint ability.",
    objective: "Train anaerobic capacity and mental toughness for late-drive snaps.",
    setup: [
      "Use full field width (sideline to sideline)",
      "Group by position or fitness if squad sizes differ",
      "Coach times every rep; rest starts when last player finishes",
    ],
    steps: [
      "On whistle: sprint sideline → opposite sideline → back",
      "Touch the line with hand each turn",
      "Walk or hands-on-hips recovery for 45–75 seconds",
      "Complete 4–8 reps depending on camp day",
    ],
    cues: [
      "Drive arms; don't coast into the turn",
      "Plant outside foot and cut low",
      "Stay in your lane — no contact",
    ],
    progressions: [
      "Day 1: 4 reps @ 75s rest",
      "Day 5: 6 reps @ 60s rest",
      "Day 10: 8 reps @ 45s rest",
    ],
    safety: [
      "Non-contact only — no racing into collisions",
      "Hydrate between sets; pull players showing form collapse",
    ],
    nonContact: true,
  },
  {
    id: "110-yard-tempo",
    name: "110s Tempo Runs",
    category: "conditioning",
    intensity: "moderate",
    durationMin: 15,
    restSec: 45,
    sets: 8,
    reps: "110 yards",
    equipment: [
      "End zone to end zone markers",
    ],
    positions: [
      "all",
    ],
    summary: "Controlled 110-yard runs at 70–80% to build aerobic base without max-effort neural fatigue.",
    objective: "Establish work capacity for multi-period practices.",
    setup: [
      "Run goal line to opposite 10-yard line (or full 110)",
      "Players start staggered every 3 seconds if large group",
    ],
    steps: [
      "Jog into a smooth acceleration to 70–80% pace",
      "Maintain form through the finish — no leaning back",
      "Walk return or walk the sideline for prescribed rest",
      "Repeat for assigned volume by position group",
    ],
    cues: [
      "Smooth rhythm, not a full sprint",
      "Relaxed face and shoulders",
      "Even splits — don't go out too fast",
    ],
    progressions: [
      "Skill: 10–12 reps",
      "Big skill: 8–10 reps",
      "Line: 6–8 reps",
    ],
    safety: [
      "Not max effort — pull back if players are sprinting 95%+",
      "Increase volume only after two solid sessions",
    ],
    nonContact: true,
  },
  {
    id: "sprint-ladder",
    name: "Sprint Ladder Intervals",
    category: "conditioning",
    intensity: "high",
    durationMin: 14,
    equipment: [
      "Cones at 10, 20, 30, 40 yards",
    ],
    positions: [
      "all",
    ],
    summary: "Ascending and descending sprint distances that mirror play-length efforts and recoveries.",
    objective: "Improve acceleration and recover-to-sprint capacity.",
    setup: [
      "Mark cones at 10, 20, 30, and 40 yards from a start line",
      "One line of players; next group starts when first reaches 20",
    ],
    steps: [
      "Sprint 10 yards, walk back",
      "Sprint 20, walk back",
      "Sprint 30, walk back",
      "Sprint 40, walk back",
      "Descend: 30, 20, 10",
      "Rest 2 minutes, optional second ladder",
    ],
    cues: [
      "Explode first 3 steps",
      "Full stop at each cone — no rounding",
      "Walk recovery keeps heart rate productive",
    ],
    progressions: [
      "Add a second ladder mid-camp",
      "Reduce walk rest by 5 yards",
    ],
    safety: [
      "Check footwear and field surface before first max acceleration",
      "No competitive contact at the finish line",
    ],
    nonContact: true,
  },
  {
    id: "hill-or-bleacher",
    name: "Hill / Bleacher Power Runs",
    category: "conditioning",
    intensity: "high",
    durationMin: 12,
    restSec: 90,
    sets: 8,
    equipment: [
      "Moderate hill or stadium stairs",
      "Water",
    ],
    positions: [
      "all",
    ],
    summary: "Short incline efforts that build posterior chain power and conditioning when field space is limited.",
    objective: "Develop force production and grit with low joint impact options.",
    setup: [
      "Choose a moderate incline (not extreme)",
      "Clear a safe path; mark start and ~20–30 yard finish",
    ],
    steps: [
      "10-minute full-body warm-up first",
      "Sprint or drive hard uphill 15–25 seconds",
      "Walk down for full recovery",
      "Complete 6–10 total efforts",
    ],
    cues: [
      "Lean slightly into the hill, drive knees",
      "Powerful arm swing",
      "Do not overstride",
    ],
    progressions: [
      "Increase efforts from 6 → 10 across week 1",
      "Add 5 seconds of work",
    ],
    safety: [
      "Skip if surface is wet/slippery",
      "Stairs: every step, not double-stepping for beginners",
    ],
    nonContact: true,
  },
  {
    id: "agility-ladder-series",
    name: "Agility Ladder Series",
    category: "agility",
    intensity: "moderate",
    durationMin: 10,
    equipment: [
      "Agility ladder(s)",
      "Cones",
    ],
    positions: [
      "all",
    ],
    summary: "Quick-feet patterns that improve coordination and prepare ankles for change-of-direction work.",
    objective: "Sharpen foot speed and rhythm without contact.",
    setup: [
      "Lay 1–2 ladders parallel",
      "Queue players; continuous flow every 4 seconds",
    ],
    steps: [
      "One-in each square (forward)",
      "Two-in each square",
      "Lateral shuffle two-in",
      "Icky shuffle",
      "Hopscotch (two-in, one-out)",
      "Finish each pattern with a 5-yard burst",
    ],
    cues: [
      "Eyes up after first two patterns",
      "Light contacts — dance on the balls of the feet",
      "Arms stay compact and active",
    ],
    progressions: [
      "Mirror patterns backward",
      "Add ball catch on exit for skill players",
    ],
    safety: [
      "Reset ladder if rungs bunch",
      "No racing through first learning reps",
    ],
    nonContact: true,
  },
  {
    id: "pro-agility-5-10-5",
    name: "Pro Agility (5-10-5)",
    category: "agility",
    intensity: "high",
    durationMin: 8,
    restSec: 60,
    sets: 4,
    equipment: [
      "3 cones",
      "Stopwatch (optional)",
    ],
    positions: [
      "all",
    ],
    summary: "Standard combine COD drill teaching plant, redirect, and re-acceleration — zero contact.",
    objective: "Train change of direction and hip control.",
    setup: [
      "Place cones in a straight line 5 yards apart (total 10 yards)",
      "Start straddling the middle cone",
    ],
    steps: [
      "On command, sprint 5 yards to the right, touch the line",
      "Sprint 10 yards across to the far cone, touch",
      "Sprint 5 yards back through the middle",
      "Rest fully; alternate starting direction each rep",
    ],
    cues: [
      "Low plant, outside hand can touch the line",
      "Stay square — don't spin",
      "Explode out of the second cut",
    ],
    progressions: [
      "Time reps mid-camp for baseline",
      "Reactive start on visual cue",
    ],
    safety: [
      "Clear plant surface of loose turf",
      "Limit max-effort timed reps early in camp",
    ],
    nonContact: true,
  },
  {
    id: "t-drill",
    name: "T-Drill",
    category: "agility",
    intensity: "high",
    durationMin: 8,
    restSec: 75,
    sets: 4,
    equipment: [
      "4 cones",
    ],
    positions: [
      "skill",
      "big-skill",
      "specialists",
    ],
    summary: "Forward sprint, lateral shuffle, and backpedal pattern for multi-plane conditioning.",
    objective: "Blend linear speed with lateral control.",
    setup: [
      "Cones form a T: base 10 yards from crossbar, crossbar 5 yards each side",
    ],
    steps: [
      "Sprint from base to the top center cone, touch",
      "Shuffle right to cone, touch",
      "Shuffle left across to far cone, touch",
      "Shuffle back to center, then backpedal to start",
    ],
    cues: [
      "Stay low on shuffles; feet don't cross",
      "Touch with outside hand",
      "Backpedal under control — don't fall back",
    ],
    progressions: [
      "Add a finish sprint instead of backpedal for skill groups",
    ],
    safety: [
      "Emphasize controlled backpedal to protect ankles",
    ],
    nonContact: true,
  },
  {
    id: "cone-weave-burst",
    name: "Cone Weave + Burst",
    category: "agility",
    intensity: "moderate",
    durationMin: 8,
    equipment: [
      "6–8 cones",
    ],
    positions: [
      "all",
    ],
    summary: "Slalom weave that teaches body lean and short-space acceleration common on broken plays.",
    objective: "Improve spatial awareness and cutting efficiency.",
    setup: [
      "Place cones in a zig-zag every 3–4 yards for 20–25 total yards",
    ],
    steps: [
      "Weave outside each cone with short choppy steps",
      "At the last cone, explode 10 yards in a straight sprint",
      "Jog return; next player goes",
    ],
    cues: [
      "Plant outside foot; lean into the turn",
      "Eyes up looking for the next cone early",
      "Burst must be full speed",
    ],
    progressions: [
      "Mirror the weave with a ball for RBs/WRs",
    ],
    safety: [
      "No two players in the weave at once on narrow setups",
    ],
    nonContact: true,
  },
  {
    id: "bodyweight-circuit",
    name: "Football Bodyweight Circuit",
    category: "strength",
    intensity: "moderate",
    durationMin: 14,
    sets: 3,
    equipment: [
      "None (optional mats)",
    ],
    positions: [
      "all",
    ],
    summary: "No-equipment strength circuit for early camp when pads and weight room access are limited.",
    objective: "Build muscular endurance that supports contact phases later.",
    setup: [
      "Mark 4–5 stations in a circle; 40–45 seconds work / 20 rest",
    ],
    steps: [
      "Station 1: Push-ups",
      "Station 2: Bodyweight squats or jump squats (low amplitude day 1)",
      "Station 3: Plank or shoulder taps",
      "Station 4: Walking lunges",
      "Station 5: Glute bridges",
      "Rotate for 3 rounds",
    ],
    cues: [
      "Quality over count — stop 2 reps before form breaks",
      "Brace core on every station",
      "Breathe; don't hold breath",
    ],
    progressions: [
      "Add tempo (3-second lower) mid-week",
      "Swap jump squats for line groups only after day 4",
    ],
    safety: [
      "Offer knee-down push-up variation",
      "No competitive max push-up contests day 1",
    ],
    nonContact: true,
  },
  {
    id: "sled-drive",
    name: "Sled Drive / Prowler Push",
    category: "strength",
    intensity: "high",
    durationMin: 12,
    restSec: 90,
    sets: 6,
    equipment: [
      "Sled or prowler",
      "Weight plates",
      "20–30 yard lane",
    ],
    positions: [
      "line",
      "big-skill",
      "all",
    ],
    summary: "Horizontal force production without partner contact — ideal non-contact trench prep.",
    objective: "Train drive-leg power and conditioning under load.",
    setup: [
      "Load sled light-to-moderate (players should finish strong)",
      "Mark 20–30 yard lanes",
    ],
    steps: [
      "Athletic stance, hands on poles or pads",
      "Drive 20–30 yards with short, powerful steps",
      "Walk back with sled or partner swap",
      "Complete 4–8 total drives",
    ],
    cues: [
      "Flat back, eyes slightly forward",
      "Drive the ground away — don't just lean",
      "Keep hips low through the finish",
    ],
    progressions: [
      "Increase load after technique is clean",
      "Add backward drag for posterior chain",
    ],
    safety: [
      "Spot slippery turf",
      "Never put beginners on max load day one",
    ],
    nonContact: true,
  },
  {
    id: "plyo-power-pack",
    name: "Plyometric Power Pack",
    category: "strength",
    intensity: "high",
    durationMin: 10,
    sets: 3,
    equipment: [
      "Boxes 12–18 in (optional)",
      "Open grass",
    ],
    positions: [
      "all",
    ],
    summary: "Low-volume explosive jumps to reawaken elastic strength after summer rest.",
    objective: "Improve rate of force development safely.",
    setup: [
      "Soft surface preferred; boxes only if stable and dry",
    ],
    steps: [
      "Squat jumps × 5",
      "Broad jumps × 4",
      "Lateral bounds × 4/side",
      "Optional box step-offs to stick landing × 4",
      "Rest 90 seconds between rounds; 3 rounds",
    ],
    cues: [
      "Quiet, soft landings — absorb with hips",
      "Full reset between jumps early in camp",
      "Arms drive the jump",
    ],
    progressions: [
      "Add a second set mid-camp",
      "Introduce low box jumps after week 1",
    ],
    safety: [
      "Stop if landings get noisy or knees cave",
      "No depth jumps in first 5 practices",
    ],
    nonContact: true,
  },
  {
    id: "wr-db-release-mirror",
    name: "WR/DB Release & Mirror",
    category: "position",
    intensity: "moderate",
    durationMin: 12,
    equipment: [
      "Cones",
      "Footballs (optional)",
    ],
    positions: [
      "skill",
    ],
    summary: "Non-contact release, stem, and mirror footwork for receivers and defensive backs.",
    objective: "Condition with position-specific movement patterns.",
    setup: [
      "Pair skill players; 10–12 yard routes / zones",
    ],
    steps: [
      "WR: release off LOS with three-step stem, break at 8–10 yards",
      "DB: mirror without hands — hip and feet only",
      "Reset; swap roles every 4 reps",
      "Finish period with 4 timed 20-yard bursts",
    ],
    cues: [
      "DB: stay low, don't reach",
      "WR: sell vertical stem",
      "No jam, no grab — pure movement",
    ],
    progressions: [
      "Add ball on the break for WR reps only",
    ],
    safety: [
      "Strictly no hand fighting in non-contact phase",
    ],
    nonContact: true,
  },
  {
    id: "ol-dl-getoff-board",
    name: "OL/DL Get-Off Board",
    category: "position",
    intensity: "moderate",
    durationMin: 10,
    equipment: [
      "Chute or low bag optional",
      "Ball on stick or coach visual",
    ],
    positions: [
      "line",
    ],
    summary: "Explosive first-step and stance work for linemen without pad collision.",
    objective: "Train stance, start, and short-area power.",
    setup: [
      "Form 2–3 lines on the ball; 5-yard finish",
    ],
    steps: [
      "Perfect stance for 3 seconds",
      "On ball movement, explode 5 yards",
      "Reset with coaching on hand placement and pad level (air)",
      "Rotate 8–12 quality reps",
    ],
    cues: [
      "Weight on inside of feet",
      "First step gains ground, not height",
      "Hands strike air targets — no teammate contact",
    ],
    progressions: [
      "Add sled on finish for 5 yards",
      "Mirror steps for pass pro slides (air)",
    ],
    safety: [
      "No live bull rush or punch on a partner yet",
    ],
    nonContact: true,
  },
  {
    id: "lb-te-zone-drops",
    name: "LB/TE Zone Drops & Crosses",
    category: "position",
    intensity: "moderate",
    durationMin: 12,
    equipment: [
      "Cones for landmarks",
      "Football",
    ],
    positions: [
      "big-skill",
    ],
    summary: "Coverage drops, angle runs, and cross-field conditioning for linebackers and tight ends.",
    objective: "Condition while engraving landmark drops and route depths.",
    setup: [
      "Hash-to-hash landmarks for hook/curl and flat",
    ],
    steps: [
      "LB: drop to landmark on coach signal, plant, break on thrown ball (catch optional)",
      "TE: run cross / dig at assigned depth, settle, jog back",
      "Alternate 45-second waves for 10–12 minutes",
    ],
    cues: [
      "Open hips early on the drop",
      "Throttle down under control into the landmark",
      "Eyes to QB on the break",
    ],
    progressions: [
      "Add tempo — less rest between waves day 6+",
    ],
    safety: [
      "No collision on settling routes",
    ],
    nonContact: true,
  },
  {
    id: "specialists-tempo",
    name: "Specialists Tempo Circuit",
    category: "position",
    intensity: "moderate",
    durationMin: 12,
    equipment: [
      "K-ball / footballs",
      "Net or uprights",
    ],
    positions: [
      "specialists",
    ],
    summary: "Conditioning tailored for kickers, punters, and long snappers with intermittent work.",
    objective: "Maintain skill quality while building general fitness.",
    setup: [
      "Separate specialists for part of period; rejoin team for finishers",
    ],
    steps: [
      "Dynamic lower-body warm-up 4 minutes",
      "Approach strides × 8",
      "Live technique reps with full recovery (quality first)",
      "Between sets: 20-yard shuttles × 4",
      "Finish with team tempo 110s if scheduled",
    ],
    cues: [
      "Never condition with a fatigued plant leg on max kicks",
      "Quality of contact > volume",
    ],
    progressions: [
      "Increase shuttle volume mid-camp",
    ],
    safety: [
      "Separate max-effort kick days from high running volume",
    ],
    nonContact: true,
  },
  {
    id: "shuttle-suicide",
    name: "Short-Field Suicides",
    category: "conditioning",
    intensity: "high",
    durationMin: 10,
    restSec: 120,
    sets: 3,
    equipment: [
      "Cones at 5, 10, 15, 20 yards",
    ],
    positions: [
      "all",
    ],
    summary: "Progressive touch-and-go sprints that spike heart rate quickly — use sparingly early camp.",
    objective: "Peak anaerobic finish for end-of-practice standards.",
    setup: [
      "Cones every 5 yards to 20; one line per group of 6–8",
    ],
    steps: [
      "Sprint 5 and back, 10 and back, 15 and back, 20 and back",
      "Touch each line with hand",
      "Full rest 90–120 seconds; repeat 2–4 total sets",
    ],
    cues: [
      "Stay low on turns",
      "Even effort — don't blow up on the first 5",
      "Team standard: everyone finishes together when possible",
    ],
    progressions: [
      "Day 2: 2 sets → Day 8: 4 sets",
    ],
    safety: [
      "Not for the first practice of camp",
      "Pull cramping players immediately; hydrate",
    ],
    nonContact: true,
  },
  {
    id: "partner-mirror-shuffle",
    name: "Partner Mirror Shuffle",
    category: "agility",
    intensity: "moderate",
    durationMin: 8,
    equipment: [
      "5×5 yard box marked by cones",
    ],
    positions: [
      "all",
    ],
    summary: "Reactive lateral conditioning — one leader, one mirror, no contact.",
    objective: "Train reaction and lateral endurance.",
    setup: [
      "Pairs inside a 5-yard box; 20-second bouts",
    ],
    steps: [
      "Leader moves laterally / forward-back within the box",
      "Mirror matches without touching",
      "Switch roles every 20 seconds for 6–8 total bouts",
    ],
    cues: [
      "Athletic base the whole time",
      "Leader changes direction every 1–2 seconds",
      "Hands free — no pushing",
    ],
    progressions: [
      "Shrink the box to 4×4 mid-camp",
    ],
    safety: [
      "Hard rule: zero contact if paths collide — reset",
    ],
    nonContact: true,
  },
  {
    id: "mobility-cooldown",
    name: "Team Mobility Cool-down",
    category: "cooldown",
    intensity: "low",
    durationMin: 8,
    equipment: [
      "Optional bands / foam rollers",
    ],
    positions: [
      "all",
    ],
    summary: "Guided static and breath work to down-regulate after conditioning and protect soft tissue.",
    objective: "Accelerate recovery between camp practices.",
    setup: [
      "Players in a large circle or grid; coach leads",
    ],
    steps: [
      "2 minutes easy walk + water",
      "Half-kneeling hip flexor stretch 45s/side",
      "Hamstring stretch 45s/side",
      "Figure-4 glute stretch 45s/side",
      "World's greatest stretch flow × 4/side",
      "90 seconds nasal breathing, eyes closed",
    ],
    cues: [
      "Ease into stretch — no bouncing",
      "Exhale longer than inhale on breath work",
      "Check for hot spots; report early",
    ],
    progressions: [
      "Add foam roll calves and quads when available",
    ],
    safety: [
      "Never force end range on cold or cramping athletes",
    ],
    nonContact: true,
  },
  {
    id: "core-finisher",
    name: "Core Stability Finisher",
    category: "strength",
    intensity: "low",
    durationMin: 6,
    equipment: [
      "None",
    ],
    positions: [
      "all",
    ],
    summary: "Short anti-rotation and brace series that supports tackling posture later without contact today.",
    objective: "Build trunk endurance for pad level and change of direction.",
    setup: [
      "Players on grass with room to lie down",
    ],
    steps: [
      "Front plank 30–40s",
      "Side plank 20–30s/side",
      "Dead bugs 8/side",
      "Bird dogs 6/side",
      "Rest 30s; optional second round",
    ],
    cues: [
      "Ribs down, glutes lightly on",
      "Slow limbs on dead bugs — no lumbar arch",
      "Quality holds beat long ugly planks",
    ],
    progressions: [
      "Add 10 seconds to holds by day 7",
    ],
    safety: [
      "Modify side planks to knees if needed",
    ],
    nonContact: true,
  },
  {
    id: "ball-security-conditioning",
    name: "Ball Security Gauntlet (Air)",
    category: "position",
    intensity: "moderate",
    durationMin: 10,
    equipment: [
      "Footballs",
      "Cones",
      "Optional pool noodles for soft taps",
    ],
    positions: [
      "skill",
      "big-skill",
    ],
    summary: "High-knee runs and weave with ball while coaches apply soft noodle taps — no tackling.",
    objective: "Condition while automating four points of pressure.",
    setup: [
      "10-yard lane; coaches with soft noodles only",
    ],
    steps: [
      "High-knee march 10 yards securing ball",
      "Weave cones with ball high and tight",
      "Burst 10 yards; switch hands on jog return",
      "Rotate 6–8 reps each player",
    ],
    cues: [
      "Elbow in, ball high on the rib",
      "Eyes up on the burst",
      "Noodles only — never wrap or grab",
    ],
    progressions: [
      "Add a second ball exchange mid-rep for RBs",
    ],
    safety: [
      "Strict non-contact: soft taps only",
      "Remove any player who initiates contact",
    ],
    nonContact: true,
  },
];

function withDefaults(d: Drill): Drill {
  return {
    ...d,
    contactLevel: d.contactLevel ?? (d.nonContact ? "air" : "thud"),
    ageBands: d.ageBands ?? ["youth", "middle", "high-school", "college-adult"],
  };
}

export const drills: Drill[] = [
  ...coreDrills,
  ...fundamentalDrills,
  ...toConeDrills(),
].map(withDefaults);

export function getDrillById(id: string): Drill | undefined {
  return drills.find((d) => d.id === id);
}

export function getDrillsByCategory(category: DrillCategory | "all"): Drill[] {
  if (category === "all") return drills;
  return drills.filter((d) => d.category === category);
}

export function getDrillsByIds(ids: string[]): Drill[] {
  return ids
    .map((id) => getDrillById(id))
    .filter((d): d is Drill => Boolean(d));
}

export function getConeDrills(): Drill[] {
  return drills.filter((d) => d.series === "cone-agilities");
}

export function getDrillsForAge(age: AgeBand, contactCap?: ContactLevel): Drill[] {
  return drills.filter((d) => {
    if (d.ageBands && !d.ageBands.includes(age)) return false;
    if (contactCap && d.contactLevel) {
      const rank = { air: 0, shells: 1, thud: 2, live: 3 } as const;
      if (rank[d.contactLevel] > rank[contactCap]) return false;
    }
    return true;
  });
}
