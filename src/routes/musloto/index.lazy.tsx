import { createLazyFileRoute } from '@tanstack/react-router'
import { MuslotoPage } from '@/widgets/MuslotoPage'

export const Route = createLazyFileRoute('/musloto/')({
	component: RouteComponent,
})

function RouteComponent() {
	return <MuslotoPage />
}
