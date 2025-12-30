import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'

export const AnimatedBackground = observer(() => {
	const garlandColors = ['bg-red-500', 'bg-green-500', 'bg-yellow-400', 'bg-blue-500', 'bg-pink-500', 'bg-amber-400']

	const blobPositions = [
		{ x: 10, y: 15 },
		{ x: 75, y: 20 },
		{ x: 30, y: 70 },
		{ x: 85, y: 65 },
		{ x: 50, y: 10 },
		{ x: 15, y: 80 },
		{ x: 60, y: 85 },
		{ x: 90, y: 40 },
	]

	const blobs = blobPositions.map((pos, i) => ({
		id: i,
		size: Math.random() * 200 + 250,
		initialX: pos.x,
		initialY: pos.y,
		duration: Math.random() * 30 + 30,
		delay: i * 2,
		color: garlandColors[i % garlandColors.length],
	}))

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{blobs.map((blob) => (
				<motion.div
					key={blob.id}
					className={`absolute rounded-full blur-3xl opacity-25 ${blob.color}`}
					style={{
						width: blob.size,
						height: blob.size,
						left: `${blob.initialX}%`,
						top: `${blob.initialY}%`,
					}}
					animate={{
						x: [0, 80, -80, 60, 0],
						y: [0, -60, 80, -40, 0],
						scale: [1, 1.3, 0.9, 1.2, 1],
					}}
					transition={{
						duration: blob.duration,
						delay: blob.delay,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			))}

			{Array.from({ length: 50 }, (_, i) => {
				const color = garlandColors[i % garlandColors.length]
				return (
					<motion.div
						key={`light-${i}`}
						className={`absolute w-6 h-6 rounded-full blur-sm shadow-lg ${color}`}
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							opacity: [0.4, 1, 0.4],
							scale: [1, 1.3, 1],
						}}
						transition={{
							duration: Math.random() * 2 + 1.5,
							delay: Math.random() * 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
				)
			})}
		</div>
	)
})
