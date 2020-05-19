





const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Viktigste mottakerland"

const footerAnnotations = [
  "Tallene gjelder ved inngangen til 2018.",
  "Kilder: FNs høykommissær for flyktninger (UNHCR) og FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA)."
]

const query = {
  where: {
    year: 2017,
    dataPoint: "refugeesInXFromOtherCountriesInYear",
    regionCodeNRC: { nin: [ "MISC_AND_STATELESS" ] },
    continentCode: { nin: [ "WORLD" ] }
  },
  limit: 30,
  order: "data DESC"
}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall flyktninger", process, query, footerAnnotations)


function process(data){
  data = _.map(data, (v) => {
    return {
      countryCode: v.countryCode,
      data: v.data
    }
  })
  data = _.map(data, d => {
    d.place =
        countryCodeNameMap[d.countryCode]
    return d
  })
  return data
}



