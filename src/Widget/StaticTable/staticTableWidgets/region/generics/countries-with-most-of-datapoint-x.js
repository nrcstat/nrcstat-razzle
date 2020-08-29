import nodeFetch from 'node-fetch'
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'
import { API_URL } from '@/config.js'
import { map, filter, findIndex, includes, find } from 'lodash'
import { isServer } from '../../../../../util/utils'
import { buildCountrySpecificFootnotes2019 } from '../../static-main-table'
const async = require('async')

const $ = require('jquery')

let fetch
if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export default function (dataPointX, regionCodeNRC, countryLimit, title, foooterAnnotations, widgetParams) {
  if (typeof regionCodeNRC === 'string') regionCodeNRC = [regionCodeNRC]

  const { t, periodYear, locale } = widgetParams

  const countryAnnotations = buildCountrySpecificFootnotes2019(t)

  function loadWidgetData () {
    var q = {
      where: { year: periodYear, dataPoint: dataPointX, regionCodeNRC: { inq: regionCodeNRC } },
      limit: countryLimit,
      order: 'data DESC'
    }
    var urlQ = encodeURIComponent(JSON.stringify(q))
    const url = `${API_URL}/datas?filter=${urlQ}`
    return fetch(url)
      .then(resp => resp.json())
  }

  function render (widgetObject, widgetData, targetSelector, languageObject) {
    const wObject = widgetObject
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
        let data
        if (widgetData) {
          data = widgetData
        } else {
          data = await loadWidgetData()
        }
        data = map(data, (v) => {
          return {
            countryCode: v.countryCode,
            data: v.data
          }
        })
        data = map(data, d => {
          d.country = t(`NRC.Web.StaticTextDictionary.Contries.${d.countryCode}`)
          return d
        })
        data = filter(data, d => d.data != null)
        data = filter(data, d => d.data != 0)
        tableData = data
        cb(null)
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
        annotations += foooterAnnotations
        tmpl = `
        <h4>${title}</h4>
        
        <table id="datatable${id}" class="display responsive no-wrap row-border cell-border stripe hover order-column" style="width: 100%;">
          <thead>
            <tr>
              <th></th>
              <th>Land</th>
              <th>Antall</th>
            </tr>
          </thead>
        </table>

        <div class="nrcstat-table-widget-annotations">
          <div class="accordion accordion-closed">
            <div class="accordion-title" style="font-size: 16px; color: #474747; font-family: Roboto; font-weight: 200; cursor: pointer;"><i class="fa fa-plus-square-o" style="color: #ff7602;"></i>&nbsp;${t('footnotes.title')}</div>
            <div class="accordion-body" style="font-size: 12px; color: #474747; white-space: pre-line;">
              ${annotations}
            </div>
          </div>
        </div>

        `
        widgetEl = $(tmpl)
        widgetEl.appendTo($(targetSelector))

        $(targetSelector).find('.accordion-title').on('click', function () {
          const accordionEl = $(this).parents('.accordion')
          const isClosed = accordionEl.hasClass('accordion-closed')
          if (isClosed) {
            accordionEl.removeClass('accordion-closed')
            accordionEl.addClass('accordion-open')
            accordionEl.find('.fa').removeClass('fa-plus-square-o')
            accordionEl.find('.fa').addClass('fa-minus-square-o')
          } else {
            accordionEl.addClass('accordion-closed')
            accordionEl.removeClass('accordion-open')
            accordionEl.find('.fa').addClass('fa-plus-square-o')
            accordionEl.find('.fa').removeClass('fa-minus-square-o')
          }
        })

        cb()
      },
      function setupTable (cb) {
        ft = $(`#datatable${id}`).DataTable({
          columns: [
            { data: () => '' },
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
                if (type == 'display') return thousandsFormatter(locale)(data)
                else return data
              }
            }
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
          colReorder: true,
          fixedHeader: true
        })
        ft.on('draw.dt', () => initTooltipster())
        ft.on('responsive-display', () => initTooltipster())
        ft.rows.add(tableData).draw(false)
        ft.order([2, 'desc']).draw()
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
