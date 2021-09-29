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

import { StylesProvider, createGenerateClassName } from '@mui/styles'

import IconButton from '@mui/material/IconButton'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'

import Share from '@mui/icons-material/Share'
import Facebook from '@mui/icons-material/Facebook'

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
            icon={
              <Share
                style={{ color: 'white' }}

                // FabProps={{
                //   component: ({ children }) => (
                //     <a href="https://github.com/">{children}</a>
                //   ),
                // }}
              />
            }
            open={socialMediaOpen}
            onClick={() => setSocialMediaOpen((open) => !open)}
            FabProps={{
              color: 'default',
              size: 'small',
              style: { boxShadow: 'none' },
            }}
            // FabProps={{ style: { width: '20px', height: '20px' } }}
          >
            {/* <SpeedDialAction
              icon={
                <a
                  href="https://github.com/"
                  style={{ color: 'none', lineHeight: '0' }}
                >
                  <Facebook />
                </a>
              }
              tooltipTitle="Facebook"
            />

            <SpeedDialAction icon={<Facebook />} tooltipTitle="Facebook" /> */}
            <SpeedDialAction
              icon={
                <FacebookShareButton urlToShare={shareableUrlForWidget(id)} />
              }
              tooltipTitle="Facebook"
            />
            {/* <SpeedDialAction
              icon={<InstagramIcon />}
              tooltipTitle="Instagram"
            />
            <SpeedDialAction icon={<LinkedInIcon />} tooltipTitle="LinkedIn" />
            <SpeedDialAction icon={<TwitterIcon />} tooltipTitle="Twitter" /> */}
          </SpeedDial>
        </StylesProvider>
      </div>
    </div>
  )
}

const IconAnchor = React.forwardRef((props, ref) => <a {...props} ref={ref} />)
function FacebookShareButton({ urlToShare }) {
  return (
    <IconButton
      component={IconAnchor}
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlToShare
      )}`}
    >
      <Facebook />
    </IconButton>
  )
}

function shareableUrlForWidget(widgetId) {
  return `https://share.nrcdata.no/${widgetId}.html`
}

export default Pictogram
