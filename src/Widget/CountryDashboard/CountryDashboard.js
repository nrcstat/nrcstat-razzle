import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import gazaGeoJson from '@/Widget/assets/json/gaza.json'
import centroidsRaw from '@/Widget/assets/json/geo_entities_updated_manually'
import middleResolutionCountriesGeoJson from '@/Widget/assets/json/ne_110m_admin_0_countries.json'
import loadable from '@loadable/component'
import {
  chain,
  clone,
  groupBy,
  includes,
  isNull,
  last,
  mapValues,
} from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { ArcSeries, LabelSeries, XYPlot } from 'react-vis'
import 'react-vis/dist/style.css'
import { API_URL } from '../../config'
import { FixedLocaleContext } from '../../services/i18n'
import { isClient, isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import './CountryDashboard.scss'
import { CountryMap } from './CountryMap'
import { getCountryStat } from './get-country-stat'
import { RadialBarChart } from './RadialBarChart'
import { StatsTable } from './StatsTable'
import c from './CountryDashboard.module.scss'
import { Ingress } from './Ingress'
import { StatsInfoText } from './StatsInfoText'
import { DashboardHeader } from './DashboardHeader'
import { PercentageDonut } from './PercentageDonut'

middleResolutionCountriesGeoJson.features.push(gazaGeoJson.features[0])

const req = require.context('../assets/flags', false)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const flagImagesMap = chain(
  req.keys().map((file) => ({
    file: req(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
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

const Mapboxgl = loadable.lib(() => import('mapbox-gl/dist/mapbox-gl.js'), {
  ssr: false,
})

export default function Loader() {
  return (
    <Mapboxgl>
      {({ default: mapboxgl }) => (
        <CountryDashboardWrapper mapboxgl={mapboxgl} />
      )}
    </Mapboxgl>
  )
}

function CountryDashboardWrapper() {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode } = widgetParams

  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  let ingress = String(
    t(`countryIngress.${countryCode}`, { defaultValue: '' })
  ).trim()
  const isIngressNonEmpty = Boolean(ingress)

  return (
    <>
      <DashboardHeader />
      <div className={c['dashboard-map-and-ingress-wrapper']}>
        <div className={c['map']}>
          <CountryMap />
        </div>
        {isIngressNonEmpty ? (
          <div className={c['ingress']}>
            <Ingress />
          </div>
        ) : null}
      </div>

      <div className={c['donut-table-wrapper']}>
        <div style={{ flex: '1' }}>
          <StatsTable />
        </div>
        <div className={c['spacer']} />
        <div style={{ flex: '1' }}>
          <div className={c['donuts-wrapper']}>
            <div className={c['donut-wrapper']}>
              <PercentageDonut dataPoint="percentageWomenFleeingToCountry" />
            </div>
            <div className={c['donut-wrapper']}>
              <PercentageDonut dataPoint="percentageChildrenFleeingToCountry" />
            </div>
          </div>
          <StatsInfoText />
        </div>
      </div>
    </>
  )
}

function CountryDashboard({ mapboxgl, containerElement }) {
  // TODO: fix to use proper SSR as far as possible
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const data = widgetParams.preloadedWidgetData

  const { countryCode, year, locale } = widgetParams
  const t = getNsFixedT(['Widget.Static.CountryDashboard', 'GeographicalNames'])

  const leonardoCentroid = getCountryCentroid(countryCode)
  const leonardoBoundingBox = leonardoCentroid.boundingbox

  useEffect(() => {
    clearWidgetContainer()
    const { dataBlock, mapBlock } = drawWidgetContainer()

    configureMapboxAccessToken(mapboxgl)
    const map = initializeMap(mapBlock, [0, 0], mapboxgl)
    const mapLoaded = () =>
      new Promise((resolve) => map.on('load', () => resolve()))

    const yalla = () =>
      new Promise((resolve) => setTimeout(() => resolve(), 100))

    Promise.all([mapLoaded(), yalla()]).then(() => {
      drawDataBlock(dataBlock, data, t)
      drawMapBlock(
        mapBlock,
        data.filter((d) => d.year == year)
      )
    })

    function clearWidgetContainer() {
      $(containerElement).empty()
    }

    function drawWidgetContainer() {
      $(containerElement).addClass('nrcstat-country-dashboard')

      // ZERO OUT css written by EpiServer
      $(containerElement).css({
        width: '100%',
        height: 'auto',
        display: 'inline-block',
      })
      $(containerElement).parent('.nrcstat__rootwidget').css({
        width: '100%',
        height: 'auto',
        display: 'inline-block',
      })
      $(containerElement).parents('.nrcstat-block').css({
        display: 'table',
      })

      $(containerElement).html(
        `
      <div class="nrcstat-country-dashboard-wrapper">
        <div class="nrcstat-country-dashboard-data-block">
          <div class="nrcstat-country-dashboard-data-block__inner"></div>
        </div>
        <div class="nrcstat-country-dashboard-map-block">
          <div class="nrcstat-country-dashboard-map-block__map-container">
            <div class="nrcstat-country-dashboard-map-block__mapbox"></div>
            <div class="nrcstat-country-dsahboard-map-block__source">${t(
              'radialBarChart.sources'
            )}</div>
          </div>
        </div>
      </div>`
      )
      const dataBlock = $(containerElement).find(
        '.nrcstat-country-dashboard-data-block__inner'
      )
      const mapBlock = $(containerElement).find(
        '.nrcstat-country-dashboard-map-block'
      )

      return { dataBlock, mapBlock }
    }

    function drawDataBlock(dataBlock, data, t) {
      ReactDOM.render(
        <StatsTable
          year={year}
          locale={locale}
          countryCode={countryCode}
          data={data}
          onAfterRender={() => map.resize()}
          t={t}
        />,
        dataBlock[0]
      )
    }

    function drawMapBlock(mapBlock, data) {
      const boundingBox = leonardoCentroid.boundingbox
      const [west, south, east, north] = boundingBox
      const fitBounds_bounds = [
        [south, west],
        [north, east],
      ]
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
        <RadialBarChart
          data={Object.values(dataTransformer(t, locale)(data))[0]}
        />,
        el
      )

      const singleCountry = clone(middleResolutionCountriesGeoJson)
      singleCountry.features = singleCountry.features.filter(
        (c) =>
          c.properties &&
          c.properties.iso_a2 &&
          c.properties.iso_a2.toUpperCase() === countryCode.toUpperCase()
      )

      map.addSource('highlight-individual-country', {
        type: 'geojson',
        data: singleCountry,
      })

      map.addLayer({
        id: 'countries-highlighted',
        type: 'fill',
        source: 'highlight-individual-country',
        paint: {
          'fill-opacity': 1,
        },
        paint: { 'fill-color': '#d4d4d4' },
      })

      map.addSource('radial-chart-title-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                countryLabel: t('radialBarChart.belowChart.line1'),
              },
              geometry: {
                type: 'Point',
                coordinates: somethingWonderful.center.toArray(),
              },
            },
          ],
        },
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
          'text-offset': [0, 6.5],
        },
      })
      map.addSource('radial-chart-subtitle-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                countryLabel: t('radialBarChart.belowChart.line2'),
              },
              geometry: {
                type: 'Point',
                coordinates: somethingWonderful.center.toArray(),
              },
            },
          ],
        },
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
          'text-offset': [0, 12.5],
        },
      })

      // $(mapBlock).css('position', 'relative');
      // $(mapBlock).css('overflow', 'hidden');

      moveMapboxLogo(mapBlock)
    }
  }, [])

  return null
}

