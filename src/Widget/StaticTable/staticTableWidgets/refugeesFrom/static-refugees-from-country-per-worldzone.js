
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const title = t('RefugeeReport2020.RefugeesFrom.RefugeesFromCountryPerWorldZone.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesFrom.RefugeesFromCountryPerWorldZone.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'totalRefugeesFromX',
      continentCode: { nin: ['WORLD'] }
    },
    order: 'data DESC'

  }

  return generator(title, t('RefugeeReport2020.MiscSharedLabels.number'), process, query, footerAnnotations, t('RefugeeReport2020.MiscSharedLabels.worldZone'), false, thousandsFormatter(locale))

  function process (data) {
    data = _.groupBy(data, 'regionCodeNRC')
    data = _.mapValues(data, (countries, regionCodeNRC) => {
      return _.sumBy(countries, 'data')
    })
    data = _.map(data, (totalRefugeesFromX, regionCodeNRC) => {
      return {
        regionCodeNRC,
        totalRefugeesFromX: totalRefugeesFromX
      }
    })
    const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(['ASOC', 'ME'], d.regionCodeNRC))
    const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, 'totalRefugeesFromX')

    data = _.map(data, d => {
      return Object.assign(d, { place: t(`NRC.Web.StaticTextDictionary.Continents.${d.regionCodeNRC}`) })
    })

    data.push({
      place: t('RefugeeReport2020.MiscSharedLabels.asiaIncludedMiddleEastAndOceania'),
      totalRefugeesFromX: asiaPlusMiddleEastOceaniaSum
    })

    const total = _.sumBy(data, 'totalRefugeesFromX')

    data = _.map(data, d => {
      return Object.assign(d, { data: d.totalRefugeesFromX })
    })

    data = _.sortBy(data, d => {
      if (d.regionCodeNRC === 'MISC_AND_STATELESS') return 'ZZZZZZ'
      else return d.place
    })

    const totalFormatted = thousandsFormatter(total)
    data.push({
      place: `<strong>${t('RefugeeReport2020.MiscSharedLabels.worldTotal')}</strong>`,
      data: `<strong>${totalFormatted}</strong>`
    })
    return data
  }
}
