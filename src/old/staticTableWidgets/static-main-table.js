import { populationNumberFormatter, percentFormatter, thousandsFormatter } from '@/util/tableWidgetFormatters.js'
import { API_URL, LIB_URL } from '@/config.js'
import { map, groupBy, find, findIndex, includes, each } from 'lodash'
const continentColorMap = require('../assets/continentColorMap.json')
const continentCodeNameMap = require('../assets/continentCodeNameMapNorwegian.json')
const countryCodeNameMap = require('../assets/countryCodeNameMapNorwegian.json')
const countryAnnotations = require('../assets/countryAnnotations.json')
const async = require('async')

const $ = require('jquery')

const tableTitle = 'HOVEDTABELL - MENNESKER PÅ FLUKT VERDEN OVER'

const tableDataPoints = ['totalRefugeesFromX', 'refugeesInXFromOtherCountriesInYear', 'idpsInXInYear',
  'newRefugeesFromXInYear', 'newRefugeesInXFromOtherCountriesInYear', 'newIdpsInXInYear', 'population',
  'percentageWomenFleeingToCountry', 'percentageChildrenFleeingToCountry']

const footerAnnotations = [
  'En strek indikerer at verdien er enten null eller ikke tilgjengelig.',
  'FOLKETALL - Kilde: United Nations Population Fund. Tall for 2016.',
  'NYE FLYKTNINGER TIL OG FRA - Nye flyktninger viser til personer som ble innvilget beskyttelse i 2016. I Europa og andre land med et fungerende asylsystem blir man anerkjent som flyktning når asylsøknaden er innvilget. Dette skjer ofte året etter asylankomsten. I mange utviklingsland blir de fleste anerkjent som flyktning umiddelbart ved ankomst på «prima facie» grunnlag uten en individuell asylprosess. Nye internt fordrevne gjelder fordrevne fra krig og konflikt. Noen av de nye internt fordrevne kan ha returnert innen årets slutt.',
  'TOTALT ANTALL MENNESKER FLYKTET TIL og TOTALT ANTALL MENNESKER FLYKTET FRA - Totalt antall mennesker som er på flukt ved utgangen av året, uavhengig av når man flyktet. Tallene inkluderer personer i en flyktningliknende situasjon, selv om deres flyktningstatus ikke formelt er avklart, samt asylsøkere som enda ikke har fått sin søknad endelig behandlet. Tallene for industriland er basert på antall asylsøkere som har fått opphold de siste ti årene. Kvoteflyktninger som industriland har tatt imot er ikke inkludert siden disse flyktningene har fått en varig løsning på sin flyktningsituasjon. De fleste flyktninger til utviklingsland regnes med i statistikken fram til de kan returnere. Kilder: FNs høykommissær for flyktninger (UNHCR) og FNs hjelpeorganisasjon for palestinske flyktninger (UNRWA).',
  'ANDEL KVINNER OG BARN - Det er ikke tilgjengelig informasjon fra alle land, og hvis andelen er særdeles lav (under 50%) er det ikke sikkert tallet er representativt for hele befolkningen. Kilde: FNs høykommissær for flyktninger (UNHCR).',
  'INTERNT FORDREVNE OG NYE INTERNT FORDREVNE - Kilde: Flyktninghjelpens senter for internt fordrevne (IDMC). For forklaring på de ulike anslagene, samt primærkilder, se www.internal-displacement.org. Tallene er fra inngangen til 2017 og omfatter bare mennesker som er fordrevet på grunn av krig og konflikt, og ikke mennesker som er rammet av naturkatastrofer.'
]

