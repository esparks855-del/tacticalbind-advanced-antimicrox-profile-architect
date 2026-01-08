import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useProfileStore } from '@/store/profileStore';
import { Settings2, Gamepad2 } from 'lucide-react';
interface ControllerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AXES = [
  { id: 'leftx', label: 'Left Stick X' },
  { id: 'lefty', label: 'Left Stick Y' },
  { id: 'rightx', label: 'Right Stick X' },
  { id: 'righty', label: 'Right Stick Y' },
  { id: 'lefttrigger', label: 'Left Trigger' },
  { id: 'righttrigger', label: 'Right Trigger' },
];
export function ControllerSettingsModal({ isOpen, onClose }: ControllerSettingsModalProps) {
  const updateDeadzone = useProfileStore(s => s.updateDeadzone);
  const axisConfig = useProfileStore(s => s.profile.axisConfig) || {};
  const handleDeadzoneChange = (axis: string, value: number[]) => {
    updateDeadzone(axis, value[0]);
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Settings2 className="w-5 h-5" />
            Controller Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure global hardware settings. Deadzones are crucial for preventing stick drift.
            Values range from 0 to 32767.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">
            <Gamepad2 className="w-4 h-4" />
            Deadzone Configuration
          </div>
          <div className="grid gap-6">
            {AXES.map((axis) => {
              const currentValue = axisConfig[axis.id]?.deadZone || 0;
              return (
                <div key={axis.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">{axis.label}</Label>
                    <span className="font-mono text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      {currentValue}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[currentValue]}
                    max={32767}
                    step={100}
                    onValueChange={(val) => handleDeadzoneChange(axis.id, val)}
                    className="[&>.relative>.absolute]:bg-amber-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}