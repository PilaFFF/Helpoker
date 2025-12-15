import { MainLayout } from '@/shared/ui'
import { Typography, Divider, Select, InputNumber, Drawer } from 'antd'
import { useMemo, useState } from 'react'
import { makeDeck, removeCards, drawRandom } from '@/shared/lib/poker/deck'
import { HandCategory } from '@/shared/lib/poker/types'
import type { ActiveSlot, Card } from '@/shared/lib/poker/types'
import { compareScores, evaluateSeven } from '@/shared/lib/poker/evaluator'
import { CardPickerGrid } from '@/shared/ui/CardPickerGrid'
import { HandBoardDisplay } from '@/shared/ui/HandBoardDisplay'
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
	const [isPickerOpen, setIsPickerOpen] = useState(false)

	const selectedSet = useMemo(() => {
		const picked = hole.concat(board).filter((c): c is Card => Boolean(c))
		return new Set(picked.map((c) => `${c.rank}${c.suit}`))
	}, [hole, board])

	const onPick = (card: Card) => {
		if (selectedSet.has(`${card.rank}${card.suit}`)) return

		if (activeSlot.type === 'hole') {
			const next = [...hole]
			next[activeSlot.index] = card
			setHole(next)
			setActiveSlot({ type: 'hole', index: activeSlot.index === 0 ? 1 : 0 })
		} else {
			const next = [...board]
			next[activeSlot.index] = card
			setBoard(next)
			if (activeSlot.index < 4) setActiveSlot({ type: 'board', index: activeSlot.index + 1 })
		}

		setIsPickerOpen(false)
	}

	const clearSlot = (type: 'hole' | 'board', index: number) => {
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
	}, [hole, board, targetHand])

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
				? `Эквити (${(result.equity * 100).toFixed(1)}%) > шанс банка (${(potOdds * 100).toFixed(1)}%)`
				: `Эквити (${(result.equity * 100).toFixed(1)}%) < шанс банка (${(potOdds * 100).toFixed(1)}%)`,
			shouldCall,
		}
	}, [result.equity, potOdds])

	return (
		<MainLayout title="Калькулятор Equity">
			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-col gap-6 items-end md:flex-row">
					<div className="flex flex-col gap-6">
						<Typography.Title level={4} className="!m-0">
							Борд
						</Typography.Title>

						<HandBoardDisplay
							board={board}
							activeSlot={activeSlot}
							setActiveSlot={setActiveSlot}
							clearSlot={clearSlot}
							flopTurnRiverLabels
							onEmptyClick={() => setIsPickerOpen(true)}
						/>
					</div>

					<div
						className={classNames(
							'flex flex-col lg:flex-row gap-1 p-4 rounded-xl border',
							isDark ? 'bg-green-950/50 border-green-800' : 'bg-green-50 border-green-200',
						)}
					>
						<div className="flex flex-col">
							<Typography.Title level={4} className="!mt-0">
								Equity: {(result.equity * 100).toFixed(1)}%
							</Typography.Title>
							<Typography.Text className="text-sm">
								Против случайного оппонента, прогонов: {result.runs}
							</Typography.Text>
							<Typography.Text className="text-sm">
								<strong>Комбинация: {result.targetHandLabel}</strong> ({result.filteredRuns} прогонов)
							</Typography.Text>
							{potOdds > 0 && (
								<Typography.Text className="mt-2 text-sm">Шансы банка: {(potOdds * 100).toFixed(1)}%</Typography.Text>
							)}
						</div>

						{recommendation && (
							<div
								className={classNames(
									'mt-4 lg:mt-0 p-2 rounded-lg self-center border w-full lg:w-auto',
									recommendation.shouldCall && !isDark
										? 'bg-green-100 border-green-500'
										: recommendation.shouldCall && isDark
											? 'bg-green-900 border-green-700'
											: !isDark
												? 'bg-red-100 border-red-500'
												: 'bg-red-900 border-red-700',
								)}
							>
								<Typography.Title level={5} className="!mb-2">
									Рекомендация: {recommendation.action}
								</Typography.Title>
								<Typography.Text className="text-sm">{recommendation.reason}</Typography.Text>
							</div>
						)}
					</div>
				</div>

				<Divider className="!my-4" />

				{/* Ваша рука */}
				<div className="flex flex-col gap-6">
					<Typography.Title level={4} className="!m-0">
						Ваши карты
					</Typography.Title>

					<div className="flex flex-col lg:flex-row gap-8">
						<HandBoardDisplay
							hole={hole}
							activeSlot={activeSlot}
							setActiveSlot={setActiveSlot}
							clearSlot={clearSlot}
							onEmptyClick={() => setIsPickerOpen(true)}
						/>

						<div className="flex flex-col gap-6 flex-1">
							<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
								<Typography.Title level={5} className="!m-0">
									Эквити для комбинации:
								</Typography.Title>
								<Select value={targetHand} onChange={setTargetHand} className="w-full max-w-xs" options={handOptions} />
							</div>

							<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
								<Typography.Title level={5} className="!m-0">
									Банк:
								</Typography.Title>
								<InputNumber
									min={0}
									value={potSize}
									onChange={(v) => setPotSize(v ?? 0)}
									addonAfter="💎"
									className="flex-1"
								/>
								<Typography.Title level={5} className="!m-0">
									Ставка:
								</Typography.Title>
								<InputNumber
									min={0}
									value={betSize}
									onChange={(v) => setBetSize(v ?? 0)}
									addonAfter="💎"
									className="flex-1"
								/>
							</div>
						</div>
					</div>
				</div>

				<Drawer
					title="Выбор карты"
					placement="bottom"
					height="80vh"
					open={isPickerOpen}
					onClose={() => setIsPickerOpen(false)}
					styles={{ body: { padding: 16 } }}
				>
					<CardPickerGrid isDark={isDark} selectedSet={selectedSet} onPick={onPick} />
				</Drawer>
			</div>
		</MainLayout>
	)
})
