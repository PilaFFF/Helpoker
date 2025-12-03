import { ranks, suits, type Card } from './types'

export const makeDeck = (): Card[] => {
	const deck: Card[] = []
	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push({ rank, suit })
		}
	}
	return deck
}

export const removeCards = (deck: Card[], cards: Card[]): Card[] => {
	const set = new Set(cards.map((c) => `${c.rank}${c.suit}`))
	return deck.filter((c) => !set.has(`${c.rank}${c.suit}`))
}

export const drawRandom = (deck: Card[], n: number): Card[] => {
	const copy = deck.slice()
	const res: Card[] = []
	for (let i = 0; i < n; i++) {
		const idx = Math.floor(Math.random() * copy.length)
		res.push(copy[idx])
		copy.splice(idx, 1)
	}
	return res
}
