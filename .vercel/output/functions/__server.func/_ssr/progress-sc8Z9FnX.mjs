import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-sc8Z9FnX.js
var defaultTrack = "hs-preseason-camp";
var useProgressStore = create()(persist((set, get) => ({
	completedPlans: [],
	completedDrills: [],
	favorites: [],
	activeDay: 1,
	ageBand: "high-school",
	contactCap: "thud",
	selectedTrackId: defaultTrack,
	completePlan: (planId) => {
		const { completedPlans } = get();
		if (completedPlans.includes(planId)) return;
		set({ completedPlans: [...completedPlans, planId] });
	},
	completeDrill: (drillId) => {
		const { completedDrills } = get();
		if (completedDrills.includes(drillId)) return;
		set({ completedDrills: [...completedDrills, drillId] });
	},
	toggleFavorite: (drillId) => {
		const { favorites } = get();
		set({ favorites: favorites.includes(drillId) ? favorites.filter((id) => id !== drillId) : [...favorites, drillId] });
	},
	setActiveDay: (day) => set({ activeDay: day }),
	setAgeBand: (ageBand) => set({ ageBand }),
	setContactCap: (contactCap) => set({ contactCap }),
	setSelectedTrackId: (selectedTrackId) => set({
		selectedTrackId,
		activeDay: 1
	}),
	resetProgress: () => set({
		completedPlans: [],
		completedDrills: [],
		favorites: [],
		activeDay: 1
	})
}), { name: "gridiron-ready-progress" }));
//#endregion
export { useProgressStore as t };
