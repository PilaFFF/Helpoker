import type { Card, HandScore } from './types'
import { HandCategory, Rank } from './types'

const byRankDesc = (a: number, b: number) => b - a

const getCounts = (cards: Card[]) => {
  const rankCounts = new Map<Rank, number>()
  const suitCounts = new Map<string, Card[]>()
  for (const c of cards) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1)
    const arr = suitCounts.get(c.suit) ?? []
    arr.push(c)
    suitCounts.set(c.suit, arr)
  }
  return { rankCounts, suitCounts }
}

const getSortedRanks = (cards: Card[]): Rank[] =>
  [...new Set(cards.map((c) => c.rank))].sort((a, b) => b - a)

const findStraight = (ranks: Rank[]): Rank | null => {
  const uniq = Array.from(new Set(ranks)).sort((a, b) => a - b)
  // Wheel
  const hasAce = uniq.includes(Rank.Ace)
  if (hasAce) uniq.unshift(1 as unknown as Rank)
  let run = 1
  for (let i = 1; i < uniq.length; i++) {
    if (uniq[i] === uniq[i - 1] + 1) {
      run++
      if (run >= 5) {
        return uniq[i]
      }
    } else {
      run = 1
    }
  }
  return null
}

export const evaluateSeven = (cards: Card[]): HandScore => {
  const { rankCounts, suitCounts } = getCounts(cards)

  let flush: Card[] | null = null
  for (const [s, arr] of suitCounts.entries()) {
    if (arr.length >= 5) {
      flush = arr.sort((a, b) => b.rank - a.rank)
      break
    }
  }

  if (flush) {
    const straightHigh = findStraight(flush.map((c) => c.rank))
    if (straightHigh) {
      return { category: HandCategory.StraightFlush, ranks: [straightHigh] }
    }
  }

  const counts = Array.from(rankCounts.entries()).sort((a, b) => b[1] - a[1] || b[0] - a[0])
  const four = counts.find(([, cnt]) => cnt === 4)
  if (four) {
    const kicker = getSortedRanks(cards).find((r) => r !== four[0])!
    return { category: HandCategory.FourKind, ranks: [four[0], kicker] }
  }

  const trips = counts.filter(([, cnt]) => cnt === 3)
  const pairs = counts.filter(([, cnt]) => cnt === 2)
  if (trips.length && (pairs.length || trips.length > 1)) {
    const tripRank = trips[0][0]
    const pairRank = pairs.length ? pairs[0][0] : trips[1][0]
    return { category: HandCategory.FullHouse, ranks: [tripRank, pairRank] }
  }

  if (flush) {
    return { category: HandCategory.Flush, ranks: flush.slice(0, 5).map((c) => c.rank) }
  }

  const straightHigh = findStraight(cards.map((c) => c.rank))
  if (straightHigh) {
    return { category: HandCategory.Straight, ranks: [straightHigh] }
  }

  if (trips.length) {
    const kickers = getSortedRanks(cards).filter((r) => r !== trips[0][0]).slice(0, 2)
    return { category: HandCategory.ThreeKind, ranks: [trips[0][0], ...kickers] }
  }

  if (pairs.length >= 2) {
    const [p1, p2] = [pairs[0][0], pairs[1][0]].sort(byRankDesc)
    const kicker = getSortedRanks(cards).filter((r) => r !== p1 && r !== p2)[0]
    return { category: HandCategory.TwoPair, ranks: [p1, p2, kicker] }
  }

  if (pairs.length === 1) {
    const pairRank = pairs[0][0]
    const kickers = getSortedRanks(cards).filter((r) => r !== pairRank).slice(0, 3)
    return { category: HandCategory.OnePair, ranks: [pairRank, ...kickers] }
  }

  return { category: HandCategory.HighCard, ranks: getSortedRanks(cards).slice(0, 5) }
}

const catOrder: HandCategory[] = [
  HandCategory.HighCard,
  HandCategory.OnePair,
  HandCategory.TwoPair,
  HandCategory.ThreeKind,
  HandCategory.Straight,
  HandCategory.Flush,
  HandCategory.FullHouse,
  HandCategory.FourKind,
  HandCategory.StraightFlush,
]

export const compareScores = (a: HandScore, b: HandScore): number => {
  const ca = catOrder.indexOf(a.category)
  const cb = catOrder.indexOf(b.category)
  if (ca !== cb) return ca - cb
  for (let i = 0; i < Math.max(a.ranks.length, b.ranks.length); i++) {
    const ra = a.ranks[i] ?? 0
    const rb = b.ranks[i] ?? 0
    if (ra !== rb) return ra - rb
  }
  return 0
}
