import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout, LegalSection } from '@/components/Landing/LegalPageLayout';

const LAST_UPDATED = '23 June 2026';
const CONTACT_EMAIL = 'contact@niveshpustika.in';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Terms and conditions for using Nivesh Pustika."
    >
      <header className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-slate-500 text-sm">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Nivesh Pustika
          (&quot;Service&quot;), including the website at{' '}
          <a href="https://niveshpustika.in" className="text-emerald-700 hover:underline">
            niveshpustika.in
          </a>{' '}
          and the web/mobile application. By creating an account or using the Service, you agree to
          these Terms.
        </p>
      </header>

      <LegalSection title="1. About the Service">
        <p>
          Nivesh Pustika is a trading journal and portfolio tracking tool for Indian markets. It
          helps you log trades across segments such as Equity, Futures, Options, Currency, and MCX
          Commodities, and view performance statistics in Indian Rupees (₹).
        </p>
        <p>
          The Service is provided on a <strong>Standard plan</strong> with full access at no
          charge. We may introduce optional paid features in the future; if we do, we will update
          these Terms and communicate any changes clearly.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least <strong>18 years old</strong> and legally able to enter into a
          binding agreement to use the Service. By using Nivesh Pustika, you represent that you
          meet this requirement.
        </p>
        <p>
          You are responsible for ensuring that your use of the Service complies with applicable
          laws, exchange rules, and broker terms in India.
        </p>
      </LegalSection>

      <LegalSection title="3. Account registration">
        <p>
          You may sign in using your mobile number (OTP) or Google account. You agree to provide
          accurate information and to keep your account credentials secure.
        </p>
        <p>
          You are responsible for all activity that occurs under your account. Notify us immediately
          at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-700 hover:underline">
            {CONTACT_EMAIL}
          </a>{' '}
          if you suspect unauthorized access.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms or that we reasonably
          believe are fraudulent, abusive, or harmful to the Service or other users.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems, other users&apos; accounts, or admin areas</li>
          <li>Upload malicious code, spam, or content that infringes others&apos; rights</li>
          <li>Scrape, reverse engineer, or overload the Service without our written permission</li>
          <li>Misrepresent your identity or affiliation</li>
          <li>Use the Service to provide regulated investment advice to others unless you are licensed to do so</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Your data and content">
        <p>
          You retain ownership of the trade records and other content you enter into Nivesh Pustika
          (&quot;Your Content&quot;). By using the Service, you grant us a limited license to store,
          process, and display Your Content solely to operate and improve the Service for you.
        </p>
        <p>
          You are solely responsible for the accuracy of the data you enter. Nivesh Pustika does
          not connect to your broker or exchange accounts unless we explicitly add such integrations
          in the future and disclose them to you.
        </p>
      </LegalSection>

      <LegalSection title="6. Not financial advice">
        <p>
          <strong>Important:</strong> Nivesh Pustika is a record-keeping and analytics tool only. We
          do <strong>not</strong> provide investment, trading, tax, or legal advice. Nothing on
          the Service constitutes a recommendation to buy, sell, or hold any security or
          derivative.
        </p>
        <p>
          Trading in securities and derivatives involves substantial risk of loss. Past performance
          shown in your journal or dashboard is not indicative of future results. You should consult
          qualified professionals before making financial decisions.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          We strive to keep the Service available, but we do not guarantee uninterrupted or
          error-free operation. We may modify, suspend, or discontinue features with or without
          notice, especially for maintenance, security, or legal reasons.
        </p>
        <p>
          We may update these Terms from time to time. The &quot;Last updated&quot; date will
          change when we do. Continued use after updated Terms are posted constitutes your acceptance
          of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual property">
        <p>
          The Nivesh Pustika name, logo, website design, software, and documentation are owned by us
          or our licensors and are protected by applicable intellectual property laws. You may not
          copy, modify, or distribute our branding or code except as permitted by law or with our
          written consent.
        </p>
      </LegalSection>

      <LegalSection title="9. Privacy">
        <p>
          Our collection and use of personal information is described in our{' '}
          <Link to="/privacy" className="text-emerald-700 hover:underline">
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that calculations, reports, or statistics will be free from errors or
          suitable for your specific tax, compliance, or reporting needs.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NIVESH PUSTIKA AND ITS OPERATORS SHALL
          NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE
          THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICE SHALL NOT
          EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS BEFORE THE CLAIM (WHICH, FOR THE
          FREE STANDARD PLAN, IS ZERO), OR ₹5,000, WHICHEVER IS GREATER, UNLESS A HIGHER LIMIT IS
          REQUIRED BY LAW.
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnification">
        <p>
          You agree to indemnify and hold harmless Nivesh Pustika and its operators from claims,
          damages, and expenses (including reasonable legal fees) arising from your use of the
          Service, Your Content, or your violation of these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="13. Termination">
        <p>
          You may stop using the Service at any time. You may request account deletion by contacting{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-700 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          We may terminate or suspend your access if you breach these Terms or if required by law.
          Sections that by their nature should survive termination (including disclaimers, limitation
          of liability, and governing law) will survive.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing law and disputes">
        <p>
          These Terms are governed by the laws of <strong>India</strong>, without regard to
          conflict-of-law principles. Any dispute arising from these Terms or the Service shall be
          subject to the exclusive jurisdiction of the courts located in India, unless otherwise
          required by applicable consumer protection law.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>For questions about these Terms, contact:</p>
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
      </LegalSection>
    </LegalPageLayout>
  );
}
