import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PACKAGE_JSON_CONTENT, MAIN_JS_CONTENT, PRELOAD_JS_CONTENT } from '@/utils/recoveryManual';
import { Copy, Check, AlertTriangle, FileJson, FileCode, Terminal } from 'lucide-react';
import { toast } from 'sonner';
interface RecoveryManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function RecoveryManualModal({ isOpen, onClose }: RecoveryManualModalProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const handleCopy = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileName);
      toast.success(`${fileName} copied to clipboard`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy to clipboard");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500 text-xl">
            <AlertTriangle className="w-6 h-6" />
            Project Recovery Manual
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Use this guide to restore the project configuration after exporting to your local machine.
            The cloud environment may revert these files to defaults, breaking the Electron build.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 mt-2 flex flex-col">
          <div className="bg-amber-900/20 border border-amber-900/50 p-4 rounded-md mb-4 shrink-0">
            <h3 className="font-bold text-amber-400 text-sm mb-2">Why do I need this?</h3>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              When you export this project, the platform resets <code>package.json</code> and other config files to a generic template.
              To build the Desktop App (EXE), you <strong>MUST</strong> manually update the files below on your computer.
            </p>
          </div>
          <Tabs defaultValue="package" className="flex-1 flex flex-col min-h-0">
            <TabsList className="bg-zinc-900 border border-zinc-800 w-full justify-start">
              <TabsTrigger value="package" className="gap-2"><FileJson className="w-4 h-4"/> package.json</TabsTrigger>
              <TabsTrigger value="main" className="gap-2"><FileCode className="w-4 h-4"/> main.js</TabsTrigger>
              <TabsTrigger value="preload" className="gap-2"><Terminal className="w-4 h-4"/> preload.js</TabsTrigger>
            </TabsList>
            <div className="flex-1 min-h-0 mt-2 relative border border-zinc-800 rounded-md bg-zinc-900/50 group overflow-hidden">
              <TabsContent value="package" className="h-full mt-0">
                <CodeViewer 
                  content={PACKAGE_JSON_CONTENT} 
                  fileName="package.json" 
                  copied={copiedFile === "package.json"} 
                  onCopy={() => handleCopy(PACKAGE_JSON_CONTENT, "package.json")} 
                />
              </TabsContent>
              <TabsContent value="main" className="h-full mt-0">
                <CodeViewer 
                  content={MAIN_JS_CONTENT} 
                  fileName="main.js" 
                  copied={copiedFile === "main.js"} 
                  onCopy={() => handleCopy(MAIN_JS_CONTENT, "main.js")} 
                />
              </TabsContent>
              <TabsContent value="preload" className="h-full mt-0">
                <CodeViewer 
                  content={PRELOAD_JS_CONTENT} 
                  fileName="preload.js" 
                  copied={copiedFile === "preload.js"} 
                  onCopy={() => handleCopy(PRELOAD_JS_CONTENT, "preload.js")} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Close Manual
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function CodeViewer({ content, fileName, copied, onCopy }: { content: string, fileName: string, copied: boolean, onCopy: () => void }) {
  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-2 right-4 z-10">
        <Button
          size="sm"
          variant="secondary"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shadow-lg border border-zinc-700"
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all pb-10">
          {content}
        </pre>
      </ScrollArea>
    </div>
  );
}