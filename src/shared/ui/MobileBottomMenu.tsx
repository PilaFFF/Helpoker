import { useLocation, useNavigate } from '@tanstack/react-router'
import classNames from 'classnames'
import { type FC, useEffect, useRef, useState } from 'react'

interface MenuItem {
	to?: string
	icon?: React.ReactNode
	label: string
	action?: () => void
	isActive?: boolean
}

interface MobileBottomMenuProps {
	items: MenuItem[]
	scrollContainerRef?: React.RefObject<HTMLElement | null>
}

export const MobileBottomMenu: FC<MobileBottomMenuProps> = ({ items, scrollContainerRef }) => {
	const location = useLocation()
	const navigate = useNavigate()

	const [visible, setVisible] = useState(true)
	const lastScrollTop = useRef(0)

	useEffect(() => {
		const container = scrollContainerRef?.current
		if (!container) return

		const onScroll = () => {
			const currentScrollTop = container.scrollTop
			const delta = 8 // чувствительность

			if (currentScrollTop > lastScrollTop.current + delta) {
				// скролл вниз — скрываем
				setVisible(false)
			} else if (currentScrollTop < lastScrollTop.current - delta) {
				// скролл вверх — показываем
				setVisible(true)
			}

			lastScrollTop.current = currentScrollTop
		}

		container.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			container.removeEventListener('scroll', onScroll)
		}
	}, [scrollContainerRef])

	return (
		<div
			className={classNames(
				'fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 md:hidden',
				visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
			)}
		>
			<div className="flex justify-around border-t-[1px] border-t-gray-200/30 border-b-[0.5px] border-b-gray-600/80 items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl px-2 shadow-2xl">
				{items.map((item, idx) => {
					const isRouteItem = Boolean(item.to)
					const isActive = isRouteItem ? location.pathname === item.to : Boolean(item.isActive)

					return (
						<button
							key={idx}
							onClick={() => (isRouteItem ? navigate({ to: item.to! }) : item.action?.())}
							className={classNames(
								'flex flex-col items-center gap-1 min-w-12 py-2',
								isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400',
							)}
						>
							<div className="text-2xl">{item.icon}</div>
							{isActive && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1" />}
						</button>
					)
				})}
			</div>
		</div>
	)
}
