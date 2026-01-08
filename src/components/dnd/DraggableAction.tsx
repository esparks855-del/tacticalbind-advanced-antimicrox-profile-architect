import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Action } from '@/types/antimicro';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
interface DraggableActionProps {
  action: Action;
}
export function DraggableAction({ action }: DraggableActionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: action.id,
    data: { type: 'action', action }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group flex items-center justify-between p-2 rounded-md border text-sm cursor-grab active:cursor-grabbing transition-colors",
        isDragging 
          ? "bg-amber-500/20 border-amber-500 text-amber-500 z-50 shadow-xl" 
          : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
        <span className="font-medium truncate">{action.name}</span>
      </div>
      <span className="font-mono text-xs text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
        {action.defaultKey}
      </span>
    </div>
  );
}