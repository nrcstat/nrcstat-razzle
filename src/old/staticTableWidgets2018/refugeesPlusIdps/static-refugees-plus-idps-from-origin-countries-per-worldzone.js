
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Verdens flyktninger og internt fordrevne fordelt på verdensdel etter hvilke land de flyktet fra eller i&nbsp;<sup class=\'nrcstat-widget-tooltip\' title="Tallene gjelder ved inngangen til 2019. De omfatter alle som er drevet på flukt på grunn av forfølgelse, krig og konflikter.">1)</sup>'

const footerAnnotations = [
  '<sup>1)</sup> Tallene gjelder ved inngangen til 2019. De omfatter alle som er drevet på flukt på grunn av forfølgelse, krig og konflikter.',
  'Kilde: FNs høykommissær for flyktninger (UNHCR), FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA) og Internal Displacement Monitoring Centre (IDMC).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: { inq: ['idpsInXInYear', 'totalRefugeesFromX'] },
    continentCode: { nin: ['WORLD'] }
  }
}

export default generator(title, 'Antall', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatter)

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
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
  })

  data.push({
    place: 'Asia inkludert Midtøsten og Oseania',
    data: asiaPlusMiddleEastOceaniaSum
  })

  const total = _.sumBy(data, 'data')

  data = _.sortBy(data, 'place')

  const totalFormatted = thousandsFormatter(total)
  data.push({
    place: '<strong>Verden totalt</strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
