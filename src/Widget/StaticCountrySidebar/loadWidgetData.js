import { dataCache } from '../../services/DataCache'

export function loadWidgetData(context, headers = {}) {
  const { dataPoints, countryCode, year } = context

  const query = {
    where: {
      dataPoint: { inq: dataPoints },
      countryCode: countryCode,
      year: year,
    },
  }

  return Promise.resolve(dataCache.query(query))
}
