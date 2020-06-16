import React, { useRef, useContext, useCallback, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import loadable from '@loadable/component'

import {
  includes,
  find,
  map as _map,
  map,
  groupBy,
  mapValues,
  keyBy,
  last,
  chain,
  clone,
  isNull
} from 'lodash'

import './CountryDashboard.scss'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { isClient, isServer } from '../../util/utils'
import { API_URL } from '../../config'

import {
  formatDataNumber,
  formatDataPercentage,
  formatNumber,
  isMobileDevice
} from '@/util/widgetHelpers.js'

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  CircularGridLines,
  MarkSeries,
  ArcSeries,
  VerticalGridLines,
  LabelSeries
} from 'react-vis'

import 'react-vis/dist/style.css'
import norwegianCountryNames from '@/Widget/StaticTable/staticTableWidgets/countryCodeNameMapNorwegian.json'
import horizontalBarBaseImg from './dashboard-horizontal-bar-base.png'
import middleResolutionCountriesGeoJson from '@/Widget/assets/json/ne_110m_admin_0_countries.json'
import gazaGeoJson from '@/Widget/assets/json/gaza.json'

import centroidsRaw from '@/Widget/assets/json/geo_entities_updated_manually'

middleResolutionCountriesGeoJson.features.push(gazaGeoJson.features[0])

// TODO: switch to 2019
const YEAR_TO_SHOW_IN_RADIAL_BAR_CHART = 2019

