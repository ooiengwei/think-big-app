import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { domains, questions, getQuestionsForDomain } from '../lib/questions'
import { calculateAllScores } from '../lib/scoring'
import { supabase, getSessionId } from '../lib/supabase'

const STORAGE_KEY = 'thinkbig_answers'

export default function Assessment() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })
  const [submitting, setSubmitting] = useState(false)

  const domain = domains[currentSection]
  const sectionQuestions = getQuestionsForDomain(domain.id)
  const answeredInSection = sectionQuestions.filter(q => answers[q.id] !== undefined).length
  const totalAnswered = questions.filter(q => answers[q.id] !== undefined).length
  const progress = (totalAnswered / questions.length) * 100

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  const handleAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }, [])

  const canProceed = answeredInSection === sectionQuestions.length
  const isLastSection = currentSection === domains.length - 1

  async function handleSubmit() {
    if (totalAnswered < questions.length) return
    setSubmitting(true)

    try {
      const scores = calculateAllScores(answers)
      const sessionId = getSessionId()

      // Check for logged in user
      const { data: { user } } = await supabase.auth.getUser()

      // Create assessment
      const { data: assessment, error: assessError } = await supabase
        .from('assessments')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          completed_at: new Date().toISOString(),
          composite_score: scores.composite,
          composite_band: scores.compositeBand,
          status: 'completed',
        })
        .select()
        .single()

      if (assessError) throw assessError

      // Save responses
      const responseRows = Object.entries(answers).map(([qId, val]) => ({
        assessment_id: assessment.id,
        question_id: parseInt(qId),
        answer_value: String(val),
      }))
      await supabase.from('responses').insert(responseRows)

      // Save domain scores
      const scoreRows = Object.entries(scores.domains).map(([domainKey, domainData]) => ({
        assessment_id: assessment.id,
        domain: domainKey,
        raw_score: domainData.score,
        weighted_score: domainData.weighted,
        band: domainData.band,
        mbti_type: domainData.mbtiType || null,
      }))
      await supabase.from('scores').insert(scoreRows)

      // Clear saved answers
      localStorage.removeItem(STORAGE_KEY)

      // Navigate to results
      navigate(`/results/${assessment.id}`)
    } catch (err) {
      console.error('Error saving assessment:', err)
      // Fallback: save to localStorage and show results
      const scores = calculateAllScores(answers)
      localStorage.setItem('thinkbig_latest_scores', JSON.stringify(scores))
      localStorage.setItem('thinkbig_latest_answers', JSON.stringify(answers))
      localStorage.removeItem(STORAGE_KEY)
      navigate('/results')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark">
              Section {currentSection + 1} of {domains.length} &mdash; {domain.name}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Section tabs */}
          <div className="flex gap-1 mt-3">
            {domains.map((d, i) => {
              const dQuestions = getQuestionsForDomain(d.id)
              const dAnswered = dQuestions.filter(q => answers[q.id] !== undefined).length
              const complete = dAnswered === dQuestions.length
              return (
                <button
                  key={d.id}
                  onClick={() => setCurrentSection(i)}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i === currentSection
                      ? 'bg-primary'
                      : complete
                      ? 'bg-green-400'
                      : dAnswered > 0
                      ? 'bg-amber-300'
                      : 'bg-gray-300'
                  }`}
                  title={`${d.name} (${dAnswered}/${dQuestions.length})`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark">{domain.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            Answer all {sectionQuestions.length} questions in this section to proceed.
          </p>
        </div>

        <div className="space-y-6">
          {sectionQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={`bg-white rounded-xl p-5 border transition-colors ${
                answers[q.id] !== undefined ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <p className="text-sm font-medium text-dark mb-3">
                <span className="text-gray-400 mr-2">Q{q.id}.</span>
                {q.type === 'choice' ? `${q.optionA} / ${q.optionB}` : q.text}
              </p>

              {q.type === 'scale' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-24 text-right">Strongly Disagree</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleAnswer(q.id, String(v))}
                        className={`w-10 h-10 rounded-full font-medium text-sm transition-all ${
                          answers[q.id] === String(v)
                            ? 'bg-primary text-white scale-110 shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 w-24">Strongly Agree</span>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(q.id, 'A')}
                    className={`p-3 rounded-lg text-sm text-left border transition-all ${
                      answers[q.id] === 'A'
                        ? 'border-primary bg-red-50 text-primary font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold mr-1">A.</span> {q.optionA}
                  </button>
                  <button
                    onClick={() => handleAnswer(q.id, 'B')}
                    className={`p-3 rounded-lg text-sm text-left border transition-all ${
                      answers[q.id] === 'B'
                        ? 'border-primary bg-red-50 text-primary font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold mr-1">B.</span> {q.optionB}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pb-8">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {isLastSection ? (
            <button
              onClick={handleSubmit}
              disabled={totalAnswered < questions.length || submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Assessment
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(domains.length - 1, currentSection + 1))}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-800"
            >
              Next Section
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
