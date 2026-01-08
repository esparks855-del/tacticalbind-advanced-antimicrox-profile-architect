import React, { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CONTROLLER_BUTTONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointerClick, Zap, Layers, FileText } from 'lucide-react';
import { DraggableAction } from '@/components/dnd/DraggableAction';
import { DraggableMacro } from '@/components/dnd/DraggableMacro';
import { DroppableSlot } from '@/components/dnd/DroppableSlot';
import { MacroEditor } from '@/components/inspector/MacroEditor';
export function ConfigPanel() {
  const selectedButtonId = useProfileStore(s => s.selectedButtonId);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const updateAssignment = useProfileStore(s => s.updateAssignment);
  const assignModeShift = useProfileStore(s => s.assignModeShift);
  const addMacro = useProfileStore(s => s.addMacro);
  const [isMacroEditorOpen, setMacroEditorOpen] = useState(false);
  // We no longer need activeSlotIndex for direct assignment since we use DnD, 
  // but we might want to auto-assign if created from a specific slot context in future.
  // For now, we just create macros into the library.
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
    if (!slot) return <span className="text-zinc-500 text-sm">Empty - Drag Item Here</span>;
    if (slot.modeShiftId) {
        const targetSet = profile.sets.find(s => s.id === slot.modeShiftId);
        return (
            <div className="flex items-center gap-2 text-purple-400">
                <Layers className="w-4 h-4" />
                <span className="font-medium text-sm">Shift to: {targetSet?.name || 'Unknown Set'}</span>
            </div>
        );
    }
    if (slot.macroId) {
        const macro = profile.macros.find(m => m.id === slot.macroId);
        return (
            <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-4 h-4" />
                <span className="font-medium text-sm">Macro: {macro?.name || 'Unknown Macro'}</span>
            </div>
        );
    }
    if (slot.actionId) {
        const action = actions.find(a => a.id === slot.actionId);
        return (
            <div className="flex items-center gap-2 text-amber-400">
                <span className="font-bold text-sm">{action?.name || 'Unknown'}</span>
                <span className="text-xs bg-zinc-800 px-1 rounded text-zinc-400 font-mono">{action?.defaultKey}</span>
            </div>
        );
    }
    return <span className="text-zinc-500 text-sm">Empty - Drag Item Here</span>;
  };
  const handleClearSlot = (index: number) => {
      if (activeSetId && selectedButtonId) {
          updateAssignment(activeSetId, selectedButtonId, index, null);
      }
  };
  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">
            {selectedButton.type.toUpperCase()}
          </Badge>
          <span className="text-xs font-mono text-zinc-500">ID: {selectedButton.id}</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{selectedButton.label}</h2>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="tap" className="flex-1 flex flex-col">
            <div className="px-6 pt-4">
                <TabsList className="w-full bg-zinc-900 border border-zinc-800 grid grid-cols-4">
                    <TabsTrigger value="tap">Tap</TabsTrigger>
                    <TabsTrigger value="hold">Hold</TabsTrigger>
                    <TabsTrigger value="double">Dbl</TabsTrigger>
                    <TabsTrigger value="release">Rel</TabsTrigger>
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
                    {/* RELEASE TAB */}
                    <TabsContent value="release" className="mt-0 space-y-4">
                         <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-400">Release Action</h3>
                                {mapping?.slots[3] && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500 hover:text-red-400" onClick={() => handleClearSlot(3)}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <DroppableSlot id={`slot-${selectedButtonId}-3`} className="h-16 flex items-center justify-center bg-zinc-900">
                                {getSlotContent(3)}
                            </DroppableSlot>
                            <p className="text-xs text-zinc-500">Action triggers when the button is released.</p>
                        </div>
                    </TabsContent>
                </div>
            </ScrollArea>
        </Tabs>
        {/* Library Section */}
        <div className="h-[350px] border-t border-zinc-800 flex flex-col bg-zinc-950">
            <Tabs defaultValue="actions" className="flex-1 flex flex-col">
                <div className="px-3 pt-3 border-b border-zinc-800 bg-zinc-900/50">
                    <TabsList className="w-full bg-zinc-900 border border-zinc-800 h-9">
                        <TabsTrigger value="actions" className="flex-1 text-xs">
                            <FileText className="w-3 h-3 mr-2" />
                            Actions
                        </TabsTrigger>
                        <TabsTrigger value="macros" className="flex-1 text-xs">
                            <Zap className="w-3 h-3 mr-2" />
                            Macros
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="actions" className="flex-1 mt-0 min-h-0">
                    <ScrollArea className="h-full p-3">
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
                </TabsContent>
                <TabsContent value="macros" className="flex-1 mt-0 min-h-0">
                    <div className="p-2 border-b border-zinc-800 bg-zinc-900/30">
                        <Button 
                            size="sm" 
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-8 text-xs"
                            onClick={() => setMacroEditorOpen(true)}
                        >
                            <Zap className="w-3 h-3 mr-2" />
                            Create New Macro
                        </Button>
                    </div>
                    <ScrollArea className="h-full p-3">
                        <div className="space-y-2">
                            {profile.macros.length === 0 ? (
                                <div className="text-center py-8 text-zinc-600 text-sm">
                                    <p>No macros created.</p>
                                    <p className="text-xs mt-1">Click "Create New Macro" to start.</p>
                                </div>
                            ) : (
                                profile.macros.map(macro => (
                                    <DraggableMacro key={macro.id} macro={macro} />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
      </div>
      <MacroEditor
        isOpen={isMacroEditorOpen}
        onClose={() => setMacroEditorOpen(false)}
        onSave={(name, steps) => {
            addMacro(name, steps);
        }}
      />
    </div>
  );
}