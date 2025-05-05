import { forwardRef } from 'react'

const Pulse = forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
    (props, ref) => {
        return (
            <span
                ref={ref}
                className='absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-75'
                {...props}
            ></span>
        )
    }
)

Pulse.displayName = 'Pulse'

export { Pulse }
