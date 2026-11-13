import { createFileRoute, Link } from '@tanstack/react-router'

import {
    ContactLine,
    LegalPage,
    LegalSection
} from '@/components/layout/legal-page'
import { DEVELOPER_NAME } from '@/lib/legal'

export const Route = createFileRoute('/delete-account')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <LegalPage title='Delete your FairShare account'>
            <p>
                You can delete your FairShare account, made by {DEVELOPER_NAME},
                yourself at any time, from the Android app or from the web. You
                don't need to have the app installed.
            </p>

            <LegalSection title='In the Android app'>
                <ol>
                    <li>Open FairShare and go to the Profile tab.</li>
                    <li>Scroll down and tap Delete account.</li>
                    <li>Confirm. If you sign in with a password, enter it.</li>
                </ol>
            </LegalSection>

            <LegalSection title='On the web'>
                <ol>
                    <li>
                        Sign in at <Link to='/login'>app.fairshare.world</Link>{' '}
                        with the same email or Google account. If you forgot
                        your password, use{' '}
                        <Link to='/forgot-password'>Forgot password</Link>.
                    </li>
                    <li>Go to Profile, then Edit profile.</li>
                    <li>Choose Delete account and confirm.</li>
                </ol>
            </LegalSection>

            <LegalSection title='Before you delete'>
                <p>
                    All balances in your groups need to be settled first, both
                    what you owe and what you are owed, so nobody is left with a
                    debt that can't be cleared. Deletion is permanent and can't
                    be undone.
                </p>
            </LegalSection>

            <LegalSection title='What gets deleted'>
                <ul>
                    <li>Your name, email address and password</li>
                    <li>
                        Your friends list and any pending friend or group
                        invitations
                    </li>
                    <li>Your sign-in sessions and notification tokens</li>
                    <li>
                        Groups where you are the only member, with their cover
                        photos
                    </li>
                    <li>Your name and email in any bug reports you sent</li>
                </ul>
            </LegalSection>

            <LegalSection title='What stays'>
                <p>
                    Expenses and payments you were part of stay in groups that
                    still have other members, shown as "Deleted user", because
                    the other members' balances depend on them. Group notes and
                    tasks you added, and the groups' activity history, also
                    stay, with your name and email removed from the history. The
                    text of any bug reports you sent is kept without your name
                    or email.
                </p>
            </LegalSection>

            <LegalSection title="Can't sign in?">
                <p>
                    To ask us to delete your account instead, <ContactLine />.
                    Send it from the email address on the account.
                </p>
            </LegalSection>
        </LegalPage>
    )
}
