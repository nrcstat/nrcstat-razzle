import nodeFetch from 'node-fetch'
import {
  percentFormatter,
  thousandsFormatter,
} from '@/util/tableWidgetFormatters.js'
import { API_URL } from '@/config.js'
import { map, groupBy, find, findIndex, includes, each } from 'lodash'
import { isServer } from '../../../util/utils'
const continentColorMap = require('./continentColorMap.json')
const async = require('async')

const CONTINENTS = ['AF', 'AS', 'EU', 'NA', 'OC', 'SA', 'MISC_AND_STATELESS']

const $ = require('jquery')

let fetch
if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const tableTitle = t(`RefugeeReport${periodYear + 1}.MainTable.Heading`)

  const countryAnnotations = (() => {
    switch (periodYear) {
      case 2019:
        return buildCountrySpecificFootnotes2019(t)
      case 2020:
        return buildCountrySpecificFootnotes2020(t)
      case 2021:
        return buildCountrySpecificFootnotes2021(t)
      case 2022:
        return buildCountrySpecificFootnotes2022(t)
    }
  })()

  const footerAnnotations = t(
    `RefugeeReport${periodYear + 1}.MainTable.TableFooterText`
  )

  const tableDataPoints = [
    'totalRefugeesFromX',
    'refugeesInXFromOtherCountriesInYear',
    'idpsInXInYear',
    'newRefugeesFromXInYear',
    'newRefugeesInXFromOtherCountriesInYear',
    'newIdpsInXInYear',
    'population',
    'percentageWomenFleeingToCountry',
    'percentageChildrenFleeingToCountry',
    'percentageWomenFleeingFromCountry',
    'percentageChildrenFleeingFromCountry',
    'resettlementRefugeesToXInYear',
  ]

  function loadWidgetData(_, headers = {}) {
    var q = {
      where: { year: periodYear, continentCode: { nin: ['WORLD'] } },
    }
    var urlQ = encodeURIComponent(JSON.stringify(q))

    const url = `${API_URL}/datas?filter=${urlQ}`
    return fetch(url, {
      headers: { nrcstatpassword: widgetParams.nrcstatpassword },
    }).then((resp) => resp.json())
  }

  function render(widgetObject, widgetData, targetSelector, languageObject) {
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
    let currentData
    let ft
    let allAnnotations
    const allAnnotationsHtml = ''

    let continentSelector
    let countrySelector
    let pageSizeSelector

    let currentContinentCode
    let currentCountryCode

    async.waterfall([
      function setContainerWidth(cb) {
        // $(targetSelector).css("max-width", "600px")
        cb()
      },

      async function loadData(cb) {
        let data
        if (widgetData) {
          data = widgetData
        } else {
          data = await loadWidgetData()
        }
        data = map(data, (d) => {
          if (!d.data) d.data = 0
          return d
        })
        data = groupBy(data, 'countryCode')
        data = map(data, (datas, countryCode) => {
          const country = {
            continentCode: datas[0].continentCode,
            countryCode: countryCode,
          }
          tableDataPoints.forEach((dp) => {
            const dataPoint = find(datas, (data) => data.dataPoint == dp)
            if (dataPoint && dataPoint.data) country[dp] = dataPoint.data
            else country[dp] = 0
          })
          return country
        })
        data = map(data, (d) => {
          d.continent = t(
            `NRC.Web.StaticTextDictionary.Continents.${d.continentCode}`
          )
          d.country = t(
            `NRC.Web.StaticTextDictionary.Contries.${d.countryCode}`
          )
          return d
        })
        tableData = data
        currentData = data
        cb(null)
      },
      function configureAnnotations(cb) {
        tableData = tableData.map((country) => {
          const countryCode = country.countryCode

          // Check if there is an annotation for this country. If so, add to the country object and annotations
          let annotationIndex = -1
          const annotations = []
          do {
            annotationIndex = findIndex(
              countryAnnotations,
              (annot) => includes(annot.countryCode, countryCode),
              annotationIndex + 1
            )
            if (annotationIndex !== -1) {
              annotations.push(countryAnnotations[annotationIndex].annotation)
            }
          } while (annotationIndex !== -1)

          country.annotations = annotations

          return country
        })

        allAnnotations = _(tableData)
          .map((row) => row.annotations)
          .flatten()
          .uniq()
          .map((v, i) => {
            return { number: i + 1, annotation: v }
          })
          .value()

        tableData = tableData.map((country) => {
          country.annotations = country.annotations.map((annot) => {
            const match = find(allAnnotations, (a) => a.annotation == annot)
            return {
              annotation: annot,
              number: match.number,
            }
          })
          return country
        })

        cb(null)
      },
      function setTmpl(cb) {
        let countrySpecificAnnotations = ''
        allAnnotations.forEach((annot) => {
          countrySpecificAnnotations +=
            `<sup>${annot.number})</sup>&nbsp;${annot.annotation}` + '\n\n'
        })

        tmpl = `
      <h4>${tableTitle}</h4>
        <div class="controls-wrapper">
          <label>${t('columnNames.continent')}:</label>
            <select class="continent-selector"><option value="">${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.CountryContientDropdown.all`
            )}</option></select>
          <label>${t('columnNames.country')}:</label>
          <select class="country-selector"><option value="">${t(
            `RefugeeReport${
              periodYear + 1
            }.MainTable.CountryContientDropdown.all`
          )}</option></select>
        </div>
      <table id="datatable${id}" class="display responsive no-wrap row-border cell-border stripe hover order-column" style="width: 100%;">
        <thead>
          <tr>
            <th></th>
            <th>${t('columnNames.continent')}</th>
            <th>${t('columnNames.country')}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesFrom.label`
            )}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesTo.label`
            )}</th>
            <th>${t(
              `RefugeeReport${periodYear + 1}.MainTable.Column.totalIdps.label`
            )}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesFrom.label`
            )}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesTo.label`
            )}</th>
            <th>${t(
              `RefugeeReport${periodYear + 1}.MainTable.Column.newIdps.label`
            )}</th>
            <th>${t(
              `RefugeeReport${periodYear + 1}.MainTable.Column.population.label`
            )}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageWomen.label`
            )}</th>
            <th>${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageChildren.label`
            )}</th>
            ${
              periodYear >= 2021
                ? `
               <th>${t(
                 `RefugeeReport${
                   periodYear + 1
                 }.MainTable.Column.resettlementRefugeesToXInYear.label`
               )}</th>
            `
                : ``
            }
          </tr>
        </thead>
      </table>
      <div class="nrcstat-table-widget-annotations">
        <div class="accordion accordion-closed">
          <div class="accordion-title" style="font-size: 16px; color: #474747; font-family: Roboto; font-weight: 200; cursor: pointer;"><i class="fa fa-plus-square-o" style="color: #FD5A00;"></i>&nbsp;${t(
            `RefugeeReport${
              periodYear + 1
            }.MainTable.Footnotes.Title.countrySpecificNotes`
          )}</div>
          <div class="accordion-body" style="font-size: 12px; color: #474747; white-space: pre-line;">
            ${countrySpecificAnnotations}
          </div>
        </div>
        <div class="accordion accordion-closed">
          <div class="accordion-title" style="font-size: 16px; color: #474747; font-family: Roboto; font-weight: 200; cursor: pointer;"><i class="fa fa-plus-square-o" style="color: #FD5A00;"></i>&nbsp;${t(
            `RefugeeReport${
              periodYear + 1
            }.MainTable.Footnotes.Title.generalNotes`
          )}</div>
          <div class="accordion-body" style="font-size: 12px; color: #474747; white-space: pre-line;">
            ${footerAnnotations}
          </div>
        </div
      </div>
      `

        widgetEl = $(tmpl)
        widgetEl.appendTo($(targetSelector))

        $(targetSelector)
          .find('.accordion-title')
          .on('click', function () {
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

        continentSelector = widgetEl.find('.continent-selector')
        countrySelector = widgetEl.find('.country-selector')

        cb()
      },

      function setupTable(cb) {
        const columns = [
          { data: () => '' },
          // Column 0: continent (Verdensdel)
          {
            data: 'continent',
          },
          // Column 1: country (Land)
          {
            data: 'country',
            render: (data, type, row) => {
              if (type == 'display') {
                let txt = data
                row.annotations.forEach((annot) => {
                  txt += `&nbsp;<span class="nrcstat-widget-tooltip" title="${annot.annotation}"><sup>${annot.number})</sup></span>`
                })
                return txt
              } else {
                return data
              }
            },
          },
          // Column 2: totalRefugeesFromX (Totalt flyktninger fra)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesFrom.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesFrom.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'totalRefugeesFromX',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 3: refugeesInXFromOtherCountriesInYear (Totalt flyktninger til)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesTo.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalRefugeesTo.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'refugeesInXFromOtherCountriesInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 4: idpsInXInYear (Totalt internt fordrevne)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${periodYear + 1}.MainTable.Column.totalIdps.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.totalIdps.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'idpsInXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 5: newRefugeesFromXInYear (Nye flyktninger fra)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesFrom.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesFrom.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'newRefugeesFromXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 6: newRefugeesInXFromOtherCountriesInYear (Nye flyktninger til)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesTo.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newRefugeesTo.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'newRefugeesInXFromOtherCountriesInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 7: newIdpsInXInYear (Nye internt fordrevne)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${periodYear + 1}.MainTable.Column.newIdps.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.newIdps.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'newIdpsInXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 8: population (Folketall)
          {
            data: 'population',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          },
          // Column 9: percentageWomenFleeingToCountry (Andel kvinner)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageWomen.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageWomen.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data:
              periodYear < 2021
                ? 'percentageWomenFleeingToCountry'
                : 'percentageWomenFleeingFromCountry',
            render: (data, type, row) =>
              type == 'display' ? percentFormatter(locale)(data) : data,
          },
          // Column 10: percentageChildrenFleeingToCountry (Andel barn)
          {
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageChildren.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.percentageChildren.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data:
              periodYear < 2021
                ? 'percentageChildrenFleeingToCountry'
                : 'percentageChildrenFleeingFromCountry',
            render: (data, type, row) =>
              type == 'display' ? percentFormatter(locale)(data) : data,
          },
        ]
        if (periodYear >= 2021) {
          columns.push({
            // Column 11: resettlementRefugeesToXInYear (Kvoteflyktninger til)
            title: `<span class="nrcstat-tablewidget-header" >${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.resettlementRefugeesToXInYear.label`
            )}</span><span class="nrcstat-widget-tooltip" title="${t(
              `RefugeeReport${
                periodYear + 1
              }.MainTable.Column.resettlementRefugeesToXInYear.hoverText`
            )}"><i class="fa fa-info-circle" aria-hidden="true"></i></span>`,
            data: 'resettlementRefugeesToXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(locale)(data) : data,
          })
        }
        ft = $(`#datatable${id}`).DataTable({
          columns,
          language: languageObject,

          responsive: {
            details: {
              type: 'column',
            },
          },
          columnDefs: [
            {
              className: 'control',
              orderable: false,
              targets: 0,
            },
          ],
          order: [1, 'asc'],
          searching: true,
          info: true,
          paging: tableData.length > 10,
          lengthMenu: [10, 25, 50, 100, 250],
          // colReorder: true, // Disabled on 29 Sep 2021 due to strange error message coming out of nowhere.
          fixedHeader: true,
          dom: 'Blfrtip',
          buttons: [
            {
              extend: 'excel',
              text: t(
                `RefugeeReport${
                  periodYear + 1
                }.MainTable.Actions.dowloadExcelFile`
              ),
              title: tableTitle,
            },
            {
              text: t(
                `RefugeeReport${
                  periodYear + 1
                }.MainTable.Actions.dowloadJsonFile`
              ),
              action: function (e, dt, button, config) {
                var data = dt.buttons.exportData()

                $.fn.dataTable.fileSave(
                  new Blob([JSON.stringify(data)]),
                  `${tableTitle}.json`
                )
              },
            },
          ],
        })
        ft.on('draw.dt', () => initTooltipster())
        ft.on('responsive-display', () => initTooltipster())
        ft.rows.add(tableData).draw(false)
        ft.order([2, 'asc']).draw()
        cb()
      },
      function setupTooltips(cb) {
        initTooltipster()
        cb(null)
      },

      function setupSelectors(cb) {
        CONTINENTS.forEach((k) => {
          continentSelector.append(
            `<option value="${k}">${t(
              `NRC.Web.StaticTextDictionary.Continents.${k}`
            )}</option>`
          )
        })
        tableData
          .map((d) => d.countryCode)
          .forEach((iso2) => {
            countrySelector.append(
              `<option value="${iso2}">${t(
                `NRC.Web.StaticTextDictionary.Contries.${iso2}`
              )}</option>`
            )
          })

        continentSelector.on('change', (e) => {
          currentContinentCode = e.target.value
          drawWidgetTableFilterData()
        })
        countrySelector.on('change', (e) => {
          currentCountryCode = e.target.value
          drawWidgetTableFilterData()
        })

        cb(null)
      },
    ])

    function initTooltipster() {
      target.find('.nrcstat-widget-tooltip').tooltipster({
        interactive: true,
        delay: 100,
        animation: 'fade',
        maxWidth: 300,
      })
    }

    function drawWidgetTableFilterData() {
      currentData = tableData.filter((v) => {
        if (!currentContinentCode) return true
        return v.continentCode == currentContinentCode
      })
      currentData = currentData.filter((v) => {
        if (!currentCountryCode) return true
        return v.countryCode == currentCountryCode
      })
      ft.clear()
      ft.rows.add(currentData).draw(false)
    }
  }

  return {
    loadWidgetData,
    render,
  }
}

