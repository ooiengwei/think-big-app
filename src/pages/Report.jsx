import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, FileText } from 'lucide-react'
import { getBandColor, getBand } from '../lib/scoring'
import { supabase } from '../lib/supabase'

// ─── Domain meta ──────────────────────────────────────────────────────────────
const DOMAINS = {
  ikigai: { label: 'Ikigai', weight: '25%', icon: '\u{1F338}', authority: 'Viktor Frankl \u00B7 Kenichiro Mogi' },
  personality: { label: 'Personality (MBTI + Big Five)', weight: '10%', icon: '\u{1F9E0}', authority: 'Carl Jung \u00B7 McCrae & Costa' },
  '16p': { label: '16 Personalities', weight: '10%', icon: '\u{1F3AD}', authority: 'Isabel Myers \u00B7 David Keirsey' },
  decision: { label: 'Decision Making', weight: '20%', icon: '\u2696\uFE0F', authority: 'Annie Duke \u00B7 Barry Schwartz' },
  financial: { label: 'Financial Decision', weight: '20%', icon: '\u{1F4B0}', authority: 'Daniel Kahneman \u00B7 Morgan Housel' },
  change: { label: 'Change Direction', weight: '15%', icon: '\u{1F504}', authority: 'William Bridges \u00B7 Carol Dweck' },
}

const BAND_DESC = {
  Drifting:    'You are in a phase of disconnection \u2014 unclear on direction, purpose, or internal alignment. This is the starting point for transformation.',
  Awakening:   'You are beginning to notice patterns and possibilities. Your awareness is sharpening, and change is becoming possible.',
  Aligned:     'You have found meaningful coherence between your values, capabilities, and direction. You are operating with intention.',
  Flourishing: 'You are thriving across most dimensions. Your life reflects deep integration of purpose, skill, and forward momentum.',
  Integrated:  'You have reached rare harmony across all domains \u2014 purpose, personality, decision quality, financial wisdom, and adaptability all reinforce each other.',
}

const BAND_NEXT = {
  Drifting:    'Your priority: build self-awareness. Small, honest reflections each day will begin to dissolve the fog.',
  Awakening:   'Your priority: choose one domain to focus on deeply. Scattered effort awakens nothing \u2014 focused effort transforms everything.',
  Aligned:     'Your priority: deepen consistency. Alignment maintained under pressure becomes integration.',
  Flourishing: 'Your priority: extend your impact. You have the foundation \u2014 now build the legacy.',
  Integrated:  'Your priority: share what you know. The highest form of mastery is helping others find their path.',
}

