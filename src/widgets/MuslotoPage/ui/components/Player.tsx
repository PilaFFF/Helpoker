import type { FC } from 'react'
import ActionButtons from './ActionButtons'

const getTrackName = (path: string) => {
	const fileName = path.split('/').pop() || ''
	return fileName
		.replace(/\.[^/.]+$/, '')
		.replace(/_/g, ' ')
		.replace(/-/g, ' ')
}

const formatTime = (seconds: number) => {
	if (!seconds || !isFinite(seconds)) return '0:00'
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

interface IProps {
	selectedSong: string
	stopMusic: () => void
	togglePlayPause: () => void
	setIsSeeking: (isSeeking: boolean) => void
	setCurrentTime: (currentTime: number) => void
	audioRef: React.RefObject<HTMLAudioElement | null>
	currentTime: number
	duration: number
	isPlaying: boolean
}

const Player: FC<IProps> = ({
	selectedSong,
	stopMusic,
	togglePlayPause,
	setIsSeeking,
	setCurrentTime,
	isPlaying,
	audioRef,
	currentTime,
	duration,
}) => {
	return (
		<div className="w-full bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
			<div className="text-center mb-6">
				<div className="text-lg font-medium text-white/90 truncate md:px-10 md:text-3xl">
					🔥 {getTrackName(selectedSong)}
				</div>
			</div>

			<div className="mb-0">
				<input
					type="range"
					min="0"
					max={duration || 0}
					value={currentTime}
					step="0.1"
					onChange={(e) => {
						const newTime = Number(e.target.value)
						setCurrentTime(newTime)
						if (audioRef.current) {
							audioRef.current.currentTime = newTime
						}
					}}
					onMouseDown={() => setIsSeeking(true)}
					onMouseUp={() => setIsSeeking(false)}
					onTouchStart={() => setIsSeeking(true)}
					onTouchEnd={() => setIsSeeking(false)}
					className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer"
					style={{
						background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%, #374151 100%)`,
					}}
				/>
				<div className="flex justify-between text-sm text-white/70 mt-2 font-medium">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
			<ActionButtons stopMusic={stopMusic} togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
		</div>
	)
}

export default Player
