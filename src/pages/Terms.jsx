import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  { id: 'acceptance-of-terms', label: '1. Acceptance of Terms' },
  { id: 'about-the-service', label: '2. About the Service' },
  { id: 'not-a-clinical-or-professional-service', label: '3. Not Clinical' },
  { id: 'user-accounts', label: '4. User Accounts' },
  { id: 'your-data-and-privacy', label: '5. Data & Privacy' },
  { id: 'intellectual-property', label: '6. Intellectual Property' },
  { id: 'paid-features', label: '7. Paid Features' },
  { id: 'prohibited-conduct', label: '8. Prohibited Conduct' },
  { id: 'disclaimers-and-limitation-of-liability', label: '9. Disclaimers' },
  { id: 'changes-to-terms', label: '10. Changes to Terms' },
  { id: 'governing-law', label: '11. Governing Law' },
  { id: 'contact', label: '12. Contact' },
]

export default function Terms() {
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef({})

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#F0F8FF] min-h-screen">
      {/* Hero */}
      <section className="bg-[#0A0F1E] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6">
            Terms of Use
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Please read these terms carefully before using Think Big.
          </p>
          <p className="text-gray-500 text-sm">Effective Date: 5 March 2025</p>
          <p className="text-gray-500 text-sm">Last Updated: 5 March 2025</p>
        </div>
      </section>

      {/* Layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16 relative">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* Table of Contents sidebar — desktop only */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">On this page</p>
              <ul className="space-y-1.5">
                {sections.map(s => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block text-sm py-1 transition-colors ${
                        activeSection === s.id
                          ? 'text-[#00AEEF] font-medium'
                          : 'text-gray-500 hover:text-[#00AEEF]'
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <div className="space-y-10">

              {/* 1. Acceptance of Terms */}
              <section id="acceptance-of-terms">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  By accessing or using the Think Big web application (&ldquo;App&rdquo;), you agree to be bound by these Terms of Use. If you do not agree, please do not use the App. These Terms apply to all users &mdash; registered and guest.
                </p>
              </section>

              {/* 2. About the Service */}
              <section id="about-the-service">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  2. About the Service
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>
                    Think Big is an online self-reflection and life evaluation tool. It presents a 120-question assessment across 6 domains &mdash; Ikigai, Personality, 16 Personalities, Decision Making, Financial Decision Making, and Change Direction &mdash; and generates a personalised coaching report based on your responses.
                  </p>
                  <p>
                    The App is operated by Ooi Eng Wei, based in Malaysia.
                  </p>
                </div>
              </section>

              {/* 3. Not a Clinical or Professional Service */}
              <section id="not-a-clinical-or-professional-service">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  3. Not a Clinical or Professional Service
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
                  <p className="font-bold text-amber-800 mb-2">&#9888;&#65039; Important Disclaimer</p>
                  <div className="text-gray-600 leading-relaxed text-base space-y-3">
                    <p>Think Big is a self-reflection instrument, not a clinical diagnostic tool.</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>It is not a substitute for professional psychological, psychiatric, medical, legal, or financial advice.</li>
                      <li>Results are not a clinical diagnosis of any mental health condition, personality disorder, or cognitive impairment.</li>
                      <li>Scores and coaching reports are for personal growth purposes only.</li>
                      <li>If you are experiencing mental health difficulties, please consult a licensed professional.</li>
                    </ul>
                    <p>We make no warranty that assessment results are accurate, complete, or suitable for any specific purpose.</p>
                  </div>
                </div>
              </section>

              {/* 4. User Accounts */}
              <section id="user-accounts">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  4. User Accounts
                </h2>
                <div className="text-gray-600 leading-relaxed text-base divide-y divide-gray-100">
                  <div className="pb-4">
                    <p><span className="font-bold text-[#0A0F1E]">4.1 Registration</span> &mdash; You may complete the assessment as a guest (no account required) or create a registered account to save your history.</p>
                  </div>
                  <div className="py-4">
                    <p><span className="font-bold text-[#0A0F1E]">4.2 Account Responsibility</span> &mdash; You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your account or allow unauthorised access.</p>
                  </div>
                  <div className="py-4">
                    <p><span className="font-bold text-[#0A0F1E]">4.3 Age Requirement</span> &mdash; You must be at least 18 years old (or the age of majority in your country) to create an account or use this App.</p>
                  </div>
                  <div className="pt-4">
                    <p><span className="font-bold text-[#0A0F1E]">4.4 Accurate Information</span> &mdash; You agree to provide accurate information during registration. We reserve the right to terminate accounts with false information.</p>
                  </div>
                </div>
              </section>

              {/* 5. Your Data & Privacy */}
              <section id="your-data-and-privacy">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  5. Your Data &amp; Privacy
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-6">
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">5.1 What We Collect</h3>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><span className="font-medium">Guest users:</span> Assessment responses and scores stored temporarily by session (no personal identity linked).</li>
                      <li><span className="font-medium">Registered users:</span> Email address, assessment responses, domain scores, and composite score.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">5.2 How We Use It</h3>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>To generate your personalised coaching report</li>
                      <li>To display your score history on your Dashboard</li>
                      <li>We do not sell your data to third parties</li>
                      <li>We do not use your responses for advertising</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">5.3 Data Storage</h3>
                    <p>Data is stored securely via Supabase (PostgreSQL), hosted on Amazon Web Services (AWS) infrastructure. Supabase maintains SOC 2 Type 2 compliance and industry-standard encryption in transit and at rest. Their privacy policy governs infrastructure-level data handling.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">5.4 Data Retention</h3>
                    <p>Guest session data is not permanently linked to your identity. Registered user data is retained until you request account deletion. To delete your account and all associated data, contact us at <a href="mailto:thinkbig@ooi.my" className="text-[#00AEEF] hover:underline">thinkbig@ooi.my</a>.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">5.5 Governing Privacy Law</h3>
                    <p>This App is operated from Malaysia. We comply with the Personal Data Protection Act 2010 (PDPA) of Malaysia.</p>
                  </div>
                </div>
              </section>

              {/* 6. Intellectual Property */}
              <section id="intellectual-property">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  6. Intellectual Property
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-6">
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">6.1 Our Content</h3>
                    <p>All content in the App &mdash; including the 120 assessment questions, scoring methodology, coaching report text, domain framework structure, branding, and design &mdash; is the intellectual property of Ooi Eng Wei and is protected under applicable copyright law.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">6.2 What You May Not Do</h3>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Copy, reproduce, or redistribute the assessment questions or coaching content</li>
                      <li>Reverse-engineer the scoring methodology for commercial use</li>
                      <li>Create derivative works based on our content without written permission</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">6.3 Academic Sources</h3>
                    <p>The conceptual frameworks referenced (Frankl, Kahneman, Myers-Briggs, Big Five, Dweck, etc.) belong to their respective authors and are used under fair reference principles for educational purposes. Think Big does not claim ownership of those frameworks.</p>
                  </div>
                </div>
              </section>

              {/* 7. Paid Features */}
              <section id="paid-features">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  7. Paid Features
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We intend to offer a premium PDF coaching report as a paid feature. When available:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Payment will be processed via Stripe (a third-party payment processor)</li>
                    <li>All prices will be displayed in Malaysian Ringgit (MYR) unless otherwise stated</li>
                    <li>Purchases are non-refundable once the PDF report is generated and delivered</li>
                    <li>By purchasing, you agree to Stripe&apos;s Terms of Service</li>
                  </ul>
                  <p>Until paid features are live, all current features are provided free of charge.</p>
                </div>
              </section>

              {/* 8. Prohibited Conduct */}
              <section id="prohibited-conduct">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  8. Prohibited Conduct
                </h2>
                <div className="text-gray-600 leading-relaxed text-base">
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Use the App for any unlawful purpose</li>
                    <li>Attempt to hack, scrape, or systematically extract data from the App</li>
                    <li>Submit false, misleading, or offensive content</li>
                    <li>Impersonate another person or entity</li>
                    <li>Attempt to circumvent any security features</li>
                  </ul>
                </div>
              </section>

              {/* 9. Disclaimers & Limitation of Liability */}
              <section id="disclaimers-and-limitation-of-liability">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  9. Disclaimers &amp; Limitation of Liability
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-6">
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">9.1 No Warranty</h3>
                    <p>The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind &mdash; express or implied &mdash; including fitness for a particular purpose, accuracy of results, or uninterrupted availability.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">9.2 Limitation of Liability</h3>
                    <div className="space-y-3">
                      <p>To the fullest extent permitted by law, Ooi Eng Wei shall not be liable for any:</p>
                      <ul className="list-disc pl-5 space-y-1.5">
                        <li>Indirect, incidental, or consequential damages arising from your use of the App</li>
                        <li>Decisions made based on assessment results</li>
                        <li>Loss of data, revenue, or opportunity</li>
                        <li>Downtime and service interruptions</li>
                      </ul>
                      <p>Our total liability shall not exceed MYR 50 (or the amount you paid us, if any).</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0F1E] mb-2">9.3 Third-Party Services</h3>
                    <p>We are not responsible for the availability or conduct of third-party services (Supabase, Vercel, Stripe) that the App relies upon.</p>
                  </div>
                </div>
              </section>

              {/* 10. Changes to Terms */}
              <section id="changes-to-terms">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  10. Changes to Terms
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the updated Terms. The &ldquo;Last Updated&rdquo; date at the top of this page will reflect any changes.
                </p>
              </section>

              {/* 11. Governing Law */}
              <section id="governing-law">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  11. Governing Law
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  These Terms are governed by the laws of Malaysia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Malaysia.
                </p>
              </section>

              {/* 12. Contact */}
              <section id="contact">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  12. Contact
                </h2>
                <div className="bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-xl p-5">
                  <p className="text-gray-600 leading-relaxed text-base mb-2">
                    For questions about these Terms or data deletion requests:
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Email:</span>{' '}
                    <a href="mailto:thinkbig@ooi.my" className="text-[#00AEEF] hover:underline">thinkbig@ooi.my</a>
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Operated by:</span> Ooi Eng Wei, Malaysia
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-[#00AEEF] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:bg-[#0097D0] transition-all duration-200 z-50"
        >
          Back to Top &uarr;
        </button>
      )}
    </div>
  )
}
