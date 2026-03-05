import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const domains = [
  {
    number: '01',
    name: 'IKIGAI',
    weight: '25%',
    authorities: 'Viktor Frankl (Man\u2019s Search for Meaning) \u2022 Ken Mogi (The Little Book of Ikigai)',
    description:
      'Maps the 4 classical Ikigai circles: Passion, Mission, Profession, and Vocation. Frankl\u2019s logotherapy principle \u2014 that meaning, not pleasure, drives human fulfilment \u2014 anchors the mission questions. Mogi\u2019s daily ikigai concept shapes the small-joy and present-awareness items.',
  },
  {
    number: '02',
    name: 'PERSONALITY \u2014 MBTI + BIG FIVE',
    weight: '10%',
    authorities: 'Carl Jung (Psychological Types) \u2022 McCrae & Costa (Big Five OCEAN)',
    description:
      'The Myers-Briggs format (forced A/B choices) probes the 4 Jungian axes: E/I, S/N, T/F, J/P. The OCEAN scale \u2014 one of the most replicated findings in personality psychology \u2014 adds 5 Likert-scale trait dimensions validated across cultures and decades.',
  },
  {
    number: '03',
    name: '16 PERSONALITIES',
    weight: '10%',
    authorities: 'Isabel Briggs Myers \u2022 David Keirsey (Temperament Theory)',
    description:
      'Extends the MBTI with Keirsey\u2019s temperament model and adds the modern Identity axis (Assertive vs. Turbulent). Produces a full 5-letter type code (e.g. INTJ-A) linking personality to life strategy and decision style.',
  },
  {
    number: '04',
    name: 'DECISION MAKING',
    weight: '20%',
    authorities: 'Annie Duke (Thinking in Bets) \u2022 Barry Schwartz (The Paradox of Choice)',
    description:
      'Measures decision process quality \u2014 not outcome luck. Duke\u2019s probabilistic thinking framework underpins the process items. Schwartz\u2019s maximiser vs. satisficer distinction shapes the decision style section, revealing whether complexity helps or paralyses you.',
  },
  {
    number: '05',
    name: 'FINANCIAL DECISION MAKING',
    weight: '20%',
    authorities:
      'Daniel Kahneman (Thinking, Fast and Slow \u2014 Nobel Prize 2002) \u2022 Morgan Housel (The Psychology of Money)',
    description:
      'Reverse-scored bias detection items surface loss aversion, anchoring, and overconfidence \u2014 the three most financially damaging cognitive errors per Kahneman. Housel\u2019s behavioural finance lens shapes the long-term pattern questions.',
  },
  {
    number: '06',
    name: 'CHANGE DIRECTION',
    weight: '15%',
    authorities: 'William Bridges (Transitions) \u2022 Carol Dweck (Mindset \u2014 Stanford)',
    description:
      'Bridges\u2019 3-phase transition model (Ending \u2192 Neutral Zone \u2192 New Beginning) maps directly to Q101\u2013110. Dweck\u2019s growth mindset research \u2014 among the most cited in education and leadership \u2014 underpins Q111\u2013120.',
  },
]

const scoreTable = [
  { domain: 'Ikigai', weight: '25%' },
  { domain: 'Personality \u2014 MBTI + Big Five', weight: '10%' },
  { domain: '16 Personalities', weight: '10%' },
  { domain: 'Decision Making', weight: '20%' },
  { domain: 'Financial Decision Making', weight: '20%' },
  { domain: 'Change Direction', weight: '15%' },
]

const bands = [
  { label: 'Drifting', range: '<40', bg: 'bg-gray-200 text-gray-700' },
  { label: 'Awakening', range: '40\u201359', bg: 'bg-yellow-100 text-yellow-800' },
  { label: 'Aligned', range: '60\u201374', bg: 'bg-blue-100 text-blue-800' },
  { label: 'Flourishing', range: '75\u201389', bg: 'bg-green-100 text-green-800' },
  { label: 'Integrated', range: '90\u2013100', bg: 'bg-[#00AEEF]/15 text-[#00AEEF]' },
]

