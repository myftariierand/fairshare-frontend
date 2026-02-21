import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BugReportDialog } from '@/components/layout/bug-report-dialog'

export const BetaBanner = () => {
    return (
        <Alert className='flex items-center justify-between rounded-none border-0 border-b px-2 h-20 bg-destructive/10'>
            <div>
                <AlertTitle className='font-semibold'>Beta Version</AlertTitle>
                <AlertDescription>
                    You are using the beta version. <br /> Features may be
                    incomplete or unstable.
                </AlertDescription>
            </div>
            <BugReportDialog />
        </Alert>
    )
}
