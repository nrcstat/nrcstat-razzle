export const determineWidgetType = (API_URL) => widgetId => {
  if (widgetId === 'global-displacement-radial-bar-chart-map-2019-0.1') {
    return 'GlobalMap'
  } else {
    return 'Donut'
  }
}