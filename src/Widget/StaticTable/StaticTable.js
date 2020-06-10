import React, { useRef, useContext, useCallback } from 'react'
import {
  map as _map
} from 'lodash'

import './StaticTable.scss'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { isClient, isServer } from '../../util/utils'

import tableTypeToTableWidgetMap from './table-type-to-table-widget-map.js'
const $ = require('jquery')

if (isClient()) {
  window.$ = window.jQuery = $
  window.tooltipster = require('tooltipster')
  require('datatables.net')(window, $)
  require('datatables.net-responsive')(window, $)
  require('datatables.net-colreorder')(window, $)
  require('datatables.net-fixedheader')(window, $)
  require('datatables.net-buttons')(window, $)
  require('datatables.net-buttons/js/buttons.html5.js')(window, $)
  require('tooltipster/dist/css/tooltipster.bundle.min.css')
}

export default function StaticTable () {
  // TODO: fix to use proper SSR as far as possible
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { periodYear, preloadedWidgetData, tableType } = widgetParams
  const t = getNsFixedT(['Widget.Static.Table', 'GeographicalNames'])

  const fakeWidgetObject = {
    id: widgetParams.widgetId
  }

  const renderFn = tableTypeToTableWidgetMap[tableType].render

  console.log(widgetParams)
  console.log(renderFn)

  const elementRef = useRef(null)
  const onReady = useCallback(element => {
    elementRef.current = element
    renderFn(fakeWidgetObject, null, element)
  })
  return (
    <div className='nrcstat__static-table__container' ref={onReady} />
  )
}
