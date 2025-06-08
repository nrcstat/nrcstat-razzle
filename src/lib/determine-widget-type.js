import { ENABLED_LOCALES, DEFAULT_LOCALE, API_URL } from '../config.js'
import nodeFetch from 'node-fetch'
import StaticCountrySidebar from '../Widget/StaticCountrySidebar/StaticCountrySidebar.js'

export const determineWidgetType = async (widget) => {
  const { widgetId } = widget
  let locale, widgetIdParam

  const localesPipeDelimited = ENABLED_LOCALES.join('|')
  const localeSpecificMatch = widgetId.match(
    `^(${localesPipeDelimited})-(\\S+)$`,
  )
  if (localeSpecificMatch) {
    ;[, locale, widgetIdParam] = localeSpecificMatch
  } else {
    locale = DEFAULT_LOCALE
    widgetIdParam = widgetId
  }

  if (widgetIdParam === 'global-displacement-radial-bar-chart-map-2019-0.1') {
    return { locale, type: 'GlobalMap', periodYear: 2018 }
  } else if (
    widgetIdParam === 'global-displacement-radial-bar-chart-map-2020-0.1'
  ) {
    return { locale, type: 'GlobalMap', periodYear: 2019 }
  } else if (
    widgetIdParam === 'global-displacement-radial-bar-chart-map-2021-0.1'
  ) {
    return { locale, type: 'GlobalMap', periodYear: 2020 }
  } else if (
    widgetIdParam === 'global-displacement-radial-bar-chart-map-2022-0.1'
  ) {
    return { locale, type: 'GlobalMap', periodYear: 2021 }
  } else if (
    widgetIdParam === 'global-displacement-radial-bar-chart-map-2023-0.1'
  ) {
    return { locale, type: 'GlobalMap', periodYear: 2022 }
  } else if (
    widgetIdParam === 'global-displacement-radial-bar-chart-map-2024-0.1'
  ) {
    return { locale, type: 'GlobalMap', periodYear: 2023 }
  } else if (/static/.test(widgetIdParam)) {
    const [, periodYearString = '2023'] = widgetIdParam.match(/^(\d*)-.+/) || []
    let periodYear
    try {
      periodYear = parseInt(periodYearString)
    } catch (error) {
      periodYear = 2023
    }
    const [, tableType] = widgetIdParam.match(/static-(.+)/)
    return { locale, type: 'StaticTable', periodYear, tableType }
  } else if (/dynamic_country_dashboard_/.test(widgetId)) {
    return {
      locale,
      type: 'CountryDashboard',
      ...extractDynamicCountryDashboardWidgetParams(widgetId),
    }
  } else if (/country_sidebar_/.test(widgetId)) {
    return {
      locale,
      type: 'StaticCountrySidebar',
      ...extractStaticCountrySidebarWidgetParams(widgetId),
    }
  } else {
    let widgetObject
    if (/widget-wizard/.test(widgetId)) {
      // special case: request comes from widget wizard, before a widget has been saved
      widgetObject = widget.widgetObject
    } else {
      widgetObject = await loadWidgetObject(widgetIdParam)
      if (!widgetObject || widgetObject.error) {
        console.log('Could not load widget by id ', widgetIdParam)
        return { locale, type: 'BlankError', widgetObject }
      }
    }
    widgetObject = removeLocaleLayer(widgetObject, locale)
    const type = widgetObject?.type
    if (type === 'donut') {
      return { locale, type: 'Donut', widgetObject }
    } else if (type === 'bar') {
      return { locale, type: 'Bar', widgetObject }
    } else if (type === 'column') {
      return { locale, type: 'Column', widgetObject }
    } else if (type === 'line') {
      return { locale, type: 'Line', widgetObject }
    } else if (type === 'custom-table') {
      return { locale, type: 'CustomTable', widgetObject }
    } else if (type === 'pictogram') {
      return { locale, type: 'Pictogram', widgetObject }
    } else if (type === 'timeline') {
      return { locale, type: 'Timeline', widgetObject }
    } else if (type === 'table') {
      return { locale, type: 'Table', widgetObject }
    } else {
      console.log('Could not determine widget type')
      return { locale, type: 'BlankError', widgetObject }
    }
  }
}

