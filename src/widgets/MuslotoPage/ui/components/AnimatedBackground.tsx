import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

export const AnimatedBackground = observer(() => {
	const animationData = useMemo(() => {
		const gradients = [
			'bg-gradient-to-br from-pink-500/20 to-red-600/20',
			'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
			'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
			'bg-gradient-to-br from-yellow-400/20 to-orange-500/20',
		]

		const blobs = [
			{ x: 0, y: 0, size: 800, duration: 25, delay: 0 },
			{ x: 70, y: 10, size: 700, duration: 30, delay: 5 },
			{ x: 0, y: 50, size: 600, duration: 35, delay: 10 },
			{ x: 40, y: 40, size: 640, duration: 28, delay: 15 },
		].map((blob, i) => ({
			...blob,
			gradient: gradients[i],
		}))

		const particleColors = ['bg-blue-500/60', 'bg-red-500/60', 'bg-green-500/60', 'bg-yellow-400/60']
		const particles = Array.from({ length: 100 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 8 + 4,
			duration: Math.random() * 3 + 2,
			delay: Math.random() * 2,
			color: particleColors[i % particleColors.length],
		}))

		return { blobs, particles }
	}, [])

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{animationData.blobs.map((blob, i) => (
				<motion.div
					key={`blob-${i}`}
					className={`absolute rounded-full blur-sm opacity-30 ${blob.gradient}`}
					style={{
						width: blob.size,
						height: blob.size,
						left: `${blob.x}%`,
						top: `${blob.y}%`,
						transform: 'translate(-50%, -50%)',
						willChange: 'transform',
					}}
					animate={{
						scale: [1, 1.1, 0.9, 1],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: blob.duration,
						delay: blob.delay,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
			))}

			{animationData.particles.map((particle) => (
				<motion.div
					key={`particle-${particle.id}`}
					className={`absolute rounded-full ${particle.color}`}
					style={{
						width: particle.size,
						height: particle.size,
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						willChange: 'opacity',
					}}
					animate={{
						opacity: [0.2, 0.8, 0.2],
					}}
					transition={{
						duration: particle.duration,
						delay: particle.delay,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
			))}
		</div>
	)
})
