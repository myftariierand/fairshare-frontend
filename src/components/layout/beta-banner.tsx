import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BugReportDialog } from '@/components/layout/bug-report-dialog'
import { TriangleAlert } from 'lucide-react'

export const BetaBanner = () => {
    return (
        <Alert className='flex items-center justify-between rounded-none border-0 border-b p-2 bg-destructive/10'>
            <div className='flex items-center gap-2'>
                <TriangleAlert />
                <div>
                    <AlertTitle className='font-semibold'>
                        Beta Version
                    </AlertTitle>
                    <AlertDescription>
                        Features may be incomplete or unstable.
                    </AlertDescription>
                </div>
            </div>
            <BugReportDialog />
        </Alert>
    )
}
