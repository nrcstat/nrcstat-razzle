import React, { useContext, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import centroidsRaw from '@/Widget/assets/json/geo_entities_updated_manually'
import { isServer } from '../../util/utils'
import gazaGeoJson from '@/Widget/assets/json/gaza.json'

import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import mapboxgl from 'mapbox-gl'
import c from './CountryMap.module.scss'
import { RadialBarChart } from './RadialBarChart'
import { includes, groupBy, mapValues, isNull, clone } from 'lodash'
import { formatDataNumber } from '@/util/widgetHelpers.js'
import middleResolutionCountriesGeoJson from '@/Widget/assets/json/ne_110m_admin_0_countries.json'
import { DashboardHeader } from './DashboardHeader'

middleResolutionCountriesGeoJson.features.push(gazaGeoJson.features[0])

mapboxgl.accessToken =
  'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'

export function CountryMap() {
  if (isServer()) return null

  const mapContainer = useRef(null)
  const map = useRef(null)
  const isMapSetup = useRef(false)

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, preloadedWidgetData, locale, year } = widgetParams

  const t = getNsFixedT(['Widget.Static.CountryDashboard', 'GeographicalNames'])

  const leonardoCentroid = getCountryCentroid(countryCode)

  const data = preloadedWidgetData.filter((d) => d.year === parseInt(year))

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [0, 0],
      style: 'mapbox://styles/nrcmaps/cjwz5szot00y61cpjqq3h9s5p',
      interactive: false,
    })

    ReactDOM.render(
      <RadialBarChart
        data={Object.values(dataTransformer(t, locale)(data))[0]}
      />,
      el
    )

    map.current.on('load', () => {
      const boundingBox = leonardoCentroid.boundingbox
      const [west, south, east, north] = boundingBox
      const fitBounds_bounds = [
        [south, west],
        [north, east],
      ]
      const fitBounds_config = { padding: 15 }

      const somethingWonderful = map.current.cameraForBounds(
        fitBounds_bounds,
        fitBounds_config
      )

      map.current.fitBounds(fitBounds_bounds, fitBounds_config)
      map.current.on('resize', () => {
        console.log('resize')
        map.current.fitBounds(fitBounds_bounds, fitBounds_config)
      })

      const el = document.createElement('div')
      el.className = 'nrcstat-radial-bar-chart'

      new mapboxgl.Marker(el)
        .setLngLat(somethingWonderful.center.toArray())
        .addTo(map.current)

      const singleCountry = clone(middleResolutionCountriesGeoJson)
      singleCountry.features = singleCountry.features.filter(
        (c) =>
          c.properties &&
          c.properties.iso_a2 &&
          c.properties.iso_a2.toUpperCase() === countryCode.toUpperCase()
      )

      map.current.addSource('highlight-individual-country', {
        type: 'geojson',
        data: singleCountry,
      })

      map.current.addLayer({
        id: 'countries-highlighted',
        type: 'fill',
        source: 'highlight-individual-country',
        paint: {
          'fill-opacity': 1,
        },
        paint: { 'fill-color': '#d4d4d4' },
      })

      map.current.addSource('radial-chart-title-src', {
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
      map.current.addLayer({
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
      map.current.addSource('radial-chart-subtitle-src', {
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
      map.current.addLayer({
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

      // Move the mapbox logo
      const mapboxLogo = mapContainer.current.querySelector(
        '.mapboxgl-ctrl-bottom-left'
      )
      mapboxLogo.classList.remove('mapboxgl-ctrl-bottom-left')
      mapboxLogo.classList.add('mapboxgl-ctrl-bottom-right')
    })
  })

  // useEffect(() => {
  //   if (!map.current) return // wait for map to initialize
  //   if (!isMapSetup.current) {
  //     map.current.on('move', () => {
  //       setLng(map.current.getCenter().lng.toFixed(4))
  //       setLat(map.current.getCenter().lat.toFixed(4))
  //       setZoom(map.current.getZoom().toFixed(2))
  //     })
  //     ismapSetup.current = true
  //   }
  // })

  return (
    <div className={c['map-container']} ref={mapContainer}>
      <div></div>
      <span className={c['source']}>{t('radialBarChart.sources')}</span>
    </div>
  )
}

function getCountryCentroid(countryCode) {
  return centroidsRaw.filter((centroid) => centroid.iso === countryCode)[0]
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
