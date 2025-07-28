// Type definitions for vite-plugin-node-polyfills
// Project: https://github.com/sodatea/vite-plugin-node-polyfills

declare module 'vite-plugin-node-polyfills' {
  import { Plugin } from 'vite';

  export interface NodePolyfillsOptions {
    /**
     * Whether to polyfill `node:` protocol imports.
     * @default true
     */
    protocolImports?: boolean;
    
    /**
     * Whether to polyfill Node.js globals like `process` and `Buffer`.
     * @default true
     */
    globals?: boolean;
    
    /**
     * Whether to include polyfills for Node.js built-in modules.
     * @default {}
     */
    include?: {
      fs?: boolean;
      path?: boolean;
      util?: boolean;
      buffer?: boolean;
      process?: boolean;
      os?: boolean;
      crypto?: boolean;
      stream?: boolean;
      http?: boolean;
      https?: boolean;
      zlib?: boolean;
      querystring?: boolean;
      url?: boolean;
      string_decoder?: boolean;
      timers?: boolean;
      child_process?: boolean;
      vm?: boolean;
      tty?: boolean;
      net?: boolean;
      dns?: boolean;
      readline?: boolean;
      events?: boolean;
      [key: string]: boolean | undefined;
    };
    
    /**
     * Whether to exclude specific polyfills.
     * @default {}
     */
    exclude?: {
      [key: string]: boolean;
    };
    
    /**
     * Whether to use the Node.js version of the module.
     * @default false
     */
    preferNode?: boolean;
    
    /**
     * Whether to use the browser version of the module.
     * @default false
     */
    preferBrowser?: boolean;
  }

  /**
   * A Vite plugin that polyfills Node.js built-in modules for the browser.
   */
  export default function nodePolyfills(options?: NodePolyfillsOptions): Plugin;
}
