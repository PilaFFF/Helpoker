import { Form, Input, Button, Card, Typography, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import type { LoginFormData } from '@/features/auth'

const { Title, Text } = Typography

interface LoginFormProps {
	onSubmit: (values: LoginFormData) => Promise<void>
	onError: () => void
	isLoading?: boolean
}

export const LoginForm = ({ onSubmit, onError, isLoading = false }: LoginFormProps) => {
	const [form] = Form.useForm<LoginFormData>()

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
						onFinish={onSubmit}
						onFinishFailed={onError}
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
								loading={isLoading}
								block
								style={{
									height: '48px',
									borderRadius: '8px',
									fontSize: '16px',
									fontWeight: 500,
								}}
							>
								{isLoading ? 'Выполняется вход...' : 'Войти'}
							</Button>
						</Form.Item>
					</Form>
				</Space>
			</Card>
		</div>
	)
} 