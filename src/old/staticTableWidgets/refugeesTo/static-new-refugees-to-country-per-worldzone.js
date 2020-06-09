
import { thousandsFormatterWithPrecision } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const async = require('async')
const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = 'Antall nye flyktninger fordelt på verdensdel etter mottakerland'

const footerAnnotations = [
  '<sup>1)</sup> Avviket skyldes avrunding. ',
  'Tallene er anslag ved inngangen til 2017.',
  'Kilder: FNs høykommissær for flyktninger (UNHCR) og FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA).'
]

const query = {
  where: {
    year: 2016,
    dataPoint: 'newRefugeesInXFromOtherCountriesInYear',
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
    continentCode: { nin: ['WORLD'] }
  }
}

export default generator(title, 'Antall i millioner', process, query, footerAnnotations, 'Verdensdel', false, thousandsFormatterWithPrecision(-4))

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

  const totalFormatted = thousandsFormatterWithPrecision(-4)(total)
  data.push({
    place: '<strong>Verden totalt&nbsp;<sup class="nrcstat-widget-tooltip" title="Avviket skyldes avrunding. ">1)</sup></strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
