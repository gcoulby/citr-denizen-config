export type Axis = 'location' | 'treachery' | 'object'

export type RoleAxis = 'suspects' | 'means' | 'motives'

export type Theme = 'noir' | 'fantasy' | 'horror' | 'scifi'

export const THEMES: readonly Theme[] = ['noir', 'fantasy', 'horror', 'scifi']

export const THEME_LABELS: Record<Theme, string> = {
  noir: 'Noir',
  fantasy: 'Fantasy',
  horror: 'Horror',
  scifi: 'Sci-fi',
}

// Static, shipped content for one theme: the per-theme axes.
export interface ThemeContent {
  suspects: string[]
  locations: string[]
  objects: string[]
}

// Static, shipped baseline eligibility for one theme.
export interface ThemeBaselines {
  suspectLocation: EligibilityMap
  // Only Noir ships a motive→object baseline for now; the others resolve to null.
  motiveObject: EligibilityMap | null
}

// Eligibility matrix: role name -> set of eligible context values.
// Stored as string[] (not Set) for JSON-friendliness; convert to Set at
// point of use if a hot path needs O(1) lookups.
export type EligibilityMap = Record<string, string[]>

// The theme-scoped slice of the save file.
export interface ThemeConfig {
  suspects: string[]
  locationMap: EligibilityMap // suspect -> locations, this theme
  objectMap: EligibilityMap // motive (shared) -> objects, this theme
}

// The whole save file: shared lists plus every theme's scoped data.
export interface Config {
  means: string[] // shared across all themes
  motives: string[] // shared across all themes
  treacheries: string[] // shared across all themes
  treacheryMap: EligibilityMap // means (shared) -> treachery (shared)
  themes: Record<Theme, ThemeConfig>
}

// A single theme flattened with the shared lists — the shape the draw
// logic and matrices consume.
export interface ResolvedConfig {
  suspects: string[]
  means: string[]
  motives: string[]
  locations: string[]
  treacheries: string[]
  objects: string[]
  locationMap: EligibilityMap
  treacheryMap: EligibilityMap
  objectMap: EligibilityMap
}

export type CardMode = 'standard' | 'tarot'

export interface Suit {
  name: string
  symbol: string
  red: boolean
}

export interface ArcanaGroups {
  suspect: string[] // 7 names, I–VII
  means: string[] // 7 names, VIII–XIV
  motive: string[] // 7 names, XV–XXI
}

export interface DrawResult {
  values: string[]
  fellBack: boolean
}

export interface GeneratedTable {
  location: string
  object: string
  treachery: string
  mode: CardMode
  suspects: DrawResult
  means: DrawResult
  motives: DrawResult
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