const references = [
  'Frankl, V. (1946). Man\u2019s Search for Meaning.',
  'Mogi, K. (2017). The Little Book of Ikigai. Octopus Publishing.',
  'McCrae, R. R., & Costa, P. T. (1987). Validation of the Five-Factor Model of personality. Journal of Personality and Social Psychology.',
  'Myers, I. B., & Briggs, K. C. MBTI Manual. Consulting Psychologists Press.',
  'Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.',
  'Housel, M. (2020). The Psychology of Money. Harriman House.',
  'Duke, A. (2018). Thinking in Bets. Portfolio/Penguin.',
  'Schwartz, B. (2004). The Paradox of Choice. HarperCollins.',
  'Bridges, W. (1980). Transitions: Making Sense of Life\u2019s Changes. Addison-Wesley.',
  'Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.',
]

export default function Methodology() {
  return (
    <div className="bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0F1E] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6">
            Built on Science.<br />Designed for Clarity.
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Every question in the Think Big assessment is grounded in peer-reviewed research and validated psychological frameworks.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-[#00AEEF] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Take the Assessment <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Intro Card ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F0F8FF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              The Think Big evaluation is not a quiz &mdash; it is a structured self-reflection instrument built on decades of behavioural science. Each of the 6 domains maps to specific academic frameworks whose findings have been replicated across millions of people worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6 Domain Cards ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Academic Foundations</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">The 6 Domains</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((d) => (
              <div
                key={d.number}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#00AEEF]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#00AEEF] font-extrabold text-sm bg-[#00AEEF]/10 px-3 py-1 rounded-lg">
                    {d.number}
                  </span>
                  <h3 className="font-bold text-[#0A0F1E] text-sm uppercase tracking-wide">{d.name}</h3>
                  <span className="ml-auto text-xs font-semibold text-[#F5A623] bg-[#F5A623]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {d.weight} of score
                  </span>
                </div>
                <p className="text-sm text-gray-400 italic mb-3">{d.authorities}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Scoring Works ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#F0F8FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Scoring</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E]">How Your Score is Calculated</h2>
          </div>

          {/* Score table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
            <div className="grid grid-cols-2 bg-gray-50 px-6 py-3 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Weight</span>
            </div>
            {scoreTable.map((row) => (
              <div key={row.domain} className="grid grid-cols-2 px-6 py-3.5 border-b border-gray-50 last:border-b-0">
                <span className="text-sm font-medium text-[#0A0F1E]">{row.domain}</span>
                <span className="text-sm font-semibold text-[#00AEEF] text-right">{row.weight}</span>
              </div>
            ))}
          </div>

          {/* Score bands */}
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0A0F1E] mb-4">Scores map to 5 bands:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {bands.map((b) => (
                <span key={b.label} className={`${b.bg} text-xs font-semibold px-4 py-2 rounded-full`}>
                  {b.label} &middot; {b.range}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Honest Limitations ────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{'\u26A0\uFE0F'}</span>
              <h2 className="text-xl font-bold text-[#0A0F1E]">What This Assessment Is (and Isn&apos;t)</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                Self-report instrument &mdash; results depend on honest introspection
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                Not a clinical diagnostic tool or substitute for professional assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                Scores reflect your current state, not a fixed identity
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">&bull;</span>
                Recommended: retake every 90 days to track growth
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── References ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F0F8FF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#00AEEF] text-sm font-semibold uppercase tracking-wider mb-3">Sources</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1E]">References</h2>
          </div>
          <ol className="space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="text-sm text-gray-500 leading-relaxed">
                <span className="italic">{ref}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#0A0F1E] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 tracking-tight">
            Ready to see where you stand?
          </h2>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-[#00AEEF] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Take the Assessment <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}
