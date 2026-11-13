import { createFileRoute, Link } from '@tanstack/react-router'

import {
    ContactLine,
    LegalPage,
    LegalSection
} from '@/components/layout/legal-page'
import { DEVELOPER_NAME } from '@/lib/legal'

export const Route = createFileRoute('/terms')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <LegalPage title='Terms of Service'>
            <p>
                These terms cover your use of FairShare, the Android app and the
                web app at app.fairshare.world, made by {DEVELOPER_NAME}. By
                creating an account or using FairShare, you agree to them.
            </p>

            <LegalSection title='What FairShare is'>
                <p>
                    FairShare is a free tool for recording shared expenses and
                    working out who owes whom. It does not hold, send or receive
                    money. Payments between people happen outside FairShare, and
                    marking a debt as settled only updates the record.
                </p>
            </LegalSection>

            <LegalSection title='Your account'>
                <ul>
                    <li>
                        Give your real email address and keep your password
                        safe.
                    </li>
                    <li>
                        You are responsible for what happens under your account.
                    </li>
                    <li>You must be at least 13 years old to use FairShare.</li>
                </ul>
            </LegalSection>

            <LegalSection title='What you add'>
                <p>
                    You keep ownership of what you add, such as expenses, notes
                    and cover photos. You let us store and show it to the people
                    you share it with, so FairShare can work. Other members of
                    your groups can see and, depending on the feature, edit what
                    is in those groups.
                </p>
            </LegalSection>

            <LegalSection title='Acceptable use'>
                <p>Don't use FairShare to:</p>
                <ul>
                    <li>break the law or help anyone else do so</li>
                    <li>
                        harass people or add content that is abusive or illegal
                    </li>
                    <li>try to access other people's accounts or data</li>
                    <li>
                        disrupt the service, for example by automated abuse or
                        attacks
                    </li>
                </ul>
                <p>We may suspend or delete accounts that break these rules.</p>
            </LegalSection>

            <LegalSection title='No guarantees'>
                <p>
                    FairShare is provided as it is. We work to keep it accurate
                    and available, but we can't promise it will always work or
                    be free of mistakes. Check important amounts yourself before
                    you rely on them. To the extent the law allows, we are not
                    liable for losses that come from using FairShare, including
                    disagreements between members of a group.
                </p>
            </LegalSection>

            <LegalSection title='Ending your use'>
                <p>
                    You can stop using FairShare and{' '}
                    <Link to='/delete-account'>delete your account</Link> at any
                    time. We may change or stop the service, and will try to
                    give notice first.
                </p>
            </LegalSection>

            <LegalSection title='Privacy'>
                <p>
                    How we handle your data is described in the{' '}
                    <Link to='/privacy'>Privacy Policy</Link>.
                </p>
            </LegalSection>

            <LegalSection title='Changes'>
                <p>
                    If we change these terms, we will update the date at the top
                    of this page. Continuing to use FairShare after a change
                    means you accept the new terms.
                </p>
            </LegalSection>

            <LegalSection title='Contact'>
                <p>
                    For questions about these terms, <ContactLine />.
                </p>
            </LegalSection>
        </LegalPage>
    )
}
