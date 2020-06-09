
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Totalt antall internt fordrevne fordelt på verdensdel&nbsp;<sup class=\'nrcstat-widget-tooltip\' title="Tallene gjelder ved inngangen til 2019.">1)</sup>'

const footerAnnotations = [
  '1) Tallene gjelder ved inngangen til 2019.',
  'Kilde: Internal Displacement Monitoring Centre (IDMC).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: 'idpsInXInYear',
    continentCode: { nin: ['WORLD'] },
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] }
  },
  order: 'data DESC'

}

export default generator(title, 'Antall', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatter)

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
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
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
