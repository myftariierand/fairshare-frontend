import React, { type ReactElement } from 'react'

import { cn } from '@/lib/utils'

import { ImageOff } from 'lucide-react'

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    placeholderIcon?: ReactElement
}

const Image = React.forwardRef<HTMLImageElement, ImgProps>(
    ({ src, placeholderIcon, className, ...rest }, ref) => {
        return src ? (
            <img
                ref={ref}
                src={src}
                className={cn(
                    'rounded-full bg-foreground/5 object-cover p-2',
                    className
                )}
                {...rest}
            />
        ) : (
            <div
                className={cn(
                    'grid place-content-center rounded-full bg-foreground/5 text-foreground/40',
                    className
                )}
            >
                {placeholderIcon ? (
                    placeholderIcon
                ) : (
                    <ImageOff strokeWidth={1.5} size={20} />
                )}
            </div>
        )
    }
)
Image.displayName = 'Image'

export { Image }
