import { MainLayout } from '@/shared/ui'
import { Card as AntCard, Typography, Space, Button, Divider, Tooltip, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { makeDeck, removeCards, drawRandom } from '@/shared/lib/poker/deck'
// Важно: HandCategory должен быть доступен для использования в handOptions
import { HandCategory, ranks, suits } from '@/shared/lib/poker/types'
import type { ActiveSlot, Card } from '@/shared/lib/poker/types'
import { compareScores, evaluateSeven } from '@/shared/lib/poker/evaluator'
import { PlayingCard } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

// 1. Определение типа для выбранной комбинации (может быть 0 или любая HandCategory)
type TargetHandValue = 0 | HandCategory

// 2. Опции выбора, использующие HandCategory
const handOptions = [
	{ value: 0 as TargetHandValue, label: 'Все комбинации' }, // 0 для "Все комбинации"
	// Используем значения из HandCategory.
	// Если HandCategory — это числовой enum, то value будет числом.
	{ value: HandCategory.StraightFlush as TargetHandValue, label: 'Стрит-Флеш / Роял-Флеш' },
	{ value: HandCategory.FourKind as TargetHandValue, label: 'Каре' },
	{ value: HandCategory.FullHouse as TargetHandValue, label: 'Фулл-Хаус' },
	{ value: HandCategory.Flush as TargetHandValue, label: 'Флеш' },
	{ value: HandCategory.Straight as TargetHandValue, label: 'Стрит' },
	{ value: HandCategory.ThreeKind as TargetHandValue, label: 'Сет / Тройка' },
	{ value: HandCategory.TwoPair as TargetHandValue, label: 'Две пары' },
	{ value: HandCategory.OnePair as TargetHandValue, label: 'Пара' },
	{ value: HandCategory.HighCard as TargetHandValue, label: 'Старшая карта' },
]

export const CalculatorPage = observer(() => {
	const isDark = themeStore.isDark

	const [hole, setHole] = useState<Array<Card | null>>([null, null])
	const [board, setBoard] = useState<Array<Card | null>>([null, null, null, null, null])
	const [activeSlot, setActiveSlot] = useState<ActiveSlot>({ type: 'hole', index: 0 })
	const [trials, setTrials] = useState<number>(5000)
	// 3. Используем новый тип TargetHandValue
	const [targetHand, setTargetHand] = useState<TargetHandValue>(0)

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
		filteredRuns: number
		targetHandLabel: string
	}
	const simulate = (): SimResult => {
		const h = hole.filter((c): c is Card => Boolean(c))
		if (h.length !== 2)
			return {
				equity: 0,
				runs: 0,
				filteredRuns: 0,
				targetHandLabel: handOptions.find((o) => o.value === targetHand)?.label || 'Неизвестная',
			}
		const b = board.filter((c): c is Card => Boolean(c))

		let wins = 0,
			ties = 0,
			filteredRuns = 0
		const baseDeck = removeCards(makeDeck(), h.concat(b))
		const needBoard = 5 - b.length

		for (let t = 0; t < trials; t++) {
			const deck = baseDeck.slice()
			const opp = drawRandom(deck, 2)
			const remaining = removeCards(deck, opp)
			const restBoard = drawRandom(remaining, needBoard)
			const fullBoard = b.concat(restBoard)

			const myScore = evaluateSeven(h.concat(fullBoard))

			// 4. Сравнение теперь работает, потому что targetHand имеет совместимый тип
			const currentHandCategory = myScore.category

			const isTargetHand = targetHand === 0 || currentHandCategory === targetHand

			if (isTargetHand) {
				filteredRuns++
				const oppScore = evaluateSeven(opp.concat(fullBoard))
				const cmp = compareScores(myScore, oppScore)
				if (cmp > 0) wins++
				else if (cmp === 0) ties++
			}
		}

		const equity = filteredRuns > 0 ? (wins + ties * 0.5) / filteredRuns : 0

		return {
			equity,
			runs: trials,
			filteredRuns,
			targetHandLabel: handOptions.find((o) => o.value === targetHand)?.label || 'Неизвестная',
		}
	}

	const result = useMemo(() => simulate(), [hole, board, trials, targetHand])

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
												className={`w-20 h-28 rounded-xl border transition-colors duration-300 ${activeSlot.type === 'board' && activeSlot.index === i ? 'border-indigo-500 border-[2px] bg-white' : 'border-gray-300-[3px]'} bg-gray-300 shadow-inner text-gray-500`}
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
								<Typography.Text type="secondary">Против случайного оппонента, прогонов: {result.runs}</Typography.Text>
								<Typography.Text type="secondary">
									**Комбинация: {result.targetHandLabel}** ({result.filteredRuns} прогонов)
								</Typography.Text>
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
											className={`w-20 h-28 rounded-xl border transition-colors duration-300 ${activeSlot.type === 'hole' && activeSlot.index === i ? 'border-indigo-500 border-[2px] bg-white' : 'border-gray-300'} bg-gray-300 shadow-inner text-gray-500`}
											onClick={() => setActiveSlot({ type: 'hole', index: i })}
										>
											Выбрать
										</button>
									)}
								</div>
							))}
						</div>

						<Divider className="!my-2" />
						<Space direction="horizontal" align="center">
							<Typography.Title level={5} className="!m-0">
								Эквити для комбинации:
							</Typography.Title>
							<Select
								value={targetHand}
								onChange={(value: TargetHandValue) => setTargetHand(value)}
								style={{ width: 250 }}
								options={handOptions}
							/>
						</Space>

						<Divider className="!my-2" />
						<Typography.Title level={5} className="!m-0">
							Выбор карты
						</Typography.Title>
						<div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
							{suits.map((s) => (
								<div key={s} className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center">
									<div className="flex flex-wrap gap-2 mt-2">
										{ranks.map((r) => {
											const card: Card = { rank: r, suit: s }
											const disabled = selectedSet.has(`${card.rank}${card.suit}`)
											return (
												<Tooltip key={`${r}${s}`} title={disabled ? 'Выбрано' : 'Добавить'}>
													<span>
														<PlayingCard
															card={card}
															variant="small"
															disabled={disabled}
															isDark={isDark}
															onClick={() => onPick(card)}
														/>
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
