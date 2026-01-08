import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileStore } from '@/store/profileStore';
import { Bug, Database, Cpu, RefreshCw } from 'lucide-react';
interface DebugStateModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function DebugStateModal({ isOpen, onClose }: DebugStateModalProps) {
  const [memoryState, setMemoryState] = useState<string>('');
  const [storageState, setStorageState] = useState<string>('');
  const refreshStates = () => {
    // 1. Get Memory State (Zustand)
    const snapshot = useProfileStore.getState().getSnapshot();
    setMemoryState(JSON.stringify(snapshot, null, 2));
    // 2. Get Storage State (LocalStorage)
    const rawStorage = localStorage.getItem('tactical-bind-storage');
    if (rawStorage) {
      try {
        const parsed = JSON.parse(rawStorage);
        // Zustand persist wraps state in { state: ..., version: ... }
        setStorageState(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setStorageState(`Error parsing storage: ${e}`);
      }
    } else {
      setStorageState('No local storage found for key "tactical-bind-storage"');
    }
  };
  useEffect(() => {
    if (isOpen) {
      refreshStates();
    }
  }, [isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500 font-mono">
            <Bug className="w-5 h-5" />
            State Inspector (Debug Mode)
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Compare In-Memory State (Editor) vs. Persisted Storage (Disk). Use this to verify if your export source matches what you see.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          {/* Memory Column */}
          <div className="flex flex-col border border-zinc-800 rounded-md bg-zinc-900/30 overflow-hidden">
            <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              In-Memory (Active)
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="text-[10px] font-mono text-zinc-300 whitespace-pre-wrap break-all">
                {memoryState || 'Loading...'}
              </pre>
            </ScrollArea>
          </div>
          {/* Storage Column */}
          <div className="flex flex-col border border-zinc-800 rounded-md bg-zinc-900/30 overflow-hidden">
            <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Database className="w-4 h-4" />
              LocalStorage (Persisted)
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="text-[10px] font-mono text-zinc-300 whitespace-pre-wrap break-all">
                {storageState || 'Loading...'}
              </pre>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={refreshStates} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Snapshots
          </Button>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Close Inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}