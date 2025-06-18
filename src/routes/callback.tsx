import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/callback')({
    component: AuthCallbackComponent
})

function AuthCallbackComponent() {
    return (
        <div className='flex min-h-svh flex-col items-center justify-center bg-background p-3'>
            <div className='w-full max-w-sm text-center'>
                <h1 className='text-xl font-bold mb-4'>Logging you in...</h1>
                <p className='text-muted-foreground text-sm'>
                    Please wait while we complete your login.
                </p>
            </div>
        </div>
    )
}
