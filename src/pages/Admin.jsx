import { useState, useEffect, useMemo } from 'react'
import {
  Loader2, Users, ClipboardList, TrendingUp, CheckCircle,
  Search, ChevronRight, X, ExternalLink, LogOut, Lock,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getBandColor, getBand } from '../lib/scoring'

const ADMIN_KEY = 'tb_admin'
const ADMIN_PASS = 'itgadmin2025'

const domainLabels = {
  ikigai: 'Ikigai',
  personality: 'Personality',
  '16p': '16 Personalities',
  decision: 'Decision Making',
  financial: 'Financial Decision',
  change: 'Change Direction',
}

const bandOrder = ['Drifting', 'Awakening', 'Aligned', 'Flourishing', 'Integrated']
const bandColors = {
  Drifting: '#EF4444',
  Awakening: '#F59E0B',
  Aligned: '#3B82F6',
  Flourishing: '#10B981',
  Integrated: '#8B5CF6',
}

// ─── Coaching Templates ───────────────────────────────────────────────
const coachingTemplates = {
  ikigai: {
    Drifting: {
      why: 'User has no clear sense of purpose across all 4 Ikigai circles.',
      questions: [
        'What activities make time fly for you?',
        'When do you feel most useful to others?',
        'If money were no object, what would you do?',
      ],
      exercises: [
        'Write your Ikigai Venn diagram — fill each circle with 5 items',
        'Do a 7-day energy audit — note when you feel energised vs drained',
      ],
      goal: 'Identify and commit to one passion project within 30 days',
    },
    Awakening: {
      why: 'User has glimpses of purpose but lacks consistency across all circles.',
      questions: [
        'Which Ikigai circle feels most complete for you?',
        'What gap between passion and mission holds you back?',
        'What would need to change in your work for it to feel meaningful?',
      ],
      exercises: [
        'Complete the Ikigai canvas — score each circle 1-10 and prioritise the lowest',
        'Have 3 conversations this month with people whose work aligns with their purpose',
      ],
      goal: 'Strengthen the weakest Ikigai circle with one concrete action this month',
    },
    Aligned: {
      why: 'User has a reasonable sense of purpose but is not yet living it fully.',
      questions: [
        'What is one thing stopping you from fully living your purpose?',
        'How much of your daily work connects to your core values?',
        'What legacy do you want to leave?',
      ],
      exercises: [
        'Write a personal mission statement in under 25 words',
        'Redesign 20% of your weekly schedule toward high-meaning activities',
      ],
      goal: 'Redesign work schedule to include 20% more purpose-aligned activities',
    },
    Flourishing: {
      why: 'User has strong purpose alignment — focus on depth and scale of impact.',
      questions: [
        'How can you multiply your impact?',
        'Who can you mentor or bring along your journey?',
        'What is the next level of your mission?',
      ],
      exercises: [
        'Create a 3-year Ikigai roadmap',
        'Start one initiative that scales your impact beyond yourself',
      ],
      goal: 'Launch one initiative that extends your purpose to others within 90 days',
    },
    Integrated: {
      why: 'User has strong purpose alignment — focus on depth and scale of impact.',
      questions: [
        'How can you multiply your impact?',
        'Who can you mentor or bring along your journey?',
        'What is the next level of your mission?',
      ],
      exercises: [
        'Create a 3-year Ikigai roadmap',
        'Start one initiative that scales your impact beyond yourself',
      ],
      goal: 'Launch one initiative that extends your purpose to others within 90 days',
    },
  },
  decision: {
    Drifting: {
      why: 'User avoids decisions, defers to others, and lacks structured thinking process.',
      questions: [
        'Walk me through the last major decision you made — what process did you follow?',
        'How do you handle decisions when there is no clear right answer?',
        'What decisions are you currently avoiding?',
      ],
      exercises: [
        'Practice the pre-mortem technique: before any decision, write 3 ways it could fail',
        'Use a decision journal — record one decision per week with your reasoning',
      ],
      goal: 'Apply a structured decision framework to every significant choice for 30 days',
    },
    Awakening: {
      why: 'User makes decisions but relies too much on intuition without enough process.',
      questions: [
        'How do you distinguish between good intuition and fear-driven avoidance?',
        'What biases might be influencing your biggest decisions?',
        'How do you handle regret after a decision?',
      ],
      exercises: [
        'Read Thinking in Bets by Annie Duke — focus on chapters 1-3',
        'For your next big decision: write pros/cons + base rate + worst case before deciding',
      ],
      goal: 'Make one major decision using full probabilistic thinking within 60 days',
    },
    Aligned: {
      why: 'User has solid decision process — focus on speed, delegation, and meta-decisions.',
      questions: [
        'Which decisions could you delegate or systematise?',
        'How do you help others in your team make better decisions?',
        'What is your decision-making philosophy?',
      ],
      exercises: [
        'Document your personal decision framework in writing',
        'Teach your decision process to one other person',
      ],
      goal: 'Create a written decision playbook and share it with your team',
    },
    Flourishing: {
      why: 'User has solid decision process — focus on speed, delegation, and meta-decisions.',
      questions: [
        'Which decisions could you delegate or systematise?',
        'How do you help others in your team make better decisions?',
        'What is your decision-making philosophy?',
      ],
      exercises: [
        'Document your personal decision framework in writing',
        'Teach your decision process to one other person',
      ],
      goal: 'Create a written decision playbook and share it with your team',
    },
    Integrated: {
      why: 'User has solid decision process — focus on speed, delegation, and meta-decisions.',
      questions: [
        'Which decisions could you delegate or systematise?',
        'How do you help others in your team make better decisions?',
        'What is your decision-making philosophy?',
      ],
      exercises: [
        'Document your personal decision framework in writing',
        'Teach your decision process to one other person',
      ],
      goal: 'Create a written decision playbook and share it with your team',
    },
  },
  financial: {
    Drifting: {
      why: 'User shows significant cognitive biases that distort financial thinking — loss aversion, anchoring, overconfidence.',
      questions: [
        'How do emotions typically influence your financial choices?',
        'When did you last make a financial decision you later regretted? What drove it?',
        'How do you think about risk?',
      ],
      exercises: [
        'Track every financial decision for 30 days — label each as System 1 (gut) or System 2 (reasoned)',
        'Read The Psychology of Money by Morgan Housel — chapters 1, 3, 6',
      ],
      goal: 'Identify your top 2 financial biases and create a specific check for each',
    },
    Awakening: {
      why: 'User is aware of biases but still vulnerable to emotional financial decisions.',
      questions: [
        'What is your relationship with money — scarcity or abundance mindset?',
        'How do you separate a good investment from FOMO?',
        'What does financial security mean to you?',
      ],
      exercises: [
        'Write your personal financial philosophy in 200 words',
        'Create a pre-investment checklist with 5 questions to ask before any significant purchase',
      ],
      goal: 'Build and follow a pre-decision checklist for all purchases above a threshold you set',
    },
    Aligned: {
      why: 'User has strong financial thinking — focus on long-term strategy and values alignment.',
      questions: [
        'Is your money working toward what truly matters to you?',
        'How do you balance wealth building with present enjoyment?',
        'What financial legacy do you want to create?',
      ],
      exercises: [
        'Create a life-money alignment audit',
        'Define your enough number — how much is truly enough?',
      ],
      goal: 'Write a one-page personal financial philosophy and review quarterly',
    },
    Flourishing: {
      why: 'User has strong financial thinking — focus on long-term strategy and values alignment.',
      questions: [
        'Is your money working toward what truly matters to you?',
        'How do you balance wealth building with present enjoyment?',
        'What financial legacy do you want to create?',
      ],
      exercises: [
        'Create a life-money alignment audit',
        'Define your enough number — how much is truly enough?',
      ],
      goal: 'Write a one-page personal financial philosophy and review quarterly',
    },
    Integrated: {
      why: 'User has strong financial thinking — focus on long-term strategy and values alignment.',
      questions: [
        'Is your money working toward what truly matters to you?',
        'How do you balance wealth building with present enjoyment?',
        'What financial legacy do you want to create?',
      ],
      exercises: [
        'Create a life-money alignment audit',
        'Define your enough number — how much is truly enough?',
      ],
      goal: 'Write a one-page personal financial philosophy and review quarterly',
    },
  },
  change: {
    Drifting: {
      why: 'User is stuck in the Ending phase — unable to let go of what no longer serves them.',
      questions: [
        'What are you holding onto that you know you need to release?',
        'What does staying in your comfort zone cost you?',
        'What is the smallest possible step you could take toward change?',
      ],
      exercises: [
        'Write a letting-go letter to something you need to release (job, relationship, identity, habit)',
        'Map Bridges Transitions: where are you right now — Ending, Neutral Zone, or New Beginning?',
      ],
      goal: 'Take one concrete action toward change within 14 days, no matter how small',
    },
    Awakening: {
      why: 'User is in the Neutral Zone — the uncomfortable gap between old and new.',
      questions: [
        'What does the uncertainty of your current transition feel like?',
        'What new identity is trying to emerge?',
        'What support do you need to navigate this transition?',
      ],
      exercises: [
        'Daily journaling for 21 days — write what you are letting go of and what you are moving toward',
        'Create a transition map: old → neutral → new with milestones',
      ],
      goal: 'Define what the New Beginning looks like in concrete terms within 30 days',
    },
    Aligned: {
      why: 'User navigates change well — focus on accelerating transitions and supporting others.',
      questions: [
        'How do you help others through change?',
        'What is the next intentional transition you want to make?',
        'How do you sustain momentum through long transitions?',
      ],
      exercises: [
        'Design your next 3-year life chapter with intention',
        'Mentor one person through a transition they are facing',
      ],
      goal: 'Design and commit to one major intentional life transition in the next 90 days',
    },
    Flourishing: {
      why: 'User navigates change well — focus on accelerating transitions and supporting others.',
      questions: [
        'How do you help others through change?',
        'What is the next intentional transition you want to make?',
        'How do you sustain momentum through long transitions?',
      ],
      exercises: [
        'Design your next 3-year life chapter with intention',
        'Mentor one person through a transition they are facing',
      ],
      goal: 'Design and commit to one major intentional life transition in the next 90 days',
    },
    Integrated: {
      why: 'User navigates change well — focus on accelerating transitions and supporting others.',
      questions: [
        'How do you help others through change?',
        'What is the next intentional transition you want to make?',
        'How do you sustain momentum through long transitions?',
      ],
      exercises: [
        'Design your next 3-year life chapter with intention',
        'Mentor one person through a transition they are facing',
      ],
      goal: 'Design and commit to one major intentional life transition in the next 90 days',
    },
  },
  personality: {
    Drifting: {
      why: 'User has limited self-awareness of their personality drivers.',
      questions: [
        'How does your personality type show up under stress?',
        'Where does your natural style create friction with others?',
        'Which of your personality traits is your biggest superpower?',
      ],
      exercises: [
        'Read about your MBTI type\'s shadow functions',
        'Ask 3 trusted people: what is my biggest blind spot?',
      ],
      goal: 'Identify one personality-driven pattern to work on and track for 60 days',
    },
    Awakening: {
      why: 'User is building self-awareness but may not yet leverage their type effectively.',
      questions: [
        'How does your personality type show up under stress?',
        'Where does your natural style create friction with others?',
        'Which of your personality traits is your biggest superpower?',
      ],
      exercises: [
        'Read about your MBTI type\'s shadow functions',
        'Ask 3 trusted people: what is my biggest blind spot?',
      ],
      goal: 'Identify one personality-driven pattern to work on and track for 60 days',
    },
    Aligned: {
      why: 'User has strong self-awareness — focus on blind spots and team dynamics.',
      questions: [
        'How does your personality type show up under stress?',
        'Where does your natural style create friction with others?',
        'Which of your personality traits is your biggest superpower?',
      ],
      exercises: [
        'Read about your MBTI type\'s shadow functions',
        'Ask 3 trusted people: what is my biggest blind spot?',
      ],
      goal: 'Identify one personality-driven pattern to work on and track for 60 days',
    },
    Flourishing: {
      why: 'User has strong self-awareness — focus on blind spots and team dynamics.',
      questions: [
        'How does your personality type show up under stress?',
        'Where does your natural style create friction with others?',
        'Which of your personality traits is your biggest superpower?',
      ],
      exercises: [
        'Read about your MBTI type\'s shadow functions',
        'Ask 3 trusted people: what is my biggest blind spot?',
      ],
      goal: 'Identify one personality-driven pattern to work on and track for 60 days',
    },
    Integrated: {
      why: 'User has strong self-awareness — focus on blind spots and team dynamics.',
      questions: [
        'How does your personality type show up under stress?',
        'Where does your natural style create friction with others?',
        'Which of your personality traits is your biggest superpower?',
      ],
      exercises: [
        'Read about your MBTI type\'s shadow functions',
        'Ask 3 trusted people: what is my biggest blind spot?',
      ],
      goal: 'Identify one personality-driven pattern to work on and track for 60 days',
    },
  },
  '16p': {
    Drifting: {
      why: 'User shows low self-confidence and high identity turbulence.',
      questions: [
        'How does self-doubt show up in your daily decisions?',
        'What would you do differently if you were 20% more confident?',
        'Where does perfectionism hold you back?',
      ],
      exercises: [
        'List 10 past wins — evidence against your inner critic',
        'For 30 days: before bed, write one thing you handled well today',
      ],
      goal: 'Shift from Turbulent to Assertive in one key life area within 90 days',
    },
    Awakening: {
      why: 'User shows moderate self-doubt that limits bold action.',
      questions: [
        'How does self-doubt show up in your daily decisions?',
        'What would you do differently if you were 20% more confident?',
        'Where does perfectionism hold you back?',
      ],
      exercises: [
        'List 10 past wins — evidence against your inner critic',
        'For 30 days: before bed, write one thing you handled well today',
      ],
      goal: 'Shift from Turbulent to Assertive in one key life area within 90 days',
    },
    Aligned: {
      why: 'User has reasonable identity confidence — focus on leveraging strengths.',
      questions: [
        'How does self-doubt show up in your daily decisions?',
        'What would you do differently if you were 20% more confident?',
        'Where does perfectionism hold you back?',
      ],
      exercises: [
        'List 10 past wins — evidence against your inner critic',
        'For 30 days: before bed, write one thing you handled well today',
      ],
      goal: 'Shift from Turbulent to Assertive in one key life area within 90 days',
    },
    Flourishing: {
      why: 'User has strong identity confidence — focus on deeper self-mastery.',
      questions: [
        'How does self-doubt show up in your daily decisions?',
        'What would you do differently if you were 20% more confident?',
        'Where does perfectionism hold you back?',
      ],
      exercises: [
        'List 10 past wins — evidence against your inner critic',
        'For 30 days: before bed, write one thing you handled well today',
      ],
      goal: 'Shift from Turbulent to Assertive in one key life area within 90 days',
    },
    Integrated: {
      why: 'User has strong identity confidence — focus on deeper self-mastery.',
      questions: [
        'How does self-doubt show up in your daily decisions?',
        'What would you do differently if you were 20% more confident?',
        'Where does perfectionism hold you back?',
      ],
      exercises: [
        'List 10 past wins — evidence against your inner critic',
        'For 30 days: before bed, write one thing you handled well today',
      ],
      goal: 'Shift from Turbulent to Assertive in one key life area within 90 days',
    },
  },
}

