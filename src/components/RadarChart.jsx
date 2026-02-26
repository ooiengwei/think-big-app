import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { DOMAINS } from '../lib/questions'

export default function RadarChart({ domainScores, size = 350 }) {
  const data = DOMAINS.map(d => ({
    domain: d.label,
    score: domainScores[d.key]?.score ?? 0,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fill: '#191923', fontSize: 12, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 10 }}
          tickCount={5}
        />
        <Tooltip
          formatter={(value) => [`${Math.round(value)}`, 'Score']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#B40000"
          fill="#B40000"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
