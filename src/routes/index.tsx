import { authStore } from '@/features/auth'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Button, Card, Typography, Space } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { tokenService } from '@/shared/lib'

const { Title, Text } = Typography

export const Route = createFileRoute('/')({
	component: RouteComponent,
	beforeLoad: async () => {
		if (!authStore.isAuthenticated) {
			throw redirect({ to: '/login' })
		}
	},
})

function RouteComponent() {
	const handleLogout = () => {
		tokenService.clear()
		authStore.isAuthenticated = false
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-4xl mx-auto pt-8">
				<Card className="shadow-lg rounded-2xl border-0">
					<Space direction="vertical" size="large" className="w-full">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-indigo-100 rounded-full">
									<UserOutlined className="text-indigo-600 text-xl" />
								</div>
								<div>
									<Title level={2} className="!m-0">
										Добро пожаловать в систему
									</Title>
									<Text type="secondary">Вы успешно авторизованы</Text>
								</div>
							</div>
							<Button
								type="default"
								icon={<LogoutOutlined />}
								onClick={handleLogout}
								className="rounded-lg"
							>
								Выйти
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
							<Card className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
								<Title level={4}>Быстрая загрузка</Title>
								<Text type="secondary">Оптимизированные бандлы</Text>
							</Card>
							<Card className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
								<Title level={4}>Code Splitting</Title>
								<Text type="secondary">Ленивая загрузка компонентов</Text>
							</Card>
							<Card className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
								<Title level={4}>Tree Shaking</Title>
								<Text type="secondary">Удаление неиспользуемого кода</Text>
							</Card>
						</div>

						<div className="mt-8">
							<Link to="/login">
								<Button type="link">Перейти к странице входа</Button>
							</Link>
						</div>
					</Space>
				</Card>
			</div>
		</div>
	)
}
