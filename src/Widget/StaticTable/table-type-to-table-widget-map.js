export default {

  'main-table': require('./staticTableWidgets/static-main-table').default,

  'countries-with-most-idps': require('./staticTableWidgets/idps/static-countries-with-most-idps').default,
  'countries-with-most-new-idps': require('./staticTableWidgets/idps/static-countries-with-most-new-idps').default,
  'idps-per-worldzone': require('./staticTableWidgets/idps/static-idps-per-worldzone').default,
  'new-idps-per-worldzone': require('./staticTableWidgets/idps/static-new-idps-per-worldzone').default,

  'new-refugees-from-country-per-worldzone': require('./staticTableWidgets/refugeesFrom/static-new-refugees-from-country-per-worldzone').default,
  'refugees-from-country-per-worldzone': require('./staticTableWidgets/refugeesFrom/static-refugees-from-country-per-worldzone').default,
  'countries-with-most-new-refugees-from-country': require('./staticTableWidgets/refugeesFrom/static-countries-with-most-new-refugees-from-country').default,
  'countries-with-most-refugees-from-country': require('./staticTableWidgets/refugeesFrom/static-countries-with-most-refugees-from-country').default,

  'countries-with-most-new-refugees-to-country': require('./staticTableWidgets/refugeesTo/static-countries-with-most-new-refugees-to-country.js').default,
  'countries-with-most-refugees-to-country': require('./staticTableWidgets/refugeesTo/static-countries-with-most-refugees-to-country.js').default,
  'new-refugees-to-country-per-worldzone': require('./staticTableWidgets/refugeesTo/static-new-refugees-to-country-per-worldzone.js').default,
  'refugees-to-country-per-worldzone': require('./staticTableWidgets/refugeesTo/static-refugees-to-country-per-worldzone.js').default,

  'countries-with-most-voluntary-returns': require('./staticTableWidgets/voluntaryReturnsToXInYear/static-countries-with-most-voluntary-returns.js').default,

  'refugees-plus-idps-from-origin-countries-per-worldzone': require('./staticTableWidgets/refugeesPlusIdps/static-refugees-plus-idps-from-origin-countries-per-worldzone').default,
  'refugees-plus-idps-in-host-countries-per-worldzone': require('./staticTableWidgets/refugeesPlusIdps/static-refugees-plus-idps-in-host-countries-per-worldzone').default,
  'origin-countries-with-most-refugees-plus-idps-long': require('./staticTableWidgets/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-long').default,
  'origin-countries-with-most-refugees-plus-idps-short': require('./staticTableWidgets/refugeesPlusIdps/static-origin-countries-with-most-refugees-plus-idps-short').default,

  'africa-countries-with-most-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-refugees-from'],
  'africa-countries-with-most-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-refugees-to-country'],
  'africa-countries-with-most-new-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-new-refugees-to-country'],
  'africa-countries-with-most-new-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-new-refugees-from'],
  'africa-countries-with-most-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-idps'],
  'africa-countries-with-most-new-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-africa-countries-with-most-new-idps'],

  'america-countries-with-most-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-refugees-from'],
  'america-countries-with-most-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-refugees-to-country'],
  'america-countries-with-most-new-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-new-refugees-to-country'],
  'america-countries-with-most-new-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-new-refugees-from'],
  'america-countries-with-most-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-idps'],
  'america-countries-with-most-new-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-america-countries-with-most-new-idps'],

  'asia-oceania-middle-east-countries-with-most-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-refugees-from'],
  'asia-oceania-middle-east-countries-with-most-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-refugees-to-country'],
  'asia-oceania-middle-east-countries-with-most-new-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-new-refugees-to-country'],
  'asia-oceania-middle-east-countries-with-most-new-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-new-refugees-from'],
  'asia-oceania-middle-east-countries-with-most-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-idps'],
  'asia-oceania-middle-east-countries-with-most-new-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-asia-oceania-middle-east-countries-with-most-new-idps'],

  'europe-countries-with-most-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-refugees-from'],
  'europe-countries-with-most-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-refugees-to-country'],
  'europe-countries-with-most-new-refugees-to-country': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-new-refugees-to-country'],
  'europe-countries-with-most-new-refugees-from': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-new-refugees-from'],
  'europe-countries-with-most-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-idps'],
  'europe-countries-with-most-new-idps': require('./staticTableWidgets/region/static-regional-widgets').default['static-europe-countries-with-most-new-idps'],

  'host-countries-with-most-refugees-in-ratio-to-population': require('./staticTableWidgets/datapoint-with-population-ratio/static-host-countries-with-most-refugees-in-ratio-to-population.js').default,
  'host-countries-with-most-new-refugees-in-ratio-to-population': require('./staticTableWidgets/datapoint-with-population-ratio/static-host-countries-with-most-new-refugees-in-ratio-to-population.js').default
}
