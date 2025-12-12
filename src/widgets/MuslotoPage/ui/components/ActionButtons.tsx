import type { FC } from 'react'

interface IProps {
	stopMusic: () => void
	togglePlayPause: () => void
	isPlaying: boolean
}

const ActionButtons: FC<IProps> = ({ stopMusic, togglePlayPause, isPlaying }) => {
	return (
		<div className="flex justify-center items-center gap-8">
			<button
				onClick={stopMusic}
				className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl"
			>
				<svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
					<rect x="6" y="6" width="12" height="12" rx="2" />
				</svg>
			</button>

			<button
				onClick={togglePlayPause}
				className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl"
			>
				{isPlaying ? (
					<svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="4" width="4" height="16" rx="1" />
						<rect x="14" y="4" width="4" height="16" rx="1" />
					</svg>
				) : (
					<svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7L8 5z" />
					</svg>
				)}
			</button>
		</div>
	)
}

export default ActionButtons
