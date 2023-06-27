/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly RENDERER_VITE_API_URL: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
