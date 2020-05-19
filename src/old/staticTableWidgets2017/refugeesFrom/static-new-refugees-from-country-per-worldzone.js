







const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')
import {thousandsFormatterWithPrecision} from '../../helpers/tableWidgetFormatters'

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Antall nye flyktninger fordelt på verdensdel etter opprinnelsesland"

const footerAnnotations = [
  `<sup>1)</sup> Avviket skyldes avrunding. `,
  "Tallene er anslag ved inngangen til 2018.",
  "Kilde: FNs høykommissær for flyktninger (UNHCR).",
]

const query = {
  where: {
    year: 2017,
    dataPoint: "newRefugeesFromXInYear",
    continentCode: { nin: [ "WORLD" ] }
  },
  order: "data DESC",

}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall i millioner", process, query, footerAnnotations, "Verdensdel", false, thousandsFormatterWithPrecision(-4))


function process(data){
  data = _.groupBy(data, "regionCodeNRC")
  data = _.mapValues(data, (countries, regionCodeNRC) => {
    return _.sumBy(countries, "data")
  })
  data = _.map(data, (newRefugeesFromXInYear, regionCodeNRC) => {
    return {
      regionCodeNRC,
      newRefugeesFromXInYear: newRefugeesFromXInYear
    }
  })

  const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(["ASOC", "ME"], d.regionCodeNRC))
  const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, "newRefugeesFromXInYear")

  data = _.map(data, d => {
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
  })
  data.push({
    place: "Asia inkludert Midtøsten og Oseania",
    newRefugeesFromXInYear: asiaPlusMiddleEastOceaniaSum
  })

  const total = _.sumBy(data, "newRefugeesFromXInYear")
  data = _.map(data, d => {
    return Object.assign(d, { data: d.newRefugeesFromXInYear })
  })

  data = _.sortBy(data, "place")

  const totalFormatted = thousandsFormatterWithPrecision(-4)(total)
  data.push({
    place: `<strong>Verden totalt <sup class="nrcstat-widget-tooltip" title="Avviket skyldes avrunding. ">1)</sup></strong>`,
    data: `<strong>${totalFormatted}</strong>`
  })
  return data;
}




