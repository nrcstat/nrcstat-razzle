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

import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import ShareIcon from '@material-ui/icons/Share'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'

import './Pictogram.scss'

const generateClassName = createGenerateClassName({
  seed: 'App1',
})

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

  const tmp = useContext(WidgetParamsContext)
  console.log(tmp)
  const { locale, widgetObject } = useContext(WidgetParamsContext)

  const {
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
      className={`container ${isMobile ? 'mobile' : 'desktop'} ${
        sections?.length > 1 ? 'multiple-sections' : 'single-section'
      } background-${backgroundColor}`}
    >
      {title && (
        <span className="title">
          <ReactMarkdown>{title}</ReactMarkdown>
        </span>
      )}
      {subtitle && <span className="subtitle">{subtitle}</span>}
      {sections &&
        sections.map((section, key) => (
          <div className="section" key={key}>
            {section.title && (
              <span className="section-title">{section.title}</span>
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
      <span className="source">{source}</span>
      <div className="share-button-wrapper">
        <StylesProvider generateClassName={generateClassName}>
          <SpeedDial
            ariaLabel="SpeedDial example"
            icon={<ShareIcon />}
            open={socialMediaOpen}
            onClick={() => setSocialMediaOpen((open) => !open)}
          >
            <SpeedDialAction icon={<FacebookIcon />} tooltipTitle="Facebook" />
            <SpeedDialAction
              icon={<InstagramIcon />}
              tooltipTitle="Instagram"
            />
            <SpeedDialAction icon={<LinkedInIcon />} tooltipTitle="LinkedIn" />
            <SpeedDialAction icon={<TwitterIcon />} tooltipTitle="Twitter" />
          </SpeedDial>
        </StylesProvider>
      </div>
    </div>
  )
}

export default Pictogram
