import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CONTROLLER_BUTTONS, ControllerButtonId } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
// Refined positions for the new vector layout
// Coordinates are percentages relative to the container
const BUTTON_POSITIONS: Record<ControllerButtonId, { top: string; left: string; width?: string; height?: string; shape?: string; labelClass?: string }> = {
  // Face Buttons (Top Right Cluster)
  'Y': { top: '28%', left: '78%', width: '36px', height: '36px', labelClass: 'text-yellow-500' },
  'B': { top: '36%', left: '84%', width: '36px', height: '36px', labelClass: 'text-red-500' },
  'A': { top: '44%', left: '78%', width: '36px', height: '36px', labelClass: 'text-green-500' },
  'X': { top: '36%', left: '72%', width: '36px', height: '36px', labelClass: 'text-blue-500' },
  // Center Buttons
  'Guide': { top: '22%', left: '50%', width: '48px', height: '48px', shape: 'rounded-full' },
  'Back': { top: '36%', left: '42%', width: '24px', height: '24px', shape: 'rounded-full' }, // View
  'Start': { top: '36%', left: '58%', width: '24px', height: '24px', shape: 'rounded-full' }, // Menu
  // Sticks (Click)
  'LS': { top: '36%', left: '22%', width: '64px', height: '64px', shape: 'rounded-full' },
  'RS': { top: '56%', left: '64%', width: '64px', height: '64px', shape: 'rounded-full' },
  // Stick Directions (New)
  // LS Center is 22%, 36%
  'LS_Up': { top: '29%', left: '22%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'LS_Down': { top: '43%', left: '22%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'LS_Left': { top: '36%', left: '15%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'LS_Right': { top: '36%', left: '29%', width: '24px', height: '24px', shape: 'rounded-sm' },
  // RS Center is 64%, 56%
  'RS_Up': { top: '49%', left: '64%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'RS_Down': { top: '63%', left: '64%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'RS_Left': { top: '56%', left: '57%', width: '24px', height: '24px', shape: 'rounded-sm' },
  'RS_Right': { top: '56%', left: '71%', width: '24px', height: '24px', shape: 'rounded-sm' },
  // D-Pad (Bottom Left)
  'DPadUp': { top: '52%', left: '34%', width: '24px', height: '28px', shape: 'rounded-t-md' },
  'DPadDown': { top: '62%', left: '34%', width: '24px', height: '28px', shape: 'rounded-b-md' },
  'DPadLeft': { top: '57%', left: '30%', width: '28px', height: '24px', shape: 'rounded-l-md' },
  'DPadRight': { top: '57%', left: '38%', width: '28px', height: '24px', shape: 'rounded-r-md' },
  // Shoulders/Triggers (Visualized at top)
  'LB': { top: '12%', left: '22%', width: '100px', height: '30px', shape: 'rounded-t-[20px]' },
  'RB': { top: '12%', left: '78%', width: '100px', height: '30px', shape: 'rounded-t-[20px]' },
  'LT': { top: '4%', left: '18%', width: '70px', height: '40px', shape: 'rounded-t-[24px]' },
  'RT': { top: '4%', left: '82%', width: '70px', height: '40px', shape: 'rounded-t-[24px]' },
  // Paddles (Visualized floating near bottom grips)
  'P1': { top: '75%', left: '70%', width: '32px', height: '40px', shape: 'rounded-bl-xl skew-y-12' }, // Upper Right
  'P3': { top: '85%', left: '74%', width: '32px', height: '32px', shape: 'rounded-bl-xl skew-y-12' }, // Lower Right
  'P2': { top: '75%', left: '30%', width: '32px', height: '40px', shape: 'rounded-br-xl -skew-y-12' }, // Upper Left
  'P4': { top: '85%', left: '26%', width: '32px', height: '32px', shape: 'rounded-br-xl -skew-y-12' }, // Lower Left
};
export function ControllerSchematic() {
  const selectedButtonId = useProfileStore(s => s.selectedButtonId);
  const selectButton = useProfileStore(s => s.selectButton);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const activeSet = profile.sets.find(s => s.id === activeSetId);
  const getDirectionIcon = (id: string) => {
    if (id.includes('Up')) return <ChevronUp className="w-3 h-3" />;
    if (id.includes('Down')) return <ChevronDown className="w-3 h-3" />;
    if (id.includes('Left')) return <ChevronLeft className="w-3 h-3" />;
    if (id.includes('Right')) return <ChevronRight className="w-3 h-3" />;
    return null;
  };
  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="relative w-full aspect-[16/10] select-none">
          {/* Vector Controller Body */}
          <svg
            viewBox="0 0 1000 625"
            className="absolute inset-0 w-full h-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#27272a" /> {/* zinc-800 */}
                <stop offset="100%" stopColor="#09090b" /> {/* zinc-950 */}
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Main Body Silhouette */}
            <path
              d="M 250 100
                 C 250 100, 350 80, 500 80
                 C 650 80, 750 100, 750 100
                 C 820 110, 880 150, 900 220
                 C 920 290, 920 450, 850 550
                 C 800 620, 720 600, 700 550
                 C 680 500, 650 450, 500 480
                 C 350 450, 320 500, 300 550
                 C 280 600, 200 620, 150 550
                 C 80 450, 80 290, 100 220
                 C 120 150, 180 110, 250 100 Z"
              fill="url(#bodyGradient)"
              stroke="#3f3f46"
              strokeWidth="2"
            />
            {/* Grip Textures (Subtle) */}
            <path d="M 100 220 C 80 290, 80 450, 150 550 C 200 620, 250 580, 250 580" fill="none" stroke="#18181b" strokeWidth="1" opacity="0.5" />
            <path d="M 900 220 C 920 290, 920 450, 850 550 C 800 620, 750 580, 750 580" fill="none" stroke="#18181b" strokeWidth="1" opacity="0.5" />
            {/* Center Plate Area */}
            <path d="M 400 120 L 600 120 C 620 120, 630 150, 600 180 L 400 180 C 370 150, 380 120, 400 120 Z" fill="#18181b" opacity="0.5" />
          </svg>
          {/* Interactive Buttons Layer */}
          <div className="absolute inset-0">
            {CONTROLLER_BUTTONS.map((btn) => {
              const pos = BUTTON_POSITIONS[btn.id];
              if (!pos) return null;
              const isSelected = selectedButtonId === btn.id;
              // Determine mapping state
              const mapping = activeSet?.mappings[btn.id];
              const isMapped = mapping?.slots.some(s => s.actionId || s.macroId || s.modeShiftId);
              // Determine tooltip label
              let tooltipLabel = "Unmapped";
              if (isMapped && mapping) {
                const tapSlot = mapping.slots[0];
                if (tapSlot?.actionId) {
                  const action = actions.find(a => a.id === tapSlot.actionId);
                  tooltipLabel = action ? `Tap: ${action.name}` : "Tap: Unknown Action";
                } else if (tapSlot?.macroId) {
                  const macro = profile.macros.find(m => m.id === tapSlot.macroId);
                  tooltipLabel = macro ? `Tap: Macro (${macro.name})` : "Tap: Unknown Macro";
                } else if (tapSlot?.modeShiftId) {
                  const set = profile.sets.find(s => s.id === tapSlot.modeShiftId);
                  tooltipLabel = set ? `Tap: Switch to ${set.name}` : "Tap: Switch Set";
                } else if (mapping.slots.some(s => s.actionId || s.macroId || s.modeShiftId)) {
                   // If tap is empty but others are mapped
                   tooltipLabel = "Mapped (Hold/Dbl/Rel)";
                }
              }
              return (
                <Tooltip key={btn.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => selectButton(btn.id)}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 z-10 group",
                        "border shadow-lg hover:scale-110 active:scale-95 active:brightness-125",
                        pos.shape || "rounded-full",
                        isSelected
                          ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.6)] ring-2 ring-amber-500/50"
                          : isMapped
                            ? "bg-amber-900/20 border-amber-500/50 text-amber-500 ring-1 ring-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                            : "bg-zinc-800/90 border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-amber-500 backdrop-blur-sm",
                        // Specific styling for different button types
                        btn.type === 'stick' && "border-2 bg-zinc-900/80",
                        btn.type === 'face' && "font-bold text-lg",
                        btn.type === 'trigger' && "bg-zinc-800",
                        btn.type === 'paddle' && "border-dashed border-zinc-600 opacity-80 hover:opacity-100",
                        btn.type === 'stick_dir' && "bg-zinc-900/90 border-zinc-600 hover:bg-zinc-800"
                      )}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                      }}
                      aria-label={btn.label}
                    >
                      {/* Inner detail for sticks */}
                      {btn.type === 'stick' && (
                         <div className={cn(
                           "w-[70%] h-[70%] rounded-full border border-zinc-700 shadow-inner",
                           isSelected ? "bg-amber-600 border-amber-400" : "bg-zinc-800"
                         )} />
                      )}
                      {/* Directional Icons */}
                      {btn.type === 'stick_dir' && getDirectionIcon(btn.id)}
                      {/* Label */}
                      <span className={cn(
                        "relative z-10 pointer-events-none select-none",
                        btn.type === 'stick' && "hidden", // Hide label on stick itself
                        btn.type === 'dpad' && "hidden", // Hide label on dpad segments
                        btn.type === 'stick_dir' && "hidden", // Hide label on stick directions (using icons)
                        pos.labelClass
                      )}>
                        {btn.type === 'face' ? btn.label : (
                          <span className="text-[10px] font-bold tracking-tighter uppercase opacity-80 group-hover:opacity-100">
                            {btn.label}
                          </span>
                        )}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs">
                    <p className="font-bold mb-0.5">{btn.label}</p>
                    <p className="text-zinc-400">{tooltipLabel}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          {/* Decorative Labels */}
          <div className="absolute top-[22%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="w-10 h-10 rounded-full border-2 border-zinc-700 opacity-20" />
          </div>
          {/* D-Pad Center Decoration */}
          <div className="absolute top-[57%] left-[34%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 rounded-full border border-zinc-800 pointer-events-none z-0" />
        </div>
        {/* Legend / Help Text */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 text-xs font-mono uppercase tracking-widest opacity-50">
          Interactive Schematic �� Click to Configure
        </div>
      </div>
    </TooltipProvider>
  );
}