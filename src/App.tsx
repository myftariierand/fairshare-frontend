import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { useGetProfileQuery } from '@/app/services/auth'
import { router } from '@/main'

const App = () => {
    const { data, isLoading } = useGetProfileQuery()

    if (isLoading) {
        return null
    }

    return (
        <ThemeProvider>
            <Toaster richColors theme='light' position='top-center' />
            <RouterProvider router={router} context={{ user: data }} />
        </ThemeProvider>
    )
}

export default App
