
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.RefugeesFrom.NewRefugeesFromCountryPerWorldZone.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesFrom.NewRefugeesFromCountryPerWorldZone.TableFooterText')
    .replace('\n', '<br /><br />')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'newRefugeesFromXInYear',
      continentCode: { nin: ['WORLD'] }
    },
    order: 'data DESC'

  }

  return generator(title, 'Antall', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatter)

  function process (data) {
    data = _.groupBy(data, 'regionCodeNRC')
    data = _.mapValues(data, (countries, regionCodeNRC) => {
      return _.sumBy(countries, 'data')
    })
    data = _.map(data, (newRefugeesFromXInYear, regionCodeNRC) => {
      return {
        regionCodeNRC,
        newRefugeesFromXInYear: newRefugeesFromXInYear
      }
    })

    const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(['ASOC', 'ME'], d.regionCodeNRC))
    const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, 'newRefugeesFromXInYear')

    data = _.map(data, d => {
      return Object.assign(d, { place: t(`NRC.Web.StaticTextDictionary.Continents.${d.regionCodeNRC}`) })
    })
    data.push({
      place: 'Asia inkludert Midtøsten og Oseania',
      newRefugeesFromXInYear: asiaPlusMiddleEastOceaniaSum
    })

    const total = _.sumBy(data, 'newRefugeesFromXInYear')
    data = _.map(data, d => {
      return Object.assign(d, { data: d.newRefugeesFromXInYear })
    })

    data = _.sortBy(data, d => {
      if (d.regionCodeNRC === 'MISC_AND_STATELESS') return 'ZZZZZZ'
      else return d.place
    })

    const totalFormatted = thousandsFormatter(total)
    data.push({
      place: '<strong>Verden totalt</strong>',
      data: `<strong>${totalFormatted}</strong>`
    })
    return data
  }
}
