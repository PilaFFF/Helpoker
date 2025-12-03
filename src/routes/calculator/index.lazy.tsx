import { CalculatorPage } from '@/widgets/CalculatorPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/calculator/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <CalculatorPage />
}
