import { Action } from '@/types/antimicro';
import { v4 as uuidv4 } from 'uuid';
export const parseKeybinds = (text: string): Action[] => {
  const lines = text.split(/\r?\n/);
  const actions: Action[] = [];
  // Regex to match "ActionName = Key"
  // Allows for spaces around the equals sign
  // Captures everything before = as name, everything after as key
  const regex = /^([^=]+)=(.*)$/;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
    const match = trimmed.match(regex);
    if (match) {
      const name = match[1].trim();
      const key = match[2].trim();
      if (name && key) {
        actions.push({
          id: uuidv4(),
          name,
          defaultKey: key
        });
      }
    }
  }
  return actions;
};