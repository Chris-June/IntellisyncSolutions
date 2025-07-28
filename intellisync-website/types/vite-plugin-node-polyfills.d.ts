// Minimal type declaration for vite-plugin-node-polyfills
declare module 'vite-plugin-node-polyfills' {
  import { Plugin } from 'vite';
  
  interface Options {
    protocolImports?: boolean;
    globals?: boolean;
  }
  
  export default function nodePolyfills(options?: Options): Plugin;
}
