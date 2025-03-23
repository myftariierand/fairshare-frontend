import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { useGetProfileQuery } from '@/app/services/auth'
import { router } from '@/main'

const App = () => {
    const { data, isLoading } = useGetProfileQuery()

    return (
        <ThemeProvider>
            {isLoading ? (
                <div className='h-screen flex items-center justify-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='100'
                        height='100'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-handshake draw-animation'
                    >
                        <path d='m11 17 2 2a1 1 0 1 0 3-3' />
                        <path d='m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4' />
                        <path d='m21 3 1 11h-2' />
                        <path d='M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3' />
                        <path d='M3 4h8' />
                    </svg>
                </div>
            ) : (
                <>
                    <Toaster richColors theme='light' position='top-center' />
                    <RouterProvider router={router} context={{ user: data }} />
                </>
            )}
        </ThemeProvider>
    )
}

export default App
