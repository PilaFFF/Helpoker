import { MainLayout } from '@/shared/ui'
import { Space } from 'antd'
import {
	IntroductionCard,
	Step1Card,
	Step2Card,
	Step3Card,
	Step4Card,
	Step5Card,
	PracticalExampleCard,
	TipsCard,
} from './components'

export const TheoryPage = () => {
	return (
		<MainLayout title="Как пользоваться калькулятором">
			<Space direction="vertical" size="large" className="w-full">
				<IntroductionCard />
				<Step1Card />
				<Step2Card />
				<Step3Card />
				<Step4Card />
				<Step5Card />
				<PracticalExampleCard />
				<TipsCard />
			</Space>
		</MainLayout>
	)
}
