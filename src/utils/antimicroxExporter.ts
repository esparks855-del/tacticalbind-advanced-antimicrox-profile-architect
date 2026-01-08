import { Profile } from '@/types/antimicro';
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
// Basic mapping for common keys to hex codes
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
  'Mouse1': '0x1', // Mouse buttons usually handled differently, but for basic mapping
  'Mouse2': '0x3',
};
const getKeyCode = (keyName: string): string => {
  if (!keyName) return '0x0';
  // Check explicit map
  if (KEY_CODE_MAP[keyName]) return KEY_CODE_MAP[keyName];
  // Single characters (A-Z, 0-9)
  if (keyName.length === 1) {
    const code = keyName.toUpperCase().charCodeAt(0);
    return '0x' + code.toString(16).toLowerCase();
  }
  // F-keys
  const fKeyMatch = keyName.match(/^F(\d+)$/i);
  if (fKeyMatch) {
    const num = parseInt(fKeyMatch[1]);
    // F1 is 0x1000030
    return '0x' + (0x1000030 + num - 1).toString(16);
  }
  // Fallback: try to interpret as hex if it looks like it
  if (keyName.startsWith('0x')) return keyName;
  return '0x0'; // Unknown
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
export const generateAntiMicroXXML = (profile: Profile, actions: {id: string, defaultKey: string}[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<gamecontroller configversion="19" appversion="3.3.3">\n';
  xml += '    <sdl2gamecontroller>\n';
  profile.sets.forEach((set, index) => {
    xml += `        <set index="${index + 1}">\n`;
    xml += `            <name>${escapeXml(set.name)}</name>\n`;
    // Filter buttons that have at least one slot assigned
    const activeMappings = Object.values(set.mappings).filter(m => 
      m.slots.some(s => s.actionId || s.macroId || s.modeShiftId)
    );
    activeMappings.forEach(mapping => {
      const antiMicroId = BUTTON_ID_MAP[mapping.id];
      if (!antiMicroId) return;
      xml += `            <button id="${antiMicroId}">\n`;
      xml += `                <slots>\n`;
      mapping.slots.forEach((slot) => {
        if (!slot) return;
        // Check if slot has content
        const hasContent = slot.actionId || slot.macroId || slot.modeShiftId;
        if (!hasContent) return;
        xml += `                    <slot>\n`;
        if (slot.modeShiftId) {
          const targetSetIndex = profile.sets.findIndex(s => s.id === slot.modeShiftId);
          if (targetSetIndex !== -1) {
            xml += `                        <setselect>${targetSetIndex + 1}</setselect>\n`;
          }
        } else if (slot.macroId) {
          const macro = profile.macros.find(m => m.id === slot.macroId);
          if (macro) {
            macro.steps.forEach(step => {
              if (step.type === 'delay') {
                xml += `                        <event type="delay" value="${step.value}"/>\n`;
              } else if (step.type === 'key') {
                xml += `                        <event type="key" value="${getKeyCode(String(step.value))}"/>\n`;
              } else if (step.type === 'mouse') {
                 // Basic mouse support
                 // AntiMicroX uses specific codes for mouse, simplified here
                 xml += `                        <event type="mouse" value="${step.value}"/>\n`;
              }
            });
          }
        } else if (slot.actionId) {
          const action = actions.find(a => a.id === slot.actionId);
          if (action) {
            xml += `                        <code>${getKeyCode(action.defaultKey)}</code>\n`;
            xml += `                        <mode>keyboard</mode>\n`;
          }
        }
        xml += `                    </slot>\n`;
      });
      xml += `                </slots>\n`;
      xml += `            </button>\n`;
    });
    xml += `        </set>\n`;
  });
  xml += '    </sdl2gamecontroller>\n';
  xml += '</gamecontroller>';
  return xml;
};