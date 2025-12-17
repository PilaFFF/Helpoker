import { Button } from 'antd'
import { PlayingCard } from '@/shared/ui'
import type { ActiveSlot, Card } from '@/shared/lib/poker/types'
import classNames from 'classnames'
import type { FC } from 'react'
import { observer } from 'mobx-react-lite'

interface HandBoardDisplayProps {
	hole?: Array<Card | null>
	board?: Array<Card | null>
	activeSlot: ActiveSlot
	setActiveSlot: (slot: ActiveSlot) => void
	clearSlot: (type: 'hole' | 'board', index: number) => void
	flopTurnRiverLabels?: boolean
	onEmptyClick?: (type: 'hole' | 'board', index: number) => void
}

const labels = ['Флоп', 'Флоп', 'Флоп', 'Тёрн', 'Ривер']

export const HandBoardDisplay: FC<HandBoardDisplayProps> = observer(
	({ hole, board, activeSlot, setActiveSlot, clearSlot, flopTurnRiverLabels = false, onEmptyClick }) => {
		const cards = hole ?? board ?? []
		const type: 'hole' | 'board' = hole ? 'hole' : 'board'

		return (
			<div className="flex gap-3 flex-wrap">
				{cards.map((card, i) => (
					<div key={`${type}${i}`} className="flex flex-col items-center gap-2">
						{card ? (
							<>
								<PlayingCard
									card={card}
									variant="large"
									selected={activeSlot.type === type && activeSlot.index === i}
									onClick={() => setActiveSlot({ type, index: i })}
								/>
								<Button size="small" type="text" onClick={() => clearSlot(type, i)}>
									Очистить
								</Button>
							</>
						) : (
							<button
								type="button"
								className={classNames(
									'w-20 h-28 rounded-xl text-gray-600 border-2 flex items-center justify-center text-sm font-medium transition-colors',
									activeSlot.type === type && activeSlot.index === i
										? 'border-indigo-500 bg-white/90'
										: 'border-gray-400 bg-gray-300',
								)}
								onClick={() => {
									setActiveSlot({ type, index: i })
									onEmptyClick?.(type, i)
								}}
							>
								{flopTurnRiverLabels && type === 'board' ? labels[i] : 'Выбрать'}
							</button>
						)}
					</div>
				))}
			</div>
		)
	},
)
