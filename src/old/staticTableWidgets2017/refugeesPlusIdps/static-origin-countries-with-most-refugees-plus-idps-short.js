




const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = `Land hvor flest mennesker er drevet på flukt <sup class="nrcstat-widget-tooltip" title="Omfatter både internt fordrevne i landet og mennesker som har flyktet fra landet ved inngangen til 2018.">1)</sup>`

const footerAnnotations = [
  "<sup>1)</sup> Omfatter både internt fordrevne i landet og mennesker som har flyktet fra landet ved inngangen til 2018.",
  "Kilder: FNs høykommissær for flyktninger (UNHCR), FNs hjelpeorganisasjon for Palestina-flyktninger (UNRWA) og Internal Displacement Monitoring Centre (IDMC)."
]

const query = {

  where: {
    year: 2017,
    dataPoint: { inq: [ "idpsInXInYear", "totalRefugeesFromX" ] },
    continentCode: { nin: [ "WORLD" ] }
  }
}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall", process, query, footerAnnotations)


function process(data){
  data = _(data)
      .groupBy("countryCode")
      .mapValues(countryDataPoints => _.sumBy(countryDataPoints, "data"))
      .map((refugeesPlusIdps, countryCode) => {
        return { countryCode, data: refugeesPlusIdps }
      })
      .map(country => {
        country.place =
            countryCodeNameMap[ country.countryCode ]
        return country
      })
      .filter(country => !!country.data)
      .orderBy(country => country.data, "desc")
      .take(10)
      .value()
  return data
}


