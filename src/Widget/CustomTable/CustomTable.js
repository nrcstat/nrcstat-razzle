import { useMouse, useEventListener } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'

import './CustomTable.scss'

import * as $ from 'jquery'
import { isClient } from '../../util/utils'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function CustomTable () {
  // const widgetParams = useContext(WidgetParamsContext)
  // const { widgetObject } = widgetParams

  // const data = translateCustomData(widgetObject.customData)

  return (
    <div>
      I am custom table
    </div>
  )
}

function translateCustomData (customData) {
  return customData
    .map(item => ({ name: item.hoverLabel, value: item.value }))
    .filter(item => Boolean(item.value))
}
