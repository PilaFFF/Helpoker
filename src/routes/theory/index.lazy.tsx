import { TheoryPage } from '@/widgets/TheoryPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/theory/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <TheoryPage />
}
