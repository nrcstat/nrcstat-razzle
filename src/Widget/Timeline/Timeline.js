import React, { useContext, useLayoutEffect, useRef, useState } from 'react'

import { isMobileDevice } from '@/util/widgetHelpers.js'
import { isServer } from '@/util/utils'
import { WidgetParamsContext } from '../Widget'

import { FixedLocaleContext } from '../../services/i18n'

import c from './Timeline.module.scss'

function Timeline() {
  if (isServer()) return null

  const isMobile = isMobileDevice()

  const { widgetObject } = useContext(WidgetParamsContext)

  const entries = widgetObject.entries

  return (
    <div
      className={`${c.container} ${isMobile ? c.mobile : c.desktop}`}
      ref={findElementEpiServerAncestorResetHeight}
    >
      {entries.map((entry, key) => (
        <TimelineEntry entry={entry} key={key} />
      ))}
    </div>
  )
}

function TimelineEntry({ entry }) {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const accordionBodyRef = useRef(null)
  const accordionButtonRef = useRef(null)
  const accordionFaderRef = useRef(null)

  useLayoutEffect(() => {
    const accordionBodyHeight = accordionBodyRef.current.offsetHeight

    if (accordionBodyHeight >= 160) {
      accordionButtonRef.current.style.setProperty('display', 'inline-block')
    }
  }, [])

  function handleCollapseExpandBtnClick() {
    if (accordionOpen) closeAccordion()
    else openAccordion()
  }

  function openAccordion() {
    accordionBodyRef.current.style.setProperty('max-height', 'none')
    accordionFaderRef.current.style.setProperty('visibility', 'hidden')
    setAccordionOpen(true)
  }

  function closeAccordion() {
    accordionBodyRef.current.style.setProperty('max-height', '165px')
    accordionFaderRef.current.style.setProperty('visibility', 'visible')
    setAccordionOpen(false)
  }

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Widget.UserCreated.Timeline'])

  return (
    <div className={c['timeline-entry']}>
      <div className={c['timeline-marker']} />
      <div className={c['timeline-content-line']} />
      <div className={c['timeline-content']}>
        <span className={c['timeline-entry-title']}>{entry.title}</span>
        <span className={c['timeline-entry-subtitle']}>{entry.subtitle}</span>
        <span className={c['timeline-entry-accordion']}>
          <span
            className={c['timeline-entry-accordion-body']}
            ref={(ref) => (accordionBodyRef.current = ref)}
          >
            {entry.body}
            <div
              className={c['fade-out-last-line']}
              ref={(ref) => (accordionFaderRef.current = ref)}
            />
          </span>
          <button
            className={c['collapse-expand-button']}
            ref={(ref) => (accordionButtonRef.current = ref)}
            onClick={handleCollapseExpandBtnClick}
          >
            {!accordionOpen ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: t('expandCollapseButton.readMore'),
                }}
              />
            ) : null}
            {accordionOpen ? <>▲</> : null}
          </button>
        </span>
      </div>
    </div>
  )
}

function findElementEpiServerAncestorResetHeight(element) {
  let isParentNotNrcstatBlock
  do {
    element = element?.parentNode
    isParentNotNrcstatBlock = !element?.classList?.contains('nrcstat-block')
  } while (element && isParentNotNrcstatBlock)

  // The element is non-null and has a class of nrcstat-block
  if (element) {
    element.style.setProperty('height', 'auto')
  }
}

export default Timeline
