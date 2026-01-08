import { Profile, Set, ButtonMapping, Slot, Macro } from '@/types/antimicro';
import { js2xml } from 'xml-js';
// Mapping from internal ControllerButtonId to AntiMicroX button IDs
const BUTTON_ID_MAP: Record<string, string> = {
  'A': 'a',
  'B': 'b',
  'X': 'x',
  'Y': 'y',
  'LB': 'leftshoulder',
  'RB': 'rightshoulder',
  'LT': 'lefttrigger',
  'RT': 'righttrigger',
  'Back': 'back',
  'Start': 'start',
  'Guide': 'guide',
  'LS': 'leftstick',
  'RS': 'rightstick',
  'DPadUp': 'dpup',
  'DPadDown': 'dpdown',
  'DPadLeft': 'dpleft',
  'DPadRight': 'dpright',
  'P1': 'paddle1',
  'P2': 'paddle2',
  'P3': 'paddle3',
  'P4': 'paddle4',
};
// Basic mapping for common keys to hex codes (simplified)
// In a real app, this would be a comprehensive database
const KEY_CODE_MAP: Record<string, string> = {
  'Space': '0x20',
  'Enter': '0x1000004',
  'Esc': '0x1000000',
  'Tab': '0x1000001',
  'Backspace': '0x1000003',
  'Shift': '0x1000020',
  'Ctrl': '0x1000021',
  'Alt': '0x1000023',
  'Up': '0x1000013',
  'Down': '0x1000015',
  'Left': '0x1000012',
  'Right': '0x1000014',
};
const getKeyCode = (keyName: string): string => {
  if (!keyName) return '0x0';
  // Check explicit map
  if (KEY_CODE_MAP[keyName]) return KEY_CODE_MAP[keyName];
  // Single characters
  if (keyName.length === 1) {
    const code = keyName.toUpperCase().charCodeAt(0);
    return '0x' + code.toString(16);
  }
  // F-keys
  if (keyName.match(/^F\d+$/)) {
    const num = parseInt(keyName.substring(1));
    // F1 is 0x1000030
    return '0x' + (0x1000030 + num - 1).toString(16);
  }
  // Fallback: try to interpret as hex if it looks like it
  if (keyName.startsWith('0x')) return keyName;
  return '0x0'; // Unknown
};
export const generateAntiMicroXXML = (profile: Profile, actions: {id: string, defaultKey: string}[]): string => {
  const options = { compact: false, ignoreComment: true, spaces: 4 };
  const sets = profile.sets.map((set, index) => {
    const buttons = Object.values(set.mappings)
      .filter(mapping => mapping.slots.length > 0) // Only include buttons with assignments
      .map(mapping => {
        const antiMicroId = BUTTON_ID_MAP[mapping.id];
        if (!antiMicroId) return null;
        // AntiMicroX structure for a button
        const slotsElement: any = {
          slot: []
        };
        // Process slots (Tap, Hold, etc.)
        // Note: AntiMicroX logic for "Hold" vs "Tap" is complex (using sets or advanced assignments).
        // For this exporter, we will map:
        // Slot 0 (Tap) -> Standard slot
        // Slot 1 (Hold) -> Not directly supported in basic XML without 'mode shift' or 'distance', 
        // but we'll map it as a secondary slot if possible or just stick to basic mapping for Phase 1/2.
        // To keep it valid, we'll primarily export the TAP action (index 0).
        // If there's a macro, we export macro events.
        // We will iterate through slots. 
        // If it's a mode shift, we use <setselect>
        mapping.slots.forEach((slot) => {
          if (!slot) return;
          const slotObj: any = {};
          if (slot.modeShiftId) {
             // Find index of the set
             const targetSetIndex = profile.sets.findIndex(s => s.id === slot.modeShiftId);
             if (targetSetIndex !== -1) {
                 slotObj.setselect = { _text: (targetSetIndex + 1).toString() };
             }
          } else if (slot.macroId) {
            const macro = profile.macros.find(m => m.id === slot.macroId);
            if (macro) {
                // Expand macro steps
                // <event type="key" value="0x..."/>
                // <event type="delay" value="100"/>
                const events = macro.steps.map(step => {
                    if (step.type === 'delay') {
                        return { _attributes: { type: 'delay', value: step.value } };
                    } else if (step.type === 'key') {
                        return { _attributes: { type: 'key', value: getKeyCode(String(step.value)) } };
                    }
                    return null;
                }).filter(Boolean);
                // If macro has events, add them. 
                // Note: AntiMicroX puts events directly in <slot> for macros usually, 
                // or uses <action> tag. We'll put events in slot.
                if (events.length > 0) {
                    // If we have multiple events, we can't just push to slotObj directly if we want a list of events
                    // We need to restructure slotObj to contain the events
                    // But xml-js expects arrays for multiple children of same name
                    // Actually, <slot> contains sequence of <event> tags
                    slotObj.event = events;
                }
            }
          } else if (slot.actionId) {
            const action = actions.find(a => a.id === slot.actionId);
            if (action) {
                slotObj.code = { _text: getKeyCode(action.defaultKey) };
                slotObj.mode = { _text: 'keyboard' };
            }
          }
          // Only add if not empty
          if (Object.keys(slotObj).length > 0) {
              slotsElement.slot.push(slotObj);
          }
        });
        if (slotsElement.slot.length === 0) return null;
        return {
          _attributes: { id: antiMicroId },
          slots: slotsElement
        };
      })
      .filter(Boolean);
    return {
      _attributes: { index: (index + 1).toString() },
      name: { _text: set.name },
      button: buttons
    };
  });
  const xmlObj = {
    _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
    gamecontroller: {
      _attributes: { configversion: '19', appversion: '3.3.3' },
      sdl2gamecontroller: {
        set: sets
      }
    }
  };
  return js2xml(xmlObj, options);
};