
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const title = t(`RefugeeReport${periodYear + 1}.RefugeesFrom.NewRefugeesFromCountryPerWorldZone.Heading`)

  const footerAnnotations = t(`RefugeeReport${periodYear + 1}.RefugeesFrom.NewRefugeesFromCountryPerWorldZone.TableFooterText`)

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'newRefugeesFromXInYear',
      continentCode: { nin: ['WORLD'] }
    },
    order: 'data DESC'

  }

  return generator(title, t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.number`), process, query, footerAnnotations, t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.worldZone`), false, thousandsFormatter(locale))

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
      place: t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.asiaIncludedMiddleEastAndOceania`),
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

    const totalFormatted = thousandsFormatter(locale)(total)
    data.push({
      place: `<strong>${t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.worldTotal`)}</strong>`,
      data: `<strong>${totalFormatted}</strong>`
    })
    return data
  }
}
