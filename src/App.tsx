import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

import { useGetProfileQuery } from '@/app/services/auth'

import { router } from '@/main'

const App = () => {
    const { data, isLoading } = useGetProfileQuery()

    if (isLoading) {
        return null
    }

    return (
        <>
            <Toaster richColors theme='light' position='top-center' />
            <RouterProvider router={router} context={{ user: data }} />
        </>
    )
}

export default App
