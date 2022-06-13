import { isServer } from '@/util/utils'
import { isMobileDevice } from '@/util/widgetHelpers.js'
import React, { useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import {
  BackgroundColorKey,
  BackgroundColorToIconBaseColorMap,
  WidgetIconMap,
} from './config'

import c from './Pictogram.module.scss'

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

  // NOTE: the `container` class (NOT the css moduels c.container) is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image,
  return (
    <div
      className={`container ${c.container} ${isMobile ? c.mobile : c.desktop} ${
        sections?.length > 1 ? c['multiple-sections'] : c['single-section']
      } background-${backgroundColor}`}
      ref={findElementEpiServerAncestorResetHeight}
    >
      {title && (
        <span className={c['title']}>
          <ReactMarkdown>{title}</ReactMarkdown>
        </span>
      )}
      {subtitle && <span className={c['subtitle']}>{subtitle}</span>}
      {sections &&
        sections.map((section, key) => (
          <div className={c['section']} key={key}>
            {section.title && (
              <span className={c['section-title']}>{section.title}</span>
            )}
            {section.icons?.map((icon, key) => {
              const Icon = WidgetIconMap[icon.icon]
              const fillColor = icon.dataColor
              return Icon && fillColor ? (
                <Icon
                  key={key}
                  data={icon.data}
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
