import generator from "../generic/generic-table-widget";
import { thousandsFormatter } from "../../../../util/tableWidgetFormatters";

export default function (widgetParams) {
  const { t, periodYear, locale } = widgetParams;
  const title = t(
    `RefugeeReport${
      periodYear + 1
    }.IDP.RefugeeDataPointPlusIDPDataPoint.OriginCountriesWithMostRefugeesPlusIdps.LongTable.Heading`
  );

  const footerAnnotations = t(
    `RefugeeReport${
      periodYear + 1
    }.IDP.RefugeeDataPointPlusIDPDataPoint.OriginCountriesWithMostRefugeesPlusIdps.LongTable.TableFooterText`
  );

  const query = {
    where: {
      year: periodYear,
      dataPoint: { inq: ["idpsInXInYear", "totalRefugeesFromX"] },
      continentCode: { nin: ["WORLD"] },
    },
  };

  return generator(
    title,
    t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.number`),
    process,
    query,
    footerAnnotations,
    t(`RefugeeReport${periodYear + 1}.MiscSharedLabels.country`),
    true,
    thousandsFormatter(locale)
  );

  function process(data) {
    data = _(data)
      .groupBy("countryCode")
      .mapValues((countryDataPoints) => _.sumBy(countryDataPoints, "data"))
      .map((refugeesPlusIdps, countryCode) => {
        return { countryCode, data: refugeesPlusIdps };
      })
      .map((country) => {
        country.place = t(
          `NRC.Web.StaticTextDictionary.Contries.${country.countryCode}`
        );
        return country;
      })
      .filter((country) => !!country.data)
      .filter((country) => country.countryCode !== "MISC")
      .orderBy((country) => country.data, "desc")
      .take(30)
      .value();
    return data;
  }
}
