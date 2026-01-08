import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProfileStore } from '@/store/profileStore';
import { parseKeybinds } from '@/utils/parser';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
export function ActionImporter() {
  const isOpen = useProfileStore(s => s.isImporterOpen);
  const setOpen = useProfileStore(s => s.setImporterOpen);
  const loadActions = useProfileStore(s => s.loadActions);
  const [text, setText] = useState('');
  const handleImport = () => {
    try {
      const actions = parseKeybinds(text);
      if (actions.length === 0) {
        toast.error('No valid actions found', {
          description: 'Ensure format is "Action = Key" per line.'
        });
        return;
      }
      loadActions(actions);
      toast.success(`Imported ${actions.length} actions`);
      setOpen(false);
      setText('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse actions');
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Import Keybinds
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Paste your keybinding configuration below or upload a text file.
            Format: <code className="bg-zinc-900 px-1 rounded text-xs">ActionName = Key</code>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full border-dashed border-zinc-700 hover:border-amber-500 hover:bg-zinc-900 text-zinc-400 hover:text-amber-500 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload .txt File
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              accept=".txt,.ini,.cfg" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Reload = R&#10;Fire = Mouse1&#10;Jump = Space"
            className="h-[300px] font-mono text-sm bg-zinc-900 border-zinc-800 focus:border-amber-500 text-zinc-300 resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-100">
            Cancel
          </Button>
          <Button onClick={handleImport} className="bg-amber-600 hover:bg-amber-700 text-white font-medium">
            Import Actions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}