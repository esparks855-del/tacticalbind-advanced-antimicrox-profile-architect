import React, { useRef } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Layers, Trash2, Download, FileText, Save, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAntiMicroXXML } from '@/utils/antimicroxExporter';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
export function SetManager() {
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const activeSetId = useProfileStore(s => s.activeSetId);
  const selectSet = useProfileStore(s => s.selectSet);
  const addSet = useProfileStore(s => s.addSet);
  const removeSet = useProfileStore(s => s.removeSet);
  const setImporterOpen = useProfileStore(s => s.setImporterOpen);
  const loadProject = useProfileStore(s => s.loadProject);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleExportXML = () => {
    try {
      const xml = generateAntiMicroXXML(profile, actions);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      saveAs(blob, 'profile.amgp');
      toast.success('Profile exported successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate profile XML');
    }
  };
  const handleSaveProject = () => {
    try {
      const projectData = {
        profile,
        actions,
        version: '1.0'
      };
      const json = JSON.stringify(projectData, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'tactical-bind-project.json');
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project');
    }
  };
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.profile && data.actions) {
          loadProject(data);
          toast.success('Project loaded successfully!');
        } else {
          throw new Error('Invalid project file format');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load project file');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Mission Sets
        </h2>
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
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Project Files</h3>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    onClick={handleSaveProject}
                >
                    <Save className="w-3 h-3 mr-2" />
                    Save
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-3 h-3 mr-2" />
                    Load
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleLoadProject}
                />
            </div>
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
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleExportXML}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Profile
            </Button>
        </div>
      </div>
    </div>
  );
}