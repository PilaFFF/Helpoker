import { MainLayout, Typography } from '@/shared/ui'
import { observer } from 'mobx-react-lite'

export const TrainingPage = observer(() => {
	return (
		<MainLayout title="Тренировка">
			<div className="flex items-center justify-center h-screen max-h-[calc(100vh-10rem)]">
				<div className="flex rounded-2xl p-4 flex-1 items-center justify-center">
					<Typography.Title level={2} style={{ marginBottom: '0px' }}>
						В разработке 👨‍💻
					</Typography.Title>
				</div>
			</div>
		</MainLayout>
	)
})
