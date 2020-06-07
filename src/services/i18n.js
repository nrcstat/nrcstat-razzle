import React from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import moment from 'moment'
import numeral from 'numeral'
import 'numeral/locales/de'
import { isClient } from '../util/utils'

numeral.locale('de')

// If this is running on the server, then i18n will alreadyc have been
// instantiated in /server-only/locale-service, with data from Locize.
// This i18n setup however, depends on the specially packaged locale data
// sent by the backend, then processed via the widgetLib loader script, and
// finally put into window.localeTranslation
if (isClient()) {
  i18n
    .use(initReactI18next) // if not using I18nextProvider
    .init({
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en-GB',
      defaultNS: 'Glossary',
      interpolation: {
        escapeValue: false, // not needed for react!!
        format: (value, format) => {
          if (format === 'uppercase') return value.toUpperCase()
          if (format === 'currency') return numeral(value).format('$0,0.00')
          if (value instanceof Date) return moment(value).format(format)
          return value
        }
      },
      // react i18next special options (optional)
      react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
      },
      keySeparator: false,

      resources: window.localeTranslation
    })
  console.log(window.localeTranslation)
  const fixedT = i18n.getFixedT('nb-NO')
  const example = fixedT('Widget.Static.GlobalRadialBarChartDisplacementMap:button.startMapExploration')
  console.log(example)
}

export const FixedLocaleContext = React.createContext()

export function buildFixedLocaleContext (locale) {
  const getNsFixedT = ns => i18n.getFixedT(locale, ns)
  const fixedT = i18n.getFixedT(locale)
  return ({ children }) => <FixedLocaleContext.Provider value={{ fixedT, getNsFixedT }}>{children}</FixedLocaleContext.Provider>
}
