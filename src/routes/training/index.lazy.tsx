import { TrainingPage } from '@/widgets/TrainingPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/training/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <TrainingPage />
}
