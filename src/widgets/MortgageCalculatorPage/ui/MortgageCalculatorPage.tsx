import { MainLayout, QuestionOutlined, DepositCalculatorDrawer } from '@/shared/ui'
import type { DepositState } from '@/shared/ui/DepositCalculatorDrawer'
import { Typography, InputNumber, Form, Table, Space, Tooltip, Button, Checkbox } from 'antd'
import { useMemo, useState, useCallback } from 'react'
import { buildSchedule } from '@/shared/lib/mortgage/calc'
import { simpleInterest, compoundInterest, depositSchedule } from '@/shared/lib/deposit/calc'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

const formatMoney = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(v)
const formatMoneyDeposit = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(v)

export const MortgageCalculatorPage = observer(() => {
	const isDark = themeStore.isDark

	const [totalAmount, setTotalAmount] = useState(8_000_000)
	const [annualRate, setAnnualRate] = useState(18)
	const [termYears, setTermYears] = useState(20)
	const [downPayment, setDownPayment] = useState(0)
	const [monthlyExtra, setMonthlyExtra] = useState(0)
	const [useDepositInExtra, setUseDepositInExtra] = useState(false)
	const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
	const [depositState, setDepositState] = useState<DepositState>({
		principal: 500_000,
		annualRate: 16,
		termMonths: 12,
		compoundFrequency: 'monthly',
		activeTab: 'simple',
		taxPercent: 0,
	})

	const depositResult = useMemo(() => {
		if (depositState.activeTab === 'simple') {
			return simpleInterest(depositState.principal, depositState.annualRate, depositState.termMonths)
		}
		return compoundInterest(
			depositState.principal,
			depositState.annualRate,
			depositState.termMonths,
			depositState.compoundFrequency,
		)
	}, [depositState])

	const taxPercent = depositState.taxPercent ?? 0
	const depositInterestAfterTax = depositResult.interest * (1 - taxPercent / 100)

	const depositScheduleRows = useMemo(
		() =>
			depositSchedule(
				depositState.principal,
				depositState.annualRate,
				depositState.termMonths,
				depositState.compoundFrequency,
				depositState.activeTab === 'simple',
			),
		[depositState],
	)

	const getMonthlyExtra = useCallback(
		(month: number) => {
		const base = monthlyExtra
		if (!useDepositInExtra || depositScheduleRows.length === 0) return base
		const row = depositScheduleRows[month - 1]
		const depositInterestThisMonth = row ? row.interest * (1 - taxPercent / 100) : 0
		return base + depositInterestThisMonth
		},
		[monthlyExtra, useDepositInExtra, depositScheduleRows, taxPercent],
	)

	const result = useMemo(() => {
		return buildSchedule({
			totalAmount,
			annualRatePercent: annualRate,
			termYears,
			downPayment,
			monthlyExtra: useDepositInExtra ? 0 : monthlyExtra,
			getMonthlyExtra: useDepositInExtra ? getMonthlyExtra : undefined,
		})
	}, [totalAmount, annualRate, termYears, downPayment, monthlyExtra, useDepositInExtra, getMonthlyExtra])

	const totalInterest = useMemo(() => result.schedule.reduce((acc, row) => acc + row.interest, 0), [result.schedule])
	const totalPaidToBank = result.loanAmount + totalInterest

	const summaryLabelWidth = '11.5rem'

	const columns = [
		{ title: 'Месяц', dataIndex: 'month', key: 'month', width: 80, render: (v: number) => v },
		{
			title: 'Остаток долга',
			dataIndex: 'balanceStart',
			key: 'balanceStart',
			render: (v: number) => formatMoney(v),
		},
		{
			title: 'Проценты за месяц',
			dataIndex: 'interest',
			key: 'interest',
			render: (v: number) => formatMoney(v),
		},
		{
			title: (
				<div>
					<span>Всего в счёт тела</span>
					<Tooltip title="Вся сумма, на которую уменьшается долг в этом месяце: часть из обязательного платежа + досрочка (свои средства и/или доход со вклада).">
						<QuestionOutlined style={{ color: '#1777ff' }} />
					</Tooltip>
				</div>
			),
			key: 'toPrincipalTotal',
			render: (_: unknown, row: { month: number; toPrincipal: number; extraPayment: number }) => {
				const total = row.toPrincipal + row.extraPayment
				const depositRow = useDepositInExtra ? depositScheduleRows[row.month - 1] : null
				const depositPart =
					depositRow && row.extraPayment > 0
						? Math.min(depositRow.interest * (1 - taxPercent / 100), row.extraPayment)
						: 0
				const manualPart = row.extraPayment - depositPart
				return (
					<div className="flex flex-wrap items-center gap-1">
						<span
							className={classNames(
								'rounded px-1.5 py-0.5 text-xs',
								isDark ? 'bg-blue-900/60 text-blue-200' : 'bg-blue-100 text-blue-900',
							)}
							title="Из обязательного платежа"
						>
							{formatMoney(row.toPrincipal)}
						</span>
						{row.extraPayment > 0 && (
							<>
								<span className="opacity-60">+</span>
								{depositPart > 0 && manualPart > 0 ? (
									<>
										<span
											className={classNames(
												'rounded px-1.5 py-0.5 text-xs',
												isDark ? 'bg-emerald-900/60 text-emerald-200' : 'bg-emerald-100 text-emerald-900',
											)}
											title="Досрочка (свои)"
										>
											{formatMoney(manualPart)}
										</span>
										<span className="opacity-60">+</span>
										<span
											className={classNames(
												'rounded px-1.5 py-0.5 text-xs',
												isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100 text-amber-900',
											)}
											title="Со вклада"
										>
											{formatMoney(depositPart)}
										</span>
									</>
								) : (
									<span
										className={classNames(
											'rounded px-1.5 py-0.5 text-xs',
											depositPart > 0
												? isDark
													? 'bg-amber-900/60 text-amber-200'
													: 'bg-amber-100 text-amber-900'
												: isDark
													? 'bg-emerald-900/60 text-emerald-200'
													: 'bg-emerald-100 text-emerald-900',
										)}
										title={depositPart > 0 ? 'Досрочка со вклада' : 'Досрочка'}
									>
										{formatMoney(row.extraPayment)}
									</span>
								)}
							</>
						)}
						<span className="font-medium ml-0.5">= {formatMoney(total)}</span>
					</div>
				)
			},
		},
		{
			title: 'Новый остаток',
			dataIndex: 'balanceEnd',
			key: 'balanceEnd',
			render: (v: number) => <strong>{formatMoney(v)}</strong>,
		},
	]

	return (
		<MainLayout title="Калькулятор ипотеки">
			<Space direction="vertical" size="large" className="w-full">
				<div
					className={classNames(
						'p-4 rounded-xl border',
						isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-50 border-slate-200',
					)}
				>
					<Typography.Title level={5} className="!mt-0 !mb-4">
						Параметры кредита
					</Typography.Title>
					<Form
						layout="vertical"
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-end gap-4 [&_.ant-form-item-control-input]:min-w-0 [&_.ant-form-item-control-input]:w-full [&_.ant-input-number]:!w-full"
					>
						<Form.Item label="Стоимость квартиры (тело кредита), ₽">
							<InputNumber
								className="w-full"
								min={1}
								value={totalAmount}
								onChange={(v) => setTotalAmount(v ?? 0)}
								formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
								parser={(v) => Number(v?.replace(/\s/g, '') ?? 0)}
							/>
						</Form.Item>
						<Form.Item label="Процентная ставка, % годовых">
							<InputNumber
								className="w-full"
								min={0.1}
								max={100}
								step={0.1}
								value={annualRate}
								onChange={(v) => setAnnualRate(v ?? 0)}
							/>
						</Form.Item>
						<Form.Item label="Срок ипотеки, лет">
							<InputNumber
								className="w-full"
								min={1}
								max={50}
								value={termYears}
								onChange={(v) => setTermYears(v ?? 0)}
							/>
						</Form.Item>
						<Form.Item label="Первый взнос, ₽">
							<InputNumber
								className="w-full"
								min={0}
								value={downPayment}
								onChange={(v) => setDownPayment(v ?? 0)}
								formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
								parser={(v) => Number(v?.replace(/\s/g, '') ?? 0)}
							/>
						</Form.Item>
						<Form.Item
							label={
								<div className="flex gap-1">
									<span>Досрочка каждый месяц</span>
									<Tooltip title="Сумма, которую вы платите сверх ежемесячного платежа в счёт тела кредита.">
										<QuestionOutlined className="ml-1 opacity-70" style={{ color: '#1777ff' }} />
									</Tooltip>
								</div>
							}
						>
							<InputNumber
								className="w-full"
								min={0}
								step={0.01}
								value={monthlyExtra}
								onChange={(v) => setMonthlyExtra(Math.max(0, v ?? 0))}
								formatter={(v) =>
									v != null && String(v).trim() !== ''
										? Number(v)
												.toFixed(2)
												.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
										: ''
								}
								parser={(v) => Number(v?.replace(/\s/g, '') ?? 0)}
							/>
						</Form.Item>
					</Form>
					<div className="mt-2 text-sm flex flex-col lg:flex-row gap-6">
						<div className="flex justify-start gap-1 flex-1 min-w-0">
							<div
								className="grid gap-y-1.5 items-baseline"
								style={{ gridTemplateColumns: `${summaryLabelWidth} 1fr` }}
							>
								<span>Сумма кредита:</span>
								<strong className="tabular-nums">{formatMoney(result.loanAmount)} ₽</strong>
								<span>Платёж в месяц:</span>
								<strong className="tabular-nums">{formatMoney(Math.round(result.monthlyPayment))} ₽</strong>
								<span>Срок выплаты:</span>
								<strong className="tabular-nums">
									{result.totalMonths} мес. (~{(result.totalMonths / 12).toFixed(1)} лет)
								</strong>
								<span>
									Итоговая сумма:
									<Tooltip title="Тело кредита + все проценты за весь срок">
										<QuestionOutlined className="ml-1 opacity-70" style={{ color: '#1777ff' }} />
									</Tooltip>
								</span>
								<strong className="tabular-nums">{formatMoney(Math.round(totalPaidToBank))} ₽</strong>
							</div>
							<div
								className="grid pl-3 ml-3 border-l border-slate-200 dark:border-slate-600 gap-y-1.5 items-baseline"
								style={{ gridTemplateColumns: `${summaryLabelWidth} 1fr` }}
							>
								<span>Доход (вклад{taxPercent > 0 ? ', после налога' : ''}):</span>
								<strong className="tabular-nums">{formatMoneyDeposit(depositInterestAfterTax)} ₽</strong>
								<span>Итого к получению:</span>
								<strong className="tabular-nums">
									{formatMoneyDeposit(depositState.principal + depositInterestAfterTax)} ₽
								</strong>
								<span className="col-span-2">
									<Tooltip title="Ежемесячный доход по вкладу (после налога) будет добавляться к вашей досрочке: в каждом месяце — начисленные за этот месяц проценты.">
										<Checkbox
											checked={useDepositInExtra}
											onChange={(e) => setUseDepositInExtra(e.target.checked)}
										>
											Учитывать доход вклада в досрочку
										</Checkbox>
									</Tooltip>
								</span>
								<Button
									type="link"
									size="small"
									onClick={() => setDepositDrawerOpen(true)}
									className="!px-0 !h-auto col-span-2"
								>
									Калькулятор вклада
								</Button>
							</div>
						</div>
					</div>
					<DepositCalculatorDrawer
						open={depositDrawerOpen}
						onClose={() => setDepositDrawerOpen(false)}
						state={depositState}
						onStateChange={setDepositState}
					/>
				</div>

				<div>
					<div className="flex gap-1">
						<Typography.Title level={5} className="!mt-0 !mb-2">
							График платежей по месяцам
						</Typography.Title>
					</div>
					<div className="flex flex-wrap items-center gap-4 mb-2 text-xs">
						<span className="flex items-center gap-1.5">
							<span className={classNames('inline-block w-3 h-3 rounded', isDark ? 'bg-blue-900/60' : 'bg-blue-100')} />
							Из платежа
						</span>
						<span className="flex items-center gap-1.5">
							<span
								className={classNames('inline-block w-3 h-3 rounded', isDark ? 'bg-emerald-900/60' : 'bg-emerald-100')}
							/>
							Досрочка (свои)
						</span>
						<span className="flex items-center gap-1.5">
							<span
								className={classNames('inline-block w-3 h-3 rounded', isDark ? 'bg-amber-900/60' : 'bg-amber-100')}
							/>
							Со вклада
						</span>
					</div>
					<Table
						size="small"
						columns={columns}
						dataSource={result.schedule.map((row) => ({ ...row, key: row.month }))}
						pagination={{
							pageSize: 12,
							showSizeChanger: true,
							pageSizeOptions: ['12', '24', '60', '120'],
							showTotal: (total) => `Всего месяцев: ${total}`,
						}}
						scroll={{ x: 700 }}
					/>
				</div>
			</Space>
		</MainLayout>
	)
})
