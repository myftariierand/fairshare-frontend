import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { useLazyGetProfileQuery } from '@/app/services/auth'
import { setCredentials } from '@/features/auth/authSlice'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/callback')({
    component: AuthCallbackComponent
})

function AuthCallbackComponent() {
    const router = useRouter()
    const navigate = Route.useNavigate()
    const dispatch = useDispatch()
    const [getProfile] = useLazyGetProfileQuery()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if (token) {
            dispatch(setCredentials({ accessToken: token }))
            getProfile().then(profileResponse => {
                if (
                    profileResponse &&
                    'data' in profileResponse &&
                    profileResponse.data
                ) {
                    router.update({ context: { user: profileResponse.data } })
                }
                navigate({ to: '/' })
            })
        } else {
            navigate({ to: '/login' })
        }
    }, [dispatch, getProfile, router, navigate])

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
