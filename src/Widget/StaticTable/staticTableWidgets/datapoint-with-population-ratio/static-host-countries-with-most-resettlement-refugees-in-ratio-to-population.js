import {
  thousandsFormatter,
  percentFormatterWithPrecision,
} from '@/util/tableWidgetFormatters.js'
import generator from '../generic/country-datapoint-with-population-ratio'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const tableTitle = t(
    `RefugeeReport${
      periodYear + 1
    }.RatioToPopulation.HostCountriesWithMostResettlementRefugeesInRatioToPopulation.Heading`
  )

  const footerAnnotations = t(
    `RefugeeReport${
      periodYear + 1
    }.RatioToPopulation.HostCountriesWithMostResettlementRefugeesInRatioToPopulation.TableFooterText`
  )

  const placeColumnLabel = t(
    `RefugeeReport${periodYear + 1}.MiscSharedLabels.country`
  )
  const dataPointColumnLabel = t(
    `RefugeeReport${periodYear + 1}.MiscSharedLabels.numberResettlementRefugees`
  )
  const populationRatioColumnLabel = t(
    `RefugeeReport${
      periodYear + 1
    }.MiscSharedLabels.numberResettlementRefugeesInRatioToPopulation`
  )

  const query = {
    where: {
      year: periodYear,
      dataPoint: { inq: ['resettlementRefugeesToXInYear', 'population'] },
      regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
      continentCode: { nin: ['WORLD'] },
    },
  }

  function process(data) {
    return (
      _(data)
        .groupBy('countryCode')
        // Create array of countries, each element like this:
        // { countryCode, resettlementRefugeesToXInYear, population }
        .map((countryDataPoints, countryCode) => {
          const data = _.find(
            countryDataPoints,
            (dp) => dp.dataPoint == 'resettlementRefugeesToXInYear'
          ).data
          const population = _.find(
            countryDataPoints,
            (dp) => dp.dataPoint == 'population'
          ).data
          return { countryCode, data, population }
        })
        // Calculate dataPoint-to-population ratio. Population is stored in millions, convert to integer in calculation
        .map((c) =>
          _.assign(c, {
            ratio: c.data / (c.population * 1000000),
          })
        )
        // Filter away countries with ratio = 0
        .filter((c) => c.ratio !== 0)
        .filter((c) => !isNaN(c.ratio))
        .filter((c) => isFinite(c.ratio))
        // Assign country name
        .map((c) =>
          _.assign(c, {
            place: t(`NRC.Web.StaticTextDictionary.Contries.${c.countryCode}`),
          })
        )
        // Only leave certain properties in returned array
        .map((c) => _.pick(c, ['place', 'data', 'ratio']))
        // Order by ratio, then take first 54
        .orderBy((c) => c.ratio, 'desc')
        .take(50)
        .value()
    )
  }

  const ratioColumnFormatter = percentFormatterWithPrecision(locale)(2)

  return generator(
    tableTitle,
    placeColumnLabel,
    dataPointColumnLabel,
    populationRatioColumnLabel,
    footerAnnotations,
    query,
    process,
    thousandsFormatter(locale),
    ratioColumnFormatter
  )
}
