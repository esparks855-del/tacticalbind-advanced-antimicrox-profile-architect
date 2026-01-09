import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileStore } from '@/store/profileStore';
import { generateAntiMicroXXML } from '@/utils/antimicroxExporter';
import { FileCode, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
interface XmlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function XmlPreviewModal({ isOpen, onClose }: XmlPreviewModalProps) {
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const [xmlContent, setXmlContent] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (isOpen) {
      try {
        const xml = generateAntiMicroXXML(profile, actions);
        setXmlContent(xml);
      } catch (e) {
        console.error("Failed to generate XML preview", e);
        setXmlContent("Error generating XML preview.");
      }
    }
  }, [isOpen, profile, actions]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      toast.success("XML copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy to clipboard", {
        description: "Your browser might be blocking clipboard access. Please copy manually."
      });
    }
  };
  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    saveAs(blob, 'profile.amgp');
    toast.success('Profile exported successfully!');
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-400">
            <FileCode className="w-5 h-5" />
            XML Source Preview
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Verify the generated AntiMicroX XML syntax before exporting.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 border border-zinc-800 rounded-md bg-zinc-900/50 relative group">
          <ScrollArea className="h-full p-4">
            <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all">
              {xmlContent}
            </pre>
          </ScrollArea>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
            Close
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download .amgp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}