import { MainLayout } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import { themeStore } from '@/shared/lib/theme'
import { useState, useEffect, useRef } from 'react'
import { lottoItems as initialLottoItems } from '../const/lottoItems.const'
import Player from './components/Player'
import { AnimatedBackground } from './components/AnimatedBackground'

const STORAGE_KEY = 'musloto-game-state'

type LottoItem = {
	number: number
	song: string
}

export const MuslotoPage = observer(() => {
	const isDark = themeStore.isDark

	const [isAnimating, setIsAnimating] = useState(false)
	const [currentNumber, setCurrentNumber] = useState<number | null>(null)
	const [selectedSong, setSelectedSong] = useState<string | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isSeeking, setIsSeeking] = useState(false)
	const [remainingItems, setRemainingItems] = useState<LottoItem[]>(() => {
		// Загружаем состояние из localStorage при инициализации
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				return parsed.remainingItems || initialLottoItems.slice()
			} catch {
				return initialLottoItems.slice()
			}
		}
		return initialLottoItems.slice()
	})
	const [isGameOver, setIsGameOver] = useState(() => {
		// Загружаем состояние игры из localStorage
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				return parsed.isGameOver || false
			} catch {
				return false
			}
		}
		return false
	})

	const audioRef = useRef<HTMLAudioElement>(null)
	const intervalRef = useRef<number | null>(null)

	// Сохраняем состояние в localStorage при изменении
	useEffect(() => {
		const gameState = {
			remainingItems,
			isGameOver,
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
	}, [remainingItems, isGameOver])

	const pickWinner = () => {
		if (remainingItems.length === 0) {
			setIsGameOver(true)
			return null
		}
		const randomIndex = Math.floor(Math.random() * remainingItems.length)
		const winner = remainingItems[randomIndex]
		setRemainingItems((prev) => prev.filter((_, i) => i !== randomIndex))
		return winner
	}

	const startLotto = () => {
		if (isAnimating || isGameOver) return

		setIsPlaying(false)
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
		}

		setIsAnimating(true)
		setCurrentNumber(null)
		setSelectedSong(null)
		setCurrentTime(0)
		setDuration(0)

		let ticks = 0
		const totalTicks = 15

		intervalRef.current = window.setInterval(() => {
			const fakeIndex = Math.floor(Math.random() * initialLottoItems.length)
			setCurrentNumber(initialLottoItems[fakeIndex].number)
			ticks++

			if (ticks >= totalTicks) {
				clearInterval(intervalRef.current!)
				intervalRef.current = null

				const winner = pickWinner()
				if (winner) {
					setCurrentNumber(winner.number)
					setSelectedSong(winner.song)
					setIsPlaying(true)
				}
				setIsAnimating(false)
			}
		}, 80)
	}

	const togglePlayPause = () => {
		if (!audioRef.current || !selectedSong) return
		if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play().catch(() => {})
		}
		setIsPlaying(!isPlaying)
	}

	const stopMusic = () => {
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
		}
		setIsPlaying(false)
		setCurrentTime(0)
	}

	const resetGame = () => {
		setRemainingItems(initialLottoItems.slice())
		setIsGameOver(false)
		setCurrentNumber(null)
		setSelectedSong(null)
		setIsPlaying(false)
		setCurrentTime(0)
		setDuration(0)
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.currentTime = 0
		}
		// Очищаем localStorage
		localStorage.removeItem(STORAGE_KEY)
	}

	useEffect(() => {
		if (selectedSong && audioRef.current) {
			audioRef.current.src = selectedSong
		}
	}, [selectedSong])

	useEffect(() => {
		if (!audioRef.current || !selectedSong) return

		if (isPlaying) {
			audioRef.current.play().catch(() => {})
		} else {
			audioRef.current.pause()
		}
	}, [isPlaying, selectedSong])

	useEffect(() => {
		if (!audioRef.current) return

		const audio = audioRef.current

		const updateTime = () => {
			if (!isSeeking) {
				setCurrentTime(audio.currentTime)
			}
		}

		const updateDuration = () => setDuration(audio.duration || 0)
		const handleEnded = () => setIsPlaying(false)

		audio.addEventListener('timeupdate', updateTime)
		audio.addEventListener('loadedmetadata', updateDuration)
		audio.addEventListener('durationchange', updateDuration)
		audio.addEventListener('ended', handleEnded)

		return () => {
			audio.removeEventListener('timeupdate', updateTime)
			audio.removeEventListener('loadedmetadata', updateDuration)
			audio.removeEventListener('durationchange', updateDuration)
			audio.removeEventListener('ended', handleEnded)
		}
	}, [selectedSong])

	return (
		<MainLayout withoutPadding>
			<div className="relative min-h-screen">
				<AnimatedBackground />

				<div className="relative z-10 flex flex-col items-center justify-center gap-10 max-w-4xl mx-auto py-2">
					<div
						className={`text-xl font-semibold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
					>
						Осталось бочонков: {remainingItems.length} из {initialLottoItems.length}
					</div>

					<motion.div
						className={`text-9xl font-black border border-gray-500 tabular-nums backdrop-blur-sm bg-white/5 px-8 py-4 rounded-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}
						animate={isAnimating ? { rotate: [0, 360], opacity: [1, 0.7, 1] } : {}}
						transition={{ duration: 0.25, ease: 'easeInOut', repeat: isAnimating ? Infinity : 0 }}
					>
						{currentNumber ?? '?'}
					</motion.div>

					<div className="flex gap-8 flex-wrap justify-center">
						<button
							onClick={startLotto}
							disabled={isAnimating || isGameOver}
							className={`
								px-12 py-6 rounded-3xl text-2xl font-bold tracking-wider shadow-2xl
								transition-all duration-300 transform backdrop-blur-sm
								${isAnimating || isGameOver ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
								bg-gradient-to-r from-pink-500 to-violet-600 text-white
							`}
						>
							{isAnimating ? 'КРУТИТСЯ...' : 'КРУТИТЬ БУРМАЛДУ!'}
						</button>

						<button
							onClick={resetGame}
							className={`
								px-8 py-4 rounded-2xl text-lg font-bold tracking-wider shadow-xl
								transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm
								bg-gradient-to-r from-red-500 to-orange-600 text-white
							`}
						>
							СБРОС ИГРЫ
						</button>
					</div>

					{isGameOver && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							className="text-4xl text-red-400 bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-xl text-center"
						>
							Все бочонки кончились! 🎉
						</motion.div>
					)}

					{selectedSong && !isGameOver && (
						<motion.div
							className="w-full"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.6 }}
						>
							<Player
								selectedSong={selectedSong}
								stopMusic={stopMusic}
								togglePlayPause={togglePlayPause}
								setIsSeeking={setIsSeeking}
								setCurrentTime={setCurrentTime}
								isPlaying={isPlaying}
								audioRef={audioRef}
								currentTime={currentTime}
								duration={duration}
							/>
						</motion.div>
					)}

					<audio ref={audioRef} className="hidden" />
				</div>
			</div>
		</MainLayout>
	)
})
