import { Link, useRouter } from '@tanstack/react-router'

import { ScanQrCode, ChevronsUpDown, Users, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useGroupDrawerContext } from '../group/create-group-drawer-context'
import { useMemo, useState } from 'react'
import { useFriendDrawerContext } from '../friend/add-friend-drawer-context'

interface DrawerOpenCallback {
    (open: boolean): void
}

export const QuickActionsButton = () => {
    const { setOpen: setGroupDrawerOpen } = useGroupDrawerContext()
    const { setOpen: setFriendDrawerOpen } = useFriendDrawerContext()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()

    const handleDrawerOpen = (callback: DrawerOpenCallback): (() => void) => {
        return () => {
            setDropdownOpen(false)
            // Small delay to ensure dropdown fully closes before opening drawer
            setTimeout(() => callback(true), 0)
        }
    }

    const routeSpecificActions = useMemo(() => {
        switch (router.state.location.pathname) {
            case '/':
                return [
                    {
                        icon: <Users />,
                        label: 'Create Group',
                        onClick: handleDrawerOpen(setGroupDrawerOpen)
                    }
                ]
            case '/friends':
                return [
                    {
                        icon: <UserPlus />,
                        label: 'Add Friend',
                        onClick: handleDrawerOpen(setFriendDrawerOpen)
                    }
                ]
            default:
                return []
        }
    }, [
        router.state.location.pathname,
        setGroupDrawerOpen,
        setFriendDrawerOpen
    ])

    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant={'outline'}
                    className='justify-self-center text-muted-foreground'
                >
                    <ChevronsUpDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link to='/scan-qr-code'>
                        <ScanQrCode /> Scan QR code
                    </Link>
                </DropdownMenuItem>
                {routeSpecificActions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                        {action.icon} {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
