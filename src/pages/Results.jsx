import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Share2, Download, Save, ArrowRight, Loader2, CheckCircle, FileText, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import DomainRadarChart from '../components/DomainRadarChart'
import AuthModal from '../components/AuthModal'
import { getBandColor } from '../lib/scoring'
import { supabase, getSessionId } from '../lib/supabase'

const domainLabels = {
  ikigai: 'Ikigai',
  personality: 'Personality',
  '16p': '16 Personalities',
  decision: 'Decision Making',
  financial: 'Financial Decision',
  change: 'Change Direction',
}

const domainDescriptions = {
  ikigai: 'Your sense of purpose, passion, and meaningful contribution to the world.',
  personality: 'Self-awareness of your cognitive patterns, MBTI type, and Big Five traits.',
  '16p': 'How decisively your personality axes are defined across mind, energy, nature, tactics, and identity.',
  decision: 'Your ability to make clear, honest, and well-structured decisions.',
  financial: 'How well you manage financial biases, behaviours, and risk calibration.',
  change: 'Your readiness for transition, ability to let go, and growth mindset.',
}

export default function Results() {
  const { assessmentId } = useParams()
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [copied, setCopied] = useState(false)
  const resultsRef = useRef(null)

  useEffect(() => {
    loadResults()
  }, [assessmentId])

  async function loadResults() {
    setLoading(true)
    try {
      if (assessmentId) {
        // Load from Supabase
        const { data: assessment } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single()

        const { data: domainScores } = await supabase
          .from('scores')
          .select('*')
          .eq('assessment_id', assessmentId)

        if (assessment && domainScores) {
          const domainsObj = {}
          domainScores.forEach(s => {
            domainsObj[s.domain] = {
              score: parseFloat(s.raw_score),
              weighted: parseFloat(s.weighted_score),
              band: s.band,
              mbtiType: s.mbti_type,
            }
          })
          setScores({
            composite: parseFloat(assessment.composite_score),
            compositeBand: assessment.composite_band,
            domains: domainsObj,
          })
        }
      } else {
        // Load from localStorage fallback
        const saved = localStorage.getItem('thinkbig_latest_scores')
        if (saved) {
          setScores(JSON.parse(saved))
        }
      }
    } catch (err) {
      console.error('Error loading results:', err)
      // Fallback to localStorage
      const saved = localStorage.getItem('thinkbig_latest_scores')
      if (saved) setScores(JSON.parse(saved))
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    const url = assessmentId
      ? `${window.location.origin}/results/${assessmentId}`
      : window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  async function handleDownloadPDF() {
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      if (!resultsRef.current) return
      const canvas = await html2canvas(resultsRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, width, height)
      pdf.save('think-big-results.pdf')
    } catch (err) {
      console.error('PDF generation error:', err)
    }
  }

  async function handleAuthSuccess(user) {
    setShowAuth(false)
    if (!user) return

    const sessionId = localStorage.getItem('thinkbig_session_id')

    // Link this specific assessment if we have its ID
    if (assessmentId) {
      await supabase
        .from('assessments')
        .update({ user_id: user.id })
        .eq('id', assessmentId)
    }

    // Also link ALL guest assessments from this browser session
    if (sessionId) {
      await supabase
        .from('assessments')
        .update({ user_id: user.id })
        .eq('session_id', sessionId)
        .is('user_id', null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#00AEEF]" />
          <p className="text-sm text-gray-500">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!scores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 bg-[#F0F8FF]">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <FileText size={28} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0A0F1E]">No Results Found</h2>
        <p className="text-gray-500 text-center max-w-sm">Take the assessment first to see your results.</p>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0097D0] transition-all shadow-sm"
        >
          Start Assessment <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div ref={resultsRef} className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

        {/* Composite Score */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center mb-6 animate-fade-in">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Composite Score</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1E] mb-6">Think Big Life Score</h1>

          {/* Score Ring — 160px */}
          <div className="relative inline-flex items-center justify-center w-40 h-40 sm:w-44 sm:h-44 my-2">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="80" cy="80" r="68"
                fill="none"
                stroke={getBandColor(scores.compositeBand)}
                strokeWidth="10"
                strokeDasharray={`${(scores.composite / 100) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#0A0F1E]">{Math.round(scores.composite)}</span>
              <span className="text-sm text-gray-400 -mt-1">/ 100</span>
            </div>
          </div>

          {/* Band label */}
          <div className="mt-4 mb-6">
            <span
              className="inline-block px-5 py-2 rounded-full text-base font-bold text-white shadow-sm"
              style={{ backgroundColor: getBandColor(scores.compositeBand) }}
            >
              {scores.compositeBand}
            </span>
          </div>

          {/* View Full Report CTA */}
          <Link
            to={assessmentId ? `/report/${assessmentId}` : '/report'}
            className="flex items-center justify-center gap-2 w-full bg-[#00AEEF] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FileText size={18} />
            View Full Coaching Report
          </Link>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#0A0F1E] transition-colors"
            >
              {copied ? <CheckCircle size={15} className="text-emerald-500" /> : <Share2 size={15} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#0A0F1E] transition-colors"
            >
              <Save size={15} />
              Save
            </button>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-[#0A0F1E] mb-1 text-center">Domain Overview</h2>
          <p className="text-sm text-gray-400 text-center mb-4">Your performance across all 6 life domains</p>
          <DomainRadarChart scores={scores} size={380} />
        </div>

        {/* Domain Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {Object.entries(scores.domains).map(([key, data]) => {
            const bandColor = getBandColor(data.band)
            return (
              <div key={key} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#0A0F1E] text-sm">{domainLabels[key]}</h3>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: bandColor }}
                  >
                    {data.band}
                  </span>
                </div>

                {/* Score bar with number */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${data.score}%`, backgroundColor: bandColor }}
                    />
                  </div>
                  <span className="text-lg font-extrabold text-[#0A0F1E] w-8 text-right">{Math.round(data.score)}</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">{domainDescriptions[key]}</p>
                {data.mbtiType && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-[#00AEEF]/5 border border-[#00AEEF]/20 rounded-lg px-2.5 py-1">
                    <span className="text-xs font-mono font-bold text-[#00AEEF]">{data.mbtiType}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-[#0A0F1E] mb-5">Quick Insights</h2>
          <div className="space-y-3">
            {(() => {
              const sorted = Object.entries(scores.domains).sort((a, b) => b[1].score - a[1].score)
              const strongest = sorted[0]
              const weakest = sorted[sorted.length - 1]
              return (
                <>
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-1.5 rounded-full bg-emerald-500 flex-shrink-0 self-stretch" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 mb-0.5">Strongest Domain</p>
                      <p className="text-sm text-emerald-700">
                        {domainLabels[strongest[0]]} at {Math.round(strongest[1].score)} &mdash; keep building on this foundation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-1.5 rounded-full bg-amber-500 flex-shrink-0 self-stretch" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 mb-0.5">Growth Opportunity</p>
                      <p className="text-sm text-amber-700">
                        {domainLabels[weakest[0]]} at {Math.round(weakest[1].score)} &mdash; small improvements here will raise your composite score.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                    <div className="w-1.5 rounded-full bg-[#00AEEF] flex-shrink-0 self-stretch" />
                    <div>
                      <p className="text-sm font-semibold text-sky-800 mb-0.5">Track Your Growth</p>
                      <p className="text-sm text-sky-700">
                        Re-evaluate in 90 days to track your growth and see how your scores evolve.
                      </p>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-[#0A0F1E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-sm"
          >
            Go to Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
