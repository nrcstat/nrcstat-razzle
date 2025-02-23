import { dataCache } from '../../services/DataCache'

export function loadWidgetData({ periodYear }) {
  const query = { where: { year: periodYear } }
  return Promise.resolve(dataCache.query(query))
}
