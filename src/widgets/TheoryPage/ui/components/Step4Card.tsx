import { Card as AntCard, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

export const Step4Card = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Шаг 4: Ввод банка и ставки</Typography.Title>
			<Typography.Paragraph>Для получения рекомендации о том, стоит ли делать колл, введите:</Typography.Paragraph>
			<ul className="list-disc list-inside mb-4">
				<li>
					<strong>Банк (Pot Size)</strong> - текущий размер банка в рублях
				</li>
				<li>
					<strong>Ставка (Bet Size)</strong> - размер ставки, которую нужно сделать для колла
				</li>
			</ul>
			<div
				className={classNames('p-4 rounded-lg border-[1px] my-4', {
					'border-blue-200 bg-blue-50': !isDark,
					'border-blue-800 bg-blue-950': isDark,
				})}
			>
				<Typography.Text strong>Пример расчета:</Typography.Text>
				<br />
				<Typography.Text>Банк: 100, Ставка: 50</Typography.Text>
				<br />
				<Typography.Text>Шансы банка (Pot Odds) = 50 / (100 + 50) = 33.3%</Typography.Text>
				<br />
				<Typography.Text>Если ваше эквити больше 33.3% - делайте колл, если меньше - фолд.</Typography.Text>
			</div>
		</AntCard>
	)
})
