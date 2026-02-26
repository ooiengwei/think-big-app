import { Link } from 'react-router-dom'
import { ArrowRight, Target, Brain, TrendingUp, Shield, DollarSign, RefreshCw, ChevronRight, Sparkles, Clock, Layers, Zap } from 'lucide-react'
import DomainRadarChart from '../components/DomainRadarChart'
import { sampleScores } from '../lib/scoring'

const domains = [
  {
    icon: Target,
    title: 'Ikigai',
    weight: '25%',
    desc: 'Discover your purpose at the intersection of passion, mission, profession, and vocation.',
    color: 'bg-sky-50 hover:bg-sky-100/60',
    iconColor: 'text-[#00AEEF]',
    iconBg: 'bg-[#00AEEF]/10',
  },
  {
    icon: Brain,
    title: 'Personality',
    weight: '10%',
    desc: 'Understand your MBTI type and Big Five traits for deeper self-awareness and better decisions.',
    color: 'bg-violet-50 hover:bg-violet-100/60',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: '16 Personalities',
    weight: '10%',
    desc: 'Uncover your cognitive style across mind, energy, nature, tactics, and identity dimensions.',
    color: 'bg-indigo-50 hover:bg-indigo-100/60',
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Decision Making',
    weight: '20%',
    desc: 'Evaluate the quality, honesty, and consistency of how you make important life choices.',
    color: 'bg-emerald-50 hover:bg-emerald-100/60',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-600/10',
  },
  {
    icon: DollarSign,
    title: 'Financial Decision',
    weight: '20%',
    desc: 'Assess your biases, behaviours, and risk calibration in financial thinking.',
    color: 'bg-amber-50 hover:bg-amber-100/60',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-600/10',
  },
  {
    icon: RefreshCw,
    title: 'Change Direction',
    weight: '15%',
    desc: 'Measure your readiness for transition, resilience under uncertainty, and growth mindset.',
    color: 'bg-rose-50 hover:bg-rose-100/60',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/10',
  },
]

const bands = [
  { band: 'Drifting',    range: '0–39',   color: '#EF4444', desc: 'Disconnected from direction and purpose' },
  { band: 'Awakening',   range: '40–59',  color: '#F59E0B', desc: 'Noticing patterns, building awareness' },
  { band: 'Aligned',     range: '60–74',  color: '#3B82F6', desc: 'Living with intention and coherence' },
  { band: 'Flourishing', range: '75–89',  color: '#10B981', desc: 'Thriving with purpose and momentum' },
  { band: 'Integrated',  range: '90–100', color: '#8B5CF6', desc: 'Rare harmony across all life domains' },
]

const steps = [
  { n: '01', title: 'Take the Assessment', desc: '120 thoughtful questions across 6 life domains. No signup needed — takes about 15 minutes.', icon: Layers },
  { n: '02', title: 'Get Your Score', desc: 'See your composite score, domain breakdown, and a radar chart showing exactly where you stand.', icon: Sparkles },
  { n: '03', title: 'Read Your Report', desc: 'Get a personalised coaching report with insights, observations, and a 90-day action plan.', icon: Zap },
]

const stats = [
  { label: 'Questions', value: '120' },
  { label: 'Domains', value: '6' },
  { label: 'Minutes', value: '15' },
  { label: 'Cost', value: 'Free' },
]

