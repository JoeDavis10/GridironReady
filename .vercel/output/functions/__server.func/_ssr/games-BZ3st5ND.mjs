//#region node_modules/.nitro/vite/services/ssr/assets/games-BZ3st5ND.js
var KIND_LABELS = {
	relay: "Relay",
	race: "Race",
	reaction: "Reaction",
	team: "Team",
	skill: "Skill"
};
var competitiveGames = [
	{
		id: "cone-relay-gauntlet",
		name: "Cone Relay Gauntlet",
		kind: "relay",
		intensity: "high",
		durationMin: 12,
		players: "4–8 per team",
		equipment: [
			"12 cones",
			"2 footballs (optional)",
			"Whistle"
		],
		summary: "Team relay through Base Box → M → finish sprint. First team to cycle everyone wins.",
		objective: "Compete with clean COD under fatigue — zero contact.",
		setup: [
			"Build two identical stations side by side (5 yards apart)",
			"Station A: Base Inside Box pattern",
			"Station B: Base Inside M pattern",
			"Teams line up behind start cones"
		],
		howToPlay: [
			"On whistle, runner 1 completes Box, then M, then 10-yard finish sprint",
			"Tags next teammate with a hand slap (no push)",
			"Every player goes once; optional second lap for advanced groups",
			"False start or missed cone = 5-yard penalty jog before tag"
		],
		scoring: ["Winner: first team finished", "Style bonus: coaches can award a 'cleanest cuts' flag that ties breakers"],
		coachingCues: [
			"Tag soft — no shoving into the path",
			"Eyes up on the handoff zone",
			"Next runner live on the balls of the feet"
		],
		safety: [
			"Separate lanes with 5+ yards",
			"No diving tags",
			"Stop if a lane collision is imminent"
		],
		playableId: "pattern-race",
		nonContact: true
	},
	{
		id: "pursuit-angles",
		name: "Pursuit Angles",
		kind: "race",
		intensity: "high",
		durationMin: 10,
		players: "Pairs",
		equipment: ["Cones for 20-yard square", "Whistle"],
		summary: "Ball-carrier (air) vs pursuer race to a sideline cone — angle pursuit without tackling.",
		objective: "Train pursuit angles and accelerate-to-close without contact.",
		setup: [
			"20-yard square with four corner targets",
			"Carrier starts mid-hash; pursuer starts 3 yards behind",
			"Coach points a corner on the snap"
		],
		howToPlay: [
			"On point, carrier sprints to that corner cone",
			"Pursuer takes the angle and tries to beat them to a cone 2 yards short (mirror cone)",
			"Pursuer wins by touching their mirror cone first — never the carrier",
			"Swap roles every 2 reps"
		],
		scoring: ["1 point for winning the race to your cone", "Play to 5"],
		coachingCues: [
			"Pursuer: take grass away — don't trail",
			"Carrier: sell the stem, then commit",
			"Hands free — zero grabs"
		],
		safety: ["Strict no-touch rule on the carrier", "Call dead if paths converge dangerously"],
		playableId: "pursuit-tap",
		nonContact: true
	},
	{
		id: "king-of-the-grid",
		name: "King of the Grid",
		kind: "team",
		intensity: "moderate",
		durationMin: 12,
		players: "6–12",
		equipment: ["9 cones in a 3×3 grid", "Pinnies"],
		summary: "Possession game: advance a ball across a 3×3 cone grid with only lateral shuffles and handoffs.",
		objective: "Team movement, spacing, and communication under a no-run-forward rule.",
		setup: [
			"3×3 grid, 5 yards between cones",
			"Two teams of 3–6",
			"One soft football or towel ball"
		],
		howToPlay: [
			"Offense starts on back row; must advance the ball one grid row per successful handoff",
			"Players may only shuffle or carioca — no forward sprints with the ball",
			"Defense mirrors without contact; force a bad pass (ball hits ground) for a turnover",
			"Score by completing a handoff on the far row"
		],
		scoring: ["1 point per far-row completion", "Play to 5 or 8 minutes"],
		coachingCues: [
			"Move without the ball — open windows",
			"Defense: squeeze space, don't reach",
			"Quick hands on exchanges"
		],
		safety: ["No wrapping, screening with body contact, or diving"],
		nonContact: true
	},
	{
		id: "whistle-reaction-wars",
		name: "Whistle Reaction Wars",
		kind: "reaction",
		intensity: "high",
		durationMin: 8,
		players: "Whole team in lines",
		equipment: ["Whistle", "Cones at 5 and 10 yards"],
		summary: "Competitive first-step game: different whistle codes mean different directions.",
		objective: "Sharpen auditory reaction and first three steps.",
		setup: [
			"Players in athletic stance on a line",
			"Cones 5 yards left, right, and forward",
			"Coach pre-briefs codes"
		],
		howToPlay: [
			"1 whistle = sprint forward 5",
			"2 whistles = shuffle right 5",
			"3 whistles = shuffle left 5",
			"Long whistle = backpedal 5",
			"First player to the correct cone scores; false start sits a rep"
		],
		scoring: ["Individual tallies or position-group totals", "Loser group does 4 perfect push-ups (quality, not punishment grind)"],
		coachingCues: [
			"Load the stance before the whistle",
			"Don't guess — win the honest rep",
			"Decelerate under control at the cone"
		],
		safety: ["Leave space between players in the line", "No shoving on the break"],
		playableId: "reaction",
		nonContact: true
	},
	{
		id: "escape-artist",
		name: "Escape Artist",
		kind: "skill",
		intensity: "moderate",
		durationMin: 10,
		players: "Groups of 4–6",
		equipment: ["6–8 cones in a gauntlet", "Football"],
		summary: "Ball-security weave race: high-knee gauntlet with optional soft noodle taps only.",
		objective: "Compete on ball security + quick feet without tackling.",
		setup: [
			"Two parallel gauntlets of 6 cones",
			"Coaches with pool noodles (soft taps only) optional",
			"Ball for each line"
		],
		howToPlay: [
			"On go, weave the gauntlet with ball high and tight",
			"Finish with 10-yard burst",
			"Next teammate goes on the handoff/tag",
			"Drop or lose ball security form = restart that runner"
		],
		scoring: ["Fastest clean team time", "Drops add +3 seconds"],
		coachingCues: [
			"Elbow in, ball on the rib",
			"Eyes up on the burst",
			"Noodles only — no wraps"
		],
		safety: ["Soft taps only if using noodles", "One runner per gauntlet"],
		playableId: "ball-secure",
		nonContact: true
	},
	{
		id: "mirror-mayhem",
		name: "Mirror Mayhem",
		kind: "reaction",
		intensity: "moderate",
		durationMin: 8,
		players: "Pairs",
		equipment: ["5×5 yard boxes"],
		summary: "Leader vs mirror in a box — 20-second bouts, judges score who forced more breaks.",
		objective: "Lateral endurance and reactive feet, pure non-contact.",
		setup: [
			"Mark 5×5 boxes",
			"Pairs face each other",
			"Coach times 20s work / 20s rest"
		],
		howToPlay: [
			"Leader tries to freeze the mirror with fakes and cuts",
			"Mirror stays square and matches without touching",
			"After 20s, roles reverse",
			"3 rounds each"
		],
		scoring: ["Coach or peer scores 1–5 on 'tough to stick'", "Highest combined score wins the pair challenge"],
		coachingCues: [
			"Stay in the box",
			"Change direction every 1–2 seconds as leader",
			"Mirror: low hips, quiet feet"
		],
		safety: ["Reset if bodies collide — no points for contact"],
		playableId: "mirror-match",
		nonContact: true
	},
	{
		id: "four-corner-chaos",
		name: "Four-Corner Chaos",
		kind: "race",
		intensity: "high",
		durationMin: 10,
		players: "4–16",
		equipment: [
			"4 cones",
			"4 colored pinnies or numbers",
			"Whistle"
		],
		summary: "Sprint race to a called corner; last player in is out that round — elimination heat.",
		objective: "Max effort COD with listening and spatial awareness.",
		setup: [
			"Large square 15–20 yards",
			"Label corners 1–4 or by color",
			"Players start center"
		],
		howToPlay: [
			"Coach calls a corner; everyone sprints there",
			"Last 1–2 players are 'out' and become judges",
			"Continue until 2 remain for a final",
			"Variation: two calls in sequence (1 then 3)"
		],
		scoring: ["Last player standing wins the heat", "Run 2–3 heats"],
		coachingCues: [
			"Plant and redirect — no looping",
			"Chin up when you hear the call",
			"Out players coach the next heat"
		],
		safety: ["No pushing at the cone", "Use large square to reduce congestion"],
		playableId: "four-corner",
		nonContact: true
	},
	{
		id: "tempo-train",
		name: "Tempo Train",
		kind: "relay",
		intensity: "moderate",
		durationMin: 12,
		players: "Whole team",
		equipment: [
			"Field hashes",
			"Whistle",
			"Clock"
		],
		summary: "Continuous 110 train: groups leave every 15 seconds; compete for fewest form breaks.",
		objective: "Aerobic quality under social pressure — standards over trash talk.",
		setup: [
			"Goal line to opposite 10",
			"Groups of 4–5",
			"Assigned leave times"
		],
		howToPlay: [
			"Group 1 leaves on 0; Group 2 on 0:15, etc.",
			"70–80% tempo — coaches flag anyone sprinting 95%+",
			"Team goal: complete assigned reps with zero form flags",
			"Winning group = fewest flags + held pace"
		],
		scoring: [
			"Form flags (−1)",
			"Missed leave time (−1)",
			"Highest score wins pride"
		],
		coachingCues: [
			"Smooth rhythm",
			"Relaxed face",
			"Even splits"
		],
		safety: ["Not a max gasser day", "Pull cramping athletes immediately"],
		playableId: "whistle-chase",
		nonContact: true
	},
	{
		id: "flag-finish-dash",
		name: "Flag Finish Dash",
		kind: "race",
		intensity: "high",
		durationMin: 8,
		players: "4–12",
		equipment: ["Cones at 10/20/30", "Soft flags or pinnies on a stand"],
		summary: "Race to pull a hanging flag at the finish — pure speed, zero tackling.",
		objective: "Compete on acceleration and finish posture without contact.",
		setup: [
			"Parallel 30-yard lanes",
			"Soft flag or pinnie hanging at each finish (or cone to knock)",
			"Stagger starts by group if space is tight"
		],
		howToPlay: [
			"On whistle, sprint the assigned distance (10 / 20 / 30 rotation)",
			"Winner is first to pull the flag cleanly (or touch finish cone)",
			"Walk back outside the lanes",
			"Best of 3 per distance, then rotate distances"
		],
		scoring: ["1 point per win", "Bonus point for clean upright finish posture"],
		coachingCues: [
			"Drive phase first 8 yards",
			"Eyes on the flag, not the rival",
			"Don't dive for the flag"
		],
		safety: ["One athlete per lane", "Clear the finish zone immediately"],
		nonContact: true
	},
	{
		id: "cod-ladder-wars",
		name: "COD Ladder Wars",
		kind: "relay",
		intensity: "high",
		durationMin: 10,
		players: "2 teams of 4–6",
		equipment: ["2 agility ladders or cone ladders", "Whistle"],
		summary: "Head-to-head ladder patterns — first team through the card of moves wins.",
		objective: "Foot speed + pattern discipline under head-to-head pressure.",
		setup: [
			"Two ladders parallel, 5 yards apart",
			"Card of 4 patterns posted (icky, in-in-out-out, lateral, hopscotch)",
			"Teams line opposite ends or same end depending on space"
		],
		howToPlay: [
			"On whistle, runner 1 completes pattern 1, sprints 5 yards, tags next",
			"Next runner does pattern 2, and so on through the card",
			"Missed pattern = re-do that ladder before tag",
			"First team finished with clean patterns wins"
		],
		scoring: ["Team time + 2s per pattern miss", "Optional clean-pattern bonus flag"],
		coachingCues: [
			"Quiet feet, tall chest",
			"Don't look down the whole ladder",
			"Accelerate out of the last square"
		],
		safety: ["No two runners on one ladder", "Pull ladders if turf gets slick"],
		nonContact: true
	},
	{
		id: "hot-potato-handoffs",
		name: "Hot Potato Handoffs",
		kind: "team",
		intensity: "moderate",
		durationMin: 8,
		players: "Circle of 6–10",
		equipment: ["1–2 soft footballs", "Timer"],
		summary: "Fast mesh handoffs in a moving circle — drop = mini-burst, keep the ball alive.",
		objective: "Hand placement, eyes up, and communication under tempo.",
		setup: [
			"Players in a 8–10 yard diameter circle",
			"One ball to start (add second for advanced)",
			"Designate clockwise, then reverse"
		],
		howToPlay: [
			"On go, shuffle/carioca the circle while handing off every exchange",
			"Receiver presents a pocket; giver places the ball — no tosses",
			"Drop = both players sprint 10 yards and rejoin",
			"60s rounds; reverse direction each round"
		],
		scoring: ["Fewest drops wins the period", "Team PR for consecutive clean handoffs"],
		coachingCues: [
			"Call the ball — 'ball, ball'",
			"Soft hands, firm placement",
			"Feet never stop shuffling"
		],
		safety: ["No diving for drops", "Soft balls only"],
		nonContact: true
	},
	{
		id: "red-zone-burst",
		name: "Red Zone Burst",
		kind: "skill",
		intensity: "high",
		durationMin: 10,
		players: "Skill + big-skill groups",
		equipment: [
			"Cones for 15-yard box",
			"Football",
			"Whistle"
		],
		summary: "Route stem + break + 5-yard burst race — timed pairs, no DB contact.",
		objective: "Compete on release, break sharpness, and finish speed.",
		setup: [
			"15-yard box with break cones at 8 and 12",
			"Pairs race the same route card (slant, dig, out, post stem)",
			"Coach calls the break on the stem"
		],
		howToPlay: [
			"Both players release on whistle with the same stem",
			"On call, break to the prescribed route and finish through a catch cone",
			"Ball optional on alternate reps",
			"Best of 4 route cards"
		],
		scoring: ["Win the race to the catch cone", "Form flag on rounded breaks (−win)"],
		coachingCues: [
			"Sell the stem",
			"Plant outside foot on the break",
			"Accelerate after the cut — don't float"
		],
		safety: ["Stagger pairs if lanes share space", "No hand-fighting"],
		nonContact: true
	},
	{
		id: "shark-tank-shuffles",
		name: "Shark Tank Shuffles",
		kind: "reaction",
		intensity: "high",
		durationMin: 8,
		players: "1 'shark' + 4–6 'fish'",
		equipment: ["20×10 yard box", "Pinnies"],
		summary: "Shark tries to tag a cone the fish just left — lateral chase with no body contact.",
		objective: "Reactive shuffles, spacing, and baiting without tackling.",
		setup: [
			"Rectangle with 6–8 cone 'islands'",
			"Fish start on cones; shark starts center",
			"No running — shuffle / carioca only"
		],
		howToPlay: [
			"Fish must change islands every whistle (or every 3 seconds)",
			"Shark scores by touching an empty island a fish just left within 2 seconds",
			"Fish score by surviving 45s without giving the shark a point",
			"Rotate shark each bout"
		],
		scoring: ["Shark points vs fish survival time", "Rotate so everyone sharks once"],
		coachingCues: [
			"Fish: don't all pile on one cone",
			"Shark: cut off the escape lane",
			"Stay low — no upright jogging"
		],
		safety: ["Tag cones only — never players", "Call freeze if two fish collide on a cone"],
		nonContact: true
	},
	{
		id: "red-light-green-light",
		name: "Red Light / Green Light COD",
		kind: "reaction",
		intensity: "moderate",
		durationMin: 8,
		players: "Whole team",
		equipment: ["Cones at start + 20-yard finish", "Whistle or verbal calls"],
		summary: "Classic freeze game with football footwork — green = accelerate, red = stick the plant.",
		objective: "First-step burst + emergency stop under competitive peer pressure.",
		setup: [
			"Start line and finish line 20 yards apart",
			"Players shoulder-width across the start",
			"Coach faces the field or turns back for drama"
		],
		howToPlay: [
			"Green light / short whistle = sprint or shuffle toward finish",
			"Red light / long whistle = freeze instantly in athletic base",
			"Anyone moving on red jogs back 5 yards (or to start)",
			"First to the finish wins the heat; run 4–6 heats with movement variations"
		],
		scoring: ["Heat winners get 1 point", "Clean freezes (no wobbles) earn style flags for ties"],
		coachingCues: [
			"Plant through the whole foot — don't lean",
			"Eyes stay level on the freeze",
			"Green light is first three steps, not a full gasser"
		],
		safety: ["Space lanes", "No diving at the finish line"],
		playableId: "red-light",
		nonContact: true
	},
	{
		id: "steal-the-bacon",
		name: "Steal the Bacon",
		kind: "race",
		intensity: "high",
		durationMin: 10,
		players: "2 teams of 4–8",
		equipment: [
			"1 towel or soft football midfield",
			"Cones for lanes",
			"Number cards"
		],
		summary: "Numbered race to the midfield 'bacon' — grab and score without contact.",
		objective: "Reaction, acceleration, and decision speed in a pure race format.",
		setup: [
			"Two teams on opposite sidelines, numbers 1–N matched",
			"Bacon (towel/ball) on a cone at midfield",
			"Score zones 5 yards behind each team's line"
		],
		howToPlay: [
			"Coach calls a number; both matching players race to the bacon",
			"First to grab races home to their score zone",
			"Other player can cut off the path to their own zone only — no grabs on the carrier",
			"If paths collide, dead ball and re-call"
		],
		scoring: ["1 point per successful return", "Play to 7 or 8 minutes"],
		coachingCues: [
			"Explode on the number — don't wait to process",
			"Pick the bacon clean, then protect space",
			"Loser of the grab becomes an angle pursuer, not a tackler"
		],
		safety: ["No two-hand wraps, shoulder checks, or dives", "Wide score zones to reduce pile-ups"],
		playableId: "steal-bacon",
		nonContact: true
	},
	{
		id: "ultimate-air-ball",
		name: "Ultimate Air Ball",
		kind: "team",
		intensity: "moderate",
		durationMin: 12,
		players: "6–14 (two teams)",
		equipment: [
			"Soft football or disc",
			"End-zone cones",
			"Pinnies"
		],
		summary: "Ultimate-style possession: complete passes into the end zone — stall count, no contact.",
		objective: "Spacing, catch concentration, and team communication under tempo.",
		setup: [
			"40×20 yard field with 5-yard end zones",
			"7-on-7 or 5-on-5 depending on numbers",
			"Stall count of 5 (coach or defender counts)"
		],
		howToPlay: [
			"Complete passes only — no running with the ball (1 pivot step OK)",
			"Defense mirrors and contests without hand-fighting",
			"Incomplete / drop / stall = turnover at that spot",
			"Score by completing a catch in the end zone"
		],
		scoring: ["1 point per end-zone catch", "Play to 5 or timed 10 minutes"],
		coachingCues: [
			"Cut to space, not to the ball every time",
			"Call the ball early",
			"Defense: force sideline, don't lunge"
		],
		safety: ["No layout dives required", "Soft ball only"],
		nonContact: true
	},
	{
		id: "around-the-world-relay",
		name: "Around the World Relay",
		kind: "relay",
		intensity: "high",
		durationMin: 12,
		players: "3–4 teams of 4",
		equipment: [
			"4 station cones (N/E/S/W)",
			"Whistle",
			"Station cards"
		],
		summary: "Team relay around four stations — each station is a different movement tax.",
		objective: "Mixed-modal conditioning with shared team accountability.",
		setup: [
			"Large square, stations at midpoints of each side",
			"Station cards: 1) 5-yard shuffles ×4, 2) 3 burpees, 3) carioca 10 yards, 4) 10-yard sprint",
			"Teams start at different corners to avoid traffic"
		],
		howToPlay: [
			"Runner completes station, sprints to next, tags teammate only after full lap",
			"Every player completes one full world",
			"Missed station work = return and finish before continuing",
			"First team seated wins"
		],
		scoring: ["Finish place + optional form flags (−rank)"],
		coachingCues: [
			"Quality reps beat sloppy speed",
			"Communicate who's next before the tag",
			"Stay outside traffic lanes between stations"
		],
		safety: [
			"Stagger starts",
			"No diving tags",
			"Burpees with soft landings"
		],
		nonContact: true
	},
	{
		id: "partner-towels",
		name: "Partner Towel Chase",
		kind: "race",
		intensity: "high",
		durationMin: 8,
		players: "Pairs",
		equipment: ["1 towel per pair", "10-yard boxes"],
		summary: "Chaser tries to step on a dragged towel — never the partner. Pure COD fun.",
		objective: "Evade and pursue with angles while enforcing a hard no-contact rule.",
		setup: [
			"10×10 boxes",
			"Evader holds a towel trailing low behind",
			"Chaser starts opposite corner"
		],
		howToPlay: [
			"20-second bouts: chaser tries to step on the towel only",
			"Evader cannot leave the box",
			"Swap roles; 3 bouts each",
			"Towel step = point for chaser"
		],
		scoring: ["Chaser points across bouts", "Highest pair total or individual"],
		coachingCues: [
			"Chaser: cut off the towel path, don't reach",
			"Evader: short cuts, protect the trail angle",
			"If bodies touch, dead ball — no point"
		],
		safety: ["Towel only — never trip the partner", "Soft shoes, clear box"],
		nonContact: true
	},
	{
		id: "qb-accuracy-gauntlet",
		name: "QB Accuracy Gauntlet",
		kind: "skill",
		intensity: "moderate",
		durationMin: 10,
		players: "QBs + receivers (or whole skill group)",
		equipment: [
			"3–5 target nets/buckets/cones",
			"Footballs",
			"Timer"
		],
		summary: "Timed accuracy race: hit targets in order under a shot clock — competition without contact.",
		objective: "Footwork, release, and accuracy under mild fatigue.",
		setup: [
			"Targets at 8, 12, 18 yards (left/middle/right mix)",
			"QB starts on a drop cone",
			"Receiver optional for live catch targets"
		],
		howToPlay: [
			"On whistle, hit targets 1→2→3 in order (catch or net)",
			"Miss = re-throw that target before advancing",
			"Best time wins; or most clean rounds in 60s",
			"Rotate QBs; receivers compete on catch %"
		],
		scoring: ["Time for clean 3-target runs", "Or points per hit in a 60s window"],
		coachingCues: [
			"Reset base between throws",
			"Eyes to target early",
			"Don't overthrow the short window"
		],
		safety: ["Balls retrieved outside throwing lanes", "No contested jump balls"],
		nonContact: true
	},
	{
		id: "line-getoff-duels",
		name: "Line Get-Off Duels",
		kind: "race",
		intensity: "high",
		durationMin: 8,
		players: "OL/DL pairs (or any athlete)",
		equipment: [
			"Boards or painted lines",
			"Whistle",
			"Finish cone at 5 yards"
		],
		summary: "Head-to-head first-step races off a silent or cadence snap — no contact finish.",
		objective: "Win the first step and first 5 yards without engaging a body.",
		setup: [
			"Paired on a line, 2 yards apart",
			"Finish cone 5 yards ahead of each",
			"Coach uses silent count, cadence, or ball-move visual"
		],
		howToPlay: [
			"On snap cue, both explode to their finish cone",
			"First hand on cone wins the rep",
			"False start = automatic loss of rep",
			"Best of 5, then rotate partners"
		],
		scoring: ["Rep wins", "Track false starts separately as discipline"],
		coachingCues: [
			"Load the stance — quiet hands",
			"Step with power, not a long lunge",
			"Eyes on the ball/coach, not the rival"
		],
		safety: ["No hand fighting", "Clear lanes to cones"],
		nonContact: true
	}
];
function getGameById(id) {
	return competitiveGames.find((g) => g.id === id);
}
//#endregion
export { competitiveGames as n, getGameById as r, KIND_LABELS as t };
