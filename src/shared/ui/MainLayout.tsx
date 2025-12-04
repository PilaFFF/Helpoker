import { type FC, type ReactNode } from 'react'
import {
	HomeOutlined,
	CalculatorOutlined,
	BookOutlined,
	AimOutlined,
	SunOutlined,
	MoonOutlined,
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import { MenuCircles } from '@/shared/ui/MenuCircles'
import { themeStore } from '@/shared/lib/theme'

interface MainLayoutProps {
	children: ReactNode
	title?: string
	showGoBack?: boolean
}

export const MainLayout: FC<MainLayoutProps> = observer(({ children, title }) => {
	const isDark = themeStore.isDark

	const menuItems = [
		{ to: '/', icon: <HomeOutlined />, label: 'На главную' },
		{ to: '/calculator', icon: <CalculatorOutlined />, label: 'Калькулятор' },
		{ to: '/theory', icon: <BookOutlined />, label: 'Теория' },
		{ to: '/training', icon: <AimOutlined />, label: 'Тренировка' },
		{
			label: 'Тема',
			action: () => themeStore.toggle(),
			isActive: isDark,
			icon: isDark ? <SunOutlined /> : <MoonOutlined />,
		},
	]

	return (
		<motion.div
			animate={{
				opacity: [0, 1],
				y: [20, 0],
				transition: { ease: ['easeInOut'], duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
			}}
			className="min-h-screen p-4"
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex gap-4">
					<motion.div
						className="sticky top-6 self-start flex-shrink-0"
						animate={{ scale: [0.95, 1], opacity: [0, 1], transition: { ease: ['easeInOut'], duration: 0.6 } }}
					>
						<MenuCircles items={menuItems} />
					</motion.div>

					<div className="flex-1 min-w-0">
						<div className={`${isDark ? ' text-gray-100' : 'bg-[#fff] text-gray-900'} rounded-2xl shadow-lg p-6`}>
							{title && (
								<h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h1>
							)}
							<div className="overflow-y-auto max-h-[calc(100vh-9rem)] scrollbar-none">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
})
