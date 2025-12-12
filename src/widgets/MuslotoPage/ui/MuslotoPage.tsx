import { MainLayout } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'
import { themeStore } from '@/shared/lib/theme'
import { useState, useEffect, useRef } from 'react'
import { lottoItems as initialLottoItems } from '../const/lottoItems.const'
import Player from './components/Player'

export const MuslotoPage = observer(() => {
	const isDark = themeStore.isDark

	const [isAnimating, setIsAnimating] = useState(false)
	const [currentNumber, setCurrentNumber] = useState<number | null>(null)
	const [selectedSong, setSelectedSong] = useState<string | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isSeeking, setIsSeeking] = useState(false)
	const [remainingItems, setRemainingItems] = useState(initialLottoItems.slice())
	const [isGameOver, setIsGameOver] = useState(false)

	const audioRef = useRef<HTMLAudioElement>(null)
	const intervalRef = useRef<number | null>(null)

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
		<MainLayout>
			<div className="flex flex-col items-center justify-center space-y-12 px-6 max-w-4xl mx-auto">
				<motion.div
					className={`text-9xl font-black tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}
					animate={isAnimating ? { rotate: [0, 360], scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
					transition={{ duration: 0.25, ease: 'easeInOut', repeat: isAnimating ? Infinity : 0 }}
				>
					{currentNumber ?? '?'}
				</motion.div>

				<button
					onClick={startLotto}
					disabled={isAnimating || isGameOver}
					className={`
            px-12 py-6 rounded-3xl text-2xl font-bold tracking-wider shadow-2xl
            transition-all duration-300 transform
            ${isAnimating || isGameOver ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
            bg-gradient-to-r from-pink-500 to-violet-600 text-white
          `}
				>
					{isAnimating ? 'КРУТИТСЯ...' : 'КРУТИТЬ БАРМАЛДУ!'}
				</button>

				{isGameOver && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className="text-4xl text-red-400 bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-xl"
					>
						Все бочонки кончились! 🎉
						<button
							onClick={resetGame}
							className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all hover:scale-105"
						>
							Новая игра
						</button>
					</motion.div>
				)}

				{selectedSong && !isGameOver && (
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
				)}

				<audio ref={audioRef} className="hidden" />
			</div>
		</MainLayout>
	)
})
