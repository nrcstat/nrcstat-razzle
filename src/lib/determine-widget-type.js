import { ENABLED_LOCALES, DEFAULT_LOCALE, API_URL } from '../config.js'
import nodeFetch from 'node-fetch'

export const determineWidgetType = async widget => {
  const { widgetId } = widget
  let locale, widgetIdParam

  const localesPipeDelimited = ENABLED_LOCALES.join('|')
  const localeSpecificMatch = widgetId.match(`^(${localesPipeDelimited})-(\\S+)$`)
  if (localeSpecificMatch) {
    [, locale, widgetIdParam] = localeSpecificMatch
  } else {
    locale = DEFAULT_LOCALE
    widgetIdParam = widgetId
  }

  if (widgetIdParam === 'global-displacement-radial-bar-chart-map-2019-0.1') {
    return { locale, type: 'GlobalMap', periodYear: 2018 }
  } else if (widgetIdParam === 'global-displacement-radial-bar-chart-map-2020-0.1') {
    return { locale, type: 'GlobalMap', periodYear: 2019 }
  } else if (/static/.test(widgetIdParam)) {
    const [, periodYearString = '2019'] = widgetIdParam.match(/^(\d*)-.+/) || []
    let periodYear
    try {
      periodYear = parseInt(periodYearString)
    } catch (error) {
      periodYear = 2019
    }
    const [, tableType] = widgetIdParam.match(/static-(.+)/)
    return { locale, type: 'StaticTable', periodYear, tableType }
  } else if (/dynamic_country_dashboard_/.test(widgetId)) {
    return { locale, type: 'CountryDashboard', ...parseDynamicCountryDashboardWidgetId(widgetId) }
  } else {
    let widgetObject
    if (/widget-wizard/.test(widgetId)) {
      // special case: request comes from widget wizard, before a widget has been saved
      widgetObject = widget.widgetObject
    } else {
      widgetObject = await loadWidgetObject(widgetIdParam)
    }
    widgetObject = removeLocaleLayer(widgetObject, locale)
    const type = widgetObject.type
    if (type === 'donut') {
      return { locale, type: 'Donut', widgetObject }
    } else if (type === 'line') {
      return { locale, type: 'Line', widgetObject }
    } else if (type === 'custom-table') {
      return { locale, type: 'CustomTable', widgetObject }
    } else {
      return { locale, type: 'Donut', widgetObject }
    }
  }
}

async function loadWidgetObject (widgetId) {
  return nodeFetch(`${API_URL}/widgets/${widgetId}`)
    .then(resp => resp.json())
}

function removeLocaleLayer (widgetObject, locale) {
  if (widgetObject.config.title[locale]) { widgetObject.config.title = widgetObject.config.title[locale] } else { widgetObject.config.title = '' }
  if (widgetObject.config.subtitle[locale]) { widgetObject.config.subtitle = widgetObject.config.subtitle[locale] } else { widgetObject.config.subtitle = '' }
  if (widgetObject.config.linkbox[locale]) { widgetObject.config.linkbox = widgetObject.config.linkbox[locale] } else { widgetObject.config.linkbox = '' }
  if (widgetObject.config.source[locale]) { widgetObject.config.source = widgetObject.config.source[locale] } else { widgetObject.config.source = '' }
  if (widgetObject.dataType === 'custom') {
    if (widgetObject.customData[locale]) {
      widgetObject.customData = widgetObject.customData[locale]
    }
  }

  return widgetObject
}

function parseDynamicCountryDashboardWidgetId (widgetId) {
  const patternCountryYear = /dynamic_country_dashboard_([A-Z]{2})_(\d{4})/
  const patternCountryYearDataPoints = /dynamic_country_dashboard_([A-Z]{2})_(\d{4})_([A-Za-z,]+)/

  let countryCode
  let year
  let dataPoints = [
    'totalRefugeesFromX',
    'idpsInXInYear',
    'refugeesInXFromOtherCountriesInYear',
    'newRefugeesFromXInYear',
    'newRefugeesInXFromOtherCountriesInYear',
    'newIdpsInXInYear',
    'voluntaryReturnsToXInYear',
    'asylumSeekersFromXToNorwayInYear',
    'population',
    'percentageWomenFleeingToCountry',
    'percentageChildrenFleeingToCountry'
  ]
  let showMap = true

  if (patternCountryYearDataPoints.test(widgetId)) {
    const matches = patternCountryYearDataPoints.exec(widgetId)
    countryCode = matches[1]
    year = matches[2]
    dataPoints = matches[3].split(',')
  } else if (patternCountryYear.test(widgetId)) {
    const matches = patternCountryYear.exec(widgetId)
    countryCode = matches[1]
    year = matches[2]
  }

  if (widgetId.indexOf('hideMap') !== -1) {
    showMap = false
  }

  return { countryCode, year, dataPoints, showMap }
}
