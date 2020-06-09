import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'
import { API_URL, LIB_URL } from '@/config.js'
import { map, filter, findIndex, includes, find } from 'lodash'
const countryCodeNameMap = require('../../../assets/countryCodeNameMapNorwegian.json')
const countryAnnotations = require('../../../assets/countryAnnotations.json')
const async = require('async')

const $ = require('jquery')

export default function (dataPointX, regionCodeNRC, countryLimit, title, foooterAnnotations, year = 2017) {
  if (typeof regionCodeNRC === 'string') regionCodeNRC = [regionCodeNRC]
  if (typeof foooterAnnotations === 'string') foooterAnnotations = [foooterAnnotations]

  return function (widgetObject, widgetData, targetSelector) {
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

      function loadData (cb) {
        var q = {
          where: { year: year, dataPoint: dataPointX, regionCodeNRC: { inq: regionCodeNRC } },
          limit: countryLimit,
          order: 'data DESC'
        }
        var urlQ = encodeURIComponent(JSON.stringify(q))
        $.get(`${API_URL}/datas?filter=${urlQ}`, function (data) {
          data = map(data, (v) => {
            return {
              countryCode: v.countryCode,
              data: v.data
            }
          })
          data = map(data, d => {
            d.country =
                countryCodeNameMap[d.countryCode]
            return d
          })
          data = filter(data, d => d.data != null)
          data = filter(data, d => d.data != 0)
          tableData = data
          cb(null)
        })
      },
      function configureAnnotations (cb) {
        tableData = tableData.map(country => {
          const countryCode = country.countryCode

          // Check if there is an annotation for this country. If so, add to the country object and annotations
          let annotationIndex = 0
          const annotations = []
          do {
            annotationIndex = findIndex(countryAnnotations, annot => includes(annot.countryCode, countryCode), annotationIndex + 1)
            if (annotationIndex !== -1) { annotations.push(countryAnnotations[annotationIndex].annotation) }
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
            const match = find(allAnnotations, a => a.annotation == annot)
            return {
              annotation: annot,
              number: match.number
            }
          })
          return country
        })

        cb(null)
      },
      function setTmpl (cb) {
        let annotations = ''
        allAnnotations.forEach(annot => {
          annotations += `<p style="font-size: small;"><sup>${annot.number})</sup>&nbsp;${annot.annotation}</p>`
        })
        foooterAnnotations.forEach(annot => {
          annotations += `<p style="font-size: small;">${annot}</p>`
        })
        tmpl = `
        <h4>${title}</h4>
        
        <table id="datatable${id}" class="display responsive no-wrap row-border cell-border stripe hover order-column" style="width: 100%;">
          <thead>
            <tr>
              <th>Land</th>
              <th>Antall</th>
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
              data: 'country',
              render: (data, type, row) => {
                if (type == 'display') {
                  let txt = data
                  row.annotations.forEach(annot => {
                    txt += `&nbsp;<span class="nrcstat-widget-tooltip" title="${annot.annotation}"><sup>${annot.number})</sup></span>`
                  })
                  return txt
                } else {
                  return data
                }
              }
            },
            {
              data: 'data',
              render: (data, type, row) => {
                if (type == 'display') return thousandsFormatter(data)
                else return data
              }
            }
          ],
          language: {
            url: `${LIB_URL}/assets/datatables_language.json`
          },
          responsive: true,
          searching: true,
          info: true,
          paging: tableData.length > 10,
          colReorder: true,
          fixedHeader: true
        })
        ft.on('draw.dt', () => initTooltipster())
        ft.on('responsive-display', () => initTooltipster())
        ft.rows.add(tableData).draw(false)
        ft.order([1, 'desc']).draw()
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
}
