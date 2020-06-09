
import { populationNumberFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Totalt antall internt fordrevne fordelt på verdensdel'

const footerAnnotations = [
  '<sup>1)</sup> Avviket skyldes avrunding. ',
  'Tallene er anslag ved inngangen til 2018.',
  'Kilde: Internal Displacement Monitoring Centre (IDMC).'
]

const query = {
  where: {
    year: 2017,
    dataPoint: 'idpsInXInYear',
    continentCode: { nin: ['WORLD'] },
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] }
  },
  order: 'data DESC'

}

export default generator(title, 'Antall i millioner', process, query, footerAnnotations, 'Verdensdel', false, populationNumberFormatter)

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
    return Object.assign(d, { data: d.idpsInXInYear / 1000000 })
  })

  data = _.sortBy(data, 'place')

  const totalMillions = total / 1000000
  const totalFormatted = populationNumberFormatter(totalMillions)
  data.push({
    place: '<strong>Verden totalt <sup class="nrcstat-widget-tooltip" title="Avviket skyldes avrunding. ">1)</sup></strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
