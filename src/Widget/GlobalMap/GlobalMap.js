import React, { useRef } from 'react'
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
  throttle
} from 'lodash'
import BezierEasing from 'bezier-easing'
import * as $ from 'jquery'

import {
  formatDataNumber,
  formatDataPercentage,
  formatNumber,
  isMobileDevice
} from '@/old/widgetHelpers'

import './styles.scss'

import { isServer } from '@/util/utils'
import loadable from '@loadable/component'

/* Load image assets */
import facebookIcon from './assets/images/facebook.png'
import shareIcon from './assets/images/share.png'
import twitterIcon from './assets/images/twitter.png'
import linkedinIcon from './assets/images/linkedin.png'
import closeButton from './assets/images/close.png'
import refugeesFromIcon from './assets/images/refugeesFrom_small.png'
import refugeesToIcon from './assets/images/refugeesTo_small.png'
import idpsIcon from './assets/images/IDP_small.png'

import norwegianCountryNames from '@/old/assets/countryCodeNameMapNorwegian.json'
import countryLinks from './assets/json/country-links.json'
import gazaGeoJson from './assets/json//gaza.json'
import middleResolutionCountriesGeoJson from './assets/json/ne_110m_admin_0_countries.json'
import centroidsRaw from './assets/json/geo_entities_updated_manually.json'
import COUNTRIES from './assets/json/radial_bar_map_countries_to_display.json'
import { API_URL, LIB_URL } from '../../constants'
middleResolutionCountriesGeoJson.features.push(gazaGeoJson.features[0])

