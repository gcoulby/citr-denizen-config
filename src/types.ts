export type Axis = 'location' | 'treachery' | 'object'

export type RoleAxis = 'suspects' | 'truths' | 'motives'

export interface RoleLists {
  suspects: string[]
  truths: string[]
  motives: string[]
}

export interface ContextLists {
  locations: string[]
  treacheries: string[]
  objects: string[]
}

// Eligibility matrix: role name -> set of eligible context values.
// Stored as string[] (not Set) for JSON-friendliness; convert to Set at
// point of use if a hot path needs O(1) lookups.
export type EligibilityMap = Record<string, string[]>

export interface Config {
  suspects: string[]
  truths: string[]
  motives: string[]
  locationMap: EligibilityMap // suspect -> locations
  treacheryMap: EligibilityMap // truth -> treacheries
  objectMap: EligibilityMap // motive -> objects
}

export type CardMode = 'standard' | 'tarot'

export interface Suit {
  name: string
  symbol: string
  red: boolean
}

export interface ArcanaGroups {
  suspect: string[] // 7 names, I–VII
  truth: string[] // 7 names, VIII–XIV
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
  truths: DrawResult
  motives: DrawResult
}

export interface Baselines {
  location: EligibilityMap
  treachery: EligibilityMap
  object: EligibilityMap
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
