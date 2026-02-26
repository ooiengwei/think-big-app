// Full scoring engine for Think Big assessment
// answers is an object: { questionId: answerValue } where answerValue is '1'-'5' or 'A'/'B'

function val(answers, qId) {
  const v = answers[qId]
  if (v === 'A') return 1
  if (v === 'B') return 2
  return parseFloat(v) || 0
}

function avg(answers, qIds) {
  const vals = qIds.map(id => val(answers, id)).filter(v => v > 0)
  if (vals.length === 0) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function mapToRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

export function getBand(score) {
  if (score < 40) return 'Drifting'
  if (score < 60) return 'Awakening'
  if (score < 75) return 'Aligned'
  if (score < 90) return 'Flourishing'
  return 'Integrated'
}

export function getBandColor(band) {
  switch (band) {
    case 'Drifting': return '#EF4444'
    case 'Awakening': return '#F59E0B'
    case 'Aligned': return '#3B82F6'
    case 'Flourishing': return '#10B981'
    case 'Integrated': return '#8B5CF6'
    default: return '#6B7280'
  }
}

// Domain 1: IKIGAI
export function scoreIkigai(answers) {
  const passion = avg(answers, [1, 2, 3, 4, 5])
  const mission = avg(answers, [6, 7, 8, 9, 10])
  const profession = avg(answers, [11, 12, 13, 14, 15])
  const vocation = avg(answers, [16, 17, 18, 19, 20])

  const circles = [passion, mission, profession, vocation]
  const circlesAbove3 = circles.filter(c => c > 3).length
  const overlapMap = { 0: 0, 1: 15, 2: 25, 3: 35, 4: 40 }
  const circleOverlap = overlapMap[circlesAbove3] || 0

  const meaningDepthAvg = avg(answers, [1, 6, 10, 20])
  const meaningDepth = clamp(mapToRange(meaningDepthAvg, 1, 5, 0, 30), 0, 30)

  const dailyIkigaiAvg = avg(answers, [5, 9, 15, 19])
  const dailyIkigai = clamp(mapToRange(dailyIkigaiAvg, 1, 5, 0, 30), 0, 30)

  const total = clamp(circleOverlap + meaningDepth + dailyIkigai, 0, 100)
  return { score: total, details: { passion, mission, profession, vocation, circleOverlap, meaningDepth, dailyIkigai } }
}

// Domain 2: PERSONALITY
export function scorePersonality(answers) {
  // MBTI from Q21-Q36 (A=1, B=2)
  const ei = avg(answers, [21, 22, 29, 35])
  const sn = avg(answers, [23, 24, 30, 36])
  const tf = avg(answers, [25, 26, 31, 32])
  const jp = avg(answers, [27, 28, 33, 34])

  const mbti = (ei > 1.5 ? 'E' : 'I') +
    (sn > 1.5 ? 'N' : 'S') +
    (tf > 1.5 ? 'F' : 'T') +
    (jp > 1.5 ? 'P' : 'J')

  // OCEAN from Q37-Q45
  const O = avg(answers, [37, 38]) * 20
  const C = avg(answers, [39, 40]) * 20
  const E = avg(answers, [41]) * 20
  const A = avg(answers, [43, 44]) * 20
  const N = (6 - avg(answers, [42, 45])) * 20

  const score = clamp(avg(answers, [37, 38, 39, 40, 41, 43, 44]) * 20, 0, 100)

  return { score, mbtiType: mbti, details: { mbti, O, C, E, A, N } }
}

// Domain 3: 16 PERSONALITIES
export function score16P(answers) {
  // Mind E/I: Q46, Q59
  const mindVotes = [val(answers, 46), val(answers, 59)]
  // Note: Q46 A=background(I), B=centre(E); Q59 A=think out loud(E), B=think inside(I)
  // Q46: A=I, B=E; Q59: A=E, B=I
  const eCount46 = (val(answers, 46) === 2 ? 1 : 0) + (val(answers, 59) === 1 ? 1 : 0)
  const mind = eCount46 > 1 ? 'E' : 'I'
  const mindPct = Math.max(eCount46, 2 - eCount46) / 2

  // Energy S/N: Q47, Q51, Q52
  const sCount = (val(answers, 47) === 1 ? 1 : 0) + (val(answers, 51) === 1 ? 1 : 0) + (val(answers, 52) === 1 ? 1 : 0)
  const energy = sCount > 1.5 ? 'S' : 'N'
  const energyPct = Math.max(sCount, 3 - sCount) / 3

  // Nature T/F: Q48, Q53
  const tCount = (val(answers, 48) === 1 ? 1 : 0) + (val(answers, 53) === 1 ? 1 : 0)
  const nature = tCount > 1 ? 'T' : 'F'
  const naturePct = Math.max(tCount, 2 - tCount) / 2

  // Tactics J/P: Q49, Q54
  const jCount = (val(answers, 49) === 1 ? 1 : 0) + (val(answers, 54) === 1 ? 1 : 0)
  const tactics = jCount > 1 ? 'J' : 'P'
  const tacticsPct = Math.max(jCount, 2 - jCount) / 2

  // Identity A/T: Q50, Q60
  const aCount = (val(answers, 50) === 1 ? 1 : 0) + (val(answers, 60) === 1 ? 1 : 0)
  const identity = aCount > 1 ? 'A' : 'T'
  const identityPct = Math.max(aCount, 2 - aCount) / 2

  const typeCode = mind + energy + nature + tactics + '-' + identity

  // Role Score: % of axes with decisive majority (>66%)
  const axes = [mindPct, energyPct, naturePct, tacticsPct, identityPct]
  const decisiveCount = axes.filter(p => p > 0.66).length
  const score = clamp((decisiveCount / 5) * 100, 0, 100)

  return { score, mbtiType: typeCode, details: { typeCode, mind, energy, nature, tactics, identity } }
}

// Domain 4: DECISION MAKING
export function scoreDecision(answers) {
  const processAvg = avg(answers, [61, 62, 63, 64, 65, 66, 67, 68, 69, 70])
  const processScore = clamp(mapToRange(processAvg, 1, 5, 0, 35), 0, 35)

  // Q73 is reverse scored
  const styleQs = [71, 72, 74, 75, 76, 77, 78, 79, 80]
  const q73reversed = 6 - val(answers, 73)
  const styleVals = styleQs.map(id => val(answers, id))
  styleVals.push(q73reversed)
  const styleAvg = styleVals.filter(v => v > 0).reduce((a, b) => a + b, 0) / styleVals.filter(v => v > 0).length || 0
  const styleScore = clamp(mapToRange(styleAvg, 1, 5, 0, 30), 0, 30)

  const honestyAvg = avg(answers, [63, 65, 66, 67, 68])
  const honestyScore = clamp(mapToRange(honestyAvg, 1, 5, 0, 20), 0, 20)

  const clarityAvg = avg(answers, [72, 75, 77])
  const clarityScore = clamp(mapToRange(clarityAvg, 1, 5, 0, 15), 0, 15)

  const total = processScore + styleScore + honestyScore + clarityScore
  const score = clamp(total, 0, 100)

  return { score, details: { processScore, styleScore, honestyScore, clarityScore } }
}

// Domain 5: FINANCIAL DECISION
export function scoreFinancial(answers) {
  // Q81-Q86 reverse scored
  const reversedIds = [81, 82, 83, 84, 85, 86]
  const biasQs = [...reversedIds, 87, 88, 89, 90]
  const biasVals = biasQs.map(id => {
    const v = val(answers, id)
    if (v === 0) return 0
    return reversedIds.includes(id) ? 6 - v : v
  }).filter(v => v > 0)
  const biasAvg = biasVals.length > 0 ? biasVals.reduce((a, b) => a + b, 0) / biasVals.length : 0
  const biasScore = clamp(mapToRange(biasAvg, 1, 5, 0, 40), 0, 40)

  const behaviourAvg = avg(answers, [91, 92, 93, 94, 95, 96, 97, 98, 99, 100])
  const behaviourScore = clamp(mapToRange(behaviourAvg, 1, 5, 0, 35), 0, 35)

  const riskQs = [87, 88, 89, 90, 97, 98]
  const riskAvg = avg(answers, riskQs)
  const riskScore = clamp(mapToRange(riskAvg, 1, 5, 0, 25), 0, 25)

  const total = biasScore + behaviourScore + riskScore
  const score = clamp(total, 0, 100)

  return { score, details: { biasScore, behaviourScore, riskScore } }
}

// Domain 6: CHANGE DIRECTION
export function scoreChange(answers) {
  const transitionAvg = avg(answers, [101, 102, 103, 104, 105, 106, 107, 108, 109, 110])
  const transitionScore = clamp(mapToRange(transitionAvg, 1, 5, 0, 30), 0, 30)

  const lettingGoAvg = avg(answers, [101, 102, 107, 108])
  const lettingGoScore = clamp(mapToRange(lettingGoAvg, 1, 5, 0, 25), 0, 25)

  const mindsetAvg = avg(answers, [111, 112, 113, 114, 115, 116, 117, 118, 119, 120])
  const mindsetScore = clamp(mapToRange(mindsetAvg, 1, 5, 0, 30), 0, 30)

  const resilienceAvg = avg(answers, [103, 104, 118, 119])
  const resilienceScore = clamp(mapToRange(resilienceAvg, 1, 5, 0, 15), 0, 15)

  const total = transitionScore + lettingGoScore + mindsetScore + resilienceScore
  const score = clamp(total, 0, 100)

  return { score, details: { transitionScore, lettingGoScore, mindsetScore, resilienceScore } }
}

export function calculateAllScores(answers) {
  const ikigai = scoreIkigai(answers)
  const personality = scorePersonality(answers)
  const sixteenP = score16P(answers)
  const decision = scoreDecision(answers)
  const financial = scoreFinancial(answers)
  const change = scoreChange(answers)

  const composite =
    ikigai.score * 0.25 +
    personality.score * 0.10 +
    sixteenP.score * 0.10 +
    decision.score * 0.20 +
    financial.score * 0.20 +
    change.score * 0.15

  const compositeScore = Math.round(composite * 100) / 100
  const compositeBand = getBand(compositeScore)

  return {
    composite: compositeScore,
    compositeBand,
    domains: {
      ikigai: { ...ikigai, weighted: ikigai.score * 0.25, band: getBand(ikigai.score) },
      personality: { ...personality, weighted: personality.score * 0.10, band: getBand(personality.score) },
      '16p': { ...sixteenP, weighted: sixteenP.score * 0.10, band: getBand(sixteenP.score) },
      decision: { ...decision, weighted: decision.score * 0.20, band: getBand(decision.score) },
      financial: { ...financial, weighted: financial.score * 0.20, band: getBand(financial.score) },
      change: { ...change, weighted: change.score * 0.15, band: getBand(change.score) },
    },
  }
}

export const sampleScores = {
  composite: 68.5,
  compositeBand: 'Aligned',
  domains: {
    ikigai: { score: 72, band: 'Aligned' },
    personality: { score: 65, band: 'Aligned' },
    '16p': { score: 60, band: 'Aligned' },
    decision: { score: 70, band: 'Aligned' },
    financial: { score: 58, band: 'Awakening' },
    change: { score: 75, band: 'Flourishing' },
  },
}
