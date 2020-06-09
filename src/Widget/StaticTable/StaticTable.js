import React, { useRef, useContext } from 'react'
import {
  map as _map
} from 'lodash'

import {
  formatDataNumber,
  formatDataPercentage,
  formatNumber,
  isMobileDevice
} from '@/old/widgetHelpers'

import './StaticTable.scss'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { isClient } from '../../util/utils'

import tableTypeToTableWidgetMap from './table-type-to-table-widget-map.js'

export default function StaticTable () {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { periodYear, preloadedWidgetData } = widgetParams
  const t = getNsFixedT(['Widget.Static.Table', 'GeographicalNames'])

  if (isClient()) {
    console.log(widgetParams)
  }

  const containerElementRef = useRef(null)
  const onReady = ref => {
    console.log('redi')
  }
  return (
    <div className='nrcstat__static-table__container' ref={containerElementRef} />
  )
}
