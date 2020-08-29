
import generator from '../generic/generic-table-widget'
import { thousandsFormatter } from '../../../../util/tableWidgetFormatters'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const title = t('RefugeeReport2020.RefugeesTo.CountriesWithMostRefugeesToCountry.Heading')

  const footerAnnotations = t('RefugeeReport2020.RefugeesTo.CountriesWithMostRefugeesToCountry.TableFooterText')

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'refugeesInXFromOtherCountriesInYear',
      regionCodeNRC: { nin: ['MISC_AND_STATELESS'] },
      continentCode: { nin: ['WORLD'] }
    },
    limit: 30,
    order: 'data DESC'
  }

  return generator(title, t('RefugeeReport2020.MiscSharedLabels.numberRefugees'), process, query, footerAnnotations, null, true, thousandsFormatter(locale))

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
