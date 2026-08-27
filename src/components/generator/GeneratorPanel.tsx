import { useState } from 'react'

import {
  ContextSelectors,
  type ContextField,
} from '@/components/generator/ContextSelectors'
import { FallbackNote } from '@/components/generator/FallbackNote'
import { ModeToggle } from '@/components/generator/ModeToggle'
import { ProblemLine } from '@/components/generator/ProblemLine'
import { ResultTable } from '@/components/generator/ResultTable'
import { Button } from '@/components/ui/button'
import { generateTable } from '@/lib/draw'
import type {
  ArcanaGroups,
  CardMode,
  GeneratedTable,
  ResolvedConfig,
} from '@/types'

interface GeneratorPanelProps {
  config: ResolvedConfig
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
  const { config, arcana, mode, location, object, treachery } = props
  const [result, setResult] = useState<GeneratedTable | null>(null)

  const listFor: Record<ContextField, string[]> = {
    location: config.locations,
    object: config.objects,
    treachery: config.treacheries,
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
      <div className="flex flex-wrap justify-between items-center gap-3">
        <ModeToggle mode={mode} onModeChange={props.onModeChange} />
        <Button onClick={generate} disabled={!ready}>
          Generate table
        </Button>
      </div>

      <ContextSelectors
        locations={config.locations}
        objects={config.objects}
        treacheries={config.treacheries}
        location={location}
        object={object}
        treachery={treachery}
        onChange={props.onContextChange}
        onRoll={roll}
      />

      {/* <ProblemLine location={location} object={object} treachery={treachery} /> */}

      {result && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => window.print()}>Print</Button>
          </div>
          <div className="space-y-4 print-area">
            <ProblemLine
              location={result.location}
              object={result.object}
              treachery={result.treachery}
            />
            <ResultTable table={result} arcana={arcana} />
          </div>
          <FallbackNote table={result} />
        </div>
      )}
    </div>
  )
}