const req = require.context('../assets/flags', false)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const flagImagesMap = chain(
  req.keys().map(file => ({
    file: req(file),
    countryCode: last(file.split('/'))
      .split('.')[0]
      .toUpperCase()
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

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

const Mapboxgl = loadable.lib(() => import('mapbox-gl/dist/mapbox-gl.js'), { ssr: false })

function Loader () {
  return (
    <Mapboxgl>
      {({ default: mapboxgl }) => <CountryDashboard mapboxgl={mapboxgl} />}
    </Mapboxgl>
  )
}

export default Loader

function CountryDashboard ({ mapboxgl }) {
  // TODO: fix to use proper SSR as far as possible
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, year, dataPoints, showMap, containerRef } = widgetParams
  const t = getNsFixedT(['Widget.Static.CountryDashboard', 'GeographicalNames'])

  const leonardoCentroid = getCountryCentroid(countryCode)
  const leonardoBoundingBox = leonardoCentroid.boundingbox

  useEffect(() => {
    const targetSelector = containerRef.current

    clearWidgetContainer()
    const { dataBlock, mapBlock } = drawWidgetContainer()

    configureMapboxAccessToken(mapboxgl)
    const map = initializeMap(mapBlock, [0, 0], mapboxgl)
    const mapLoaded = () =>
      new Promise(resolve => map.on('load', () => resolve()))

    const yalla = () => new Promise(resolve => setTimeout(() => resolve(), 1000))

    Promise.all([fetchData(countryCode), mapLoaded(), yalla()]).then(([data]) => {
      drawDataBlock(dataBlock, data, t)
      drawMapBlock(
        mapBlock,
        data.filter(d => d.year === YEAR_TO_SHOW_IN_RADIAL_BAR_CHART)
      )
    })

    function clearWidgetContainer () {
      $(targetSelector).empty()
    }

    function drawWidgetContainer () {
      $(targetSelector).addClass('nrcstat-country-dashboard')

      // ZERO OUT css written by EpiServer
      $(targetSelector).css({
        width: '100%',
        height: 'auto',
        display: 'inline-block'
      })
      $(targetSelector)
        .parent('.nrcstat__rootwidget')
        .css({
          width: '100%',
          height: 'auto',
          display: 'inline-block'
        })
      $(targetSelector)
        .parents('.nrcstat-block')
        .css({
          display: 'table'
        })

      $(targetSelector).html(
      `
      <div class="nrcstat-country-dashboard-wrapper">
        <div class="nrcstat-country-dashboard-data-block">
          <div class="nrcstat-country-dashboard-data-block__inner"></div>
        </div>
        <div class="nrcstat-country-dashboard-map-block">
          <div class="nrcstat-country-dashboard-map-block__map-container">
            <div class="nrcstat-country-dashboard-map-block__mapbox"></div>
            <div class="nrcstat-country-dsahboard-map-block__source">${t('radialBarChart.sources')}</div>
          </div>
        </div>
      </div>`
      )
      const dataBlock = $(targetSelector).find(
        '.nrcstat-country-dashboard-data-block__inner'
      )
      const mapBlock = $(targetSelector).find(
        '.nrcstat-country-dashboard-map-block'
      )

      return { dataBlock, mapBlock }
    }

    function drawDataBlock (dataBlock, data, t) {
      ReactDOM.render(
        <Dashboard
          countryCode={countryCode}
          data={data}
          dataPointsToShow={dataPoints}
          onAfterRender={() => map.resize()}
          t={t}
        />,
        dataBlock[0]
      )
    }

    function drawMapBlock (mapBlock, data) {
      const boundingBox = leonardoCentroid.boundingbox
      const [west, south, east, north] = boundingBox
      const fitBounds_bounds = [[south, west], [north, east]]
      const fitBounds_config = { padding: 15 }

      const somethingWonderful = map.cameraForBounds(
        fitBounds_bounds,
        fitBounds_config
      )

      map.fitBounds(fitBounds_bounds, fitBounds_config)

      map.on('resize', () => map.fitBounds(fitBounds_bounds, fitBounds_config))

      const el = document.createElement('div')
      el.className = 'nrcstat-radial-bar-chart'

      new mapboxgl.Marker(el)
        .setLngLat(somethingWonderful.center.toArray())
        .addTo(map)

      ReactDOM.render(
        <RadialBarChart data={Object.values(dataTransformer(t)(data))[0]} />,
        el
      )

      const singleCountry = clone(middleResolutionCountriesGeoJson)
      singleCountry.features = singleCountry.features.filter(
        c =>
          c.properties &&
        c.properties.iso_a2 &&
        c.properties.iso_a2.toUpperCase() === countryCode.toUpperCase()
      )

      map.addSource('highlight-individual-country', {
        type: 'geojson',
        data: singleCountry
      })

      map.addLayer({
        id: 'countries-highlighted',
        type: 'fill',
        source: 'highlight-individual-country',
        paint: {
          'fill-opacity': 1
        },
        paint: { 'fill-color': '#d4d4d4' }
      })

      map.addSource('radial-chart-title-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                countryLabel: t('radialBarChart.belowChart.line1')
              },
              geometry: {
                type: 'Point',
                coordinates: somethingWonderful.center.toArray()
              }
            }
          ]
        }
      })
      map.addLayer({
        id: 'radial-chart-title',
        type: 'symbol',
        source: 'radial-chart-title-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Roboto Condensed'],
          'text-max-width': 50,
          'text-size': 25,
          'text-line-height': 1,
          'text-offset': [0, 6.5]
        }
      })
      map.addSource('radial-chart-subtitle-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                countryLabel: t('radialBarChart.belowChart.line2')
              },
              geometry: {
                type: 'Point',
                coordinates: somethingWonderful.center.toArray()
              }
            }
          ]
        }
      })
      map.addLayer({
        id: 'radial-chart-subtitle',
        type: 'symbol',
        source: 'radial-chart-subtitle-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Roboto Condensed'],
          'text-max-width': 50,
          'text-size': 15,
          'text-line-height': 1,
          'text-offset': [0, 12.5]
        }
      })

      // $(mapBlock).css('position', 'relative');
      // $(mapBlock).css('overflow', 'hidden');

      moveMapboxLogo(mapBlock)

      map.on('click', function (event) {
        hideTooltip()
        var selectedCountry = event.features[0].properties

        if (mobileLegendActive || mobileShareMenuActive) {
          $(targetSelector)
            .find('.legend-container')
            .css('display', 'none')
          $(targetSelector)
            .find('#legend-button')
            .removeClass('legend-button-closed legend-button-open')
            .addClass('legend-button-closed')
          setLegendState(targetSelector)
          $(targetSelector)
            .find('.share-menu-container')
            .css('display', 'none')
          setShareMenuState(targetSelector)
          isCountryInfoPopupOrPopoverActive = false
        } else {
        // insert Kosovo country code (has "name" but no "iso_a2" in natural earth data)
          if (selectedCountry.name == 'Kosovo') {
            selectedCountry.iso_a2 = 'KO'
          }

          // countries without iso2 code in naturalearth data have value -99 instead
          if (countryInfo__hasData(selectedCountry.iso_a2)) {
            if (isMobileDevice() && selectedCountry.iso_a2 != -99) {
              isCountryInfoPopupOrPopoverActive = true
              countryInfo__showPopover(targetSelector, event)
            } else if (selectedCountry.iso_a2 != -99) {
              isCountryInfoPopupOrPopoverActive = true
              countryInfo__showPopup(event, map)
            }
          }
        }
      })

      // event listener for closing legend and share menu by clicking on the non-country (e.g. sea)
      map.on('click', function (event) {
        hideTooltip()
        if (mobileLegendActive || mobileShareMenuActive) {
          $(targetSelector)
            .find('.legend-container')
            .css('display', 'none')
          $(targetSelector)
            .find('#legend-button')
            .removeClass('legend-button-closed legend-button-open')
            .addClass('legend-button-closed')
          setLegendState(targetSelector)
          $(targetSelector)
            .find('.share-menu-container')
            .css('display', 'none')
          setShareMenuState(targetSelector)
          isCountryInfoPopupOrPopoverActive = false
        }
      })

      const hoverPopup = $(`
    <div class="global-displacement-radial-bar-chart-tooltip">
      <div class="top">2019.</div>
      <div class="data"></div>
    </div>`)
      $('body').append(hoverPopup)
      const showTooltip = countryCode => e => {
        if (isCountryInfoPopupOrPopoverActive) return
        const dataHtml = [
          {
            color: 'rgba(114,199,231,0.72)',
            data: getCountryStat(
              countryCode,
              'idpsInXInYear',
              YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
            ).data
          },
          {
            color: 'rgba(255,121,0,0.72)',
            data: getCountryStat(
              countryCode,
              'totalRefugeesFromX',
              YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
            ).data
          },
          {
            color: 'rgba(253,200,47,0.72)',
            data: getCountryStat(
              countryCode,
              'newRefugeesInXFromOtherCountriesInYear',
              YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
            ).data
          }
        ]
          .sort((a, b) => b.data - a.data)
          .map(d => {
            return { ...d, data: formatDataNumber(d.data, 'nb-NO') }
          })
          .map(
            d =>
            `<div class="line"><div class="dot" style="background-color: ${
              d.color
            }"></div>${d.data}</div></div>`
          )
          .join('\n')
        hoverPopup.children('.data').html(dataHtml)

        const newCss = {
          display: 'block',
          left:
          e.pageX + hoverPopup[0].clientWidth + 10 < document.body.clientWidth
            ? e.pageX + 10 + 'px'
            : document.body.clientWidth + 5 - hoverPopup[0].clientWidth + 'px',
          top:
          e.pageY + hoverPopup[0].clientHeight + 10 < document.body.clientHeight
            ? e.pageY + 10 + 'px'
            : document.body.clientHeight +
              5 -
              hoverPopup[0].clientHeight +
              'px'
        }
        hoverPopup.css(newCss)
      }
      function hideTooltip (e) {
        hoverPopup.css({ display: 'none' })
      }
    }

    // made popup global variable to be able to access it from setPassiveMode (needs to be removed before deactivating the map) - not sure it's a best solution??
    var countryInfo__mapboxPopup
    var mapNavigationControl
    var mobileLegendActive = false
    var mobileShareMenuActive = false
    let isCountryInfoPopupOrPopoverActive = false

    addLegend(targetSelector)
  }, [])

  return null
}

