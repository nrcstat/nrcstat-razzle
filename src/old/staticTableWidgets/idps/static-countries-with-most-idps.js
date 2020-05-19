
const countryCodeNameMap = require('../../assets/countryCodeNameMapNorwegian.json')

const title = "Land med flest internt fordrevne"

const footerAnnotations = [
  "Flyktninghjelpens dokumentasjonssenter for internt fordrevne - Internal Displacement Monitoring Centre - samler dokumentasjon om internt fordrevne over hele verden, basert på en rekke ulike kilder. I mange land er det svært vanskelig å få oversikt over antallet internt fordrevne, og de fleste tallene i denne oversikten er anslag. For forklaring til de ulike anslagene, samt primærkilder, se www.internal-displacement.org. Tallene omfatter bare mennesker som er fordrevet på grunn av krig og konflikt, og ikke mennesker som er rammet av naturkatastrofer. Tallene er ved inngangen til 2016.",
  "Kilde: Internal Displacement Monitoring Centre (IDMC)."
]

const query = {
  where: {
    year: 2016,
    dataPoint: "idpsInXInYear",
    continentCode: { nin: [ "WORLD" ] }
  },
  limit: 30,
  order: "data DESC",

}

import generator from "../generic/generic-table-widget"

export default generator(title, "Antall internt fordrevne", process, query, footerAnnotations)


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


