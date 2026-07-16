/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clé API Ticketmaster Discovery (fichier .env, variable VITE_TICKETMASTER_KEY) */
  readonly VITE_TICKETMASTER_KEY?: string
  /** Clé API OpenAgenda — événements culturels français (fichier .env) */
  readonly VITE_OPENAGENDA_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
