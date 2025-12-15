import { MainLayout } from '@/shared/ui'
import { Typography, Space, Button, Divider, Tooltip, Select, InputNumber } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { makeDeck, removeCards, drawRandom } from '@/shared/lib/poker/deck'
import { HandCategory, ranks, suits } from '@/shared/lib/poker/types'
import type { ActiveSlot, Card } from '@/shared/lib/poker/types'
import { compareScores, evaluateSeven } from '@/shared/lib/poker/evaluator'
import { PlayingCard } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

type TargetHandValue = 0 | HandCategory

const handOptions = [
	{ value: 0 as TargetHandValue, label: 'Все комбинации' },
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
	const trials = 5000
	const [targetHand, setTargetHand] = useState<TargetHandValue>(0)
	const [potSize, setPotSize] = useState<number>(100)
	const [betSize, setBetSize] = useState<number>(50)

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

	const result = useMemo(() => {
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
	}, [hole, board, trials, targetHand])

	const potOdds = useMemo(() => {
		if (betSize <= 0 || potSize <= 0) return 0
		return betSize / (potSize + betSize)
	}, [potSize, betSize])

	const recommendation = useMemo(() => {
		if (result.equity === 0 || potOdds === 0) return null
		const shouldCall = result.equity > potOdds
		return {
			action: shouldCall ? 'Колл' : 'Фолд',
			reason: shouldCall
				? `Ваше эквити (${(result.equity * 100).toFixed(1)}%) выше шансов банка (${(potOdds * 100).toFixed(1)}%)`
				: `Ваше эквити (${(result.equity * 100).toFixed(1)}%) ниже шансов банка (${(potOdds * 100).toFixed(1)}%)`,
			shouldCall,
		}
	}, [result.equity, potOdds])

	useEffect(() => {
		console.log('isDark', isDark)
	}, [isDark])

	return (
		<MainLayout title="Калькулятор Equity">
			<Space direction="vertical" size="large" className="w-full">
				<Space direction="vertical" size="middle" className="w-full">
					<Typography.Title level={4} className="!m-0">
						Борд
					</Typography.Title>
					<div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:justify-between">
						<div className="flex gap-2 sm:gap-3 flex-wrap">
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
											className={`w-16 h-22 sm:w-20 sm:h-28 rounded-xl border transition-colors duration-300 text-xs sm:text-sm ${activeSlot.type === 'board' && activeSlot.index === i ? 'border-indigo-500 border-[2px] bg-white' : 'border-gray-300-[3px]'} bg-gray-300 shadow-inner text-gray-500`}
											onClick={() => setActiveSlot({ type: 'board', index: i })}
										>
											{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}
										</button>
									)}
								</div>
							))}
						</div>
						<div className="flex flex-col flex-1 min-w-0">
							<div
								className={classNames(
									'flex flex-col lg:flex-row flex-1 shadow-inner p-4 rounded-xl border-[1px] gap-4',
									{
										'border-green-200 bg-green-300': !isDark,
										'border-green-800 bg-green-950': isDark,
									},
								)}
							>
								<div className="flex flex-col flex-1">
									<Typography.Title level={4} className="!mt-0 lg:!mt-4">
										Equity: {(result.equity * 100).toFixed(1)}%
									</Typography.Title>
									<Typography.Text className="text-xs sm:text-sm">
										Против случайного оппонента, прогонов: {result.runs}
									</Typography.Text>
									<Typography.Text className="text-xs sm:text-sm">
										**Комбинация: {result.targetHandLabel}** ({result.filteredRuns} прогонов)
									</Typography.Text>
									{potOdds > 0 && (
										<Typography.Text className="!mt-2 text-xs sm:text-sm">
											Шансы банка: {(potOdds * 100).toFixed(1)}%
										</Typography.Text>
									)}
								</div>

								{recommendation && (
									<div
										className={classNames(
											'mt-2 lg:mt-4 p-3 lg:p-4 rounded-lg border-[1px] lg:self-center w-full lg:w-auto',
											{
												'border-green-500 bg-green-100': recommendation.shouldCall && !isDark,
												'border-green-700 bg-green-900': recommendation.shouldCall && isDark,
												'border-red-500 bg-red-100': !recommendation.shouldCall && !isDark,
												'border-red-700 bg-red-900': !recommendation.shouldCall && isDark,
											},
										)}
									>
										<Typography.Title level={5} className="!m-0 !mb-2 text-sm lg:text-base">
											Рекомендация: {recommendation.action}
										</Typography.Title>
										<Typography.Text className="text-xs sm:text-sm">{recommendation.reason}</Typography.Text>
									</div>
								)}
							</div>
						</div>
					</div>
					<Divider className="!my-2" />
					<Typography.Title level={4} className="!m-0">
						Ваши карты
					</Typography.Title>
					<div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
						<div className="flex gap-2 sm:gap-3">
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
											className={`w-16 h-22 sm:w-20 sm:h-28 rounded-xl border transition-colors duration-300 text-xs sm:text-sm ${activeSlot.type === 'hole' && activeSlot.index === i ? 'border-indigo-500 border-[2px] bg-white' : 'border-gray-300'} bg-gray-300 shadow-inner text-gray-500`}
											onClick={() => setActiveSlot({ type: 'hole', index: i })}
										>
											Выбрать
										</button>
									)}
								</div>
							))}
						</div>
						<div className="flex flex-col gap-3 sm:gap-4 flex-1">
							<div className="w-full sm:flex-row sm:items-center">
								<Typography.Title level={5} className="!m-0 text-sm sm:text-base">
									Эквити для комбинации:
								</Typography.Title>
								<Select
									value={targetHand}
									onChange={(value: TargetHandValue) => setTargetHand(value)}
									style={{ width: '100%', maxWidth: 250 }}
									options={handOptions}
								/>
							</div>
							<div className="w-full sm:flex-row sm:items-center">
								<Typography.Title level={5} className="!m-0 text-sm sm:text-base">
									Банк:
								</Typography.Title>
								<InputNumber
									min={0}
									value={potSize}
									onChange={(value) => setPotSize(value ?? 0)}
									className="flex-1"
									addonAfter="💎"
								/>
								<Typography.Title level={5} className="!m-0 text-sm sm:text-base">
									Ставка:
								</Typography.Title>
								<InputNumber
									min={0}
									value={betSize}
									onChange={(value) => setBetSize(value ?? 0)}
									className="flex-1"
									addonAfter="💎"
								/>
							</div>
						</div>
					</div>

					<Divider className="!my-2" />
					<Typography.Title level={5} className="!m-0">
						Выбор карты
					</Typography.Title>
					<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
						{suits.map((s) => (
							<div key={s} className="col-span-1 flex flex-col items-center justify-center">
								<div className="flex flex-wrap gap-1 sm:gap-2 mt-2 justify-center">
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
				</Space>
			</Space>
		</MainLayout>
	)
})
