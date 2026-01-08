import React from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  DragEndEvent 
} from '@dnd-kit/core';
import { SetManager } from '@/components/sidebar/SetManager';
import { ConfigPanel } from '@/components/inspector/ConfigPanel';
import { ControllerSchematic } from '@/components/controller/ControllerSchematic';
import { ActionImporter } from '@/components/importer/ActionImporter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useProfileStore } from '@/store/profileStore';
import { DraggableAction } from '@/components/dnd/DraggableAction';
import { Action } from '@/types/antimicro';
export function EditorLayout() {
  const updateAssignment = useProfileStore(s => s.updateAssignment);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const [activeDragAction, setActiveDragAction] = React.useState<Action | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts to allow clicks
      },
    })
  );
  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === 'action') {
      setActiveDragAction(event.active.data.current.action);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragAction(null);
    if (!over) return;
    // Check if dropped on a slot
    // Slot ID format: slot-{buttonId}-{slotIndex}
    if (String(over.id).startsWith('slot-')) {
      const parts = String(over.id).split('-');
      // parts[0] = 'slot'
      // parts[1] = buttonId (might contain dashes? No, our IDs are simple strings like 'A', 'DPad-Up' -> wait, DPadUp)
      // Let's assume button IDs don't contain dashes for safety, or we join.
      // Our IDs: A, B, X, Y, LB, RB, LT, RT, Back, Start, Guide, LS, RS, DPadUp...
      // None have dashes. Safe.
      const buttonId = parts[1];
      const slotIndex = parseInt(parts[2], 10);
      const actionId = active.id as string;
      if (activeSetId && buttonId && !isNaN(slotIndex)) {
        updateAssignment(activeSetId, buttonId, slotIndex, actionId);
      }
    }
  };
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
        {/* Left Sidebar: Set Manager */}
        <aside className="w-64 flex-shrink-0 z-20 shadow-xl">
          <SetManager />
        </aside>
        {/* Main Content: Controller Visualizer */}
        <main className="flex-1 relative flex flex-col min-w-0 bg-zinc-950/50">
          {/* Header */}
          <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h1 className="text-sm font-bold tracking-widest uppercase text-zinc-300">
                Tactical<span className="text-amber-500">Bind</span> Architect
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500 font-mono">v1.0.0-BETA</span>
              <ThemeToggle className="static transform-none" />
            </div>
          </header>
          {/* Workspace */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
            <ControllerSchematic />
          </div>
        </main>
        {/* Right Sidebar: Inspector */}
        <aside className="w-80 flex-shrink-0 z-20 shadow-xl">
          <ConfigPanel />
        </aside>
        {/* Modals & Overlays */}
        <ActionImporter />
        <Toaster theme="dark" position="bottom-right" />
        <DragOverlay>
          {activeDragAction ? (
            <div className="opacity-90 rotate-3 scale-105 cursor-grabbing">
               <DraggableAction action={activeDragAction} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}