/**
 * Расчёт аннуитетного платежа.
 * P = L * (r * (1+r)^n) / ((1+r)^n - 1)
 */
export function annuityPayment(loanAmount: number, annualRatePercent: number, termMonths: number): number {
	if (termMonths <= 0 || loanAmount <= 0) return 0
	const r = annualRatePercent / 100 / 12
	if (r <= 0) return loanAmount / termMonths
	const factor = Math.pow(1 + r, termMonths)
	return loanAmount * (r * factor) / (factor - 1)
}

export interface MortgageScheduleRow {
	month: number
	balanceStart: number
	interest: number
	toPrincipal: number
	extraPayment: number
	balanceEnd: number
}

export interface MortgageParams {
	/** Стоимость квартиры (тело кредита до вычета первого взноса) */
	totalAmount: number
	/** Процентная ставка, годовых */
	annualRatePercent: number
	/** Срок ипотеки, лет */
	termYears: number
	/** Первый взнос */
	downPayment?: number
	/** Досрочное погашение каждый месяц (уменьшение тела) */
	monthlyExtra?: number
}

/**
 * Строит помесячный график с учётом досрочки.
 * Досрочка идёт в уменьшение тела, срок может сократиться.
 */
export function buildSchedule(params: MortgageParams): {
	schedule: MortgageScheduleRow[]
	monthlyPayment: number
	loanAmount: number
	totalMonths: number
} {
	const {
		totalAmount,
		annualRatePercent,
		termYears,
		downPayment = 0,
		monthlyExtra = 0,
	} = params

	const loanAmount = Math.max(0, totalAmount - downPayment)
	const termMonths = Math.max(1, Math.round(termYears * 12))
	const monthlyPayment = annuityPayment(loanAmount, annualRatePercent, termMonths)
	const r = annualRatePercent / 100 / 12

	const schedule: MortgageScheduleRow[] = []
	let balance = loanAmount
	let month = 0

	while (balance > 0 && month < 600) {
		// лимит 50 лет на всякий случай
		month++
		const balanceStart = balance
		const interest = balance * r
		// в счёт тела — разница между платежом и процентами, но не больше остатка
		let toPrincipal = Math.min(monthlyPayment - interest, balance)
		if (toPrincipal < 0) toPrincipal = 0
		// досрочка — не больше остатка после обычного платежа
		let extra = Math.min(monthlyExtra, balance - toPrincipal)
		if (extra < 0) extra = 0
		const balanceEnd = Math.max(0, balance - toPrincipal - extra)
		schedule.push({
			month,
			balanceStart,
			interest,
			toPrincipal,
			extraPayment: extra,
			balanceEnd,
		})
		balance = balanceEnd
	}

	return {
		schedule,
		monthlyPayment,
		loanAmount,
		totalMonths: schedule.length,
	}
}