function getCoaching(domain, band) {
  const template = coachingTemplates[domain]
  if (!template) return null
  return template[band] || template['Aligned'] || null
}

function getInitials(name, email, sessionId) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'G'
}

function getDisplayName(profile, sessionId) {
  if (profile?.name) return profile.name
  if (profile?.email) return profile.email
  return `Guest ${sessionId?.slice(0, 6) || '—'}`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function getCoachingDepth(band) {
  if (band === 'Drifting' || band === 'Awakening') return 'Foundational'
  if (band === 'Aligned') return 'Intermediate'
  return 'Advanced'
}

// ─── Password Gate ────────────────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password === ADMIN_PASS) {
      localStorage.setItem(ADMIN_KEY, ADMIN_PASS)
      onAuth()
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">
        <img src="/think-big-logo.jpg" alt="Think Big" className="h-12 mx-auto mb-4" />
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock size={18} className="text-gray-400" />
          <h1 className="text-xl font-bold text-dark">Admin Access</h1>
        </div>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-3"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, note, colorClass }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-dark">{value}</p>
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
    </div>
  )
}

// ─── Band Distribution Bar ───────────────────────────────────────────
function BandDistribution({ assessments }) {
  const counts = useMemo(() => {
    const c = {}
    bandOrder.forEach(b => { c[b] = 0 })
    assessments.forEach(a => {
      const band = a.composite_band
      if (c[band] !== undefined) c[band]++
    })
    return c
  }, [assessments])

  const total = assessments.length || 1

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-dark mb-4">Score Distribution</h2>
      <div className="flex h-5 rounded-full overflow-hidden mb-4">
        {bandOrder.map(band => {
          const pct = (counts[band] / total) * 100
          if (pct === 0) return null
          return (
            <div
              key={band}
              style={{ width: `${pct}%`, backgroundColor: bandColors[band] }}
              className="transition-all duration-500"
            />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {bandOrder.map(band => (
          <span
            key={band}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: bandColors[band] }}
          >
            {band} &middot; {counts[band]} ({((counts[band] / total) * 100).toFixed(0)}%)
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Domain Averages Panel ───────────────────────────────────────────
function DomainAverages({ allScores }) {
  const averages = useMemo(() => {
    const domains = Object.keys(domainLabels)
    return domains.map(d => {
      const scores = allScores.filter(s => s.domain === d)
      const avg = scores.length > 0
        ? scores.reduce((sum, s) => sum + parseFloat(s.raw_score || 0), 0) / scores.length
        : 0
      return { domain: d, label: domainLabels[d], avg: parseFloat(avg.toFixed(1)), band: getBand(avg) }
    })
  }, [allScores])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-dark mb-1">Domain Averages</h2>
      <p className="text-sm text-gray-500 mb-5">Where users struggle — focus group sessions here</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {averages.map(d => (
          <div key={d.domain} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{d.label}</p>
            <p className="text-xl font-bold text-dark mb-2">{d.avg}</p>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${d.avg}%`, backgroundColor: bandColors[d.band] || '#94a3b8' }}
              />
            </div>
            <span
              className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: bandColors[d.band] || '#94a3b8' }}
            >
              {d.band}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── User Detail Slide-over ──────────────────────────────────────────
function UserPanel({ assessment, scores, onClose }) {
  const profile = assessment.profiles
  const name = getDisplayName(profile, assessment.session_id)
  const initials = getInitials(profile?.name, profile?.email, assessment.session_id)
  const compositeScore = parseFloat(assessment.composite_score || 0).toFixed(1)
  const band = assessment.composite_band
  const color = bandColors[band] || '#94a3b8'

  const sortedScores = useMemo(() => {
    if (!scores) return []
    return [...scores].sort((a, b) => parseFloat(a.raw_score) - parseFloat(b.raw_score))
  }, [scores])

  const lowest3 = sortedScores.slice(0, 3)
  const highest = sortedScores.length > 0 ? sortedScores[sortedScores.length - 1] : null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full sm:w-[640px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-dark truncate">{name}</p>
              <p className="text-sm text-gray-500">{formatDate(assessment.completed_at)}</p>
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="6"
                  strokeDasharray={`${(compositeScore / 100) * 213.6} 213.6`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                />
                <text x="40" y="36" textAnchor="middle" className="text-lg font-bold" fill="#0A0F1E" fontSize="18">{compositeScore}</text>
                <text x="40" y="52" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">{band}</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* A — Domain Scores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Domain Scores</h3>
            <div className="grid grid-cols-2 gap-3">
              {(scores || []).map(s => {
                const sBand = s.band || getBand(s.raw_score)
                const sColor = bandColors[sBand] || '#94a3b8'
                return (
                  <div key={s.domain} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{domainLabels[s.domain] || s.domain}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-dark">{parseFloat(s.raw_score).toFixed(1)}</span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: sColor }}
                      >
                        {sBand}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.raw_score}%`, backgroundColor: sColor }}
                      />
                    </div>
                    {s.mbti_type && (
                      <p className="text-xs font-mono text-primary mt-2">{s.mbti_type}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* B — Full Report Link */}
          <a
            href={`/report/${assessment.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            View Full Report <ExternalLink size={16} />
          </a>

          {/* C — Coaching Focus Areas */}
          {lowest3.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-dark mb-1">Coaching Focus Areas</h3>
              <p className="text-sm text-gray-500 mb-4">Based on this user's scores, here is what to focus on in your coaching session.</p>
              <div className="space-y-4">
                {lowest3.map(s => {
                  const sBand = s.band || getBand(s.raw_score)
                  const sColor = bandColors[sBand] || '#94a3b8'
                  const coaching = getCoaching(s.domain, sBand)
                  if (!coaching) return null
                  return (
                    <div key={s.domain} className="border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold text-dark">{domainLabels[s.domain] || s.domain}</span>
                        <span className="text-sm font-bold text-dark">{parseFloat(s.raw_score).toFixed(1)}</span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: sColor }}
                        >
                          {sBand}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700">Why this matters:</p>
                          <p className="text-gray-600">{coaching.why}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Coaching questions to ask:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {coaching.questions.map((q, i) => <li key={i}>{q}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Suggested exercises:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {coaching.exercises.map((ex, i) => <li key={i}>{ex}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Goal to set:</p>
                          <p className="text-gray-600">{coaching.goal}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* D — Session Prep Summary */}
          {lowest3.length > 0 && (
            <div className="bg-dark rounded-xl p-5 text-white">
              <h3 className="font-bold mb-3">Session Prep Summary</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Primary focus:</span>{' '}
                  {domainLabels[lowest3[0]?.domain]} — {lowest3[0]?.band || getBand(lowest3[0]?.raw_score)}
                </p>
                {lowest3[1] && (
                  <p>
                    <span className="text-gray-400">Secondary focus:</span>{' '}
                    {domainLabels[lowest3[1]?.domain]} — {lowest3[1]?.band || getBand(lowest3[1]?.raw_score)}
                  </p>
                )}
                {highest && (
                  <p>
                    <span className="text-gray-400">Strengths to leverage:</span>{' '}
                    {domainLabels[highest.domain]} — {highest.band || getBand(highest.raw_score)}
                  </p>
                )}
                <p>
                  <span className="text-gray-400">Key question to open with:</span>{' '}
                  <span className="italic">"{getCoaching(lowest3[0]?.domain, lowest3[0]?.band || getBand(lowest3[0]?.raw_score))?.questions?.[0]}"</span>
                </p>
                <p>
                  <span className="text-gray-400">Estimated coaching depth:</span>{' '}
                  {getCoachingDepth(band)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </>
  )
}

// ─── Main Admin Component ────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(localStorage.getItem(ADMIN_KEY) === ADMIN_PASS)
  const [assessments, setAssessments] = useState([])
  const [allScores, setAllScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [bandFilter, setBandFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedAssessment, setSelectedAssessment] = useState(null)

  useEffect(() => {
    if (authed) loadAll()
  }, [authed])

  async function loadAll() {
    setLoading(true)
    try {
      const [assessRes, scoresRes] = await Promise.all([
        supabase
          .from('assessments')
          .select('*, profiles:user_id (name, email)')
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(500),
        supabase
          .from('scores')
          .select('assessment_id, domain, raw_score, weighted_score, band, mbti_type'),
      ])
      setAssessments(assessRes.data || [])
      setAllScores(scoresRes.data || [])
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_KEY)
    setAuthed(false)
  }

  // ── Derived data ──
  const totalAssessments = assessments.length
  const uniqueUsers = useMemo(() => new Set(assessments.map(a => a.user_id || a.session_id)).size, [assessments])
  const avgScore = useMemo(() => {
    if (assessments.length === 0) return '0.0'
    return (assessments.reduce((sum, a) => sum + parseFloat(a.composite_score || 0), 0) / assessments.length).toFixed(1)
  }, [assessments])

  // ── Filtered + sorted assessments ──
  const filteredAssessments = useMemo(() => {
    let list = [...assessments]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(a => {
        const name = a.profiles?.name?.toLowerCase() || ''
        const email = a.profiles?.email?.toLowerCase() || ''
        const session = a.session_id?.toLowerCase() || ''
        return name.includes(q) || email.includes(q) || session.includes(q)
      })
    }

    if (bandFilter !== 'All') {
      list = list.filter(a => a.composite_band === bandFilter)
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.completed_at) - new Date(b.completed_at)
        case 'score-high': return parseFloat(b.composite_score) - parseFloat(a.composite_score)
        case 'score-low': return parseFloat(a.composite_score) - parseFloat(b.composite_score)
        default: return new Date(b.completed_at) - new Date(a.completed_at)
      }
    })

    return list
  }, [assessments, searchQuery, bandFilter, sortBy])

  // ── Get scores for selected assessment ──
  const selectedScores = useMemo(() => {
    if (!selectedAssessment) return []
    return allScores.filter(s => s.assessment_id === selectedAssessment.id)
  }, [selectedAssessment, allScores])

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Coaching Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Think Big Assessment Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Section 2 — Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ClipboardList} label="Total Assessments" value={totalAssessments} colorClass="bg-[#00AEEF]" />
          <StatCard icon={Users} label="Unique Users" value={uniqueUsers} colorClass="bg-blue-600" />
          <StatCard icon={TrendingUp} label="Average Score" value={avgScore} colorClass="bg-emerald-500" />
          <StatCard icon={CheckCircle} label="Completion Rate" value="100%" note="completed only" colorClass="bg-purple-500" />
        </div>

        {/* Section 3 — Band Distribution */}
        <div className="mb-6">
          <BandDistribution assessments={assessments} />
        </div>

        {/* Section 4 — Domain Averages */}
        <div className="mb-6">
          <DomainAverages allScores={allScores} />
        </div>

        {/* Section 5 — User List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-dark flex-shrink-0">All Assessments</h2>
              <div className="flex flex-1 flex-wrap gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, session..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <select
                  value={bandFilter}
                  onChange={e => setBandFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                >
                  <option value="All">All Bands</option>
                  {bandOrder.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="score-high">Score High→Low</option>
                  <option value="score-low">Score Low→High</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAssessments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No assessments found.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredAssessments.map(a => {
                const profile = a.profiles
                const name = getDisplayName(profile, a.session_id)
                const initials = getInitials(profile?.name, profile?.email, a.session_id)
                const score = parseFloat(a.composite_score || 0).toFixed(1)
                const aBand = a.composite_band
                const aColor = bandColors[aBand] || '#94a3b8'

                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAssessment(a)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: aColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-dark truncate">{name}</p>
                      <p className="text-xs text-gray-400 hidden sm:block">{formatDate(a.completed_at)}</p>
                    </div>
                    <span className="text-xl font-bold text-dark flex-shrink-0">{score}</span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white flex-shrink-0"
                      style={{ backgroundColor: aColor }}
                    >
                      {aBand}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-primary font-medium flex-shrink-0">
                      View Report <ChevronRight size={14} />
                    </span>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 sm:hidden" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Section 6 — User Detail Slide-over */}
      {selectedAssessment && (
        <UserPanel
          assessment={selectedAssessment}
          scores={selectedScores}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  )
}
