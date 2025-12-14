import { Card as AntCard, Typography } from 'antd'
import { PlayingCard } from '@/shared/ui'
import { Rank, Suit } from '@/shared/lib/poker/types'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

const exampleBoard = [
	{ rank: Rank.Queen, suit: Suit.Spades },
	{ rank: Rank.Jack, suit: Suit.Spades },
	{ rank: Rank.Ten, suit: Suit.Hearts },
	null,
	null,
]

export const Step2Card = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Шаг 2: Выбор карт на борде (Board Cards)</Typography.Title>
			<Typography.Paragraph>Заполните карты на борде в зависимости от стадии игры:</Typography.Paragraph>
			<ul className="list-disc list-inside mb-4">
				<li>
					<strong>Флоп</strong> - первые 3 карты (индексы 0-2)
				</li>
				<li>
					<strong>Тёрн</strong> - 4-я карта (индекс 3)
				</li>
				<li>
					<strong>Ривер</strong> - 5-я карта (индекс 4)
				</li>
			</ul>
			<div className="flex gap-3 my-4">
				{exampleBoard.map((card, i) =>
					card ? (
						<div key={`board-${i}`} className="flex flex-col items-center">
							<PlayingCard card={card} variant="large" />
							<span className="text-xs mt-1 text-gray-500">{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}</span>
						</div>
					) : (
						<div
							key={`board-empty-${i}`}
							className="w-20 h-28 rounded-xl border border-gray-300 bg-gray-200 flex items-center justify-center text-gray-400"
						>
							{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}
						</div>
					),
				)}
			</div>
			<Typography.Text type="secondary">Пример: На флопе выпали Q♠, J♠, 10♥ - у вас стрит-флеш дро!</Typography.Text>
		</AntCard>
	)
})
