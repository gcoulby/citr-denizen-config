import type { Suit } from '@/types'

export const SUITS: readonly Suit[] = [
  { name: 'Hearts', symbol: '♥', red: true },
  { name: 'Diamonds', symbol: '♦', red: true },
  { name: 'Clubs', symbol: '♣', red: false },
  { name: 'Spades', symbol: '♠', red: false },
]
