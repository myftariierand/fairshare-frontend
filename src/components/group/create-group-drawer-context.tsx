import { createContext, useContext, useState } from 'react'

type GroupContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
}

type GroupDrawerProviderProps = {
    children: React.ReactNode
}

const GroupDrawerContext = createContext<GroupContextProps | null>(null)

const useGroupDrawerContext = () => {
    const context = useContext(GroupDrawerContext)
    if (!context) {
        throw new Error(
            'useGroupDrawerContext must be used within a GroupDrawerProvider'
        )
    }
    return context
}

const GroupDrawerProvider = ({ children }: GroupDrawerProviderProps) => {
    const [open, setOpen] = useState(false)

    const contextValue: GroupContextProps = {
        open,
        setOpen
    }

    return (
        <GroupDrawerContext.Provider value={contextValue}>
            {children}
        </GroupDrawerContext.Provider>
    )
}

export { GroupDrawerProvider, useGroupDrawerContext }
