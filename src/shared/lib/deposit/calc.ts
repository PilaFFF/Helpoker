export type CompoundFrequency = 'yearly' | 'monthly'

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
