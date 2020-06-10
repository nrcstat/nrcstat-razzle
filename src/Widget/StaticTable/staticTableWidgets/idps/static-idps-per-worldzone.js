
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'

const nrcWorldZoneNameMap = require('@/Widget/StaticTable/staticTableWidgets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('@/Widget/StaticTable/staticTableWidgets/countryCodeNameMapNorwegian.json')

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.IDP.IdpsPerWorldZone.Heading')

  const footerAnnotations = t('RefugeeReport2020.IDP.IdpsPerWorldZone.TableFooterText')
    .replace('\n', '<br /><br />')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'idpsInXInYear',
      continentCode: { nin: ['WORLD'] },
      regionCodeNRC: { nin: ['MISC_AND_STATELESS'] }
    },
    order: 'data DESC'

  }

  return generator(title, 'Antall', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatter)

  function process (data) {
    data = _.groupBy(data, 'regionCodeNRC')
    data = _.mapValues(data, (countries, regionCodeNRC) => {
      return _.sumBy(countries, 'data')
    })
    data = _.map(data, (idpsInXInYear, regionCodeNRC) => {
      return {
        regionCodeNRC,
        idpsInXInYear: idpsInXInYear
      }
    })

    const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(['ASOC', 'ME'], d.regionCodeNRC))
    const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, 'idpsInXInYear')

    data = _.map(data, d => {
      return Object.assign(d, { place: t(`NRC.Web.StaticTextDictionary.Continents.${d.regionCodeNRC}`) })
    })
    data.push({
      place: 'Asia inkludert Midtøsten og Oseania',
      idpsInXInYear: asiaPlusMiddleEastOceaniaSum
    })

    const total = _.sumBy(data, 'idpsInXInYear')
    data = _.map(data, d => {
      return Object.assign(d, { data: d.idpsInXInYear })
    })

    data = _.sortBy(data, 'place')

    const totalFormatted = thousandsFormatter(total)
    data.push({
      place: '<strong>Verden totalt</strong>',
      data: `<strong>${totalFormatted}</strong>`
    })
    return data
  }
}
