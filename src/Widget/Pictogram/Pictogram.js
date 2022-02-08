import React, { useContext, useState } from 'react'
import { isServer, isClient } from '@/util/utils'
import { isMobileDevice } from '@/util/widgetHelpers.js'
import ReactMarkdown from 'react-markdown'

import {
  BackgroundColorKey,
  BackgroundColorToIconBaseColorMap,
  DataColor,
  IconBaseColor,
} from './config'
import {
  Camp,
  Education,
  Food,
  Legal,
  Shelter,
  WASH,
  PeopleFemale,
  PeopleMale,
  PeopleLittleBoy,
  PeopleLittleGirl,
  PeopleSchoolGirl,
  PeopleSchoolBoy,
  PeopleChildren,
  PeopleRefugeeFamily,
  PeopleRefugeeFamilyAlt,
  PeopleRefugeesRunning,
  PeopleFemaleCircle,
  PeopleMaleCircle,
  PeopleLittleBoyCircle,
  PeopleLittleGirlCircle,
  PeopleSchoolGirlCircle,
  PeopleSchoolBoyCircle,
  PeopleChildrenCircle,
  PeopleRefugeeFamilyCircle,
  PeopleRefugeeFamilyAltCircle,
  PeopleRefugeesRunningCircle,
} from './icons/index.js'
import { WidgetParamsContext } from '../Widget'

import c from './Pictogram.module.scss'
import ShareButton from '../ShareButton'

const WidgetIconMap = {
  PeopleFemale,
  PeopleMale,
  PeopleLittleBoy,
  PeopleLittleGirl,
  PeopleSchoolGirl,
  PeopleSchoolBoy,
  PeopleChildren,
  PeopleRefugeeFamily,
  PeopleRefugeeFamilyAlt,
  PeopleRefugeesRunning,
  PeopleFemaleCircle,
  PeopleMaleCircle,
  PeopleLittleBoyCircle,
  PeopleLittleGirlCircle,
  PeopleSchoolGirlCircle,
  PeopleSchoolBoyCircle,
  PeopleChildrenCircle,
  PeopleRefugeeFamilyCircle,
  PeopleRefugeeFamilyAltCircle,
  PeopleRefugeesRunningCircle,
  Camp,
  Education,
  Food,
  Legal,
  Shelter,
  WASH,
}

function Pictogram() {
  if (isServer()) return null

  const { locale, widgetObject } = useContext(WidgetParamsContext)

  const {
    id,
    title,
    subtitle,
    source,
    backgroundColor = BackgroundColorKey.White,
    sections,
  } = widgetObject

  // TODO: remove?
  // const fixEpiServerAncestorBlockHeight = (element) => {
  //   $(element).parents('.nrcstat-block').css('height', 'auto')
  // }

  const iconBaseColor = BackgroundColorToIconBaseColorMap[backgroundColor]

  const isMobile = isMobileDevice()

  const [socialMediaOpen, setSocialMediaOpen] = useState(false)

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

      <div className={c['share-button-wrapper']}>
        <ShareButton widgetId={id} />
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

export default Pictogram
