import { Link } from 'react-router-dom'
import { ArrowRight, Target, Brain, TrendingUp, Shield, DollarSign, RefreshCw } from 'lucide-react'
import DomainRadarChart from '../components/DomainRadarChart'
import { sampleScores } from '../lib/scoring'

const features = [
  { icon: Target, title: 'Ikigai', desc: 'Discover your purpose at the intersection of passion, mission, profession, and vocation.' },
  { icon: Brain, title: 'Personality', desc: 'Understand your MBTI type and Big Five traits for deeper self-awareness.' },
  { icon: Shield, title: '16 Personalities', desc: 'Uncover your cognitive style across mind, energy, nature, tactics, and identity.' },
  { icon: TrendingUp, title: 'Decision Making', desc: 'Evaluate your process, clarity, and honesty in making life choices.' },
  { icon: DollarSign, title: 'Financial Decision', desc: 'Assess biases, behaviours, and risk calibration in your financial life.' },
  { icon: RefreshCw, title: 'Change Direction', desc: 'Measure your readiness for transition, resilience, and growth mindset.' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-red-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-dark leading-tight">
                Think Big.{' '}
                <span className="text-primary">Live Intentionally.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-lg">
                A comprehensive life evaluation across 6 key domains. Understand where you are, discover your strengths, and chart your path forward.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors"
                >
                  Start Free Assessment
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#domains"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 text-dark px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                120 questions &middot; ~15 minutes &middot; No signup required
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-center text-sm font-medium text-gray-500 mb-2">Sample Assessment Result</h3>
              <DomainRadarChart scores={sampleScores} size={320} />
              <div className="text-center mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Composite: {sampleScores.composite} &mdash; {sampleScores.compositeBand}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark text-center mb-4">6 Domains of Life Evaluation</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Each domain is carefully weighted to give you a holistic composite score that reflects your overall life alignment.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Bands */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Where Will You Land?</h2>
          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { band: 'Drifting', range: '0-39', color: 'bg-red-500' },
              { band: 'Awakening', range: '40-59', color: 'bg-amber-500' },
              { band: 'Aligned', range: '60-74', color: 'bg-blue-500' },
              { band: 'Flourishing', range: '75-89', color: 'bg-emerald-500' },
              { band: 'Integrated', range: '90-100', color: 'bg-violet-500' },
            ].map(b => (
              <div key={b.band} className="text-center p-4 rounded-xl bg-light">
                <div className={`w-4 h-4 ${b.color} rounded-full mx-auto mb-2`} />
                <p className="font-semibold text-dark">{b.band}</p>
                <p className="text-xs text-gray-500">{b.range}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Score?</h2>
          <p className="text-red-100 mb-8">
            Take the free assessment now. No signup required to get started.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Assessment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
