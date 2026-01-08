import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Action, Profile, Set, ButtonMapping } from '@/types/antimicro';
import { CONTROLLER_BUTTONS } from '@/lib/constants';
interface ProfileState {
  // Data
  actions: Action[];
  profile: Profile;
  // UI State
  activeSetId: string;
  selectedButtonId: string | null;
  isImporterOpen: boolean;
  // Actions
  setImporterOpen: (isOpen: boolean) => void;
  loadActions: (actions: Action[]) => void;
  addSet: (name: string) => void;
  removeSet: (id: string) => void;
  selectSet: (id: string) => void;
  selectButton: (id: string | null) => void;
  updateAssignment: (setId: string, buttonId: string, slotIndex: number, actionId: string) => void;
}
const INITIAL_SET_ID = 'set-1';
const createEmptySet = (id: string, name: string): Set => {
  const mappings: Record<string, ButtonMapping> = {};
  CONTROLLER_BUTTONS.forEach(btn => {
    mappings[btn.id] = {
      id: btn.id,
      slots: [] // Empty slots initially
    };
  });
  return { id, name, mappings };
};
export const useProfileStore = create<ProfileState>((set) => ({
  actions: [],
  profile: {
    sets: [createEmptySet(INITIAL_SET_ID, 'Set 1')],
    macros: []
  },
  activeSetId: INITIAL_SET_ID,
  selectedButtonId: null,
  isImporterOpen: false,
  setImporterOpen: (isOpen) => set({ isImporterOpen: isOpen }),
  loadActions: (newActions) => set((state) => ({
    actions: [...state.actions, ...newActions]
  })),
  addSet: (name) => set((state) => {
    const newId = `set-${uuidv4()}`;
    return {
      profile: {
        ...state.profile,
        sets: [...state.profile.sets, createEmptySet(newId, name)]
      },
      activeSetId: newId // Auto-switch to new set
    };
  }),
  removeSet: (id) => set((state) => {
    if (state.profile.sets.length <= 1) return state; // Prevent deleting last set
    const newSets = state.profile.sets.filter(s => s.id !== id);
    return {
      profile: {
        ...state.profile,
        sets: newSets
      },
      activeSetId: state.activeSetId === id ? newSets[0].id : state.activeSetId
    };
  }),
  selectSet: (id) => set({ activeSetId: id }),
  selectButton: (id) => set({ selectedButtonId: id }),
  updateAssignment: (setId, buttonId, slotIndex, actionId) => set((state) => {
    const setIndex = state.profile.sets.findIndex(s => s.id === setId);
    if (setIndex === -1) return state;
    const currentSet = state.profile.sets[setIndex];
    const currentMapping = currentSet.mappings[buttonId] || { id: buttonId, slots: [] };
    // Ensure slots array is large enough
    const newSlots = [...currentMapping.slots];
    // Fill gaps if necessary (though usually we append)
    while (newSlots.length <= slotIndex) {
      newSlots.push({ type: 'tap' }); // Default type
    }
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      actionId
    };
    const newSet = {
      ...currentSet,
      mappings: {
        ...currentSet.mappings,
        [buttonId]: {
          ...currentMapping,
          slots: newSlots
        }
      }
    };
    const newSets = [...state.profile.sets];
    newSets[setIndex] = newSet;
    return {
      profile: {
        ...state.profile,
        sets: newSets
      }
    };
  })
}));