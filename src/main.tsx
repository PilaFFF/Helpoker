import { ConfigProvider, theme as antdTheme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { StrictMode } from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { themeStore } from '@/shared/lib/theme'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const queryClient = new QueryClient()

const App = observer(() => {
	useEffect(() => {
		document.documentElement.classList.toggle('dark', themeStore.isDark)
		document.documentElement.style.colorScheme = themeStore.isDark ? 'dark' : 'light'
	}, [themeStore.isDark])

	const tokens = themeStore.isDark
		? {
				colorBgBase: '#1e1f20',
				colorBgLayout: '#1e1f20',
				colorBgContainer: '#1e1f20',
				colorText: '#e5e7eb',
				colorTextSecondary: '#94a3b8',
				colorTextHeading: '#f8fafc',
				borderRadiusLG: 16,
			}
		: {
				colorBgBase: '#f8fafc',
				colorBgLayout: '#f8fafc',
				colorBgContainer: '#ffffff',
				colorText: '#333',
				colorTextSecondary: '#6b7280',
				colorTextHeading: '#111827',
				borderRadiusLG: 16,
			}

	return (
		<ConfigProvider
			locale={ruRU}
			theme={{
				algorithm: themeStore.isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,

				components: {
					Card: {
						colorBgContainer: tokens.colorBgContainer,
						borderRadiusLG: tokens.borderRadiusLG,
						colorText: tokens.colorText,
					},
				},
			}}
		>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ConfigProvider>
	)
})

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
