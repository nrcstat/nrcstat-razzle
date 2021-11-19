import React, { useContext } from 'react'

import { isMobileDevice } from '@/util/widgetHelpers.js'
import { isServer } from '@/util/utils'
import { WidgetParamsContext } from '../Widget'

import c from './Timeline.module.scss'

function Timeline() {
  if (isServer()) return null

  console.log(c)

  const isMobile = isMobileDevice()

  const { widgetObject } = useContext(WidgetParamsContext)

  const entries = widgetObject.entries

  return (
    <div className={`${c.container} ${isMobile ? c.mobile : c.desktop}`}>
      {entries.map(({ title, subtitle, body }, key) => (
        <div className={c['timeline-entry']} key={key}>
          <div className={c['timeline-marker']} />
          <div className={c['timeline-content-line']} />
          <div className={c['timeline-content']}>
            <span className={c['timeline-entry-title']}>{title}</span>
            <span className={c['timeline-entry-subtitle']}>{subtitle}</span>
            <span className={c['timeline-entry-body']}>
              {body}
              <div className={c['fade-out-last-line']} />
              {/* <button className="past-fade-out-expand-button">expand</button> */}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
