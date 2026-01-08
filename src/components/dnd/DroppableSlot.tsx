import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
interface DroppableSlotProps {
  id: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}
export function DroppableSlot({ id, children, isActive, className }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-all duration-200 rounded-lg border-2 border-dashed",
        isOver 
          ? "border-amber-500 bg-amber-500/10 scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
          : isActive 
            ? "border-amber-500/50 bg-zinc-900" 
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700",
        className
      )}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-500/10 rounded-lg pointer-events-none">
          <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Drop to Assign</span>
        </div>
      )}
    </div>
  );
}