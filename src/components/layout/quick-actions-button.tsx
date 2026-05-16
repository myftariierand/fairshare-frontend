import { Link, useMatchRoute, useRouter } from '@tanstack/react-router'

import { ScanQrCode, ChevronsUpDown, Users, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import { useDrawerSlice } from '@/features/quick-actions/drawerSlice'
import ScanReceiptDialog from '@/components/group/scan-receipt-dialog'

interface DrawerOpenCallback {
    (): void
}

export const QuickActionsButton = () => {
    const [, toggleDrawer] = useDrawerSlice()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()

    const handleDrawerOpen = (callback: DrawerOpenCallback): (() => void) => {
        return () => {
            setDropdownOpen(false)
            // Small delay to ensure dropdown fully closes before opening drawer
            setTimeout(() => callback(), 0)
        }
    }

    const routeSpecificActions = useMemo(() => {
        switch (router.state.location.pathname) {
            case '/':
                return [
                    {
                        icon: <Users />,
                        label: 'Create Group',
                        onClick: handleDrawerOpen(() =>
                            toggleDrawer('isCreateGroupDrawerOpen')
                        )
                    }
                ]
            case '/friends':
                return [
                    {
                        icon: <UserPlus />,
                        label: 'Add Friend',
                        onClick: handleDrawerOpen(() =>
                            toggleDrawer('isAddFriendDrawerOpen')
                        )
                    }
                ]
            default:
                return []
        }
    }, [router.state.location.pathname, toggleDrawer])

    const matchRoute = useMatchRoute()

    const isOnGroupRoute = matchRoute({ to: '/g/$group', fuzzy: true })

    return (
        <>
            {isOnGroupRoute ? (
                <div className='justify-self-center'>
                    <ScanReceiptDialog />
                </div>
            ) : (
                <DropdownMenu
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                >
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
                            <DropdownMenuItem
                                key={index}
                                onClick={action.onClick}
                            >
                                {action.icon} {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}
