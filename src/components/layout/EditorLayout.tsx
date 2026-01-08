import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { SetManager } from '@/components/sidebar/SetManager';
import { ConfigPanel } from '@/components/inspector/ConfigPanel';
import { ControllerSchematic } from '@/components/controller/ControllerSchematic';
import { ActionImporter } from '@/components/importer/ActionImporter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useProfileStore } from '@/store/profileStore';
import { DraggableAction } from '@/components/dnd/DraggableAction';
import { DraggableMacro } from '@/components/dnd/DraggableMacro';
import { Action, Macro } from '@/types/antimicro';
import { HelpModal } from '@/components/modals/HelpModal';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react';
type DragItem =
  | { type: 'action'; data: Action }
  | { type: 'macro'; data: Macro };
export function EditorLayout() {
  const updateAssignment = useProfileStore(s => s.updateAssignment);
  const assignMacro = useProfileStore(s => s.assignMacro);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const [activeDragItem, setActiveDragItem] = React.useState<DragItem | null>(null);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts to allow clicks
      },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { current } = event.active.data;
    if (current?.type === 'action') {
      setActiveDragItem({ type: 'action', data: current.action });
    } else if (current?.type === 'macro') {
      setActiveDragItem({ type: 'macro', data: current.macro });
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over) return;
    // Check if dropped on a slot
    // Slot ID format: slot-{buttonId}-{slotIndex}
    if (String(over.id).startsWith('slot-')) {
      const parts = String(over.id).split('-');
      // parts[0] = 'slot'
      // parts[1] = buttonId
      // parts[2] = slotIndex
      const buttonId = parts[1];
      const slotIndex = parseInt(parts[2], 10);
      if (activeSetId && buttonId && !isNaN(slotIndex)) {
        const type = active.data.current?.type;
        if (type === 'action') {
            updateAssignment(activeSetId, buttonId, slotIndex, active.id as string);
        } else if (type === 'macro') {
            assignMacro(activeSetId, buttonId, slotIndex, active.id as string);
        }
      }
    }
  };
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
        {/* Left Sidebar: Set Manager */}
        <aside className="w-64 flex-shrink-0 z-20 shadow-xl border-r border-zinc-800 h-full">
          <SetManager />
        </aside>
        {/* Main Content: Controller Visualizer */}
        <main className="flex-1 relative flex flex-col min-w-0 bg-zinc-950/50 h-full">
          {/* Header */}
          <header className="h-14 flex-shrink-0 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h1 className="text-sm font-bold tracking-widest uppercase text-zinc-300">
                Tactical<span className="text-amber-500">Bind</span> Architect
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-400 hover:text-amber-500 gap-2"
                onClick={() => setHelpOpen(true)}
              >
                <LifeBuoy className="w-4 h-4" />
                <span className="hidden sm:inline">Briefing</span>
              </Button>
              <div className="h-4 w-px bg-zinc-800 mx-2" />
              <span className="text-xs text-zinc-500 font-mono mr-2">v1.0.0-BETA</span>
              <ThemeToggle className="static transform-none" />
            </div>
          </header>
          {/* Workspace - Overflow Auto allows scrolling only if controller is too big */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
            <ControllerSchematic />
          </div>
        </main>
        {/* Right Sidebar: Inspector */}
        <aside className="w-80 flex-shrink-0 z-20 shadow-xl border-l border-zinc-800 h-full">
          <ConfigPanel />
        </aside>
        {/* Modals & Overlays */}
        <ActionImporter />
        <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
        <Toaster theme="dark" position="bottom-right" />
        <DragOverlay>
          {activeDragItem ? (
            <div className="opacity-90 rotate-3 scale-105 cursor-grabbing w-[250px]">
               {activeDragItem.type === 'action' ? (
                   <DraggableAction action={activeDragItem.data} />
               ) : (
                   <DraggableMacro macro={activeDragItem.data} />
               )}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}