export default function (widgetObject, widgetData, targetSelector) {
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
  let currentData
  let ft
  let allAnnotations
  let allAnnotationsTxt = ''
  let allAnnotationsHtml = ''

  let continentSelector
  let countrySelector
  let pageSizeSelector

  let currentContinentCode
  let currentCountryCode

  async.waterfall([
    function setContainerWidth (cb) {
      // $(targetSelector).css("max-width", "600px")
      cb()
    },

    function loadData (cb) {
      var q = {
        where: { year: 2016, continentCode: { nin: ['WORLD'] } }
      }
      var urlQ = encodeURIComponent(JSON.stringify(q))

      $.get(`${API_URL}/datas?filter=${urlQ}`, function (data) {
        data = map(data, d => {
          if (!d.data) d.data = 0
          return d
        })
        data = groupBy(data, 'countryCode')
        data = map(data, (datas, countryCode) => {
          const country = {
            continentCode: datas[0].continentCode,
            countryCode: countryCode
          }
          tableDataPoints.forEach(dp => {
            const dataPoint = find(datas, data => data.dataPoint == dp)
            if (dataPoint && dataPoint.data) { country[dp] = dataPoint.data } else { country[dp] = 0 }
          })
          return country
        })
        data = map(data, d => {
          d.continent = continentCodeNameMap[d.continentCode]
          d.country = countryCodeNameMap[d.countryCode]
          return d
        })
        tableData = data
        currentData = data
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
      allAnnotations.forEach(annot => {
        allAnnotationsTxt += `${annot.number}) ${annot.annotation}\n`
        allAnnotationsHtml += `<p style="font-size: small;"><sup>${annot.number})</sup>&nbsp;${annot.annotation}</p>` + '\n'
      })
      footerAnnotations.forEach(annot => {
        allAnnotationsTxt += `${annot}\n`
        allAnnotationsHtml += `<p style="font-size: small;">${annot}</p>` + '\n'
      })

      tmpl = `
      <h4>${tableTitle}</h4>
      <div>
      <!--
        <div style="float: right; margin-bottom: 5px; display: inline-block;">
          <button class="btn-download">Last ned CSV-fil</button>
          <button class="btn-download">Last ned Excel-fil</button>
          <button class="btn-download">Last ned JSON-fil</button>
          <button class="btn-download">Skriv ut</button>
        </div>
        -->
        <div class="controls-wrapper">
          <div class="nrcstat-selector-continent">
            <label>Kontinent:</label>
              <select class="form-control continent-selector"><option value="">Alle</option></select>
          </div>
          <div class="nrcstat-selector-country">
            <label>Land:</label>
            <select class="form-control country-selector"><option value="">Alle</option></select>
          </div>
        </div>
      </div>
      <table id="datatable${id}" class="display responsive no-wrap row-border cell-border stripe hover order-column" style="width: 100%;">
        <thead>
          <tr>
            <th>Kontinent</th>
            <th>Land</th>
            <th>Totalt flyktninger fra</th>
            <th>Totalt flyktninger til</th>
            <th>Totalt internt fordrevne</th>
            <th>Nye flyktninger fra</th>
            <th>Nye flyktninger til</th>
            <th>Nye internt fordrevne</th>
            <th>Folketall</th>
            <th>Andel kvinner</th>
            <th>Andel barn</th>
          </tr>
        </thead>
      </table>
      <div class="nrcstat-table-widget-annotations">${allAnnotationsHtml}</div>
      `

      widgetEl = $(tmpl)
      widgetEl.appendTo($(targetSelector))

      continentSelector = widgetEl.find('.continent-selector')
      countrySelector = widgetEl.find('.country-selector')

      cb()
    },

    function setupTable (cb) {
      ft = $(`#datatable${id}`).DataTable({

        columns: [
          // Column 0: continent (Verdensdel)
          {
            data: 'continent'
          },
          // Column 1: country (Land)
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
          // Column 2: totalRefugeesFromX (Totalt flyktninger fra)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Totalt antall mennesker som har flyktet fra landet">Totalt flyktninger fra</span>',
            data: 'totalRefugeesFromX',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 3: refugeesInXFromOtherCountriesInYear (Totalt flyktninger til)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Totalt antall mennesker som har flyktet til landet">Totalt flyktninger til</span>',
            data: 'refugeesInXFromOtherCountriesInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 4: idpsInXInYear (Totalt internt fordrevne)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Totalt antall mennesker som har flyktet til landet">Totalt internt fordrevne</span>',
            data: 'idpsInXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 5: newRefugeesFromXInYear (Nye flyktninger fra)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Totalt antall Internt fordrevne personer i landet">Nye flyktninger fra</span></span>',
            data: 'newRefugeesFromXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 6: newRefugeesInXFromOtherCountriesInYear (Nye flyktninger til)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Antall nye flyktninger til landet i 2016">Nye flyktninger til</span>',
            data: 'newRefugeesInXFromOtherCountriesInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 7: newIdpsInXInYear (Nye internt fordrevne)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Antall nye internt fordrevne personer i landet i 2016">Nye internt fordrevne</span>',
            data: 'newIdpsInXInYear',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 8: population (Folketall)
          {
            data: 'population',
            render: (data, type, row) =>
              type == 'display' ? thousandsFormatter(data) : data
          },
          // Column 9: percentageWomenFleeingToCountry (Andel kvinner)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Andel kvinner blant mennesker som har flyktet til landet">Andel kvinner</span></span>',
            data: 'percentageWomenFleeingToCountry',
            render: (data, type, row) =>
              type == 'display' ? percentFormatter(data) : data
          },
          // Column 10: percentageChildrenFleeingToCountry (Andel barn)
          {
            title: '<span class="nrcstat-widget-tooltip" title="Andel barn blant mennesker som har flyktet til landet">Andel barn</span>',
            data: 'percentageChildrenFleeingToCountry',
            render: (data, type, row) =>
              type == 'display' ? percentFormatter(data) : data
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
        fixedHeader: true,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'csv',
            text: 'Last ned CSV-fil',
            title: tableTitle
          },
          {
            extend: 'excel',
            text: 'Last ned Excel-fil',
            title: tableTitle
          },
          {
            text: 'Last ned JSON-fil',
            action: function (e, dt, button, config) {
              var data = dt.buttons.exportData()

              $.fn.dataTable.fileSave(
                new Blob([JSON.stringify(data)]),
                  `${tableTitle}.json`
              )
            }
          },
          {
            extend: 'pdf',
            text: 'Skriv ut (PDF)',
            orientation: 'landscape',
            message: allAnnotationsTxt,
            title: tableTitle
          }
        ]
      })
      ft.on('draw.dt', () => initTooltipster())
      ft.on('responsive-display', () => initTooltipster())
      ft.rows.add(tableData).draw(false)
      ft.order([1, 'asc']).draw()
      cb()
    },
    function setupTooltips (cb) {
      initTooltipster()
      cb(null)
    },

    function setupSelectors (cb) {
      each(continentCodeNameMap, (v, k) => {
        continentSelector.append(`<option value="${k}">${v}</option>`)
      })
      each(countryCodeNameMap, (v, k) => {
        countrySelector.append(`<option value="${k}">${v}</option>`)
      })

      continentSelector.on('change', e => {
        currentContinentCode = e.target.value
        drawWidgetTableFilterData()
      })
      countrySelector.on('change', e => {
        currentCountryCode = e.target.value
        drawWidgetTableFilterData()
      })

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

  function drawWidgetTableFilterData () {
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
