import { createFileRoute } from '@tanstack/react-router'

import { Construction } from 'lucide-react'

export const Route = createFileRoute('/_auth/activity')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div className='text-center flex flex-col items-center my-10 uppercase gap-2 font-semibold'>
            <Construction size={44} />
            Under constuction
        </div>
    )
}
