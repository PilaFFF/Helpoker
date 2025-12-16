import { useRef, type FC, type ReactNode } from 'react'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import { themeStore } from '@/shared/lib/theme'
import { Card } from 'antd'
import { MobileBottomMenu } from './MobileBottomMenu'
import { MenuCircles } from './MenuCircles'

interface MainLayoutProps {
	children: ReactNode
	title?: string
	showGoBack?: boolean
}

export const MainLayout: FC<MainLayoutProps> = observer(({ children, title }) => {
	const isDark = themeStore.isDark
	const scrollRef = useRef<HTMLDivElement | null>(null)

	const menuItems = [
		{ to: '/', icon: <span>🏠</span>, label: 'На главную' },
		{ to: '/musloto', icon: <span>🔊</span>, label: 'МузЛото' },
		{ to: '/calculator', icon: <span>📟</span>, label: 'Калькулятор' },
		{ to: '/theory', icon: <span>📚</span>, label: 'Теория' },
		{ to: '/training', icon: <span>🎯</span>, label: 'Тренировка' },
		{
			label: 'Тема',
			action: () => themeStore.toggle(),
			isActive: isDark,
			icon: isDark ? <SunOutlined /> : <MoonOutlined />,
		},
	]

	return (
		<motion.div
			className="min-h-screen p-4 pb-24"
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex gap-4">
					<motion.div
						className="sticky top-6 self-start flex-shrink-0 hidden md:block"
						animate={{ scale: [0.95, 1], opacity: [0, 1], transition: { duration: 0.6 } }}
					>
						<MenuCircles items={menuItems} />
					</motion.div>
					<div className="flex-1 min-w-0">
						{title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}

						<Card ref={scrollRef} className="overflow-y-auto max-h-[calc(100vh-6rem)] scrollbar-none">
							{children}
						</Card>
					</div>
				</div>
			</div>

			{/* Мобильное нижнее меню */}
			<MobileBottomMenu items={menuItems} scrollContainerRef={scrollRef} />
		</motion.div>
	)
})
