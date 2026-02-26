import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, ArrowRight, LogOut, Loader2, Calendar } from 'lucide-react'
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
      await loadAssessments(user.id)
    } else {
      setLoading(false)
    }
  }

  async function loadAssessments(userId) {
    setLoading(true)
    try {
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

  function handleAuthSuccess(authUser) {
    setShowAuth(false)
    setUser(authUser)
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
      <div className="min-h-screen bg-light flex flex-col items-center justify-center px-4 gap-6">
        <h2 className="text-2xl font-bold text-dark">Sign in to view your dashboard</h2>
        <p className="text-gray-500 max-w-md text-center">
          Create an account or sign in to track your assessments over time and see your growth.
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800"
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, {user?.user_metadata?.name || user?.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/assessment"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800"
            >
              <RefreshCw size={16} />
              New Assessment
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* 90-day re-evaluation CTA */}
        {daysSinceLast !== null && daysSinceLast >= 90 && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-accent" />
              <div>
                <p className="font-medium text-dark text-sm">Time for a re-evaluation!</p>
                <p className="text-xs text-gray-500">It has been {daysSinceLast} days since your last assessment.</p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700"
            >
              Retake <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-dark mb-2">No assessments yet</h3>
            <p className="text-gray-500 mb-6">Complete your first Think Big assessment to see your results here.</p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800"
            >
              Start Assessment <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Latest Score */}
            {latestScores && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-dark mb-4">Latest Score</h2>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-dark">{Math.round(latestScores.composite)}</span>
                  <span className="text-gray-400 text-lg ml-1">/ 100</span>
                  <div className="mt-2">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
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
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-dark mb-4">Score Timeline</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#B40000"
                      strokeWidth={2}
                      dot={{ fill: '#B40000', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Assessment History */}
            <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${timelineData.length <= 1 ? '' : 'lg:col-span-2'}`}>
              <h2 className="text-lg font-semibold text-dark mb-4">Assessment History</h2>
              <div className="space-y-3">
                {assessments.map(a => (
                  <Link
                    key={a.id}
                    to={`/results/${a.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {new Date(a.completed_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Score: {parseFloat(a.composite_score).toFixed(1)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: getBandColor(a.composite_band) }}
                      >
                        {a.composite_band}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
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
