import i18next from 'i18next'
import Locize from 'i18next-locize-backend'

import { ALL_LOCALE_NAMESPACES, ENABLED_LOCALES } from '../config.js'

const options = {
  backend: {
    // the id of your locize project
    projectId: 'faea19bd-5e3e-4bc5-b91a-721ee4afb475',

    // add an api key if you want to send missing keys
    apiKey: '82974bbf-7ec6-4f44-8c30-053f4f88d87c',

    // the reference language of your project
    referenceLng: 'nb-NO',
    version: 'latest',
  },
  preload: ENABLED_LOCALES,
  fallbackLng: 'en-GB',

  debug: false,
  ns: ALL_LOCALE_NAMESPACES,
}

async function initializeI18n() {
  await i18next.use(Locize).init(options)
  console.log('> Languages loaded from Locize')
}
initializeI18n()

// This is a bruteforce way of forcing locale data to
// be refreshed and reloaed from Locize
setInterval(initializeI18n, 5 * 60 * 1000)

export const i18n = i18next
