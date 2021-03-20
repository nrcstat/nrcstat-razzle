import React from 'react'

import { isMobileDevice } from '@/util/widgetHelpers.js'
import './Widget.scss'

const isMobile = isMobileDevice()

function Timeline ({ entries }) {
  return (
    <div className={`container ${isMobile ? 'mobile' : 'desktop'}`}>
      {entries.map(({ title, subtitle, body }, key) => (
        <div className='timeline-entry' key={key}>
          <div className='timeline-marker' />
          <div className='timeline-content-line' />
          <div className='timeline-content'>
            <span className='timeline-entry-title'>{title}</span>
            <span className='timeline-entry-subtitle'>{subtitle}</span>
            <span className='timeline-entry-body'>{body}
              <div className='fade-out-last-line' />
              {/* <button className="past-fade-out-expand-button">expand</button> */}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
