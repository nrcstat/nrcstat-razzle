import { isServer } from '@/util/utils'
import { isMobileDevice } from '@/util/widgetHelpers.js'
import React, {
  useEffect,
  useContext,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react'
import ReactMarkdown from 'react-markdown'
import { useIntersection, useRaf } from 'react-use'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import {
  BackgroundColorKey,
  BackgroundColorToIconBaseColorMap,
  WidgetIconMap,
} from './config'

import c from './Pictogram.module.scss'

const SECTION_ANIMATION_DURATION = 400
const VISIBILITY_RENDER_THRESHOLD = 0.5

function buildAnimationProgressFunctions(sections) {
  const sectionCount = sections.length
  const start = Date.now()
  const openingAnimationDuration = sectionCount * SECTION_ANIMATION_DURATION
  return sections.map((section, sectionIndex) =>
    section.icons.map((icon) => () => {
      const now = Date.now() - openingAnimationDuration * sectionIndex
      const progress = (now - start) / openingAnimationDuration
      if (progress < 0) return 0
      else if (progress <= icon.data) return progress
      else return icon.data
    })
  )
}

function Pictogram() {
  if (isServer()) return null

  const { widgetObject } = useContext(WidgetParamsContext)

  const {
    id,
    title,
    subtitle,
    source,
    backgroundColor = BackgroundColorKey.White,
    sections,
    enableSocialMediaSharing,
  } = widgetObject

  const iconBaseColor = BackgroundColorToIconBaseColorMap[backgroundColor]

  const isMobile = isMobileDevice()

  const elementRef = useRef(null)

  // Use to detect when Pictogram element is visible in viewport, above a defined
  // threehold degree.
  const intersection = useIntersection(elementRef, {
    root: null,
    rootMargin: '0px',
    threshold: VISIBILITY_RENDER_THRESHOLD,
  })

  // When threshold is crossed, update thie state var to trigger opening amimation
  const [hasOpeningAnimationStarted, setHasOpeningAnimationStarted] =
    useState(false)
  if (intersection?.isIntersecting && !hasOpeningAnimationStarted) {
    setHasOpeningAnimationStarted(true)
  }

  // "Animation functions" that tell each icon what value (between 0 and 1) it should
  // display. If opening animation hasn't started, make the functions just return 0.
  // Otherwise, use the self-contained logic genertaed by the
  // buildAnimationProgressFunctions() that does the actual animation calculations
  // for each icon.
  const animationFunctions = useMemo(() => {
    if (hasOpeningAnimationStarted) {
      return buildAnimationProgressFunctions(sections)
    } else {
      return sections.map((section) => section.icons.map(() => () => 0))
    }
  }, [hasOpeningAnimationStarted])

  // This block uses the `useRequestAnimationFrame` to only trigger re-rendering
  // of this component when strictly necessary. It only starts when
  // hasOpeningAnimationStarted === true, and it only lasts as long as the animation
  // needs (with a bit of extra padding at the end for good measure). The
  // dummyCounter is just a cheap trick to trigger re-rendering.
  const [, setDummyCounter] = useState(0)
  const increaseDummyCounter = useCallback(
    () => setDummyCounter((count) => count + 1),
    []
  )
  useRequestAnimationFrame(increaseDummyCounter, {
    duration: SECTION_ANIMATION_DURATION * sections.length * 2,
    shouldAnimate: hasOpeningAnimationStarted,
  })

  // NOTE: the `container` class (NOT the css moduels c.container) is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image,
  return (
    <div
      className={`container ${c.container} ${isMobile ? c.mobile : c.desktop} ${
        sections?.length > 1 ? c['multiple-sections'] : c['single-section']
      } background-${backgroundColor}`}
      ref={(ref) => {
        findElementEpiServerAncestorResetHeight(ref)
        elementRef.current = ref
      }}
    >
      {title && (
        <span className={c['title']}>
          <ReactMarkdown>{title}</ReactMarkdown>
        </span>
      )}
      {subtitle && <span className={c['subtitle']}>{subtitle}</span>}
      {sections &&
        sections.map((section, sectionKey) => (
          <div className={c['section']} key={sectionKey}>
            {section.title && (
              <span className={c['section-title']}>{section.title}</span>
            )}
            {section.icons?.map((icon, iconKey) => {
              const Icon = WidgetIconMap[icon.icon]
              const fillColor = icon.dataColor
              return Icon && fillColor ? (
                <Icon
                  key={iconKey}
                  data={animationFunctions[sectionKey][iconKey]()}
                  iconBaseColor={iconBaseColor}
                  fillColor={fillColor}
                />
              ) : null
            })}
          </div>
        ))}
      <span className={c['source']}>{source}</span>

      {enableSocialMediaSharing ? (
        <div className={c['share-button-wrapper']}>
          <ShareButton widgetId={id} />
        </div>
      ) : null}
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

export default Pictogram

// Copied from: https://github.com/layonez/use-request-animation-frame/blob/main/src/index.tsx
const useRequestAnimationFrame = (
  nextAnimationFrameHandler,
  { duration = Number.POSITIVE_INFINITY, shouldAnimate = true }
) => {
  const isServerSideOrApiUnsupported =
    typeof requestAnimationFrame === 'undefined' ||
    typeof window === 'undefined'
  if (isServerSideOrApiUnsupported) {
    return
  }

  const frame = useRef(0)
  const firstFrameTime = useRef(performance.now())

  const animate = (now) => {
    // calculate at what time fraction we are currently of whole time of animation
    let timeFraction = (now - firstFrameTime.current) / duration
    if (timeFraction > 1) {
      timeFraction = 1
    }

    if (timeFraction <= 1) {
      nextAnimationFrameHandler(timeFraction)

      // request next frame only in cases when we not reached 100% of duration
      if (timeFraction != 1) frame.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (shouldAnimate) {
      firstFrameTime.current = performance.now()
      frame.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(frame.current)
    }

    return () => cancelAnimationFrame(frame.current)
  }, [shouldAnimate])
}
