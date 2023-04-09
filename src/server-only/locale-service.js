import i18next from 'i18next'
import Locize from 'i18next-locize-backend'
import { createClient } from '@sanity/client'

import { ALL_LOCALE_NAMESPACES, ENABLED_LOCALES } from '../config.js'

const sanityClient = createClient({
  projectId: 'obdzv40s',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-03-01',
})

function fetchAllSanityKeys() {
  const groqQuery = `
  *[_type=="key"]{
    _id,
    id,
    value,
    namespace->
  }`
  return sanityClient.fetch(groqQuery)
}

function fromSanityKeysToI18nResources(keys) {
  let localeKeys = keys
  localeKeys = localeKeys.map((key) => {
    delete key.value._type
    for (const locale in key.value) {
      const correctLocale =
        locale.substring(0, 2) + '-' + locale.substring(2, 4)
      key.value[correctLocale] = key.value[locale]
      delete key.value[locale]
    }
    return key
  })

  const localeNamespaceKeysMap = {}
  for (const key of localeKeys) {
    for (const [locale, value] of Object.entries(key.value)) {
      if (!localeNamespaceKeysMap[locale]) localeNamespaceKeysMap[locale] = {}
      if (!localeNamespaceKeysMap[locale][key.namespace.name])
        localeNamespaceKeysMap[locale][key.namespace.name] = {}
      localeNamespaceKeysMap[locale][key.namespace.name][key.id] = value
    }
  }

  return localeNamespaceKeysMap
}

const options = {
  preload: ENABLED_LOCALES,
  fallbackLng: 'en-GB',

  debug: false,
  ns: ALL_LOCALE_NAMESPACES,
}

async function initializeI18n() {
  const sanityLocaleKeys = await fetchAllSanityKeys()
  const localeNamespaceKeysMap = fromSanityKeysToI18nResources(sanityLocaleKeys)

  i18next.init(options)

  for (const locale in localeNamespaceKeysMap) {
    for (const namespaceId in localeNamespaceKeysMap[locale]) {
      const namespaceResource = localeNamespaceKeysMap[locale][namespaceId]
      i18next.addResourceBundle(locale, namespaceId, namespaceResource)
    }
  }
}
initializeI18n()

// This is a bruteforce way of forcing locale data to
// be refreshed and reloaed from Locize
setInterval(initializeI18n, 24 * 60 * 60 * 1000)

export const i18n = i18next
