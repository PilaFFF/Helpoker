import { Card as AntCard, Typography, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

export const Step5Card = observer(() => {
	const isDark = themeStore.isDark

	return (
		<AntCard
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<Typography.Title level={3}>Шаг 5: Анализ результатов</Typography.Title>
			<Space direction="vertical" className="w-full">
				<div>
					<Typography.Title level={4}>Equity (Эквити)</Typography.Title>
					<Typography.Paragraph>
						Процентное соотношение ваших шансов на победу против случайного оппонента. Чем выше эквити, тем лучше ваша
						рука.
					</Typography.Paragraph>
				</div>
				<div>
					<Typography.Title level={4}>Шансы банка (Pot Odds)</Typography.Title>
					<Typography.Paragraph>
						Минимальный процент эквити, необходимый для прибыльного колла. Рассчитывается как: Ставка / (Банк + Ставка)
					</Typography.Paragraph>
				</div>
				<div>
					<Typography.Title level={4}>Рекомендация</Typography.Title>
					<Typography.Paragraph>
						Калькулятор автоматически сравнивает ваше эквити с шансами банка и дает рекомендацию:
					</Typography.Paragraph>
					<div
						className={classNames('p-4 rounded-lg border-[1px] my-2', {
							'border-green-500 bg-green-100': !isDark,
							'border-green-700 bg-green-900': isDark,
						})}
					>
						<Typography.Text strong className="text-green-700 dark:text-green-300">
							✓ КОЛЛ
						</Typography.Text>
						<br />
						<Typography.Text>
							Если ваше эквити выше шансов банка - делайте колл, это математически выгодно в долгосрочной перспективе.
						</Typography.Text>
					</div>
					<div
						className={classNames('p-4 rounded-lg border-[1px] my-2', {
							'border-red-500 bg-red-100': !isDark,
							'border-red-700 bg-red-900': isDark,
						})}
					>
						<Typography.Text strong className="text-red-700 dark:text-red-300">
							✗ ФОЛД
						</Typography.Text>
						<br />
						<Typography.Text>
							Если ваше эквити ниже шансов банка - делайте фолд, колл будет убыточным в долгосрочной перспективе.
						</Typography.Text>
					</div>
				</div>
			</Space>
		</AntCard>
	)
})
