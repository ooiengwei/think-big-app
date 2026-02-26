import { useState, useEffect } from 'react'
import { Loader2, Users, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getBandColor } from '../lib/scoring'

const domainLabels = {
  ikigai: 'Ikigai',
  personality: 'Personality',
  '16p': '16 Personalities',
  decision: 'Decision Making',
  financial: 'Financial Decision',
  change: 'Change Direction',
}

export default function Admin() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [domainScores, setDomainScores] = useState({})

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('assessments')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(100)

      setAssessments(data || [])
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleExpand(assessmentId) {
    if (expandedId === assessmentId) {
      setExpandedId(null)
      return
    }
    setExpandedId(assessmentId)
    if (!domainScores[assessmentId]) {
      const { data } = await supabase
        .from('scores')
        .select('*')
        .eq('assessment_id', assessmentId)
      if (data) {
        setDomainScores(prev => ({ ...prev, [assessmentId]: data }))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  const totalUsers = new Set(assessments.map(a => a.user_id || a.session_id)).size
  const avgScore = assessments.length > 0
    ? (assessments.reduce((sum, a) => sum + parseFloat(a.composite_score || 0), 0) / assessments.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-primary" />
              </div>
              <span className="text-sm text-gray-500">Total Assessments</span>
            </div>
            <p className="text-3xl font-bold text-dark">{assessments.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Unique Users</span>
            </div>
            <p className="text-3xl font-bold text-dark">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Average Score</span>
            </div>
            <p className="text-3xl font-bold text-dark">{avgScore}</p>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark">All Assessments</h2>
          </div>

          {assessments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No assessments found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {assessments.map(a => (
                <div key={a.id}>
                  <button
                    onClick={() => toggleExpand(a.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-dark truncate">
                          {a.profiles?.name || a.profiles?.email || `Guest (${a.session_id?.slice(0, 8)}...)`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(a.completed_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-dark">
                          {parseFloat(a.composite_score).toFixed(1)}
                        </span>
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: getBandColor(a.composite_band) }}
                        >
                          {a.composite_band}
                        </span>
                      </div>
                    </div>
                    {expandedId === a.id ? (
                      <ChevronUp size={16} className="text-gray-400 ml-3" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 ml-3" />
                    )}
                  </button>

                  {expandedId === a.id && domainScores[a.id] && (
                    <div className="px-6 pb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {domainScores[a.id].map(s => (
                          <div key={s.domain} className="bg-light rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">{domainLabels[s.domain] || s.domain}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-dark">
                                {parseFloat(s.raw_score).toFixed(1)}
                              </span>
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: getBandColor(s.band) }}
                              >
                                {s.band}
                              </span>
                            </div>
                            {s.mbti_type && (
                              <p className="text-xs font-mono text-accent mt-1">{s.mbti_type}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
