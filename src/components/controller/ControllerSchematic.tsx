import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CONTROLLER_BUTTONS, ControllerButtonId } from '@/lib/constants';
import { cn } from '@/lib/utils';
// CSS-based positioning for the controller buttons
// Using percentages to be responsive within the aspect-ratio container
const BUTTON_POSITIONS: Record<ControllerButtonId, { top: string; left: string; width?: string; height?: string; shape?: string }> = {
  // Face Buttons
  'Y': { top: '25%', left: '75%' },
  'B': { top: '35%', left: '82%' },
  'A': { top: '45%', left: '75%' },
  'X': { top: '35%', left: '68%' },
  // Center
  'Guide': { top: '25%', left: '50%', width: '40px', height: '40px' },
  'Back': { top: '35%', left: '42%', width: '20px', height: '20px' },
  'Start': { top: '35%', left: '58%', width: '20px', height: '20px' },
  // Sticks
  'LS': { top: '35%', left: '25%', width: '50px', height: '50px' },
  'RS': { top: '55%', left: '65%', width: '50px', height: '50px' },
  // D-Pad
  'DPadUp': { top: '50%', left: '35%', width: '20px', height: '20px', shape: 'rounded-t' },
  'DPadDown': { top: '60%', left: '35%', width: '20px', height: '20px', shape: 'rounded-b' },
  'DPadLeft': { top: '55%', left: '32%', width: '20px', height: '20px', shape: 'rounded-l' },
  'DPadRight': { top: '55%', left: '38%', width: '20px', height: '20px', shape: 'rounded-r' },
  // Shoulders/Triggers (Visualized at top)
  'LB': { top: '10%', left: '25%', width: '80px', height: '25px', shape: 'rounded-t-lg' },
  'RB': { top: '10%', left: '75%', width: '80px', height: '25px', shape: 'rounded-t-lg' },
  'LT': { top: '2%', left: '20%', width: '60px', height: '30px', shape: 'rounded-t-xl' },
  'RT': { top: '2%', left: '80%', width: '60px', height: '30px', shape: 'rounded-t-xl' },
  // Paddles (Visualized at bottom corners for now)
  'P1': { top: '80%', left: '65%', width: '30px', height: '40px', shape: 'rounded-bl-xl' },
  'P3': { top: '80%', left: '70%', width: '30px', height: '30px', shape: 'rounded-bl-xl' },
  'P2': { top: '80%', left: '35%', width: '30px', height: '40px', shape: 'rounded-br-xl' },
  'P4': { top: '80%', left: '30%', width: '30px', height: '30px', shape: 'rounded-br-xl' },
};
export function ControllerSchematic() {
  const selectedButtonId = useProfileStore(s => s.selectedButtonId);
  const selectButton = useProfileStore(s => s.selectButton);
  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <div className="relative w-full aspect-video bg-zinc-900/50 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Controller Body Silhouette (Abstract) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-950 rounded-[3rem] border border-zinc-800 shadow-inner opacity-80" />
        {/* Buttons */}
        {CONTROLLER_BUTTONS.map((btn) => {
          const pos = BUTTON_POSITIONS[btn.id];
          if (!pos) return null;
          const isSelected = selectedButtonId === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => selectButton(btn.id)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 z-10",
                "border-2 shadow-lg hover:scale-110 active:scale-95",
                pos.shape || "rounded-full",
                isSelected 
                  ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-amber-500",
                // Size defaults
                !pos.width && "w-10 h-10",
              )}
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
              }}
              aria-label={btn.label}
            >
              <span className="text-[10px] font-bold tracking-tighter">{btn.label}</span>
            </button>
          );
        })}
        {/* Status Text */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 text-xs font-mono uppercase tracking-widest">
          Xbox Elite Wireless Controller
        </div>
      </div>
    </div>
  );
}