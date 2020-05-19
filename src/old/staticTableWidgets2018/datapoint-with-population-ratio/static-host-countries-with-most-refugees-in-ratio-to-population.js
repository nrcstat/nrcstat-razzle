import {thousandsFormatter, percentFormatterWithPrecision} from '../../helpers/tableWidgetFormatters'

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')
import generator from "../generic/country-datapoint-with-population-ratio"

const tableTitle = `Land som har tatt imot flest flyktninger i forhold til folketall`
const placeColumnLabel = `Land`
const dataPointColumnLabel = `Antall flyktninger`
const populationRatioColumnLabel = `Antall flyktninger i forhold til folketall`

const footerAnnotations = [
  "Kilde: FNs høykommissær for flyktninger (UNHCR), FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA) og United Nations Population Fund (UNFPA)."
]

const query = {

  where: {
    year: 2018,
    dataPoint: { inq: [ "refugeesInXFromOtherCountriesInYear", "population" ] },
    regionCodeNRC: { nin: [ "MISC_AND_STATELESS" ] },
    continentCode: { nin: [ "WORLD" ] }
  }
}


function process(data) {
  return _(data)
      .groupBy("countryCode")
      // Create array of countries, each element like this:
      // { countryCode, newRefugeesInXFromOtherCountriesInYear, population }
      .map((countryDataPoints, countryCode) => {
        let data = _.find(countryDataPoints, dp => dp.dataPoint == "refugeesInXFromOtherCountriesInYear").data
        let population = _.find(countryDataPoints, dp => dp.dataPoint == "population").data
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
        place: countryCodeNameMap[ c.countryCode ]
      }))
      // Only leave certain properties in returned array
      .map(c => _.pick(c, [ 'place', 'data', 'ratio' ]))
      // Order by ratio, then take first 54
      .orderBy(c => c.ratio, "desc")
      .take(54)
      .value()
}

const ratioColumnFormatter = percentFormatterWithPrecision(2)


export default generator(tableTitle, placeColumnLabel, dataPointColumnLabel, populationRatioColumnLabel, footerAnnotations, query, process, thousandsFormatter, ratioColumnFormatter)
