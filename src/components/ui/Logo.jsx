import React from 'react'

export default function Logo({
  size = 40,
  variant = 'dark',
  subtitle = 'CORE MOBILE',
}) {
  const isLight = variant === 'light'
  const textColor = isLight ? '#fff' : '#D5006D'
  const subColor = isLight ? 'rgba(255,255,255,0.85)' : '#6B7280'
  const nameSize = Math.round(size * 0.48)
  const subSize = Math.max(9, Math.round(size * 0.22))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Compartamos Banco" role="img">
        <rect width="48" height="48" rx="12" fill="#D5006D" />
        <path d="M14 28 L24 14 L34 28 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M18 32 L24 22 L30 32 Z" fill="#fff" />
        <circle cx="24" cy="18" r="4" fill="rgba(255,255,255,0.4)" />
      </svg>
      {subtitle !== false && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span style={{ fontWeight: 800, fontSize: nameSize, color: textColor, letterSpacing: '-0.3px' }}>
            Compartamos
          </span>
          {subtitle && (
            <span style={{ fontSize: subSize, fontWeight: 700, color: subColor, letterSpacing: '0.8px' }}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
