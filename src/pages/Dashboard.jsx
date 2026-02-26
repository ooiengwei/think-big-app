import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, ArrowRight, LogOut, Loader2, Calendar, BarChart3, Clock, Hash } from 'lucide-react'
import DomainRadarChart from '../components/DomainRadarChart'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabase'
import { getBandColor } from '../lib/scoring'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const domainLabels = {
  ikigai: 'Ikigai',
  personality: 'Personality',
  '16p': '16 Personalities',
  decision: 'Decision Making',
  financial: 'Financial Decision',
  change: 'Change Direction',
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [latestScores, setLatestScores] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      // On every login, claim any guest assessments from this browser
      const sessionId = localStorage.getItem('thinkbig_session_id')
      const lastAssessmentId = localStorage.getItem('thinkbig_latest_assessment_id')

      // Claim by specific assessmentId
      if (lastAssessmentId) {
        await supabase
          .from('assessments')
          .update({ user_id: user.id })
          .eq('id', lastAssessmentId)
          .is('user_id', null)
      }
      // Claim all assessments from this session
      if (sessionId) {
        await supabase
          .from('assessments')
          .update({ user_id: user.id })
          .eq('session_id', sessionId)
          .is('user_id', null)
      }
      await loadAssessments(user.id)
    } else {
      setLoading(false)
    }
  }

  async function loadAssessments(userId) {
    setLoading(true)
    try {
      // Query by user_id (covers confirmed + newly linked assessments)
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      setAssessments(data || [])

      if (data && data.length > 0) {
        // Load scores for latest assessment
        const { data: scores } = await supabase
          .from('scores')
          .select('*')
          .eq('assessment_id', data[0].id)

        if (scores) {
          const domainsObj = {}
          scores.forEach(s => {
            domainsObj[s.domain] = {
              score: parseFloat(s.raw_score),
              band: s.band,
              mbtiType: s.mbti_type,
            }
          })
          setLatestScores({
            composite: parseFloat(data[0].composite_score),
            compositeBand: data[0].composite_band,
            domains: domainsObj,
          })
        }
      }
    } catch (err) {
      console.error('Error loading assessments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setAssessments([])
    setLatestScores(null)
  }

  async function handleAuthSuccess(authUser) {
    setShowAuth(false)
    setUser(authUser)
    const sessionId = localStorage.getItem('thinkbig_session_id')
    const lastAssessmentId = localStorage.getItem('thinkbig_latest_assessment_id')
    if (authUser) {
      if (lastAssessmentId) {
        await supabase.from('assessments').update({ user_id: authUser.id }).eq('id', lastAssessmentId).is('user_id', null)
      }
      if (sessionId) {
        await supabase.from('assessments').update({ user_id: authUser.id }).eq('session_id', sessionId).is('user_id', null)
      }
    }
    loadAssessments(authUser.id)
  }

  const timelineData = assessments.map(a => ({
    date: new Date(a.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    score: parseFloat(a.composite_score),
  })).reverse()

  const daysSinceLast = assessments.length > 0
    ? Math.floor((Date.now() - new Date(assessments[0].completed_at).getTime()) / (1000 * 60 * 60 * 24))
    : null

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center px-4 gap-6">
        <div className="w-16 h-16 bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center">
          <BarChart3 size={28} className="text-[#00AEEF]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0A0F1E]">Sign in to view your dashboard</h2>
        <p className="text-gray-500 max-w-md text-center">
          Create an account or sign in to track your assessments over time and see your growth.
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0097D0] transition-all shadow-sm"
        >
          Sign In / Sign Up
        </button>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF]">
        <Loader2 size={32} className="animate-spin text-[#00AEEF]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0A0F1E] to-[#0A1628] rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.user_metadata?.name || user?.email}</h1>
            </div>
            <div className="flex gap-3">
              <Link
                to="/assessment"
                className="flex items-center gap-2 bg-[#00AEEF] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0097D0] transition-all shadow-sm"
              >
                <RefreshCw size={15} />
                New Assessment
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {assessments.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#00AEEF]/10 rounded-lg flex items-center justify-center">
                  <Hash size={16} className="text-[#00AEEF]" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assessments</span>
              </div>
              <p className="text-2xl font-extrabold text-[#0A0F1E]">{assessments.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <BarChart3 size={16} className="text-emerald-500" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latest Score</span>
              </div>
              <p className="text-2xl font-extrabold text-[#0A0F1E]">{latestScores ? Math.round(latestScores.composite) : '—'}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-amber-500" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Days Since</span>
              </div>
              <p className="text-2xl font-extrabold text-[#0A0F1E]">{daysSinceLast !== null ? daysSinceLast : '—'}</p>
            </div>
          </div>
        )}

        {/* 90-day re-evaluation CTA */}
        {daysSinceLast !== null && daysSinceLast >= 90 && (
          <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5A623]/20 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-[#F5A623]" />
              </div>
              <div>
                <p className="font-semibold text-[#0A0F1E] text-sm">Time for a re-evaluation!</p>
                <p className="text-xs text-gray-500">It has been {daysSinceLast} days since your last assessment.</p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="flex items-center gap-1.5 bg-[#F5A623] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-sm"
            >
              Retake <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0A0F1E] mb-2">No assessments yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Complete your first Think Big assessment to see your results here.</p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0097D0] transition-all shadow-sm"
            >
              Start Assessment <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Latest Score */}
            {latestScores && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Latest Score</h2>

                {/* Score Ring */}
                <div className="text-center mb-4">
                  <div className="relative inline-flex items-center justify-center w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke={getBandColor(latestScores.compositeBand)}
                        strokeWidth="8"
                        strokeDasharray={`${(latestScores.composite / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-[#0A0F1E]">{Math.round(latestScores.composite)}</span>
                      <span className="text-xs text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span
                      className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: getBandColor(latestScores.compositeBand) }}
                    >
                      {latestScores.compositeBand}
                    </span>
                  </div>
                </div>

                <DomainRadarChart scores={latestScores} size={280} />
              </div>
            )}

            {/* Score Timeline */}
            {timelineData.length > 1 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Score Timeline</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#00AEEF"
                      strokeWidth={2.5}
                      dot={{ fill: '#00AEEF', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#00AEEF', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Assessment History */}
            <div className={`bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm ${timelineData.length <= 1 ? '' : 'lg:col-span-2'}`}>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Assessment History</h2>
              <div className="space-y-2">
                {assessments.map(a => (
                  <Link
                    key={a.id}
                    to={`/results/${a.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0A0F1E]">
                        {new Date(a.completed_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Score: {parseFloat(a.composite_score).toFixed(1)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: getBandColor(a.composite_band) }}
                      >
                        {a.composite_band}
                      </span>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-[#00AEEF] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