function Dashboard ({ data, countryCode, dataPointsToShow, onAfterRender, t }) {
  const [leftColSelectedOption, setLeftColSelectedOption] = useState('total')
  const [rightColSelectedOption, setRightColSelectedOption] = useState(
    String(YEAR_TO_SHOW_IN_RADIAL_BAR_CHART)
  )
  useEffect(() => {
    onAfterRender()
  })

  const COL_SELECT_OPTIONS = [
    {
      label: t('yearPicker.total'),
      value: 'total'
    },
    {
      label: '2016',
      value: '2016'
    },
    {
      label: '2017',
      value: '2017'
    },
    {
      label: '2018',
      value: '2018'
    },
    {
      label: '2019',
      value: '2019'
    }
    // TODO: configure for next year
  ]
  const TABLE_ROWS = [
    {
      label: (options) => t('dataPoint.refugeesFromCountry', options),
      totalDataPoint: 'totalRefugeesFromX',
      newInYearXDataPoint: 'newRefugeesFromXInYear'
    },
    {
      label: (options) => t('dataPoint.refugeesToCountry', options),
      totalDataPoint: 'refugeesInXFromOtherCountriesInYear',
      newInYearXDataPoint: 'newRefugeesInXFromOtherCountriesInYear'
    },
    {
      label: (options) => t('dataPoint.idpsInCountry', options),
      totalDataPoint: 'idpsInXInYear',
      newInYearXDataPoint: 'newIdpsInXInYear'
    },
    {
      label: (options) => t('dataPoint.voluntaryReturnsToCountry', options),
      totalDataPoint: null,
      newInYearXDataPoint: 'voluntaryReturnsToXInYear'
    },
    {
      label: (options) => t('dataPoint.asylumSeekersFromCountryToNorway', options),
      totalDataPoint: null,
      newInYearXDataPoint: 'asylumSeekersFromXToNorwayInYear'
    }
  ]
  const DATA_POINT_POPULATION = 'population'
  const DATA_POINT_PERCENTAGE_CHILDREN_FLEEING_TO_COUNTRY =
    'percentageChildrenFleeingToCountry'
  const DATA_POINT_PERCENTAGE_WOMEN_FLEEING_TO_COUNTRY =
    'percentageWomenFleeingToCountry'

  const tableRows = TABLE_ROWS.filter(
    row =>
      dataPointsToShow.includes(row.totalDataPoint) ||
      dataPointsToShow.includes(row.newInYearXDataPoint)
  ).map(row => {
    const leftColStat = getCountryStat(
      data,
      countryCode,
      leftColSelectedOption === 'total'
        ? row.totalDataPoint
        : row.newInYearXDataPoint,
      leftColSelectedOption === 'total'
        ? YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
        : parseInt(leftColSelectedOption)
    )
    const rightColStat = getCountryStat(
      data,
      countryCode,
      rightColSelectedOption === 'total'
        ? row.totalDataPoint
        : row.newInYearXDataPoint,
      rightColSelectedOption === 'total'
        ? YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
        : parseInt(rightColSelectedOption)
    )

    return (
      <tr>
        <td>
          {row.label({ countryName: t(`NRC.Web.StaticTextDictionary.Contries.${countryCode}`) })}
        </td>
        <td className='data-cell'>
          {formatDataNumber(
            leftColStat ? leftColStat.data : null,
            'nb-NO',
            true
          )}
        </td>
        <td className='data-cell'>
          {formatDataNumber(
            rightColStat ? rightColStat.data : null,
            'nb-NO',
            true
          )}
        </td>
      </tr>
    )
  })

  const population = getCountryStat(
    data,
    countryCode,
    DATA_POINT_POPULATION,
    YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
  ).data

  const dataPoint_percentageWomenFleeingToCountry = getCountryStat(
    data,
    countryCode,
    DATA_POINT_PERCENTAGE_WOMEN_FLEEING_TO_COUNTRY,
    YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
  )
  const dataPoint_percentageChildrenFleeingToCountry = getCountryStat(
    data,
    countryCode,
    DATA_POINT_PERCENTAGE_CHILDREN_FLEEING_TO_COUNTRY,
    YEAR_TO_SHOW_IN_RADIAL_BAR_CHART
  )

  return (
    <>
      <img
        src={flagImagesMap[countryCode]}
        style={{ height: '2.4em', float: 'right', border: '1px solid #d4d4d4' }}
      />
      <p
        style={{
          margin: 0,
          padding: 0,
          color: '#ff7602',
          fontFamily: "'Roboto Condensed'",
          fontSize: '2em'
        }}
      >
        {t(`NRC.Web.StaticTextDictionary.Contries.${countryCode}`)}
      </p>
      {dataPointsToShow.includes(DATA_POINT_POPULATION) && (
        <p
          style={{
            margin: '0.2em 0 0 0',
            padding: 0,
            color: '#666666',
            fontFamily: "'Roboto Condensed'",
            fontSize: '1em'
          }}
        >
          {t('population', { populationInMillions: population })}
        </p>
      )}
      {tableRows.length > 0 && (
        <table className='main-data-table' style={{ marginTop: '2.5em' }}>
          <tbody>
            <tr>
              <td />
              <td className='data-header-cell'>
                <select
                  className='option-select'
                  onChange={e => setLeftColSelectedOption(e.target.value)}
                >
                  {COL_SELECT_OPTIONS.map(option => (
                    <option
                      value={option.value}
                      selected={option.value === leftColSelectedOption}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className='data-header-cell'>
                <select
                  className='option-select'
                  onChange={e => setRightColSelectedOption(e.target.value)}
                >
                  {COL_SELECT_OPTIONS.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      selected={option.value === rightColSelectedOption}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {tableRows}
          </tbody>
        </table>
      )}
      {dataPointsToShow.includes(
        DATA_POINT_PERCENTAGE_WOMEN_FLEEING_TO_COUNTRY
      ) && (
        <HorizontalBar
          label={t('dataPoint.percentageWomenAmongstRefugeesInCountry')}
          fraction={
            dataPoint_percentageWomenFleeingToCountry
              ? dataPoint_percentageWomenFleeingToCountry.data
              : null
          }
          style={{ marginTop: '1em' }}
        />
      )}
      {dataPointsToShow.includes(
        DATA_POINT_PERCENTAGE_CHILDREN_FLEEING_TO_COUNTRY
      ) && (
        <HorizontalBar
          label={t('dataPoint.percentageChildrenAmongstRefugeesInCountry')}
          fraction={
            dataPoint_percentageChildrenFleeingToCountry
              ? dataPoint_percentageChildrenFleeingToCountry.data
              : null
          }
          style={{ marginTop: '1.3em' }}
        />
      )}
      <p className='footnote' style={{ marginBottom: '-0.5em' }}>
        {t('legend.numbersApplyAtEntryToEachCalendarYear')}
      </p>
      <p className='footnote' style={{ marginBottom: '5px' }}>
        {t('legend.sources')}
      </p>
    </>
  )
}

function HorizontalBar ({ label, fraction, style }) {
  return (
    <table style={{ ...style, width: '100%' }}>
      <tbody>
        <tr>
          <td
            style={{
              width: '50%',
              verticalAlign: 'middle'
            }}
          >
            {label}
          </td>
          <td
            style={{
              textAlign: 'right',
              width: '3.5em',
              verticalAlign: 'middle',
              paddingRight: '0.4em'
            }}
            dangerouslySetInnerHTML={{
              __html: !isNull(fraction)
                ? formatDataPercentage(fraction, 'nb-NO').replace(' ', '&nbsp;')
                : ''
            }}
          />
          <td>
            <div
              style={{
                display: 'inline-block',
                width: '100%',
                height: '30px',
                backgroundColor: isNull(fraction) ? '' : 'lightgrey'
              }}
            >
              {!isNull(fraction) && (
                <div
                  style={{
                    display: 'inline-block',
                    width: `${fraction * 100}%`,
                    height: '30px',
                    backgroundImage: `url(${horizontalBarBaseImg})`
                  }}
                />
              )}
              {isNull(fraction) && <>-</>}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function countryInfo__hasData (iso2) {
  return !!_.find(countryStatsCache, c => c.countryCode === iso2)
}

function fetchData (countryCode) {
  const url = `${API_URL}/datas?filter=${encodeURIComponent(
    JSON.stringify({ where: { countryCode } })
  )}`
  return $.getJSON(url).catch(function (err) {
    console.log(
      'error occurred during loading country stats data from loopback:'
    )
    console.log(err)
  })
}

function getCountryCentroid (countryCode) {
  return centroidsRaw.filter(centroid => centroid.iso === countryCode)[0]
}

function configureMapboxAccessToken (mapboxgl) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'
}

function initializeMap (mapBlock, initialCenter, mapboxgl) {
  const mapContainer = mapBlock.find(
    '.nrcstat-country-dashboard-map-block__mapbox'
  )

  var map = new mapboxgl.Map({
    container: mapContainer[0],
    center: initialCenter,
    style: 'mapbox://styles/nrcmaps/cjwz5szot00y61cpjqq3h9s5p',
    interactive: false
  })

  return map
}

function moveMapboxLogo (mapBlock) {
  mapBlock
    .find('.mapboxgl-ctrl-bottom-left')
    .removeClass('mapboxgl-ctrl-bottom-left')
    .addClass('mapboxgl-ctrl-bottom-right')
}

function addLegend (targetSelector) {
  const legend = $(targetSelector).find('.legend')

  if (isMobileDevice()) {
    addLegendMobile(legend)
  } else {
    addLegendTabletDesktop(legend)
  }

  $(targetSelector)
    .find('.legend-button-container')
    .click(function () {
      $(targetSelector)
        .find('.share-menu-container')
        .css('display', 'none')
      setShareMenuState(targetSelector)
      $(targetSelector)
        .find('.legend-container')
        .toggle()
      $(targetSelector)
        .find('#legend-button')
        .toggleClass('legend-button-closed')
      $(targetSelector)
        .find('#legend-button')
        .toggleClass('legend-button-open')
      setLegendState(targetSelector)
    })
}

const fullLegend = `
      <table>
        <tr>
            <td><span class="refugeesFrom-dot"></span></td>
            <td class="legend-text">Totalt antall flyktninger fra landet</td>
        </tr>
        <tr>
            <td><span class="refugeesTo-dot"></span></td>
            <td class="legend-text">Totalt antall flyktninger til landet</td>
        </tr>
        <tr>
            <td><span class="idps-dot"></span></td>
            <td class="legend-text">Totalt antall internt fordrevne i landet</td>
        </tr>
      </table>
      
      <p><span class="source"> Kilde: UNHCR, IDMC </span></p>
    `

function addLegendMobile (legend) {
  $(legend).append(
    `<div class="legend-button-container">
            <a class="disable-selection">
              <div class="legend-label">&#9432;</div>
              <div id="legend-button"  class="legend-button-closed">
                <span style="color: #FF7602;">&gt;</span><span style="color: #d4d4d4;">&gt;</span>
              </div>
            </a>
          </div>
          <div id="legend-container" class="legend-container" style="display: none;"></div>
          `
  )
  $(legend)
    .find('.legend-container')
    .append($(fullLegend))
}

function addLegendTabletDesktop (legend) {
  $(legend).append(
    '<div id="legend-container" class="legend-container-desktop"></div>'
  )
  $(legend)
    .find('.legend-container-desktop')
    .append($(fullLegend))
}

// #endregion

const START_RADIUS = 0.3
const BAR_RADIUS_WIDTH = 0.1
const BAR_RADIUS_SPACING = 0.1
const HELPER_BAR_RADIUS_WIDTH = 0.04

class RadialBarChart extends React.Component {
  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  state = {
    zeroOutAllBars: true
  };

  componentDidMount () {
    const el = this.myRef.current
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0.6) {
            this.setState({ zeroOutAllBars: false })
          }
        })
      },
      { threshold: 0.6, rootMargin: '0px' }
    )
    observer.observe(el)
  }

  data () {
    const maxFigure = Math.max(...this.props.data.map(v => v.figure))
    return this.props.data
      .sort((a, b) => a.figure - b.figure)
      .map((v, i) => {
        const radiusStart =
          START_RADIUS + (BAR_RADIUS_SPACING + BAR_RADIUS_WIDTH) * i
        const radiusEnd = radiusStart + BAR_RADIUS_WIDTH
        const helperBarRadiusStart =
          radiusStart +
          (radiusEnd - radiusStart) / 2 -
          HELPER_BAR_RADIUS_WIDTH / 2
        const helperBarRadiusEnd =
          helperBarRadiusStart + HELPER_BAR_RADIUS_WIDTH
        const angle = this.state.zeroOutAllBars
          ? 0
          : (v.figure / maxFigure) * 1.5 * Math.PI
        return [
          {
            angle: angle,
            radius0: radiusStart,
            radius: radiusEnd,
            color: v.colour,
            layer: 3,
            label: v.dataLabel,
            xOffsetForDataLabel: v.xOffsetForDataLabel,
            labelWidth: v.labelWidth,
            figure: v.figure
          },
          {
            angle: angle,
            radius0: radiusStart,
            radius: radiusEnd,
            color: v.colour,
            layer: 2,
            label: v.label,
            labelWidth: v.labelWidth,
            figure: v.figure
          },
          {
            angle0: angle,
            angle: 1.5 * Math.PI,
            radius0: helperBarRadiusStart,
            radius: helperBarRadiusEnd,
            color: 'rgb(186,186,186,0.72)',
            layer: 1
          }
        ]
      })
      .flat()
      .sort((a, b) => a.layer - b.layer)
  }

  render () {
    const widthHeight = 290

    const RANGE = 6000000

    const data = this.data()

    const maxRadius = Math.max(...data.map(v => v.radius))
    const maxFigure = Math.max(
      ...data.filter(v => v.layer === 2).map(v => v.figure)
    )

    return (
      <div ref={this.myRef}>
        {this.props.data.length > 0 && (
          <XYPlot
            className={`nrcstat-radial-chart ${this.props.data[0].iso}`}
            margin={{ left: 40, bottom: 0, top: 0, right: 40 }}
            width={widthHeight + 50}
            height={widthHeight + 50}
            xDomain={[-RANGE, RANGE]}
            yDomain={[-RANGE, RANGE]}
          >
            <ArcSeries
              animation='stiff'
              radiusDomain={[0, maxRadius]}
              data={this.data()}
              colorType='literal'
            />
            {data
              .filter(v => v.layer === 2)
              .map((v, i) => {
                // const width = getTextWidth(v.label, '"Roboto Condensed"');
                const width = v.labelWidth
                return (
                  <LabelSeries
                    key={`${v.layer}-${i}`}
                    data={[
                      {
                        x: 0,
                        y: 0,
                        xOffset: -5,
                        yOffset: -50 + -32 * i,
                        label: v.label
                      }
                    ]}
                    labelAnchorX='end'
                    style={{ fontFamily: 'Roboto Condensed' }}
                  />
                )
              })}
            {data
              .filter(v => v.layer === 3)
              .map((v, i) => {
                // const width = getTextWidth(v.label, '"Roboto Condensed"');
                const width = v.labelWidth

                return (
                  <LabelSeries
                    key={`${v.layer}-${i}`}
                    data={[
                      {
                        x: 0,
                        y: 0,
                        xOffset: v.xOffsetForDataLabel,
                        yOffset: -49 + -32 * i,
                        label: v.label
                      }
                    ]}
                    labelAnchorX='end'
                    style={{
                      fontFamily: 'Roboto Condensed',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}
                  />
                )
              })}
          </XYPlot>
        )}
      </div>
    )
  }
}

const dataPointToLabel = t => ({
  idpsInXInYear: t('radialBarChart.label.idps'),
  totalRefugeesFromX: t('radialBarChart.label.refugeesFrom'),
  refugeesInXFromOtherCountriesInYear: t('radialBarChart.label.refugeesTo')
})
const dataPointToColour = {
  idpsInXInYear: 'rgba(114,199,231,0.72)',
  totalRefugeesFromX: 'rgba(255,121,0,0.72)',
  refugeesInXFromOtherCountriesInYear: 'rgba(253,200,47,0.72)'
}

const dataTransformer = t => data => {
  const filtered = data.filter(v =>
    includes(
      [
        'idpsInXInYear',
        'totalRefugeesFromX',
        'refugeesInXFromOtherCountriesInYear'
      ],
      v.dataPoint
    )
  )
  const countries = groupBy(filtered, 'countryCode')
  const mapped = mapValues(countries, countryDatas =>
    countryDatas.map(countryData => {
      const label = dataPointToLabel(t)[countryData.dataPoint].replace(
        'XXX',
        isNull(countryData.data) ? '' : ''
      )
      const dataLabel = isNull(countryData.data)
        ? '-'
        : formatDataNumber(countryData.data, 'nb-NO', true)
      let xOffsetForDataLabel
      switch (countryData.dataPoint) {
        case 'totalRefugeesFromX':
          xOffsetForDataLabel = -75
          break

        case 'refugeesInXFromOtherCountriesInYear':
          xOffsetForDataLabel = -73
          break

        case 'idpsInXInYear':
          xOffsetForDataLabel = -88
          break

        default:
          xOffsetForDataLabel = 0
          break
      }
      return {
        dataLabel: dataLabel,
        xOffsetForDataLabel: xOffsetForDataLabel,
        label: label,
        figure: countryData.data,
        iso: countryData.countryCode,
        colour: dataPointToColour[countryData.dataPoint]
      }
    })
  )
  return mapped
}

function getCountryStats (data, countryIso2Code) {
  return data.filter(c => c.countryCode === countryIso2Code)
}

function getCountryStat (rawData, countryCode, dataPoint, year) {
  const stats = rawData.filter(
    c => c.countryCode === countryCode && c.year === year
  )
  if (!stats) return null
  const data = stats.filter(d => d.dataPoint === dataPoint)
  if (data && data.length > 0) return data[0]
  return null
}
