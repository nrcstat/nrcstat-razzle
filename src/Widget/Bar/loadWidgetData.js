import { API_URL } from '../../config'
import nodeFetch from 'node-fetch'
import { isServer } from '../../util/utils'
import { isNumber } from 'lodash'
import { dataCache } from '../../services/DataCache'

let fetch

if (isServer()) {
  fetch = nodeFetch
} else {
  fetch = window.fetch
}

export async function loadWidgetData(context, headers = {}) {
  if (context?.widgetObject?.dataType !== 'auto') return Promise.resolve(null)

  let {
    dataPoints = [],
    countries = [],
    years = [],
  } = context.widgetObject.autoData

  const query = {
    where: {
      dataPoint: { inq: dataPoints },
      year: { inq: years },
    },
  }
  if (countries.length > 0) {
    query.where.countryCode = { inq: countries }
  }

  const data = dataCache.query(query)

  if (countries.length === 0) {
    // If no countries were selected, sum all data points where the only
    // variant is the country code. Do this using a .reduce function.
    data = data.reduce((acc, d) => {
      const key = `${d.dataPoint}-${d.year}`
      if (!acc[key]) {
        acc[key] = d
      } else {
        if (isNumber(d.data)) {
          // the Number(acc[key].data) covers the case where it is
          // null or undefined
          acc[key].data = Number(acc[key].data) + d.data
        }
      }
      return acc
    }, {})
    data = Object.values(data).map(
      ({ countryCode, continentCode, regionCodeNRC, ...d }) => d,
    )
  }

  return data
}
