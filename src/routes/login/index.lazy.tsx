import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuthMutation } from '@/features/auth'

const { Title, Text } = Typography

export const Route = createLazyFileRoute('/login/')({
	component: Login,
})

interface LoginFormData {
	username: string
	password: string
}

function Login() {
	const { mutateAsync, isPending } = useAuthMutation()
	const [form] = Form.useForm<LoginFormData>()
	const navigate = useNavigate()

	// Получаем referrer URL из query параметров или document.referrer
	const getReferrerUrl = (): string | null => {
		// Сначала проверяем query параметр ref
		const urlParams = new URLSearchParams(window.location.search)
		const refParam = urlParams.get('ref')

		if (refParam) {
			return refParam
		}

		// Затем проверяем document.referrer
		if (document.referrer) {
			return document.referrer
		}

		return null
	}

	const isSameDomain = (url: string): boolean => {
		try {
			const referrerUrl = new URL(url)
			const currentUrl = new URL(window.location.href)
			return referrerUrl.hostname === currentUrl.hostname
		} catch {
			return false
		}
	}

	const handleLogin = async (values: LoginFormData) => {
		try {
			// Здесь должна быть логика аутентификации
			// Имитируем API запрос
			await mutateAsync({
				username: values.username,
				password: values.password,
			})

			// Имитируем успешный логин (в реальном приложении здесь будет проверка credentials)
			if (values.username && values.password) {
				message.success('Вход выполнен успешно!')

				// Получаем referrer URL и проверяем домен
				const referrerUrl = getReferrerUrl()

				if (referrerUrl && isSameDomain(referrerUrl)) {
					// Редиректим на referrer URL если он в том же домене
					window.location.href = referrerUrl
				} else {
					// Редиректим на главную страницу
					navigate({ to: '/' })
				}
			} else {
				message.error('Неверные учетные данные')
			}
		} catch (error) {
			message.error('Произошла ошибка при входе')
		}
	}

	const handleFormFailed = () => {
		message.error('Пожалуйста, заполните все обязательные поля')
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '20px',
			}}
		>
			<Card
				style={{
					width: '100%',
					maxWidth: 400,
					boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
					borderRadius: '12px',
				}}
				bodyStyle={{ padding: '40px 32px' }}
			>
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					<div style={{ textAlign: 'center' }}>
						<Title level={2} style={{ margin: 0, color: '#1f2937' }}>
							Добро пожаловать
						</Title>
						<Text type="secondary" style={{ fontSize: '16px' }}>
							Войдите в свой аккаунт
						</Text>
					</div>

					<Form
						form={form}
						name="login"
						onFinish={handleLogin}
						onFinishFailed={handleFormFailed}
						autoComplete="off"
						size="large"
					>
						<Form.Item
							name="username"
							rules={[
								{ required: true, message: 'Пожалуйста, введите имя пользователя!' },
								{ min: 3, message: 'Имя пользователя должно содержать минимум 3 символа' },
							]}
						>
							<Input prefix={<UserOutlined />} placeholder="Имя пользователя" style={{ borderRadius: '8px' }} />
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{ required: true, message: 'Пожалуйста, введите пароль!' },
								{ min: 6, message: 'Пароль должен содержать минимум 6 символов' },
							]}
						>
							<Input.Password prefix={<LockOutlined />} placeholder="Пароль" style={{ borderRadius: '8px' }} />
						</Form.Item>

						<Form.Item style={{ marginBottom: 0 }}>
							<Button
								type="primary"
								htmlType="submit"
								loading={isPending}
								block
								style={{
									height: '48px',
									borderRadius: '8px',
									fontSize: '16px',
									fontWeight: 500,
								}}
							>
								{isPending ? 'Выполняется вход...' : 'Войти'}
							</Button>
						</Form.Item>
					</Form>
				</Space>
			</Card>
		</div>
	)
}
