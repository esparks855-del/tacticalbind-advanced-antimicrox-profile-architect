import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/profileStore';
import { Database, FolderOpen, CheckCircle2, AlertTriangle, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
interface BackupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function BackupSettingsModal({ isOpen, onClose }: BackupSettingsModalProps) {
  const backupHandle = useProfileStore(s => s.backupHandle);
  const setBackupHandle = useProfileStore(s => s.setBackupHandle);
  const [isSelecting, setIsSelecting] = useState(false);
  const handleSelectFile = async () => {
    if (!window.showSaveFilePicker) {
      toast.error('Browser Not Supported', {
        description: 'Your browser does not support the File System Access API. Please use Chrome, Edge, or Opera.'
      });
      return;
    }
    try {
      setIsSelecting(true);
      const handle = await window.showSaveFilePicker({
        suggestedName: 'tactical-bind-backup.json',
        types: [{
          description: 'JSON Project File',
          accept: { 'application/json': ['.json'] },
        }],
      });
      setBackupHandle(handle);
      toast.success('Auto-Backup Enabled', {
        description: `Saving to ${handle.name}`
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Failed to select backup file:', error);
        toast.error('Failed to select file');
      }
    } finally {
      setIsSelecting(false);
    }
  };
  const handleDisable = () => {
    setBackupHandle(null);
    toast.info('Auto-Backup Disabled');
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Database className="w-5 h-5" />
            Auto-Backup Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure real-time local backups to prevent data loss.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${backupHandle ? 'bg-green-900/20 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-zinc-200">Local File Backup</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Automatically write your project state to a file on your hard drive whenever you make changes.
                </p>
                {backupHandle ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-400 bg-green-900/10 px-3 py-2 rounded border border-green-900/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate">Active: {backupHandle.name}</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-500/80 bg-amber-900/10 px-3 py-2 rounded border border-amber-900/30">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Not Configured</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              {backupHandle && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDisable}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  Disable Backup
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectFile}
                disabled={isSelecting}
                className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                {backupHandle ? 'Change File' : 'Select Backup File'}
              </Button>
            </div>
          </div>
          <div className="text-xs text-zinc-500 bg-zinc-900 p-3 rounded border border-zinc-800">
            <strong>Note:</strong> This feature uses the File System Access API. It works best in Chrome, Edge, and Opera. 
            If you reload the page, you may need to re-select the file due to browser security permissions.
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}