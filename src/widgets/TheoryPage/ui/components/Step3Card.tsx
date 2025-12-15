import { Card as AntCard, Typography, Space } from 'antd'

export const Step3Card = () => {
	return (
		<AntCard
			style={{
				background: '#131314',
			}}
		>
			<Typography.Title level={3}>Шаг 3: Настройка параметров расчета</Typography.Title>
			<Space direction="vertical" className="w-full">
				<div>
					<Typography.Title level={4}>Количество сэмплов</Typography.Title>
					<Typography.Paragraph>
						Чем больше сэмплов, тем точнее расчет, но дольше выполнение. Рекомендуется использовать 5000-10000 сэмплов
						для баланса между точностью и скоростью.
					</Typography.Paragraph>
				</div>
				<div>
					<Typography.Title level={4}>Эквити для комбинации</Typography.Title>
					<Typography.Paragraph>
						Вы можете выбрать конкретную комбинацию для расчета эквити. Например, если вы хотите узнать шансы собрать
						флеш, выберите "Флеш" из списка. По умолчанию рассчитывается эквити для всех комбинаций.
					</Typography.Paragraph>
				</div>
			</Space>
		</AntCard>
	)
}
