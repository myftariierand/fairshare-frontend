import { useState } from 'react'

import {
    useGetInviteLinkQuery,
    useResetInviteLinkMutation
} from '@/app/services/group'

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

    const { data: inviteLink } = useGetInviteLinkQuery({ groupId })
    const [resetInviteLink, { isLoading: isResetting }] =
        useResetInviteLinkMutation()

    const domain =
        import.meta.env.MODE === 'development'
            ? 'http://localhost:5173'
            : 'https://app.fairshare.world'
    const link = inviteLink ? `${domain}/join-group/${inviteLink.token}` : ''

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const handleReset = async () => {
        try {
            await resetInviteLink({ groupId }).unwrap()
            setCopied(false)
        } catch (err) {
            console.error('Failed to reset link: ', err)
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
                <pre className='px-4 my-4 rounded-xl bg-card py-4 overflow-hidden whitespace-nowrap text-ellipsis'>
                    <code className='relative rounded text-sm'>{link}</code>
                </pre>
                <Button
                    size={'lg'}
                    variant={'secondary'}
                    onClick={handleCopy}
                    disabled={!link}
                >
                    {copied ? 'Copied to Clipboard' : 'Copy Link'} <Copy />
                </Button>
                {inviteLink?.canReset && (
                    <Button
                        variant={'ghost'}
                        onClick={handleReset}
                        disabled={isResetting}
                    >
                        Reset link (old links and QR codes stop working)
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ShareLinkDialog
