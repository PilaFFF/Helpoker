import { useRef, type FC, type ReactNode } from 'react'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import { themeStore } from '@/shared/lib/theme'
import { Card } from 'antd'
import { MobileBottomMenu } from './MobileBottomMenu'
import { MenuCircles } from './MenuCircles'
import classNames from 'classnames'

interface MainLayoutProps {
	children: ReactNode
	title?: string
	withoutPadding?: boolean
}

export const MainLayout: FC<MainLayoutProps> = observer(({ children, title, withoutPadding }) => {
	const isDark = themeStore.isDark
	const scrollRef = useRef<HTMLDivElement>(null)

	const menuItems = [
		{ to: '/', icon: <span>🏠</span>, label: 'На главную' },
		{ to: '/musloto', icon: <span>🔊</span>, label: 'МузЛото' },
		{ to: '/calculator', icon: <span>📟</span>, label: 'Калькулятор' },
		{ to: '/mortgage', icon: <span>🧮</span>, label: 'Калькулятор И' },
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
			className="h-screen max-h-screen overflow-hidden flex flex-col"
			style={{
				background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
			}}
		>
			{/* Основной контент с отступами */}
			<div className="flex-1 overflow-hidden px-4 pt-4 pb-20 md:pb-4">
				<div className="max-w-7xl mx-auto h-full">
					<div className="flex gap-6 h-full">
						{/* Левое меню на десктопе */}
						<motion.div
							className="sticky top-6 self-start flex-shrink-0 hidden md:block"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.6 }}
						>
							<MenuCircles items={menuItems} />
						</motion.div>

						{/* Основной контент */}
						<motion.div
							className="flex-1 min-w-0 flex flex-col gap-6"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.6 }}
						>
							{title && <h1 className="text-3xl font-bold">{title}</h1>}

							<Card
								ref={scrollRef}
								className="flex-1 overflow-y-auto scrollbar-none"
								styles={{ body: { padding: 0, height: '100%' } }}
							>
								<div className={classNames(!withoutPadding && 'p-6 pb-8')}>{children}</div>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Мобильное нижнее меню */}
			<MobileBottomMenu items={menuItems} scrollContainerRef={scrollRef} />
		</motion.div>
	)
})
