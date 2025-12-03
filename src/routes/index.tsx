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
				<Space direction="vertical" size="large" className="w-full">
					<motion.div
						animate={{ x: [-30, 0], opacity: [0, 1], transition: { ease: ['easeOut'], duration: 0.5 } }}
						className="flex items-center justify-between"
					>
						<motion.div
							animate={{
								scale: [0.8, 1],
								transition: { type: 'spring', stiffness: 100, damping: 12, duration: 0.7 },
							}}
							className="flex items-center space-x-3"
						>
							<UserOutlined className="bg-white dark:bg-gray-600 p-3 rounded-full text-indigo-600 text-xl" />

							<div>
								<Title level={2} className="!m-0">
									Главная страница
								</Title>
								<Text type="secondary">Добро пожаловать</Text>
							</div>
						</motion.div>
					</motion.div>

					<motion.div
						animate={{
							opacity: [0, 1],
							transition: { ease: ['easeInOut'], duration: 0.5, delayChildren: 0.3, staggerChildren: 0.15 },
						}}
						className="grid grid-cols-1 md:grid-cols-3 mt-8"
					>
						{['Калькулятор', 'Теория', 'Тренировка'].map((title, idx) => (
							<motion.div
								key={title}
								animate={{
									y: [20, 0],
									opacity: [0, 1],
									transition: { ease: ['easeOut'], duration: 0.4, delay: idx * 0.3 },
								}}
								className={`cursor-pointer text-center p-6 m-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl hover:shadow-md transition-shadow`}
							>
								<Title level={4}>{title}</Title>
								<Text type="secondary">
									{title === 'Калькулятор'
										? 'Узнайте каков ваш шанс забрать выигрыш'
										: title === 'Теория'
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