// ─── Domain-specific coaching content ─────────────────────────────────────────
function getDomainInsight(key, score, data) {
  const band = getBand(score)
  const s = Math.round(score)

  const insights = {
    ikigai: {
      Drifting:    `With an Ikigai score of ${s}, your four life circles \u2014 passion, mission, profession, and vocation \u2014 are not yet overlapping. You may feel that work is just work, or that you haven\u2019t found \u201cyour thing\u201d yet. This is not a permanent state; it\u2019s an invitation to explore.`,
      Awakening:   `Your Ikigai score of ${s} suggests you can feel glimpses of meaning \u2014 moments where passion or purpose breaks through. The circles are starting to align but haven\u2019t fully converged. You know what you enjoy, but translating it into daily reality is still a work in progress.`,
      Aligned:     `At ${s}, your Ikigai is taking shape. You have a sense of what you\u2019re good at, what the world needs, and what you love \u2014 and these are beginning to intersect meaningfully. The next step is deepening each circle so the overlap becomes larger and more reliable.`,
      Flourishing: `Your Ikigai score of ${s} reflects a life lived with real purpose. You have found meaningful overlap between passion, mission, profession, and vocation. Most days feel worthwhile. The work now is to protect and deepen this \u2014 purpose can erode under busyness.`,
      Integrated:  `At ${s}, you are living your Ikigai fully. Passion, mission, profession, and vocation have merged into a coherent whole. This is rare. Your task is to stay curious \u2014 purpose at this level can calcify into rigidity if you stop questioning it.`,
    },
    personality: {
      Drifting:    `Your Personality score of ${s} suggests limited self-awareness of your cognitive style and trait patterns. You may often feel misunderstood, or find yourself in environments that drain rather than energise you. The path forward starts with honest self-observation.`,
      Awakening:   `At ${s}, you\u2019re beginning to understand how your personality shapes your decisions and relationships. You may have taken personality assessments before but haven\u2019t yet integrated the insights into your daily choices. Self-knowledge at this stage is gathering \u2014 not yet applied.`,
      Aligned:     `Your Personality score of ${s} shows you have a working model of who you are. You understand your preferences, your strengths, and some of your blind spots. The next step: use this model actively \u2014 in how you communicate, choose environments, and build relationships.`,
      Flourishing: `At ${s}, your personality self-awareness is a genuine asset. You understand your MBTI type and Big Five profile, and you use this knowledge to make better choices about work, relationships, and energy management. You know when to push and when to step back.`,
      Integrated:  `Your Personality score of ${s} reflects mastery of self-knowledge. You don\u2019t just know your type \u2014 you operate from it with fluency. You can flex your style consciously, read others accurately, and build environments that bring out your best.`,
    },
    '16p': {
      Drifting:    `Your 16 Personalities score of ${s} suggests your personality axes are unclear or inconsistent. You may shift behaviour significantly depending on context, making it hard for others (and yourself) to predict how you\u2019ll show up.`,
      Awakening:   `At ${s}, some of your personality dimensions are clearer than others. You have a tentative type, but it doesn\u2019t feel fully settled. That\u2019s normal \u2014 type clarity often deepens in your 30s as life experience reinforces your natural tendencies.`,
      Aligned:     `Your score of ${s} shows reasonable clarity across your personality type. You know your mind, energy, nature, and tactics preferences \u2014 even if one or two axes feel less decisive. Your type is a useful map, even if the territory sometimes surprises you.`,
      Flourishing: `At ${s}, your personality type is decisively clear. You show up consistently across contexts, and your type gives you reliable guidance on how to structure work, relationships, and personal growth. You\u2019re not confused about who you are.`,
      Integrated:  `Your score of ${s} reflects exceptional type clarity across all five axes. Your personality isn\u2019t just clear \u2014 it\u2019s a tool you wield with precision. You know exactly how to channel your type\u2019s strengths and where to compensate for its blind spots.`,
    },
    decision: {
      Drifting:    `A Decision Making score of ${s} indicates significant gaps in your decision process. You may frequently feel stuck, regretful, or swept along by emotion or external pressure. Building a repeatable decision framework will change your life more than any single good decision.`,
      Awakening:   `At ${s}, you make some good decisions but lack a consistent process. You may rely heavily on gut feel, or swing between over-analysis and impulsive action. The gap between your best and worst decisions is wide. Closing it requires a repeatable framework.`,
      Aligned:     `Your Decision Making score of ${s} shows you have a reasonable process \u2014 you gather information, consider options, and reflect on outcomes. The next level involves eliminating decision debt: old choices that haven\u2019t been revisited, and patterns you haven\u2019t yet named.`,
      Flourishing: `At ${s}, you are a strong decision maker. You have a clear process, you\u2019re honest with yourself when you\u2019re wrong, and you can separate decision quality from outcome quality. Most people never reach this level. The refinement now is in the edges \u2014 very high-stakes, very uncertain decisions.`,
      Integrated:  `Your score of ${s} reflects elite decision-making discipline. You have internalised a process that others would need to study for years. Your decisions are calibrated, honest, and consistently reviewed. You know when you don\u2019t know.`,
    },
    financial: {
      Drifting:    `Your Financial Decision score of ${s} suggests significant cognitive biases are shaping your money choices. Loss aversion, herding, or emotional reactions to market moves may be costing you more than you realise. The first step is not a new strategy \u2014 it\u2019s recognising the biases.`,
      Awakening:   `At ${s}, you\u2019re beginning to distinguish between good financial decisions and good financial outcomes. You understand some of the biases that influence you, but they still catch you off guard. Progress here compounds \u2014 each year of more disciplined thinking pays dividends.`,
      Aligned:     `Your Financial Decision score of ${s} shows solid behavioural and structural competence. You have systems in place, you understand your risk tolerance, and you mostly avoid letting emotion override your plan. The refinement is in the edges \u2014 complex instruments, long-term planning under uncertainty.`,
      Flourishing: `At ${s}, your financial decision-making is excellent. You manage biases consciously, stick to evidence-based choices, and have a clear long-term framework. You know the difference between volatility and loss, and you don\u2019t confuse the two.`,
      Integrated:  `Your score of ${s} reflects the rarest level of financial wisdom. You have deeply integrated both the quantitative and behavioural dimensions of financial decision-making. You invest according to principles, not moods, and your framework holds even under significant stress.`,
    },
    change: {
      Drifting:    `A Change Direction score of ${s} suggests you are either resisting a necessary transition or haven\u2019t yet identified one. Stagnation at this level often feels like comfort \u2014 but it\u2019s usually avoidance in disguise. The willingness to name what needs to end is the first act of change.`,
      Awakening:   `At ${s}, you sense that change is needed but haven\u2019t fully committed to it. You may be in Bridges\u2019 \u201cNeutral Zone\u201d \u2014 the uncomfortable in-between where the old has ended but the new hasn\u2019t started. This is the most creative, and most painful, phase of any transition.`,
      Aligned:     `Your Change Direction score of ${s} shows you are navigating transition well. You have processed some endings, you\u2019re building momentum toward a new beginning, and your mindset supports growth. The challenge now is sustaining this through the inevitable plateaus and setbacks.`,
      Flourishing: `At ${s}, you are an adaptive, resilient person. You handle endings without excessive grief, you tolerate uncertainty without panic, and your growth mindset helps you extract value from almost every experience. Change energises rather than frightens you.`,
      Integrated:  `Your score of ${s} reflects exceptional adaptability and growth orientation. You treat change as data, not threat. You can grieve endings cleanly, navigate neutral zones with curiosity, and build new beginnings with energy. This resilience is a profound asset in an uncertain world.`,
    },
  }

  return insights[key]?.[band] || `Your ${DOMAINS[key]?.label} score is ${s}/100 \u2014 ${band}.`
}

