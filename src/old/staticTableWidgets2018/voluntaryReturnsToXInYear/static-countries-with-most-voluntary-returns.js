const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Land hvor flest vendte tilbake i 2018"

const footerAnnotations = [
    "Kilder: FNs høykommissær for flyktninger (UNHCR)."
  ]

const query = {
  where: {
    year: 2018,
    dataPoint: "voluntaryReturnsToXInYear",
    continentCode: { nin: [ "WORLD" ] }
  },
  limit: 30,
  order: "data DESC",

}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall", process, query, footerAnnotations)


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
