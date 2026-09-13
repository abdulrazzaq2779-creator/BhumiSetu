/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** MapTiler API key for the Risk Map basemap (optional — falls back to OSM tiles). */
  readonly VITE_MAPTILER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
