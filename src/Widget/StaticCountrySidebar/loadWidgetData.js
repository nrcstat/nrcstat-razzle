import { API_URL } from '../../config'
import nodeFetch from 'node-fetch'
import { isServer } from '../../util/utils'

let fetch

if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export function loadWidgetData(context, headers = {}) {
  const { dataPoints, countryCode, year } = context

  const query = {
    where: {
      dataPoint: { inq: dataPoints },
      countryCode: countryCode,
      year: year,
    },
  }

  const url = `${API_URL}/datas?filter=${encodeURIComponent(
    JSON.stringify(query)
  )}`

  return fetch(url, {
    headers: { nrcstatpassword: headers.nrcstatpassword },
  }).then((resp) => resp.json())
}
