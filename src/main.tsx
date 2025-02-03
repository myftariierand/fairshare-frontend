import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter } from '@tanstack/react-router'

import './index.css'

import { Provider } from 'react-redux'
import { store } from '@/app/store'

import App from '@/App'

import { routeTree } from './routeTree.gen'

export const router = createRouter({
    routeTree,
    context: {
        user: undefined!,
    },
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>,
    )
}
