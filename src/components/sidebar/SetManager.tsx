import React, { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Layers, Trash2, Download, FileText, Save, Upload, Settings2, FileCode, RotateCcw, AlertTriangle, Bug, ArrowDownToLine, HelpCircle, Database, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAntiMicroXXML } from '@/utils/antimicroxExporter';
import { saveAs } from 'file-saver';
import { saveFileAs, downloadFile, openTextFile } from '@/utils/fileSystem';
import { toast } from 'sonner';
import { ControllerSettingsModal } from '@/components/modals/ControllerSettingsModal';
import { XmlPreviewModal } from '@/components/modals/XmlPreviewModal';
import { BackupSettingsModal } from '@/components/modals/BackupSettingsModal';
import { RecoveryManualModal } from '@/components/modals/RecoveryManualModal';
import { useHotkeys } from 'react-hotkeys-hook';
import { APP_NAME, APP_VERSION, APP_ID } from '@/utils/projectIdentity';
import { Profile } from '@/types/antimicro';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
export function SetManager() {
  // UI State Hooks (Reactive)
  const profile = useProfileStore(s => s.profile);
  const activeSetId = useProfileStore(s => s.activeSetId);
  // Actions
  const selectSet = useProfileStore(s => s.selectSet);
  const addSet = useProfileStore(s => s.addSet);
  const removeSet = useProfileStore(s => s.removeSet);
  const setImporterOpen = useProfileStore(s => s.setImporterOpen);
  const loadProject = useProfileStore(s => s.loadProject);
  const resetProject = useProfileStore(s => s.resetProject);
  const markSaved = useProfileStore(s => s.markSaved);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isResetAlertOpen, setResetAlertOpen] = useState(false);
  const [isBackupModalOpen, setBackupModalOpen] = useState(false);
  const [isRecoveryModalOpen, setRecoveryModalOpen] = useState(false);
  // Helper to check if profile has any actual mappings
  const isProfileEmpty = (p: Profile): boolean => {
    // Check if any set has any button with any slot assigned
    return !p.sets.some(set => 
      Object.values(set.mappings).some(mapping => 
        mapping.slots.some(slot => 
          slot.actionId || slot.macroId || slot.modeShiftId
        )
      )
    );
  };
  // IMPERATIVE EXPORT HANDLER (Smart Save)
  const handleExportXML = async () => {
    try {
      const { profile: freshProfile, actions: freshActions } = useProfileStore.getState().getSnapshot();
      if (isProfileEmpty(freshProfile)) {
        toast.error("Cannot export empty profile", {
          description: "Please map at least one button before exporting."
        });
        return;
      }
      toast.info("Preparing export...");
      const xml = generateAntiMicroXXML(freshProfile, freshActions);
      const blob = new Blob([xml], { type: 'application/octet-stream' });
      const saved = await saveFileAs(blob, 'profile.amgp');
      if (saved) {
        markSaved(); // Mark as clean
        if (window.electronAPI) {
           toast.success('Profile saved successfully!');
        } else {
           toast.success('Profile exported successfully!', {
             description: "If no file appeared, try 'View XML Code' below."
           });
        }
      } else {
        console.log('Export cancelled or failed silently');
      }
    } catch (error) {
      console.error("Export Error:", error);
      toast.error('Failed to generate profile XML', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
  // DIRECT DOWNLOAD HANDLER (Force Browser Download)
  const handleDirectDownload = async () => {
    try {
      const { profile: freshProfile, actions: freshActions } = useProfileStore.getState().getSnapshot();
      if (isProfileEmpty(freshProfile)) {
        toast.error("Cannot export empty profile", {
          description: "Please map at least one button before exporting."
        });
        return;
      }
      const xml = generateAntiMicroXXML(freshProfile, freshActions);
      const blob = new Blob([xml], { type: 'application/octet-stream' });
      const sizeInBytes = blob.size;
      const sizeDisplay = sizeInBytes > 1024 
        ? `${(sizeInBytes / 1024).toFixed(1)} KB` 
        : `${sizeInBytes} bytes`;
      console.log(`Attempting download. Size: ${sizeDisplay}`);
      const started = await downloadFile(blob, 'profile.amgp');
      if (started) {
        markSaved();
        toast.success(`Download started (${sizeDisplay})`, {
          description: 'Check your browser downloads folder. If nothing appears, use "View XML Code".'
        });
      } else {
        toast.error('Download failed to start', {
            description: 'Please check browser permissions or use "View XML Code" to copy manually.'
        });
      }
    } catch (error) {
      console.error("Download Error:", error);
      toast.error('Failed to generate download');
    }
  };
  const handleSaveProject = () => {
    try {
      const { profile: freshProfile, actions: freshActions } = useProfileStore.getState().getSnapshot();
      const projectData = {
        profile: freshProfile,
        actions: freshActions,
        version: '1.0'
      };
      const json = JSON.stringify(projectData, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'tactical-bind-project.json');
      markSaved();
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project');
    }
  };
  const handleFullStateExport = () => {
    try {
      const snapshot = useProfileStore.getState().getSnapshot();
      const debugData = {
        identity: {
          name: APP_NAME,
          version: APP_VERSION,
          id: APP_ID,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        },
        store: snapshot,
        localStorage: localStorage.getItem('tactical-bind-storage')
      };
      const json = JSON.stringify(debugData, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'tactical-bind-debug-dump.json');
      toast.success('Full state dump exported!');
    } catch (error) {
      console.error("Debug Export Error:", error);
      toast.error('Failed to export debug state');
    }
  };
  // Keyboard Shortcuts
  useHotkeys('ctrl+s, meta+s', (e) => {
    e.preventDefault();
    handleSaveProject();
  }, { enableOnFormTags: true });
  useHotkeys('ctrl+e, meta+e', (e) => {
    e.preventDefault();
    handleExportXML();
  }, { enableOnFormTags: true });
  const handleLoadProject = async () => {
    try {
      const fileData = await openTextFile('.json', 'TacticalBind Project');
      if (!fileData) return; // Canceled
      const data = JSON.parse(fileData.content);
      if (data.profile && data.actions) {
        loadProject(data);
        toast.success(`Project "${fileData.name}" loaded successfully!`);
      } else {
        throw new Error('Invalid project file format');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load project file', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
  const handleResetConfirm = () => {
    resetProject();
    toast.info('Project reset to default state');
    setResetAlertOpen(false);
  };
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
        <div className="p-4 border-b border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Mission Sets
              </h2>
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-amber-500"
                  onClick={() => setSettingsOpen(true)}
                  title="Controller Settings"
              >
                  <Settings2 className="w-4 h-4" />
              </Button>
          </div>
          <Button
            onClick={() => addSet(`Set ${profile.sets.length + 1}`)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Set
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {profile.sets.map((set) => (
              <div
                key={set.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                  activeSetId === set.id
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
                )}
                onClick={() => selectSet(set.id)}
              >
                <span>{set.name}</span>
                {profile.sets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-900/20 hover:text-red-500 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSet(set.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-3">
          <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Project Files</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-zinc-600 hover:text-amber-500"
                  onClick={() => setBackupModalOpen(true)}
                  title="Auto-Backup Settings"
                >
                  <Database className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      onClick={handleSaveProject}
                      title="Save Project (Ctrl+S)"
                  >
                      <Save className="w-3 h-3 mr-2" />
                      Save
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      onClick={handleLoadProject}
                  >
                      <Upload className="w-3 h-3 mr-2" />
                      Load
                  </Button>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-amber-600 hover:text-amber-500 hover:bg-amber-950/30 text-xs h-7"
                  onClick={() => setRecoveryModalOpen(true)}
              >
                  <Wrench className="w-3 h-3 mr-2" />
                  Recovery Manual
              </Button>
              <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-900 hover:text-red-500 hover:bg-red-950/30 text-xs h-7"
                  onClick={() => setResetAlertOpen(true)}
              >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Reset Project
              </Button>
          </div>
          <div className="space-y-2 pt-2 border-t border-zinc-900">
              <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Actions</h3>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-400 hover:text-amber-500 hover:border-amber-500 hover:bg-zinc-900"
                onClick={() => setImporterOpen(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Import Keybinds
              </Button>
              <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        onClick={() => setPreviewOpen(true)}
                    >
                        <FileCode className="w-4 h-4 mr-2" />
                        View XML Code
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help text-zinc-500 hover:text-zinc-300">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Use this if download fails (Manual Export)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={handleExportXML}
                        title="Save As... (Ctrl+E)"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Save As...
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-amber-500 hover:border-amber-500"
                        onClick={handleDirectDownload}
                        title="Force Download"
                    >
                        <ArrowDownToLine className="w-4 h-4 mr-2" />
                        Quick Download
                    </Button>
                  </div>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-zinc-600 hover:text-zinc-400 text-[10px] h-6 mt-2"
                  onClick={handleFullStateExport}
                  title="Dump full project state for debugging"
              >
                  <Bug className="w-3 h-3 mr-1" />
                  Debug Export (Full State)
              </Button>
          </div>
        </div>
        <ControllerSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        <XmlPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setPreviewOpen(false)}
        />
        <BackupSettingsModal
          isOpen={isBackupModalOpen}
          onClose={() => setBackupModalOpen(false)}
        />
        <RecoveryManualModal
          isOpen={isRecoveryModalOpen}
          onClose={() => setRecoveryModalOpen(false)}
        />
        <AlertDialog open={isResetAlertOpen} onOpenChange={setResetAlertOpen}>
          <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                  Reset Project?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                This will wipe all sets, macros, and imported actions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetConfirm} className="bg-red-900 text-red-100 hover:bg-red-800">Yes, Reset Everything</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}