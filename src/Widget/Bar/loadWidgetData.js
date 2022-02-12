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
  if (context?.widgetObject?.dataType !== 'auto') return Promise.resolve(null)

  const {
    dataPoints = [],
    countries = [],
    years = [],
  } = context.widgetObject.autoData

  const query = {
    where: {
      dataPoint: { inq: dataPoints },
      countryCode: { inq: countries },
      year: { inq: years },
    },
  }

  const url = `${API_URL}/datas?filter=${encodeURIComponent(
    JSON.stringify(query)
  )}`
  return fetch(url, {
    headers: { nrcstatpassword: headers.nrcstatpassword },
  }).then((resp) => resp.json())
}