function countryInfo__hasData(iso2) {
  return !!_.find(countryStatsCache, (c) => c.countryCode === iso2)
}

function fetchData(countryCode) {
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

function getCountryCentroid(countryCode) {
  return centroidsRaw.filter((centroid) => centroid.iso === countryCode)[0]
}

function configureMapboxAccessToken(mapboxgl) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'
}

function initializeMap(mapBlock, initialCenter, mapboxgl) {
  const mapContainer = mapBlock.find(
    '.nrcstat-country-dashboard-map-block__mapbox'
  )

  var map = new mapboxgl.Map({
    container: mapContainer[0],
    center: initialCenter,
    style: 'mapbox://styles/nrcmaps/cjwz5szot00y61cpjqq3h9s5p',
    interactive: false,
  })

  return map
}

function moveMapboxLogo(mapBlock) {
  mapBlock
    .find('.mapboxgl-ctrl-bottom-left')
    .removeClass('mapboxgl-ctrl-bottom-left')
    .addClass('mapboxgl-ctrl-bottom-right')
}

const dataPointToLabel = (t) => ({
  idpsInXInYear: t('radialBarChart.label.idps'),
  totalRefugeesFromX: t('radialBarChart.label.refugeesFrom'),
  refugeesInXFromOtherCountriesInYear: t('radialBarChart.label.refugeesTo'),
})
const dataPointToColour = {
  idpsInXInYear: 'rgba(114,199,231,0.72)',
  totalRefugeesFromX: 'rgba(255,121,0,0.72)',
  refugeesInXFromOtherCountriesInYear: 'rgba(253,200,47,0.72)',
}

const dataTransformer = (t, locale) => (data) => {
  const filtered = data.filter((v) =>
    includes(
      [
        'idpsInXInYear',
        'totalRefugeesFromX',
        'refugeesInXFromOtherCountriesInYear',
      ],
      v.dataPoint
    )
  )
  const countries = groupBy(filtered, 'countryCode')
  const mapped = mapValues(countries, (countryDatas) =>
    countryDatas.map((countryData) => {
      const label = dataPointToLabel(t)[countryData.dataPoint].replace(
        'XXX',
        isNull(countryData.data) ? '' : ''
      )
      const dataLabel = isNull(countryData.data)
        ? '-'
        : formatDataNumber(countryData.data, 'nb-NO', true)
      let xOffsetForDataLabel

      if (locale === 'en-GB') {
        switch (countryData.dataPoint) {
          case 'totalRefugeesFromX':
            xOffsetForDataLabel = -76
            break

          case 'refugeesInXFromOtherCountriesInYear':
            xOffsetForDataLabel = -65
            break

          case 'idpsInXInYear':
            xOffsetForDataLabel = -101
            break

          default:
            xOffsetForDataLabel = 0
            break
        }
      } else if (locale === 'nb-NO') {
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
      } else if (locale === 'sv-SE') {
        switch (countryData.dataPoint) {
          case 'totalRefugeesFromX':
            xOffsetForDataLabel = -75
            break

          case 'refugeesInXFromOtherCountriesInYear':
            xOffsetForDataLabel = -69
            break

          case 'idpsInXInYear':
            xOffsetForDataLabel = -88
            break

          default:
            xOffsetForDataLabel = 0
            break
        }
      } else {
        // This else clause covers the future de-DE locale
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
      }
      return {
        dataLabel: dataLabel,
        xOffsetForDataLabel: xOffsetForDataLabel,
        label: label,
        figure: countryData.data,
        iso: countryData.countryCode,
        colour: dataPointToColour[countryData.dataPoint],
      }
    })
  )
  return mapped
}
