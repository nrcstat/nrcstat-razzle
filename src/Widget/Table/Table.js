import { isNaN, isNull, isUndefined } from 'lodash'
import React, { useContext, useRef } from 'react'
import { isClient, isServer } from '../../util/utils'
import c from '../StaticTable/StaticTable.scss'
import { WidgetParamsContext } from '../Widget'
import c2 from './Table.module.scss'
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

function Table() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const {
    widgetObject: {
      customData,
      title,
      config: { subtitle, source, linkToSource },
    },
  } = widgetParams

  const elementRef = useRef(null)
  const onReady = (element) => {
    elementRef.current = element
    $(element).parents('.nrcstat-block').css('height', 'auto')
    const table = $(element).DataTable({
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      autoWidth: false,
    })
  }

  const colIdsAndType = customData?.columns?.map((column) => [
    column.data,
    column.renderer ?? 'text',
  ])

  // NOTE: the `container` class is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image.
  return (
    <div className={`container ${c['nrcstat__static-table__container']}}`}>
      <div className={c['nrcstat-table-widget']}>
        <span className={c2.title}>{title}</span>
        <span className={c2.subtitle}>{subtitle}</span>
        <table
          ref={onReady}
          className="display responsive no-wrap row-border cell-border stripe hover order-column"
        >
          <thead>
            <tr>
              {customData?.columns?.map((column) => (
                <th key={column.data}>{column.columnLabel}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customData?.data?.map((row) => (
              <tr key={row.id}>
                {colIdsAndType.map(([colId, colType]) => (
                  <DataCell data={row[colId]} type={colType} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <span className={c2.source}>
          {linkToSource ? (
            <a href={linkToSource} target="_blank">
              {source}
            </a>
          ) : (
            <>{source}</>
          )}
        </span>
      </div>
    </div>
  )
}

function DataCell({ data, type }) {
  const { locale } = useContext(WidgetParamsContext)

  if (type == 'numeric') {
    if (isNaN(data) || isUndefined(data) || isNull(data)) return <td></td>
    return <td>{new Intl.NumberFormat(locale).format(data)}</td>
  } else {
    return <td>{data}</td>
  }
}

export default Table
