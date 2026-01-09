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
  }
}