import React from 'react'
import { useTranslationBar } from "../contexts/TranslationContext"

type Props = {
  title: string
  value: string
  subtitle?: string
  accent?: string
  initials?: string
  icon?: React.ReactNode
  progress?: number // 0-100
  titleEn?: string
  subtitleEn?: string
  onClick?: () => void
  active?: boolean
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function MetricCard(props: Props) {
  const { title, value, subtitle, accent = '#60a5fa', initials = '', icon, progress = 0, titleEn, subtitleEn, onClick, active } = props
  const ringPct = Math.max(0, Math.min(100, Math.round(progress)))
  const ringStyle: React.CSSProperties = {
    background: `conic-gradient(${accent} ${ringPct}%, rgba(230,238,249,1) ${ringPct}%)`,
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center'
  }

  const accentSoft = hexToRgba(accent, 0.18)
  const accentSoft2 = hexToRgba(accent, 0.06)
  const whiteCenter = 'rgba(255,255,255,0.92)'

  const containerStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${accentSoft}, ${whiteCenter} 36%, ${accentSoft2} 100%)`,
    border: '1px solid rgba(0,0,0,0.04)'
  }

  const { setText } = useTranslationBar()

  function handleEnter() {
    const t = titleEn ?? title
    const s = subtitleEn ?? subtitle ?? ''
    setText(s ? `${t} — ${s}` : t)
  }

  function handleLeave() {
    setText("")
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={
        `rounded-2xl p-4 backdrop-blur-sm flex items-center gap-4 ${onClick ? 'cursor-pointer' : ''}` +
        (active ? ' shadow-[0_8px_20px_rgba(0,0,0,0.12)]' : ' shadow-md')
      }
      style={containerStyle}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold"
          style={{ background: `linear-gradient(135deg, ${hexToRgba(accent, 0.9)}, ${accent})` }}
          aria-hidden
        >
          {icon ? icon : <span>{initials}</span>}
        </div>
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-600 dark:text-gray-300">{title}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
        {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>}
      </div>

      <div className="flex items-center">
        <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center' }}>
          <div style={ringStyle} aria-hidden>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'white',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155'
              }}
            >
              {String(ringPct)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
