import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const domainLabels = {
  ikigai: 'Ikigai',
  personality: 'Personality',
  '16p': '16 Personalities',
  decision: 'Decision Making',
  financial: 'Financial',
  change: 'Change Direction',
}

export default function DomainRadarChart({ scores, size = 350 }) {
  const data = Object.entries(scores.domains || {}).map(([key, val]) => ({
    domain: domainLabels[key] || key,
    score: typeof val === 'object' ? val.score : val,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fontSize: 11, fill: '#0A0F1E', fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#00AEEF"
          fill="#00AEEF"
          fillOpacity={0.15}
          strokeWidth={2.5}
        />
        <Tooltip
          formatter={(value) => [`${Math.round(value)}`, 'Score']}
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
