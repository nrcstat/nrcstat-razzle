




const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Landene flest flyktet fra i 2018"

const footerAnnotations = [
  "Tallene gjelder ved inngangen til 2018.",
  "Kilder: FNs høykommissær for flyktninger (UNHCR)."
]

const query = {
  where: {
    year: 2018,
    dataPoint: "newRefugeesFromXInYear",
    continentCode: { nin: [ "WORLD", "MISC_AND_STATELESS" ] }
  },
  limit: 30,
  order: "data DESC",

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


