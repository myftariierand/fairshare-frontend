import { createContext, useContext, useRef, PropsWithChildren } from 'react'

const ScrollContainerContext =
    createContext<React.RefObject<HTMLDivElement> | null>(null)

export function ScrollContainerProvider({ children }: PropsWithChildren) {
    const ref = useRef<HTMLDivElement | null>(null)
    return (
        <ScrollContainerContext.Provider value={ref}>
            <div
                ref={ref}
                id='app-scroll'
                className='pb-safe-nav h-[calc(100svh-64px-55px)] overflow-auto relative'
            >
                {children}
            </div>
        </ScrollContainerContext.Provider>
    )
}

export function useScrollContainer() {
    const ctx = useContext(ScrollContainerContext)
    if (!ctx) throw new Error('useScrollContainer must be used inside provider')
    return ctx
}
