import { ENABLED_LOCALES, DEFAULT_LOCALE } from '../config.js'

export const determineWidgetType = (API_URL) => widgetId => {
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
    return { locale, type: 'GlobalMap' }
  } else {
    return { locale, type: 'Donut' }
  }
}
