/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SRC?: string;
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
