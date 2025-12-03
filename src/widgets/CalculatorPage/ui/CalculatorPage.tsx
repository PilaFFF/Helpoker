import { MainLayout } from '@/shared/ui'
import { Card as AntCard, Typography, Space, Button, Divider, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { makeDeck, removeCards, drawRandom } from '@/shared/lib/poker/deck'
import { ranks, suits } from '@/shared/lib/poker/types'
import type { ActiveSlot, Card } from '@/shared/lib/poker/types'
import { compareScores, evaluateSeven } from '@/shared/lib/poker/evaluator'
import { PlayingCard } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

export const CalculatorPage = observer(() => {
	const isDark = themeStore.isDark

	const [hole, setHole] = useState<Array<Card | null>>([null, null])
	const [board, setBoard] = useState<Array<Card | null>>([null, null, null, null, null])
	const [activeSlot, setActiveSlot] = useState<ActiveSlot>({ type: 'hole', index: 0 })
	const [trials, setTrials] = useState<number>(5000)
	const selectedSet = useMemo(() => {
		const picked = hole.concat(board).filter((c): c is Card => Boolean(c))
		return new Set(picked.map((c) => `${c.rank}${c.suit}`))
	}, [hole, board])

	const onPick = (card: Card): void => {
		if (selectedSet.has(`${card.rank}${card.suit}`)) return
		if (activeSlot.type === 'hole') {
			const next = [...hole]
			next[activeSlot.index] = card
			setHole(next)
			setActiveSlot({ type: 'hole', index: activeSlot.index === 0 ? 1 : 0 })
		} else {
			const nextB = [...board]
			nextB[activeSlot.index] = card
			setBoard(nextB)
			if (activeSlot.index < 4) setActiveSlot({ type: 'board', index: activeSlot.index + 1 })
		}
	}

	const clearSlot = (type: 'hole' | 'board', index: number): void => {
		if (type === 'hole') {
			const next = [...hole]
			next[index] = null
			setHole(next)
		} else {
			const next = [...board]
			next[index] = null
			setBoard(next)
		}
		setActiveSlot({ type, index })
	}

	interface SimResult {
		equity: number
		runs: number
	}
	const simulate = (): SimResult => {
		const h = hole.filter((c): c is Card => Boolean(c))
		if (h.length !== 2) return { equity: 0, runs: 0 }
		const b = board.filter((c): c is Card => Boolean(c))

		let wins = 0,
			ties = 0
		const baseDeck = removeCards(makeDeck(), h.concat(b))
		const needBoard = 5 - b.length

		for (let t = 0; t < trials; t++) {
			const deck = baseDeck.slice()
			const opp = drawRandom(deck, 2)
			const remaining = removeCards(deck, opp)
			const restBoard = drawRandom(remaining, needBoard)
			const fullBoard = b.concat(restBoard)
			const myScore = evaluateSeven(h.concat(fullBoard))
			const oppScore = evaluateSeven(opp.concat(fullBoard))
			const cmp = compareScores(myScore, oppScore)
			if (cmp > 0) wins++
			else if (cmp === 0) ties++
		}
		const equity = (wins + ties * 0.5) / trials
		return { equity, runs: trials }
	}

	const result = simulate()

	useEffect(() => {
		console.log('isDark', isDark)
	}, [isDark])

	return (
		<MainLayout title="Калькулятор Equity">
			<Space direction="vertical" size="large" className="w-full">
				<AntCard>
					<Space direction="vertical" size="middle" className="w-full">
						<Typography.Title level={4} className="!m-0">
							Борд
						</Typography.Title>
						<div className="flex gap-10 justify-between">
							<div className="flex gap-3">
								{board.map((card, i) => (
									<div key={`b${i}`} className="flex items-center gap-2">
										{card ? (
											<div className="flex flex-col">
												<PlayingCard
													card={card}
													variant="large"
													selected={activeSlot.type === 'board' && activeSlot.index === i}
													onClick={() => setActiveSlot({ type: 'board', index: i })}
												/>

												{card && (
													<Button size="small" type="text" onClick={() => clearSlot('board', i)}>
														Очистить
													</Button>
												)}
											</div>
										) : (
											<button
												type="button"
												className={`w-20 h-28 rounded-xl border ${activeSlot.type === 'board' && activeSlot.index === i ? 'border-indigo-500' : 'border-gray-300'} bg-white text-gray-500`}
												onClick={() => setActiveSlot({ type: 'board', index: i })}
											>
												{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}
											</button>
										)}
									</div>
								))}
							</div>

							<div
								className={classNames('flex flex-col flex-1 shadow-inner px-8 rounded-xl border-[1px]', {
									'border-green-200 bg-green-300': !isDark,
									'border-green-800 bg-green-950': isDark,
								})}
							>
								<Typography.Title level={4} className="!mt-4">
									Equity: {(result.equity * 100).toFixed(1)}%
								</Typography.Title>
								<Typography.Text type="secondary">Против случайного оппонента, прогон: {result.runs}</Typography.Text>
							</div>
						</div>
						<Divider className="!my-2" />
						<Typography.Title level={4} className="!m-0">
							Ваши карты
						</Typography.Title>
						<div className="flex gap-3">
							{hole.map((c, i) => (
								<div key={`h${i}`} className="flex items-center gap-2">
									{c ? (
										<div className="flex flex-col">
											<PlayingCard
												card={c}
												variant="large"
												selected={activeSlot.type === 'hole' && activeSlot.index === i}
												onClick={() => setActiveSlot({ type: 'hole', index: i })}
											/>
											{c && (
												<Button size="small" type="text" onClick={() => clearSlot('hole', i)}>
													Очистить
												</Button>
											)}
										</div>
									) : (
										<button
											type="button"
											className={`w-20 h-28 rounded-xl border ${activeSlot.type === 'hole' && activeSlot.index === i ? 'border-indigo-500' : 'border-gray-300'} bg-white text-gray-500`}
											onClick={() => setActiveSlot({ type: 'hole', index: i })}
										>
											Выбрать
										</button>
									)}
								</div>
							))}
						</div>

						<Divider className="!my-2" />
						<Typography.Title level={5} className="!m-0">
							Выбор карты
						</Typography.Title>
						<div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
							{suits.map((s) => (
								<div key={s} className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center">
									{/* <span className={classNames('text-4xl', getSuitColor(s))}>{suitToLabel(s)}</span> */}
									<div className="flex flex-wrap gap-2 mt-2">
										{ranks.map((r) => {
											const card: Card = { rank: r, suit: s }
											const disabled = selectedSet.has(`${card.rank}${card.suit}`)
											return (
												<Tooltip key={`${r}${s}`} title={disabled ? 'Выбрано' : 'Добавить'}>
													<span>
														<PlayingCard card={card} variant="small" disabled={disabled} onClick={() => onPick(card)} />
													</span>
												</Tooltip>
											)
										})}
									</div>
								</div>
							))}
						</div>

						<Divider />
						<Space>
							<Typography.Text>Сэмплов: {trials}</Typography.Text>
							<Button onClick={() => setTrials((t) => Math.min(20000, t + 2000))}>+2000</Button>
							<Button onClick={() => setTrials((t) => Math.max(1000, t - 2000))}>-2000</Button>
						</Space>
					</Space>
				</AntCard>
			</Space>
		</MainLayout>
	)
})
