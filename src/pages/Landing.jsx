import { Link } from 'react-router-dom'
import { ArrowRight, Target, Brain, TrendingUp, Shield, DollarSign, RefreshCw, ChevronRight } from 'lucide-react'
import DomainRadarChart from '../components/DomainRadarChart'
import { sampleScores } from '../lib/scoring'

const domains = [
  {
    icon: Target,
    title: 'Ikigai',
    weight: '25%',
    desc: 'Discover your purpose at the intersection of passion, mission, profession, and vocation.',
    color: 'bg-sky-50',
    iconColor: 'text-primary',
  },
  {
    icon: Brain,
    title: 'Personality',
    weight: '10%',
    desc: 'Understand your MBTI type and Big Five traits for deeper self-awareness and better decisions.',
    color: 'bg-violet-50',
    iconColor: 'text-violet-500',
  },
  {
    icon: Shield,
    title: '16 Personalities',
    weight: '10%',
    desc: 'Uncover your cognitive style across mind, energy, nature, tactics, and identity dimensions.',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    icon: TrendingUp,
    title: 'Decision Making',
    weight: '20%',
    desc: 'Evaluate the quality, honesty, and consistency of how you make important life choices.',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: DollarSign,
    title: 'Financial Decision',
    weight: '20%',
    desc: 'Assess your biases, behaviours, and risk calibration in financial thinking.',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: RefreshCw,
    title: 'Change Direction',
    weight: '15%',
    desc: 'Measure your readiness for transition, resilience under uncertainty, and growth mindset.',
    color: 'bg-rose-50',
    iconColor: 'text-rose-500',
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
  { n: '01', title: 'Take the Assessment', desc: '120 thoughtful questions across 6 life domains. No signup needed — takes about 15 minutes.' },
  { n: '02', title: 'Get Your Score', desc: 'See your composite score, domain breakdown, and a radar chart showing exactly where you stand.' },
  { n: '03', title: 'Read Your Report', desc: 'Get a personalised coaching report with insights, observations, and a 90-day action plan.' },
]

export default function Landing() {
  return (
    <div className="bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00AEEF] via-[#0097D0] to-[#006FA6] text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: copy */}
            <div>
              {/* Brand logo lockup */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="/think-big-logo.jpg"
                  alt="Think Big"
                  className="h-16 w-16 rounded-2xl shadow-lg object-cover"
                />
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-widest">Life Evaluation</p>
                  <h1 className="text-3xl font-extrabold leading-none">Think Big</h1>
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
                Discover Where You<br />
                <span className="text-blue-100">Truly Stand in Life.</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-lg mb-8">
                A comprehensive 120-question assessment across 6 key life domains.
                Understand your strengths, identify your blind spots, and get a personalised coaching report.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  to="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-md text-base"
                >
                  Start Free Assessment
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-blue-200 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-600/30 transition-colors text-base"
                >
                  How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-blue-100">
                <span className="flex items-center gap-1.5">✓ 120 questions</span>
                <span className="flex items-center gap-1.5">✓ ~15 minutes</span>
                <span className="flex items-center gap-1.5">✓ No signup required</span>
              </div>
            </div>

            {/* Right: sample result card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-dark">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700">Sample Result</h3>
                <span className="text-xs bg-blue-100 text-primary font-semibold px-2.5 py-1 rounded-full">
                  {sampleScores.compositeBand} · {sampleScores.composite}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">This is what your personalised radar chart looks like</p>
              <DomainRadarChart scores={sampleScores} size={300} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                {Object.entries(sampleScores.domains).slice(0, 3).map(([key, d]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-2">
                    <p className="font-bold text-dark text-sm">{d.score}</p>
                    <p className="capitalize">{key === '16p' ? '16P' : key}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-dark">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Three simple steps to a complete picture of where you stand in life.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-primary font-extrabold text-lg">{s.n}</span>
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {s.n !== '03' && (
                  <ChevronRight size={20} className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Take the Assessment Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 Domains ─────────────────────────────────────────────────── */}
      <section id="domains" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-dark">6 Domains of Life Evaluation</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Each domain is grounded in world-class research and weighted to give you a holistic composite score.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map(d => (
              <div key={d.title} className={`${d.color} rounded-2xl p-6 border border-transparent hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-3">
                  <d.icon size={22} className={d.iconColor} />
                  <span className="text-xs font-semibold text-gray-400 bg-white/70 px-2 py-0.5 rounded-full">{d.weight} weight</span>
                </div>
                <h3 className="font-bold text-dark text-base mb-1">{d.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Score Bands ───────────────────────────────────────────────── */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-dark">Where Will You Land?</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Your composite score places you in one of five life alignment bands.
            </p>
          </div>
          <div className="grid sm:grid-cols-5 gap-4">
            {bands.map(b => (
              <div
                key={b.band}
                className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100"
              >
                <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: b.color }} />
                <p className="font-bold text-dark text-base">{b.band}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5 mb-2">{b.range}</p>
                <p className="text-xs text-gray-500 leading-snug">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#00AEEF] via-[#0097D0] to-[#006FA6] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img src="/think-big-logo.jpg" alt="Think Big" className="h-16 w-16 rounded-2xl mx-auto mb-6 shadow-lg object-cover" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Think Big?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands discovering where they truly stand — and what to do about it.
            Free forever. No credit card. No sign-up to start.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-md text-lg"
          >
            Start Your Free Assessment
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-blue-200">120 questions · ~15 minutes · Full coaching report included</p>
        </div>
      </section>

    </div>
  )
}
