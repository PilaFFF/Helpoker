import type { FC } from 'react'
import { type Card, rankToLabel, suitToLabel, getSuitColor } from '@/shared/lib/poker/types'
import classNames from 'classnames'

interface PlayingCardProps {
	card: Card
	variant: 'small' | 'large'
	selected?: boolean
	disabled?: boolean
	isDark?: boolean
	onClick?: () => void
}

export const PlayingCard: FC<PlayingCardProps> = ({ card, variant, selected, disabled, isDark, onClick }) => {
	const isSmall = variant === 'small'
	const base = classNames(
		'relative inline-flex items-center justify-center rounded-xl border transition-all select-none',
		'bg-gray-300',
		isSmall ? 'w-12 h-16 text-sm' : 'w-20 h-28 text-base',
		selected ? 'border-indigo-500 shadow-md' : 'border-gray-300',
		disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow',
	)

	const suitColor = getSuitColor(card.suit)

	return (
		<button
			type="button"
			className={base}
			disabled={disabled}
			onClick={onClick}
			aria-label={`${rankToLabel(card.rank)} ${suitToLabel(card.suit)}`}
		>
			<span className={classNames('absolute top-1 left-2 font-semibold', suitColor)}>{rankToLabel(card.rank)}</span>
			<span className={classNames(isSmall ? 'text-xl' : 'text-4xl', suitColor)}>{suitToLabel(card.suit)}</span>
			<span className={classNames('absolute bottom-1 right-2 font-semibold', suitColor)}>{rankToLabel(card.rank)}</span>
		</button>
	)
}
