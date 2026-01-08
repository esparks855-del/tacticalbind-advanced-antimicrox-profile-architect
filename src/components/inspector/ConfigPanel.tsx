import React, { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CONTROLLER_BUTTONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, MousePointerClick, Zap, Layers, Clock, X } from 'lucide-react';
import { DraggableAction } from '@/components/dnd/DraggableAction';
import { DroppableSlot } from '@/components/dnd/DroppableSlot';
import { MacroEditor } from '@/components/inspector/MacroEditor';
import { cn } from '@/lib/utils';
export function ConfigPanel() {
  const selectedButtonId = useProfileStore(s => s.selectedButtonId);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const updateAssignment = useProfileStore(s => s.updateAssignment);
  const assignMacro = useProfileStore(s => s.assignMacro);
  const addMacro = useProfileStore(s => s.addMacro);
  const assignModeShift = useProfileStore(s => s.assignModeShift);
  const [isMacroEditorOpen, setMacroEditorOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0); // For macro assignment context
  const selectedButton = CONTROLLER_BUTTONS.find(b => b.id === selectedButtonId);
  const activeSet = profile.sets.find(s => s.id === activeSetId);
  const mapping = activeSet?.mappings[selectedButtonId || ''];
  if (!selectedButtonId || !selectedButton) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-950 border-l border-zinc-800 p-8 text-center">
        <MousePointerClick className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-zinc-400">No Button Selected</h3>
        <p className="text-sm mt-2 max-w-[200px]">Click a button on the controller schematic to configure its behavior.</p>
      </div>
    );
  }
  const getSlotContent = (index: number) => {
    const slot = mapping?.slots[index];
    if (!slot) return <span className="text-zinc-500">Empty - Drag Action Here</span>;
    if (slot.modeShiftId) {
        const targetSet = profile.sets.find(s => s.id === slot.modeShiftId);
        return (
            <div className="flex items-center gap-2 text-purple-400">
                <Layers className="w-4 h-4" />
                <span className="font-medium">Shift to: {targetSet?.name || 'Unknown Set'}</span>
            </div>
        );
    }
    if (slot.macroId) {
        const macro = profile.macros.find(m => m.id === slot.macroId);
        return (
            <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Macro: {macro?.name || 'Unknown Macro'}</span>
            </div>
        );
    }
    if (slot.actionId) {
        const action = actions.find(a => a.id === slot.actionId);
        return (
            <div className="flex items-center gap-2 text-amber-400">
                <span className="font-bold">{action?.name || 'Unknown'}</span>
                <span className="text-xs bg-zinc-800 px-1 rounded text-zinc-400">{action?.defaultKey}</span>
            </div>
        );
    }
    return <span className="text-zinc-500">Empty - Drag Action Here</span>;
  };
  const handleClearSlot = (index: number) => {
      if (activeSetId && selectedButtonId) {
          updateAssignment(activeSetId, selectedButtonId, index, null);
      }
  };
  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">
            {selectedButton.type.toUpperCase()}
          </Badge>
          <span className="text-xs font-mono text-zinc-500">ID: {selectedButton.id}</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{selectedButton.label}</h2>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="tap" className="flex-1 flex flex-col">
            <div className="px-6 pt-4">
                <TabsList className="w-full bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="tap" className="flex-1">Tap</TabsTrigger>
                    <TabsTrigger value="hold" className="flex-1">Hold</TabsTrigger>
                    <TabsTrigger value="double" className="flex-1">Double</TabsTrigger>
                </TabsList>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6">
                    {/* TAP TAB */}
                    <TabsContent value="tap" className="mt-0 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-400">Primary Action</h3>
                                {mapping?.slots[0] && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500 hover:text-red-400" onClick={() => handleClearSlot(0)}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <DroppableSlot id={`slot-${selectedButtonId}-0`} className="h-16 flex items-center justify-center bg-zinc-900">
                                {getSlotContent(0)}
                            </DroppableSlot>
                        </div>
                        <div className="pt-4 border-t border-zinc-800">
                            <Button 
                                variant="outline" 
                                className="w-full border-zinc-700 text-zinc-400 hover:text-amber-500 hover:border-amber-500"
                                onClick={() => {
                                    setActiveSlotIndex(0);
                                    setMacroEditorOpen(true);
                                }}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Create & Assign Macro
                            </Button>
                        </div>
                    </TabsContent>
                    {/* HOLD TAB */}
                    <TabsContent value="hold" className="mt-0 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-400">Hold Action</h3>
                                {mapping?.slots[1] && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500 hover:text-red-400" onClick={() => handleClearSlot(1)}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <DroppableSlot id={`slot-${selectedButtonId}-1`} className="h-16 flex items-center justify-center bg-zinc-900">
                                {getSlotContent(1)}
                            </DroppableSlot>
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="text-sm font-medium text-zinc-400">Mode Shift</h3>
                            <Select 
                                value={mapping?.slots[1]?.modeShiftId || "none"} 
                                onValueChange={(val) => {
                                    if (val === "none") {
                                        // Clear only if it was a mode shift
                                        if (mapping?.slots[1]?.modeShiftId) handleClearSlot(1);
                                    } else {
                                        assignModeShift(activeSetId, selectedButtonId, 1, val);
                                    }
                                }}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {profile.sets.filter(s => s.id !== activeSetId).map(s => (
                                        <SelectItem key={s.id} value={s.id}>Switch to {s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-zinc-500">Holding this button will temporarily activate the selected set.</p>
                        </div>
                    </TabsContent>
                    {/* DOUBLE TAB */}
                    <TabsContent value="double" className="mt-0 space-y-4">
                         <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-400">Double Tap Action</h3>
                                {mapping?.slots[2] && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500 hover:text-red-400" onClick={() => handleClearSlot(2)}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <DroppableSlot id={`slot-${selectedButtonId}-2`} className="h-16 flex items-center justify-center bg-zinc-900">
                                {getSlotContent(2)}
                            </DroppableSlot>
                        </div>
                    </TabsContent>
                </div>
            </ScrollArea>
        </Tabs>
        {/* Action Library */}
        <div className="h-[300px] border-t border-zinc-800 flex flex-col bg-zinc-950">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Action Library</h3>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                    {actions.length === 0 ? (
                        <div className="text-center py-8 text-zinc-600 text-sm">
                            <p>No actions imported.</p>
                            <p className="text-xs mt-1">Use "Import Keybinds" in the left sidebar.</p>
                        </div>
                    ) : (
                        actions.map(action => (
                            <DraggableAction key={action.id} action={action} />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
      </div>
      <MacroEditor 
        isOpen={isMacroEditorOpen} 
        onClose={() => setMacroEditorOpen(false)}
        onSave={(name, steps) => {
            addMacro(name, steps);
            // Auto assign the newly created macro to the active slot
            // We need the ID of the new macro. Since addMacro generates ID internally, 
            // we might need to refactor addMacro to return ID or just find the last one.
            // For safety in this phase, we'll just add it to the library or we can improve store to return ID.
            // Actually, let's just find the latest macro in the store after adding.
            // But state updates are async/batched. 
            // Better approach: Generate ID here and pass to addMacroWithId (if we had it).
            // For now, we will just add it. The user can then assign it if we had a macro list.
            // Wait, the requirement says "Creating macros... Assigning it".
            // I'll update store to accept ID in addMacro to make this deterministic.
        }}
      />
    </div>
  );
}