declare module 'vite-plugin-pwa' {
    import { Plugin } from 'vite';
  
    export interface VitePWAOptions {
      /* Custom options for PWA */
      registerType?: 'prompt' | 'autoUpdate';
      injectRegister?: 'script' | 'inline' | 'auto';
      strategies?: 'generateSW' | 'injectManifest';
      srcDir?: string;
      filename?: string;
      manifest?: Partial<Record<string, any>>;
    }
  
    export function VitePWA(options?: VitePWAOptions): Plugin;
  }
  