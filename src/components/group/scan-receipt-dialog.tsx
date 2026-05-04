import { useState } from 'react'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'

import { Route } from '@/routes/_auth/$group/index'

import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { LoaderCircleIcon, ScanQrCodeIcon } from 'lucide-react'

const ScanReceiptDialog = () => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = Route.useNavigate()

    const onScan = (result: IDetectedBarcode[]) => {
        const value = result[0].rawValue

        const parsedUrl = new URL(value)
        const hash = parsedUrl.hash
        const queryString = hash.includes('?') ? hash.split('?')[1] : ''
        const params = new URLSearchParams(queryString)

        const iic = params.get('iic')
        const tin = params.get('tin')
        const crtd = params.get('crtd')

        const formData = new FormData()

        if (!iic || !tin || !crtd) return

        formData.append('iic', iic)
        formData.append('tin', tin)
        formData.append('dateTimeCreated', crtd)

        setIsLoading(true)
        fetch(
            'https://efiskalizimi-app.tatime.gov.al/invoice-check/api/verifyInvoice',
            { method: 'POST', body: formData }
        )
            .then(res => res.json())
            .then(data => {
                const name = data.seller.name
                const price = data.totalPrice

                setOpen(false)
                navigate({ to: '.', search: { name, price }, replace: true })
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false))
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size={'icon'}>
                    <ScanQrCodeIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='overflow-hidden'>
                {isLoading && (
                    <div className='absolute w-full h-full bg-white/75 z-10 grid place-content-center'>
                        <LoaderCircleIcon className='animate-spin text-black size-12' />
                    </div>
                )}
                <AlertDialogHeader>
                    <AlertDialogTitle>Scan Receipt</AlertDialogTitle>
                    <AlertDialogDescription>
                        Add a transaction by scanning qr code on the receipt.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Scanner
                    allowMultiple={!isLoading}
                    onScan={onScan}
                    styles={{ container: { width: '100%', aspectRatio: 1 } }}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ScanReceiptDialog
