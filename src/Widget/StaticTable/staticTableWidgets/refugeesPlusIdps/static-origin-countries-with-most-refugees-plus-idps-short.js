
import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.IDP.RefugeeDataPointPlusIDPDataPoint.OriginCountriesWithMostRefugeesPlusIdps.ShortTable.Heading')

  const footerAnnotations = t('RefugeeReport2020.IDP.RefugeeDataPointPlusIDPDataPoint.OriginCountriesWithMostRefugeesPlusIdps.ShortTable.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: { inq: ['idpsInXInYear', 'totalRefugeesFromX'] },
      continentCode: { nin: ['WORLD'] }
    }
  }

  return generator(title, t('RefugeeReport2020.MiscSharedLabels.number'), process, query, footerAnnotations)

  function process (data) {
    data = _(data)
      .groupBy('countryCode')
      .mapValues(countryDataPoints => _.sumBy(countryDataPoints, 'data'))
      .map((refugeesPlusIdps, countryCode) => {
        return { countryCode, data: refugeesPlusIdps }
      })
      .map(country => {
        country.place = t(`NRC.Web.StaticTextDictionary.Contries.${country.countryCode}`)
        return country
      })
      .filter(country => !!country.data)
      .filter(country => country.countryCode !== 'MISC')
      .orderBy(country => country.data, 'desc')
      .take(10)
      .value()
    return data
  }
}