function getDomainActions(key, score) {
  const band = getBand(score)

  const actions = {
    ikigai: {
      Drifting:    ['Write down 3 things you enjoyed before you worried about money', 'Ask 5 people who know you well: "What do you think I was made for?"', 'Block 1 hour weekly to do something purely for love of it'],
      Awakening:   ["Map your four Ikigai circles on paper \u2014 be honest about what\u2019s missing", "Identify one small way to bring more mission into your current work", "Read Frankl\u2019s Man\u2019s Search for Meaning \u2014 it will clarify your why"],
      Aligned:     ['Articulate your personal mission statement in one sentence', 'Audit your weekly calendar \u2014 does it reflect your Ikigai priorities?', 'Find one person living your ideal Ikigai overlap and study their path'],
      Flourishing: ['Document your Ikigai story \u2014 it will crystallise and protect it', 'Mentor someone at an earlier stage \u2014 teaching deepens your own clarity', 'Review quarterly: is your Ikigai evolving, or becoming rigid?'],
      Integrated:  ['Write a legacy statement \u2014 what will this life have meant?', 'Create a system to transmit your Ikigai insights to others', 'Continue questioning \u2014 integration without curiosity becomes dogma'],
    },
    personality: {
      Drifting:    ['Complete a formal Big Five assessment (IPIP-NEO is free)', 'Journal for 7 days: when did you feel most like yourself?', 'Read "Quiet" by Susan Cain or "Thinking, Fast and Slow" to begin understanding your cognitive style'],
      Awakening:   ['Identify your top 3 personality strengths and actively use them this week', 'Notice which environments energise vs drain you \u2014 keep a log', 'Share your MBTI/Big Five results with someone close and ask for honest feedback'],
      Aligned:     ['Use your type knowledge to redesign one aspect of your work or environment', 'Identify your main personality shadow \u2014 the traits you suppress or deny', 'Explore type dynamics in your key relationships'],
      Flourishing: ['Teach someone else about personality models \u2014 it deepens your own mastery', 'Identify which cognitive functions you underuse and develop one intentionally', 'Build a personal environment optimised for your type'],
      Integrated:  ['Document your personality journey for someone starting theirs', 'Explore how your type shows up differently under stress and name your tells', 'Experiment with flexing your non-dominant functions in safe, low-stakes contexts'],
    },
    '16p': {
      Drifting:    ["Complete the official 16Personalities test at 16personalities.com", "Read your full profile \u2014 notice what resonates and what doesn\u2019t", "Discuss your type with one trusted person who knows you well"],
      Awakening:   ["Revisit your test results after 3 months \u2014 type clarity improves with experience", "Research your type\u2019s typical career and relationship patterns", "Notice when you act against your type \u2014 what is driving that?"],
      Aligned:     ["Deep-read your type\u2019s cognitive functions (not just the surface description)", "Find 2-3 well-known people of your type and study how they operate", "Identify the type you most frequently misunderstand \u2014 it\u2019s usually your opposite"],
      Flourishing: ['Study type pairings in your closest relationships \u2014 it explains a lot', 'Explore how your identity dimension (A/T) affects your resilience under pressure', 'Mentor someone in using type knowledge practically'],
      Integrated:  ['Explore the cognitive stack of your type at a functional depth', 'Practice deliberately using your inferior function as a growth edge', 'Create a decision filter based on your type to reduce cognitive load'],
    },
    decision: {
      Drifting:    ["Before your next decision, write down: What am I trying to achieve?", "Read Annie Duke\u2019s Thinking in Bets \u2014 it will reframe how you see choices", "Keep a decision journal: one entry per week, reflecting on a recent choice"],
      Awakening:   ['Adopt a simple 3-step decision process: Define \u2192 Explore options \u2192 Decide with a date', 'Practice separating outcome from decision quality in your reviews', 'Identify your top 3 decision biases and post them somewhere visible'],
      Aligned:     ['Create a personal decision checklist for high-stakes choices', 'Review 3 past decisions \u2014 what would you do differently, and why?', 'Deliberately seek out people who will challenge your reasoning, not confirm it'],
      Flourishing: ['Build a decision log and review it quarterly for patterns', 'Identify one systematic bias still showing up and design a specific counter-measure', 'Teach your decision process to someone \u2014 teaching is the deepest test'],
      Integrated:  ['Formalise your decision framework as a written document', 'Apply pre-mortem thinking to every major decision as standard practice', 'Mentor others in decision quality \u2014 your discipline is teachable'],
    },
    financial: {
      Drifting:    ["Calculate your current net worth \u2014 assets minus liabilities \u2014 right now", "Read The Psychology of Money by Morgan Housel (short, life-changing)", "Identify one financial decision you\u2019ve been avoiding \u2014 make it this week"],
      Awakening:   ['Set up automatic savings of at least 10% of income', 'Write down your 5 most common financial biases (loss aversion, FOMO, etc.)', 'Track every spending decision for 30 days without judging \u2014 just observing'],
      Aligned:     ['Write a personal investment policy statement (IPS) \u2014 1 page is enough', 'Stress-test your portfolio: if markets fell 40%, would your plan hold?', 'Review your financial plan annually, not daily'],
      Flourishing: ["Define your enough number and your timeline explicitly", "Audit whether your financial behaviour matches your stated values", "Teach one young person the foundational financial principles you wish you\u2019d known"],
      Integrated:  ['Document your financial philosophy for the next generation', 'Review whether your wealth is aligned with your deepest values', 'Consider legacy: what financial decisions will echo beyond your lifetime?'],
    },
    change: {
      Drifting:    ["Name out loud one thing that needs to end in your life \u2014 just naming it starts the process", "Read Transitions by William Bridges \u2014 it will name what you\u2019re experiencing", "Find one person who has navigated a similar transition successfully and ask them about it"],
      Awakening:   ["Write a letter to your old self acknowledging what you\u2019re leaving behind", "Give yourself permission to be uncertain \u2014 the neutral zone is not failure", "Identify one small action that moves toward the new beginning, even a tiny one"],
      Aligned:     ["Create a 90-day transition roadmap \u2014 what needs to happen, in what order?", "Build a support system intentionally \u2014 who helps you hold the vision when you can\u2019t?", "Develop a daily practice that grounds you during turbulent change (journaling, meditation, exercise)"],
      Flourishing: ['Document your transition story \u2014 it will help others navigating similar terrain', 'Identify your resilience anchors \u2014 what keeps you steady when change is hard?', 'Develop a protocol for how you handle setbacks \u2014 a deliberate process, not just reaction'],
      Integrated:  ['Build change capacity in others \u2014 your adaptability is a teachable skill', 'Review whether your change orientation is serving or overriding \u2014 some things deserve stability', 'Create a personal manifesto for how you navigate life transitions'],
    },
  }

  return actions[key]?.[band] || []
}

