interface ProblemLineProps {
  location: string
  object: string
  treachery: string
}

export function ProblemLine({ location, object, treachery }: ProblemLineProps) {
  if (!location || !object || !treachery) {
    return (
      <p className="font-body text-ink-soft text-sm italic">
        Pick a Location, an Object, and a Treachery to frame the problem.
      </p>
    )
  }

  return (
    <p className="font-display text-ink text-lg">
      <span className="text-ink-soft">The problem: </span>
      the <strong>{object}</strong>{' '}
      <strong>{treachery.toLowerCase().replace('the object', '')}</strong> at
      the <strong>{location}</strong>.
    </p>
  )
}
