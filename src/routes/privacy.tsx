import { createFileRoute, Link } from '@tanstack/react-router'

import {
    ContactLine,
    LegalPage,
    LegalSection
} from '@/components/layout/legal-page'
import { DEVELOPER_NAME } from '@/lib/legal'

export const Route = createFileRoute('/privacy')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <LegalPage title='Privacy Policy'>
            <p>
                FairShare helps groups of people keep track of shared expenses.
                It is made by {DEVELOPER_NAME}, who is responsible for the
                personal data described here ("we"). This policy covers the
                FairShare Android app and the web app at app.fairshare.world.
            </p>

            <LegalSection title='What we collect'>
                <ul>
                    <li>
                        <strong>Account details:</strong> your name and email
                        address, and your password, which is stored only as a
                        one-way hash. If you sign in with Google, we receive
                        your name and email from your Google account.
                    </li>
                    <li>
                        <strong>What you add to FairShare:</strong> groups and
                        their names, currencies and cover photos, expenses
                        (amount, description, category, who paid and how it was
                        split), payments between members, group notes and tasks,
                        friends and invitations.
                    </li>
                    <li>
                        <strong>Activity history:</strong> a log of changes in
                        your groups, such as who added or edited an expense.
                    </li>
                    <li>
                        <strong>Notifications:</strong> if you allow
                        notifications, a push token for your device and its
                        platform.
                    </li>
                    <li>
                        <strong>Bug reports:</strong> what you write, plus your
                        name, email and basic device details such as the model
                        and system version, if you send a report.
                    </li>
                    <li>
                        <strong>Sign-in sessions:</strong> tokens that keep you
                        signed in. Our hosting providers may also keep standard
                        server logs, such as IP addresses, for security.
                    </li>
                </ul>
                <p>
                    FairShare does not show ads, does not use analytics or
                    tracking tools, and does not ask for your location, contacts
                    or microphone. The web app uses your camera only while you
                    scan a group's QR code, and the image stays on your device.
                    Photos are only uploaded when you choose one as a group
                    cover.
                </p>
            </LegalSection>

            <LegalSection title='How we use it'>
                <ul>
                    <li>
                        To run FairShare: work out balances, show your groups
                        and sync them between devices.
                    </li>
                    <li>
                        To let friends find you by your email address and invite
                        you to groups.
                    </li>
                    <li>
                        To send emails about your account, such as verification
                        codes, password resets and account changes.
                    </li>
                    <li>
                        To send notifications about activity in your groups.
                    </li>
                    <li>
                        To fix problems you report and to keep the service
                        secure.
                    </li>
                </ul>
                <p>
                    We do not sell your personal data or use it for advertising.
                </p>
            </LegalSection>

            <LegalSection title='Who can see it'>
                <p>
                    People in your groups can see your name and email, and the
                    expenses, payments, notes and activity in groups you share.
                    People you are friends with can see your name and email.
                </p>
                <p>
                    We use these services to run FairShare, and they process
                    data only on our behalf:
                </p>
                <ul>
                    <li>
                        Google, for Google sign-in and for delivering
                        notifications on Android (Firebase Cloud Messaging)
                    </li>
                    <li>Expo, for sending push notifications</li>
                    <li>Cloudinary, for storing group cover photos</li>
                    <li>Resend, for sending emails</li>
                    <li>
                        Our hosting and database providers, which store the data
                        and run the servers
                    </li>
                </ul>
                <p>
                    These providers may process data outside your country. We
                    may also share data if the law requires it.
                </p>
            </LegalSection>

            <LegalSection title='How long we keep it'>
                <p>
                    We keep your data while you have an account. When you delete
                    your account, we remove what identifies you, as described on
                    the <Link to='/delete-account'>account deletion page</Link>.
                    Expenses you were part of stay in other people's groups
                    under the name "Deleted user", because their balances depend
                    on them.
                </p>
            </LegalSection>

            <LegalSection title='Your choices and rights'>
                <ul>
                    <li>
                        You can change your name and password in the app at any
                        time.
                    </li>
                    <li>
                        You can turn off notifications in your device settings.
                    </li>
                    <li>
                        You can delete your account from the app or the web app.
                    </li>
                    <li>
                        You can ask us for a copy of your data, or ask us to
                        correct or delete it. Depending on where you live, you
                        may have other rights under data protection law,
                        including the right to complain to your local data
                        protection authority.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title='Security'>
                <p>
                    Data is sent over encrypted connections and passwords are
                    stored as one-way hashes. No service is completely secure,
                    but we work to protect your data.
                </p>
            </LegalSection>

            <LegalSection title='Children'>
                <p>
                    FairShare is not meant for children under 13, and we do not
                    knowingly collect their data.
                </p>
            </LegalSection>

            <LegalSection title='Changes'>
                <p>
                    If we change this policy, we will update the date at the top
                    of this page, and tell you in the app or by email if the
                    change is significant.
                </p>
            </LegalSection>

            <LegalSection title='Contact'>
                <p>
                    For privacy questions or requests, <ContactLine />.
                </p>
            </LegalSection>
        </LegalPage>
    )
}
