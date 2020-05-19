import regionalWidgetGenerator from "./generics/countries-with-most-of-datapoint-x"

export default {
  "static-africa-countries-with-most-refugees-from": regionalWidgetGenerator("totalRefugeesFromX", "AF", 30, "LAND SOM FLEST HAR FLYKTET FRA", "Kilde: UNHCR"),
  "static-africa-countries-with-most-refugees-to-country": regionalWidgetGenerator("refugeesInXFromOtherCountriesInYear", "AF", 30, "LAND SOM FLEST HAR FLYKTET TIL", "Kilde: UNHCR"),
  "static-africa-countries-with-most-new-refugees-to-country": regionalWidgetGenerator(
      "newRefugeesInXFromOtherCountriesInYear",
      "AF",
      30,
      "FLEST NYE FLYKTNINGER TIL LANDET",
      [
          "Kilde: UNHCR"]
  ),
  "static-africa-countries-with-most-new-refugees-from": regionalWidgetGenerator("newRefugeesFromXInYear", "AF", 30, "FLEST NYE FLYKTNINGER FRA LANDET", "Kilde: UNHCR"),
  "static-africa-countries-with-most-idps": regionalWidgetGenerator("idpsInXInYear", "AF", 30, "LAND MED FLEST INTERNT FORDREVNE", "Kilde: IDMC"),
  "static-africa-countries-with-most-new-idps": regionalWidgetGenerator("newIdpsInXInYear", "AF", 30, "LAND MED FLEST NYE INTERNT FORDREVNE", "Kilde: IDMC"),

  "static-america-countries-with-most-refugees-from": regionalWidgetGenerator("totalRefugeesFromX", "NANS", 30, "LAND SOM FLEST HAR FLYKTET FRA", "Kilde: UNHCR"),
  "static-america-countries-with-most-refugees-to-country": regionalWidgetGenerator("refugeesInXFromOtherCountriesInYear", "NANS", 30, "LAND SOM FLEST HAR FLYKTET TIL", "Kilde: UNHCR"),
  "static-america-countries-with-most-new-refugees-to-country": regionalWidgetGenerator("newRefugeesInXFromOtherCountriesInYear", "NANS", 30, "FLEST NYE FLYKTNINGER TIL LANDET", "Kilde: UNHCR"),
  "static-america-countries-with-most-new-refugees-from": regionalWidgetGenerator("newRefugeesFromXInYear", "NANS", 30, "FLEST NYE FLYKTNINGER FRA LANDET", "Kilde: UNHCR"),
  "static-america-countries-with-most-idps": regionalWidgetGenerator("idpsInXInYear", "NANS", 30, "LAND MED FLEST INTERNT FORDREVNE", "Kilde: IDMC"),
  "static-america-countries-with-most-new-idps": regionalWidgetGenerator("newIdpsInXInYear", "NANS", 30, "LAND MED FLEST NYE INTERNT FORDREVNE",
      [
          "Kilde: IDMC"
      ]
  ),

  "static-asia-oceania-middle-east-countries-with-most-refugees-from": regionalWidgetGenerator("totalRefugeesFromX", ["ASOC","ME"], 30, "LAND SOM FLEST HAR FLYKTET FRA", "Kilde: UNHCR"),
  "static-asia-oceania-middle-east-countries-with-most-refugees-to-country": regionalWidgetGenerator("refugeesInXFromOtherCountriesInYear", ["ASOC","ME"], 30, "LAND SOM FLEST HAR FLYKTET TIL", "Kilde: UNHCR"),
  "static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country": regionalWidgetGenerator("newRefugeesInXFromOtherCountriesInYear", ["ASOC","ME"], 30, "FLEST NYE FLYKTNINGER TIL LANDET", "Kilde: UNHCR"),
  "static-asia-oceania-middle-east-countries-with-most-new-refugees-from": regionalWidgetGenerator("newRefugeesFromXInYear", ["ASOC","ME"], 30, "FLEST NYE FLYKTNINGER FRA LANDET", "Kilde: UNHCR"),
  "static-asia-oceania-middle-east-countries-with-most-idps": regionalWidgetGenerator("idpsInXInYear", ["ASOC","ME"], 30, "LAND MED FLEST INTERNT FORDREVNE", "Kilde: IDMC"),
  "static-asia-oceania-middle-east-countries-with-most-new-idps": regionalWidgetGenerator("newIdpsInXInYear", ["ASOC","ME"], 30, "LAND MED FLEST NYE INTERNT FORDREVNE", "Kilde: IDMC"),

  "static-europe-countries-with-most-refugees-from": regionalWidgetGenerator("totalRefugeesFromX", "EU", 30, "LAND SOM FLEST HAR FLYKTET FRA", "Kilde: UNHCR"),
  "static-europe-countries-with-most-refugees-to-country": regionalWidgetGenerator("refugeesInXFromOtherCountriesInYear", "EU", 30, "LAND SOM FLEST HAR FLYKTET TIL", "Kilde: UNHCR"),
  "static-europe-countries-with-most-new-refugees-to-country": regionalWidgetGenerator("newRefugeesInXFromOtherCountriesInYear", "EU", 30, "FLEST NYE FLYKTNINGER TIL LANDET", "Kilde: UNHCR"),
  "static-europe-countries-with-most-new-refugees-from": regionalWidgetGenerator("newRefugeesFromXInYear", "EU", 30, "FLEST NYE FLYKTNINGER FRA LANDET", "Kilde: UNHCR"),
  "static-europe-countries-with-most-idps": regionalWidgetGenerator("idpsInXInYear", "EU", 30, "LAND MED FLEST INTERNT FORDREVNE", "Kilde: IDMC"),
  "static-europe-countries-with-most-new-idps": regionalWidgetGenerator("newIdpsInXInYear", "EU", 30, "LAND MED FLEST NYE INTERNT FORDREVNE", "Kilde: IDMC"),

}
