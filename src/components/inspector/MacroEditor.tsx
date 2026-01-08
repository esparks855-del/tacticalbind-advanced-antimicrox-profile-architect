import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MacroStep } from '@/types/antimicro';
import { Plus, Trash2, Clock, Keyboard, MousePointer, Info, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-zinc-800 text-zinc-100">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Macro Editor
            </DialogTitle>
            </DialogHeader>
            <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-md flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200 space-y-1">
                    <p className="font-bold">How Macros Work</p>
                    <p>Macros execute steps in order from top to bottom. Use <strong>Delays</strong> between key presses if the game isn't registering inputs fast enough (e.g., 50ms-100ms).</p>
                </div>
            </div>
            <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label>Macro Name</Label>
                <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rapid Fire, Auto-Landing"
                className="bg-zinc-900 border-zinc-800 focus:border-amber-500"
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Sequence Steps</Label>
                    <span className="text-xs text-zinc-500">{steps.length} steps</span>
                </div>
                <ScrollArea className="h-[200px] rounded-md border border-zinc-800 bg-zinc-900 p-2">
                {steps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm italic gap-2">
                        <Clock className="w-8 h-8 opacity-20" />
                        <p>No steps added yet.</p>
                        <p className="text-xs">Add a Key, Delay, or Mouse click below.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 group hover:border-zinc-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-zinc-600 w-4">{idx + 1}</span>
                            {step.type === 'key' && <Keyboard className="w-4 h-4 text-blue-400" />}
                            {step.type === 'delay' && <Clock className="w-4 h-4 text-amber-400" />}
                            {step.type === 'mouse' && <MousePointer className="w-4 h-4 text-green-400" />}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-200">
                                    {step.type === 'key' && `Press Key: ${step.value}`}
                                    {step.type === 'delay' && `Wait: ${step.value} ms`}
                                    {step.type === 'mouse' && `Click: ${step.value}`}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-red-500 hover:bg-red-900/20" onClick={() => removeStep(idx)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                        </div>
                    ))}
                    </div>
                )}
                </ScrollArea>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-md border border-zinc-800 space-y-3">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Add New Step</Label>
                <div className="flex gap-2 items-end">
                    <div className="w-[130px]">
                    <Label className="text-xs mb-1.5 block text-zinc-400">Action Type</Label>
                    <Select value={newStepType} onValueChange={(v: any) => setNewStepType(v)}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-9">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="key">Key Press</SelectItem>
                        <SelectItem value="delay">Delay (ms)</SelectItem>
                        <SelectItem value="mouse">Mouse Click</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex-1">
                    <Label className="text-xs mb-1.5 block text-zinc-400">
                        {newStepType === 'delay' ? 'Duration (ms)' : 'Key / Button'}
                    </Label>
                    <Input
                        value={newStepValue}
                        onChange={(e) => setNewStepValue(e.target.value)}
                        placeholder={newStepType === 'delay' ? 'e.g. 100' : 'e.g. R, Space, Mouse1'}
                        className="bg-zinc-950 border-zinc-800 h-9 font-mono text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addStep();
                        }}
                    />
                    </div>
                    <Button onClick={addStep} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white h-9 px-4">
                    <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-zinc-200">Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">Save Macro</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </TooltipProvider>
  );
}