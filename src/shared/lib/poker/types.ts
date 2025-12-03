export enum Suit {
	Spades = 's',
	Hearts = 'h',
	Diamonds = 'd',
	Clubs = 'c',
}

export enum Rank {
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
	Nine = 9,
	Ten = 10,
	Jack = 11,
	Queen = 12,
	King = 13,
	Ace = 14,
}

export interface Card {
	rank: Rank
	suit: Suit
}

export const ranks: Rank[] = [
	Rank.Two,
	Rank.Three,
	Rank.Four,
	Rank.Five,
	Rank.Six,
	Rank.Seven,
	Rank.Eight,
	Rank.Nine,
	Rank.Ten,
	Rank.Jack,
	Rank.Queen,
	Rank.King,
	Rank.Ace,
]

export interface ActiveSlot {
	type: 'hole' | 'board'
	index: number
}

export const suits: Suit[] = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs]

export const rankToLabel = (r: Rank): string =>
	r <= Rank.Ten ? String(r) : r === Rank.Jack ? 'J' : r === Rank.Queen ? 'Q' : r === Rank.King ? 'K' : 'A'

export const suitToLabel = (s: Suit): string =>
	s === Suit.Spades ? '♠' : s === Suit.Hearts ? '♥' : s === Suit.Diamonds ? '♦' : '♣'
export const getSuitColor = (suit: Suit): string =>
	suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-600' : 'text-gray-800'
export const codeToCard = (code: string): Card => {
	const label = code.slice(0, -1)
	const suitChar = code.slice(-1)
	const suit = (
		suitChar === 's' ? Suit.Spades : suitChar === 'h' ? Suit.Hearts : suitChar === 'd' ? Suit.Diamonds : Suit.Clubs
	) as Suit

	const rank: Rank =
		label === 'A'
			? Rank.Ace
			: label === 'K'
				? Rank.King
				: label === 'Q'
					? Rank.Queen
					: label === 'J'
						? Rank.Jack
						: (Number(label) as Rank)

	return { rank, suit }
}

export const cardToCode = (card: Card): string => `${rankToLabel(card.rank)}${card.suit}`

export enum HandCategory {
	StraightFlush = 'straight_flush',
	FourKind = 'four_kind',
	FullHouse = 'full_house',
	Flush = 'flush',
	Straight = 'straight',
	ThreeKind = 'three_kind',
	TwoPair = 'two_pair',
	OnePair = 'one_pair',
	HighCard = 'high_card',
}

export interface HandScore {
	category: HandCategory
	ranks: Rank[]
}
