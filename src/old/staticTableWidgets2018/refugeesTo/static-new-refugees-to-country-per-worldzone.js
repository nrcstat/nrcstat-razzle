
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const async = require('async')
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Antall nye flyktninger i 2018 fordelt på verdensdel etter hvilke land de flyktet til'

const footerAnnotations = [
  'Tallene inkluderer registrerte asylsøkere , flyktninger og personer i en flyktninglignende situasjon registrert på gruppenivå samt ankomst kvoteflyktninger. Totaltallet for «Nye flyktninger til» og «Nye flyktninger fra» er beregnet på forskjellig måte og er derfor ikke direkte sammenlignbart. Tallene inkluderer ikke flyktninger under UNRWAs mandat.',
  'Kilde: FNs høykommissær for flyktninger (UNHCR).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: 'newRefugeesInXFromOtherCountriesInYear',
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
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
  data = _.map(data, d => {
    return Object.assign(d, { data: d.data })
  })

  data = _.sortBy(data, 'place')

  const totalFormatted = thousandsFormatter(total)
  data.push({
    place: '<strong>Verden totalt</strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
