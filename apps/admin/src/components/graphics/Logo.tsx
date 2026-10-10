import React from 'react'

/** Full wordmark for login / branding surfaces. */
export default function Logo() {
  return (
    <span className="pellegrina-logo" aria-label="Pellegrina Viajes">
      <svg className="pellegrina-logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="#dcf0f4" />
        <circle cx="20" cy="20" r="12" fill="none" stroke="#2c6675" strokeWidth="1.6" />
        <ellipse cx="20" cy="20" rx="5" ry="12" fill="none" stroke="#46733c" strokeWidth="1.4" />
        <path d="M8 20h24M20 8c4 4 4 20 0 24M20 8c-4 4-4 20 0 24" fill="none" stroke="#2c6675" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="2.2" fill="#b45f2e" />
      </svg>
      <span className="pellegrina-logo__text">
        Pellegrina
        <small>Viajes</small>
      </span>
    </span>
  )
}
