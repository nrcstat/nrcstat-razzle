import React, { useContext, useEffect } from 'react'
import { isServer, isClient } from '@/util/utils'
import { isMobileDevice } from '@/util/widgetHelpers.js'

import {
  BackgroundColorKey,
  BackgroundColorToIconBaseColorMap,
  DataColor,
  IconBaseColor
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
  PeopleRefugeesRunning
} from './icons/index.js'
import { WidgetParamsContext } from '../Widget'
import './Pictogram.scss'

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
  Camp,
  Education,
  Food,
  Legal,
  Shelter,
  WASH
}

function Pictogram () {
  if (isServer()) return null

  const tmp = useContext(WidgetParamsContext)
  console.log(tmp)
  const { locale, widgetObject } = useContext(WidgetParamsContext)

  const {
    title,
    subtitle,
    source,
    backgroundColor = BackgroundColorKey.White,
    sections
  } = widgetObject

  // TODO: remove?
  // const fixEpiServerAncestorBlockHeight = (element) => {
  //   $(element).parents('.nrcstat-block').css('height', 'auto')
  // }

  const iconBaseColor = BackgroundColorToIconBaseColorMap[backgroundColor]

  const isMobile = isMobileDevice()

  return (
    <div
      className={`container ${isMobile ? 'mobile' : 'desktop'} ${
        sections?.length > 1 ? 'multiple-sections' : 'single-section'
      } background-${backgroundColor}`}
    >
      {title && <span className='title'>{title}</span>}
      {subtitle && <span className='subtitle'>{subtitle}</span>}
      {sections &&
        sections.map((section, key) => (
          <div className='section' key={key}>
            {section.title && <span className='section-title'>{section.title}</span>}
            {section.icons?.map((icon, key) => {
              const Icon = WidgetIconMap[icon.icon]
              const fillColor = icon.dataColor
              return (
                <Icon
                  key={key}
                  data={icon.data}
                  iconBaseColor={iconBaseColor}
                  fillColor={fillColor}
                />
              )
            })}
          </div>
        ))}
      <span className='source'>{source}</span>
    </div>
  )
}

export default Pictogram
