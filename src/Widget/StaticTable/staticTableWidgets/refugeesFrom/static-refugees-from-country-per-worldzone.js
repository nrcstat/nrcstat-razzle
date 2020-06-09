
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('@/Widget/StaticTable/staticTableWidgets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('@/Widget/StaticTable/staticTableWidgets/countryCodeNameMapNorwegian.json')

const title = 'Totalt antall flyktninger fordelt på verdensdel etter hvilke land de flyktet fra&nbsp;<sup class=\'nrcstat-widget-tooltip\' title="Tallene gjelder ved inngangen til 2019.">1)</sup>'

const footerAnnotations = [
  '1) Tallene gjelder ved inngangen til 2019.',
  'Kilder: FNs høykommisær for flyktninger (UNHCR) og FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: 'totalRefugeesFromX',
    continentCode: { nin: ['WORLD'] }
  },
  order: 'data DESC'

}

export default generator(title, 'Antall', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatter)

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
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
  })

  data.push({
    place: 'Asia inkludert Midtøsten og Oseania',
    totalRefugeesFromX: asiaPlusMiddleEastOceaniaSum
  })

  const total = _.sumBy(data, 'totalRefugeesFromX')

  data = _.map(data, d => {
    return Object.assign(d, { data: d.totalRefugeesFromX })
  })

  data = _.sortBy(data, 'place')

  const totalFormatted = thousandsFormatter(total)
  data.push({
    place: '<strong>Verden totalt</strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