// ─── MBTI descriptions ────────────────────────────────────────────────────────
const MBTI_ROLES = {
  INTJ: 'The Architect \u2014 strategic, independent, visionary',
  INTP: 'The Thinker \u2014 analytical, conceptual, truth-seeking',
  ENTJ: 'The Commander \u2014 decisive, strategic, driven',
  ENTP: 'The Debater \u2014 innovative, argumentative, curious',
  INFJ: 'The Advocate \u2014 purposeful, empathetic, deep',
  INFP: 'The Mediator \u2014 idealistic, creative, values-led',
  ENFJ: 'The Protagonist \u2014 inspiring, organised, people-focused',
  ENFP: 'The Campaigner \u2014 enthusiastic, imaginative, people-oriented',
  ISTJ: 'The Logistician \u2014 reliable, meticulous, tradition-honouring',
  ISFJ: 'The Defender \u2014 warm, conscientious, protective',
  ESTJ: 'The Executive \u2014 organised, decisive, rule-respecting',
  ESFJ: 'The Consul \u2014 caring, social, duty-minded',
  ISTP: 'The Virtuoso \u2014 pragmatic, observant, action-oriented',
  ISFP: 'The Adventurer \u2014 gentle, flexible, present-focused',
  ESTP: 'The Entrepreneur \u2014 energetic, observant, risk-taking',
  ESFP: 'The Entertainer \u2014 spontaneous, generous, playful',
}

