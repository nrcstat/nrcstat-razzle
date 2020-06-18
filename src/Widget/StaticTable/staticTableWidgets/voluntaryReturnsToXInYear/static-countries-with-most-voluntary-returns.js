import generator from '../generic/generic-table-widget'

export default function (widgetParams) {
  const { t, periodYear } = widgetParams
  const title = t('RefugeeReport2020.VoluntaryReturn.CountriesWithMostVoluntaryReturns.Heading')

  const footerAnnotations = t('RefugeeReport2020.VoluntaryReturn.CountriesWithMostVoluntaryReturns.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'voluntaryReturnsToXInYear',
      continentCode: { nin: ['WORLD'] }
    },
    limit: 30,
    order: 'data DESC'

  }

  return generator(title, 'Antall', process, query, footerAnnotations)

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
