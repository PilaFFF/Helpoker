import { Card as AntCard, Typography } from 'antd'
import { PlayingCard } from '@/shared/ui'
import { Rank, Suit } from '@/shared/lib/poker/types'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

const exampleHole = [
	{ rank: Rank.Ace, suit: Suit.Spades },
	{ rank: Rank.King, suit: Suit.Spades },
]

export const Step1Card = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Шаг 1: Выбор ваших карт (Hole Cards)</Typography.Title>
			<Typography.Paragraph>
				Начните с выбора двух ваших карт. Нажмите на пустую кнопку "Выбрать" под разделом "Ваши карты" и выберите карту
				из колоды ниже.
			</Typography.Paragraph>
			<div className="flex gap-3 my-4">
				{exampleHole.map((card, i) => (
					<PlayingCard key={`hole-${i}`} card={card} variant="large" />
				))}
			</div>
			<Typography.Text type="secondary">Пример: Вы выбрали туз и король пик - сильная стартовая рука!</Typography.Text>
		</AntCard>
	)
})
