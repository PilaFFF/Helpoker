import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { MainLayout } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'

type MenuItem = {
	title: string
	description: string
	to: string
}

const menuItems: MenuItem[] = [
	{
		title: '🔊 МузЛото',
		description: 'Сыграйте в музыкальное лото!',
		to: '/musloto',
	},
	{
		title: '📟 Калькулятор',
		description: 'Узнайте каков ваш шанс забрать выигрыш',
		to: '/calculator',
	},
	{
		title: '📚 Теория',
		description: 'Формулы, примеры, советы',
		to: '/theory',
	},
	{
		title: '🎯 Тренировка',
		description: 'Закрепите полученные знания и отточите навыки!',
		to: '/training',
	},
]

const RouteComponent = observer(function RouteComponent() {
	const isDark = themeStore.isDark

	return (
		<MainLayout>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ ease: 'easeInOut', duration: 0.6 }}
				className="w-full"
			>
				<motion.div
					initial={{ x: -30, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ ease: 'easeOut', duration: 0.5 }}
					className="flex flex-col gap-2 mb-12"
				>
					<motion.h1
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ type: 'spring', stiffness: 100, damping: 12 }}
						className="text-4xl font-bold"
					>
						Главная страница
					</motion.h1>
					<p className="text-lg text-gray-500">Добро пожаловать ▄︻デ══━一💥</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delayChildren: 0.3, staggerChildren: 0.15 }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{menuItems.map((item, idx) => (
						<motion.div
							key={item.to}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ ease: 'easeOut', duration: 0.4, delay: idx * 0.15 }}
						>
							<Link
								to={item.to}
								style={{
									background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
								}}
								className={`block p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${
									isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
								}`}
							>
								<h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
								<p className="text-gray-500">{item.description}</p>
							</Link>
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</MainLayout>
	)
})

export const Route = createFileRoute('/')({
	component: RouteComponent,
})
