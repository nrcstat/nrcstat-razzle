import { API_URL } from '../../config'
import nodeFetch from 'node-fetch'
import { isServer } from '../../util/utils'
import { dataCache } from '../../services/DataCache'

let fetch

if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export function loadWidgetData(context, headers = {}) {
  const { countryCode } = context

  const query = {
    where: {
      countryCode,
    },
  }

  return Promise.resolve(dataCache.query(query))
}
