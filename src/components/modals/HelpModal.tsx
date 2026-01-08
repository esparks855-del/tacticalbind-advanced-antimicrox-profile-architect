import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LifeBuoy, FileText, Gamepad2, Download, Terminal } from 'lucide-react';
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500 text-xl">
            <LifeBuoy className="w-6 h-6" />
            Mission Briefing
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            TacticalBind Operation Manual & Usage Guide
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 mt-4">
          <Tabs defaultValue="import" className="h-full flex flex-col">
            <TabsList className="bg-zinc-900 border border-zinc-800 w-full justify-start">
              <TabsTrigger value="import" className="gap-2"><FileText className="w-4 h-4"/> Import Intel</TabsTrigger>
              <TabsTrigger value="mapping" className="gap-2"><Gamepad2 className="w-4 h-4"/> Mapping</TabsTrigger>
              <TabsTrigger value="export" className="gap-2"><Download className="w-4 h-4"/> Export & Deploy</TabsTrigger>
              <TabsTrigger value="electron" className="gap-2"><Terminal className="w-4 h-4"/> Local App</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-md mt-2 p-4">
              <TabsContent value="import" className="mt-0 space-y-4">
                <h3 className="text-lg font-bold text-zinc-200">Importing Keybinds</h3>
                <p className="text-sm text-zinc-400">
                  You can import a list of actions and their corresponding keys from a text file. 
                  This populates your "Action Library" which you can then drag onto the controller.
                </p>
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
              </TabsContent>
              <TabsContent value="mapping" className="mt-0 space-y-4">
                <h3 className="text-lg font-bold text-zinc-200">Controller Configuration</h3>
                <p className="text-sm text-zinc-400">
                  Click any button on the interactive controller schematic to open the <strong>Inspector Panel</strong> on the right.
                </p>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                  <li><strong>Tap:</strong> Standard short press action.</li>
                  <li><strong>Hold:</strong> Action triggers when button is held down. Can also trigger a <strong>Mode Shift</strong> (Layer change).</li>
                  <li><strong>Double Tap:</strong> Action triggers on quick double press.</li>
                  <li><strong>Release:</strong> Action triggers when button is released.</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded text-sm text-amber-200">
                  <strong>Pro Tip:</strong> You can drag and drop Actions or Macros directly from the library onto the slots in the Inspector Panel.
                </div>
              </TabsContent>
              <TabsContent value="export" className="mt-0 space-y-4">
                <h3 className="text-lg font-bold text-zinc-200">Exporting to AntiMicroX</h3>
                <p className="text-sm text-zinc-400">
                  Once your profile is complete, click the <strong>Export</strong> button in the left sidebar.
                </p>
                <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-2">
                  <li>Click "Export" to download the <code>.amgp</code> (XML) file.</li>
                  <li>Open <strong>AntiMicroX</strong> on your PC.</li>
                  <li>Click "Load" in AntiMicroX and select the downloaded file.</li>
                  <li>Your controller is now mapped!</li>
                </ol>
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded text-sm text-blue-200">
                  <strong>Validation:</strong> Use the "View XML" button (code icon) to preview the raw XML before downloading if you want to verify the structure.
                </div>
              </TabsContent>
              <TabsContent value="electron" className="mt-0 space-y-4">
                <h3 className="text-lg font-bold text-zinc-200">Local Application Ready</h3>
                <p className="text-sm text-zinc-400">
                  This application is built with a "Local-First" architecture.
                </p>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                  <li><strong>No Cloud Dependencies:</strong> All parsing and generation happens in your browser.</li>
                  <li><strong>Electron Compatible:</strong> This project can be packaged into a standalone Windows <code>.exe</code> using Electron.</li>
                  <li><strong>Privacy:</strong> Your keybind files and profiles never leave your machine.</li>
                </ul>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}