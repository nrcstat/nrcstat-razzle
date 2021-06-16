
import generator from '../generic/generic-table-widget'
import { thousandsFormatter } from '../../../../util/tableWidgetFormatters'

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams
  const title = t(`RefugeeReport${periodYear + 1}.RefugeesFrom.CountriesWithMostNewRefugeesFromCountry.Heading`)

  const footerAnnotations = t(`RefugeeReport${periodYear + 1}.RefugeesFrom.CountriesWithMostNewRefugeesFromCountry.TableFooterText`)

  const query = {
    where: {
      year: periodYear,
      dataPoint: 'newRefugeesFromXInYear',
      continentCode: { nin: ['WORLD', 'MISC_AND_STATELESS'] }
    },
    limit: 30,
    order: 'data DESC'

  }

  return generator(title, t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.numberRefugees`), process, query, footerAnnotations, null, true, thousandsFormatter(locale))

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
