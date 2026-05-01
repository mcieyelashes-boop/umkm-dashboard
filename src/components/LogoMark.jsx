import { useId } from 'react'

/**
 * 3D isometric LogoMark — replaces the flat Zap icon everywhere.
 * Renders a beautiful 3D cube with a hub/network symbol on the top face.
 * Uses unique gradient IDs via useId() to avoid SVG conflicts.
 */
export default function LogoMark({ size = 40, className = '', animate = false }) {
  const uid = useId().replace(/:/g, '_')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'logo-animate' : ''}`}
      aria-label="UMKM Hub logo"
    >
      <defs>
        {/* ── Face gradients ── */}
        <linearGradient id={`${uid}_top`} x1="5" y1="4" x2="35" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#d8b4fe" />
          <stop offset="45%"  stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        <linearGradient id={`${uid}_left`} x1="5" y1="12" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>

        <linearGradient id={`${uid}_right`} x1="20" y1="12" x2="35" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#4338ca" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Radial highlight on top face */}
        <radialGradient id={`${uid}_shine`} cx="45%" cy="35%" r="55%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Glow for hub nodes */}
        <filter id={`${uid}_glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outer glow / shadow */}
        <filter id={`${uid}_outer`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3"
            floodColor="#7c3aed" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="20" cy="37.5" rx="9.5" ry="2.2"
        fill="#6d28d9" opacity="0.22" />

      {/* ── The 3D cube — three visible faces ── */}
      <g filter={`url(#${uid}_outer)`}>
        {/* Top face */}
        <path d="M20 4 L35 12 L20 20 L5 12 Z"
          fill={`url(#${uid}_top)`} />
        {/* Left face */}
        <path d="M5 12 L20 20 L20 36 L5 28 Z"
          fill={`url(#${uid}_left)`} />
        {/* Right face */}
        <path d="M35 12 L35 28 L20 36 L20 20 Z"
          fill={`url(#${uid}_right)`} />
      </g>

      {/* ── Radial shine on top face ── */}
      <path d="M20 4 L35 12 L20 20 L5 12 Z"
        fill={`url(#${uid}_shine)`} />

      {/* ── Top edge highlight ── */}
      <path d="M20 4 L35 12" stroke="white" strokeWidth="0.7" opacity="0.55" strokeLinecap="round" />
      <path d="M20 4 L5 12"  stroke="white" strokeWidth="0.7" opacity="0.35" strokeLinecap="round" />

      {/* ── Vertical center edge ── */}
      <path d="M20 20 L20 36" stroke="white" strokeWidth="0.35" opacity="0.12" />

      {/* ── Hub / network symbol on top face ── */}
      {/* Center hub node */}
      <circle cx="20" cy="12" r="2.1"
        fill="white" opacity="0.96"
        filter={`url(#${uid}_glow)`} />

      {/* Satellite nodes — follow the rhombus perspective */}
      <circle cx="26.2" cy="9.2"  r="1.35" fill="white" opacity="0.78" />
      <circle cx="13.8" cy="9.2"  r="1.35" fill="white" opacity="0.78" />
      <circle cx="26.2" cy="14.8" r="1.35" fill="white" opacity="0.62" />
      <circle cx="13.8" cy="14.8" r="1.35" fill="white" opacity="0.62" />

      {/* Connection lines */}
      <line x1="20" y1="12" x2="26.2" y2="9.2"  stroke="white" strokeWidth="0.8" opacity="0.55" />
      <line x1="20" y1="12" x2="13.8" y2="9.2"  stroke="white" strokeWidth="0.8" opacity="0.55" />
      <line x1="20" y1="12" x2="26.2" y2="14.8" stroke="white" strokeWidth="0.8" opacity="0.45" />
      <line x1="20" y1="12" x2="13.8" y2="14.8" stroke="white" strokeWidth="0.8" opacity="0.45" />
    </svg>
  )
}
