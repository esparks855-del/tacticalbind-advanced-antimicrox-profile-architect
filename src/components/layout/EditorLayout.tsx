import React from 'react';
import { SetManager } from '@/components/sidebar/SetManager';
import { ConfigPanel } from '@/components/inspector/ConfigPanel';
import { ControllerSchematic } from '@/components/controller/ControllerSchematic';
import { ActionImporter } from '@/components/importer/ActionImporter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
export function EditorLayout() {
  return (
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
            <span className="text-xs text-zinc-500 font-mono">v0.1.0-ALPHA</span>
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
    </div>
  );
}