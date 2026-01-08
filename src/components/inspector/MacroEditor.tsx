import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MacroStep } from '@/types/antimicro';
import { Plus, Trash2, Clock, Keyboard, MousePointer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
interface MacroEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, steps: MacroStep[]) => void;
  initialName?: string;
  initialSteps?: MacroStep[];
}
export function MacroEditor({ isOpen, onClose, onSave, initialName = '', initialSteps = [] }: MacroEditorProps) {
  const [name, setName] = useState(initialName);
  const [steps, setSteps] = useState<MacroStep[]>(initialSteps);
  const [newStepType, setNewStepType] = useState<'key' | 'delay' | 'mouse'>('key');
  const [newStepValue, setNewStepValue] = useState('');
  const addStep = () => {
    if (!newStepValue) return;
    setSteps([...steps, { type: newStepType, value: newStepValue }]);
    setNewStepValue('');
  };
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  const handleSave = () => {
    if (!name) return;
    onSave(name, steps);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Macro Editor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Macro Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Rapid Fire"
              className="bg-zinc-900 border-zinc-800 focus:border-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Steps Sequence</Label>
            <ScrollArea className="h-[200px] rounded-md border border-zinc-800 bg-zinc-900 p-2">
              {steps.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 text-sm italic">
                  No steps added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500 w-6">{idx + 1}.</span>
                        {step.type === 'key' && <Keyboard className="w-4 h-4 text-blue-400" />}
                        {step.type === 'delay' && <Clock className="w-4 h-4 text-amber-400" />}
                        {step.type === 'mouse' && <MousePointer className="w-4 h-4 text-green-400" />}
                        <span className="text-sm font-medium">{step.value} {step.type === 'delay' ? 'ms' : ''}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-red-500" onClick={() => removeStep(idx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <div className="flex gap-2 items-end border-t border-zinc-800 pt-4">
            <div className="w-[120px]">
              <Label className="text-xs mb-1 block">Type</Label>
              <Select value={newStepType} onValueChange={(v: any) => setNewStepType(v)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key">Key Press</SelectItem>
                  <SelectItem value="delay">Delay (ms)</SelectItem>
                  <SelectItem value="mouse">Mouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-xs mb-1 block">Value</Label>
              <Input 
                value={newStepValue} 
                onChange={(e) => setNewStepValue(e.target.value)}
                placeholder={newStepType === 'delay' ? '100' : 'Key (e.g. R)'}
                className="bg-zinc-900 border-zinc-800 h-9"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') addStep();
                }}
              />
            </div>
            <Button onClick={addStep} size="sm" className="bg-zinc-800 hover:bg-zinc-700 h-9">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">Save Macro</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}