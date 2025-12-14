import { Card as AntCard, Typography } from 'antd'
import { PlayingCard } from '@/shared/ui'
import { Rank, Suit } from '@/shared/lib/poker/types'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

export const PracticalExampleCard = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Практический пример</Typography.Title>
			<Typography.Paragraph>
				Представьте ситуацию: у вас на руках A♠ K♠, на флопе выпали Q♠ J♠ 10♥. У вас стрит-флеш дро - для сбора
				стрит-флеша от десятки до туза нужна именно 10♠ (десятка пик), а для стрит-флеша от девятки до короля нужна
				9♠. Также у вас есть флеш дро - любая пика даст вам флеш.
			</Typography.Paragraph>
			<div className="my-4">
				<Typography.Text strong>Ваши карты:</Typography.Text>
				<div className="flex gap-2 mt-2">
					<PlayingCard card={{ rank: Rank.Ace, suit: Suit.Spades }} variant="large" />
					<PlayingCard card={{ rank: Rank.King, suit: Suit.Spades }} variant="large" />
				</div>
			</div>
			<div className="my-4">
				<Typography.Text strong>Борд:</Typography.Text>
				<div className="flex gap-2 mt-2">
					<PlayingCard card={{ rank: Rank.Queen, suit: Suit.Spades }} variant="large" />
					<PlayingCard card={{ rank: Rank.Jack, suit: Suit.Spades }} variant="large" />
					<PlayingCard card={{ rank: Rank.Ten, suit: Suit.Hearts }} variant="large" />
				</div>
			</div>
			<Typography.Paragraph>
				В этой ситуации калькулятор покажет высокое эквити на флеш и стрит-флеш. Если оппонент делает ставку, и ваше
				эквити выше шансов банка - делайте колл!
			</Typography.Paragraph>
		</AntCard>
	)
})
