import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileStore } from '@/store/profileStore';
import { parseKeybinds } from '@/utils/parser';
import { Upload, FileText, ArrowRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Action } from '@/types/antimicro';
import { openTextFile } from '@/utils/fileSystem';
export function ActionImporter() {
  const isOpen = useProfileStore(s => s.isImporterOpen);
  const setOpen = useProfileStore(s => s.setImporterOpen);
  const loadActions = useProfileStore(s => s.loadActions);
  const existingActions = useProfileStore(s => s.actions);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [text, setText] = useState('');
  const [parsedActions, setParsedActions] = useState<Action[]>([]);
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setText('');
      setParsedActions([]);
    }
  }, [isOpen]);
  const handleParse = () => {
    try {
      const actions = parseKeybinds(text);
      if (actions.length === 0) {
        toast.error('No valid actions detected', {
          description: 'Check your format. Expected: Action = Key'
        });
        return;
      }
      setParsedActions(actions);
      setStep('preview');
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse actions');
    }
  };
  const handleConfirmImport = () => {
    loadActions(parsedActions);
    toast.success(`Successfully imported ${parsedActions.length} actions`);
    setOpen(false);
  };
  const handleFileUpload = async () => {
    try {
      const fileData = await openTextFile('.txt,.ini,.cfg', 'Config Files');
      if (fileData) {
        setText(fileData.content);
        toast.success(`Loaded ${fileData.name}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to read file');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-100 transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {step === 'input' ? 'Import Keybinds' : 'Verify Intel'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {step === 'input'
              ? 'Paste your configuration or upload a file to begin parsing.'
              : `Review the ${parsedActions.length} detected actions before importing.`}
          </DialogDescription>
        </DialogHeader>
        {step === 'input' ? (
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full border-dashed border-zinc-700 hover:border-amber-500 hover:bg-zinc-900 text-zinc-400 hover:text-amber-500 transition-colors"
                onClick={handleFileUpload}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload .txt / .ini File
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Reload = R&#10;Fire = Mouse1&#10;Jump : Space"
                className="h-[300px] font-mono text-sm bg-zinc-900 border-zinc-800 focus:border-amber-500 text-zinc-300 resize-none p-4"
              />
              {text.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-600 text-xs pointer-events-none text-center">
                  Supported separators:<br/>
                  = &nbsp; : &nbsp; -{'>'} &nbsp; [TAB]
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-2 gap-4 p-2 bg-zinc-950 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <div className="pl-2">Action Name</div>
                <div>Mapped Key</div>
              </div>
              <ScrollArea className="h-[250px]">
                <div className="divide-y divide-zinc-800/50">
                  {parsedActions.map((action, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4 p-2 text-sm hover:bg-zinc-800/30 transition-colors">
                      <div className="pl-2 font-medium text-zinc-200 truncate" title={action.name}>{action.name}</div>
                      <div className="font-mono text-amber-500 truncate" title={action.defaultKey}>{action.defaultKey}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded border border-zinc-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-zinc-400">
                  {existingActions.length > 0
                    ? `Will be added to ${existingActions.length} existing actions.`
                    : 'Ready to populate Action Library.'}
                </span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          {step === 'input' ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                Cancel
              </Button>
              <Button onClick={handleParse} disabled={!text.trim()} className="bg-amber-600 hover:bg-amber-700 text-white font-medium">
                Preview Parse <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep('input')} className="text-zinc-400 hover:text-zinc-100">
                <RefreshCw className="w-4 h-4 mr-2" /> Back to Edit
              </Button>
              <Button onClick={handleConfirmImport} className="bg-green-600 hover:bg-green-700 text-white font-medium">
                Confirm Import <Check className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}