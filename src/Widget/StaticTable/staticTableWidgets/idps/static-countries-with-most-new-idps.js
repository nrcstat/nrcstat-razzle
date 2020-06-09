
import generator from '../generic/generic-table-widget'

const countryCodeNameMap = require('@/Widget/StaticTable/staticTableWidgets/countryCodeNameMapNorwegian.json')

const title = 'Land med flest nye internt fordrevne i 2018'

const footerAnnotations = [
  'Flyktninghjelpens dokumentasjonssenter for internt fordrevne - Internal Displacement Monitoring Centre - samler dokumentasjon om internt fordrevne over hele verden, basert på en rekke ulike kilder. I mange land er det svært vanskelig å få oversikt over antallet internt fordrevne, og de fleste tallene i denne oversikten er anslag. For forklaring til de ulike anslagene, samt primærkilder, se www.internal-displacement.org. Tallene omfatter bare mennesker som er fordrevet på grunn av krig og konflikt, og ikke mennesker som er rammet av naturkatastrofer. Tallene er ved inngangen til 2018.',
  'Kilde: Internal Displacement Monitoring Centre (IDMC).'
]

const query = {
  where: {
    year: 2018,
    dataPoint: 'newIdpsInXInYear',
    continentCode: { nin: ['WORLD'] }
  },
  limit: 30,
  order: 'data DESC'

}

export default generator(title, 'Antall nye internt fordrevne', process, query, footerAnnotations)

function process (data) {
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
