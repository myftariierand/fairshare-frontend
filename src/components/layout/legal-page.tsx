import { Link } from '@tanstack/react-router'
import { Handshake } from 'lucide-react'

import { CONTACT_EMAIL, POLICIES_UPDATED } from '@/lib/legal'

// Shared frame for the public policy pages, which anyone can open signed out
export function LegalPage({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className='min-h-svh bg-background px-4 py-10'>
            <article className='mx-auto flex max-w-2xl flex-col gap-6 text-sm leading-6 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc'>
                <Link
                    to='/'
                    className='flex items-center gap-2 font-semibold !no-underline'
                >
                    <Handshake className='size-5' />
                    FairShare
                </Link>
                <header className='flex flex-col gap-1'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <p className='text-muted-foreground'>
                        Last updated {POLICIES_UPDATED}
                    </p>
                </header>
                {children}
            </article>
        </div>
    )
}

export function LegalSection({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section className='flex flex-col gap-2'>
            <h2 className='text-base font-semibold'>{title}</h2>
            {children}
        </section>
    )
}

export function ContactLine() {
    if (CONTACT_EMAIL) {
        return (
            <>
                email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </>
        )
    }

    return <>use Report a bug on the Profile tab of the FairShare Android app</>
}
