import { Action } from '@/types/antimicro';
import { v4 as uuidv4 } from 'uuid';
export const parseKeybinds = (text: string): Action[] => {
  const lines = text.split(/\r?\n/);
  const actions: Action[] = [];
  // Common separators in config files
  const separators = ['=', ':', '->', '\t'];
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || 
        trimmed.startsWith('//') || 
        trimmed.startsWith('#') || 
        trimmed.startsWith(';')) {
      continue;
    }
    let name = '';
    let key = '';
    let foundSeparator = false;
    // Try to find the first matching separator
    for (const sep of separators) {
      if (trimmed.includes(sep)) {
        const parts = trimmed.split(sep);
        // Handle case where separator might appear multiple times (take first as split)
        // e.g. "Action = Key = Value" -> Name: "Action", Key: "Key = Value"
        // But usually it's just two parts. Let's be safe and take the first part as name, rest as key.
        name = parts[0].trim();
        key = parts.slice(1).join(sep).trim();
        foundSeparator = true;
        break;
      }
    }
    // If no standard separator found, check for whitespace separation if it looks like two distinct words
    // This is risky, so we only do it if it's clean. 
    // For now, if no separator, we might skip or treat whole line as name? 
    // Let's stick to separators for reliability, but maybe fallback to last space?
    // "Reload R"
    if (!foundSeparator) {
        const lastSpaceIndex = trimmed.lastIndexOf(' ');
        if (lastSpaceIndex > 0) {
            name = trimmed.substring(0, lastSpaceIndex).trim();
            key = trimmed.substring(lastSpaceIndex + 1).trim();
            if (name && key) foundSeparator = true;
        }
    }
    if (foundSeparator && name && key) {
      // Clean up quotes if present (e.g. "Action" = "Key")
      const cleanName = name.replace(/^["']|["']$/g, '');
      const cleanKey = key.replace(/^["']|["']$/g, '');
      if (cleanName && cleanKey) {
        actions.push({
          id: uuidv4(),
          name: cleanName,
          defaultKey: cleanKey
        });
      }
    }
  }
  return actions;
};