import nodeFetch from 'node-fetch'
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'
import { API_URL, LIB_URL } from '@/config.js'
import { isServer } from '../../../../util/utils'
const countryAnnotations = require('../countryAnnotations2018.json')
const async = require('async')

const $ = require('jquery')

let fetch
if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export default function (title, dataColumnName, dataProcessingFunction, queryObject, foooterAnnotations, placeColumnName = 'Land', orderingEnabled = true, dataColumnFormatter = thousandsFormatter) {
  if (typeof regionCodeNRC === 'string') regionCodeNRC = [regionCodeNRC]
  if (typeof foooterAnnotations === 'string') foooterAnnotations = [foooterAnnotations]

  function loadWidgetData () {
    var urlQ = encodeURIComponent(JSON.stringify(queryObject))
    const url = `${API_URL}/datas?filter=${urlQ}`
    return fetch(url)
      .then(resp => resp.json())
  }

  function render (widgetObject, widgetData, targetSelector) {
    const wObject = widgetObject
    const wData = widgetData
    const wConfig = widgetObject.config

    const target = $(targetSelector)
    const w = target.innerWidth()
    const h = target.innerHeight()

    target.empty()

    const id = wObject.id

    let tmpl
    let widgetEl
    let tableData
    let ft
    let allAnnotations

    async.waterfall([
      function setContainerWidth (cb) {
        $(targetSelector).css('max-width', '600px')
        cb()
      },

      async function loadData (cb) {
        let data = await loadWidgetData()
        data = dataProcessingFunction(data)
        tableData = data
        cb(null)
      },
      /*
      function configureAnnotations(cb) {
        tableData = tableData.map(country => {
          const countryCode = country.countryCode

          // Check if there is an annotation for this country. If so, add to the country object and annotations
          let annotationIndex = 0
          let annotations = []
          do {
            annotationIndex = _.findIndex(countryAnnotations, annot => _.includes(annot.countryCode, countryCode), annotationIndex + 1)
            if (annotationIndex !== -1)
              annotations.push(countryAnnotations[ annotationIndex ].annotation)
          } while (annotationIndex !== -1)

          country.annotations = annotations

          return country
        })

        allAnnotations =
            _(tableData)
                .map(row => row.annotations)
                .flatten()
                .uniq()
                .map((v, i) => {
                  return { number: i + 1, annotation: v }
                })
                .value()

        tableData = tableData.map(country => {
          country.annotations = country.annotations.map(annot => {
            const match = _.find(allAnnotations, a => a.annotation == annot)
            return {
              annotation: annot,
              number: match.number
            }
          })
          return country
        })

        cb(null)
      },
      */
      function setTmpl (cb) {
        let annotations = ''
        /* allAnnotations.forEach(annot => {
          annotations += `<p style="font-size: small;"><sup>${annot.number})</sup>&nbsp;${annot.annotation}</p>`
        }) */
        foooterAnnotations.forEach(annot => {
          annotations += `<p style="font-size: small;">${annot}</p>`
        })
        tmpl = `
        <h4>${title}</h4>
        <table id="datatable${id}" class="display responsive no-wrap row-border cell-border stripe hover order-column" style="width: 100%;">
          <thead>
            <tr>
              <th>${placeColumnName}</th>
              <th>${dataColumnName}</th>
            </tr>
          </thead>
        </table>
        <div class="nrcstat-table-widget-annotations">${annotations}</div>
        
        `
        widgetEl = $(tmpl)
        widgetEl.appendTo($(targetSelector))
        cb()
      },
      function setupTable (cb) {
        ft = $(`#datatable${id}`).DataTable({
          columns: [
            {
              data: 'place',
              render: (data, type, row) => {
                if (type == 'display') {
                  const txt = data
                  /*
                  row.annotations.forEach(annot => {
                    txt += `&nbsp;<span class="nrcstat-widget-tooltip" title="${annot.annotation}"><sup>${annot.number})</sup></span>`
                  })
                  */
                  return txt
                } else {
                  return data
                }
              }
            },
            {
              data: 'data',
              render: (data, type, row) => {
                if (type == 'display') return dataColumnFormatter(data)
                else return data
              }
            }
          ],
          language: {
            url: 'https://wlib.staging.nrcdata.no/datatables_language.json'
          },
          responsive: true,
          searching: true,
          info: true,
          paging: tableData.length > 10,
          ordering: orderingEnabled,
          colReorder: true,
          fixedHeader: true
        })
        ft.on('draw.dt', () => initTooltipster())
        ft.on('responsive-display', () => initTooltipster())
        ft.rows.add(tableData).draw(false)
        if (orderingEnabled) {
          ft.order([1, 'desc']).draw()
        }
        cb()
      },
      function setupTooltips (cb) {
        initTooltipster()
        cb(null)
      }

    ])

    function initTooltipster () {
      target.find('.nrcstat-widget-tooltip').tooltipster({
        interactive: true,
        delay: 100,
        animation: 'fade',
        maxWidth: 300
      })
    }
  }

  return {
    loadWidgetData,
    render
  }
}