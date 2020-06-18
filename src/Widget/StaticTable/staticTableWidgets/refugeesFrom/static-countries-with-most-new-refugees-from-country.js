
import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.RefugeesFrom.CountriesWithMostNewRefugeesFromCountry.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesFrom.CountriesWithMostNewRefugeesFromCountry.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'newRefugeesFromXInYear',
      continentCode: { nin: ['WORLD', 'MISC_AND_STATELESS'] }
    },
    limit: 30,
    order: 'data DESC'

  }

  return generator(title, 'Antall flyktninger', process, query, footerAnnotations)

  function process (data) {
    data = _.map(data, (v) => {
      return {
        countryCode: v.countryCode,
        data: v.data
      }
    })
    data = _.map(data, d => {
      d.place = t(`NRC.Web.StaticTextDictionary.Contries.${d.countryCode}`)
      return d
    })
    return data
  }
}
