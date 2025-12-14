import { Card as AntCard, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

export const IntroductionCard = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Введение</Typography.Title>
			<Typography.Paragraph>
				Покерный калькулятор эквити поможет вам принимать правильные решения в покере, рассчитывая ваши шансы на победу
				и сравнивая их с шансами банка (pot odds). Это важный инструмент для улучшения вашей игры.
			</Typography.Paragraph>
		</AntCard>
	)
})
