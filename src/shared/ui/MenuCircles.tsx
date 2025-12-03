import { Tooltip } from 'antd'
import { useLocation, useNavigate } from '@tanstack/react-router'
import classNames from 'classnames'
import type { FC } from 'react'
import { motion } from 'framer-motion'

interface MenuItem {
	to?: string
	icon?: React.ReactNode
	label: string
	action?: () => void
	isActive?: boolean
	iconActive?: React.ReactNode
}

interface MenuCirclesProps {
	items: MenuItem[]
}

export const MenuCircles: FC<MenuCirclesProps> = ({ items }) => {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<div className="flex flex-col gap-4">
			{items.map((item, idx) => {
				const isRouteItem = Boolean(item.to)
				const isActive = isRouteItem ? location.pathname === item.to : Boolean(item.isActive)

				return (
					<Tooltip key={item.to} title={item.label} placement="right">
						<motion.button
							onClick={() => (isRouteItem ? navigate({ to: item.to! }) : item.action?.())}
							className={classNames(
								'relative w-12 !h-12 flex rounded-full items-center justify-center text-2xl transition-all duration-200',
								'hover:scale-105',
								'border-t-[1.5px] border-t-indigo-100/70 border-b-[1px] border-b-gray-50/30',
								{
									'bg-indigo-500 text-white shadow-lg scale-110': isActive,
									'bg-white/90 text-gray-600 hover:bg-gray-50': !isActive,
								},
							)}
							animate={{
								y: [20, 0],
								opacity: [0, 1],
								transition: { ease: ['easeOut'], duration: 0.1, delay: idx * 0.2 },
							}}
						>
							{isActive ? (item.iconActive ?? item.icon) : item.icon}

							{isActive && isRouteItem && (
								<span className="absolute -bottom-1 border-[0.5px] border-gray-100/50 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
							)}
						</motion.button>
					</Tooltip>
				)
			})}
		</div>
	)
}
