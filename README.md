# Noir Denizen Config

Client-side editor for the *Caught in the Rain* noir denizen tables: edit the
Suspect / Truth / Motive lists, tick their eligibility matrices against
Location / Treachery / Object, and roll a scene table in Standard (playing-card)
or Tarot (Major Arcana) mode.

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run test     # unit + smoke tests (vitest)
```

## Layout

- `src/data/` — shipped defaults and baseline eligibility, loaded through `loadDefaults.ts`
- `src/lib/` — pure draw logic (`draw.ts`, `shuffle.ts`) and key/storage helpers
- `src/hooks/` — `useConfigStore` (the save file, `noir-config-v1`) and `usePreferences` (`noir-prefs-v1`)
- `src/components/` — one component per file, split by area (layout, lists, matrix, generator, common, ui)
