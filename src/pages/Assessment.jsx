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

      // Store assessmentId for post-signup linking
      localStorage.setItem('thinkbig_latest_assessment_id', assessment.id)

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
    <div className="min-h-screen bg-[#F0F8FF]">
      {/* Sticky Progress Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#0A0F1E]">{domain.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                {currentSection + 1}/{domains.length}
              </span>
            </div>
            <span className="text-sm font-semibold text-[#00AEEF]">{Math.round(progress)}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div
              className="bg-[#00AEEF] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {domains.map((d, i) => {
              const dQuestions = getQuestionsForDomain(d.id)
              const dAnswered = dQuestions.filter(q => answers[q.id] !== undefined).length
              const complete = dAnswered === dQuestions.length
              return (
                <button
                  key={d.id}
                  onClick={() => setCurrentSection(i)}
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSection
                      ? 'bg-[#00AEEF] shadow-sm'
                      : complete
                      ? 'bg-emerald-400'
                      : dAnswered > 0
                      ? 'bg-amber-300'
                      : 'bg-gray-200'
                  }`}
                  title={`${d.name} (${dAnswered}/${dQuestions.length})`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1E]">{domain.name}</h2>
          <p className="text-gray-500 text-sm mt-2">
            Answer all {sectionQuestions.length} questions in this section &middot; {answeredInSection}/{sectionQuestions.length} answered
          </p>
        </div>

        <div className="space-y-5">
          {sectionQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-200 ${
                answers[q.id] !== undefined
                  ? 'border-emerald-200/80 shadow-emerald-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 ${
                  answers[q.id] !== undefined
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {q.id}
                </span>
                <p className="text-sm font-medium text-[#0A0F1E] leading-relaxed">
                  {q.type === 'choice' ? `${q.optionA} / ${q.optionB}` : q.text}
                </p>
              </div>

              {q.type === 'scale' ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                  <span className="text-xs text-gray-400 sm:w-28 text-center sm:text-right">Strongly Disagree</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleAnswer(q.id, String(v))}
                        className={`w-12 h-12 sm:w-11 sm:h-11 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          answers[q.id] === String(v)
                            ? 'bg-[#00AEEF] text-white scale-105 shadow-md shadow-[#00AEEF]/20'
                            : 'bg-gray-50 text-gray-500 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] border border-gray-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 sm:w-28 text-center sm:text-left">Strongly Agree</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(q.id, 'A')}
                    className={`p-4 rounded-xl text-sm text-left border-2 transition-all duration-200 ${
                      answers[q.id] === 'A'
                        ? 'border-[#00AEEF] bg-[#00AEEF]/5 text-[#00AEEF] font-medium shadow-sm'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`inline-block w-6 h-6 rounded-lg text-xs font-bold mr-2 text-center leading-6 ${
                      answers[q.id] === 'A' ? 'bg-[#00AEEF] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>A</span>
                    {q.optionA}
                  </button>
                  <button
                    onClick={() => handleAnswer(q.id, 'B')}
                    className={`p-4 rounded-xl text-sm text-left border-2 transition-all duration-200 ${
                      answers[q.id] === 'B'
                        ? 'border-[#00AEEF] bg-[#00AEEF]/5 text-[#00AEEF] font-medium shadow-sm'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`inline-block w-6 h-6 rounded-lg text-xs font-bold mr-2 text-center leading-6 ${
                      answers[q.id] === 'B' ? 'bg-[#00AEEF] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>B</span>
                    {q.optionB}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pb-10">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {isLastSection ? (
            <button
              onClick={handleSubmit}
              disabled={totalAnswered < questions.length || submitting}
              className="flex items-center gap-2 px-7 py-3 bg-[#00AEEF] text-white rounded-xl text-sm font-semibold hover:bg-[#0097D0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
              className="flex items-center gap-2 px-7 py-3 bg-[#00AEEF] text-white rounded-xl text-sm font-semibold hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
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
