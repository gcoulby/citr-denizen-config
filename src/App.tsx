import { useMemo } from 'react'

import { ResetButton } from '@/components/common/ResetButton'
import { GeneratorPanel } from '@/components/generator/GeneratorPanel'
import { Header } from '@/components/layout/Header'
import { TabNav, type TabDef } from '@/components/layout/TabNav'
import { EligibilityMatrix } from '@/components/matrix/EligibilityMatrix'
import { RoleListEditor } from '@/components/lists/RoleListEditor'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { loadArcana, loadContextLists } from '@/data/loadDefaults'
import { useConfigStore } from '@/hooks/useConfigStore'
import { usePreferences } from '@/hooks/usePreferences'
import type { ContextField } from '@/components/generator/ContextSelectors'

const TABS: TabDef[] = [
  { value: 'suspects', label: 'Suspects' },
  { value: 'locations', label: 'Suspect × Location' },
  { value: 'truths', label: 'Truths' },
  { value: 'treacheries', label: 'Truth × Treachery' },
  { value: 'motives', label: 'Motives' },
  { value: 'objects', label: 'Motive × Object' },
]

export default function App() {
  const store = useConfigStore()
  const { preferences, status: prefStatus, setPreference } = usePreferences()
  const contextLists = useMemo(loadContextLists, [])
  const arcana = useMemo(loadArcana, [])

  const { config } = store
  const overallStatus = store.status === 'error' || prefStatus === 'error' ? 'error' : store.status

  function handleContextChange(field: ContextField, value: string) {
    setPreference(field, value)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Header onAutofill={() => void store.autofillFromBaseline()} status={overallStatus} />

      <div className="mb-10 rounded-sm border border-ink-soft/30 bg-paper-dark/40 p-5">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">Generator</h2>
        <GeneratorPanel
          config={config}
          contextLists={contextLists}
          arcana={arcana}
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

        <TabsContent value="suspects">
          <RoleListEditor
            label="Suspects"
            items={config.suspects}
            onAdd={(name) => store.addRole('suspects', name)}
            onRename={(oldName, newName) => store.renameRole('suspects', oldName, newName)}
            onRemove={(name) => store.removeRole('suspects', name)}
          />
        </TabsContent>

        <TabsContent value="locations">
          <EligibilityMatrix
            roleLabel="Suspect"
            contextLabel="Location"
            roles={config.suspects}
            contexts={contextLists.locations}
            isChecked={(role, context) => (config.locationMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('location', role, context)}
          />
        </TabsContent>

        <TabsContent value="truths">
          <RoleListEditor
            label="Truths"
            items={config.truths}
            onAdd={(name) => store.addRole('truths', name)}
            onRename={(oldName, newName) => store.renameRole('truths', oldName, newName)}
            onRemove={(name) => store.removeRole('truths', name)}
          />
        </TabsContent>

        <TabsContent value="treacheries">
          <EligibilityMatrix
            roleLabel="Truth"
            contextLabel="Treachery"
            roles={config.truths}
            contexts={contextLists.treacheries}
            isChecked={(role, context) => (config.treacheryMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('treachery', role, context)}
          />
        </TabsContent>

        <TabsContent value="motives">
          <RoleListEditor
            label="Motives"
            items={config.motives}
            onAdd={(name) => store.addRole('motives', name)}
            onRename={(oldName, newName) => store.renameRole('motives', oldName, newName)}
            onRemove={(name) => store.removeRole('motives', name)}
          />
        </TabsContent>

        <TabsContent value="objects">
          <EligibilityMatrix
            roleLabel="Motive"
            contextLabel="Object"
            roles={config.motives}
            contexts={contextLists.objects}
            isChecked={(role, context) => (config.objectMap[role] ?? []).includes(context)}
            onToggle={(role, context) => store.toggleCell('object', role, context)}
          />
        </TabsContent>
      </Tabs>

      <footer className="mt-10 flex justify-end border-t border-ink-soft/30 pt-4">
        <ResetButton onReset={store.resetAll} />
      </footer>
    </div>
  )
}
