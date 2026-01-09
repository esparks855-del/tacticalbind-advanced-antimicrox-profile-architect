export {};
declare global {
  interface Window {
    process?: {
      type?: string;
      versions?: {
        electron?: string;
        [key: string]: string | undefined;
      };
    };
    // Native Electron API Bridge
    electronAPI?: {
      saveFile: (content: string, filename: string) => Promise<{ success: boolean; canceled?: boolean; error?: string }>;
    };
    // File System Access API
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }
  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
  }
  interface FileSystemFileHandle {
    kind: 'file' | 'directory';
    name: string;
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  }
  interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
  }
  interface FileSystemWritableFileStream extends WritableStream {
    write(data: BufferSource | Blob | string): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
  }
}