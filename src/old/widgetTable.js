
const continentCodeNameMap = require('./assets/continentCodeNameMapEnglish.json')
const countryCodeNameMap = require('./assets/countryCodeNameMapEnglish.json')
const continentColorMap = require('./assets/continentColorMap.json')

const staticGenerators = {

  "static-main-table": require("./staticTableWidgets/static-main-table").default,

  "static-countries-with-most-idps": require("./staticTableWidgets/idps/static-countries-with-most-idps").default,
  "static-countries-with-most-new-idps": require("./staticTableWidgets/idps/static-countries-with-most-new-idps").default,
  "static-idps-per-worldzone": require("./staticTableWidgets/idps/static-idps-per-worldzone").default,
  "static-new-idps-per-worldzone": require("./staticTableWidgets/idps/static-new-idps-per-worldzone").default,

  "static-new-refugees-from-country-per-worldzone": require("./staticTableWidgets/refugeesFrom/static-new-refugees-from-country-per-worldzone").default,
  "static-refugees-from-country-per-worldzone": require("./staticTableWidgets/refugeesFrom/static-refugees-from-country-per-worldzone").default,
  "static-countries-with-most-new-refugees-from-country": require("./staticTableWidgets/refugeesFrom/static-countries-with-most-new-refugees-from-country").default,
  "static-countries-with-most-refugees-from-country": require("./staticTableWidgets/refugeesFrom/static-countries-with-most-refugees-from-country").default,

  "static-countries-with-most-new-refugees-to-country": require("./staticTableWidgets/refugeesTo/static-countries-with-most-new-refugees-to-country.js").default,
  "static-countries-with-most-refugees-to-country": require("./staticTableWidgets/refugeesTo/static-countries-with-most-refugees-to-country.js").default,
  "static-new-refugees-to-country-per-worldzone": require("./staticTableWidgets/refugeesTo/static-new-refugees-to-country-per-worldzone.js").default,
  "static-refugees-to-country-per-worldzone": require("./staticTableWidgets/refugeesTo/static-refugees-to-country-per-worldzone.js").default,

  "static-countries-with-most-voluntary-returns": require("./staticTableWidgets/voluntaryReturnsToXInYear/static-countries-with-most-voluntary-returns.js").default,

  "static-refugees-plus-idps-from-origin-countries-per-worldzone": require("./staticTableWidgets/refugeesPlusIdps/static-refugees-plus-idps-from-origin-countries-per-worldzone").default,
  "static-refugees-plus-idps-in-host-countries-per-worldzone": require("./staticTableWidgets/refugeesPlusIdps/static-refugees-plus-idps-in-host-countries-per-worldzone").default,
  "static-origin-countries-with-most-refugees-plus-idps-long": require("./staticTableWidgets/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-long").default,
  "static-origin-countries-with-most-refugees-plus-idps-short": require("./staticTableWidgets/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-short").default,

  "static-africa-countries-with-most-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-from"],
  "static-africa-countries-with-most-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-to-country"],
  "static-africa-countries-with-most-new-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-to-country"],
  "static-africa-countries-with-most-new-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-from"],
  "static-africa-countries-with-most-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-idps"],
  "static-africa-countries-with-most-new-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-africa-countries-with-most-new-idps"],

  "static-america-countries-with-most-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-refugees-from"],
  "static-america-countries-with-most-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-refugees-to-country"],
  "static-america-countries-with-most-new-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-to-country"],
  "static-america-countries-with-most-new-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-from"],
  "static-america-countries-with-most-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-idps"],
  "static-america-countries-with-most-new-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-america-countries-with-most-new-idps"],

  "static-asia-oceania-middle-east-countries-with-most-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-from"],
  "static-asia-oceania-middle-east-countries-with-most-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-to-country"],
  "static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country"],
  "static-asia-oceania-middle-east-countries-with-most-new-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-from"],
  "static-asia-oceania-middle-east-countries-with-most-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-idps"],
  "static-asia-oceania-middle-east-countries-with-most-new-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-idps"],

  "static-europe-countries-with-most-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-from"],
  "static-europe-countries-with-most-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-to-country"],
  "static-europe-countries-with-most-new-refugees-to-country": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-to-country"],
  "static-europe-countries-with-most-new-refugees-from": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-from"],
  "static-europe-countries-with-most-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-idps"],
  "static-europe-countries-with-most-new-idps": require("./staticTableWidgets/region/static-regional-widgets").default["static-europe-countries-with-most-new-idps"],

  "static-host-countries-with-most-refugees-in-ratio-to-population": require("./staticTableWidgets/datapoint-with-population-ratio/static-host-countries-with-most-refugees-in-ratio-to-population.js").default,
  "static-host-countries-with-most-new-refugees-in-ratio-to-population": require("./staticTableWidgets/datapoint-with-population-ratio/static-host-countries-with-most-new-refugees-in-ratio-to-population.js").default,


  "2017-static-main-table": require("./staticTableWidgets2017/static-main-table").default,

  "2017-static-countries-with-most-idps": require("./staticTableWidgets2017/idps/static-countries-with-most-idps").default,
  "2017-static-countries-with-most-new-idps": require("./staticTableWidgets2017/idps/static-countries-with-most-new-idps").default,
  "2017-static-idps-per-worldzone": require("./staticTableWidgets2017/idps/static-idps-per-worldzone").default,
  "2017-static-new-idps-per-worldzone": require("./staticTableWidgets2017/idps/static-new-idps-per-worldzone").default,

  "2017-static-new-refugees-from-country-per-worldzone": require("./staticTableWidgets2017/refugeesFrom/static-new-refugees-from-country-per-worldzone").default,
  "2017-static-refugees-from-country-per-worldzone": require("./staticTableWidgets2017/refugeesFrom/static-refugees-from-country-per-worldzone").default,
  "2017-static-countries-with-most-new-refugees-from-country": require("./staticTableWidgets2017/refugeesFrom/static-countries-with-most-new-refugees-from-country").default,
  "2017-static-countries-with-most-refugees-from-country": require("./staticTableWidgets2017/refugeesFrom/static-countries-with-most-refugees-from-country").default,

  "2017-static-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2017/refugeesTo/static-countries-with-most-new-refugees-to-country.js").default,
  "2017-static-countries-with-most-refugees-to-country": require("./staticTableWidgets2017/refugeesTo/static-countries-with-most-refugees-to-country.js").default,
  "2017-static-new-refugees-to-country-per-worldzone": require("./staticTableWidgets2017/refugeesTo/static-new-refugees-to-country-per-worldzone.js").default,
  "2017-static-refugees-to-country-per-worldzone": require("./staticTableWidgets2017/refugeesTo/static-refugees-to-country-per-worldzone.js").default,

  "2017-static-countries-with-most-voluntary-returns": require("./staticTableWidgets2017/voluntaryReturnsToXInYear/static-countries-with-most-voluntary-returns.js").default,

  "2017-static-refugees-plus-idps-from-origin-countries-per-worldzone": require("./staticTableWidgets2017/refugeesPlusIdps/static-refugees-plus-idps-from-origin-countries-per-worldzone").default,
  "2017-static-refugees-plus-idps-in-host-countries-per-worldzone": require("./staticTableWidgets2017/refugeesPlusIdps/static-refugees-plus-idps-in-host-countries-per-worldzone").default,
  "2017-static-origin-countries-with-most-refugees-plus-idps-long": require("./staticTableWidgets2017/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-long").default,
  "2017-static-origin-countries-with-most-refugees-plus-idps-short": require("./staticTableWidgets2017/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-short").default,

  "2017-static-africa-countries-with-most-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-from"],
  "2017-static-africa-countries-with-most-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-to-country"],
  "2017-static-africa-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-to-country"],
  "2017-static-africa-countries-with-most-new-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-from"],
  "2017-static-africa-countries-with-most-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-idps"],
  "2017-static-africa-countries-with-most-new-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-africa-countries-with-most-new-idps"],

  "2017-static-america-countries-with-most-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-refugees-from"],
  "2017-static-america-countries-with-most-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-refugees-to-country"],
  "2017-static-america-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-to-country"],
  "2017-static-america-countries-with-most-new-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-from"],
  "2017-static-america-countries-with-most-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-idps"],
  "2017-static-america-countries-with-most-new-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-america-countries-with-most-new-idps"],

  "2017-static-asia-oceania-middle-east-countries-with-most-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-from"],
  "2017-static-asia-oceania-middle-east-countries-with-most-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-to-country"],
  "2017-static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country"],
  "2017-static-asia-oceania-middle-east-countries-with-most-new-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-from"],
  "2017-static-asia-oceania-middle-east-countries-with-most-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-idps"],
  "2017-static-asia-oceania-middle-east-countries-with-most-new-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-idps"],

  "2017-static-europe-countries-with-most-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-from"],
  "2017-static-europe-countries-with-most-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-to-country"],
  "2017-static-europe-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-to-country"],
  "2017-static-europe-countries-with-most-new-refugees-from": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-from"],
  "2017-static-europe-countries-with-most-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-idps"],
  "2017-static-europe-countries-with-most-new-idps": require("./staticTableWidgets2017/region/static-regional-widgets").default["static-europe-countries-with-most-new-idps"],

  "2017-static-host-countries-with-most-refugees-in-ratio-to-population": require("./staticTableWidgets2017/datapoint-with-population-ratio/static-host-countries-with-most-refugees-in-ratio-to-population.js").default,
  "2017-static-host-countries-with-most-new-refugees-in-ratio-to-population": require("./staticTableWidgets2017/datapoint-with-population-ratio/static-host-countries-with-most-new-refugees-in-ratio-to-population.js").default,








  "2018-static-main-table": require("./staticTableWidgets2018/static-main-table").default,

  "2018-static-countries-with-most-idps": require("./staticTableWidgets2018/idps/static-countries-with-most-idps").default,
  "2018-static-countries-with-most-new-idps": require("./staticTableWidgets2018/idps/static-countries-with-most-new-idps").default,
  "2018-static-idps-per-worldzone": require("./staticTableWidgets2018/idps/static-idps-per-worldzone").default,
  "2018-static-new-idps-per-worldzone": require("./staticTableWidgets2018/idps/static-new-idps-per-worldzone").default,

  "2018-static-new-refugees-from-country-per-worldzone": require("./staticTableWidgets2018/refugeesFrom/static-new-refugees-from-country-per-worldzone").default,
  "2018-static-refugees-from-country-per-worldzone": require("./staticTableWidgets2018/refugeesFrom/static-refugees-from-country-per-worldzone").default,
  "2018-static-countries-with-most-new-refugees-from-country": require("./staticTableWidgets2018/refugeesFrom/static-countries-with-most-new-refugees-from-country").default,
  "2018-static-countries-with-most-refugees-from-country": require("./staticTableWidgets2018/refugeesFrom/static-countries-with-most-refugees-from-country").default,

  "2018-static-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2018/refugeesTo/static-countries-with-most-new-refugees-to-country.js").default,
  "2018-static-countries-with-most-refugees-to-country": require("./staticTableWidgets2018/refugeesTo/static-countries-with-most-refugees-to-country.js").default,
  "2018-static-new-refugees-to-country-per-worldzone": require("./staticTableWidgets2018/refugeesTo/static-new-refugees-to-country-per-worldzone.js").default,
  "2018-static-refugees-to-country-per-worldzone": require("./staticTableWidgets2018/refugeesTo/static-refugees-to-country-per-worldzone.js").default,

  "2018-static-countries-with-most-voluntary-returns": require("./staticTableWidgets2018/voluntaryReturnsToXInYear/static-countries-with-most-voluntary-returns.js").default,

  "2018-static-refugees-plus-idps-from-origin-countries-per-worldzone": require("./staticTableWidgets2018/refugeesPlusIdps/static-refugees-plus-idps-from-origin-countries-per-worldzone").default,
  "2018-static-refugees-plus-idps-in-host-countries-per-worldzone": require("./staticTableWidgets2018/refugeesPlusIdps/static-refugees-plus-idps-in-host-countries-per-worldzone").default,
  "2018-static-origin-countries-with-most-refugees-plus-idps-long": require("./staticTableWidgets2018/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-long").default,
  "2018-static-origin-countries-with-most-refugees-plus-idps-short": require("./staticTableWidgets2018/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-short").default,

  "2018-static-africa-countries-with-most-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-from"],
  "2018-static-africa-countries-with-most-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-refugees-to-country"],
  "2018-static-africa-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-to-country"],
  "2018-static-africa-countries-with-most-new-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-new-refugees-from"],
  "2018-static-africa-countries-with-most-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-idps"],
  "2018-static-africa-countries-with-most-new-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-africa-countries-with-most-new-idps"],

  "2018-static-america-countries-with-most-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-refugees-from"],
  "2018-static-america-countries-with-most-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-refugees-to-country"],
  "2018-static-america-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-to-country"],
  "2018-static-america-countries-with-most-new-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-new-refugees-from"],
  "2018-static-america-countries-with-most-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-idps"],
  "2018-static-america-countries-with-most-new-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-america-countries-with-most-new-idps"],

  "2018-static-asia-oceania-middle-east-countries-with-most-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-from"],
  "2018-static-asia-oceania-middle-east-countries-with-most-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-refugees-to-country"],
  "2018-static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country"],
  "2018-static-asia-oceania-middle-east-countries-with-most-new-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-refugees-from"],
  "2018-static-asia-oceania-middle-east-countries-with-most-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-idps"],
  "2018-static-asia-oceania-middle-east-countries-with-most-new-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-asia-oceania-middle-east-countries-with-most-new-idps"],

  "2018-static-europe-countries-with-most-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-from"],
  "2018-static-europe-countries-with-most-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-refugees-to-country"],
  "2018-static-europe-countries-with-most-new-refugees-to-country": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-to-country"],
  "2018-static-europe-countries-with-most-new-refugees-from": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-new-refugees-from"],
  "2018-static-europe-countries-with-most-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-idps"],
  "2018-static-europe-countries-with-most-new-idps": require("./staticTableWidgets2018/region/static-regional-widgets").default["static-europe-countries-with-most-new-idps"],

  "2018-static-host-countries-with-most-refugees-in-ratio-to-population": require("./staticTableWidgets2018/datapoint-with-population-ratio/static-host-countries-with-most-refugees-in-ratio-to-population.js").default,
  "2018-static-host-countries-with-most-new-refugees-in-ratio-to-population": require("./staticTableWidgets2018/datapoint-with-population-ratio/static-host-countries-with-most-new-refugees-in-ratio-to-population.js").default,
}

function drawWidgetTable(widgetObject, widgetData, targetSelector) {

  const id = widgetObject.id

  $(targetSelector).addClass("nrcstat-table-widget")
  $(targetSelector).parent().css("height", "auto")

  if (staticGenerators[id]){
    let func = staticGenerators[id]
    func(widgetObject, widgetData, targetSelector)
  }
}

module.exports = drawWidgetTable
