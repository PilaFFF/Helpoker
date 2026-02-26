import { MortgageCalculatorPage } from '@/widgets/MortgageCalculatorPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/mortgage/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <MortgageCalculatorPage />
}
