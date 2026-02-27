import { Drawer, Tabs, Form, InputNumber, Typography, Radio, Table } from 'antd'
import { useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'
import {
	simpleInterest,
	compoundInterest,
	depositSchedule,
	type CompoundFrequency,
} from '@/shared/lib/deposit/calc'

const formatMoney = (v: number) =>
	new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(v)

export interface DepositState {
	principal: number
	annualRate: number
	termMonths: number
	compoundFrequency: CompoundFrequency
	activeTab: 'simple' | 'compound'
	taxPercent: number
}

const defaultDepositState: DepositState = {
	principal: 500_000,
	annualRate: 16,
	termMonths: 12,
	compoundFrequency: 'monthly',
	activeTab: 'simple',
	taxPercent: 0,
}

interface DepositCalculatorDrawerProps {
	open: boolean
	onClose: () => void
	state?: DepositState
	onStateChange?: (state: DepositState) => void
}

export const DepositCalculatorDrawer = observer(
	({ open, onClose, state: controlledState, onStateChange }: DepositCalculatorDrawerProps) => {
		const isDark = themeStore.isDark
		const [internalState, setInternalState] = useState<DepositState>(defaultDepositState)
		const state = controlledState ?? internalState
		const setState = (next: Partial<DepositState>) => {
			const nextState = { ...state, ...next }
			if (onStateChange) onStateChange(nextState)
			else setInternalState(nextState)
		}

		const simpleResult = useMemo(
			() => simpleInterest(state.principal, state.annualRate, state.termMonths),
			[state.principal, state.annualRate, state.termMonths],
		)
		const compoundResult = useMemo(
			() =>
				compoundInterest(
					state.principal,
					state.annualRate,
					state.termMonths,
					state.compoundFrequency,
				),
			[state.principal, state.annualRate, state.termMonths, state.compoundFrequency],
		)

		const result = state.activeTab === 'simple' ? simpleResult : compoundResult
		const taxPercent = state.taxPercent ?? 0
		const interestAfterTax = result.interest * (1 - taxPercent / 100)
		const totalAfterTax = state.principal + interestAfterTax

		const scheduleRows = useMemo(
			() =>
				depositSchedule(
					state.principal,
					state.annualRate,
					state.termMonths,
					state.compoundFrequency,
					state.activeTab === 'simple',
				),
			[state.principal, state.annualRate, state.termMonths, state.compoundFrequency, state.activeTab],
		)

		return (
			<Drawer
				title="Калькулятор вклада (процент)"
				placement="right"
				width={400}
				open={open}
				onClose={onClose}
				styles={{ body: { paddingTop: 0 } }}
			>
				<Tabs
					activeKey={state.activeTab}
					onChange={(k) => setState({ activeTab: k as 'simple' | 'compound' })}
					items={[
						{ key: 'simple', label: 'Простой процент' },
						{ key: 'compound', label: 'Сложный процент' },
					]}
				/>

				<Form layout="vertical" className="mt-4">
					<Form.Item label="Сумма вклада, ₽">
						<InputNumber
							className="w-full"
							min={1}
							value={state.principal}
							onChange={(v) => setState({ principal: v ?? 0 })}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
							parser={(v) => Number(v?.replace(/\s/g, '') ?? 0)}
						/>
					</Form.Item>
					<Form.Item label="Процентная ставка, % годовых">
						<InputNumber
							className="w-full"
							min={0.01}
							max={100}
							step={0.1}
							value={state.annualRate}
							onChange={(v) => setState({ annualRate: v ?? 0 })}
						/>
					</Form.Item>
					<Form.Item label="Срок, мес.">
						<InputNumber
							className="w-full"
							min={1}
							max={600}
							value={state.termMonths}
							onChange={(v) => setState({ termMonths: v ?? 0 })}
						/>
					</Form.Item>
					<Form.Item label="Налог, %">
						<InputNumber
							className="w-full"
							min={0}
							max={100}
							step={0.1}
							value={state.taxPercent}
							onChange={(v) => setState({ taxPercent: v ?? 0 })}
						/>
					</Form.Item>
					{state.activeTab === 'compound' && (
						<Form.Item label="Капитализация">
							<Radio.Group
								value={state.compoundFrequency}
								onChange={(e) => setState({ compoundFrequency: e.target.value })}
								options={[
									{ value: 'monthly', label: 'Раз в месяц' },
									{ value: 'yearly', label: 'Раз в год' },
								]}
							/>
						</Form.Item>
					)}
				</Form>

				<div
					className={classNames(
						'mt-6 p-4 rounded-xl border',
						isDark ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-50 border-slate-200',
					)}
				>
					<Typography.Title level={5} className="!mt-0 !mb-3">
						Результат
					</Typography.Title>
					<div className="flex flex-col gap-2 text-sm">
						{taxPercent > 0 && (
							<>
								<div className="flex justify-between">
									<span>Доход до налога:</span>
									<strong>{formatMoney(result.interest)} ₽</strong>
								</div>
								<div className="flex justify-between opacity-80">
									<span>Налог ({taxPercent}%):</span>
									<span>−{formatMoney(result.interest - interestAfterTax)} ₽</span>
								</div>
							</>
						)}
						<div className="flex justify-between">
							<span>{state.taxPercent > 0 ? 'Доход после налога:' : 'Доход (проценты):'}</span>
							<strong>{formatMoney(interestAfterTax)} ₽</strong>
						</div>
						<div className="flex justify-between">
							<span>Итого к получению:</span>
							<strong>{formatMoney(totalAfterTax)} ₽</strong>
						</div>
					</div>
				</div>

				<Typography.Title level={5} className="!mt-6 !mb-2">
					Начисление по месяцам
				</Typography.Title>
				<Table
					size="small"
					dataSource={scheduleRows.map((r) => ({ ...r, key: r.month }))}
					columns={[
						{ title: 'Месяц', dataIndex: 'month', key: 'month', width: 70, render: (v: number) => v },
						{
							title: 'Начислено за месяц',
							dataIndex: 'interest',
							key: 'interest',
							render: (v: number) => formatMoney(v),
						},
						{
							title: 'Остаток на конец',
							dataIndex: 'balanceEnd',
							key: 'balanceEnd',
							render: (v: number) => formatMoney(v),
						},
					]}
					pagination={{
						pageSize: 12,
						showSizeChanger: true,
						pageSizeOptions: ['12', '24', '60', '120'],
						showTotal: (total) => `Всего месяцев: ${total}`,
					}}
					scroll={{ x: 280 }}
				/>
			</Drawer>
		)
	},
)
