import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgeBand, ContactLevel } from "@/data/levels";
import type { ProgramTrackId } from "@/data/programs";

interface ProgressState {
  completedPlans: string[];
  completedDrills: string[];
  favorites: string[];
  activeDay: number;
  /** Athlete / team level for filtering content */
  ageBand: AgeBand;
  /** Max contact the user wants to see scheduled */
  contactCap: ContactLevel;
  selectedTrackId: ProgramTrackId;
  completePlan: (planId: string) => void;
  completeDrill: (drillId: string) => void;
  toggleFavorite: (drillId: string) => void;
  setActiveDay: (day: number) => void;
  setAgeBand: (age: AgeBand) => void;
  setContactCap: (cap: ContactLevel) => void;
  setSelectedTrackId: (id: ProgramTrackId) => void;
  resetProgress: () => void;
}

const defaultTrack: ProgramTrackId = "hs-preseason-camp";

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
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
        set({
          favorites: favorites.includes(drillId)
            ? favorites.filter((id) => id !== drillId)
            : [...favorites, drillId],
        });
      },
      setActiveDay: (day) => set({ activeDay: day }),
      setAgeBand: (ageBand) => set({ ageBand }),
      setContactCap: (contactCap) => set({ contactCap }),
      setSelectedTrackId: (selectedTrackId) =>
        set({ selectedTrackId, activeDay: 1 }),
      resetProgress: () =>
        set({
          completedPlans: [],
          completedDrills: [],
          favorites: [],
          activeDay: 1,
        }),
    }),
    { name: "gridiron-ready-progress" },
  ),
);
