import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Action, Profile, Set, ButtonMapping, Macro, MacroStep } from '@/types/antimicro';
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
  loadProject: (data: { profile: Profile, actions: Action[] }) => void;
  resetProject: () => void;
  // Set Management
  addSet: (name: string) => void;
  removeSet: (id: string) => void;
  selectSet: (id: string) => void;
  // Selection
  selectButton: (id: string | null) => void;
  // Assignments
  updateAssignment: (setId: string, buttonId: string, slotIndex: number, actionId: string | null) => void;
  assignMacro: (setId: string, buttonId: string, slotIndex: number, macroId: string) => void;
  assignModeShift: (setId: string, buttonId: string, slotIndex: number, targetSetId: string) => void;
  // Macro Management
  addMacro: (name: string, steps: MacroStep[]) => void;
  updateMacro: (id: string, name: string, steps: MacroStep[]) => void;
  deleteMacro: (id: string) => void;
  // Settings
  updateDeadzone: (axis: string, value: number) => void;
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
    macros: [],
    deadzones: {}
  },
  activeSetId: INITIAL_SET_ID,
  selectedButtonId: null,
  isImporterOpen: false,
  setImporterOpen: (isOpen) => set({ isImporterOpen: isOpen }),
  loadActions: (newActions) => set((state) => ({
    actions: [...state.actions, ...newActions]
  })),
  loadProject: (data) => set(() => ({
    profile: data.profile,
    actions: data.actions,
    activeSetId: data.profile.sets[0]?.id || INITIAL_SET_ID,
    selectedButtonId: null
  })),
  resetProject: () => set(() => ({
    profile: {
        sets: [createEmptySet(INITIAL_SET_ID, 'Set 1')],
        macros: [],
        deadzones: {}
    },
    actions: [],
    activeSetId: INITIAL_SET_ID,
    selectedButtonId: null
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
    const newSlots = [...currentMapping.slots];
    // Fill gaps
    while (newSlots.length <= slotIndex) {
      newSlots.push({ type: 'tap' });
    }
    if (actionId === null) {
        // Clear assignment
        newSlots[slotIndex] = { ...newSlots[slotIndex], actionId: undefined, macroId: undefined, modeShiftId: undefined };
    } else {
        // Set Action
        newSlots[slotIndex] = {
            ...newSlots[slotIndex],
            actionId,
            macroId: undefined,
            modeShiftId: undefined
        };
    }
    const newSet = {
      ...currentSet,
      mappings: {
        ...currentSet.mappings,
        [buttonId]: { ...currentMapping, slots: newSlots }
      }
    };
    const newSets = [...state.profile.sets];
    newSets[setIndex] = newSet;
    return { profile: { ...state.profile, sets: newSets } };
  }),
  assignMacro: (setId, buttonId, slotIndex, macroId) => set((state) => {
    const setIndex = state.profile.sets.findIndex(s => s.id === setId);
    if (setIndex === -1) return state;
    const currentSet = state.profile.sets[setIndex];
    const currentMapping = currentSet.mappings[buttonId] || { id: buttonId, slots: [] };
    const newSlots = [...currentMapping.slots];
    while (newSlots.length <= slotIndex) newSlots.push({ type: 'tap' });
    newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        macroId,
        actionId: undefined,
        modeShiftId: undefined
    };
    const newSet = {
      ...currentSet,
      mappings: { ...currentSet.mappings, [buttonId]: { ...currentMapping, slots: newSlots } }
    };
    const newSets = [...state.profile.sets];
    newSets[setIndex] = newSet;
    return { profile: { ...state.profile, sets: newSets } };
  }),
  assignModeShift: (setId, buttonId, slotIndex, targetSetId) => set((state) => {
    const setIndex = state.profile.sets.findIndex(s => s.id === setId);
    if (setIndex === -1) return state;
    const currentSet = state.profile.sets[setIndex];
    const currentMapping = currentSet.mappings[buttonId] || { id: buttonId, slots: [] };
    const newSlots = [...currentMapping.slots];
    while (newSlots.length <= slotIndex) newSlots.push({ type: 'tap' });
    newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        modeShiftId: targetSetId,
        actionId: undefined,
        macroId: undefined
    };
    const newSet = {
      ...currentSet,
      mappings: { ...currentSet.mappings, [buttonId]: { ...currentMapping, slots: newSlots } }
    };
    const newSets = [...state.profile.sets];
    newSets[setIndex] = newSet;
    return { profile: { ...state.profile, sets: newSets } };
  }),
  addMacro: (name, steps) => set((state) => ({
    profile: {
        ...state.profile,
        macros: [...state.profile.macros, { id: uuidv4(), name, steps }]
    }
  })),
  updateMacro: (id, name, steps) => set((state) => ({
    profile: {
        ...state.profile,
        macros: state.profile.macros.map(m => m.id === id ? { ...m, name, steps } : m)
    }
  })),
  deleteMacro: (id) => set((state) => ({
    profile: {
        ...state.profile,
        macros: state.profile.macros.filter(m => m.id !== id)
    }
  })),
  updateDeadzone: (axis, value) => set((state) => ({
    profile: {
      ...state.profile,
      deadzones: {
        ...state.profile.deadzones,
        [axis]: value
      }
    }
  }))
}));