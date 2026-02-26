import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Share2, Download, Save, ArrowRight, Loader2, CheckCircle, FileText } from 'lucide-react'
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
    if (assessmentId && user) {
      // Link guest assessment to user
      await supabase
        .from('assessments')
        .update({ user_id: user.id })
        .eq('id', assessmentId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!scores) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold text-dark">No Results Found</h2>
        <p className="text-gray-500">Take the assessment first to see your results.</p>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800"
        >
          Start Assessment <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div ref={resultsRef} className="max-w-4xl mx-auto px-4 py-8">
        {/* Composite Score */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Your Think Big Score</h1>
          <div className="relative inline-flex items-center justify-center w-40 h-40 my-4">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={getBandColor(scores.compositeBand)}
                strokeWidth="8"
                strokeDasharray={`${(scores.composite / 100) * 327} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-dark">{Math.round(scores.composite)}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
          <div className="mb-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: getBandColor(scores.compositeBand) }}
            >
              {scores.compositeBand}
            </span>
          </div>

          {/* View Full Report CTA */}
          <Link
            to={assessmentId ? `/report/${assessmentId}` : '/report'}
            className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800 transition"
          >
            <FileText size={18} />
            View Full Coaching Report
          </Link>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {copied ? <CheckCircle size={16} className="text-green-500" /> : <Share2 size={16} />}
              {copied ? 'Link Copied!' : 'Share Results'}
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <Save size={16} />
              Save Results
            </button>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-dark mb-4 text-center">Domain Overview</h2>
          <DomainRadarChart scores={scores} size={380} />
        </div>

        {/* Domain Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {Object.entries(scores.domains).map(([key, data]) => (
            <div key={key} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dark">{domainLabels[key]}</h3>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: getBandColor(data.band) }}
                >
                  {data.band}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-dark">{Math.round(data.score)}</span>
                <span className="text-sm text-gray-400 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${data.score}%`,
                    backgroundColor: getBandColor(data.band),
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{domainDescriptions[key]}</p>
              {data.mbtiType && (
                <p className="mt-2 text-sm font-mono font-semibold text-accent">
                  Type: {data.mbtiType}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-dark mb-4">Quick Insights</h2>
          <div className="space-y-3">
            {(() => {
              const sorted = Object.entries(scores.domains).sort((a, b) => b[1].score - a[1].score)
              const strongest = sorted[0]
              const weakest = sorted[sorted.length - 1]
              return (
                <>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Strongest domain:</strong> {domainLabels[strongest[0]]} at{' '}
                      {Math.round(strongest[1].score)} — keep building on this foundation.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Growth opportunity:</strong> {domainLabels[weakest[0]]} at{' '}
                      {Math.round(weakest[1].score)} — small improvements here will raise your composite score.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <strong>Re-evaluate in 90 days</strong> to track your growth and see how your scores evolve.
                    </p>
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
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800"
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
