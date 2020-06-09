
import { thousandsFormatter } from '@/util/tableWidgetFormatters.js'

import generator from '../generic/generic-table-widget'
const nrcWorldZoneNameMap = require('@/Widget/StaticTable/staticTableWidgets/nrcWorldZoneNameMapNorwegian.json')

const countryCodeNameMap = require('@/Widget/StaticTable/staticTableWidgets/countryCodeNameMapNorwegian.json')

const title = 'Antall nye internt fordrevne i 2018 fordelt på verdensdel'

const footerAnnotations = [
  'Kilde: Internal Displacement Monitoring Centre (IDMC).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: 'newIdpsInXInYear',
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
  data = _.map(data, (newIdpsInXInYear, regionCodeNRC) => {
    return {
      regionCodeNRC,
      newIdpsInXInYear: newIdpsInXInYear
    }
  })

  const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(['ASOC', 'ME'], d.regionCodeNRC))
  const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, 'newIdpsInXInYear')

  data = _.map(data, d => {
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
  })
  data.push({
    place: 'Asia inkludert Midtøsten og Oseania',
    newIdpsInXInYear: asiaPlusMiddleEastOceaniaSum
  })

  const total = _.sumBy(data, 'newIdpsInXInYear')
  data = _.map(data, d => {
    return Object.assign(d, { data: d.newIdpsInXInYear })
  })

  data = _.sortBy(data, 'place')

  const totalFormatted = thousandsFormatter(total)
  data.push({
    place: '<strong>Verden totalt <sup class="table-annotation-tooltip" title="Avviket skyldes avrunding. ">1)</sup></strong>',
    data: `<strong>${totalFormatted}</strong>`
  })
  return data
}
