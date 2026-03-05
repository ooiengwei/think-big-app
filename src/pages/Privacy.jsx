import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  { id: 'who-we-are', label: '1. Who We Are' },
  { id: 'what-data-we-collect', label: '2. Data We Collect' },
  { id: 'how-we-use-your-data', label: '3. How We Use Data' },
  { id: 'data-storage-and-security', label: '4. Storage & Security' },
  { id: 'cookies-and-tracking', label: '5. Cookies & Tracking' },
  { id: 'third-party-sub-processors', label: '6. Sub-Processors' },
  { id: 'data-retention', label: '7. Data Retention' },
  { id: 'your-rights-pdpa-malaysia', label: '8. Your Rights (PDPA)' },
  { id: 'childrens-privacy', label: "9. Children's Privacy" },
  { id: 'changes-to-this-policy', label: '10. Changes' },
  { id: 'contact-and-data-controller', label: '11. Contact' },
]

export default function Privacy() {
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')

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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 break-words">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Your privacy matters. Here is exactly what we collect, why, and how it is protected.
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

              {/* 1. Who We Are */}
              <section id="who-we-are" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  1. Who We Are
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>
                    Think Big is a life evaluation and self-reflection web application operated by ITG Management Sdn. Bhd., based in Malaysia. We can be reached at{' '}
                    <a href="mailto:thinkbig.eco@gmail.com" className="text-[#00AEEF] hover:underline">thinkbig.eco@gmail.com</a>.
                  </p>
                  <p>
                    This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the Think Big app at think-big-app.vercel.app.
                  </p>
                </div>
              </section>

              {/* 2. What Data We Collect */}
              <section id="what-data-we-collect" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  2. What Data We Collect
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#F0F8FF] rounded-xl p-5 border border-gray-100">
                    <p className="text-lg mb-3">&#128100; <span className="font-bold text-[#0A0F1E]">Guest Users</span></p>
                    <ul className="list-disc pl-5 text-gray-600 leading-relaxed text-base space-y-1.5">
                      <li>No account or email required</li>
                      <li>Assessment responses (stored by anonymous session ID)</li>
                      <li>Domain scores and composite score</li>
                      <li>Browser/session metadata (no cookies set by us)</li>
                    </ul>
                  </div>
                  <div className="bg-[#F0F8FF] rounded-xl p-5 border border-gray-100">
                    <p className="text-lg mb-3">&#128272; <span className="font-bold text-[#0A0F1E]">Registered Users</span></p>
                    <ul className="list-disc pl-5 text-gray-600 leading-relaxed text-base space-y-1.5">
                      <li>Email address (used for login only)</li>
                      <li>Assessment responses and scores</li>
                      <li>Score history across multiple sessions</li>
                      <li>Account creation date</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">
                  We do <span className="font-bold">NOT</span> collect: name, phone number, payment details (unless you purchase a report via Stripe), IP address logs, or location data.
                </p>
              </section>

              {/* 3. How We Use Your Data */}
              <section id="how-we-use-your-data" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  3. How We Use Your Data
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We use your data solely to provide the service:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Generate your personalised coaching report</li>
                    <li>Display your score history on your Dashboard</li>
                    <li>Allow you to re-take and compare assessments over time</li>
                    <li>Improve the accuracy and quality of the assessment (aggregated, anonymised only)</li>
                  </ul>
                  <p>We do not:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Sell your data to any third party</li>
                    <li>Use your data for advertising or profiling</li>
                    <li>Share your individual responses with anyone</li>
                  </ul>
                </div>
              </section>

              {/* 4. Data Storage & Security */}
              <section id="data-storage-and-security" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  4. Data Storage &amp; Security
                </h2>
                <div className="bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-xl p-6">
                  <p className="text-gray-600 leading-relaxed text-base mb-4">
                    Your data is stored via Supabase (PostgreSQL database), hosted on Amazon Web Services (AWS) infrastructure.
                  </p>
                  <p className="font-bold text-[#0A0F1E] mb-3">Security measures in place:</p>
                  <ul className="text-gray-600 leading-relaxed text-base space-y-2">
                    <li>&#9989; SOC 2 Type 2 compliance (Supabase)</li>
                    <li>&#9989; Encryption in transit (TLS/HTTPS)</li>
                    <li>&#9989; Encryption at rest (AES-256)</li>
                    <li>&#9989; Row-Level Security (RLS) &mdash; you can only access your own data</li>
                    <li>&#9989; No plain-text passwords stored (Supabase Auth handles hashing)</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed text-base mt-4">
                    The app is deployed via Vercel, which maintains its own security standards for hosting infrastructure.
                  </p>
                </div>
              </section>

              {/* 5. Cookies & Tracking */}
              <section id="cookies-and-tracking" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  5. Cookies &amp; Tracking
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We do not use advertising cookies or third-party tracking pixels.</p>
                  <p>The following minimal storage is used to operate the service:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><span className="font-medium">localStorage:</span> stores your anonymous session ID (guest) or authentication token (registered user) &mdash; this stays on your device only</li>
                    <li>No cross-site tracking</li>
                    <li>No analytics cookies (we do not run Google Analytics or similar)</li>
                  </ul>
                </div>
              </section>

              {/* 6. Third-Party Sub-Processors */}
              <section id="third-party-sub-processors" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  6. Third-Party Sub-Processors
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We rely on the following third-party services to operate the App. Each processes data only as needed to provide their service:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
                      <thead className="bg-[#F0F8FF]">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-[#0A0F1E]">Provider</th>
                          <th className="px-4 py-3 font-semibold text-[#0A0F1E]">Purpose</th>
                          <th className="px-4 py-3 font-semibold text-[#0A0F1E]">Privacy Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-4 py-3 font-medium">Supabase</td>
                          <td className="px-4 py-3">Database &amp; authentication</td>
                          <td className="px-4 py-3">
                            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">supabase.com/privacy</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Amazon Web Services (AWS)</td>
                          <td className="px-4 py-3">Cloud infrastructure (via Supabase)</td>
                          <td className="px-4 py-3">
                            <a href="https://aws.amazon.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">aws.amazon.com/privacy</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Vercel</td>
                          <td className="px-4 py-3">App hosting &amp; deployment</td>
                          <td className="px-4 py-3">
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">vercel.com/legal/privacy-policy</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Stripe (future)</td>
                          <td className="px-4 py-3">Payment processing (paid reports)</td>
                          <td className="px-4 py-3">
                            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">stripe.com/privacy</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>We do not share your personal data with any other third parties.</p>
                </div>
              </section>

              {/* 7. Data Retention */}
              <section id="data-retention" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  7. Data Retention
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>
                    <span className="font-bold text-[#0A0F1E]">Guest users:</span> Anonymous session data is not permanently linked to any identity. It may be retained for up to 90 days before automatic deletion.
                  </p>
                  <p>
                    <span className="font-bold text-[#0A0F1E]">Registered users:</span> Your account data is retained for as long as your account is active. You may request deletion at any time.
                  </p>
                  <p>
                    To delete your account and all associated data: email{' '}
                    <a href="mailto:thinkbig.eco@gmail.com" className="text-[#00AEEF] hover:underline">thinkbig.eco@gmail.com</a>{' '}
                    with subject &ldquo;Data Deletion Request&rdquo;. We will process your request within 14 business days.
                  </p>
                </div>
              </section>

              {/* 8. Your Rights (PDPA Malaysia) */}
              <section id="your-rights-pdpa-malaysia" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  8. Your Rights (PDPA Malaysia)
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>Under the Personal Data Protection Act 2010 (PDPA) of Malaysia, you have the right to:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Access the personal data we hold about you</li>
                    <li>Correct inaccurate personal data <span className="text-xs text-gray-500 ml-2">(Email corrections can be made in <Link to="/settings" className="text-[#00AEEF] hover:underline">Account Settings</Link>)</span></li>
                    <li>Request deletion of your personal data</li>
                    <li>Withdraw consent to data processing (this will require account deletion)</li>
                    <li>Lodge a complaint with the Department of Personal Data Protection (JPDP) Malaysia</li>
                  </ul>

                  <div className="bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-xl p-5 space-y-3">
                    <p className="font-semibold text-[#0A0F1E]">How to correct your data:</p>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-[#0A0F1E]">Registered email address —</span>{' '}
                        Email us at{' '}
                        <a href="mailto:thinkbig.eco@gmail.com" className="text-[#00AEEF] hover:underline">thinkbig.eco@gmail.com</a>{' '}
                        with subject <span className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded">&ldquo;Data Correction Request&rdquo;</span> and include your registered email and the correction needed. We will action within 14 business days.
                      </p>
                      <p>
                        <span className="font-medium text-[#0A0F1E]">Assessment responses &amp; scores —</span>{' '}
                        Your assessment data is self-generated. If you feel your answers no longer reflect your current state, simply retake the assessment. Your latest results will appear at the top of your Dashboard.
                      </p>
                    </div>
                  </div>

                  <p>
                    To exercise any other rights, contact us at{' '}
                    <a href="mailto:thinkbig.eco@gmail.com" className="text-[#00AEEF] hover:underline">thinkbig.eco@gmail.com</a>.
                  </p>
                </div>
              </section>

              {/* 9. Children's Privacy */}
              <section id="childrens-privacy" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  Think Big is not intended for users under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has submitted data, contact us immediately and we will delete it.
                </p>
              </section>

              {/* 10. Changes to This Policy */}
              <section id="changes-to-this-policy" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  10. Changes to This Policy
                </h2>
                <div className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>
                    We may update this Privacy Policy from time to time. We will update the &ldquo;Last Updated&rdquo; date at the top of this page. For significant changes, we will notify registered users via email where possible.
                  </p>
                  <p>
                    Continued use of the App after changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* 11. Contact & Data Controller */}
              <section id="contact-and-data-controller" className="scroll-mt-24">
                <h2 className="text-[#0A0F1E] font-bold text-xl mb-3 border-l-4 border-[#00AEEF] pl-4">
                  11. Contact &amp; Data Controller
                </h2>
                <div className="bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-xl p-6">
                  <div className="text-gray-600 leading-relaxed text-base space-y-2">
                    <p><span className="font-medium">Data Controller:</span> ITG Management Sdn. Bhd.</p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href="mailto:thinkbig.eco@gmail.com" className="text-[#00AEEF] hover:underline">thinkbig.eco@gmail.com</a>
                    </p>
                    <p><span className="font-medium">Location:</span> Malaysia</p>
                    <p><span className="font-medium">Response time:</span> Within 14 business days</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-base mt-4">
                    For privacy-related requests, please include your registered email address and a description of your request.
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
