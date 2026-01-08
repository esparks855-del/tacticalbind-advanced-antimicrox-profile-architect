import React from 'react';
import { useProfileStore } from '@/store/profileStore';
import { CONTROLLER_BUTTONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings2, MousePointerClick } from 'lucide-react';
export function ConfigPanel() {
  const selectedButtonId = useProfileStore(s => s.selectedButtonId);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const selectedButton = CONTROLLER_BUTTONS.find(b => b.id === selectedButtonId);
  // Find current mapping for this button in the active set
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
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Assignments
              </h3>
            </div>
            {/* Placeholder for Phase 2 Logic */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">Primary Action (Tap)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-10 rounded border border-zinc-700 border-dashed flex items-center justify-center text-zinc-500 text-sm hover:bg-zinc-800/50 cursor-pointer transition-colors">
                  {mapping?.slots[0]?.actionId 
                    ? <span className="text-amber-400 font-mono">{actions.find(a => a.id === mapping.slots[0].actionId)?.name || 'Unknown Action'}</span>
                    : 'Drag Action Here or Click to Assign'
                  }
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 opacity-50 hover:opacity-100 transition-opacity">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">Secondary (Hold)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-10 rounded border border-zinc-700 border-dashed flex items-center justify-center text-zinc-500 text-sm">
                  Empty
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="pt-6 border-t border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Available Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              {actions.length === 0 ? (
                <p className="text-xs text-zinc-600 italic">No actions imported yet.</p>
              ) : (
                actions.slice(0, 10).map(action => (
                  <div key={action.id} className="bg-zinc-900/50 border border-zinc-800 px-3 py-2 rounded text-xs text-zinc-300 flex justify-between items-center">
                    <span className="font-medium">{action.name}</span>
                    <span className="font-mono text-zinc-500">{action.defaultKey}</span>
                  </div>
                ))
              )}
              {actions.length > 10 && (
                <p className="text-xs text-zinc-500 text-center mt-2">...and {actions.length - 10} more</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}