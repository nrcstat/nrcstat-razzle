
import { populationNumberFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Verdens flyktninger og internt fordrevne fordelt på verdensdel etter mottakerland&nbsp;<sup class=\'nrcstat-widget-tooltip\' title="Tallene gjelder ved inngangen til 2018. De omfatter alle som er drevet på flukt på grunn av forfølgelse, krig og konflikter.">1)</sup>'

const footerAnnotations = [
  '<sup>1)</sup> Tallene gjelder ved inngangen til 2018. De omfatter alle som er drevet på flukt på grunn av forfølgelse, krig og konflikter.',
  '<sup>2)</sup> Avviket skyldes avrunding. '
]

const query = {
  where: {
    year: 2017,
    dataPoint: { inq: ['idpsInXInYear', 'refugeesInXFromOtherCountriesInYear'] },
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
    continentCode: { nin: ['WORLD'] }
  }
}

export default generator(title, 'Antall i millioner', process, query, footerAnnotations, 'Verdensdel', false, populationNumberFormatter)

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

  data = _.map(data, d => {
    return Object.assign(d, { data: d.data / 1000000 })
  })

  data = _.sortBy(data, 'place')

  const totalMillions = total / 1000000
  const totalFormatted = populationNumberFormatter(totalMillions)
  data.push({
    place: '<strong>Verden totalt <sup class="nrcstat-widget-tooltip" title="Avviket skyldes avrunding. ">2)</sup></strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
