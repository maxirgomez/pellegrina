import React from 'react'

/** Compact mark for the admin nav. */
export default function Icon() {
  return (
    <svg
      className="pellegrina-icon"
      viewBox="0 0 40 40"
      width={28}
      height={28}
      aria-label="Pellegrina"
    >
      <circle cx="20" cy="20" r="18" fill="#dcf0f4" />
      <circle cx="20" cy="20" r="12" fill="none" stroke="#2c6675" strokeWidth="1.8" />
      <ellipse cx="20" cy="20" rx="5" ry="12" fill="none" stroke="#46733c" strokeWidth="1.5" />
      <path
        d="M8 20h24M20 8c4 4 4 20 0 24M20 8c-4 4-4 20 0 24"
        fill="none"
        stroke="#2c6675"
        strokeWidth="1.3"
      />
      <circle cx="20" cy="20" r="2.4" fill="#b45f2e" />
    </svg>
  )
}
