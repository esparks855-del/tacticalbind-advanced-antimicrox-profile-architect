/**
 * Mapping of human-readable key names to AntiMicroX/Qt key codes.
 * AntiMicroX typically uses Qt Key codes for keyboard events.
 */
export const KEY_MAP: Record<string, string> = {
  // Alphanumeric
  'a': '0x41', 'b': '0x42', 'c': '0x43', 'd': '0x44', 'e': '0x45',
  'f': '0x46', 'g': '0x47', 'h': '0x48', 'i': '0x49', 'j': '0x4a',
  'k': '0x4b', 'l': '0x4c', 'm': '0x4d', 'n': '0x4e', 'o': '0x4f',
  'p': '0x50', 'q': '0x51', 'r': '0x52', 's': '0x53', 't': '0x54',
  'u': '0x55', 'v': '0x56', 'w': '0x57', 'x': '0x58', 'y': '0x59', 'z': '0x5a',
  '0': '0x30', '1': '0x31', '2': '0x32', '3': '0x33', '4': '0x34',
  '5': '0x35', '6': '0x36', '7': '0x37', '8': '0x38', '9': '0x39',
  // Function Keys
  'f1': '0x1000030', 'f2': '0x1000031', 'f3': '0x1000032', 'f4': '0x1000033',
  'f5': '0x1000034', 'f6': '0x1000035', 'f7': '0x1000036', 'f8': '0x1000037',
  'f9': '0x1000038', 'f10': '0x1000039', 'f11': '0x100003a', 'f12': '0x100003b',
  // Extended Function Keys
  'f13': '0x100003c', 'f14': '0x100003d', 'f15': '0x100003e', 'f16': '0x100003f',
  'f17': '0x1000040', 'f18': '0x1000041', 'f19': '0x1000042', 'f20': '0x1000043',
  'f21': '0x1000044', 'f22': '0x1000045', 'f23': '0x1000046', 'f24': '0x1000047',
  // Modifiers
  'shift': '0x1000020', 'lshift': '0x1000020', 'rshift': '0x1000020',
  'ctrl': '0x1000021', 'lctrl': '0x1000021', 'rctrl': '0x1000021',
  'alt': '0x1000023', 'lalt': '0x1000023', 'ralt': '0x1000023',
  'meta': '0x1000022', 'lmeta': '0x1000022', 'rmeta': '0x1000022', // Windows key / Command
  // Special Keys
  'space': '0x20',
  'enter': '0x1000004', 'return': '0x1000004',
  'esc': '0x1000000', 'escape': '0x1000000',
  'backspace': '0x1000003',
  'tab': '0x1000001',
  'capslock': '0x1000024',
  'numlock': '0x1000025',
  'scrolllock': '0x1000026',
  'printscreen': '0x1000042', 'sysreq': '0x1000042',
  'pause': '0x1000040',
  'insert': '0x1000006',
  'delete': '0x1000007', 'del': '0x1000007',
  'home': '0x1000010',
  'end': '0x1000011',
  'pageup': '0x1000016', 'pgup': '0x1000016',
  'pagedown': '0x1000017', 'pgdn': '0x1000017',
  // Arrows
  'up': '0x1000013',
  'down': '0x1000015',
  'left': '0x1000012',
  'right': '0x1000014',
  // Numpad
  'numpad0': '0x1000005', // User requested specific mapping (likely Numpad Enter or specific game bind)
  'numpadenter': '0x1000005',
  'numpad1': '0x31', // Fallback to standard numbers if specific Qt codes aren't strictly required by user
  'numpad2': '0x32',
  'numpad3': '0x33',
  'numpad4': '0x34',
  'numpad5': '0x35',
  'numpad6': '0x36',
  'numpad7': '0x37',
  'numpad8': '0x38',
  'numpad9': '0x39',
  'numpadadd': '0x100002b',
  'numpadsubtract': '0x100002d',
  'numpadmultiply': '0x100002a',
  'numpaddivide': '0x100002f',
  'numpaddecimal': '0x100002e',
  // Symbols
  '`': '0x60', '~': '0x7e',
  '-': '0x2d', '_': '0x5f',
  '=': '0x3d', '+': '0x2b',
  '[': '0x5b', '{': '0x7b',
  ']': '0x5d', '}': '0x7d',
  '\\': '0x5c', '|': '0x7c',
  ';': '0x3b', ':': '0x3a',
  '\'': '0x27', '"': '0x22',
  ',': '0x2c', '<': '0x3c',
  '.': '0x2e', '>': '0x3e',
  '/': '0x2f', '?': '0x3f',
};
export const MOUSE_MAP: Record<string, string> = {
  'mouse1': '1', 'lbutton': '1', 'leftclick': '1', 'left': '1',
  'mouse2': '3', 'rbutton': '3', 'rightclick': '3', 'right': '3',
  'mouse3': '2', 'mbutton': '2', 'middleclick': '2', 'middle': '2',
  'wheelup': '4',
  'wheeldown': '5',
  'xbutton1': '6',
  'xbutton2': '7'
};
export interface AntiMicroXMapping {
  code: string;
  mode: 'keyboard' | 'mouse';
}
export const getAntiMicroXCode = (keyName: string): AntiMicroXMapping => {
  if (!keyName) return { code: '0x0', mode: 'keyboard' };
  const normalized = keyName.toLowerCase().replace(/\s+/g, '');
  // Check Mouse Map first
  if (MOUSE_MAP[normalized]) {
    return { code: MOUSE_MAP[normalized], mode: 'mouse' };
  }
  // Check Key Map
  if (KEY_MAP[normalized]) {
    return { code: KEY_MAP[normalized], mode: 'keyboard' };
  }
  // Fallback for single characters (assume ASCII/Qt match)
  if (normalized.length === 1) {
    const code = normalized.toUpperCase().charCodeAt(0);
    return { code: '0x' + code.toString(16).toLowerCase(), mode: 'keyboard' };
  }
  // Fallback for explicit hex codes provided by user
  if (normalized.startsWith('0x')) {
    return { code: normalized, mode: 'keyboard' };
  }
  // Unknown key
  console.warn(`Unknown key mapping: ${keyName}`);
  return { code: '0x0', mode: 'keyboard' };
};