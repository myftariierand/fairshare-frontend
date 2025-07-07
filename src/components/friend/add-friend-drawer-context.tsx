import { createContext, useContext, useState } from 'react'

type FriendContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
}

type FriendDrawerProviderProps = {
    children: React.ReactNode
}

const FriendDrawerContext = createContext<FriendContextProps | null>(null)

const useFriendDrawerContext = () => {
    const context = useContext(FriendDrawerContext)
    if (!context) {
        throw new Error(
            'useGroupDrawerContext must be used within a GroupDrawerProvider'
        )
    }
    return context
}

const FriendDrawerProvider = ({ children }: FriendDrawerProviderProps) => {
    const [open, setOpen] = useState(false)

    const contextValue: FriendContextProps = {
        open,
        setOpen
    }

    return (
        <FriendDrawerContext.Provider value={contextValue}>
            {children}
        </FriendDrawerContext.Provider>
    )
}

export { FriendDrawerProvider, useFriendDrawerContext }
