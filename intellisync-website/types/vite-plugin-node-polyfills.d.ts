// Minimal type declaration for vite-plugin-node-polyfills
declare module 'vite-plugin-node-polyfills' {
  import { Plugin } from 'vite';

  interface Options {
    include?: string[];
    exclude?: string[];
    globals?: {
      Buffer?: boolean;
      global?: boolean;
      process?: boolean;
    };
    protocolImports?: boolean;
  }

  export function nodePolyfills(options?: Options): Plugin;
}