export function buildCountrySpecificFootnotes2019(t) {
  return [
    {
      countryCode: ['DZ', 'EH'],
      annotation: t(
        `RefugeeReport2020.CountrySpecificFootnote.AlgerieWesternSahara`
      ),
    },
    {
      countryCode: ['AU'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.Australia`),
    },

    {
      countryCode: ['BD', 'MM'],
      annotation: t(
        `RefugeeReport2020.CountrySpecificFootnote.BangladeshMyanmar`
      ),
    },

    {
      countryCode: ['IQ', 'SY', 'JO'],
      annotation: t(
        `RefugeeReport2020.CountrySpecificFootnote.IraqJordanSyria`
      ),
    },

    {
      countryCode: ['JP'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.Japan`),
    },

    {
      countryCode: ['CN', 'VN'],
      annotation: t(`RefugeeReport.2020CountrySpecificFootnote.ChinaVietnam`),
    },

    {
      countryCode: ['JO', 'LB', 'PS', 'SY'],
      annotation: t(
        `RefugeeReport2020.CountrySpecificFootnote.JordanLebanonPalestineSyria`
      ),
    },
    {
      countryCode: ['KO', 'RS'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.KosovoSerbia`),
    },

    {
      countryCode: ['ZA'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.SouthAfrica`),
    },

    {
      countryCode: ['TR'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.Turkey`),
    },

    {
      countryCode: [
        'VE',
        'AW',
        'BR',
        'CL',
        'CO',
        'CW',
        'DO',
        'EC',
        'GY',
        'MX',
        'PA',
        'PY',
        'PE',
        'TT',
        'UY',
      ],
      annotation: t(
        `RefugeeReport2020.CountrySpecificFootnote.ArubaBrazilChileColombiaCuracaoDominicanRepublicEcuadorGuyanaMexicoPanamaParaguayPeruTrinidadTobagoUruguayVenezuela`
      ),
    },

    {
      countryCode: ['US'],
      annotation: t(`RefugeeReport2020.CountrySpecificFootnote.USA`),
    },
  ]
}

export function buildCountrySpecificFootnotes2020(t) {
  return [
    {
      countryCode: ['DZ', 'EH'],
      annotation: t(
        'RefugeeReport2021.CountrySpecificFootnote.AlgerieWesternSahara'
      ),
    },
    {
      countryCode: ['AU'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.Australia'),
    },
    {
      countryCode: ['IQ', 'SY', 'JO'],
      annotation: t(
        'RefugeeReport2021.CountrySpecificFootnote.IraqJordanSyria'
      ),
    },

    {
      countryCode: ['JP'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.Japan'),
    },

    {
      countryCode: ['CN', 'VN'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.ChinaVietnam'),
    },

    {
      countryCode: ['JO', 'LB', 'PS', 'SY'],
      annotation: t(
        'RefugeeReport2021.CountrySpecificFootnote.JordanLebanonPalestineSyria'
      ),
    },
    {
      countryCode: ['KO', 'RS'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.KosovoSerbia'),
    },
    {
      countryCode: ['TR'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.Turkey'),
    },

    {
      countryCode: [
        'VE',
        'AW',
        'BR',
        'CL',
        'CO',
        'CW',
        'DO',
        'EC',
        'GY',
        'MX',
        'PA',
        'PY',
        'PE',
        'TT',
        'UY',
      ],
      annotation: t(
        'RefugeeReport2021.CountrySpecificFootnote.ArubaBrazilChileColombiaCuracaoDominicanRepublicEcuadorGuyanaMexicoPanamaParaguayPeruTrinidadTobagoUruguayVenezuela'
      ),
    },
    {
      countryCode: ['US'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.USA'),
    },

    // Two new ones added for RefRep 2021, i.e.numbers for 2020:
    {
      countryCode: ['AM'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.Armenia'),
    },
    {
      countryCode: ['AZ'],
      annotation: t('RefugeeReport2021.CountrySpecificFootnote.Azerbaijan'),
    },
  ]
}

export function buildCountrySpecificFootnotes2021(t) {
  return [
    // All the upcoming eight footnotes were kept from the previous year
    {
      countryCode: ['DZ', 'EH'],
      annotation: t(
        'RefugeeReport2022.CountrySpecificFootnote.AlgerieWesternSahara'
      ),
    },
    {
      countryCode: ['AU'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.Australia'),
    },
    {
      countryCode: ['IQ', 'SY', 'JO'],
      annotation: t(
        'RefugeeReport2022.CountrySpecificFootnote.IraqJordanSyria'
      ),
    },
    {
      countryCode: ['CN', 'VN'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.ChinaVietnam'),
    },
    {
      countryCode: ['JO', 'LB', 'PS', 'SY'],
      annotation: t(
        'RefugeeReport2022.CountrySpecificFootnote.JordanLebanonPalestineSyria'
      ),
    },
    {
      countryCode: ['KO', 'RS'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.KosovoSerbia'),
    },
    {
      countryCode: [
        'VE',
        'AW',
        'BR',
        'CL',
        'CO',
        'CW',
        'DO',
        'EC',
        'GY',
        'MX',
        'PA',
        'PY',
        'PE',
        'TT',
        'UY',
      ],
      annotation: t(
        'RefugeeReport2022.CountrySpecificFootnote.ArubaBrazilChileColombiaCuracaoDominicanRepublicEcuadorGuyanaMexicoPanamaParaguayPeruTrinidadTobagoUruguayVenezuela'
      ),
    },
    {
      countryCode: ['US'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.USA'),
    },

    // All the below are new footnotes for this year
    {
      countryCode: ['AO'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.Angola'),
    },
    {
      countryCode: ['BG'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.Bulgaria'),
    },
    {
      countryCode: ['CA'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.Canada'),
    },
    {
      countryCode: ['ZA'],
      annotation: t('RefugeeReport2022.CountrySpecificFootnote.SouthAfrica'),
    },
  ]
}

export function buildCountrySpecificFootnotes2022(t) {
  return [
    // The six first footnotes are the same as last year. The next two are brand new.
    {
      countryCode: ['DZ', 'EH'],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.AlgerieWesternSahara'
      ),
    },
    {
      countryCode: ['IQ', 'SY', 'JO'],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.IraqJordanSyria'
      ),
    },
    {
      countryCode: ['JO', 'LB', 'PS', 'SY'],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.JordanLebanonPalestineSyria'
      ),
    },
    {
      countryCode: ['KO', 'RS'],
      annotation: t('RefugeeReport2023.CountrySpecificFootnote.KosovoSerbia'),
    },
    {
      countryCode: [
        'VE',
        'AW',
        'BR',
        'CL',
        'CO',
        'CW',
        'DO',
        'EC',
        'GY',
        'MX',
        'PA',
        'PY',
        'PE',
        'TT',
        'UY',
      ],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.ArubaBrazilChileColombiaCuracaoDominicanRepublicEcuadorGuyanaMexicoPanamaParaguayPeruTrinidadTobagoUruguayVenezuela'
      ),
    },
    {
      countryCode: ['US'],
      annotation: t('RefugeeReport2023.CountrySpecificFootnote.USA'),
    },
    // New ones
    {
      countryCode: ['AF', 'IR'],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.AfghanistanIran'
      ),
    },
    {
      countryCode: ['UA', 'RU', 'GB', 'MD', 'DE'],
      annotation: t(
        'RefugeeReport2023.CountrySpecificFootnote.UkraineRussiaUnitedkingdomMoldovaGermany'
      ),
    },
  ]
}
