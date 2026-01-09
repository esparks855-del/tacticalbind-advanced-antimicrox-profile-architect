import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LifeBuoy, FileText, Gamepad2, Download, Zap, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500 text-xl">
            <LifeBuoy className="w-6 h-6" />
            Mission Briefing (User Manual)
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            TacticalBind Operation Manual & Usage Guide
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 mt-4">
          <Tabs defaultValue="safety" className="h-full flex flex-col">
            <TabsList className="bg-zinc-900 border border-zinc-800 w-full justify-start overflow-x-auto">
              <TabsTrigger value="safety" className="gap-2 text-amber-500 data-[state=active]:text-amber-500"><ShieldCheck className="w-4 h-4"/> Data Safety</TabsTrigger>
              <TabsTrigger value="import" className="gap-2"><FileText className="w-4 h-4"/> Import</TabsTrigger>
              <TabsTrigger value="mapping" className="gap-2"><Gamepad2 className="w-4 h-4"/> Mapping</TabsTrigger>
              <TabsTrigger value="layers" className="gap-2"><Layers className="w-4 h-4"/> Layers & Modes</TabsTrigger>
              <TabsTrigger value="macros" className="gap-2"><Zap className="w-4 h-4"/> Macros</TabsTrigger>
              <TabsTrigger value="export" className="gap-2"><Download className="w-4 h-4"/> Export</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-md mt-2 p-6">
              <TabsContent value="safety" className="mt-0 space-y-6">
                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        IMPORTANT: Local-First Architecture
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        TacticalBind is a <strong>Local-First</strong> application. This means:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-400 mt-2 space-y-1">
                        <li>We do <strong>NOT</strong> sync your data to GitHub, Cloudflare, or any external server.</li>
                        <li>Your data lives entirely in your browser's <strong>Local Storage</strong>.</li>
                        <li>If you clear your browser cache or use Incognito mode, your data will be <strong>LOST</strong> unless you export it.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">How to Prevent Data Loss</h3>
                    <div className="grid gap-4">
                        <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                            <h4 className="font-bold text-green-500 text-sm mb-1">1. Use Auto-Backup (Recommended)</h4>
                            <p className="text-xs text-zinc-400">
                                Click the Database icon <span className="inline-block align-middle"><ShieldCheck className="w-3 h-3"/></span> in the sidebar. 
                                Select a file on your hard drive (e.g., <code>backup.json</code>). 
                                The app will automatically save your work to this file every time you make a change.
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                            <h4 className="font-bold text-blue-500 text-sm mb-1">2. Export Frequently</h4>
                            <p className="text-xs text-zinc-400">
                                Use the <strong>"Save Project"</strong> button (Ctrl+S) often. This creates a <code>.json</code> file that contains your entire setup (sets, macros, actions).
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                            <h4 className="font-bold text-amber-500 text-sm mb-1">3. Closing the App</h4>
                            <p className="text-xs text-zinc-400">
                                You can safely close the tab if you see the green "Saved" indicator in the top bar. 
                                If you see an amber "Unsaved Changes" warning, please export your work first.
                            </p>
                        </div>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="import" className="mt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">Importing Keybinds</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                    You can import a list of actions and their corresponding keys from a text file. 
                    This populates your "Action Library" which you can then drag onto the controller.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                        <h4 className="text-xs font-bold text-amber-500 uppercase mb-2">Supported Formats</h4>
                        <pre className="text-xs font-mono text-zinc-300 space-y-1">
                            <span>ActionName = Key</span>
                            <span>ActionName : Key</span>
                            <span>ActionName -{'>'} Key</span>
                            <span>ActionName [TAB] Key</span>
                        </pre>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                        <h4 className="text-xs font-bold text-green-500 uppercase mb-2">Example File</h4>
                        <pre className="text-xs font-mono text-zinc-500">
                            # Infantry Controls<br/>
                            Reload = R<br/>
                            Fire = Mouse1<br/>
                            Jump = Space<br/>
                            <br/>
                            # Vehicle Controls<br/>
                            Boost : Left Shift<br/>
                            Eject : J
                        </pre>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="mapping" className="mt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">Controller Configuration</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                    Click any button on the interactive controller schematic to open the <strong>Inspector Panel</strong> on the right.
                    </p>
                </div>
                <div className="grid gap-4">
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex gap-4">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">1</div>
                        <div>
                            <h4 className="font-bold text-zinc-300 text-sm">Tap (Standard)</h4>
                            <p className="text-xs text-zinc-500 mt-1">Triggers when pressed normally. Drag actions here for standard behavior.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex gap-4">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">2</div>
                        <div>
                            <h4 className="font-bold text-zinc-300 text-sm">Hold (Long Press)</h4>
                            <p className="text-xs text-zinc-500 mt-1">Triggers when held down. Useful for secondary actions or Layer Shifts.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex gap-4">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">3</div>
                        <div>
                            <h4 className="font-bold text-zinc-300 text-sm">Double Tap</h4>
                            <p className="text-xs text-zinc-500 mt-1">Triggers on quick double press.</p>
                        </div>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="layers" className="mt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">Mode Shifting & Layers</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                    Change what every button does by switching "Sets". This is essential for complex games with multiple modes (Infantry vs Vehicle).
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                        <h4 className="font-bold text-amber-500 text-sm">Method A: Toggle (Tap to Switch)</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                            Configure this in the <strong>Tap</strong> tab. Pressing the button once will permanently switch to the new Set.
                            <br/><em>Use case: Entering a vehicle.</em>
                        </p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                        <h4 className="font-bold text-blue-500 text-sm">Method B: Layer Shift (Hold to Shift)</h4>
                        <p className="text-xs text-zinc-400 mt-1">
                            Configure this in the <strong>Hold</strong> tab. The new Set is active ONLY while you hold the button.
                            <br/><em>Use case: Holding a paddle to access extra commands.</em>
                        </p>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="macros" className="mt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">Creating Macros</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                    Macros execute a sequence of events with a single press.
                    </p>
                </div>
                <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-2 bg-zinc-950 p-4 rounded border border-zinc-800">
                    <li>Click the <strong>Macros</strong> tab in the bottom right panel.</li>
                    <li>Click <strong>Create New Macro</strong>.</li>
                    <li>Add steps: <strong>Key Press</strong>, <strong>Delay</strong>, or <strong>Mouse</strong>.</li>
                    <li><strong>Important:</strong> Add Delays (e.g., 50ms) between keys if the game ignores them.</li>
                    <li>Save and Drag the macro to a button slot.</li>
                </ol>
              </TabsContent>
              <TabsContent value="export" className="mt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">Exporting to AntiMicroX</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                    Once your profile is complete, click the <strong>Export</strong> button in the left sidebar.
                    </p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Steps</h4>
                    <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-2">
                        <li>Click "Export" to download the <code>.amgp</code> (XML) file.</li>
                        <li>Open <strong>AntiMicroX</strong> on your PC.</li>
                        <li>Click "Load" in AntiMicroX and select the downloaded file.</li>
                        <li>Your controller is now mapped!</li>
                    </ol>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Dismiss Briefing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}