import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SUITS } from '@/data/suits'
import type { ArcanaGroups, GeneratedTable } from '@/types'

interface ResultTableProps {
  table: GeneratedTable
  arcana: ArcanaGroups
}

interface Column {
  heading: string
  signpost: string
  values: string[]
  labels: string[]
}

export function ResultTable({ table, arcana }: ResultTableProps) {
  const isTarot = table.mode === 'tarot'
  const rowCount = table.suspects.values.length

  const suitLabels = SUITS.map((suit) => `${suit.symbol} ${suit.name}`)
  const rankColumn = isTarot
    ? Array.from({ length: rowCount }, (_, index) => `Card ${index + 1}`)
    : suitLabels

  const columns: Column[] = [
    {
      heading: 'Suspect',
      signpost: 'who',
      values: table.suspects.values,
      labels: isTarot ? arcana.suspect : suitLabels,
    },
    {
      heading: 'Motive',
      signpost: 'why',
      values: table.motives.values,
      labels: isTarot ? arcana.motive : suitLabels,
    },
    {
      heading: 'Means',
      signpost: 'how',
      values: table.truths.values,
      labels: isTarot ? arcana.truth : suitLabels,
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {!isTarot && <TableHead>Suit</TableHead>}
          {columns.map((column) => (
            <TableHead key={column.heading}>
              <span className="block font-body text-[10px] font-normal uppercase tracking-widest text-ink-soft">
                {column.signpost}
              </span>
              {column.heading}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }, (_, row) => (
          <TableRow key={row}>
            {!isTarot && (
              <TableCell className="font-body text-ink-soft">
                {rankColumn[row]}
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.heading}>
                <span className="font-semibold text-ink">
                  {column.values[row]}
                </span>
                {isTarot && (
                  <span className="block font-body text-ink-soft text-xs">
                    {column.labels[row]}
                  </span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
