declare module 'vite-plugin-node-polyfills' {
  import { PluginOption } from 'vite';
  
  interface Options {
    // Add any options you might be using from the plugin
    protocolImports?: boolean;
    globals?: boolean;
    // Add other options as needed
  }
  
  export default function nodePolyfills(options?: Options): PluginOption;
}
