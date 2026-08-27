import { useEffect, useState } from 'react'

import { ResetButton } from '@/components/common/ResetButton'
import { GeneratorPanel } from '@/components/generator/GeneratorPanel'
import { Header } from '@/components/layout/Header'
import { TabNav, type TabDef } from '@/components/layout/TabNav'
import { EligibilityMatrix } from '@/components/matrix/EligibilityMatrix'
import { RoleListEditor } from '@/components/lists/RoleListEditor'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { loadArcana } from '@/data/loadDefaults'
import { useConfigStore } from '@/hooks/useConfigStore'
import { usePreferences } from '@/hooks/usePreferences'
import type { ContextField } from '@/components/generator/ContextSelectors'
import { THEME_LABELS } from '@/types'

const TABS: TabDef[] = [
  { value: 'suspects', label: 'Suspects' },
  { value: 'truths', label: 'Truths' },
  { value: 'motives', label: 'Motives' },
  { value: 'treacheries', label: 'Treacheries' },
]

const ARCANA = loadArcana()

export default function App() {
  const { preferences, status: prefStatus, setPreference } = usePreferences()
  const store = useConfigStore(preferences.theme)
  const { config, resolved } = store
  const [notice, setNotice] = useState<string | null>(null)

  const overallStatus = store.status === 'error' || prefStatus === 'error' ? 'error' : store.status

  useEffect(() => {
    if (preferences.location && !resolved.locations.includes(preferences.location)) {
      setPreference('location', '')
    }
    if (preferences.object && !resolved.objects.includes(preferences.object)) {
      setPreference('object', '')
    }
  }, [resolved.locations, resolved.objects, preferences.location, preferences.object, setPreference])

  function handleAutofill() {
    const summary = store.autofillFromBaseline()
    const added =
      summary.addedSuspects +
      summary.addedTruths +
      summary.addedMotives +
      summary.addedTreacheries
    const parts = [`Autofill complete — ${added} missing default${added === 1 ? '' : 's'} added.`]
    if (summary.motiveObjectSkipped) {
      parts.push(
        `${THEME_LABELS[preferences.theme]} has no motive→object baseline yet, so the Motive × Object grid was left untouched.`,
      )
    }
    setNotice(parts.join(' '))
  }

  function handleContextChange(field: ContextField, value: string) {
    setPreference(field, value)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Header
        theme={preferences.theme}
        onThemeChange={(theme) => {
          setNotice(null)
          setPreference('theme', theme)
        }}
        onAutofill={handleAutofill}
        status={overallStatus}
        notice={notice}
      />

      <div className="mb-10 rounded-sm border border-ink-soft/30 bg-paper-dark/40 p-5">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">
          Generator <span className="text-ink-soft">— {THEME_LABELS[preferences.theme]}</span>
        </h2>
        <GeneratorPanel
          config={resolved}
          arcana={ARCANA}
          mode={preferences.mode}
          location={preferences.location}
          object={preferences.object}
          treachery={preferences.treachery}
          onModeChange={(mode) => setPreference('mode', mode)}
          onContextChange={handleContextChange}
        />
      </div>

      <Tabs value={preferences.activeTab} onValueChange={(value) => setPreference('activeTab', value)}>
        <TabNav tabs={TABS} />

        <TabsContent value="suspects" className="space-y-8">
          <RoleListEditor
            label="Suspects"
            items={resolved.suspects}
            onAdd={(name) => store.addRole('suspects', name)}
            onRename={(oldName, newName) => store.renameRole('suspects', oldName, newName)}
            onRemove={(name) => store.removeRole('suspects', name)}
          />
          <EligibilityMatrix
            roleLabel="Suspect"
            contextLabel="Location"
            roles={resolved.suspects}
            contexts={resolved.locations}
            isChecked={(role, context) => (config.themes[preferences.theme].locationMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('location', role, context)}
          />
        </TabsContent>

        <TabsContent value="truths" className="space-y-8">
          <RoleListEditor
            label="Truths"
            items={resolved.truths}
            onAdd={(name) => store.addRole('truths', name)}
            onRename={(oldName, newName) => store.renameRole('truths', oldName, newName)}
            onRemove={(name) => store.removeRole('truths', name)}
          />
          <EligibilityMatrix
            roleLabel="Truth"
            contextLabel="Treachery"
            roles={resolved.truths}
            contexts={resolved.treacheries}
            isChecked={(role, context) => (config.treacheryMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('treachery', role, context)}
          />
        </TabsContent>

        <TabsContent value="motives" className="space-y-8">
          <RoleListEditor
            label="Motives"
            items={resolved.motives}
            onAdd={(name) => store.addRole('motives', name)}
            onRename={(oldName, newName) => store.renameRole('motives', oldName, newName)}
            onRemove={(name) => store.removeRole('motives', name)}
          />
          <EligibilityMatrix
            roleLabel="Motive"
            contextLabel="Object"
            roles={resolved.motives}
            contexts={resolved.objects}
            isChecked={(role, context) => (config.themes[preferences.theme].objectMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('object', role, context)}
          />
        </TabsContent>

        <TabsContent value="treacheries">
          <RoleListEditor
            label="Treacheries"
            items={resolved.treacheries}
            onAdd={(name) => store.addRole('treacheries', name)}
            onRename={(oldName, newName) => store.renameRole('treacheries', oldName, newName)}
            onRemove={(name) => store.removeRole('treacheries', name)}
          />
        </TabsContent>
      </Tabs>

      <footer className="mt-10 flex justify-end border-t border-ink-soft/30 pt-4">
        <ResetButton onReset={store.resetAll} />
      </footer>
    </div>
  )
}
