import { MainLayout } from '@/shared/ui'
import { Typography, Space, Card as AntCard } from 'antd'
import { PlayingCard } from '@/shared/ui'
import { Rank, Suit } from '@/shared/lib/poker/types'
import { observer } from 'mobx-react-lite'
import { themeStore } from '@/shared/lib/theme'
import classNames from 'classnames'

export const TheoryPage = observer(() => {
	const isDark = themeStore.isDark

	const exampleHole = [
		{ rank: Rank.Ace, suit: Suit.Spades },
		{ rank: Rank.King, suit: Suit.Spades },
	]

	const exampleBoard = [
		{ rank: Rank.Queen, suit: Suit.Spades },
		{ rank: Rank.Jack, suit: Suit.Spades },
		{ rank: Rank.Ten, suit: Suit.Hearts },
		null,
		null,
	]

	return (
		<MainLayout title="Как пользоваться калькулятором">
			<Space direction="vertical" size="large" className="w-full">
				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Введение</Typography.Title>
					<Typography.Paragraph>
						Покерный калькулятор эквити поможет вам принимать правильные решения в покере, рассчитывая ваши шансы на
						победу и сравнивая их с шансами банка (pot odds). Это важный инструмент для улучшения вашей игры.
					</Typography.Paragraph>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Шаг 1: Выбор ваших карт (Hole Cards)</Typography.Title>
					<Typography.Paragraph>
						Начните с выбора двух ваших карт. Нажмите на пустую кнопку "Выбрать" под разделом "Ваши карты" и выберите
						карту из колоды ниже.
					</Typography.Paragraph>
					<div className="flex gap-3 my-4">
						{exampleHole.map((card, i) => (
							<PlayingCard key={`hole-${i}`} card={card} variant="large" />
						))}
					</div>
					<Typography.Text type="secondary">
						Пример: Вы выбрали туз и король пик - сильная стартовая рука!
					</Typography.Text>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Шаг 2: Выбор карт на борде (Board Cards)</Typography.Title>
					<Typography.Paragraph>Заполните карты на борде в зависимости от стадии игры:</Typography.Paragraph>
					<ul className="list-disc list-inside mb-4">
						<li>
							<strong>Флоп</strong> - первые 3 карты (индексы 0-2)
						</li>
						<li>
							<strong>Тёрн</strong> - 4-я карта (индекс 3)
						</li>
						<li>
							<strong>Ривер</strong> - 5-я карта (индекс 4)
						</li>
					</ul>
					<div className="flex gap-3 my-4">
						{exampleBoard.map((card, i) =>
							card ? (
								<div key={`board-${i}`} className="flex flex-col items-center">
									<PlayingCard card={card} variant="large" />
									<span className="text-xs mt-1 text-gray-500">{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}</span>
								</div>
							) : (
								<div
									key={`board-empty-${i}`}
									className="w-20 h-28 rounded-xl border border-gray-300 bg-gray-200 flex items-center justify-center text-gray-400"
								>
									{i < 3 ? 'Флоп' : i === 3 ? 'Тёрн' : 'Ривер'}
								</div>
							),
						)}
					</div>
					<Typography.Text type="secondary">
						Пример: На флопе выпали Q♠, J♠, 10♥ - у вас стрит-флеш дро!
					</Typography.Text>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Шаг 3: Настройка параметров расчета</Typography.Title>
					<Space direction="vertical" className="w-full">
						<div>
							<Typography.Title level={4}>Количество сэмплов</Typography.Title>
							<Typography.Paragraph>
								Чем больше сэмплов, тем точнее расчет, но дольше выполнение. Рекомендуется использовать 5000-10000
								сэмплов для баланса между точностью и скоростью.
							</Typography.Paragraph>
						</div>
						<div>
							<Typography.Title level={4}>Эквити для комбинации</Typography.Title>
							<Typography.Paragraph>
								Вы можете выбрать конкретную комбинацию для расчета эквити. Например, если вы хотите узнать шансы
								собрать флеш, выберите "Флеш" из списка. По умолчанию рассчитывается эквити для всех комбинаций.
							</Typography.Paragraph>
						</div>
					</Space>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Шаг 4: Ввод банка и ставки</Typography.Title>
					<Typography.Paragraph>Для получения рекомендации о том, стоит ли делать колл, введите:</Typography.Paragraph>
					<ul className="list-disc list-inside mb-4">
						<li>
							<strong>Банк (Pot Size)</strong> - текущий размер банка в рублях
						</li>
						<li>
							<strong>Ставка (Bet Size)</strong> - размер ставки, которую нужно сделать для колла
						</li>
					</ul>
					<div
						className={classNames('p-4 rounded-lg border-[1px] my-4', {
							'border-blue-200 bg-blue-50': !isDark,
							'border-blue-800 bg-blue-950': isDark,
						})}
					>
						<Typography.Text strong>Пример расчета:</Typography.Text>
						<br />
						<Typography.Text>Банк: 100, Ставка: 50</Typography.Text>
						<br />
						<Typography.Text>Шансы банка (Pot Odds) = 50 / (100 + 50) = 33.3%</Typography.Text>
						<br />
						<Typography.Text>Если ваше эквити больше 33.3% - делайте колл, если меньше - фолд.</Typography.Text>
					</div>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Шаг 5: Анализ результатов</Typography.Title>
					<Space direction="vertical" className="w-full">
						<div>
							<Typography.Title level={4}>Equity (Эквити)</Typography.Title>
							<Typography.Paragraph>
								Процентное соотношение ваших шансов на победу против случайного оппонента. Чем выше эквити, тем лучше
								ваша рука.
							</Typography.Paragraph>
						</div>
						<div>
							<Typography.Title level={4}>Шансы банка (Pot Odds)</Typography.Title>
							<Typography.Paragraph>
								Минимальный процент эквити, необходимый для прибыльного колла. Рассчитывается как: Ставка / (Банк +
								Ставка)
							</Typography.Paragraph>
						</div>
						<div>
							<Typography.Title level={4}>Рекомендация</Typography.Title>
							<Typography.Paragraph>
								Калькулятор автоматически сравнивает ваше эквити с шансами банка и дает рекомендацию:
							</Typography.Paragraph>
							<div
								className={classNames('p-4 rounded-lg border-[1px] my-2', {
									'border-green-500 bg-green-100': !isDark,
									'border-green-700 bg-green-900': isDark,
								})}
							>
								<Typography.Text strong className="text-green-700 dark:text-green-300">
									✓ КОЛЛ
								</Typography.Text>
								<br />
								<Typography.Text>
									Если ваше эквити выше шансов банка - делайте колл, это математически выгодно в долгосрочной
									перспективе.
								</Typography.Text>
							</div>
							<div
								className={classNames('p-4 rounded-lg border-[1px] my-2', {
									'border-red-500 bg-red-100': !isDark,
									'border-red-700 bg-red-900': isDark,
								})}
							>
								<Typography.Text strong className="text-red-700 dark:text-red-300">
									✗ ФОЛД
								</Typography.Text>
								<br />
								<Typography.Text>
									Если ваше эквити ниже шансов банка - делайте фолд, колл будет убыточным в долгосрочной перспективе.
								</Typography.Text>
							</div>
						</div>
					</Space>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Практический пример</Typography.Title>
					<Typography.Paragraph>
						Представьте ситуацию: у вас на руках A♠ K♠, на флопе выпали Q♠ J♠ 10♥. У вас стрит-флеш дро (нужна
						любая пика для стрит-флеша).
					</Typography.Paragraph>
					<div className="my-4">
						<Typography.Text strong>Ваши карты:</Typography.Text>
						<div className="flex gap-2 mt-2">
							<PlayingCard card={{ rank: Rank.Ace, suit: Suit.Spades }} variant="large" />
							<PlayingCard card={{ rank: Rank.King, suit: Suit.Spades }} variant="large" />
						</div>
					</div>
					<div className="my-4">
						<Typography.Text strong>Борд:</Typography.Text>
						<div className="flex gap-2 mt-2">
							<PlayingCard card={{ rank: Rank.Queen, suit: Suit.Spades }} variant="large" />
							<PlayingCard card={{ rank: Rank.Jack, suit: Suit.Spades }} variant="large" />
							<PlayingCard card={{ rank: Rank.Ten, suit: Suit.Hearts }} variant="large" />
						</div>
					</div>
					<Typography.Paragraph>
						В этой ситуации калькулятор покажет высокое эквити на флеш и стрит-флеш. Если оппонент делает ставку, и ваше
						эквити выше шансов банка - делайте колл!
					</Typography.Paragraph>
				</AntCard>

				<AntCard
					style={{
						background: isDark ? '#131314' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
					}}
				>
					<Typography.Title level={3}>Советы по использованию</Typography.Title>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Используйте калькулятор для обучения и понимания математики покера, но помните, что в реальной игре важно
							учитывать и другие факторы (стиль оппонента, позицию, стадию турнира)
						</li>
						<li>
							Для более точных расчетов увеличьте количество сэмплов, особенно при расчете эквити для конкретных
							комбинаций
						</li>
						<li>
							Калькулятор рассчитывает эквити против случайного оппонента. В реальной игре учитывайте диапазон рук
							вашего оппонента
						</li>
						<li>Рекомендации основаны на математике, но в покере важны также психология и чтение оппонентов</li>
					</ul>
				</AntCard>
			</Space>
		</MainLayout>
	)
})
