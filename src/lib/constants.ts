export const CONTROLLER_BUTTONS = [
  { id: 'A', label: 'A', type: 'face' },
  { id: 'B', label: 'B', type: 'face' },
  { id: 'X', label: 'X', type: 'face' },
  { id: 'Y', label: 'Y', type: 'face' },
  { id: 'LB', label: 'LB', type: 'shoulder' },
  { id: 'RB', label: 'RB', type: 'shoulder' },
  { id: 'LT', label: 'LT', type: 'trigger' },
  { id: 'RT', label: 'RT', type: 'trigger' },
  { id: 'Back', label: 'View', type: 'center' },
  { id: 'Start', label: 'Menu', type: 'center' },
  { id: 'Guide', label: 'Guide', type: 'center' },
  { id: 'LS', label: 'L Stick', type: 'stick' },
  { id: 'RS', label: 'R Stick', type: 'stick' },
  { id: 'DPadUp', label: 'D-Up', type: 'dpad' },
  { id: 'DPadDown', label: 'D-Down', type: 'dpad' },
  { id: 'DPadLeft', label: 'D-Left', type: 'dpad' },
  { id: 'DPadRight', label: 'D-Right', type: 'dpad' },
  // Elite Paddles
  { id: 'P1', label: 'P1', type: 'paddle' },
  { id: 'P2', label: 'P2', type: 'paddle' },
  { id: 'P3', label: 'P3', type: 'paddle' },
  { id: 'P4', label: 'P4', type: 'paddle' },
] as const;
export type ControllerButtonId = typeof CONTROLLER_BUTTONS[number]['id'];
export const SLOT_TYPES = [
  { id: 'tap', label: 'Short Tap' },
  { id: 'hold', label: 'Long Press' },
  { id: 'double', label: 'Double Tap' },
  { id: 'release', label: 'Release' },
] as const;