function getMBTIDesc(type) {
  if (!type) return null
  const base = type.replace(/-[AT]$/, '')
  const role = MBTI_ROLES[base]
  const identity = type.includes('-A') ? 'Assertive \u2014 confident, stress-resistant' : type.includes('-T') ? 'Turbulent \u2014 self-critical, improvement-driven' : null
  return { base, role, identity }
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, band, size = 100 }) {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = getBandColor(band)
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 - 6} textAnchor="middle" fill={color} fontSize="22" fontWeight="800">{Math.round(score)}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="#94a3b8" fontSize="11">/100</text>
    </svg>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Report() {
  const { assessmentId } = useParams()
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadScores() }, [assessmentId])

  async function loadScores() {
    setLoading(true)
    try {
      if (assessmentId) {
        const { data: assessment } = await supabase.from('assessments').select('*').eq('id', assessmentId).single()
        const { data: domainScores } = await supabase.from('scores').select('*').eq('assessment_id', assessmentId)
        if (assessment && domainScores) {
          const domainsObj = {}
          domainScores.forEach(s => {
            domainsObj[s.domain] = { score: parseFloat(s.raw_score), weighted: parseFloat(s.weighted_score), band: s.band, mbtiType: s.mbti_type }
          })
          setScores({ composite: parseFloat(assessment.composite_score), compositeBand: assessment.composite_band, domains: domainsObj })
          setLoading(false)
          return
        }
      }
      // Fallback: localStorage
      const saved = localStorage.getItem('thinkbig_latest_scores')
      if (saved) setScores(JSON.parse(saved))
    } catch {
      const saved = localStorage.getItem('thinkbig_latest_scores')
      if (saved) setScores(JSON.parse(saved))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF]">
      <Loader2 size={32} className="animate-spin text-[#00AEEF]" />
    </div>
  )

  if (!scores) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center bg-[#F0F8FF]">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <AlertCircle size={28} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-extrabold text-[#0A0F1E]">No Report Found</h2>
      <p className="text-gray-500">Complete the assessment first to generate your report.</p>
      <Link to="/assessment" className="bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0097D0] transition-all shadow-sm">
        Start Assessment
      </Link>
    </div>
  )

  const sorted = Object.entries(scores.domains).sort((a, b) => b[1].score - a[1].score)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  // Gather MBTI types
  const mbtiPersonality = scores.domains.personality?.mbtiType
  const mbti16p = scores.domains['16p']?.mbtiType
  const mbtiDesc = getMBTIDesc(mbti16p || mbtiPersonality)

  // Weighted contributions
  const weights = { ikigai: 0.25, personality: 0.10, '16p': 0.10, decision: 0.20, financial: 0.20, change: 0.15 }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/results" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A0F1E] transition-colors">
            <ArrowLeft size={16} /> Back to Results
          </Link>
          <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
            <FileText size={15} /> Full Coaching Report
          </span>
          <button
            onClick={() => window.print()}
            className="text-sm text-[#00AEEF] font-semibold hover:text-[#0097D0] transition-colors print:hidden"
          >
            Print / Save
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ── Cover ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-gradient-to-br from-[#0A0F1E] via-[#0A1628] to-[#00AEEF]/30 px-8 sm:px-10 py-10 sm:py-12 text-white">
            <p className="text-xs font-semibold text-[#00AEEF] uppercase tracking-[0.2em] mb-3">Personal Coaching Report</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1.5">Think Big</h1>
            <p className="text-gray-400 text-sm">Life Evaluation Assessment &middot; {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="px-8 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing score={scores.composite} band={scores.compositeBand} size={140} />
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: getBandColor(scores.compositeBand) }}
                >
                  {scores.compositeBand}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Composite Band</span>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-xl text-sm">
                {BAND_DESC[scores.compositeBand]}
              </p>
              <p className="mt-3 text-sm text-gray-400 italic">
                {BAND_NEXT[scores.compositeBand]}
              </p>
            </div>
          </div>
        </div>

        {/* ── Score Summary ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Score Summary</h2>
          <div className="h-px bg-gray-100 mb-6" />
          <div className="space-y-4">
            {Object.entries(DOMAINS).map(([key, meta]) => {
              const d = scores.domains[key]
              if (!d) return null
              const color = getBandColor(d.band)
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-xl w-7 flex-shrink-0">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-[#0A0F1E] truncate">{meta.label}</span>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="text-xs px-2.5 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: color }}>{d.band}</span>
                        <span className="text-sm font-extrabold text-[#0A0F1E] w-8 text-right">{Math.round(d.score)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.score}%`, backgroundColor: color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Composite breakdown */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Weighted Contribution to Composite</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DOMAINS).map(([key, meta]) => {
                const d = scores.domains[key]
                if (!d) return null
                const contribution = d.score * weights[key]
                return (
                  <div key={key} className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-xs text-gray-400">{meta.icon} {meta.weight}</p>
                    <p className="text-sm font-extrabold text-[#0A0F1E]">+{contribution.toFixed(1)}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[80px]">{meta.label.split(' ')[0]}</p>
                  </div>
                )
              })}
              <div className="bg-[#00AEEF]/5 rounded-xl px-3 py-2.5 text-center border border-[#00AEEF]/20">
                <p className="text-xs text-[#00AEEF] font-semibold">Total</p>
                <p className="text-sm font-extrabold text-[#00AEEF]">{scores.composite.toFixed(1)}</p>
                <p className="text-xs text-[#00AEEF]">Composite</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Personality Profile ──────────────────────────────────── */}
        {mbtiDesc && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Personality Profile</h2>
            <div className="h-px bg-gray-100 mb-6" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-2xl px-8 py-6 text-center flex-shrink-0">
                <p className="text-4xl font-extrabold text-[#00AEEF] mb-1">{mbtiDesc.base}</p>
                {mbti16p && <p className="text-sm text-gray-500">{mbti16p}</p>}
              </div>
              <div>
                {mbtiDesc.role && <p className="text-base font-bold text-[#0A0F1E] mb-2">{mbtiDesc.role}</p>}
                {mbtiPersonality && (
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-[#0A0F1E]">MBTI (Big Five lens):</span> {mbtiPersonality}
                    {mbti16p && mbtiPersonality !== mbti16p.replace(/-[AT]$/, '') && (
                      <span className="ml-2 text-amber-600">&middot; Note: slight discrepancy between domains suggests a borderline axis</span>
                    )}
                  </p>
                )}
                {mbtiDesc.identity && (
                  <p className="text-sm text-gray-500 mb-3">
                    <span className="font-semibold text-[#0A0F1E]">Identity:</span> {mbtiDesc.identity}
                  </p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {mbtiDesc.base?.startsWith('I')
                    ? "You process the world through deep reflection before acting. Your inner world is rich and detailed \u2014 honour it, but don\u2019t let it become an excuse to avoid engagement."
                    : 'You process the world through engagement and action. Your energy flows outward \u2014 harness it, but build in regular reflection to avoid losing depth to momentum.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Key Observations ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Key Observations</h2>
          <div className="h-px bg-gray-100 mb-6" />
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-1.5 rounded-full bg-emerald-500 flex-shrink-0 self-stretch" />
              <div>
                <p className="text-sm font-bold text-emerald-800 mb-1">
                  Strongest Domain: {DOMAINS[strongest[0]]?.label} &mdash; {Math.round(strongest[1].score)}/100
                </p>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  This is your most developed dimension. It is a foundation you can lean on when other areas feel unstable. Build from strength.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-1.5 rounded-full bg-amber-500 flex-shrink-0 self-stretch" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-1">
                  Growth Priority: {DOMAINS[weakest[0]]?.label} &mdash; {Math.round(weakest[1].score)}/100
                </p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  A 10-point improvement here would add {(10 * weights[weakest[0]]).toFixed(1)} points to your composite score.
                  Small, consistent effort in your weakest domain has outsized returns.
                </p>
              </div>
            </div>
            {/* Balance check */}
            {(() => {
              const gap = sorted[0][1].score - sorted[sorted.length - 1][1].score
              if (gap > 30) return (
                <div className="flex gap-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                  <div className="w-1.5 rounded-full bg-[#00AEEF] flex-shrink-0 self-stretch" />
                  <div>
                    <p className="text-sm font-bold text-sky-800 mb-1">Domain Imbalance Detected</p>
                    <p className="text-sm text-sky-700 leading-relaxed">
                      There is a {Math.round(gap)}-point gap between your strongest and weakest domain.
                      High imbalance creates internal friction &mdash; the underdeveloped dimension acts as a ceiling on the others.
                    </p>
                  </div>
                </div>
              )
              return (
                <div className="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="w-1.5 rounded-full bg-purple-500 flex-shrink-0 self-stretch" />
                  <div>
                    <p className="text-sm font-bold text-purple-800 mb-1">Well-Balanced Profile</p>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      Your domains are relatively balanced &mdash; only a {Math.round(gap)}-point spread.
                      This is a sign of integrated development. The path forward is elevating all domains together, not patching a single weakness.
                    </p>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── Domain Deep Dives ─────────────────────────────────────── */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Domain Deep Dives</h2>
          <div className="h-px bg-gray-200 mb-6" />
          <div className="space-y-5">
            {Object.entries(DOMAINS).map(([key, meta]) => {
              const d = scores.domains[key]
              if (!d) return null
              const color = getBandColor(d.band)
              const insight = getDomainInsight(key, d.score, d)
              const actions = getDomainActions(key, d.score)

              return (
                <div key={key} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex">
                  {/* Left color bar */}
                  <div className="w-1.5 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: color }} />

                  <div className="flex-1 min-w-0">
                    {/* Domain header */}
                    <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                      <span className="text-2xl">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#0A0F1E]">{meta.label}</h3>
                          <span className="text-xs text-gray-400">({meta.weight} weight)</span>
                        </div>
                        <p className="text-xs text-gray-400">{meta.authority}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-extrabold" style={{ color }}>{Math.round(d.score)}</div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{d.band}</span>
                      </div>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                      {/* Score bar */}
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.score}%`, backgroundColor: color }} />
                      </div>

                      {/* MBTI tag */}
                      {d.mbtiType && (
                        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                          <span className="text-sm font-mono font-bold text-[#00AEEF]">{d.mbtiType}</span>
                          <span className="text-xs text-gray-400">{getMBTIDesc(d.mbtiType)?.role || 'Personality Type'}</span>
                        </div>
                      )}

                      {/* Coaching insight */}
                      <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>

                      {/* Action plan */}
                      {actions.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recommended Actions</p>
                          <ul className="space-y-2.5">
                            {actions.map((action, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                <span className="mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: color }}>{i + 1}</span>
                                <span className="leading-relaxed">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 90-Day Action Plan ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">90-Day Focus Plan</h2>
          <div className="h-px bg-gray-100 mb-6" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                period: 'Days 1\u201330',
                label: 'Foundation',
                color: '#3B82F6',
                task: `Focus on ${DOMAINS[weakest[0]]?.label}. Read one book in this domain. Start a weekly reflection habit.`,
              },
              {
                period: 'Days 31\u201360',
                label: 'Practice',
                color: '#F59E0B',
                task: `Apply one insight from ${DOMAINS[weakest[0]]?.label} and ${DOMAINS[strongest[0]]?.label} in a real decision or relationship this month.`,
              },
              {
                period: 'Days 61\u201390',
                label: 'Integration',
                color: '#10B981',
                task: `Review your scores. Retake the assessment. Write a 1-page reflection on what has shifted and what you want to focus on next.`,
              },
            ].map((phase, i) => (
              <div key={i} className="rounded-2xl p-5 border-t-4 bg-gray-50" style={{ borderTopColor: phase.color }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: phase.color }}>{phase.period}</p>
                <p className="text-sm font-bold text-[#0A0F1E] mb-2">{phase.label}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{phase.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Retake CTA ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#00AEEF] to-[#0097D0] rounded-2xl p-8 sm:p-10 text-center text-white">
          <p className="text-sm font-semibold text-blue-200 mb-2">Growth is not a destination &mdash; it&apos;s a practice</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Re-evaluate in 90 Days</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            The most powerful use of this tool is tracking your progress over time.
            Set a reminder and come back in 90 days to see how your scores have shifted.
          </p>
          <Link
            to="/assessment"
            className="inline-block bg-white text-[#00AEEF] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm"
          >
            Retake Assessment
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6">
          Think Big &middot; Life Evaluation Assessment
        </p>
      </div>
    </div>
  )
}
