/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // add other envs if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
