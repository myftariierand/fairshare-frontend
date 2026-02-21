import { useState } from 'react'

import { Share2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'

const ShareLinkDialog = ({ groupId }: { groupId: string }) => {
    const [copied, setCopied] = useState(false)

    const domain =
        import.meta.env.MODE === 'development'
            ? 'http://localhost:5173'
            : 'https://app.fairshare.world'
    const link = `${domain}/join-group?id=${groupId}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <Dialog onOpenChange={() => setCopied(false)}>
            <DialogTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <Share2 />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-11/12 rounded-lg'>
                <DialogHeader>
                    <DialogTitle>Share this link</DialogTitle>
                    <DialogDescription className='text-balance'>
                        Show this link with friends so they can join your group.
                    </DialogDescription>
                </DialogHeader>
                <pre className='px-4 my-4 rounded-xl bg-zinc-950 py-4 dark:bg-zinc-900 overflow-hidden whitespace-nowrap text-ellipsis'>
                    <code className='relative rounded text-sm'>{link}</code>
                </pre>
                <Button size={'lg'} variant={'secondary'} onClick={handleCopy}>
                    {copied ? 'Copied to Clipboard' : 'Copy Link'} <Copy />
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default ShareLinkDialog
