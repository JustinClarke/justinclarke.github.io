/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SRC?: string;
  readonly VITE_WEB3FORMS_KEY?: string;
  // Set to '1' to enable the debug logger (src/utils/debug.ts) for every
  // namespace at build time. Leave empty in production.
  readonly VITE_DEBUG?: string;
  readonly VITE_AI_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
