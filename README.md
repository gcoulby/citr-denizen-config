# Caught in the Rain — Denizen Config

Client-side editor for the *Caught in the Rain* denizen tables across all four
themes (**Noir, Fantasy, Horror, Sci-fi**): edit the Suspect / Truth / Motive /
Treachery lists, tick their eligibility matrices against Location / Treachery /
Object, and roll a scene table in Standard (playing-card) or Tarot (Major
Arcana) mode.

## Scripts

This project uses **pnpm** (no npm/yarn).

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # type-check + production build to dist/
pnpm test       # unit + smoke tests (vitest)
```

## Theme model

Per the source book's "Choosing tables" split:

- **Per-theme:** Suspects, Locations, Objects, and the `suspect-location` /
  `motive-object` baseline maps.
- **Shared across all themes:** Truths, Motives, Treacheries, and the
  `truth-treachery` baseline map (both of its axes are shared).

Switching the global theme selector repopulates the Suspects list, the two
per-theme matrices, and the Generator's Location / Object dropdowns; the shared
lists and the Truth × Treachery matrix are unaffected.

Fantasy / Horror / Sci-fi do not yet ship a `motive-object` baseline, so
Autofill leaves their Motive × Object grid untouched and says so.

## Layout

- `src/data/shared/` — shared lists + arcana
- `src/data/baselines/` — shared `truth-treachery.json` and one folder per theme
  (`suspects`, `locations`, `objects`, `suspect-location`, and — Noir only —
  `motive-object`), loaded through `loadDefaults.ts`
- `src/lib/` — pure draw logic (`draw.ts`, `shuffle.ts`), `resolveConfig.ts`, key/storage helpers
- `src/hooks/` — `useConfigStore` (the save file, `citr-config-v1`) and `usePreferences` (`noir-prefs-v1`)
- `src/components/` — one component per file, split by area (layout, lists, matrix, generator, common, ui)
