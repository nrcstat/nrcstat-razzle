import { thousandsFormatter, percentFormatterWithPrecision } from '@/util/tableWidgetFormatters.js'
import generator from '../generic/country-datapoint-with-population-ratio'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const tableTitle = t('RefugeeReport2020.RatioToPopulation.HostCountriesWithMostNewRefugeesInRatioToPopulation.Heading')

  const footerAnnotations = t('RefugeeReport2020.RatioToPopulation.HostCountriesWithMostNewRefugeesInRatioToPopulation.TableFooterText')

  const placeColumnLabel = t('RefugeeReport2020.MiscSharedLabels.country')
  const dataPointColumnLabel = t('RefugeeReport2020.MiscSharedLabels.numberNewRefugees')
  const populationRatioColumnLabel = t('RefugeeReport2020.MiscSharedLabels.numberNewRefugeesInRatioToPopulation')

  const query = {

    where: {
      year: periodYear,
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
        place: t(`NRC.Web.StaticTextDictionary.Contries.${c.countryCode}`)
      }))
    // Only leave certain properties in returned array
      .map(c => _.pick(c, ['place', 'data', 'ratio']))
    // Order by ratio, then take first 54
      .orderBy(c => c.ratio, 'desc')
      .take(33)
      .value()
  }

  const ratioColumnFormatter = percentFormatterWithPrecision(locale)(2)

  return generator(tableTitle, placeColumnLabel, dataPointColumnLabel, populationRatioColumnLabel, footerAnnotations, query, process, thousandsFormatter(locale), ratioColumnFormatter)
}
