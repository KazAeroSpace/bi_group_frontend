import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import reportWebVitals from './reportWebVitals'
import { persistor, store } from './store'
import { SlashScreen } from './components/SlashScreen'
import { GlobalStyles } from './components/GlobalStyles'
import { CssBaseline } from './components/CssBaseline'

const root = createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
	<ReduxProvider store={store}>
		<PersistGate
			persistor={persistor}
			loading={<SlashScreen/>}
		>
			<App />
			<CssBaseline />
			<GlobalStyles />
		</PersistGate>
	</ReduxProvider>
)

reportWebVitals()
