//#region node_modules/.nitro/vite/services/ssr/assets/cone-diagrams-BbRnI_Va.js
/** Shared square geometry (inside path sits on these corners) */
var TL = [24, 22];
var TR = [76, 22];
var BR = [76, 72];
var BL = [24, 72];
var C = [50, 47];
var START = [24, 84];
var FINISH = [10, 72];
var BOX = {
	x: 24,
	y: 22,
	w: 52,
	h: 50
};
function squareCones(startAt = "bl") {
	return [
		{
			x: TL[0],
			y: TL[1]
		},
		{
			x: TR[0],
			y: TR[1]
		},
		{
			x: BR[0],
			y: BR[1]
		},
		{
			x: BL[0],
			y: BL[1],
			start: startAt === "bl"
		},
		{
			x: C[0],
			y: C[1]
		},
		...startAt === "out" ? [{
			x: START[0] - 6,
			y: START[1],
			start: true
		}] : [{
			x: START[0],
			y: START[1],
			start: true
		}]
	];
}
/**
* Each diagram's paths are ordered start → finish in the order the athlete runs.
* Multiple path entries = style changes mid-route (advanced patterns).
*/
var coneDiagrams = {
	"base-inside-box": {
		id: "base-inside-box",
		box: BOX,
		cones: squareCones("bl"),
		paths: [{
			style: "sprint",
			points: [
				START,
				BL,
				TL,
				TR,
				BR,
				BL,
				FINISH
			]
		}]
	},
	"base-outside-box": {
		id: "base-outside-box",
		box: BOX,
		cones: [
			{
				x: 30,
				y: 28
			},
			{
				x: 70,
				y: 28
			},
			{
				x: 70,
				y: 66
			},
			{
				x: 30,
				y: 66
			},
			{
				x: C[0],
				y: C[1]
			},
			{
				x: 16,
				y: 84,
				start: true
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[16, 84],
				[18, 72],
				[18, 18],
				[82, 18],
				[82, 76],
				[18, 76],
				[8, 76]
			]
		}]
	},
	"advanced-inside-box": {
		id: "advanced-inside-box",
		box: BOX,
		cones: squareCones("bl"),
		paths: [
			{
				style: "sprint",
				points: [
					START,
					BL,
					TL
				]
			},
			{
				style: "carioca",
				points: [TL, TR]
			},
			{
				style: "sprint",
				points: [TR, BR]
			},
			{
				style: "shuffle",
				points: [BR, BL]
			},
			{
				style: "sprint",
				points: [BL, FINISH]
			}
		]
	},
	"advanced-outside-box": {
		id: "advanced-outside-box",
		box: BOX,
		cones: [
			{
				x: 30,
				y: 28
			},
			{
				x: 70,
				y: 28
			},
			{
				x: 70,
				y: 66
			},
			{
				x: 30,
				y: 66
			},
			{
				x: C[0],
				y: C[1]
			},
			{
				x: 16,
				y: 84,
				start: true
			}
		],
		paths: [
			{
				style: "sprint",
				points: [
					[16, 84],
					[18, 72],
					[18, 18]
				]
			},
			{
				style: "carioca",
				points: [[18, 18], [82, 18]]
			},
			{
				style: "sprint",
				points: [[82, 18], [82, 76]]
			},
			{
				style: "shuffle",
				points: [[82, 76], [18, 76]]
			},
			{
				style: "backwards",
				points: [[18, 76], [18, 18]]
			},
			{
				style: "sprint",
				points: [[18, 18], [8, 18]]
			}
		]
	},
	"base-inside-m": {
		id: "base-inside-m",
		cones: [
			{
				x: 24,
				y: 20
			},
			{
				x: 76,
				y: 20
			},
			{
				x: 50,
				y: 52
			},
			{
				x: 24,
				y: 80,
				start: true
			},
			{
				x: 76,
				y: 80
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[24, 88],
				[24, 80],
				[24, 20],
				[50, 52],
				[76, 20],
				[76, 88]
			]
		}]
	},
	"base-outside-m": {
		id: "base-outside-m",
		cones: [
			{
				x: 28,
				y: 26
			},
			{
				x: 72,
				y: 26
			},
			{
				x: 50,
				y: 52
			},
			{
				x: 28,
				y: 74
			},
			{
				x: 72,
				y: 74
			},
			{
				x: 16,
				y: 88,
				start: true
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[16, 88],
				[20, 18],
				[50, 52],
				[80, 18],
				[80, 88]
			]
		}]
	},
	"advanced-inside-m": {
		id: "advanced-inside-m",
		cones: [
			{
				x: 24,
				y: 20
			},
			{
				x: 76,
				y: 20
			},
			{
				x: 50,
				y: 52
			},
			{
				x: 24,
				y: 80,
				start: true
			},
			{
				x: 76,
				y: 80
			}
		],
		paths: [
			{
				style: "sprint",
				points: [
					[24, 88],
					[24, 80],
					[24, 20]
				]
			},
			{
				style: "shuffle",
				points: [
					[24, 20],
					[50, 52],
					[76, 20]
				]
			},
			{
				style: "sprint",
				points: [[76, 20], [76, 88]]
			}
		]
	},
	"advanced-outside-m": {
		id: "advanced-outside-m",
		cones: [
			{
				x: 28,
				y: 26
			},
			{
				x: 72,
				y: 26
			},
			{
				x: 50,
				y: 52
			},
			{
				x: 28,
				y: 74
			},
			{
				x: 72,
				y: 74
			},
			{
				x: 16,
				y: 88,
				start: true
			}
		],
		paths: [
			{
				style: "sprint",
				points: [[16, 88], [20, 18]]
			},
			{
				style: "carioca",
				points: [
					[20, 18],
					[50, 52],
					[80, 18]
				]
			},
			{
				style: "sprint",
				points: [[80, 18], [80, 88]]
			}
		]
	},
	"cone-360s": {
		id: "cone-360s",
		box: BOX,
		cones: squareCones("bl"),
		paths: [{
			style: "sprint",
			points: [
				START,
				BL,
				TL,
				TR,
				BR,
				BL,
				FINISH
			]
		}]
	},
	"figure-8s": {
		id: "figure-8s",
		cones: [
			{
				x: 28,
				y: 22
			},
			{
				x: 72,
				y: 22
			},
			{
				x: 50,
				y: 50
			},
			{
				x: 28,
				y: 78
			},
			{
				x: 72,
				y: 78
			},
			{
				x: 22,
				y: 88,
				start: true
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[22, 88],
				[50, 50],
				[72, 22],
				[78, 36],
				[50, 50],
				[28, 78],
				[22, 64],
				[50, 50],
				[12, 50]
			]
		}]
	},
	"outside-x": {
		id: "outside-x",
		cones: [
			{
				x: 24,
				y: 22
			},
			{
				x: 76,
				y: 22
			},
			{
				x: 50,
				y: 50
			},
			{
				x: 24,
				y: 78,
				start: true
			},
			{
				x: 76,
				y: 78
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[20, 86],
				[24, 78],
				[76, 22],
				[80, 14]
			]
		}, {
			style: "sprint",
			points: [
				[80, 86],
				[76, 78],
				[24, 22],
				[20, 14]
			]
		}]
	},
	"inside-x": {
		id: "inside-x",
		cones: [
			{
				x: 24,
				y: 22
			},
			{
				x: 76,
				y: 22
			},
			{
				x: 50,
				y: 50
			},
			{
				x: 24,
				y: 78,
				start: true
			},
			{
				x: 76,
				y: 78
			}
		],
		paths: [{
			style: "sprint",
			points: [
				[20, 86],
				[50, 50],
				[80, 14]
			]
		}, {
			style: "sprint",
			points: [
				[80, 86],
				[50, 50],
				[20, 14]
			]
		}]
	}
};
var PATH_STYLE_LABELS = {
	sprint: "Sprint",
	carioca: "Carioca",
	backwards: "Sprint backwards",
	shuffle: "Shuffle"
};
//#endregion
export { coneDiagrams as n, PATH_STYLE_LABELS as t };
