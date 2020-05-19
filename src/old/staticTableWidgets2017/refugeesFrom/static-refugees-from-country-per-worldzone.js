





const nrcWorldZoneNameMap = require('../../assets/nrcWorldZoneNameMapNorwegian.json')
import {populationNumberFormatter} from '../../helpers/tableWidgetFormatters'

const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Fordelt på verdensdel etter opprinnelsesland"

const footerAnnotations = [
  `<sup>1)</sup> Avviket skyldes avrunding. `,
  "Tallene gjelder ved inngangen til 2018.",
  "Kilder: FNs høykommisær for flyktninger (UNHCR) og FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA).",
]

const query = {
  where: {
    year: 2017,
    dataPoint: "totalRefugeesFromX",
    continentCode: { nin: [ "WORLD" ] }
  },
  order: "data DESC",

}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall i millioner", process, query, footerAnnotations, "Verdensdel", false, populationNumberFormatter)


function process(data){
  data = _.groupBy(data, "regionCodeNRC")
  data = _.mapValues(data, (countries, regionCodeNRC) => {
    return _.sumBy(countries, "data")
  })
  data = _.map(data, (totalRefugeesFromX, regionCodeNRC) => {
    return {
      regionCodeNRC,
      totalRefugeesFromX: totalRefugeesFromX
    }
  })
  const asiaPlusMiddleEastOceaniaData = _.remove(data, d => _.includes(["ASOC", "ME"], d.regionCodeNRC))
  const asiaPlusMiddleEastOceaniaSum = _.sumBy(asiaPlusMiddleEastOceaniaData, "totalRefugeesFromX")

  data = _.map(data, d => {
    return Object.assign(d, { place: nrcWorldZoneNameMap[d.regionCodeNRC] })
  })


  data.push({
    place: "Asia inkludert Midtøsten og Oseania",
    totalRefugeesFromX: asiaPlusMiddleEastOceaniaSum
  })

  const total = _.sumBy(data, "totalRefugeesFromX")

  data = _.map(data, d => {
    return Object.assign(d, { data: d.totalRefugeesFromX / 1000000 })
  })


  data = _.sortBy(data, "place")

  const totalMillions = total / 1000000
  const totalFormatted = populationNumberFormatter(totalMillions)
  data.push({
    place: `<strong>Verden totalt <sup class="nrcstat-widget-tooltip" title="Avviket skyldes avrunding. ">1)</sup></strong>`,
    data: `<strong>${totalFormatted}</strong>`
  })
  return data;
}





