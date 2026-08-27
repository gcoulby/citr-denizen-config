import { useState } from 'react'

import { ContextSelectors, type ContextField } from '@/components/generator/ContextSelectors'
import { FallbackNote } from '@/components/generator/FallbackNote'
import { ModeToggle } from '@/components/generator/ModeToggle'
import { ProblemLine } from '@/components/generator/ProblemLine'
import { ResultTable } from '@/components/generator/ResultTable'
import { Button } from '@/components/ui/button'
import { generateTable } from '@/lib/draw'
import type { ArcanaGroups, CardMode, Config, ContextLists, GeneratedTable } from '@/types'

interface GeneratorPanelProps {
  config: Config
  contextLists: ContextLists
  arcana: ArcanaGroups
  mode: CardMode
  location: string
  object: string
  treachery: string
  onModeChange: (mode: CardMode) => void
  onContextChange: (field: ContextField, value: string) => void
}

function randomFrom(values: string[]): string {
  return values[Math.floor(Math.random() * values.length)] ?? ''
}

export function GeneratorPanel(props: GeneratorPanelProps) {
  const { config, contextLists, arcana, mode, location, object, treachery } = props
  const [result, setResult] = useState<GeneratedTable | null>(null)

  const listFor: Record<ContextField, string[]> = {
    location: contextLists.locations,
    object: contextLists.objects,
    treachery: contextLists.treacheries,
  }

  const ready = location !== '' && object !== '' && treachery !== ''

  function roll(field: ContextField) {
    props.onContextChange(field, randomFrom(listFor[field]))
  }

  function generate() {
    if (!ready) return
    setResult(generateTable(config, location, object, treachery, mode))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModeToggle mode={mode} onModeChange={props.onModeChange} />
        <Button onClick={generate} disabled={!ready}>
          Generate table
        </Button>
      </div>

      <ContextSelectors
        locations={contextLists.locations}
        objects={contextLists.objects}
        treacheries={contextLists.treacheries}
        location={location}
        object={object}
        treachery={treachery}
        onChange={props.onContextChange}
        onRoll={roll}
      />

      <ProblemLine location={location} object={object} treachery={treachery} />

      {result && (
        <div>
          <ResultTable table={result} arcana={arcana} />
          <FallbackNote table={result} />
        </div>
      )}
    </div>
  )
}
