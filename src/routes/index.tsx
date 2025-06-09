import { authStore } from '@/features/auth'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent,
	beforeLoad: async () => {
		if (!authStore.isAuthenticated) {
			throw redirect({ to: '/login' })
		}
	},
})

function RouteComponent() {
	return (
		<>
			<div>Hello "/"!</div>
			<Link to="/login">Login</Link>
		</>
	)
}
