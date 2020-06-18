import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.RefugeesTo.CountriesWithMostNewRefugeesToCountry.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesTo.CountriesWithMostNewRefugeesToCountry.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'newRefugeesInXFromOtherCountriesInYear',
      regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
      continentCode: { nin: ['WORLD'] }
    },
    limit: 30,
    order: 'data DESC'

  }

  return generator(title, 'Antall flyktninger', process, query, footerAnnotations, 'Land')

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
