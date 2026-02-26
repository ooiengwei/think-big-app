import { domains } from '../lib/questions'
import { getBandColor } from '../lib/scoring'

const DOMAIN_COLORS = {
  ikigai: '#B40000',
  personality: '#A06E14',
  '16p': '#2563eb',
  decision: '#059669',
  financial: '#7c3aed',
  change: '#d97706',
}

export default function ScoreCard({ domainId, domainScore }) {
  const domain = domains.find(d => d.id === domainId)
  if (!domain || !domainScore) return null

  const { score, band, mbtiType } = domainScore
  const pct = Math.min(100, Math.max(0, score))
  const color = DOMAIN_COLORS[domainId] || '#6B7280'
  const bandColor = getBandColor(band)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-dark">{domain.name}</h3>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: bandColor + '20', color: bandColor }}
        >
          {band}
        </span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold" style={{ color }}>{Math.round(score)}</span>
        <span className="text-gray-400 text-sm mb-1">/ 100</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {mbtiType && (
        <p className="text-sm text-gray-500 mt-2">Type: <span className="font-medium text-dark">{mbtiType}</span></p>
      )}
      <p className="text-xs text-gray-400 mt-1">Weight: {domain.weight * 100}%</p>
    </div>
  )
}
