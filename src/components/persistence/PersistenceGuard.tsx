import React, { useEffect, useRef } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
export function PersistenceGuard() {
  const isDirty = useProfileStore(s => s.isDirty);
  const backupHandle = useProfileStore(s => s.backupHandle);
  const profile = useProfileStore(s => s.profile);
  const actions = useProfileStore(s => s.actions);
  const markSaved = useProfileStore(s => s.markSaved);
  // Ref to track if we are currently saving to avoid overlap
  const isSavingRef = useRef(false);
  // Ref to debounce auto-backup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 1. BeforeUnload Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Legacy requirement for Chrome
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  // 2. Auto-Backup to Disk (if handle exists)
  useEffect(() => {
    if (!backupHandle) return;
    // Debounce save to avoid thrashing disk on every slider move
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      try {
        isSavingRef.current = true;
        const projectData = {
          profile,
          actions,
          version: '1.0',
          timestamp: new Date().toISOString()
        };
        const json = JSON.stringify(projectData, null, 2);
        const writable = await backupHandle.createWritable();
        await writable.write(json);
        await writable.close();
        // We don't necessarily markSaved() here because "Saved" usually implies the user's explicit export action,
        // but for "Auto-Backup" it technically IS saved. 
        // Let's mark it saved to give user peace of mind that their data is safe.
        markSaved();
        // Optional: Toast might be too spammy, maybe just a console log or subtle indicator
        console.log('Auto-backup successful');
      } catch (error) {
        console.error('Auto-backup failed:', error);
        toast.error('Auto-backup failed', {
          description: 'Check console for details. You may need to re-select the backup file.'
        });
      } finally {
        isSavingRef.current = false;
      }
    }, 2000); // 2 second debounce
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [profile, actions, backupHandle, markSaved]);
  return null; // Logic only component
}