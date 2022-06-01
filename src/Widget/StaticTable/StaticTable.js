import React, { useRef, useContext, useCallback } from 'react'
import { map as _map } from 'lodash'

import c from './StaticTable.scss'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { isClient, isServer } from '../../util/utils'

import tableTypeToTableWidgetMap from './table-type-to-table-widget-map.js'
const $ = require('jquery')

if (isClient()) {
  window.$ = window.jQuery = $
  window.tooltipster = require('tooltipster')
  window.JSZip = require('jszip')
  require('datatables.net')(window, $)
  require('datatables.net-responsive')(window, $)
  require('datatables.net-colreorder')(window, $)
  require('datatables.net-fixedheader')(window, $)
  require('datatables.net-buttons')(window, $)
  require('datatables.net-buttons/js/buttons.html5.js')(window, $)
  require('tooltipster/dist/css/tooltipster.bundle.min.css')
}

export default function StaticTable(props) {
  // TODO: fix to use proper SSR as far as possible
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)

  const { periodYear, preloadedWidgetData, tableType, locale } = widgetParams
  const t = getNsFixedT(['Widget.Static.Table', 'GeographicalNames'])

  const fakeWidgetObject = {
    id: widgetParams.widgetId,
  }

  const languageObject = buildTableLanguageObject(t)

  const renderFn = tableTypeToTableWidgetMap[tableType]({
    ...widgetParams,
    t,
  }).render

  const elementRef = useRef(null)
  const onReady = useCallback((element) => {
    elementRef.current = element
    $(element).parents('.nrcstat-block').css('height', 'auto')
    renderFn(fakeWidgetObject, preloadedWidgetData, element, languageObject, t)
  })
  return (
    <div className={c['nrcstat__static-table__container']}>
      <div className={c['nrcstat-table-widget']} ref={onReady} />
    </div>
  )
}

export function buildTableLanguageObject(t) {
  return {
    sEmptyTable: t('noDataAvailable'),
    sInfo: t('pagination.showingXToYOfZEntries'),
    sInfoEmpty: 'Showing 0 to 0 of 0 entries',
    sInfoFiltered: t('pagination.filteredDownFromTotalEntries'),
    sInfoPostFix: '',
    sInfoThousands: ',',
    sLengthMenu: t('pagination.showXEntries'),
    sLoadingRecords: t('loading'),
    sProcessing: t('processing'),
    sSearch: t('search'),
    sZeroRecords: t('noMatchingRecords'),
    oPaginate: {
      sFirst: t('pagination.first '),
      sLast: t('pagination.last'),
      sNext: t('pagination.next'),
      sPrevious: t('pagination.previous'),
    },
    oAria: {
      sSortAscending: ': activate to sort column ascending',
      sSortDescending: ': activate to sort column descending',
    },
  }
}
