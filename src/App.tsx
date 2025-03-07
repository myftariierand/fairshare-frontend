import { useState, useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { useGetProfileQuery } from '@/app/services/auth'
import { router } from '@/main'

const messages = [
    'Waking up the server... ☕',
    'Bribing the database with cookies... 🍪',
    'Untangling the internet cables... 🔌',
    'Calming down the angry API... 😤',
    'Convincing the server to start... 🗣️',
    'Dusting off old logs... 🧹',
    'Running on hamster power... 🐹',
    'Asking nicely for more RAM... 🙏',
    'Loading... please don’t unplug me! 😨',
    'Summoning the data spirits... 🔮'
]

const App = () => {
    const { data, isLoading } = useGetProfileQuery()

    const [index, setIndex] = useState(0)
    const [showMessages, setShowMessages] = useState(false)
    const [done, setDone] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (isLoading) {
            timer = setTimeout(() => {
                setShowMessages(true)
                let i = 0
                const interval = setInterval(() => {
                    if (i < messages.length - 1) {
                        setIndex(prev => prev + 1)
                        i++
                    } else {
                        clearInterval(interval)
                    }
                }, 1500)
            }, 200)
        } else {
            if (showMessages) {
                let i = index
                const interval = setInterval(() => {
                    if (i < messages.length - 1) {
                        setIndex(prev => prev + 1)
                        i++
                    } else {
                        clearInterval(interval)
                        setTimeout(() => setDone(true), 1000)
                    }
                }, 1000)
                return () => clearInterval(interval)
            } else {
                setDone(true)
            }
        }

        return () => clearTimeout(timer)
    }, [isLoading, showMessages, index])

    return (
        <ThemeProvider>
            {done ? (
                <>
                    <Toaster richColors theme='light' position='top-center' />
                    <RouterProvider router={router} context={{ user: data }} />
                </>
            ) : (
                <div className='h-screen flex items-center justify-center'>
                    {messages[index]}
                </div>
            )}
        </ThemeProvider>
    )
}

export default App
