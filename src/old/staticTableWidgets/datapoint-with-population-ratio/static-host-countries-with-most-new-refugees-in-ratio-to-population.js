import { thousandsFormatter, percentFormatterWithPrecision } from '@/util/tableWidgetFormatters.js'
import generator from '../generic/country-datapoint-with-population-ratio'

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const tableTitle = 'Mottakerland med flest nye flyktninger i forhold til folketallet'
const placeColumnLabel = 'Land'
const dataPointColumnLabel = 'Antall nye flyktninger'
const populationRatioColumnLabel = 'Antall nye flyktninger i forhold til folketall'

const footerAnnotations = [
  'Kilde: FNs høykommissær for flyktninger (UNHCR) for flyktningtall og United Nations Population Fund for folketall. '
]

const query = {

  where: {
    year: 2016,
    dataPoint: { inq: ['newRefugeesInXFromOtherCountriesInYear', 'population'] },
    regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
    continentCode: { nin: ['WORLD'] }
  }
}

function process (data) {
  return _(data)
    .groupBy('countryCode')
  // Create array of countries, each element like this:
  // { countryCode, newRefugeesInXFromOtherCountriesInYear, population }
    .map((countryDataPoints, countryCode) => {
      const data = _.find(countryDataPoints, dp => dp.dataPoint == 'newRefugeesInXFromOtherCountriesInYear').data
      const population = _.find(countryDataPoints, dp => dp.dataPoint == 'population').data
      return { countryCode, data, population }
    })
  // Calculate dataPoint-to-population ratio. Population is stored in millions, convert to integer in calculation
    .map(c => _.assign(c, {
      ratio: c.data / (c.population * 1000000)
    }))
  // Filter away countries with ratio = 0
    .filter(c => c.ratio !== 0)
    .filter(c => !isNaN(c.ratio))
    .filter(c => isFinite(c.ratio))
  // Assign country name
    .map(c => _.assign(c, {
      place: countryCodeNameMap[c.countryCode]
    }))
  // Only leave certain properties in returned array
    .map(c => _.pick(c, ['place', 'data', 'ratio']))
  // Order by ratio, then take first 54
    .orderBy(c => c.ratio, 'desc')
    .take(33)
    .value()
}

const ratioColumnFormatter = percentFormatterWithPrecision(2)

export default generator(tableTitle, placeColumnLabel, dataPointColumnLabel, populationRatioColumnLabel, footerAnnotations, query, process, thousandsFormatter, ratioColumnFormatter)
