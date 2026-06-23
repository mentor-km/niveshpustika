import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout, LegalSection } from '@/components/Landing/LegalPageLayout';

const LAST_UPDATED = '23 June 2026';
const CONTACT_EMAIL = 'contact@niveshpustika.in';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Nivesh Pustika collects, uses, and protects your data."
    >
      <header className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-slate-500 text-sm">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Nivesh Pustika (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{' '}
          <a href="https://niveshpustika.in" className="text-emerald-700 hover:underline">
            niveshpustika.in
          </a>{' '}
          and the Nivesh Pustika trading journal application. This Privacy Policy explains what
          information we collect, how we use it, and your choices regarding your data.
        </p>
      </header>

      <LegalSection title="1. Information we collect">
        <p>We collect information you provide directly and information generated when you use the service.</p>
        <p><strong>Account information</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mobile phone number (when you sign in with OTP)</li>
          <li>Google account details such as name and email address (when you sign in with Google)</li>
          <li>Profile name you choose to display in the app</li>
        </ul>
        <p><strong>Trading data</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Trades you log (symbol, segment, dates, prices, quantities, P&amp;L, notes, and related fields)</li>
          <li>Dashboard statistics derived from your trades</li>
        </ul>
        <p><strong>Technical information</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Device type, browser type, and general usage data needed to run the web app and PWA</li>
          <li>Authentication session tokens managed by our auth provider</li>
        </ul>
        <p>
          We do <strong>not</strong> collect payment card details. Nivesh Pustika is offered on a
          free Standard plan with no payment required.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Create and manage your account</li>
          <li>Send one-time passwords (OTP) to your mobile number for sign-in</li>
          <li>Store and display your trades, dashboard, and profile</li>
          <li>Provide customer support and respond to your requests</li>
          <li>Improve reliability, security, and features of the service</li>
          <li>Comply with applicable laws and enforce our Terms of Service</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal information or your trading data to third
          parties for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Third-party services">
        <p>
          We use trusted third-party providers to operate the service. These providers process data
          on our behalf and are subject to their own privacy policies:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Supabase</strong> — authentication, database, and secure storage of account and
            trade data
          </li>
          <li>
            <strong>Google</strong> — optional sign-in with your Google account (if you choose this
            method)
          </li>
          <li>
            <strong>Twilio</strong> (or similar SMS provider) — delivery of OTP messages to your
            mobile number
          </li>
          <li>
            <strong>Vercel</strong> — hosting and delivery of the website and application
          </li>
        </ul>
        <p>
          When you use Google Sign-In, Google may collect information according to{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Data storage and security">
        <p>
          Your data is stored on secure cloud infrastructure. We use industry-standard measures
          including encrypted connections (HTTPS), access controls, and authentication provided by
          our backend services.
        </p>
        <p>
          No method of transmission or storage is 100% secure. While we work to protect your
          information, we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="5. Data retention">
        <p>
          We retain your account and trade data for as long as your account is active or as needed
          to provide the service. If you request account deletion, we will delete or anonymize your
          personal data within a reasonable period, except where we must retain certain records for
          legal, security, or backup purposes.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights and choices">
        <p>Depending on applicable law, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate profile information (you can update your name in Profile)</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          To exercise these rights, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-700 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable time.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies and local storage">
        <p>
          We use browser local storage and similar technologies to keep you signed in, remember
          preferences (such as PWA install prompts), and operate the application. These are
          essential for the service to function and are not used for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          Nivesh Pustika is not intended for users under 18 years of age. We do not knowingly
          collect personal information from children. If you believe a child has provided us data,
          please contact us and we will take steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. International users">
        <p>
          Nivesh Pustika is designed for traders in India. Your data may be processed on servers
          located outside India through our cloud providers. By using the service, you acknowledge
          that your information may be transferred to and processed in countries with different data
          protection laws, subject to appropriate safeguards by our providers.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &quot;Last updated&quot; date at the top of this page. Material changes may also be
          communicated through the website or by email where appropriate. Continued use of the
          service after changes means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact us">
        <p>
          If you have questions about this Privacy Policy or how we handle your data, contact us at:
        </p>
        <p>
          <strong>Nivesh Pustika</strong>
          <br />
          Email:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-700 hover:underline">
            {CONTACT_EMAIL}
          </a>
          <br />
          Website:{' '}
          <a href="https://niveshpustika.in" className="text-emerald-700 hover:underline">
            https://niveshpustika.in
          </a>
        </p>
        <p>
          See also our{' '}
          <Link to="/terms" className="text-emerald-700 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
