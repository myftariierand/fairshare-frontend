import { forwardRef } from 'react'

const PingIndicator = forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
    (props, ref) => {
        return (
            <span ref={ref} className='relative flex size-2' {...props}>
                <span className='absolute size-2 animate-ping rounded-full bg-sky-400 opacity-75'></span>
                <span className='absolute size-2 rounded-full bg-sky-500'></span>
            </span>
        )
    }
)

PingIndicator.displayName = 'PingIndicator'

export { PingIndicator }