export default function Landing() {
  return (
    <div className="bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00AEEF] via-[#0097D0] to-[#006FA6] text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left: copy */}
            <div className="animate-fade-in">
              {/* Brand logo lockup */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="/think-big-logo.jpg"
                  alt="Think Big"
                  className="h-14 w-14 rounded-2xl shadow-lg object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-[0.2em]">Life Evaluation</p>
                  <h1 className="text-2xl font-extrabold leading-none tracking-tight">Think Big</h1>
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
                Discover Where You<br />
                <span className="text-blue-200">Truly Stand in Life.</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-lg mb-8">
                A comprehensive 120-question assessment across 6 key life domains.
                Understand your strengths, identify your blind spots, and get a personalised coaching report.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#00AEEF] font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
                >
                  Start Free Assessment
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
                >
                  How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-1.5">&#10003; 120 questions</span>
                <span className="flex items-center gap-1.5">&#10003; ~15 minutes</span>
                <span className="flex items-center gap-1.5">&#10003; No signup required</span>
              </div>
            </div>

            {/* Right: sample result card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-[#0A0F1E] ring-1 ring-black/5 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Sample Result</h3>
                <span className="text-xs bg-[#00AEEF]/10 text-[#00AEEF] font-semibold px-3 py-1 rounded-full">
                  {sampleScores.compositeBand} &middot; {sampleScores.composite}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">This is what your personalised radar chart looks like</p>
              <DomainRadarChart scores={sampleScores} size={300} />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {Object.entries(sampleScores.domains).slice(0, 3).map(([key, d]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-2.5">
                    <p className="font-bold text-[#0A0F1E] text-base">{d.score}</p>
                    <p className="text-xs text-gray-500 capitalize">{key === '16p' ? '16P' : key}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {stats.map(s => (
              <div key={s.label} className="py-6 sm:py-8 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1E]">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#F0F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Three simple steps to a complete picture of where you stand in life.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <s.icon size={22} className="text-[#00AEEF]" />
                  </div>
                  <span className="text-[#00AEEF] font-extrabold text-sm">{s.n}</span>
                </div>
                <h3 className="font-bold text-[#0A0F1E] text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {s.n !== '03' && (
                  <ChevronRight size={20} className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-[#00AEEF] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Take the Assessment Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 Domains ─────────────────────────────────────────────────── */}
      <section id="domains" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Comprehensive Evaluation</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">6 Domains of Life Evaluation</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Each domain is grounded in world-class research and weighted to give you a holistic composite score.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {domains.map(d => (
              <div key={d.title} className={`${d.color} rounded-2xl p-6 border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${d.iconBg} rounded-xl flex items-center justify-center`}>
                    <d.icon size={20} className={d.iconColor} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-white/80 px-2.5 py-1 rounded-full">{d.weight}</span>
                </div>
                <h3 className="font-bold text-[#0A0F1E] text-base mb-1.5">{d.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Score Bands ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#F0F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Score Bands</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">Where Will You Land?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Your composite score places you in one of five life alignment bands.
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-3">
            {bands.map(b => (
              <div
                key={b.band}
                className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#0A0F1E] text-base">{b.band}</p>
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{b.range}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">What People Say</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">Trusted by Thinkers</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { quote: "The coaching report gave me more clarity in 15 minutes than months of journaling. Genuinely life-changing.", name: "Sarah K.", role: "Entrepreneur" },
              { quote: "I didn't expect a free tool to be this thorough. The 90-day plan alone was worth it. Highly recommended.", name: "James L.", role: "Software Engineer" },
              { quote: "Finally, an assessment that treats me like an adult. No gimmicks, just honest insight and real next steps.", name: "Priya M.", role: "Product Manager" },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 sm:p-7 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#F5A623] text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-[#0A0F1E]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#00AEEF] via-[#0097D0] to-[#006FA6] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <img src="/think-big-logo.jpg" alt="Think Big" className="h-16 w-16 rounded-2xl mx-auto mb-6 shadow-lg object-cover ring-2 ring-white/20" />
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 tracking-tight">
            Ready to Think Big?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands discovering where they truly stand &mdash; and what to do about it.
            Free forever. No credit card. No sign-up to start.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-white text-[#00AEEF] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Start Your Free Assessment
            <ArrowRight size={20} />
          </Link>
          <p className="mt-5 text-sm text-blue-200">120 questions &middot; ~15 minutes &middot; Full coaching report included</p>
        </div>
      </section>

    </div>
  )
}
