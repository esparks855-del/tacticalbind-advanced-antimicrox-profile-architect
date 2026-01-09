import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  // Persistence State
  lastModified: number;
  isDirty: boolean;
  backupHandle: FileSystemFileHandle | null; // Runtime only, not persisted
  // Actions
  setImporterOpen: (isOpen: boolean) => void;
  loadActions: (actions: Action[]) => void;
  loadProject: (data: { profile: any, actions: Action[] }) => void;
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
  clearButtonMapping: (setId: string, buttonId: string) => void;
  // Macro Management
  addMacro: (name: string, steps: MacroStep[]) => void;
  updateMacro: (id: string, name: string, steps: MacroStep[]) => void;
  deleteMacro: (id: string) => void;
  // Settings
  updateDeadzone: (axis: string, value: number) => void;
  // Persistence Actions
  markSaved: () => void;
  setBackupHandle: (handle: FileSystemFileHandle | null) => void;
  // Snapshot for Export
  getSnapshot: () => { profile: Profile, actions: Action[] };
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
// Helper to update modification timestamp
const touch = (state: any) => ({
    lastModified: Date.now(),
    isDirty: true
});
export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      actions: [],
      profile: {
        sets: [createEmptySet(INITIAL_SET_ID, 'Set 1')],
        macros: [],
        axisConfig: {}
      },
      activeSetId: INITIAL_SET_ID,
      selectedButtonId: null,
      isImporterOpen: false,
      lastModified: Date.now(),
      isDirty: false,
      backupHandle: null,
      getSnapshot: () => {
        const state = get();
        return { profile: state.profile, actions: state.actions };
      },
      setImporterOpen: (isOpen) => set({ isImporterOpen: isOpen }),
      loadActions: (newActions) => set((state) => ({
        actions: [...state.actions, ...newActions],
        ...touch(state)
      })),
      loadProject: (data) => set(() => {
        let profile = data.profile;
        // Legacy support for old deadzones format
        if (data.profile.deadzones && !data.profile.axisConfig) {
            const axisConfig: Record<string, any> = {};
            Object.entries(data.profile.deadzones).forEach(([k, v]) => {
                axisConfig[k] = { deadZone: v };
            });
            profile = { ...data.profile, axisConfig };
            delete profile.deadzones;
        }
        return {
            profile,
            actions: data.actions,
            activeSetId: profile.sets[0]?.id || INITIAL_SET_ID,
            selectedButtonId: null,
            isDirty: false, // Reset dirty state on load
            lastModified: Date.now()
        };
      }),
      resetProject: () => set(() => ({
        profile: {
            sets: [createEmptySet(INITIAL_SET_ID, 'Set 1')],
            macros: [],
            axisConfig: {}
        },
        actions: [],
        activeSetId: INITIAL_SET_ID,
        selectedButtonId: null,
        isDirty: false,
        lastModified: Date.now(),
        backupHandle: null
      })),
      addSet: (name) => set((state) => {
        const newId = `set-${uuidv4()}`;
        return {
          profile: {
            ...state.profile,
            sets: [...state.profile.sets, createEmptySet(newId, name)]
          },
          activeSetId: newId,
          ...touch(state)
        };
      }),
      removeSet: (id) => set((state) => {
        if (state.profile.sets.length <= 1) return state;
        const newSets = state.profile.sets.filter(s => s.id !== id);
        return {
          profile: {
            ...state.profile,
            sets: newSets
          },
          activeSetId: state.activeSetId === id ? newSets[0].id : state.activeSetId,
          ...touch(state)
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
        while (newSlots.length <= slotIndex) {
          newSlots.push({ type: 'tap' });
        }
        if (actionId === null) {
            newSlots[slotIndex] = { ...newSlots[slotIndex], actionId: undefined, macroId: undefined, modeShiftId: undefined };
        } else {
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
        return { 
            profile: { ...state.profile, sets: newSets },
            ...touch(state)
        };
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
        return { 
            profile: { ...state.profile, sets: newSets },
            ...touch(state)
        };
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
        return { 
            profile: { ...state.profile, sets: newSets },
            ...touch(state)
        };
      }),
      clearButtonMapping: (setId, buttonId) => set((state) => {
        const setIndex = state.profile.sets.findIndex(s => s.id === setId);
        if (setIndex === -1) return state;
        const currentSet = state.profile.sets[setIndex];
        const currentMapping = currentSet.mappings[buttonId] || { id: buttonId, slots: [] };
        // Reset slots to empty
        const newSet = {
          ...currentSet,
          mappings: {
            ...currentSet.mappings,
            [buttonId]: { ...currentMapping, slots: [] }
          }
        };
        const newSets = [...state.profile.sets];
        newSets[setIndex] = newSet;
        return { 
            profile: { ...state.profile, sets: newSets },
            ...touch(state)
        };
      }),
      addMacro: (name, steps) => set((state) => ({
        profile: {
            ...state.profile,
            macros: [...state.profile.macros, { id: uuidv4(), name, steps }]
        },
        ...touch(state)
      })),
      updateMacro: (id, name, steps) => set((state) => ({
        profile: {
            ...state.profile,
            macros: state.profile.macros.map(m => m.id === id ? { ...m, name, steps } : m)
        },
        ...touch(state)
      })),
      deleteMacro: (id) => set((state) => ({
        profile: {
            ...state.profile,
            macros: state.profile.macros.filter(m => m.id !== id)
        },
        ...touch(state)
      })),
      updateDeadzone: (axis, value) => set((state) => ({
        profile: {
          ...state.profile,
          axisConfig: {
            ...state.profile.axisConfig,
            [axis]: {
                ...state.profile.axisConfig?.[axis],
                deadZone: value
            }
          }
        },
        ...touch(state)
      })),
      markSaved: () => set({ isDirty: false }),
      setBackupHandle: (handle) => set({ backupHandle: handle })
    }),
    {
      name: 'tactical-bind-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        actions: state.actions,
        profile: state.profile,
        activeSetId: state.activeSetId,
        lastModified: state.lastModified,
        // We do NOT persist backupHandle as it is not serializable
        // We do persist isDirty so user knows they have unsaved changes if they reload
        isDirty: state.isDirty
      }),
    }
  )
);