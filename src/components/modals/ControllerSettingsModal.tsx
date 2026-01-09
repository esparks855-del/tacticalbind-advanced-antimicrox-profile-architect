import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useProfileStore } from '@/store/profileStore';
import { Settings2, Gamepad2, Timer } from 'lucide-react';
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
  const updateGeneralConfig = useProfileStore(s => s.updateGeneralConfig);
  const axisConfig = useProfileStore(s => s.profile.axisConfig) || {};
  const generalConfig = useProfileStore(s => s.profile.generalConfig) || {};
  const handleDeadzoneChange = (axis: string, value: number[]) => {
    updateDeadzone(axis, value[0]);
  };
  const handleTurboChange = (value: number[]) => {
    updateGeneralConfig({ turboInterval: value[0] });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Settings2 className="w-5 h-5" />
            Controller Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure global hardware settings and timing preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-8">
          {/* Deadzones Section */}
          <div className="space-y-6">
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
          {/* Timing Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-2">
              <Timer className="w-4 h-4" />
              Timing & Response
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-zinc-300">Global Turbo Interval</Label>
                  <p className="text-[10px] text-zinc-500">Delay between repeats for Turbo-enabled buttons.</p>
                </div>
                <span className="font-mono text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                  {generalConfig.turboInterval ?? 100} ms
                </span>
              </div>
              <Slider
                defaultValue={[generalConfig.turboInterval ?? 100]}
                max={1000}
                step={10}
                onValueChange={handleTurboChange}
                className="[&>.relative>.absolute]:bg-blue-500"
              />
            </div>
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