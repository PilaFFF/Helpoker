import { Card as AntCard, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

export const TipsCard = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Советы по использованию</Typography.Title>
			<ul className="list-disc list-inside space-y-2">
				<li>
					Используйте калькулятор для обучения и понимания математики покера, но помните, что в реальной игре важно
					учитывать и другие факторы (стиль оппонента, позицию, стадию турнира)
				</li>
				<li>
					Для более точных расчетов увеличьте количество сэмплов, особенно при расчете эквити для конкретных комбинаций
				</li>
				<li>
					Калькулятор рассчитывает эквити против случайного оппонента. В реальной игре учитывайте диапазон рук вашего
					оппонента
				</li>
				<li>Рекомендации основаны на математике, но в покере важны также психология и чтение оппонентов</li>
			</ul>
		</AntCard>
	)
})
