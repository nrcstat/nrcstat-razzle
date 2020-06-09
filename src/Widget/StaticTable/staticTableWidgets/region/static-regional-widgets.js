import regionalWidgetGenerator from './generics/countries-with-most-of-datapoint-x'

export default {
  'static-africa-countries-with-most-refugees-from': regionalWidgetGenerator('totalRefugeesFromX', 'AF', 30, 'LAND I AFRIKA SOM FLEST HAR FLYKTET FRA', 'Kilde: UNHCR'),
  'static-africa-countries-with-most-refugees-to-country': regionalWidgetGenerator('refugeesInXFromOtherCountriesInYear', 'AF', 30, 'LAND I AFRIKA SOM FLEST HAR FLYKTET TIL', 'Kilde: UNHCR'),
  'static-africa-countries-with-most-new-refugees-to-country': regionalWidgetGenerator(
    'newRefugeesInXFromOtherCountriesInYear',
    'AF',
    30,
    'Flest nye flyktninger i 2018 til landet',
    [
      'Kilde: UNHCR']
  ),
  'static-africa-countries-with-most-new-refugees-from': regionalWidgetGenerator('newRefugeesFromXInYear', 'AF', 30, 'Flest nye flyktninger i 2018 fra landet', 'Kilde: UNHCR'),
  'static-africa-countries-with-most-idps': regionalWidgetGenerator('idpsInXInYear', 'AF', 30, 'LAND I AFRIKA MED FLEST INTERNT FORDREVNE', 'Kilde: IDMC'),
  'static-africa-countries-with-most-new-idps': regionalWidgetGenerator('newIdpsInXInYear', 'AF', 30, 'LAND I AFRIKA MED FLEST NYE INTERNT FORDREVNE I 2018', 'Kilde: IDMC'),

  'static-america-countries-with-most-refugees-from': regionalWidgetGenerator('totalRefugeesFromX', 'NANS', 30, 'LAND I AMERIKA SOM FLEST HAR FLYKTET FRA', 'Kilde: UNHCR'),
  'static-america-countries-with-most-refugees-to-country': regionalWidgetGenerator('refugeesInXFromOtherCountriesInYear', 'NANS', 30, 'LAND I AMERIKA FLEST HAR FLYKTET TIL', 'Kilde: UNHCR'),
  'static-america-countries-with-most-new-refugees-to-country': regionalWidgetGenerator('newRefugeesInXFromOtherCountriesInYear', 'NANS', 30, 'Flest nye flyktninger i 2018 til landet', 'Kilde: UNHCR'),
  'static-america-countries-with-most-new-refugees-from': regionalWidgetGenerator('newRefugeesFromXInYear', 'NANS', 30, 'Flest nye flyktninger i 2018 fra landet', 'Kilde: UNHCR'),
  'static-america-countries-with-most-idps': regionalWidgetGenerator('idpsInXInYear', 'NANS', 30, 'LAND I AMERIKA MED FLEST INTERNT FORDREVNE', 'Kilde: IDMC'),
  'static-america-countries-with-most-new-idps': regionalWidgetGenerator('newIdpsInXInYear', 'NANS', 30, 'LAND I AMERIKA MED FLEST NYE INTERNT FORDREVNE I 2018',
    [
      'Kilde: IDMC'
    ]
  ),

  'static-asia-oceania-middle-east-countries-with-most-refugees-from': regionalWidgetGenerator('totalRefugeesFromX', ['ASOC', 'ME'], 30, 'LAND I ASIA OG OCEANIA, INKL. MIDTØSTEN, SOM FLEST HAR FLYKTET FRA', 'Kilde: UNHCR'),
  'static-asia-oceania-middle-east-countries-with-most-refugees-to-country': regionalWidgetGenerator('refugeesInXFromOtherCountriesInYear', ['ASOC', 'ME'], 30, 'LAND I ASIA OG OCEANIA, INKL. MIDTØSTEN, FLEST HAR FLYKTET TIL', 'Kilde: UNHCR'),
  'static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country': regionalWidgetGenerator('newRefugeesInXFromOtherCountriesInYear', ['ASOC', 'ME'], 30, 'Flest nye flyktninger i 2018 til landet', 'Kilde: UNHCR'),
  'static-asia-oceania-middle-east-countries-with-most-new-refugees-from': regionalWidgetGenerator('newRefugeesFromXInYear', ['ASOC', 'ME'], 30, 'Flest nye flyktninger i 2018 fra landet', 'Kilde: UNHCR'),
  'static-asia-oceania-middle-east-countries-with-most-idps': regionalWidgetGenerator('idpsInXInYear', ['ASOC', 'ME'], 30, 'LAND I ASIA OG OCEANIA, INKL. MIDTØSTEN, MED FLEST INTERNT FORDREVNE', 'Kilde: IDMC'),
  'static-asia-oceania-middle-east-countries-with-most-new-idps': regionalWidgetGenerator('newIdpsInXInYear', ['ASOC', 'ME'], 30, 'LAND I ASIA OG OCEANIA, INKL. MIDTØSTEN, MED FLEST NYE INTERNT FORDREVNE I 2018', 'Kilde: IDMC'),

  'static-europe-countries-with-most-refugees-from': regionalWidgetGenerator('totalRefugeesFromX', 'EU', 30, 'LAND I EUROPA SOM FLEST HAR FLYKTET FRA', 'Kilde: UNHCR'),
  'static-europe-countries-with-most-refugees-to-country': regionalWidgetGenerator('refugeesInXFromOtherCountriesInYear', 'EU', 30, 'LAND I EUROPA SOM FLEST HAR FLYKTET TIL', 'Kilde: UNHCR'),
  'static-europe-countries-with-most-new-refugees-to-country': regionalWidgetGenerator('newRefugeesInXFromOtherCountriesInYear', 'EU', 30, 'Flest nye flyktninger i 2018 til landet', 'Kilde: UNHCR'),
  'static-europe-countries-with-most-new-refugees-from': regionalWidgetGenerator('newRefugeesFromXInYear', 'EU', 30, 'Flest nye flyktninger i 2018 fra landet', 'Kilde: UNHCR'),
  'static-europe-countries-with-most-idps': regionalWidgetGenerator('idpsInXInYear', 'EU', 30, 'LAND I EUROPA MED FLEST INTERNT FORDREVNE', 'Kilde: IDMC'),
  'static-europe-countries-with-most-new-idps': regionalWidgetGenerator('newIdpsInXInYear', 'EU', 30, 'LAND I EUROPA MED FLEST NYE INTERNT FORDREVNE I 2018', 'Kilde: IDMC')

}
