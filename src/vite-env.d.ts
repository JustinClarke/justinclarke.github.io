/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Set to '1' to enable the debug logger (src/utils/debug.ts) for every
  // namespace at build time. Leave empty in production.
  readonly VITE_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
