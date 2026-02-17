import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BugReportDialog } from '@/components/layout/bug-report-dialog'

export const BetaBanner = () => {
    return (
        <Alert
            variant={'destructive'}
            className='flex items-center justify-between rounded-none border-0'
        >
            <div>
                <AlertTitle className='font-semibold'>Beta Version</AlertTitle>
                <AlertDescription>
                    You are using the beta version. Features may be incomplete
                    or unstable.
                </AlertDescription>
            </div>
            <BugReportDialog />
        </Alert>
    )
}
