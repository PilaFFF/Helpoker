import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthMutation, handleLogin, handleFormFailed, type LoginFormData } from '@/features/auth'
import { LoginForm } from '@/widgets'

export const Route = createLazyFileRoute('/login/')({
	component: Login,
})

function Login() {
	const { mutateAsync, isPending } = useAuthMutation()
	const navigate = useNavigate()

	const onSubmit = async (values: LoginFormData) => {
		await handleLogin({
			values,
			mutateAsync,
			navigate,
		})
	}

	return <LoginForm onSubmit={onSubmit} onError={handleFormFailed} isLoading={isPending} />
}
