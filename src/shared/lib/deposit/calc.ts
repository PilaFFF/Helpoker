export type CompoundFrequency = 'yearly' | 'monthly'

/** Строка помесячного графика вклада */
export interface DepositScheduleRow {
	month: number
	balanceStart: number
	interest: number
	balanceEnd: number
}

/** Простой процент: доход = P * (rate/100) * (months/12), итого = P + доход */
export function simpleInterest(principal: number, annualRatePercent: number, termMonths: number) {
	if (principal <= 0 || termMonths <= 0) return { interest: 0, total: principal }
	const years = termMonths / 12
	const interest = principal * (annualRatePercent / 100) * years
	return { interest, total: principal + interest }
}

/** Сложный процент: итого = P * (1 + r)^n, доход = итого - P */
export function compoundInterest(
	principal: number,
	annualRatePercent: number,
	termMonths: number,
	frequency: CompoundFrequency,
) {
	if (principal <= 0 || termMonths <= 0) return { interest: 0, total: principal }
	if (frequency === 'yearly') {
		const years = termMonths / 12
		const total = principal * Math.pow(1 + annualRatePercent / 100, years)
		return { interest: total - principal, total }
	}
	const ratePerMonth = annualRatePercent / 100 / 12
	const total = principal * Math.pow(1 + ratePerMonth, termMonths)
	return { interest: total - principal, total }
}

/** Помесячный график для простого процента: каждый месяц начисляется P * (rate/12) */
export function simpleInterestSchedule(
	principal: number,
	annualRatePercent: number,
	termMonths: number,
): DepositScheduleRow[] {
	if (principal <= 0 || termMonths <= 0) return []
	const monthlyInterest = (principal * (annualRatePercent / 100)) / 12
	const rows: DepositScheduleRow[] = []
	for (let m = 1; m <= termMonths; m++) {
		rows.push({
			month: m,
			balanceStart: principal,
			interest: monthlyInterest,
			balanceEnd: principal,
		})
	}
	return rows
}

/** Помесячный график для сложного процента с ежемесячной капитализацией */
export function compoundInterestScheduleMonthly(
	principal: number,
	annualRatePercent: number,
	termMonths: number,
): DepositScheduleRow[] {
	if (principal <= 0 || termMonths <= 0) return []
	const r = annualRatePercent / 100 / 12
	const rows: DepositScheduleRow[] = []
	let balance = principal
	for (let m = 1; m <= termMonths; m++) {
		const balanceStart = balance
		const interest = balanceStart * r
		balance = balanceStart + interest
		rows.push({ month: m, balanceStart, interest, balanceEnd: balance })
	}
	return rows
}

/** Помесячный график для сложного процента с ежегодной капитализацией (проценты в конце каждого года) */
export function compoundInterestScheduleYearly(
	principal: number,
	annualRatePercent: number,
	termMonths: number,
): DepositScheduleRow[] {
	if (principal <= 0 || termMonths <= 0) return []
	const R = annualRatePercent / 100
	const rows: DepositScheduleRow[] = []
	let balance = principal
	for (let month = 1; month <= termMonths; month++) {
		const balanceStart = balance
		const isEndOfYear = month % 12 === 0
		const interest = isEndOfYear ? balance * R : 0
		if (isEndOfYear) balance = balance + interest
		rows.push({ month, balanceStart, interest, balanceEnd: balance })
	}
	return rows
}

/** График вклада по месяцам в зависимости от типа и частоты капитализации */
export function depositSchedule(
	principal: number,
	annualRatePercent: number,
	termMonths: number,
	compoundFrequency: CompoundFrequency,
	simple: boolean,
): DepositScheduleRow[] {
	if (simple) return simpleInterestSchedule(principal, annualRatePercent, termMonths)
	if (compoundFrequency === 'monthly') return compoundInterestScheduleMonthly(principal, annualRatePercent, termMonths)
	return compoundInterestScheduleYearly(principal, annualRatePercent, termMonths)
}
