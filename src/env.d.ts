/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;

  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_AUTH_URL: string;

  readonly VUE_APP_I18N_LOCALE: string;
  readonly VUE_APP_I18N_FALLBACK_LOCALE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