async function loadWidgetObject(widgetId) {
  return nodeFetch(`${API_URL}/widget/${widgetId}`).then((resp) => resp.json())
}

function removeLocaleLayer(widgetObject, locale) {
  if (!widgetObject.config) widgetObject.config = {}
  if (
    widgetObject &&
    widgetObject.config &&
    widgetObject.title &&
    widgetObject.title[locale]
  ) {
    widgetObject.title = widgetObject.title[locale]
  } else {
    widgetObject.title = ''
  }
  if (
    widgetObject &&
    widgetObject.config &&
    widgetObject.config.subtitle &&
    widgetObject.config.subtitle[locale]
  ) {
    widgetObject.config.subtitle = widgetObject.config.subtitle[locale]
  } else {
    widgetObject.config.subtitle = ''
  }
  if (
    widgetObject &&
    widgetObject.config &&
    widgetObject.config.linkbox &&
    widgetObject.config.linkbox[locale]
  ) {
    widgetObject.config.linkbox = widgetObject.config.linkbox[locale]
  } else {
    widgetObject.config.linkbox = ''
  }
  if (
    widgetObject &&
    widgetObject.config &&
    widgetObject.config.source &&
    widgetObject.config.source[locale]
  ) {
    widgetObject.config.source = widgetObject.config.source[locale]
  } else {
    widgetObject.config.source = ''
  }
  if (widgetObject.dataType === 'custom') {
    if (widgetObject.customData) {
      if (
        widgetObject.customData.columns &&
        widgetObject.customData.columns[0]
      ) {
        widgetObject.customData.columns = widgetObject.customData.columns.map(
          (column) => ({ ...column, columnLabel: column.columnLabel[locale] }),
        )
      }
      if (widgetObject.customData.data && widgetObject.customData.data[0]) {
        widgetObject.customData.data = widgetObject.customData.data.map(
          (item) => ({ ...item, label: item.label[locale] }),
        )
      }
    }
  }

  // Timeline widget
  if (widgetObject && widgetObject.entries) {
    widgetObject.entries = widgetObject.entries.map((entry) => {
      entry.title = entry.title?.[locale]
      entry.subtitle = entry.subtitle?.[locale]
      entry.body = entry.body?.[locale]
      return entry
    })
  }

  // Pictogram widget
  if (widgetObject && widgetObject.type === 'pictogram') {
    widgetObject.subtitle = widgetObject.subtitle?.[locale]
    widgetObject.source = widgetObject.source?.[locale]
    if (widgetObject.sections && widgetObject.sections.length > 0) {
      widgetObject.sections = widgetObject.sections.map((section) => {
        section.title = section.title?.[locale]
        return section
      })
    }
  }

  return widgetObject
}

function extractDynamicCountryDashboardWidgetParams(widgetId) {
  const patternCountryYear = /dynamic_country_dashboard_([A-Z]{2})_(\d{4})/

  let countryCode
  let year

  const matches = patternCountryYear.exec(widgetId)
  countryCode = matches[1]
  year = matches[2]

  return { countryCode, year }
}

const DEFAULT_COUNTRY_SIDEBAR_DATA_POINTS = [
  'idpsInXInYear',
  'refugeesInXFromOtherCountriesInYear',
  'totalRefugeesFromX',
]

function extractStaticCountrySidebarWidgetParams(widgetId) {
  const patternCountryYear = /country_sidebar_([A-Z]{2})_(\d{4})/
  const patternCountryYearDataPoints =
    /country_sidebar_([A-Z]{2})_(\d{4})_([A-Za-z,_]+)/

  let countryCode
  let year
  let dataPoints = DEFAULT_COUNTRY_SIDEBAR_DATA_POINTS

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

  return { countryCode, year, dataPoints }
}
