//#region node_modules/.nitro/vite/services/ssr/assets/programs-C5ej9dd4.js
var PHASE_LABELS = {
	acclimate: "Acclimate",
	build: "Build",
	sharpen: "Sharpen"
};
var practicePlans = [
	{
		id: "day-1",
		day: 1,
		title: "Camp Opener — Move Well",
		phase: "acclimate",
		focus: "Movement quality, baselines, culture",
		totalMinutes: 75,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		objectives: [
			"Establish warm-up standards and spacing",
			"Install Base Inside/Outside Box from the cone sheet",
			"Baseline tempo fitness without max sprints"
		],
		blocks: [
			{
				title: "Arrival activation",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Cone sheet — base box",
				minutes: 14,
				drillIds: ["cone-base-inside-box", "cone-base-outside-box"],
				notes: "Walk patterns first; then live reps"
			},
			{
				title: "Position movement (air)",
				minutes: 16,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops",
					"specialists-tempo"
				],
				notes: "Split by group simultaneously"
			},
			{
				title: "Team tempo",
				minutes: 16,
				drillIds: ["110-yard-tempo"],
				notes: "Volume by position group — not a gasser day"
			},
			{
				title: "Strength + recover",
				minutes: 14,
				drillIds: ["bodyweight-circuit", "mobility-cooldown"]
			}
		],
		gameIds: ["red-light-green-light", "hot-potato-handoffs"],
		coachNotes: [
			"No competitive finish-line collisions on cone finishes",
			"Pull anyone with soft-tissue tightness early — replace with walk tempo",
			"Film the warm-up once so standards are clear for day 2"
		]
	},
	{
		id: "day-2",
		day: 2,
		title: "Engine Day — Controlled Stress",
		phase: "acclimate",
		focus: "M patterns + COD introduction",
		totalMinutes: 80,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		objectives: [
			"Install Base Inside/Outside M",
			"Raise conditioning density carefully",
			"Lock in cool-down habits"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Cone sheet — M patterns",
				minutes: 16,
				drillIds: [
					"cone-base-inside-m",
					"cone-base-outside-m",
					"pro-agility-5-10-5"
				]
			},
			{
				title: "Position work",
				minutes: 18,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops",
					"ball-security-conditioning"
				]
			},
			{
				title: "Conditioning",
				minutes: 16,
				drillIds: ["sprint-ladder"]
			},
			{
				title: "Core + cool-down",
				minutes: 14,
				drillIds: ["core-finisher", "mobility-cooldown"]
			}
		],
		gameIds: ["steal-the-bacon", "mirror-mayhem"],
		coachNotes: ["Time a few pro-agility reps for curiosity, not ranking day", "Keep M valleys tight — center cone is a gate"]
	},
	{
		id: "day-3",
		day: 3,
		title: "Power Introduction",
		phase: "acclimate",
		focus: "Advanced box intro + horizontal force",
		totalMinutes: 80,
		intensity: "moderate",
		helmets: "helmets",
		contact: "none",
		objectives: [
			"Introduce Advanced Inside Box (carioca + shuffle)",
			"Add sled drives for line/big skill",
			"Helmets only if required — still no contact"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Cone sheet — advanced box",
				minutes: 14,
				drillIds: ["cone-advanced-inside-box", "cone-base-inside-box"],
				notes: "Rehearse carioca/shuffle standards before speed"
			},
			{
				title: "Power / strength",
				minutes: 14,
				drillIds: ["sled-drive", "plyo-power-pack"]
			},
			{
				title: "Position installs",
				minutes: 18,
				drillIds: [
					"ol-dl-getoff-board",
					"wr-db-release-mirror",
					"lb-te-zone-drops",
					"specialists-tempo"
				]
			},
			{
				title: "Finish",
				minutes: 12,
				drillIds: ["core-finisher", "mobility-cooldown"]
			}
		],
		gameIds: ["line-getoff-duels", "whistle-reaction-wars"],
		coachNotes: ["Helmets are for posture awareness only — no thudding", "Carioca quality over carioca speed"]
	},
	{
		id: "day-4",
		day: 4,
		title: "Change of Direction Lab",
		phase: "build",
		focus: "Pro agility + 360s + figure 8s",
		totalMinutes: 85,
		intensity: "high",
		helmets: "none",
		contact: "none",
		objectives: ["Own multi-direction COD under light fatigue", "Competitive reaction without contact"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "COD sheet",
				minutes: 20,
				drillIds: [
					"cone-360s",
					"cone-figure-8s",
					"pro-agility-5-10-5",
					"cone-advanced-inside-m"
				]
			},
			{
				title: "Position COD",
				minutes: 18,
				drillIds: [
					"wr-db-release-mirror",
					"lb-te-zone-drops",
					"ball-security-conditioning"
				]
			},
			{
				title: "Conditioning",
				minutes: 16,
				drillIds: ["hiit-gassers", "sprint-ladder"]
			},
			{
				title: "Recover",
				minutes: 12,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: [
			"four-corner-chaos",
			"pursuit-angles",
			"partner-towels"
		],
		coachNotes: ["Games close practice — keep them non-contact and joyful", "Film one 5-10-5 for teaching angles"]
	},
	{
		id: "day-5",
		day: 5,
		title: "Mid-Camp Compete",
		phase: "build",
		focus: "Team energy + mixed conditioning",
		totalMinutes: 85,
		intensity: "high",
		helmets: "helmets",
		contact: "none",
		objectives: ["Compete hard with zero tackling", "Mix relays and skill gauntlets"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Cone refresh",
				minutes: 12,
				drillIds: ["cone-base-inside-box", "cone-advanced-outside-box"]
			},
			{
				title: "Strength circuit",
				minutes: 14,
				drillIds: ["bodyweight-circuit", "sled-drive"]
			},
			{
				title: "Position compete (air)",
				minutes: 18,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"specialists-tempo"
				]
			},
			{
				title: "Team conditioning",
				minutes: 14,
				drillIds: ["110-yard-tempo"]
			},
			{
				title: "Cool-down",
				minutes: 10,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: [
			"cone-relay-gauntlet",
			"escape-artist",
			"around-the-world-relay",
			"flag-finish-dash"
		],
		coachNotes: ["This is the fun day — still enforce spacing and soft tags only", "End on a team win, not individual shame"]
	},
	{
		id: "day-6",
		day: 6,
		title: "Active Recovery + Skill",
		phase: "build",
		focus: "Lower volume, higher skill standards",
		totalMinutes: 70,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		objectives: ["Flush legs with tempo and mobility", "Touch ball security and accuracy"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Light COD",
				minutes: 12,
				drillIds: ["cone-figure-8s", "cone-base-outside-m"]
			},
			{
				title: "Skill stations",
				minutes: 20,
				drillIds: ["ball-security-conditioning", "specialists-tempo"]
			},
			{
				title: "Core + mobility",
				minutes: 16,
				drillIds: ["core-finisher", "mobility-cooldown"]
			}
		],
		gameIds: [
			"qb-accuracy-gauntlet",
			"ultimate-air-ball",
			"king-of-the-grid"
		],
		coachNotes: ["Keep heart rates conversational on tempo segments"]
	},
	{
		id: "day-7",
		day: 7,
		title: "Advanced Patterns",
		phase: "build",
		focus: "X drills, advanced M, multi-style feet",
		totalMinutes: 85,
		intensity: "high",
		helmets: "none",
		contact: "none",
		objectives: ["Complete the cone sheet advanced set", "Compete on reaction and pursuit"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Advanced cone sheet",
				minutes: 22,
				drillIds: [
					"cone-advanced-inside-m",
					"cone-advanced-outside-m",
					"cone-inside-x",
					"cone-outside-x",
					"cone-360s"
				]
			},
			{
				title: "Position",
				minutes: 18,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops"
				]
			},
			{
				title: "Conditioning",
				minutes: 14,
				drillIds: ["hiit-gassers"]
			},
			{
				title: "Recover",
				minutes: 12,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: [
			"pursuit-angles",
			"shark-tank-shuffles",
			"cod-ladder-wars"
		],
		coachNotes: ["X-drill bridges are controlled jogs, not sprints between starts"]
	},
	{
		id: "day-8",
		day: 8,
		title: "Sharpen — Speed Window",
		phase: "sharpen",
		focus: "Quality speed + clean competitive finishers",
		totalMinutes: 80,
		intensity: "high",
		helmets: "shells",
		contact: "none",
		objectives: ["Peak acceleration quality", "Shells for posture only if required"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Speed + COD",
				minutes: 18,
				drillIds: [
					"sprint-ladder",
					"pro-agility-5-10-5",
					"cone-base-inside-box"
				]
			},
			{
				title: "Power",
				minutes: 12,
				drillIds: ["plyo-power-pack", "sled-drive"]
			},
			{
				title: "Position",
				minutes: 16,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"specialists-tempo"
				]
			},
			{
				title: "Cool-down",
				minutes: 12,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: [
			"flag-finish-dash",
			"line-getoff-duels",
			"red-zone-burst"
		],
		coachNotes: ["Shells never mean contact — pull anyone who thuds"]
	},
	{
		id: "day-9",
		day: 9,
		title: "Game Day Rehearsal (Air)",
		phase: "sharpen",
		focus: "Team competitive block + standards",
		totalMinutes: 85,
		intensity: "high",
		helmets: "helmets",
		contact: "none",
		objectives: ["Run a full non-contact competitive period", "Rehearse communication under fatigue"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Team install (air)",
				minutes: 20,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops",
					"ball-security-conditioning"
				]
			},
			{
				title: "Conditioning train",
				minutes: 16,
				drillIds: ["110-yard-tempo", "hiit-gassers"]
			},
			{
				title: "Strength + recover",
				minutes: 14,
				drillIds: ["bodyweight-circuit", "mobility-cooldown"]
			}
		],
		gameIds: [
			"cone-relay-gauntlet",
			"ultimate-air-ball",
			"around-the-world-relay",
			"tempo-train"
		],
		coachNotes: ["Games are the highlight — keep scoreboards visible", "Zero tolerance for contact celebrations that shove"]
	},
	{
		id: "day-10",
		day: 10,
		title: "Camp Finale — Prove It",
		phase: "sharpen",
		focus: "Showcase standards, then celebrate",
		totalMinutes: 80,
		intensity: "high",
		helmets: "none",
		contact: "none",
		objectives: ["Retest key COD and tempo markers", "End camp with competitive joy"],
		blocks: [
			{
				title: "Warm-up",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Retest window",
				minutes: 16,
				drillIds: [
					"pro-agility-5-10-5",
					"cone-advanced-inside-box",
					"sprint-ladder"
				]
			},
			{
				title: "Position pride",
				minutes: 16,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops",
					"specialists-tempo"
				]
			},
			{
				title: "Team finisher",
				minutes: 14,
				drillIds: ["110-yard-tempo"]
			},
			{
				title: "Cool-down + close",
				minutes: 12,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: [
			"four-corner-chaos",
			"steal-the-bacon",
			"flag-finish-dash",
			"cone-relay-gauntlet"
		],
		coachNotes: ["Celebrate effort and standards, not just winners", "Preview next week's padded progression carefully"]
	}
];
function getPlanDrillCount(plan) {
	return plan.blocks.reduce((n, b) => n + b.drillIds.length, 0);
}
/** Map original 10-day camp → HS preseason track with defaults. */
var hsCampPlans = practicePlans.map((p) => ({
	...p,
	trackId: "hs-preseason-camp",
	ageBands: ["high-school", "college-adult"],
	contactCap: "air",
	contact: p.contact
}));
var youthPlans = [
	{
		id: "youth-d1",
		day: 1,
		title: "Youth Day 1 — Move & Secure",
		phase: "acclimate",
		focus: "Stance, start, ball security, fun competition",
		totalMinutes: 60,
		intensity: "low",
		helmets: "none",
		contact: "none",
		trackId: "youth-foundations",
		ageBands: ["youth"],
		contactCap: "air",
		objectives: [
			"Learn team warm-up standards",
			"Secure the football every rep",
			"Compete without chaos"
		],
		blocks: [
			{
				title: "Play warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Stance & start",
				minutes: 10,
				drillIds: ["stance-start-all"]
			},
			{
				title: "Ball security",
				minutes: 12,
				drillIds: ["ball-security-conditioning", "catch-and-secure-gauntlet"]
			},
			{
				title: "Agility fun",
				minutes: 12,
				drillIds: ["cone-base-inside-box", "cone-figure-8s"]
			},
			{
				title: "Game + reset",
				minutes: 12,
				drillIds: ["recovery-mobility-pro"]
			}
		],
		gameIds: ["red-light-green-light", "hot-potato-handoffs"],
		coachNotes: ["Keep lines short — kids need touches", "Celebrate secure football louder than speed"]
	},
	{
		id: "youth-d2",
		day: 2,
		title: "Youth Day 2 — Catch & Cut",
		phase: "acclimate",
		focus: "Hands, simple routes, one-cut running",
		totalMinutes: 65,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		trackId: "youth-foundations",
		ageBands: ["youth"],
		contactCap: "air",
		objectives: [
			"Catch with hands and tuck",
			"One decisive cut on zone track",
			"Introduce form fit on soft pads"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Routes & catch",
				minutes: 14,
				drillIds: ["wr-route-tree-air", "catch-and-secure-gauntlet"]
			},
			{
				title: "RB track",
				minutes: 12,
				drillIds: ["rb-zone-track-cuts", "qb-mesh-handoff-series"]
			},
			{
				title: "Safe tackle intro",
				minutes: 12,
				drillIds: ["youth-flag-to-tackle-bridge"]
			},
			{
				title: "Team air",
				minutes: 10,
				drillIds: ["seven-on-seven"]
			}
		],
		gameIds: ["steal-the-bacon", "flag-finish-dash"],
		coachNotes: ["Bridge drill is hug-the-pad only — no player takedowns", "Water break every 15 minutes"]
	},
	{
		id: "youth-d3",
		day: 3,
		title: "Youth Day 3 — Pursuit & Play",
		phase: "build",
		focus: "Angles, lanes, and joyful competition",
		totalMinutes: 65,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		trackId: "youth-foundations",
		ageBands: ["youth"],
		contactCap: "air",
		objectives: [
			"Run correct pursuit angles",
			"Stay in ST lanes",
			"Compete hard with whistle discipline"
		],
		blocks: [
			{
				title: "Warm-up + COD",
				minutes: 14,
				drillIds: ["dynamic-warmup-circuit", "cone-base-outside-box"]
			},
			{
				title: "Pursuit",
				minutes: 14,
				drillIds: ["pursuit-angle-air", "form-tackle-fit-progression"],
				notes: "Form fit on shields only"
			},
			{
				title: "Special teams air",
				minutes: 12,
				drillIds: ["st-coverage-lanes-air", "specialists-tempo"]
			},
			{
				title: "Team games",
				minutes: 14,
				drillIds: ["seven-on-seven"]
			},
			{
				title: "Cool-down",
				minutes: 8,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: ["cone-relay-gauntlet", "red-light-green-light"],
		coachNotes: ["Form tackle phase stops at shield fit for most youth groups", "End on a high — games before cool-down if energy is good"]
	},
	{
		id: "youth-d4",
		day: 4,
		title: "Youth Day 4 — Showcase",
		phase: "sharpen",
		focus: "Parents-visible standards day",
		totalMinutes: 70,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		trackId: "youth-foundations",
		ageBands: ["youth"],
		contactCap: "shells",
		objectives: [
			"Show stance, secure, and team air offense",
			"Safe shield contact only if ready",
			"Celebrate effort and listening"
		],
		blocks: [
			{
				title: "Activation",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit", "stance-start-all"]
			},
			{
				title: "Skills circuit",
				minutes: 16,
				drillIds: [
					"catch-and-secure-gauntlet",
					"qb-drop-progression",
					"cone-base-inside-m"
				]
			},
			{
				title: "Team air",
				minutes: 16,
				drillIds: ["team-tempo-install", "seven-on-seven"]
			},
			{
				title: "Competitive finish",
				minutes: 14,
				drillIds: ["sprint-ladder"]
			},
			{
				title: "Close",
				minutes: 8,
				drillIds: ["recovery-mobility-pro"]
			}
		],
		gameIds: ["steal-the-bacon", "hot-potato-handoffs"],
		coachNotes: ["Invite parents to watch standards, not collisions", "Hand out one team standard for the week"]
	}
];
var middlePlans = [
	{
		id: "ms-d1",
		day: 1,
		title: "MS Day 1 — Air Base",
		phase: "acclimate",
		focus: "Movement + form fit without shells",
		totalMinutes: 90,
		intensity: "moderate",
		helmets: "none",
		contact: "none",
		trackId: "middle-shells-week",
		ageBands: ["middle"],
		contactCap: "air",
		objectives: [
			"Camp standards and spacing",
			"Form tackle geometry on shields",
			"Base cone COD"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 14,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "COD",
				minutes: 16,
				drillIds: ["cone-base-inside-box", "cone-base-outside-m"]
			},
			{
				title: "Form tackle",
				minutes: 16,
				drillIds: ["form-tackle-fit-progression", "pursuit-angle-air"]
			},
			{
				title: "Position air",
				minutes: 20,
				drillIds: [
					"wr-db-release-mirror",
					"ol-dl-getoff-board",
					"lb-te-zone-drops",
					"qb-drop-progression"
				]
			},
			{
				title: "Tempo + recover",
				minutes: 16,
				drillIds: ["110-yard-tempo", "mobility-cooldown"]
			}
		],
		gameIds: ["four-corner-chaos", "whistle-reaction-wars"],
		coachNotes: ["No shells today — technique only"]
	},
	{
		id: "ms-d2",
		day: 2,
		title: "MS Day 2 — Shells Fit",
		phase: "build",
		focus: "First shells period after air base",
		totalMinutes: 95,
		intensity: "moderate",
		helmets: "shells",
		contact: "none",
		trackId: "middle-shells-week",
		ageBands: ["middle"],
		contactCap: "shells",
		objectives: [
			"Equipment check",
			"Shells fit-up on OL/DL and tackle",
			"7-on-7 competition"
		],
		blocks: [
			{
				title: "Warm-up in shells",
				minutes: 14,
				drillIds: ["dynamic-warmup-circuit", "stance-start-all"]
			},
			{
				title: "Line fit",
				minutes: 16,
				drillIds: ["ol-drive-block-fit", "dl-hand-combat-circuit"]
			},
			{
				title: "Tackle fit",
				minutes: 14,
				drillIds: ["form-tackle-fit-progression"]
			},
			{
				title: "Pass skeleton",
				minutes: 18,
				drillIds: ["seven-on-seven", "wr-route-tree-air"]
			},
			{
				title: "Engine",
				minutes: 16,
				drillIds: ["hiit-gassers"],
				notes: "Reduce volume if heat is high"
			},
			{
				title: "Recover",
				minutes: 10,
				drillIds: ["recovery-mobility-pro"]
			}
		],
		gameIds: ["cone-relay-gauntlet"],
		coachNotes: ["Full equipment fit check before first contact period", "Thud is NOT scheduled until technique holds"]
	},
	{
		id: "ms-d3",
		day: 3,
		title: "MS Day 3 — Thud Intro",
		phase: "build",
		focus: "Controlled thud inside run + pursuit",
		totalMinutes: 95,
		intensity: "high",
		helmets: "shells",
		contact: "none",
		trackId: "middle-shells-week",
		ageBands: ["middle"],
		contactCap: "thud",
		objectives: [
			"Inside run thud with whistle discipline",
			"Gap integrity",
			"Competitive but safe finish"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Individual",
				minutes: 16,
				drillIds: [
					"lb-scrape-and-fit",
					"ol-zone-combo-walkthrough",
					"db-backpedal-break"
				]
			},
			{
				title: "Thud inside run",
				minutes: 18,
				drillIds: ["inside-run-thud"]
			},
			{
				title: "Team air / 7v7",
				minutes: 16,
				drillIds: ["seven-on-seven", "team-tempo-install"]
			},
			{
				title: "Condition + close",
				minutes: 16,
				drillIds: ["shuttle-suicide", "mobility-cooldown"]
			}
		],
		gameIds: ["pursuit-tag-race"],
		coachNotes: ["Short thud window — quality over quantity", "Match sizes; pull head-down reps immediately"]
	}
];
var adultPlans = [
	{
		id: "adult-d1",
		day: 1,
		title: "Install 1 — Structure & Protections",
		phase: "acclimate",
		focus: "Base runs, protections, coverage families",
		totalMinutes: 120,
		intensity: "moderate",
		helmets: "helmets",
		contact: "none",
		trackId: "adult-install-week",
		ageBands: ["college-adult", "high-school"],
		contactCap: "air",
		objectives: [
			"Install base gap/zone menu",
			"Protection ID language",
			"Coverage shells air"
		],
		blocks: [
			{
				title: "Activation",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Individual",
				minutes: 24,
				drillIds: [
					"ol-zone-combo-walkthrough",
					"dl-hand-combat-circuit",
					"qb-drop-progression",
					"db-backpedal-break",
					"lb-scrape-and-fit"
				]
			},
			{
				title: "Blitz / protection air",
				minutes: 16,
				drillIds: ["blitz-pickup-air"]
			},
			{
				title: "Team tempo install",
				minutes: 28,
				drillIds: ["team-tempo-install", "seven-on-seven"]
			},
			{
				title: "Special teams",
				minutes: 16,
				drillIds: ["st-coverage-lanes-air", "specialists-tempo"]
			},
			{
				title: "Engine + recover",
				minutes: 16,
				drillIds: ["110-yard-tempo", "recovery-mobility-pro"]
			}
		],
		gameIds: ["whistle-reaction-wars"],
		coachNotes: ["Film individual periods; install detail over volume"]
	},
	{
		id: "adult-d2",
		day: 2,
		title: "Install 2 — Shells + Thud Run",
		phase: "build",
		focus: "Competitive fit and inside run thud",
		totalMinutes: 125,
		intensity: "high",
		helmets: "shells",
		contact: "none",
		trackId: "adult-install-week",
		ageBands: ["college-adult", "high-school"],
		contactCap: "thud",
		objectives: [
			"Shells competitive periods",
			"Inside run thud standards",
			"Red-zone menu air"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit", "plyo-power-pack"]
			},
			{
				title: "COD + get-off",
				minutes: 14,
				drillIds: ["cone-advanced-inside-box", "ol-dl-getoff-board"]
			},
			{
				title: "Group work",
				minutes: 24,
				drillIds: [
					"ol-drive-block-fit",
					"form-tackle-fit-progression",
					"wr-route-tree-air",
					"te-release-and-seam"
				]
			},
			{
				title: "Thud inside",
				minutes: 18,
				drillIds: ["inside-run-thud"]
			},
			{
				title: "Team / red zone",
				minutes: 24,
				drillIds: [
					"team-tempo-install",
					"redzone-situational",
					"seven-on-seven"
				]
			},
			{
				title: "Finish",
				minutes: 14,
				drillIds: ["hiit-gassers", "recovery-mobility-pro"]
			}
		],
		gameIds: ["pursuit-tag-race", "four-corner-chaos"],
		coachNotes: ["Manage vet snap counts", "Ice and soft tissue after thud"]
	},
	{
		id: "adult-d3",
		day: 3,
		title: "Install 3 — Situational & ST",
		phase: "sharpen",
		focus: "Two-minute, red zone, specialists",
		totalMinutes: 110,
		intensity: "high",
		helmets: "shells",
		contact: "none",
		trackId: "adult-install-week",
		ageBands: ["college-adult", "high-school"],
		contactCap: "thud",
		objectives: [
			"Own two-minute operation",
			"Red-zone efficiency",
			"ST lane integrity"
		],
		blocks: [
			{
				title: "Activation",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Situational",
				minutes: 28,
				drillIds: [
					"two-minute-drill",
					"redzone-situational",
					"blitz-pickup-air"
				]
			},
			{
				title: "7v7 competitive",
				minutes: 18,
				drillIds: ["seven-on-seven"]
			},
			{
				title: "Special teams",
				minutes: 20,
				drillIds: [
					"st-coverage-lanes-air",
					"specialists-tempo",
					"pursuit-angle-air"
				]
			},
			{
				title: "Team script",
				minutes: 18,
				drillIds: ["team-tempo-install"]
			},
			{
				title: "Recover",
				minutes: 10,
				drillIds: ["recovery-mobility-pro"]
			}
		],
		gameIds: ["steal-the-bacon"],
		coachNotes: ["Walk-through tomorrow if legs are heavy"]
	}
];
var inSeasonPlans = [
	{
		id: "isz-mon",
		day: 1,
		title: "Game Week — Install / Correction",
		phase: "build",
		focus: "Scout install, corrections, limited contact",
		totalMinutes: 100,
		intensity: "moderate",
		helmets: "shells",
		contact: "none",
		trackId: "in-season-game-week",
		ageBands: ["high-school", "college-adult"],
		contactCap: "thud",
		objectives: [
			"Install scout looks",
			"Correct last game errors",
			"One thud period max"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Individual corrections",
				minutes: 20,
				drillIds: [
					"form-tackle-fit-progression",
					"ol-zone-combo-walkthrough",
					"db-backpedal-break",
					"qb-drop-progression"
				]
			},
			{
				title: "Team install",
				minutes: 28,
				drillIds: ["team-tempo-install", "blitz-pickup-air"]
			},
			{
				title: "Thud period",
				minutes: 14,
				drillIds: ["inside-run-thud"]
			},
			{
				title: "ST + recover",
				minutes: 16,
				drillIds: ["st-coverage-lanes-air", "recovery-mobility-pro"]
			}
		],
		gameIds: [],
		coachNotes: ["Keep legs for Friday/Saturday"]
	},
	{
		id: "isz-wed",
		day: 2,
		title: "Game Week — Competitive",
		phase: "sharpen",
		focus: "7v7, team script, special teams",
		totalMinutes: 95,
		intensity: "high",
		helmets: "shells",
		contact: "none",
		trackId: "in-season-game-week",
		ageBands: ["high-school", "college-adult"],
		contactCap: "shells",
		objectives: [
			"Competitive pass periods",
			"Clean script vs scout",
			"ST polish"
		],
		blocks: [
			{
				title: "Warm-up",
				minutes: 12,
				drillIds: ["dynamic-warmup-circuit", "plyo-power-pack"]
			},
			{
				title: "Group",
				minutes: 20,
				drillIds: [
					"wr-route-tree-air",
					"lb-scrape-and-fit",
					"ol-drive-block-fit"
				]
			},
			{
				title: "7v7 + team",
				minutes: 30,
				drillIds: [
					"seven-on-seven",
					"team-tempo-install",
					"two-minute-drill"
				]
			},
			{
				title: "ST",
				minutes: 16,
				drillIds: ["st-coverage-lanes-air", "specialists-tempo"]
			},
			{
				title: "Close",
				minutes: 10,
				drillIds: ["mobility-cooldown"]
			}
		],
		gameIds: ["whistle-reaction-wars"],
		coachNotes: ["No gassers — speed work only if needed"]
	},
	{
		id: "isz-thu",
		day: 3,
		title: "Game Week — Walkthrough / Edge",
		phase: "sharpen",
		focus: "Mental reps, situational, freshness",
		totalMinutes: 60,
		intensity: "low",
		helmets: "none",
		contact: "none",
		trackId: "in-season-game-week",
		ageBands: ["high-school", "college-adult"],
		contactCap: "air",
		objectives: [
			"Walkthrough situations",
			"Specialists timing",
			"Leave fresh"
		],
		blocks: [
			{
				title: "Move the body",
				minutes: 10,
				drillIds: ["dynamic-warmup-circuit"]
			},
			{
				title: "Situational walkthrough",
				minutes: 24,
				drillIds: [
					"two-minute-drill",
					"redzone-situational",
					"team-tempo-install"
				],
				notes: "Walk/jog speed"
			},
			{
				title: "Specialists",
				minutes: 12,
				drillIds: ["specialists-tempo"]
			},
			{
				title: "Reset",
				minutes: 10,
				drillIds: ["recovery-mobility-pro"]
			}
		],
		gameIds: [],
		coachNotes: ["Short and sharp — trust the week"]
	}
];
var allProgramPlans = [
	...hsCampPlans,
	...youthPlans,
	...middlePlans,
	...adultPlans,
	...inSeasonPlans
];
var programTracks = [
	{
		id: "youth-foundations",
		name: "Youth Foundations Camp",
		shortName: "Youth",
		ageBands: ["youth"],
		season: "preseason",
		days: 4,
		contactCap: "shells",
		summary: "4-day intro for 8–11s: movement, ball security, safe tackle geometry, and games that teach.",
		goals: [
			"Love practice",
			"Secure the ball",
			"Heads-up form fits only"
		],
		planIds: youthPlans.map((p) => p.id)
	},
	{
		id: "middle-shells-week",
		name: "Middle School Shells Week",
		shortName: "MS Shells",
		ageBands: ["middle"],
		season: "preseason",
		days: 3,
		contactCap: "thud",
		summary: "Air base → shells fit → short thud windows for 12–14s with strict whistle standards.",
		goals: [
			"Earn shells",
			"Form tackle before freelancing",
			"Gap integrity"
		],
		planIds: middlePlans.map((p) => p.id)
	},
	{
		id: "hs-preseason-camp",
		name: "HS / Adult Preseason Camp",
		shortName: "HS Camp",
		ageBands: ["high-school", "college-adult"],
		season: "preseason",
		days: 10,
		contactCap: "air",
		summary: "10-day non-contact acclimation: cone sheet, engine, position air, and competitive games before pads.",
		goals: [
			"Condition without soft-tissue damage",
			"Install COD standards",
			"Build competitive culture"
		],
		planIds: hsCampPlans.map((p) => p.id)
	},
	{
		id: "adult-install-week",
		name: "Install Week (Pads Progression)",
		shortName: "Install",
		ageBands: ["high-school", "college-adult"],
		season: "preseason",
		days: 3,
		contactCap: "thud",
		summary: "Scheme install with shells and thud run periods — college/adult tempo and situational football.",
		goals: [
			"Own base menu",
			"Protection language",
			"Situational excellence"
		],
		planIds: adultPlans.map((p) => p.id)
	},
	{
		id: "in-season-game-week",
		name: "In-Season Game Week",
		shortName: "Game Week",
		ageBands: ["high-school", "college-adult"],
		season: "in-season",
		days: 3,
		contactCap: "thud",
		summary: "Mon–Wed style template: install/correct, competitive, walkthrough edge.",
		goals: [
			"Fresh legs for kickoff",
			"Scout detail",
			"Situational readiness"
		],
		planIds: inSeasonPlans.map((p) => p.id)
	}
];
function getTrackById(id) {
	return programTracks.find((t) => t.id === id);
}
function getPlansForTrack(trackId) {
	return allProgramPlans.filter((p) => p.trackId === trackId).sort((a, b) => a.day - b.day);
}
function getProgramPlanById(id) {
	return allProgramPlans.find((p) => p.id === id);
}
//#endregion
export { getProgramPlanById as a, getPlansForTrack as i, allProgramPlans as n, getTrackById as o, getPlanDrillCount as r, programTracks as s, PHASE_LABELS as t };
