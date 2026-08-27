import { afterEach, expect, it } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'

import { useConfigStore, type UseConfigStore } from '@/hooks/useConfigStore'
import type { Theme } from '@/types'

afterEach(() => {
  window.localStorage.clear()
  document.body.innerHTML = ''
})

function mount(theme: Theme) {
  const ref: { current: UseConfigStore | null } = { current: null }
  function Probe() {
    ref.current = useConfigStore(theme)
    return null
  }
  const container = document.createElement('div')
  const root = createRoot(container)
  act(() => root.render(<Probe />))
  return {
    get store() {
      if (!ref.current) throw new Error('not mounted')
      return ref.current
    },
    run(fn: (store: UseConfigStore) => void) {
      act(() => fn(this.store))
    },
    unmount: () => act(() => root.unmount()),
  }
}

it('renaming a suspect only migrates the active theme location map', () => {
  const harness = mount('noir')
  harness.run((s) => s.renameRole('suspects', 'CEO', 'Chairman'))
  expect(harness.store.config.themes.noir.suspects).toContain('Chairman')
  expect(harness.store.config.themes.noir.locationMap.Chairman).toBeDefined()
  expect(harness.store.config.themes.noir.locationMap.CEO).toBeUndefined()
  expect(harness.store.config.themes.fantasy.suspects).not.toContain('Chairman')
  harness.unmount()
})

it('renaming a shared motive migrates every theme object map', () => {
  const harness = mount('noir')
  harness.run((s) => s.renameRole('motives', 'Greed', 'Avarice'))
  expect(harness.store.config.motives).toContain('Avarice')
  expect(harness.store.config.themes.noir.objectMap.Avarice).toBeDefined()
  expect(harness.store.config.themes.noir.objectMap.Greed).toBeUndefined()
  harness.unmount()
})

it('autofill reports the missing motive-object baseline for non-noir themes', () => {
  const harness = mount('fantasy')
  let skipped = false
  harness.run((s) => {
    skipped = s.autofillFromBaseline().motiveObjectSkipped
  })
  expect(skipped).toBe(true)
  harness.unmount()
})
