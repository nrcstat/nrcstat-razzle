import React from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import moment from 'moment'
import numeral from 'numeral'
import 'numeral/locales/de'

numeral.locale('de')

i18n
  .use(initReactI18next) // if not using I18nextProvider
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en-GB',
    defaultNS: 'Glossary',
    interpolation: {
      escapeValue: false, // not needed for react!!
      format: (value, format) => {
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

    resources: {
      ...window.localeTranslation
    }
  })
