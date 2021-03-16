import React, { useMemo, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// from <svg> tag removed attributes:
// xmlns:dc="http://purl.org/dc/elements/1.1/"
// xmlns:cc="http://creativecommons.org/ns#"
// xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
// xmlns:svg="http://www.w3.org/2000/svg"
// xml:space="preserve"
// <metadata
// id="metadata8"><rdf:RDF><cc:Work
// rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
//   rdf:resource="http://purl.org/dc/dcmitype/StillImage" /></cc:Work></rdf:RDF></metadata>

export function PeopleIcon ({
  children,
  horizontalFill,
  iconBaseColor = '#C2C2C2',
  fillColor = '#FDC82F'
}) {
  const baseMaskId = useMemo(() => uuidv4(), [])
  const fillMaskId = useMemo(() => uuidv4(), [])

  const totalWidth = 98.19
  const fillRectWidth = horizontalFill * totalWidth
  const baseFillWidth = totalWidth - fillRectWidth

  return (
    <svg
      className='icon-svg'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 133.33333 133.33333'
    >
      <mask id={baseMaskId}>
        <rect
          x={totalWidth - baseFillWidth}
          y='0'
          width={baseFillWidth}
          height='130'
          fill='white'
        />
      </mask>
      <mask id={fillMaskId}>
        <rect x='0' y='0' width={fillRectWidth} height='130' fill='white' />
      </mask>

      {children(fillColor, iconBaseColor, fillMaskId, baseMaskId)}
    </svg>
  )
}
