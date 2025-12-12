import { createFileRoute } from '@tanstack/react-router'
import { Typography, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { MainLayout } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

const { Title, Text } = Typography

const RouteComponent = observer(function RouteComponent() {
	const isDark = themeStore.isDark
	return (
		<MainLayout>
			<motion.div animate={{ scale: [0.95, 1], opacity: [0, 1], transition: { ease: ['easeInOut'], duration: 0.6 } }}>
				<Space direction="vertical" className="w-full">
					<motion.div
						animate={{ x: [-30, 0], opacity: [0, 1], transition: { ease: ['easeOut'], duration: 0.5 } }}
						className="flex items-center justify-between"
					>
						<motion.div
							animate={{
								scale: [0.8, 1],
								transition: { type: 'spring', stiffness: 100, damping: 12, duration: 0.7 },
							}}
							className="flex items-center"
						>
							<div className="ml-4">
								<Title level={2}>Главная страница</Title>
								<Text type="secondary">Добро пожаловать</Text>
							</div>
						</motion.div>
					</motion.div>

					<motion.div
						animate={{
							opacity: [0, 1],
							transition: { ease: ['easeInOut'], duration: 0.5, delayChildren: 0.3, staggerChildren: 0.15 },
						}}
						className="grid grid-cols-1 md:grid-cols-3"
					>
						{['🔊 МузЛото', '🧮 Калькулятор', '📚 Теория', '🎯 Тренировка'].map((title, idx) => (
							<motion.div
								key={title}
								animate={{
									y: [20, 0],
									opacity: [0, 1],
									transition: { ease: ['easeOut'], duration: 0.4, delay: idx * 0.3 },
								}}
								className={`cursor-pointer text-center p-6 m-4 ${
									isDark ? 'bg-gray-600' : 'bg-gray-200'
								} rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform`}
							>
								<Title level={4}>{title}</Title>
								<Text type="secondary">
									{title === '🔊 МузЛото'
										? 'Сыграйте в музальное лото!'
										: title === '🧮 Калькулятор'
											? 'Узнайте каков ваш шанс забрать выигрыш'
											: title === '📚 Теория'
												? 'Формулы, примеры, советы'
												: 'Закрепите полученные знания и отточите навыки!'}
								</Text>
							</motion.div>
						))}
					</motion.div>
				</Space>
			</motion.div>
		</MainLayout>
	)
})

export const Route = createFileRoute('/')({
	component: RouteComponent,
})
