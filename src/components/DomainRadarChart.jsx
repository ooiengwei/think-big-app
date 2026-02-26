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
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fontSize: 11, fill: '#191923' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#B40000"
          fill="#B40000"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value) => [`${Math.round(value)}`, 'Score']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
