import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const ThemeProvider = (props: ThemeProviderProps) => {
    const { children, defaultTheme = 'system', storageKey = 'fs-theme' } = props

    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]'
        )

        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
                ? 'dark'
                : 'light'
            const color = systemTheme === 'dark' ? '#1e1b18' : '#ffffff'

            metaThemeColor?.setAttribute('content', color)
            root.classList.add(systemTheme)
            return
        }

        metaThemeColor?.setAttribute(
            'content',
            theme === 'dark' ? '#1e1b18' : '#ffffff'
        )
        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        }
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}

export { ThemeProvider, useTheme }
