import { Tooltip } from 'antd'
import { PlayingCard } from '@/shared/ui'
import { ranks, suits } from '@/shared/lib/poker/types'
import type { Card } from '@/shared/lib/poker/types'
import type { FC } from 'react'

interface CardPickerGridProps {
	isDark: boolean
	selectedSet: Set<string>
	onPick: (card: Card) => void
}

export const CardPickerGrid: FC<CardPickerGridProps> = ({ isDark, selectedSet, onPick }) => {
	return (
		<div className="grid grid-cols-4 gap-4">
			{suits.map((suit) => (
				<div key={suit} className="flex flex-col items-center">
					<div className="flex flex-wrap justify-center gap-2">
						{ranks.map((rank) => {
							const card: Card = { rank, suit }
							const key = `${rank}${suit}`
							const disabled = selectedSet.has(key)

							return (
								<Tooltip key={key} title={disabled ? 'Уже выбрана' : 'Добавить'}>
									<span>
										<PlayingCard
											card={card}
											variant="small"
											disabled={disabled}
											isDark={isDark}
											onClick={() => onPick(card)}
										/>
									</span>
								</Tooltip>
							)
						})}
					</div>
				</div>
			))}
		</div>
	)
}
