import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import c from './all-icons-style.module.scss'
// from <svg> tag removed attributes:
// xmlns:xlink="http://www.w3.org/1999/xlink"
// xml:space="preserve"

export function Icon({
  children,
  horizontalFill = 1,
  iconBaseColor = '#C2C2C2',
  fillColor = '#FDC82F',
}) {
  const maskId = useMemo(() => uuidv4(), [])
  const maskWidth = Math.round(horizontalFill * 1000)

  return (
    <svg
      className={c['icon-svg']}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 1100 1100"
      preserveAspectRatio="xMidYMid"
    >
      <mask id={maskId}>
        <rect x="50" y="0" width={maskWidth} height="1100" fill="white" />
      </mask>

      <circle cx="549.3" cy="550" r="500" fill={iconBaseColor} />
      <circle
        cx="549.3"
        cy="550"
        r="500"
        fill={fillColor}
        mask={`url(#${maskId})`}
      />

      {children}
    </svg>
  )
}