const req = require.context('./assets/pre-rendered-radial-bar-charts', false)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMap = chain(
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

const QUERY = { where: { year: 2018 } }
let countryStatsCache = null
let isFullScreen
const nrcCountryIso2 = [
  'AF',
  'CD',
  'CF',
  'CM',
  'CO',
  'DJ',
  'EC',
  'ER',
  'ET',
  'GR',
  'HN',
  'IQ',
  'IR',
  'JO',
  'KE',
  'LB',
  'ML',
  'MM',
  'NG',
  'PA',
  'PS',
  'SO',
  'SS',
  'SY',
  'TZ',
  'UA',
  'UG',
  'VE',
  'YE'
]
const blueCountryIso2 = [
  'AT',
  'AU',
  'AZ',
  'BD',
  'BI',
  'CA',
  'CG',
  'CN',
  'DE',
  'EG',
  'FR',
  'GM',
  'IN',
  'IT',
  'MX',
  'NE',
  'NO',
  'PH',
  'PK',
  'RW',
  'SD',
  'SE',
  'SV',
  'TD',
  'TR',
  'US',
  'VN'
]
const toggleFullScreenAnimationDuration = 300

const MIN_ZOOM = 2
const MAX_ZOOM = 6
const START_ZOOM = MIN_ZOOM
const MIN_COUNTRY_NAME_SIZE = 8
const MAX_COUNTRY_NAME_SIZE = 26

const easing = BezierEasing(1, 0, 0.64, 0.76)

// Only show centroids for which we have data from api.nrcdata.no (i.e. centroid's country is in COUNTRIES)
const centroids = centroidsRaw
  .filter(centroid => COUNTRIES.includes(centroid.iso))
  .filter(centroid =>
    middleResolutionCountriesGeoJson.features
      .map(v => v.properties.iso_a2)
      .includes(centroid.iso)
  )

function loadStats () {
  const url = `${API_URL}/datas?filter=${encodeURIComponent(JSON.stringify(QUERY))}`
  $.getJSON(url)
    .then(function (data) {
      countryStatsCache = data
    })
    .catch(function (err) {
      console.log(
        'error occurred during loading country stats data from loopback:'
      )
      console.log(err)
    })
}

function getCountryStats (countryIso2Code) {
  if (typeof countryStatsCache) {
    return countryStatsCache.filter(c => c.countryCode === countryIso2Code)
  } else {
    return null
  }
}

function getCountryStat (countryIso2Code, dataPoint) {
  const stats = getCountryStats(countryIso2Code)
  if (!stats) return null
  const data = stats.filter(d => d.dataPoint === dataPoint)
  if (data && data.length > 0) return data[0]
  return null
}

function drawWidgetGlobalDisplacementRadialBarChartMap (
  widgetObject,
  widgetData,
  targetSelector
) {
  console.log(targetSelector)
  $(targetSelector).empty()
  $(targetSelector).addClass(
    'nrcstat-static-global-displacement-radial-bar-chart-map'
  )
  $(targetSelector).css('position', 'relative')
  $(targetSelector).css('overflow', 'hidden')

  isFullScreen = false

  $(targetSelector).append(`
      <button class="map-open-button" type="button">Utforsk kart</button>
      <button class="map-close-button" style="display: none" type="button">Avslutt utforskning</button> 
      <div class="map-share"></div>
      <div id="mainmap-goes-here" style="width: 100%; height: 100%;"><div class="overlay"></div><div class="nrcstat-country-dashboard-map-legend"></div></div>
    `)

  if (isMobileDevice()) {
    $(targetSelector)
      .find('#mainmap-goes-here')
      .css({
        position: 'absolute',
        height: window.innerHeight,
        width: window.innerWidth
      })
  }

  // highlight open button when clicked outside of it
  var animationEvent =
      'webkitAnimationEnd oanimationend msAnimationEnd animationend'
  $(targetSelector)
    .find('.overlay')
    .mousedown(function () {
      $(targetSelector)
        .find('.map-open-button')
        .addClass('highlight-map-open-button')
      $(targetSelector)
        .find('.map-open-button')
        .one(animationEvent, function (event) {
          $(this).removeClass('highlight-map-open-button')
        })
    })

  $(targetSelector)
    .find('.map-open-button')
    .click(function () {
      setActiveMode(targetSelector, map)
      isCountryInfoPopupOrPopoverActive = false
    })

  $(targetSelector)
    .find('.map-close-button')
    .click(function () {
      setPassiveMode(targetSelector, map)
      isCountryInfoPopupOrPopoverActive = false
    })

  addLegend(targetSelector)

  addShareMenu(targetSelector)

  loadStats()

  mapboxgl.accessToken =
      'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'
  var map = new mapboxgl.Map({
    container: 'mainmap-goes-here',
    center: initialCenter,
    zoom: START_ZOOM,
    style: 'mapbox://styles/nrcmaps/cjx1qihkq00r81ctczmmai9ps',
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
  })
  map.setZoom(initialZoom)

  // disable map rotation
  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()

  // change position of mapbox logo
  $(targetSelector)
    .find('.mapboxgl-ctrl-bottom-left')
    .removeClass('mapboxgl-ctrl-bottom-left')
    .addClass('mapboxgl-ctrl-bottom-right')

  map.on('load', function () {
    map.addSource('countries', {
      type: 'geojson',
      data: middleResolutionCountriesGeoJson
    })

    const sharedLayerProperties = {
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-opacity': 1
      },
      filter: ['==', 'iso_a2', '']
    }

    map.addLayer(
      Object.assign(sharedLayerProperties, {
        id: 'countries-highlighted',
        paint: { 'fill-color': 'rgba(212,212,212,0.68)' }
      })
    )
    map.addLayer(
      Object.assign(sharedLayerProperties, {
        id: 'countries-highlighted-nrc',
        paint: { 'fill-color': 'rgba(255,119,0,0.36)' }
      })
    )
    map.addLayer(
      Object.assign(sharedLayerProperties, {
        id: 'countries-highlighted-blue',
        paint: { 'fill-color': 'rgba(212,212,212,0.84)' }
      })
    )

    function countryMouseMoveOverHandler (e) {
      const hoverCountryIso2 = e.features[0].properties.iso_a2

      if (
        countryInfo__hasData(hoverCountryIso2) ||
          e.features[0].properties.name == 'Kosovo'
      ) {
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', 'default')
      }

      map.setFilter('countries-highlighted-nrc', [
        '==',
        'iso_a2',
        _.includes(nrcCountryIso2, hoverCountryIso2) ? hoverCountryIso2 : ''
      ])
      map.setFilter('countries-highlighted-blue', [
        '==',
        'iso_a2',
        _.includes(blueCountryIso2, hoverCountryIso2) ? hoverCountryIso2 : ''
      ])
      const nrcAndBlueIso2 = nrcCountryIso2.concat(blueCountryIso2)
      map.setFilter('countries-highlighted', [
        '==',
        'iso_a2',
        !_.includes(nrcAndBlueIso2) ? hoverCountryIso2 : ''
      ])
    }

    // disable hover on mobile device otherwise country stays highlighted once popover is closed
    if (!isMobileDevice()) {
      map.on('mousemove', 'countries', countryMouseMoveOverHandler)
      map.on('mouseover', 'countries', countryMouseMoveOverHandler)
    }

    map.on('click', 'countries', function (event) {
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

    map.on('mouseleave', 'countries-highlighted', function () {
      $(targetSelector)
        .find('.mapboxgl-canvas-container')
        .css('cursor', 'grab')
      $(targetSelector)
        .find('.mapboxgl-canvas-container')
        .css('cursor', '-webkit-grab')
      $(targetSelector)
        .find('.mapboxgl-canvas-container')
        .css('cursor', '-moz-grab')

      map.setFilter('countries-highlighted', ['==', 'iso_a2', ''])
      map.setFilter('countries-highlighted-blue', ['==', 'iso_a2', ''])
      map.setFilter('countries-highlighted-nrc', ['==', 'iso_a2', ''])
    })

    map.on('dragstart', function () {
      if (
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor') != 'default'
      ) {
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', 'grabbing')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-webkit-grabbing')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-moz-grabbing')
      }
    })

    map.on('dragend', function (event) {
      if (
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor') != 'default'
      ) {
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', 'grab')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-webkit-grab')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-moz-grab')
      }
    })

    function getMaxSet3FigureFromData (iso) {
      const maxFigure = Math.max(
        ...[
          getCountryStat(iso, 'totalRefugeesFromX').data,
          getCountryStat(iso, 'refugeesInXFromOtherCountriesInYear').data,
          getCountryStat(iso, 'idpsInXInYear').data
        ]
      )
      return maxFigure
    }

    const geojson = {
      type: 'FeatureCollection',
      features: centroids.map(centroid => {
        const [sizeFactor, sizeClass] = calculateSizeFactor(
          getMaxSet3FigureFromData(centroid.iso)
        )
        console.log(sizeClass)
        console.log(getMaxSet3FigureFromData(centroid.iso))
        return {
          type: 'Feature',
          properties: {
            countryLabel: norwegianCountryNames[centroid.iso].toUpperCase(),
            countryShortLabel: centroid.iso,
            iso: centroid.iso,
            sizeFactor: sizeFactor,
            sizeClass: sizeClass,
            message: `${centroid.idmc_full_name} ${centroid.iso}`,
            iconSize: [30, 30]
          },
          geometry: {
            type: 'Point',
            coordinates: [...centroid.centroid].reverse()
          }
        }
      })
    }

    const elements = []

    function resizeChartsByZoom () {
      const baseSize = 280
      const zoom = map.getZoom()
      const zoomNormalized = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
      const factor = easing(zoomNormalized)
      const dimension = 30 + baseSize * factor
      const fontSize =
          MIN_COUNTRY_NAME_SIZE +
          factor * (MAX_COUNTRY_NAME_SIZE - MIN_COUNTRY_NAME_SIZE)
      const yOffsetSmall = -((dimension * 0.48) / 2 / fontSize)
      const yOffsetMedium = -((dimension * 0.57) / 2 / fontSize)
      const yOffsetLarge = -((dimension * 0.70) / 2 / fontSize)
      map.setLayoutProperty('country-labels-small', 'text-offset', [
        0.1,
        yOffsetSmall
      ])
      map.setLayoutProperty('country-labels-medium', 'text-offset', [
        0.1,
        yOffsetMedium
      ])
      map.setLayoutProperty('country-labels-large', 'text-offset', [
        0.1,
        yOffsetLarge
      ]);
      ['small', 'medium', 'large'].forEach(sizeClass => {
        map.setLayoutProperty(`country-labels-${sizeClass}`, 'text-field', [
          'get',
          zoom > 3 ? 'countryLabel' : 'countryShortLabel'
        ])
        map.setLayoutProperty(
            `country-labels-${sizeClass}`,
            'text-size',
            fontSize
        )
      })
      elements.forEach(el => {
        const sizeFactor = el.dataset.sizeFactor
        const adjustedDimension = dimension * sizeFactor
        el.style.width = adjustedDimension + 'px'
        el.style.height = adjustedDimension + 'px'
      })
    }

    map.on('zoom', throttle(resizeChartsByZoom, 10))
    map.addSource('country-labels-src', {
      type: 'geojson',
      data: geojson
    })

    map.addLayer({
      id: 'country-labels-small',
      type: 'symbol',
      source: 'country-labels-src',
      layout: {
        'text-field': ['get', 'countryLabel'],
        'text-font': ['Helvetica Regular'],
        'text-max-width': 50,
        'text-line-height': 1
      },
      filter: ['==', 'sizeClass', 'small']
    })
    map.addLayer({
      id: 'country-labels-medium',
      type: 'symbol',
      source: 'country-labels-src',
      layout: {
        'text-field': ['get', 'countryLabel'],
        'text-font': ['Helvetica Regular'],
        'text-max-width': 50,
        'text-line-height': 1
      },
      filter: ['==', 'sizeClass', 'medium']
    })
    map.addLayer({
      id: 'country-labels-large',
      type: 'symbol',
      source: 'country-labels-src',
      layout: {
        'text-field': ['get', 'countryLabel'],
        'text-font': ['Helvetica Regular'],
        'text-max-width': 50,
        'text-line-height': 1
      },
      filter: ['==', 'sizeClass', 'large']
    })

    const hoverPopup = $(`
      <div class="global-displacement-radial-bar-chart-tooltip">
        <div class="top">Totalt</div>
        <div class="data"></div>
      </div>`)
    $('body').append(hoverPopup)
    const showTooltip = countryCode => e => {
      if (map.getZoom() < 3) return
      if (isCountryInfoPopupOrPopoverActive) return
      const dataHtml = [
        {
          color: 'rgba(114,199,231,0.72)',
          data: getCountryStat(countryCode, 'idpsInXInYear').data
        },
        {
          color: 'rgba(255,121,0,0.72)',
          data: getCountryStat(countryCode, 'totalRefugeesFromX').data
        },
        {
          color: 'rgba(253,200,47,0.72)',
          data: getCountryStat(
            countryCode,
            'refugeesInXFromOtherCountriesInYear'
          ).data
        }
      ]
        .sort((a, b) => b.data - a.data)
        .map(d => {
          return { ...d, data: formatDataNumber(d.data, 'nb_NO') }
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

    geojson.features.forEach(function (marker) {
      var el = document.createElement('div')
      const iso = marker.properties.iso
      el.style.backgroundImage = `url(${radialBarChartsMap[iso]})`
      el.style.backgroundSize = 'cover'
      el.style.overflow = 'hidden'

      if (!isMobileDevice()) {
        el.addEventListener('mouseenter', showTooltip(marker.properties.iso))
        el.addEventListener('mousemove', showTooltip(marker.properties.iso))
        el.addEventListener('mouseout', hideTooltip)
      }

      el.dataset.sizeFactor = marker.properties.sizeFactor

      elements.push(el)

      const centroidFromLeonardoData = centroidsRaw.filter(
        centroid => centroid.iso === iso
      )
      if (centroidFromLeonardoData.length > 0) {
        const leonardoCentroid = centroidFromLeonardoData[0]
        /* const boundingBox = leonardoCentroid;
          const [west, south, east, north] = boundingBox;
          const midX = (west + east) / 2;
          const midY = (north + south) / 2;

          new mapboxgl.Marker(el).setLngLat([midY, midX]).addTo(map);
          */
        new mapboxgl.Marker(el)
          .setLngLat([...leonardoCentroid.centroid].reverse())
          .addTo(map)
      }
    })
    resizeChartsByZoom()
  })
}

function countryInfo__hasData (iso2) {
  return !!_.find(countryStatsCache, c => c.countryCode === iso2)
}

// #endregion

// #region Map legend

function animateFullScreen (elm, map, callbackCb) {
  const target = $(elm)

  if (!isFullScreen) {
    beforeFullScreenNrcPageHeaderZIndex = $('header.page-header').css(
      'z-index'
    )
    $('header.page-header').css('z-index', 0)

    beforeFullScreenBodyOverflowProp = $('body').css('overflow')
    $('body').css('overflow', 'hidden')

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const { top: topOffset, left: leftOffset } = target.offset()
    const scrollTop = $(document).scrollTop()

    let nonComputedStyles = target.attr('style').split(';')
    nonComputedStyles = nonComputedStyles.map(style => style.split(':'))
    const nonComputedStyleByName = name => {
      return undefined
      const style = _.find(nonComputedStyles, style => style[0] === name)
      if (style) return style[1]
      else return undefined
    }

    beforeFullScreenCssProps = {
      top: nonComputedStyleByName('top') || target.css('top'),
      left: nonComputedStyleByName('left') || target.css('left'),
      width: nonComputedStyleByName('width') || target.css('width'),
      height: nonComputedStyleByName('height') || target.css('height')
    }
    const newProps = {
      top: `${-Math.floor(topOffset - scrollTop)}px`,
      left: `-${leftOffset}px`,
      width: `${windowWidth}px`,
      height: `${windowHeight}px`
    }
    target.animate(newProps, toggleFullScreenAnimationDuration, () => {
      isFullScreen = true
      callbackCb()
    })
  } else {
    $('body').css('overflow', beforeFullScreenBodyOverflowProp)

    $('header.page-header').css('z-index', beforeFullScreenNrcPageHeaderZIndex)
    target.animate(
      beforeFullScreenCssProps,
      toggleFullScreenAnimationDuration,
      () => {
        isFullScreen = false
        // const cssAttr = _.map(beforeFullScreenCssProps, (v, k) => `${k}: ${v}`).join(";") + ";"
        // target.attr('style', cssAttr)
        callbackCb()
      }
    )
  }
}

function setActiveMode (targetSelector, map) {
  $(targetSelector)
    .find('.overlay')
    .addClass('disappear')
  $(targetSelector)
    .find('.map-open-button')
    .css('display', 'none')
  $(targetSelector)
    .find('.map-open-button')
    .removeClass('highlight-map-open-button')

  const activateMap = () => {
    var animationEvent =
        'webkitAnimationEnd oanimationend msAnimationEnd animationend'
    $(targetSelector)
      .find('.overlay')
      .one(animationEvent, function (event) {
        $(targetSelector)
          .find('.overlay')
          .removeClass('disappear')
        $(targetSelector)
          .find('.overlay')
          .css('display', 'none')

        mapNavigationControl = new mapboxgl.NavigationControl({
          showCompass: false
        })

        map.addControl(mapNavigationControl, 'bottom-right')

        $(targetSelector)
          .find('.map-close-button')
          .css('display', 'block')
      })
  }

  if (isMobileDevice()) {
    animateFullScreen(targetSelector, map, activateMap)
  } else {
    activateMap()
  }
}

function setPassiveMode (targetSelector, map) {
  // check if popup exist otherwise remove function returns error
  if (countryInfo__mapboxPopup != undefined) {
    countryInfo__mapboxPopup.remove()
  }

  $(targetSelector)
    .find('.map-close-button')
    .css('display', 'none')
  $(targetSelector)
    .find('.share-menu-container')
    .css('display', 'none')
  setShareMenuState(targetSelector)
  $(targetSelector)
    .find('.legend-container')
    .css('display', 'none')
  $(targetSelector)
    .find('#legend-button')
    .removeClass('legend-button-closed legend-button-open')
    .addClass('legend-button-closed')
  setLegendState(targetSelector)
  $(targetSelector)
    .find('.overlay')
    .css('display', 'block')
  $(targetSelector)
    .find('.overlay')
    .removeClass('disappear')
    .addClass('appear')

  const deactivateMap = () => {
    var animationEvent =
        'webkitAnimationEnd oanimationend msAnimationEnd animationend'
    $(targetSelector)
      .find('.overlay')
      .one(animationEvent, function (event) {
        map.flyTo({ center: initialCenter, zoom: initialZoom })
        $(targetSelector)
          .find('.overlay')
          .removeClass('appear')
        $(targetSelector)
          .find('.map-open-button')
          .css('display', 'block')

        map.removeControl(mapNavigationControl)
      })
  }

  if (isMobileDevice()) {
    animateFullScreen(targetSelector, map, deactivateMap)
  } else {
    deactivateMap()
  }
}

function addLegend (targetSelector) {
  const legend = $(targetSelector).find('.nrcstat-country-dashboard-map-legend')

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
        
        <p><span class="source">Kilde: UNHCR, IDMC </span></p>
        <p style="margin: 10px 0 -6px -1px;"><span class="credit">Utviklet av <a href="htttps://www.binarylights.com" target="_blank">Binary Lights</a>.</span></p>
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

function setLegendState (targetSelector) {
  if (
    $(targetSelector)
      .find('#legend-button')
      .hasClass('legend-button-closed')
  ) { mobileLegendActive = false } else if (
    $(targetSelector)
      .find('#legend-button')
      .hasClass('legend-button-open')
  ) { mobileLegendActive = true }
}

function setShareMenuState (targetSelector) {
  if (
    $(targetSelector)
      .find('.share-menu-container')
      .css('display') != 'none'
  ) { mobileShareMenuActive = true } else mobileShareMenuActive = false
}

function addShareMenu (targetSelector) {
  const shareMenu = $(targetSelector).find('.map-share')

  shareMenu.append(`
          <div class="share-button-container">
              <div class="map-share-button"><img class="share-icon"></div>
          </div>
          <div class="share-menu-container"></div>
      `)

  const fbUrl = facebookHandler(targetSelector)
  const liUrl = linkedinHandler(targetSelector)
  const twUrl = twitterHandler(targetSelector)

  const fullShareMenu = `      
        <table>
          <tr>
              <td class="handler facebook-link share-logo disable-selection"><a href="${fbUrl}" target="_blank"><img class="facebook-icon" src="" /></a></td>
              <td class="handler facebook-link disable-selection"><a href="${fbUrl}" target="_blank"> Facebook</a></td>
          </tr>
          <tr>
              <td class="handler linkedin-link share-logo disable-selection"><a href="${liUrl}" target="_blank"><img class="linkedin-icon" src="" /></a></td>
              <td class="handler linkedin-link disable-selection"><a href="${liUrl}" target="_blank"> Linkedin</a></td>
          </tr>
          <tr>
              <td class="handler twitter-link share-logo disable-selection"><a href="${twUrl}" target="_blank"><img class="twitter-icon" src="" /></a></td>
              <td class="handler twitter-link disable-selection"><a href="${twUrl}" target="_blank"> Twitter</a></td>
          </tr>
        </table>
        
      `

  shareMenu.find('.share-menu-container').append($(fullShareMenu))

  $('.facebook-icon').attr('src', facebookIcon)
  $('.linkedin-icon').attr('src', linkedinIcon)
  $('.twitter-icon').attr('src', twitterIcon)
  $('.share-icon').attr('src', shareIcon)

  shareMenu.find('.share-menu-container').css('display', 'none')

  shareMenu.find('.share-button-container').mousedown(function () {
    shareMenu.find('.share-menu-container').toggle()
    $(targetSelector)
      .find('.legend-container')
      .css('display', 'none')
    $(targetSelector)
      .find('#legend-button')
      .removeClass('legend-button-closed legend-button-open')
      .addClass('legend-button-closed')
    setShareMenuState(targetSelector)
    setLegendState(targetSelector)

    if (countryInfo__mapboxPopup != undefined) {
      countryInfo__mapboxPopup.remove()
    }
  })

  shareMenu
    .find('.facebook-link')
    .on('click', () => facebookHandler(targetSelector))
  shareMenu
    .find('.linkedin-link')
    .on('click', () => linkedinHandler(targetSelector))
  shareMenu
    .find('.twitter-link')
    .on('click', () => twitterHandler(targetSelector))
}

function facebookHandler (targetElementAttrId) {
  var originalWidgetUrlToShare = window.location.href.split('#')[0]
  if (targetElementAttrId) originalWidgetUrlToShare += targetElementAttrId
  var href =
      'https://api.nrcdata.no/api/widgets/global-displacement-radial-bar-chart-2019/render/false?orgWUrl=' +
      encodeURIComponent(originalWidgetUrlToShare)
  var url =
      'https://www.facebook.com/dialog/share?' +
      'app_id=1769614713251596' +
      '&display=popup' +
      '&href=' +
      encodeURIComponent(href)

  return url
}

function linkedinHandler (targetElementAttrId) {
  var originalWidgetUrlToShare = window.location.href.split('#')[0]
  if (targetElementAttrId) originalWidgetUrlToShare += targetElementAttrId
  var href =
      'https://api.nrcdata.no/api/widgets/global-displacement-radial-bar-chart-2019/render/false?orgWUrl=' +
      encodeURIComponent(originalWidgetUrlToShare)
  var url =
      'http://www.linkedin.com/shareArticle?' + 'url=' + href + '&mini=true'
  return url
}

function twitterHandler (targetElementAttrId) {
  var originalWidgetUrlToShare = window.location.href.split('#')[0]
  if (targetElementAttrId) originalWidgetUrlToShare += targetElementAttrId
  var href =
      'https://api.nrcdata.no/api/widgets/global-displacement-radial-bar-chart-2019/render/false?orgWUrl=' +
      encodeURIComponent(originalWidgetUrlToShare)
  var url = 'https://twitter.com/intent/tweet?' + 'text=' + href
  return url
}

const Mapboxgl = loadable.lib(() => import('mapbox-gl/dist/mapbox-gl.js'), { ssr: false })

if (isServer()) {
  console.log("i'm GlobalMap and i'm server")
} else {
  console.log("i'm GlobalMap and i'm client")
}

function Loader () {
  return (
    <Mapboxgl>
      {({ default: mapboxgl }) => <GlobalMap mapboxgl={mapboxgl} />}
    </Mapboxgl>
  )
}

function GlobalMap ({ mapboxgl }) {
  console.log('GlobalMap here')
  console.log('mapbox gl be like:')
  console.log(mapboxgl)
  const containerElementRef = useRef(null)
  const mapboxElementRef = useRef(null)
  const onReady = ref => {
    if (isServer()) return null

    // made popup global variable to be able to access it from setPassiveMode (needs to be removed before deactivating the map) - not sure it's a best solution??
    var countryInfo__mapboxPopup
    const initialCenter = isMobileDevice()
      ? [18.596136, 47.678121]
      : [23.639724, -2.799158]
    var mapNavigationControl
    var mobileLegendActive = false
    var mobileShareMenuActive = false
    let isCountryInfoPopupOrPopoverActive = false

    const beforeFullScreenCssProps = {}
    let beforeFullScreenBodyOverflowProp
    let beforeFullScreenNrcPageHeaderZIndex

    isFullScreen = false

    const targetSelector = '#nrcstat-mainmap-container'

    function calculateSizeFactor (figure) {
      if (figure < 100000) return [0.75, 'small']
      else if (figure >= 100000 && figure < 1000000) return [0.9, 'medium']
      else return [1.15, 'large']
    }

    // #region Country info (popover for mobile, popup for tablet/desktop)

    function countryInfo__showPopover (targetSelector, event) {
      var selectedCountryIso2 = event.features[0].properties.iso_a2
      const norwegianCountryName = norwegianCountryNames[selectedCountryIso2]

      const population = getCountryStat(selectedCountryIso2, 'population').data

      const statsTable = countryInfo__statsTable(selectedCountryIso2)

      const countryUrl = countryLinks[selectedCountryIso2]
      const countryLink = countryUrl
        ? `<p class="country-link"><a href="https://www.flyktninghjelpen.no/${countryUrl}" target="_blank">LES MER OM ${norwegianCountryName.toUpperCase()} HER</a></p>`
        : ''

      // close menu when popover opens

      $(targetSelector)
        .find('#legend-button')
        .attr('class', 'legend-button-closed')
      $(targetSelector)
        .find('.legend-container')
        .css('display', 'none')
      setLegendState(targetSelector)
      $(targetSelector)
        .find('.share-menu-container')
        .css('display', 'none')
      setShareMenuState(targetSelector)

      const popupHtml = `
        <div class="nrcstat-radialchartmap-country-info-popover-wrapper">
          <div class="popover-top-ribbon"></div>
          <span class="close-popover disable-selection"><img class="close-popup-img" src=" "></span>
          
          <div class="country-statistics">
               <p class="title">${norwegianCountryName}</p>
               <p class="population">FOLKETALL: ${population} millioner</p>
               <p class="statistics">${statsTable}</p>
               
               ${countryLink}
          </div>
        </div>
      `

      $(targetSelector).append(popupHtml)
      $('.close-popup-img').attr('src', closeButton)
      $(
        '.nrcstat-radialchartmap-country-info-popover-wrapper .close-popover'
      ).click(() => {
        closePopover()
        isCountryInfoPopupOrPopoverActive = false
      })
    }

    function closePopover () {
      $('.nrcstat-radialchartmap-country-info-popover-wrapper').remove()
    }

    function countryInfo__showPopup (event, map) {
      var selectedCountryIso2 = event.features[0].properties.iso_a2
      const norwegianCountryName = norwegianCountryNames[selectedCountryIso2]
      var fullCountryName = '<h1>' + norwegianCountryName + '</h1>'
      var loader = '<div class="loader"></div>'

      countryInfo__mapboxPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
      })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setHTML(
          '<div class="popup-container">' + fullCountryName + loader + '</div>'
        )
        .addTo(map)

      const statsTable = countryInfo__statsTable(selectedCountryIso2)

      const countryUrl = countryLinks[selectedCountryIso2]
      const countryLink = countryUrl
        ? `<p class="country-link"><a href="https://www.flyktninghjelpen.no/${countryUrl}" target="_blank">LES MER OM ${norwegianCountryName.toUpperCase()} HER</a></p>`
        : ''

      const population = getCountryStat(selectedCountryIso2, 'population').data
      const populationHtml = `<p class="population">FOLKETALL: ${population} millioner</p>`

      countryInfo__mapboxPopup.setHTML(
        '<div class="popup-container">' +
        fullCountryName +
        populationHtml +
        statsTable +
        countryLink +
        '</div>'
      )

      countryInfo__mapboxPopup.on('close', () => {
        isCountryInfoPopupOrPopoverActive = false
      })
    }

    function countryInfo__statsTable (iso2) {
      const countryStats = getCountryStats(iso2)

      let sections = [
        {
          icon: refugeesFromIcon,
          dataPoints: [
            {
              dataPointKey: 'totalRefugeesFromX',
              dataPointName: 'Totalt antall flyktninger fra'
            },
            {
              dataPointKey: 'newRefugeesFromXInYear',
              dataPointName: 'Nye i 2018'
            }
          ]
        },
        {
          icon: refugeesToIcon,
          dataPoints: [
            {
              dataPointKey: 'refugeesInXFromOtherCountriesInYear',
              dataPointName: 'Totalt antall flyktninger til'
            },
            {
              dataPointKey: 'newRefugeesInXFromOtherCountriesInYear',
              dataPointName: 'Nye i 2018'
            }
          ]
        },
        {
          icon: idpsIcon,
          dataPoints: [
            {
              dataPointKey: 'idpsInXInYear',
              dataPointName: 'Totalt antall internt fordrevne'
            },
            {
              dataPointKey: 'newIdpsInXInYear',
              dataPointName: 'Nye i 2018'
            }
          ]
        }
      ]
      sections = sections.map(section => {
        section.dataPoints = section.dataPoints.map(dp => {
          let dataPointValue = getCountryStat(iso2, dp.dataPointKey).data

          if (
            includes(
              [
                'percentageWomenFleeingToCountry',
                'percentageChildrenFleeingToCountry'
              ],
              dp.dataPointKey
            )
          ) { dataPointValue = formatDataPercentage(dataPointValue, 'nb_NO') } else dataPointValue = formatDataNumber(dataPointValue, 'nb_NO', true)

          Object.assign(dp, { dataPointValue })
          return dp
        })
        return section
      })

      const descriptionData = sections
        .map(
          section =>
          `<tr class="statistics-table-row">
          <td class="statistics-label"><img src="${section.icon}" /></td>
          <td align="left" class="statistics-number">
            ${section.dataPoints[0].dataPointName}: <strong>${
            section.dataPoints[0].dataPointValue
          }</strong><br />
            ${section.dataPoints[1].dataPointName}: <strong>${
            section.dataPoints[1].dataPointValue
          }</strong>
          </td>
        </tr>`
        )
        .join('\n')

      const table = `<table>${descriptionData}</table>`

      return table
    }

    $(targetSelector)
      .find('.overlay')
      .mousedown(function () {
        $(targetSelector)
          .find('.map-open-button')
          .addClass('highlight-map-open-button')
        $(targetSelector)
          .find('.map-open-button')
          .one(animationEvent, function (event) {
            $(this).removeClass('highlight-map-open-button')
          })
      })

    $(targetSelector)
      .find('.map-open-button')
      .click(function () {
        setActiveMode(targetSelector, map)
        isCountryInfoPopupOrPopoverActive = false
      })

    $(targetSelector)
      .find('.map-close-button')
      .click(function () {
        setPassiveMode(targetSelector, map)
        isCountryInfoPopupOrPopoverActive = false
      })

    addLegend(targetSelector)

    addShareMenu(targetSelector)

    loadStats()

    mapboxElementRef.current = ref
    mapboxgl.accessToken = 'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'
    var map = new mapboxgl.Map({
      container: ref,
      center: initialCenter,
      zoom: START_ZOOM,
      style: 'mapbox://styles/nrcmaps/cjx1qihkq00r81ctczmmai9ps',
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM
    })

    // disable map rotation
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    // change position of mapbox logo
    $(targetSelector)
      .find('.mapboxgl-ctrl-bottom-left')
      .removeClass('mapboxgl-ctrl-bottom-left')
      .addClass('mapboxgl-ctrl-bottom-right')

    map.on('load', function () {
      map.addSource('countries', {
        type: 'geojson',
        data: middleResolutionCountriesGeoJson
      })

      const sharedLayerProperties = {
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-opacity': 1
        },
        filter: ['==', 'iso_a2', '']
      }

      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted',
          paint: { 'fill-color': 'rgba(212,212,212,0.68)' }
        })
      )
      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted-nrc',
          paint: { 'fill-color': 'rgba(255,119,0,0.36)' }
        })
      )
      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted-blue',
          paint: { 'fill-color': 'rgba(212,212,212,0.84)' }
        })
      )

      function countryMouseMoveOverHandler (e) {
        const hoverCountryIso2 = e.features[0].properties.iso_a2

        if (
          countryInfo__hasData(hoverCountryIso2) ||
          e.features[0].properties.name == 'Kosovo'
        ) {
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', 'default')
        }

        map.setFilter('countries-highlighted-nrc', [
          '==',
          'iso_a2',
          _.includes(nrcCountryIso2, hoverCountryIso2) ? hoverCountryIso2 : ''
        ])
        map.setFilter('countries-highlighted-blue', [
          '==',
          'iso_a2',
          _.includes(blueCountryIso2, hoverCountryIso2) ? hoverCountryIso2 : ''
        ])
        const nrcAndBlueIso2 = nrcCountryIso2.concat(blueCountryIso2)
        map.setFilter('countries-highlighted', [
          '==',
          'iso_a2',
          !_.includes(nrcAndBlueIso2) ? hoverCountryIso2 : ''
        ])
      }

      // disable hover on mobile device otherwise country stays highlighted once popover is closed
      if (!isMobileDevice()) {
        map.on('mousemove', 'countries', countryMouseMoveOverHandler)
        map.on('mouseover', 'countries', countryMouseMoveOverHandler)
      }

      map.on('click', 'countries', function (event) {
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

      map.on('mouseleave', 'countries-highlighted', function () {
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', 'grab')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-webkit-grab')
        $(targetSelector)
          .find('.mapboxgl-canvas-container')
          .css('cursor', '-moz-grab')

        map.setFilter('countries-highlighted', ['==', 'iso_a2', ''])
        map.setFilter('countries-highlighted-blue', ['==', 'iso_a2', ''])
        map.setFilter('countries-highlighted-nrc', ['==', 'iso_a2', ''])
      })

      map.on('dragstart', function () {
        if (
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor') != 'default'
        ) {
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', 'grabbing')
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', '-webkit-grabbing')
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', '-moz-grabbing')
        }
      })

      map.on('dragend', function (event) {
        if (
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor') != 'default'
        ) {
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', 'grab')
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', '-webkit-grab')
          $(targetSelector)
            .find('.mapboxgl-canvas-container')
            .css('cursor', '-moz-grab')
        }
      })

      function getMaxSet3FigureFromData (iso) {
        const maxFigure = Math.max(
          ...[
            getCountryStat(iso, 'totalRefugeesFromX').data,
            getCountryStat(iso, 'refugeesInXFromOtherCountriesInYear').data,
            getCountryStat(iso, 'idpsInXInYear').data
          ]
        )
        return maxFigure
      }

      const geojson = {
        type: 'FeatureCollection',
        features: centroids.map(centroid => {
          const [sizeFactor, sizeClass] = calculateSizeFactor(
            getMaxSet3FigureFromData(centroid.iso)
          )
          console.log(sizeClass)
          console.log(getMaxSet3FigureFromData(centroid.iso))
          return {
            type: 'Feature',
            properties: {
              countryLabel: norwegianCountryNames[centroid.iso].toUpperCase(),
              countryShortLabel: centroid.iso,
              iso: centroid.iso,
              sizeFactor: sizeFactor,
              sizeClass: sizeClass,
              message: `${centroid.idmc_full_name} ${centroid.iso}`,
              iconSize: [30, 30]
            },
            geometry: {
              type: 'Point',
              coordinates: [...centroid.centroid].reverse()
            }
          }
        })
      }

      const elements = []

      function resizeChartsByZoom () {
        const baseSize = 280
        const zoom = map.getZoom()
        const zoomNormalized = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
        const factor = easing(zoomNormalized)
        const dimension = 30 + baseSize * factor
        const fontSize =
          MIN_COUNTRY_NAME_SIZE +
          factor * (MAX_COUNTRY_NAME_SIZE - MIN_COUNTRY_NAME_SIZE)
        const yOffsetSmall = -((dimension * 0.48) / 2 / fontSize)
        const yOffsetMedium = -((dimension * 0.57) / 2 / fontSize)
        const yOffsetLarge = -((dimension * 0.70) / 2 / fontSize)
        map.setLayoutProperty('country-labels-small', 'text-offset', [
          0.1,
          yOffsetSmall
        ])
        map.setLayoutProperty('country-labels-medium', 'text-offset', [
          0.1,
          yOffsetMedium
        ])
        map.setLayoutProperty('country-labels-large', 'text-offset', [
          0.1,
          yOffsetLarge
        ]);
        ['small', 'medium', 'large'].forEach(sizeClass => {
          map.setLayoutProperty(`country-labels-${sizeClass}`, 'text-field', [
            'get',
            zoom > 3 ? 'countryLabel' : 'countryShortLabel'
          ])
          map.setLayoutProperty(
            `country-labels-${sizeClass}`,
            'text-size',
            fontSize
          )
        })
        elements.forEach(el => {
          const sizeFactor = el.dataset.sizeFactor
          const adjustedDimension = dimension * sizeFactor
          el.style.width = adjustedDimension + 'px'
          el.style.height = adjustedDimension + 'px'
        })
      }

      map.on('zoom', throttle(resizeChartsByZoom, 10))
      map.addSource('country-labels-src', {
        type: 'geojson',
        data: geojson
      })

      map.addLayer({
        id: 'country-labels-small',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Helvetica Regular'],
          'text-max-width': 50,
          'text-line-height': 1
        },
        filter: ['==', 'sizeClass', 'small']
      })
      map.addLayer({
        id: 'country-labels-medium',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Helvetica Regular'],
          'text-max-width': 50,
          'text-line-height': 1
        },
        filter: ['==', 'sizeClass', 'medium']
      })
      map.addLayer({
        id: 'country-labels-large',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Helvetica Regular'],
          'text-max-width': 50,
          'text-line-height': 1
        },
        filter: ['==', 'sizeClass', 'large']
      })

      const hoverPopup = $(`
      <div class="global-displacement-radial-bar-chart-tooltip">
        <div class="top">Totalt</div>
        <div class="data"></div>
      </div>`)
      $('body').append(hoverPopup)
      const showTooltip = countryCode => e => {
        if (map.getZoom() < 3) return
        if (isCountryInfoPopupOrPopoverActive) return
        const dataHtml = [
          {
            color: 'rgba(114,199,231,0.72)',
            data: getCountryStat(countryCode, 'idpsInXInYear').data
          },
          {
            color: 'rgba(255,121,0,0.72)',
            data: getCountryStat(countryCode, 'totalRefugeesFromX').data
          },
          {
            color: 'rgba(253,200,47,0.72)',
            data: getCountryStat(
              countryCode,
              'refugeesInXFromOtherCountriesInYear'
            ).data
          }
        ]
          .sort((a, b) => b.data - a.data)
          .map(d => {
            return { ...d, data: formatDataNumber(d.data, 'nb_NO') }
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

      geojson.features.forEach(function (marker) {
        var el = document.createElement('div')
        const iso = marker.properties.iso
        el.style.backgroundImage = `url(${radialBarChartsMap[iso]})`
        el.style.backgroundSize = 'cover'
        el.style.overflow = 'hidden'

        if (!isMobileDevice()) {
          el.addEventListener('mouseenter', showTooltip(marker.properties.iso))
          el.addEventListener('mousemove', showTooltip(marker.properties.iso))
          el.addEventListener('mouseout', hideTooltip)
        }

        el.dataset.sizeFactor = marker.properties.sizeFactor

        elements.push(el)

        const centroidFromLeonardoData = centroidsRaw.filter(
          centroid => centroid.iso === iso
        )
        if (centroidFromLeonardoData.length > 0) {
          const leonardoCentroid = centroidFromLeonardoData[0]
          /* const boundingBox = leonardoCentroid;
          const [west, south, east, north] = boundingBox;
          const midX = (west + east) / 2;
          const midY = (north + south) / 2;

          new mapboxgl.Marker(el).setLngLat([midY, midX]).addTo(map);
          */
          new mapboxgl.Marker(el)
            .setLngLat([...leonardoCentroid.centroid].reverse())
            .addTo(map)
        }
      })
      resizeChartsByZoom()
    })
  }
  return (
    <div id='nrcstat-mainmap-container' ref={containerElementRef}>
      <button className='map-open-button' type='button'>Utforsk kart</button>
      <button className='map-close-button' style={{ display: 'none' }} type='button'>Avslutt utforskning</button>
      <div className='map-share' />
      <div
        className='nrcstat-static-global-displacement-radial-bar-chart-map'
        ref={onReady}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}
      >
        <div className='overlay' />
        <div className='nrcstat-country-dashboard-map-legend' />
      </div>
    </div>
  )
}

export default Loader
