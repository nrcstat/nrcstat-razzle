import { useMouse, useEventListener } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { buildTableLanguageObject } from '../StaticTable/StaticTable.js'

import './CustomTable.scss'
import '../StaticTable/StaticTable.scss'

import * as $ from 'jquery'
import { isClient } from '../../util/utils'
import {
  populationNumberFormatter,
  percentFormatter,
  thousandsFormatter
} from '@/util/tableWidgetFormatters.js'

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

function CustomTable () {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Widget.Static.Table'])

  const languageObject = buildTableLanguageObject(t)

  const widgetParams = useContext(WidgetParamsContext)
  const { widgetObject, locale } = widgetParams
  const { widgetObject: { tableColumns, tableData } } = widgetParams

  const onReady = tableElement => {
    $(tableElement).parents('.nrcstat-block').css('height', 'auto')
    const ft = $(tableElement).DataTable({
      columns: [
        { data: () => '' },
        ...tableColumns.map(column => {
          return {
            data: column.data,
            render: (data, type, row) => {
              if (column.type === 'numeric' && type === 'display') return thousandsFormatter(data)
              else return data
            }
          }
        })
      ],
      language: languageObject,
      responsive: {
        details: {
          type: 'column'
        }
      },
      columnDefs: [{
        className: 'control',
        orderable: false,
        targets: 0
      }],
      searching: true,
      info: true,
      paging: tableData.length > 10,
      ordering: true,
      colReorder: true,
      fixedHeader: true
    })
    const adaptedData = tableData
      .filter(row => {
        return Object.values(row).some(val => Boolean(val))
      })
      .map(row => {
        tableColumns.forEach(col => {
          const colKey = col.data
          if (typeof row[colKey] === 'undefined') {
            row[colKey] = null
          }
        })
        return row
      })
    ft.rows.add(adaptedData).draw(false)
  }

  return (
    <div className='nrcstat__static-table__container'>
      <div className='nrcstat-table-widget'>
        <table ref={onReady} className='display responsive no-wrap row-border cell-border stripe hover order-column' style={{ width: '100%' }}>
          <thead>
            <tr>
              <th />
              {tableColumns.map((d, i) => (
                <th key={i}>{d.data}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default CustomTable

function translateCustomData (customData) {
  return customData
    .map(item => ({ name: item.hoverLabel, value: item.value }))
    .filter(item => Boolean(item.value))
}
