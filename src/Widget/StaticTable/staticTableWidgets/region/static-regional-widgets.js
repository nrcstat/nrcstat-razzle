import regionalWidgetGenerator from './generics/countries-with-most-of-datapoint-x'

// process footer
function f(input) {
  return input
}

export default {
  'static-africa-countries-with-most-refugees-from': (w) =>
    regionalWidgetGenerator(
      'totalRefugeesFromX',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostRefugeesFromCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostRefugeesFromCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-africa-countries-with-most-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'refugeesInXFromOtherCountriesInYear',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-africa-countries-with-most-new-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'newRefugeesInXFromOtherCountriesInYear',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostNewRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostNewRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-africa-countries-with-most-new-refugees-from': (w) =>
    regionalWidgetGenerator(
      'newRefugeesFromXInYear',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostNewRefugeesFrom.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostNewRefugeesFrom.TableFooterText`
        )
      ),
      w
    ),
  'static-africa-countries-with-most-idps': (w) =>
    regionalWidgetGenerator(
      'idpsInXInYear',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostIdps.TableFooterText`
        )
      ),
      w
    ),
  'static-africa-countries-with-most-new-idps': (w) =>
    regionalWidgetGenerator(
      'newIdpsInXInYear',
      'AF',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Africa.CountriesWithMostNewIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Africa.CountriesWithMostNewIdps.TableFooterText`
        )
      ),
      w
    ),

  'static-america-countries-with-most-refugees-from': (w) =>
    regionalWidgetGenerator(
      'totalRefugeesFromX',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostRefugeesFromCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostRefugeesFromCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-america-countries-with-most-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'refugeesInXFromOtherCountriesInYear',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-america-countries-with-most-new-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'newRefugeesInXFromOtherCountriesInYear',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostNewRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostNewRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-america-countries-with-most-new-refugees-from': (w) =>
    regionalWidgetGenerator(
      'newRefugeesFromXInYear',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostNewRefugeesFrom.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostNewRefugeesFrom.TableFooterText`
        )
      ),
      w
    ),
  'static-america-countries-with-most-idps': (w) =>
    regionalWidgetGenerator(
      'idpsInXInYear',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostIdps.TableFooterText`
        )
      ),
      w
    ),
  'static-america-countries-with-most-new-idps': (w) =>
    regionalWidgetGenerator(
      'newIdpsInXInYear',
      'NANS',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.America.CountriesWithMostNewIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.America.CountriesWithMostNewIdps.TableFooterText`
        )
      ),
      w
    ),

  'static-asia-oceania-middle-east-countries-with-most-refugees-from': (w) =>
    regionalWidgetGenerator(
      'totalRefugeesFromX',
      ['ASOC', 'ME'],
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostRefugeesFromCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostRefugeesFromCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-asia-oceania-middle-east-countries-with-most-refugees-to-country': (
    w
  ) =>
    regionalWidgetGenerator(
      'refugeesInXFromOtherCountriesInYear',
      ['ASOC', 'ME'],
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country':
    (w) =>
      regionalWidgetGenerator(
        'newRefugeesInXFromOtherCountriesInYear',
        ['ASOC', 'ME'],
        30,
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewRefugeesToCountry.Heading`
        ),
        f(
          w.t(
            `RefugeeReport${
              w.periodYear + 1
            }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewRefugeesToCountry.TableFooterText`
          )
        ),
        w
      ),
  'static-asia-oceania-middle-east-countries-with-most-new-refugees-from': (
    w
  ) =>
    regionalWidgetGenerator(
      'newRefugeesFromXInYear',
      ['ASOC', 'ME'],
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewRefugeesFrom.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewRefugeesFrom.TableFooterText`
        )
      ),
      w
    ),
  'static-asia-oceania-middle-east-countries-with-most-idps': (w) =>
    regionalWidgetGenerator(
      'idpsInXInYear',
      ['ASOC', 'ME'],
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostIdps.TableFooterText`
        )
      ),
      w
    ),
  'static-asia-oceania-middle-east-countries-with-most-new-idps': (w) =>
    regionalWidgetGenerator(
      'newIdpsInXInYear',
      ['ASOC', 'ME'],
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.AsiaOceaniaMiddleEast.CountriesWithMostNewIdps.TableFooterText`
        )
      ),
      w
    ),

  'static-europe-countries-with-most-refugees-from': (w) =>
    regionalWidgetGenerator(
      'totalRefugeesFromX',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostRefugeesFromCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostRefugeesFromCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-europe-countries-with-most-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'refugeesInXFromOtherCountriesInYear',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-europe-countries-with-most-new-refugees-to-country': (w) =>
    regionalWidgetGenerator(
      'newRefugeesInXFromOtherCountriesInYear',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostNewRefugeesToCountry.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostNewRefugeesToCountry.TableFooterText`
        )
      ),
      w
    ),
  'static-europe-countries-with-most-new-refugees-from': (w) =>
    regionalWidgetGenerator(
      'newRefugeesFromXInYear',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostNewRefugeesFrom.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostNewRefugeesFrom.TableFooterText`
        )
      ),
      w
    ),
  'static-europe-countries-with-most-idps': (w) =>
    regionalWidgetGenerator(
      'idpsInXInYear',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostIdps.TableFooterText`
        )
      ),
      w
    ),
  'static-europe-countries-with-most-new-idps': (w) =>
    regionalWidgetGenerator(
      'newIdpsInXInYear',
      'EU',
      30,
      w.t(
        `RefugeeReport${
          w.periodYear + 1
        }.Regional.Europe.CountriesWithMostNewIdps.Heading`
      ),
      f(
        w.t(
          `RefugeeReport${
            w.periodYear + 1
          }.Regional.Europe.CountriesWithMostNewIdps.TableFooterText`
        )
      ),
      w
    ),
}
