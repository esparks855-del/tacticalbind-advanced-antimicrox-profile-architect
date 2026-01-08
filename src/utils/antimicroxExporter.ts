import { Profile, Slot, Action, Macro } from '@/types/antimicro';
import { getAntiMicroXCode } from '@/utils/keyMap';
// Internal ID to AntiMicroX Element Mapping
interface AntiMicroElement {
  type: 'button' | 'stick' | 'trigger' | 'dpad';
  index: number;
  subIndex?: number; // For stickbutton, triggerbutton, dpadbutton
}
const MAPPING: Record<string, AntiMicroElement> = {
  'A': { type: 'button', index: 1 },
  'B': { type: 'button', index: 2 },
  'X': { type: 'button', index: 3 },
  'Y': { type: 'button', index: 4 },
  'LB': { type: 'button', index: 5 },
  'RB': { type: 'button', index: 6 },
  'Back': { type: 'button', index: 7 },
  'Start': { type: 'button', index: 8 },
  'Guide': { type: 'button', index: 9 },
  'LS': { type: 'button', index: 10 }, // L3
  'RS': { type: 'button', index: 11 }, // R3
  'P1': { type: 'button', index: 12 },
  'P2': { type: 'button', index: 13 },
  'P3': { type: 'button', index: 14 },
  'P4': { type: 'button', index: 15 },
  'DPadUp': { type: 'dpad', index: 1, subIndex: 1 },
  'DPadRight': { type: 'dpad', index: 1, subIndex: 2 },
  'DPadDown': { type: 'dpad', index: 1, subIndex: 4 },
  'DPadLeft': { type: 'dpad', index: 1, subIndex: 8 },
  'LT': { type: 'trigger', index: 5, subIndex: 2 },
  'RT': { type: 'trigger', index: 6, subIndex: 2 },
};
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};
const generateSlotXML = (slot: Slot, profile: Profile, actions: Action[]): string => {
  let xml = '            <slot>\n';
  // Determine Mode
  let mode = 'keyboard';
  if (slot.type === 'hold') mode = 'hold';
  else if (slot.type === 'release') mode = 'release';
  // Handle Set Switch
  if (slot.modeShiftId) {
    const targetSetIndex = profile.sets.findIndex(s => s.id === slot.modeShiftId);
    if (targetSetIndex !== -1) {
      xml += `                <set_switch>${targetSetIndex + 1}</set_switch>\n`;
    }
  }
  // Handle Action / Macro
  if (slot.macroId) {
    const macro = profile.macros.find(m => m.id === slot.macroId);
    if (macro) {
      // For macros, we use <event> tags usually, but strict schema asks for <code> and <mode>
      // However, AntiMicroX supports <event> in slots for macros.
      // We will output <event> tags.
      // Note: If strict schema validation fails on <event>, we might need to rethink, 
      // but standard AntiMicroX macros use <event>.
      macro.steps.forEach(step => {
        if (step.type === 'delay') {
          xml += `                <event type="delay" value="${step.value}"/>\n`;
        } else if (step.type === 'key') {
          const mapping = getAntiMicroXCode(String(step.value));
          xml += `                <event type="key" value="${mapping.code}"/>\n`;
        } else if (step.type === 'mouse') {
           const mapping = getAntiMicroXCode(String(step.value));
           xml += `                <event type="mouse" value="${mapping.code}"/>\n`;
        }
      });
    }
  } else if (slot.actionId) {
    const action = actions.find(a => a.id === slot.actionId);
    if (action) {
      const mapping = getAntiMicroXCode(action.defaultKey);
      // If slot type didn't override mode (e.g. tap), use action mode
      if (slot.type === 'tap' || slot.type === 'double') {
         mode = mapping.mode === 'mouse' ? 'mousebutton' : 'keyboard';
      }
      xml += `                <code>${mapping.code}</code>\n`;
      xml += `                <mode>${mode}</mode>\n`;
    }
  } else if (slot.modeShiftId) {
      // Just a set switch, no code
      // Strict schema requires <code> and <mode>
      xml += `                <code>0</code>\n`;
      xml += `                <mode>${mode}</mode>\n`;
  }
  xml += '            </slot>\n';
  return xml;
};
const generateButtonBlock = (index: number, slotsXML: string): string => {
  return `    <button index="${index}">
        <toggle>0</toggle>
        <turbointerval>0</turbointerval>
        <useturbo>0</useturbo>
        <mousespeedx>0</mousespeedx>
        <mousespeedy>0</mousespeedy>
        <mousemode>none</mousemode>
        <mouseacceleration>0</mouseacceleration>
        <mousesmoothing>0</mousesmoothing>
        <wheelspeedx>0</wheelspeedx>
        <wheelspeedy>0</wheelspeedy>
        <slots>
${slotsXML}        </slots>
    </button>\n`;
};
export const generateAntiMicroXXML = (profile: Profile, actions: Action[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<gamecontroller configversion="19" appversion="2.20.2">\n';
  xml += '<sdlname>TacticalBind Controller</sdlname>\n';
  xml += '<guid>00000000000000000000000000000000</guid>\n';
  xml += '<names/>\n';
  xml += '<sets>\n';
  profile.sets.forEach((set, index) => {
    xml += `<set index="${index + 1}">\n`;
    xml += `    <name>${escapeXml(set.name)}</name>\n`;
    xml += `    <instructions><![CDATA[]]></instructions>\n`;
    // Group mappings by type
    const buttonMappings: Record<number, string> = {}; // index -> xml
    const stickMappings: Record<number, { deadZone: number, maxZone: number, diagonalRange: number, buttons: Record<number, string> }> = {};
    const triggerMappings: Record<number, { deadZone: number, maxZone: number, buttons: Record<number, string> }> = {};
    const dpadMappings: Record<number, { buttons: Record<number, string> }> = {};
    // Initialize Sticks (1 and 2) with config
    [1, 2].forEach(i => {
        const axisX = i === 1 ? 'leftx' : 'rightx';
        // const axisY = i === 1 ? 'lefty' : 'righty'; // Usually share config in simple UI
        const config = profile.axisConfig[axisX] || {};
        stickMappings[i] = {
            deadZone: config.deadZone || 0,
            maxZone: config.maxZone || 0,
            diagonalRange: config.diagonalRange || 0,
            buttons: {}
        };
    });
    // Initialize Triggers (5 and 6) with config
    [5, 6].forEach(i => {
        const axis = i === 5 ? 'lefttrigger' : 'righttrigger';
        const config = profile.axisConfig[axis] || {};
        triggerMappings[i] = {
            deadZone: config.deadZone || 0,
            maxZone: config.maxZone || 0,
            buttons: {}
        };
    });
    // Initialize Dpad (1)
    dpadMappings[1] = { buttons: {} };
    // Process Mappings
    Object.values(set.mappings).forEach(mapping => {
        const target = MAPPING[mapping.id];
        if (!target) return;
        // Generate Slots XML
        let slotsXML = '';
        mapping.slots.forEach(slot => {
            if (slot && (slot.actionId || slot.macroId || slot.modeShiftId)) {
                slotsXML += generateSlotXML(slot, profile, actions);
            }
        });
        if (!slotsXML) return; // Skip empty mappings
        if (target.type === 'button') {
            buttonMappings[target.index] = generateButtonBlock(target.index, slotsXML);
        } else if (target.type === 'stick') {
            if (target.subIndex) stickMappings[target.index].buttons[target.subIndex] = slotsXML;
        } else if (target.type === 'trigger') {
            if (target.subIndex) triggerMappings[target.index].buttons[target.subIndex] = slotsXML;
        } else if (target.type === 'dpad') {
            if (target.subIndex) dpadMappings[target.index].buttons[target.subIndex] = slotsXML;
        }
    });
    // Output Buttons
    Object.values(buttonMappings).forEach(b => xml += b);
    // Output Sticks
    Object.entries(stickMappings).forEach(([index, data]) => {
        // Only output if modified (deadzone > 0 or buttons mapped)
        // Actually, strict schema might prefer listing them if they exist on controller?
        // But usually we only list what's configured.
        // However, deadzones are important.
        const hasButtons = Object.keys(data.buttons).length > 0;
        if (data.deadZone > 0 || data.maxZone > 0 || hasButtons) {
            xml += `    <stick index="${index}">\n`;
            if (data.deadZone > 0) xml += `        <deadZone>${data.deadZone}</deadZone>\n`;
            if (data.maxZone > 0) xml += `        <maxZone>${data.maxZone}</maxZone>\n`;
            if (data.diagonalRange > 0) xml += `        <diagonalRange>${data.diagonalRange}</diagonalRange>\n`;
            Object.entries(data.buttons).forEach(([subIndex, slots]) => {
                xml += `        <stickbutton index="${subIndex}">\n`;
                xml += `            <slots>\n${slots}            </slots>\n`;
                xml += `        </stickbutton>\n`;
            });
            xml += `    </stick>\n`;
        }
    });
    // Output Triggers
    Object.entries(triggerMappings).forEach(([index, data]) => {
        const hasButtons = Object.keys(data.buttons).length > 0;
        if (data.deadZone > 0 || data.maxZone > 0 || hasButtons) {
            xml += `    <trigger index="${index}">\n`;
            if (data.deadZone > 0) xml += `        <deadZone>${data.deadZone}</deadZone>\n`;
            if (data.maxZone > 0) xml += `        <maxZone>${data.maxZone}</maxZone>\n`;
            Object.entries(data.buttons).forEach(([subIndex, slots]) => {
                xml += `        <triggerbutton index="${subIndex}">\n`;
                xml += `            <slots>\n${slots}            </slots>\n`;
                xml += `        </triggerbutton>\n`;
            });
            xml += `    </trigger>\n`;
        }
    });
    // Output DPads
    Object.entries(dpadMappings).forEach(([index, data]) => {
        if (Object.keys(data.buttons).length > 0) {
            xml += `    <dpad index="${index}">\n`;
            Object.entries(data.buttons).forEach(([subIndex, slots]) => {
                xml += `        <dpadbutton index="${subIndex}">\n`;
                xml += `            <slots>\n${slots}            </slots>\n`;
                xml += `        </dpadbutton>\n`;
            });
            xml += `    </dpad>\n`;
        }
    });
    xml += `</set>\n`;
  });
  xml += '</sets>\n';
  xml += '</gamecontroller>';
  return xml;
};