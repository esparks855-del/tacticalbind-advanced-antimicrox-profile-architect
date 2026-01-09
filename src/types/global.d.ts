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
      openFile: (filters: FileFilter[]) => Promise<{ canceled: boolean; content?: string; filename?: string; error?: string }>;
    };
    // File System Access API
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
  }
  interface FileFilter {
    name: string;
    extensions: string[];
  }
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }
  interface OpenFilePickerOptions {
    multiple?: boolean;
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
    getFile(): Promise<File>;
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