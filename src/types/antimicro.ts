export interface Action {
  id: string;
  name: string;
  defaultKey: string;
}
export type SlotType = 'tap' | 'hold' | 'double' | 'release';
export interface Slot {
  type: SlotType;
  actionId?: string; // Reference to an Action
  macroId?: string;  // Reference to a Macro
  modeShiftId?: string; // Reference to another Set ID
}
export interface ButtonMapping {
  id: string; // Matches ControllerButtonId
  slots: Slot[];
}
export interface Set {
  id: string;
  name: string;
  mappings: Record<string, ButtonMapping>; // Keyed by button ID
}
export interface MacroStep {
  type: 'key' | 'delay' | 'mouse';
  value: string | number;
  duration?: number;
}
export interface Macro {
  id: string;
  name: string;
  steps: MacroStep[];
}
export type ControllerAxis = 'leftx' | 'lefty' | 'rightx' | 'righty' | 'lefttrigger' | 'righttrigger';
export interface AxisConfig {
  deadZone?: number;
  maxZone?: number;
  diagonalRange?: number;
}
export interface GeneralConfig {
  turboInterval?: number;
}
export interface Profile {
  sets: Set[];
  macros: Macro[];
  axisConfig: Record<string, AxisConfig>;
  generalConfig?: GeneralConfig;
}