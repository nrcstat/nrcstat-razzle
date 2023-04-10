import React, { useRef, useContext } from 'react'
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
  throttle,
} from 'lodash'
import BezierEasing from 'bezier-easing'
import * as $ from 'jquery'
import { useTranslation } from 'react-i18next'

import {
  formatDataNumber,
  formatDataPercentage,
  isMobileDevice,
} from '@/util/widgetHelpers.js'

import './GlobalMap.scss'

import { loadWidgetData } from './loadWidgetData.js'

import { isServer, isClient } from '@/util/utils'
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

import gazaGeoJson from './assets/json//gaza.json'
import middleResolutionCountriesGeoJson from './assets/json/ne_110m_admin_0_countries.json'
import centroidsRaw from './assets/json/geo_entities_updated_manually.json'
import COUNTRIES from './assets/json/radial_bar_map_countries_to_display.json'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
middleResolutionCountriesGeoJson.features.push(gazaGeoJson.features[0])

const reqNbNo = require.context(
  './assets/pre-rendered-radial-bar-charts/nb-NO',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapNbNo = chain(
  reqNbNo.keys().map((file) => ({
    file: reqNbNo(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqEnGb = require.context(
  './assets/pre-rendered-radial-bar-charts/en-GB',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapEnGb = chain(
  reqEnGb.keys().map((file) => ({
    file: reqEnGb(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqSvSe = require.context(
  './assets/pre-rendered-radial-bar-charts/sv-SE',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapSvSe = chain(
  reqSvSe.keys().map((file) => ({
    file: reqSvSe(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqNbNo2020 = require.context(
  './assets/pre-rendered-radial-bar-charts-2020/nb-NO',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapNbNo2020 = chain(
  reqNbNo2020.keys().map((file) => ({
    file: reqNbNo2020(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqEnGb2020 = require.context(
  './assets/pre-rendered-radial-bar-charts-2020/en-GB',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapEnGb2020 = chain(
  reqEnGb2020.keys().map((file) => ({
    file: reqEnGb2020(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqSvSe2020 = require.context(
  './assets/pre-rendered-radial-bar-charts-2020/sv-SE',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapSvSe2020 = chain(
  reqSvSe2020.keys().map((file) => ({
    file: reqSvSe2020(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqNbNo2021 = require.context(
  './assets/pre-rendered-radial-bar-charts-2021/nb-NO',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapNbNo2021 = chain(
  reqNbNo2021.keys().map((file) => ({
    file: reqNbNo2021(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqEnGb2021 = require.context(
  './assets/pre-rendered-radial-bar-charts-2021/en-GB',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapEnGb2021 = chain(
  reqEnGb2021.keys().map((file) => ({
    file: reqEnGb2021(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const reqSvSe2021 = require.context(
  './assets/pre-rendered-radial-bar-charts-2021/sv-SE',
  false
)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const radialBarChartsMapSvSe2021 = chain(
  reqSvSe2021.keys().map((file) => ({
    file: reqSvSe2021(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()

const radialBarChartsMap = {
  'en-GB': radialBarChartsMapEnGb,
  'nb-NO': radialBarChartsMapNbNo,
  'sv-SE': radialBarChartsMapSvSe,
}
const radialBarChartsMap2020 = {
  'en-GB': radialBarChartsMapEnGb2020,
  'nb-NO': radialBarChartsMapNbNo2020,
  'sv-SE': radialBarChartsMapSvSe2020,
}
const radialBarChartsMap2021 = {
  'en-GB': radialBarChartsMapEnGb2021,
  'nb-NO': radialBarChartsMapNbNo2021,
  'sv-SE': radialBarChartsMapSvSe2021,
}

let countryStatsCache = null
let isFullScreen
const nrcCountryIso2 = {
  'nb-NO': [
    'AF',
    'BD',
    'BF',
    'CO',
    'CF',
    'DJ',
    'CD',
    'EC',
    'SV',
    'ER',
    'ET',
    'GT',
    'HN',
    'IQ',
    'IR',
    'YE',
    'JO',
    'CM',
    'KE',
    'LB',
    'LY',
    'ML',
    'MX',
    'MZ',
    'MM',
    'NE',
    'NG',
    'PS',
    'PA',
    'SO',
    'SD',
    'SY',
    'SS',
    'TZ',
    'UG',
    'UA',
    'VE',
  ],
  'en-GB': [
    'AF',
    'BD',
    'BF',
    'CO',
    'CF',
    'DJ',
    'CD',
    'EC',
    'SV',
    'ER',
    'ET',
    'GT',
    'HN',
    'IQ',
    'IR',
    'YE',
    'JO',
    'CM',
    'KE',
    'LB',
    'LY',
    'ML',
    'MX',
    'MZ',
    'MM',
    'NE',
    'NG',
    'PS',
    'PA',
    'SO',
    'SD',
    'SY',
    'SS',
    'TZ',
    'UG',
    'UA',
    'VE',
  ],
  'sv-SE': [
    'AF',
    'BD',
    'BF',
    'CO',
    'CF',
    'DJ',
    'CD',
    'EC',
    'SV',
    'ER',
    'ET',
    'GT',
    'HN',
    'IQ',
    'IR',
    'YE',
    'JO',
    'CM',
    'KE',
    'LB',
    'LY',
    'ML',
    'MX',
    'MZ',
    'MM',
    'NE',
    'NG',
    'PS',
    'PA',
    'SO',
    'SD',
    'SY',
    'SS',
    'TZ',
    'UG',
    'UA',
    'VE',
  ],
}
const blueCountryIso2 = {
  'nb-NO': [
    'AO',
    'AZ',
    'AU',
    'BI',
    'CA',
    'EG',
    'PH',
    'FR',
    'GM',
    'GR',
    'IN',
    'IL',
    'IT',
    'CN',
    'CG',
    'NO',
    'PK',
    'RW',
    'SD',
    'SE',
    'TD',
    'TR',
    'DE',
    'US',
    'VN',
    'AT',
    'ZA',
  ],
  'en-GB': [],
  'sv-SE': [
    'AO',
    'AZ',
    'AU',
    'BI',
    'CA',
    'EG',
    'PH',
    'FR',
    'GM',
    'GR',
    'IN',
    'IL',
    'IT',
    'CN',
    'CG',
    'NO',
    'PK',
    'RW',
    'SD',
    'SE',
    'TD',
    'TR',
    'DE',
    'US',
    'VN',
    'AT',
    'ZA',
  ],
}

const toggleFullScreenAnimationDuration = 300

const MIN_ZOOM = 2
const MAX_ZOOM = 6
const START_ZOOM = MIN_ZOOM
const MIN_COUNTRY_NAME_SIZE = 8
const MAX_COUNTRY_NAME_SIZE = 26

// const easing = BezierEasing(0.34, 0.58, 0.62, 1.11)
const easingOpacity = BezierEasing(0.27, 1, 0.75, 0.72)
const easing = BezierEasing(0.21, 0.55, 0.81, 0.35)

const animationEvent =
  'webkitAnimationEnd oanimationend msAnimationEnd animationend'

// Only show centroids for which we have data from api.nrcdata.no (i.e. centroid's country is in COUNTRIES)
const centroids = centroidsRaw
  .filter((centroid) => COUNTRIES.includes(centroid.iso))
  .filter((centroid) =>
    middleResolutionCountriesGeoJson.features
      .map((v) => v.properties.iso_a2)
      .includes(centroid.iso)
  )

function getCountryStats(countryIso2Code) {
  if (typeof countryStatsCache) {
    return countryStatsCache.filter((c) => c.countryCode === countryIso2Code)
  } else {
    return null
  }
}

function getCountryStat(countryIso2Code, dataPoint) {
  const stats = getCountryStats(countryIso2Code)
  if (!stats) return null
  const data = stats.filter((d) => d.dataPoint === dataPoint)
  if (data && data.length > 0) return data[0]
  return null
}

function countryInfo__hasData(iso2) {
  return !!_.find(countryStatsCache, (c) => c.countryCode === iso2)
}

// #endregion

// #region Map legend

const Mapboxgl = loadable.lib(() => import('mapbox-gl/dist/mapbox-gl.js'), {
  ssr: false,
})

function Loader() {
  return (
    <Mapboxgl>
      {({ default: mapboxgl }) => <GlobalMap mapboxgl={mapboxgl} />}
    </Mapboxgl>
  )
}

function GlobalMap({ mapboxgl }) {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { periodYear, preloadedWidgetData, locale } = widgetParams
  const t = getNsFixedT([
    'Widget.Static.GlobalRadialBarChartDisplacementMap',
    'GeographicalNames',
    'Widget.Static.GlobalRadialBarChartDisplacementMap.ADMIN-SETTINGS-ONLY-ADMINS-TOUCH-THIS',
  ])

  const containerElementRef = useRef(null)
  const mapboxElementRef = useRef(null)
  const onReady = (ref) => {
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

    let beforeFullScreenCssProps = {}
    let beforeFullScreenBodyOverflowProp
    let beforeFullScreenNrcPageHeaderZIndex

    isFullScreen = false

    const targetSelector = '.nrcstat__mainmap__container'

    function calculateSizeFactor(figure) {
      if (figure < 100000) return [0.75, 'small']
      else if (figure >= 100000 && figure < 1000000) return [0.9, 'medium']
      else return [1.15, 'large']
    }

    // #region Country info (popover for mobile, popup for tablet/desktop)

    function countryInfo__showPopover(targetSelector, event) {
      var selectedCountryIso2 = event.features[0].properties.iso_a2
      const countryName = t(
        `NRC.Web.StaticTextDictionary.Contries.${selectedCountryIso2}`
      )

      const population = getCountryStat(selectedCountryIso2, 'population').data

      const statsTable = countryInfo__statsTable(selectedCountryIso2)

      let countryLink = ''

      const countriesWithReadMoreLink = t(
        'CountryStatisticsPopup.countriesWithReadMoreLink'
      )
        .split('\n')
        .filter((countryCode) => countryCode)
      if (countriesWithReadMoreLink.includes(selectedCountryIso2)) {
        const countryUrl = t(
          `CountryStatisticsPopup.CountryReadMoreLink.${selectedCountryIso2}`
        )
        if (countryUrl) {
          countryLink = `<p class="country-link"><a href="${countryUrl}" target="_blank">${t(
            'countryInfoPopup.readMoreAboutCountryLink',
            { countryName: countryName }
          )}</a></p>`
        }
      }

      // close menu when popover opens

      $(targetSelector)
        .find('#legend-button')
        .attr('class', 'legend-button-closed')
      $(targetSelector).find('.nrcstat__mainmap__legend').css('display', 'none')
      setLegendState(targetSelector)
      $(targetSelector).find('.share-menu-container').css('display', 'none')
      setShareMenuState(targetSelector)

      const popupHtml = `
        <div class="nrcstat-radialchartmap-country-info-popover-wrapper">
          <div class="popover-top-ribbon"></div>
          <span class="close-popover disable-selection"><img class="close-popup-img" src=" "></span>
          
          <div class="country-statistics">
               <p class="title">${countryName}</p>
               <p class="population">${t('countryInfoPopup.population', {
                 populationInMillions: population,
               })}</p>
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
        $('.nrcstat-radialchartmap-country-info-popover-wrapper').remove()
        isCountryInfoPopupOrPopoverActive = false
      })
    }

    function setActiveMode(targetSelector, map) {
      $(targetSelector).find('.nrcstat__mainmap__overlay').addClass('disappear')
      $(targetSelector)
        .find('.nrcstat__mainmap__open-button')
        .css('display', 'none')
      $(targetSelector)
        .find('.nrcstat__mainmap__open-button')
        .removeClass('highlight-map-open-button')

      const activateMap = () => {
        $(targetSelector)
          .find('.nrcstat__mainmap__overlay')
          .one(animationEvent, function (event) {
            $(targetSelector)
              .find('.nrcstat__mainmap__overlay')
              .removeClass('disappear')
            $(targetSelector)
              .find('.nrcstat__mainmap__overlay')
              .css('display', 'none')

            mapNavigationControl = new mapboxgl.NavigationControl({
              showCompass: false,
            })

            map.addControl(mapNavigationControl, 'bottom-right')

            $(targetSelector)
              .find('.nrcstat__mainmap__close-button')
              .css('display', 'block')
          })
      }

      if (isMobileDevice()) {
        animateFullScreen(targetSelector, map, activateMap)
      } else {
        activateMap()
      }
    }

    function setPassiveMode(targetSelector, map) {
      // check if popup exist otherwise remove function returns error
      if (countryInfo__mapboxPopup != undefined) {
        countryInfo__mapboxPopup.remove()
      }

      $(targetSelector)
        .find('.nrcstat__mainmap__close-button')
        .css('display', 'none')
      $(targetSelector).find('.share-menu-container').css('display', 'none')
      setShareMenuState(targetSelector)
      $(targetSelector).find('.legend-container').css('display', 'none')
      $(targetSelector)
        .find('#legend-button')
        .removeClass('legend-button-closed legend-button-open')
        .addClass('legend-button-closed')
      setLegendState(targetSelector)
      $(targetSelector)
        .find('.nrcstat__mainmap__overlay')
        .css('display', 'block')
      $(targetSelector)
        .find('.nrcstat__mainmap__overlay')
        .removeClass('disappear')
        .addClass('appear')

      const deactivateMap = () => {
        $(targetSelector)
          .find('.nrcstat__mainmap__overlay')
          .one(animationEvent, function (event) {
            map.flyTo({ center: initialCenter, zoom: START_ZOOM })
            $(targetSelector)
              .find('.nrcstat__mainmap__overlay')
              .removeClass('appear')
            $(targetSelector)
              .find('.nrcstat__mainmap__open-button')
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

    function animateFullScreen(elm, map, callbackCb) {
      const target = $(elm)

      if (!isFullScreen) {
        beforeFullScreenNrcPageHeaderZIndex =
          $('header.page-header').css('z-index')
        $('header.page-header').css('z-index', 0)

        beforeFullScreenBodyOverflowProp = $('body').css('overflow')
        $('body').css('overflow', 'hidden')

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        const { top: topOffset, left: leftOffset } = target.offset()
        const scrollTop = $(document).scrollTop()

        beforeFullScreenCssProps = {
          top: target.css('top'),
          left: target.css('left'),
          width: target.css('width'),
          height: target.css('height'),
        }
        const newProps = {
          top: `${-Math.floor(topOffset - scrollTop)}px`,
          left: `-${leftOffset}px`,
          width: `${windowWidth}px`,
          height: `${windowHeight}px`,
        }
        target.animate(newProps, toggleFullScreenAnimationDuration, () => {
          isFullScreen = true
          map.resize()
          callbackCb()
        })
      } else {
        $('body').css('overflow', beforeFullScreenBodyOverflowProp)

        $('header.page-header').css(
          'z-index',
          beforeFullScreenNrcPageHeaderZIndex
        )
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

    function setLegendState(targetSelector) {
      if (
        $(targetSelector)
          .find('#legend-button')
          .hasClass('legend-button-closed')
      ) {
        mobileLegendActive = false
      } else if (
        $(targetSelector).find('#legend-button').hasClass('legend-button-open')
      ) {
        mobileLegendActive = true
      }
    }

    function setShareMenuState(targetSelector) {
      if (
        $(targetSelector).find('.share-menu-container').css('display') != 'none'
      ) {
        mobileShareMenuActive = true
      } else mobileShareMenuActive = false
    }

    // #region Country info (popup for tablet/desktop)

    function countryInfo__showPopup(event, map) {
      var selectedCountryIso2 = event.features[0].properties.iso_a2
      const countryName = t(
        `NRC.Web.StaticTextDictionary.Contries.${selectedCountryIso2}`
      )
      var fullCountryName = '<h1>' + countryName + '</h1>'
      var loader = '<div class="loader"></div>'

      countryInfo__mapboxPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      })
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .setHTML(
          '<div class="popup-container">' + fullCountryName + loader + '</div>'
        )
        .addTo(map)

      const statsTable = countryInfo__statsTable(selectedCountryIso2)

      let countryLink = ''

      const countriesWithReadMoreLink = t(
        'CountryStatisticsPopup.countriesWithReadMoreLink'
      )
        .split('\n')
        .filter((countryCode) => countryCode)
      if (countriesWithReadMoreLink.includes(selectedCountryIso2)) {
        const countryUrl = t(
          `CountryStatisticsPopup.CountryReadMoreLink.${selectedCountryIso2}`
        )
        if (countryUrl) {
          countryLink = `<p class="country-link"><a href="${countryUrl}" target="_blank">${t(
            'countryInfoPopup.readMoreAboutCountryLink',
            { countryName: countryName }
          )}</a></p>`
        }
      }

      const population = getCountryStat(selectedCountryIso2, 'population').data
      const populationHtml = `<p class="population">${t(
        'countryInfoPopup.population',
        { populationInMillions: population }
      )}</p>`

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

    function countryInfo__statsTable(iso2) {
      const countryStats = getCountryStats(iso2)

      let sections = [
        {
          icon: refugeesFromIcon,
          dataPoints: [
            {
              dataPointKey: 'totalRefugeesFromX',
              dataPointName: t('countryInfoPopup.totalNumberRefugeesFrom'),
            },
            {
              dataPointKey: 'newRefugeesFromXInYear',
              dataPointName: t('countryInfoPopup.newInYearX', {
                year: periodYear,
              }),
            },
          ],
        },
        {
          icon: refugeesToIcon,
          dataPoints: [
            {
              dataPointKey: 'refugeesInXFromOtherCountriesInYear',
              dataPointName: t('countryInfoPopup.totalNumberRefugeesTo'),
            },
            {
              dataPointKey: 'newRefugeesInXFromOtherCountriesInYear',
              dataPointName: t('countryInfoPopup.newInYearX', {
                year: periodYear,
              }),
            },
          ],
        },
        {
          icon: idpsIcon,
          dataPoints: [
            {
              dataPointKey: 'idpsInXInYear',
              dataPointName: t('countryInfoPopup.totalNumberIdps'),
            },
            {
              dataPointKey: 'newIdpsInXInYear',
              dataPointName: t('countryInfoPopup.newInYearX', {
                year: periodYear,
              }),
            },
          ],
        },
      ]
      sections = sections.map((section) => {
        section.dataPoints = section.dataPoints.map((dp) => {
          let dataPointValue = getCountryStat(iso2, dp.dataPointKey).data

          if (
            includes(
              [
                'percentageWomenFleeingToCountry',
                'percentageChildrenFleeingToCountry',
              ],
              dp.dataPointKey
            )
          ) {
            dataPointValue = formatDataPercentage(dataPointValue, 'nb-NO')
          } else
            dataPointValue = formatDataNumber(dataPointValue, 'nb-NO', true)

          Object.assign(dp, { dataPointValue })
          return dp
        })
        return section
      })

      const descriptionData = sections
        .map(
          (section) =>
            `<tr class="statistics-table-row">
          <td class="statistics-label"><img src="${section.icon}" /></td>
          <td align="left" class="statistics-number">
            ${section.dataPoints[0].dataPointName}: <strong>${section.dataPoints[0].dataPointValue}</strong><br />
            ${section.dataPoints[1].dataPointName}: <strong>${section.dataPoints[1].dataPointValue}</strong>
          </td>
        </tr>`
        )
        .join('\n')

      const table = `<table>${descriptionData}</table>`

      return table
    }

    $(targetSelector)
      .find('.nrcstat__mainmap__overlay')
      .mousedown(function () {
        $(targetSelector)
          .find('.nrcstat__mainmap__open-button')
          .addClass('highlight-map-open-button')
        $(targetSelector)
          .find('.nrcstat__mainmap__open-button')
          .one(animationEvent, function (event) {
            $(this).removeClass('highlight-map-open-button')
          })
      })

    $(targetSelector)
      .find('.nrcstat__mainmap__open-button')
      .click(function () {
        setActiveMode(targetSelector, map)
        isCountryInfoPopupOrPopoverActive = false
      })

    $(targetSelector)
      .find('.nrcstat__mainmap__close-button')
      .click(function () {
        setPassiveMode(targetSelector, map)
        isCountryInfoPopupOrPopoverActive = false
      })

    function addLegend(targetSelector) {
      const legend = $(targetSelector).find('.nrcstat__mainmap__legend')

      if (isMobileDevice()) {
        addLegendMobile(legend)
      } else {
        addLegendTabletDesktop(legend)
      }

      $(targetSelector)
        .find('.legend-button-container')
        .click(function () {
          $(targetSelector).find('.share-menu-container').css('display', 'none')
          setShareMenuState(targetSelector)
          $(targetSelector).find('.legend-container').toggle()
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
              <td class="legend-text">${t(
                'legend.totalNumberRefugeesFromCountry'
              )}</td>
          </tr>
          <tr>
              <td><span class="refugeesTo-dot"></span></td>
              <td class="legend-text">${t(
                'legend.totalNumberRefugeesToCountry'
              )}</td>
          </tr>
          <tr>
              <td><span class="idps-dot"></span></td>
              <td class="legend-text">${t(
                'legend.totalNumberIdpsInCountry'
              )}</td>
          </tr>
        </table>
        
        <p><span class="source">${t('legend.source')}</span></p>
        <p style="margin: 10px 0 -6px -1px;"><span class="credit">${t(
          'legend.developedByBinaryLights'
        )}</span></p>
      `

    function addLegendMobile(legend) {
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
      $(legend).find('.legend-container').append($(fullLegend))
    }

    function addLegendTabletDesktop(legend) {
      $(legend).append(
        '<div id="legend-container" class="legend-container-desktop"></div>'
      )
      $(legend).find('.legend-container-desktop').append($(fullLegend))
    }

    function addShareMenu(targetSelector) {
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
        $(targetSelector).find('.legend-container').css('display', 'none')
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

    function facebookHandler(targetElementAttrId) {
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

    function linkedinHandler(targetElementAttrId) {
      var originalWidgetUrlToShare = window.location.href.split('#')[0]
      if (targetElementAttrId) originalWidgetUrlToShare += targetElementAttrId
      var href =
        'https://api.nrcdata.no/api/widgets/global-displacement-radial-bar-chart-2019/render/false?orgWUrl=' +
        encodeURIComponent(originalWidgetUrlToShare)
      var url =
        'http://www.linkedin.com/shareArticle?' + 'url=' + href + '&mini=true'
      return url
    }

    function twitterHandler(targetElementAttrId) {
      var originalWidgetUrlToShare = window.location.href.split('#')[0]
      if (targetElementAttrId) originalWidgetUrlToShare += targetElementAttrId
      var href =
        'https://api.nrcdata.no/api/widgets/global-displacement-radial-bar-chart-2019/render/false?orgWUrl=' +
        encodeURIComponent(originalWidgetUrlToShare)
      var url = 'https://twitter.com/intent/tweet?' + 'text=' + href
      return url
    }

    addLegend(targetSelector)

    addShareMenu(targetSelector)

    if (preloadedWidgetData) {
      countryStatsCache = preloadedWidgetData
    } else {
      loadWidgetData(widgetParams)
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

    let mapboxStyle
    if (locale === 'nb-NO' || locale === 'sv-SE' || locale === 'de-DE') {
      mapboxStyle = 'mapbox://styles/nrcmaps/ckbhz9yj30zxx1imwrkxsyii2'
    } else if (locale === 'en-GB') {
      mapboxStyle = 'mapbox://styles/nrcmaps/ckbkyfeyn122k1ip8oxabxgvp'
    } else {
      console.log(
        'locale used with GlobalMap for which no locale is yet defined, talk to Eric'
      )
      isClient() &&
        window.alert(
          'locale used with GlobalMap for which no locale is yet defined, talk to Eric'
        )
    }

    mapboxElementRef.current = ref
    mapboxgl.accessToken =
      'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ'
    var map = new mapboxgl.Map({
      container: ref,
      center: initialCenter,
      zoom: START_ZOOM,
      style: mapboxStyle,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
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
        data: middleResolutionCountriesGeoJson,
      })

      const sharedLayerProperties = {
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-opacity': 1,
        },
        filter: ['==', 'iso_a2', ''],
      }

      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted',
          paint: { 'fill-color': 'rgba(251, 251, 251, 1)' },
        })
      )
      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted-nrc',
          paint: { 'fill-color': 'rgba(255,119,0,0.36)' },
        })
      )
      map.addLayer(
        Object.assign(sharedLayerProperties, {
          id: 'countries-highlighted-blue',
          paint: { 'fill-color': 'rgba(212,212,212,0.84)' },
        })
      )

      function countryMouseMoveOverHandler(e) {
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
          _.includes(nrcCountryIso2[locale], hoverCountryIso2)
            ? hoverCountryIso2
            : '',
        ])
        map.setFilter('countries-highlighted-blue', [
          '==',
          'iso_a2',
          _.includes(blueCountryIso2[locale], hoverCountryIso2)
            ? hoverCountryIso2
            : '',
        ])
        const nrcAndBlueIso2 = nrcCountryIso2[locale].concat(
          blueCountryIso2[locale]
        )
        map.setFilter('countries-highlighted', [
          '==',
          'iso_a2',
          !_.includes(nrcAndBlueIso2) ? hoverCountryIso2 : '',
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

        if (mobileLegendActive) {
          $(targetSelector).find('.legend-container').css('display', 'none')
          $(targetSelector)
            .find('#legend-button')
            .removeClass('legend-button-closed legend-button-open')
            .addClass('legend-button-closed')
          setLegendState(targetSelector)
          $(targetSelector).find('.share-menu-container').css('display', 'none')
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
          $(targetSelector).find('.legend-container').css('display', 'none')
          $(targetSelector)
            .find('#legend-button')
            .removeClass('legend-button-closed legend-button-open')
            .addClass('legend-button-closed')
          setLegendState(targetSelector)
          $(targetSelector).find('.share-menu-container').css('display', 'none')
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
          $(targetSelector).find('.mapboxgl-canvas-container').css('cursor') !=
          'default'
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
          $(targetSelector).find('.mapboxgl-canvas-container').css('cursor') !=
          'default'
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

      function getMaxSet3FigureFromData(iso) {
        const maxFigure = Math.max(
          ...[
            getCountryStat(iso, 'totalRefugeesFromX').data,
            getCountryStat(iso, 'refugeesInXFromOtherCountriesInYear').data,
            getCountryStat(iso, 'idpsInXInYear').data,
          ]
        )
        return maxFigure
      }

      const geojson = {
        type: 'FeatureCollection',
        features: centroids.map((centroid) => {
          const [sizeFactor, sizeClass] = calculateSizeFactor(
            getMaxSet3FigureFromData(centroid.iso)
          )
          return {
            type: 'Feature',
            properties: {
              countryLabel: t(
                `NRC.Web.StaticTextDictionary.Contries.${centroid.iso}`
              ),
              countryShortLabel: centroid.iso,
              iso: centroid.iso,
              sizeFactor: sizeFactor,
              sizeClass: sizeClass,
              message: `${centroid.idmc_full_name} ${centroid.iso}`,
              iconSize: [30, 30],
            },
            geometry: {
              type: 'Point',
              coordinates: [...centroid.centroid].reverse(),
            },
          }
        }),
      }

      const elements = []

      function resizeChartsByZoom() {
        const baseSize = 280
        const zoom = map.getZoom()
        const zoomNormalized = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)
        const factor = easing(zoomNormalized)
        const factorOpacity = easing(zoomNormalized)
        const dimension = 30 + baseSize * factor
        const fontSize =
          MIN_COUNTRY_NAME_SIZE +
          factor * (MAX_COUNTRY_NAME_SIZE - MIN_COUNTRY_NAME_SIZE)
        const yOffsetSmall = -((dimension * 0.48) / 2 / fontSize)
        const yOffsetMedium = -((dimension * 0.57) / 2 / fontSize)
        const yOffsetLarge = -((dimension * 0.7) / 2 / fontSize)
        map.setLayoutProperty('country-labels-small', 'text-offset', [
          0.1,
          yOffsetSmall,
        ])
        map.setLayoutProperty('country-labels-medium', 'text-offset', [
          0.1,
          yOffsetMedium,
        ])
        map.setLayoutProperty('country-labels-large', 'text-offset', [
          0.1,
          yOffsetLarge,
        ])
        ;['small', 'medium', 'large'].forEach((sizeClass) => {
          map.setLayoutProperty(`country-labels-${sizeClass}`, 'text-field', [
            'get',
            zoom > 3 ? 'countryLabel' : 'countryShortLabel',
          ])
          map.setLayoutProperty(
            `country-labels-${sizeClass}`,
            'text-size',
            fontSize
          )
        })
        elements.forEach((el) => {
          const sizeFactor = el.dataset.sizeFactor
          const adjustedDimension = dimension * sizeFactor
          var adjustedOpacity = 0
          if (factorOpacity > 0.5) {
            adjustedOpacity = factorOpacity
          } else {
            adjustedOpacity = 1 - factorOpacity
          }

          el.style.width = adjustedDimension + 'px'
          el.style.height = adjustedDimension + 'px'
          el.style.opacity = adjustedOpacity
        })
      }

      map.on('zoom', throttle(resizeChartsByZoom, 10))
      map.addSource('country-labels-src', {
        type: 'geojson',
        data: geojson,
      })

      map.addLayer({
        id: 'country-labels-small',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-font': ['Roboto Condensed'],
          'text-max-width': 50,
          'text-line-height': 1,
        },
        paint: {
          'text-color': '#474747',
        },
        filter: ['==', 'sizeClass', 'small'],
      })
      map.addLayer({
        id: 'country-labels-medium',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-font': ['Roboto Condensed'],
          'text-max-width': 50,
          'text-line-height': 1,
        },
        paint: {
          'text-color': '#666666',
        },
        filter: ['==', 'sizeClass', 'medium'],
      })
      map.addLayer({
        id: 'country-labels-large',
        type: 'symbol',
        source: 'country-labels-src',
        layout: {
          'text-field': ['get', 'countryLabel'],
          'text-font': ['Roboto Condensed'],
          'text-max-width': 50,
          'text-line-height': 1,
        },
        paint: {
          'text-color': '#474747',
        },
        filter: ['==', 'sizeClass', 'large'],
      })

      const hoverPopup = $(`
      <div class="global-displacement-radial-bar-chart-tooltip">
        <div class="top">${t('hoverBox.totally')}</div>
        <div class="data"></div>
      </div>`)
      $('body').append(hoverPopup)
      const showTooltip = (marker) => (e) => {
        if (map.getZoom() < 3) return
        if (isCountryInfoPopupOrPopoverActive) return
        const countryCode = marker.properties.iso

        /*
          targetElHeight = clientHeight
          targetCenterY = clientHeight / 2
          mouseDistanceFromCenter = e.offsetY / 2s
        */
        const targetElWidth = e.target.clientWidth
        const targetElHeight = e.target.clientHeight
        const targetCenterX = targetElWidth / 2
        const targetCenterY = targetElHeight / 2
        const mouseX = e.offsetX
        const mouseY = e.offsetY
        const mouseHorizontalDistanceFromCenter = Math.abs(
          targetCenterX - mouseX
        )
        const mouseVerticalDistanceFromCenter = Math.abs(targetCenterY - mouseY)
        let horizontalDistanceThreshold
        let verticalDistanceThreshold
        switch (marker.properties.sizeClass) {
          case 'small':
            horizontalDistanceThreshold = 65
            verticalDistanceThreshold = 65
            break

          case 'medium':
            horizontalDistanceThreshold = 75
            verticalDistanceThreshold = 75
            break

          default:
          case 'large':
            horizontalDistanceThreshold = 95
            verticalDistanceThreshold = 95
            break
        }

        if (
          mouseHorizontalDistanceFromCenter > horizontalDistanceThreshold ||
          mouseVerticalDistanceFromCenter > verticalDistanceThreshold
        ) {
          return hideTooltip()
        }

        hoverPopup
          .children('.top')
          .html(
            `<p class="top-header">${t(
              `NRC.Web.StaticTextDictionary.Contries.${countryCode}`
            )}</p><h3>${t('hoverBox.totally')}</h3>`
          )

        const dataHtml = [
          {
            color: 'rgba(114,199,231,0.72)',
            data: getCountryStat(countryCode, 'idpsInXInYear').data,
          },
          {
            color: 'rgba(255,121,0,0.72)',
            data: getCountryStat(countryCode, 'totalRefugeesFromX').data,
          },
          {
            color: 'rgba(253,200,47,0.72)',
            data: getCountryStat(
              countryCode,
              'refugeesInXFromOtherCountriesInYear'
            ).data,
          },
        ]
          .sort((a, b) => b.data - a.data)
          .map((d) => {
            return { ...d, data: formatDataNumber(d.data, 'nb-NO') }
          })
          .map(
            (d) =>
              `<div class="line"><div class="dot" style="background-color: ${d.color}"></div>${d.data}</div></div>`
          )
          .join('\n')
        hoverPopup.children('.data').html(dataHtml)

        const newCss = {
          display: 'block',
          left:
            e.pageX + hoverPopup[0].clientWidth + 10 < document.body.clientWidth
              ? e.pageX + 10 + 'px'
              : document.body.clientWidth +
                5 -
                hoverPopup[0].clientWidth +
                'px',
          top:
            e.pageY + hoverPopup[0].clientHeight + 10 <
            document.body.clientHeight
              ? e.pageY + 10 + 'px'
              : document.body.clientHeight +
                5 -
                hoverPopup[0].clientHeight +
                'px',
        }
        hoverPopup.css(newCss)
      }
      function hideTooltip(e) {
        hoverPopup.css({ display: 'none' })
      }

      const radialBarChartsToUse = (() => {
        switch (periodYear) {
          case 2019:
            return radialBarChartsMap
          case 2020:
            return radialBarChartsMap2020
          case 2021:
            return radialBarChartsMap2021
          default:
            throw new Error('Invalid year passed to GlobalMap')
        }
      })()

      // TODO: this is likely to be a bottleneck
      geojson.features.forEach(function (marker) {
        var el = document.createElement('div')
        const iso = marker.properties.iso
        el.style.backgroundImage = `url(${radialBarChartsToUse[locale][iso]})`
        el.style.backgroundSize = 'cover'
        el.style.overflow = 'hidden'

        if (!isMobileDevice()) {
          el.addEventListener('mouseenter', showTooltip(marker))
          el.addEventListener('mousemove', showTooltip(marker))
          el.addEventListener('mouseout', hideTooltip)
        }

        el.dataset.sizeFactor = marker.properties.sizeFactor

        elements.push(el)

        const centroidFromLeonardoData = centroidsRaw.filter(
          (centroid) => centroid.iso === iso
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
    <div className="nrcstat__mainmap__container" ref={containerElementRef}>
      <button className="nrcstat__mainmap__open-button" type="button">
        {t('button.startMapExploration')}
      </button>
      <button
        className="nrcstat__mainmap__close-button"
        style={{ display: 'none' }}
        type="button"
      >
        {t('button.endMapExploration')}
      </button>
      <div className="nrcstat__map__share-btn" />
      <div
        className="nrcstat__globalmap__mapbox"
        ref={onReady}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="nrcstat__mainmap__overlay" />
        <div className="nrcstat__mainmap__legend" />
      </div>
    </div>
  )
}

export default Loader
