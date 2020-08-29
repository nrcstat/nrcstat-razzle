
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const title = t('RefugeeReport2020.RefugeesTo.RefugeesToCountryPerWorldZone.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesTo.RefugeesToCountryPerWorldZone.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'refugeesInXFromOtherCountriesInYear',
      regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
      continentCode: { nin: ['WORLD'] }
    }
  }

  return generator(title, t('RefugeeReport2020.MiscSharedLabels.number'), process, query, footerAnnotations, t('RefugeeReport2020.MiscSharedLabels.worldZone'), false, thousandsFormatter(locale))

  function process (data) {
    data = _.groupBy(data, 'regionCodeNRC')
    data = _.mapValues(data, (countries, regionCodeNRC) => {
      return _.sumBy(countries, 'data')
    })
    data = _.map(data, (data, regionCodeNRC) => {
      return {
        regionCodeNRC,
        data: data
      }
    })
    const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(['ASOC', 'ME'], d.regionCodeNRC))
    const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, 'data')

    data = _.map(data, d => {
      return Object.assign(d, { place: t(`NRC.Web.StaticTextDictionary.Continents.${d.regionCodeNRC}`) })
    })

    data.push({
      place: t('RefugeeReport2020.MiscSharedLabels.asiaIncludedMiddleEastAndOceania'),
      data: asiaPlusMiddleEastOceaniaSum
    })

    const total = _.sumBy(data, 'data')

    data = _.sortBy(data, 'place')

    const totalFormatted = thousandsFormatter(total)
    data.push({
      place: `<strong>${t('RefugeeReport2020.MiscSharedLabels.worldTotal')}</strong>`,
      data: `<strong>${totalFormatted}</strong>`
    })
    return data
  }
}
