import { isServer } from '../../util/utils'
import c from './StaticCountrySidebar.module.scss'
import React, { useContext } from 'react'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { thousandsFormatter } from '../../util/tableWidgetFormatters'

function StaticCountrySidebar() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  console.log(widgetParams)
  const { countryCode, locale, dataPoints, preloadedWidgetData } = widgetParams

  const dataMap = makeDataPointToDataMap(dataPoints, preloadedWidgetData)

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT([
    'Widget.Static.CountrySidebar',
    'GeographicalNames',
    'Widget.Static.GlobalRadialBarChartDisplacementMap.ADMIN-SETTINGS-ONLY-ADMINS-TOUCH-THIS',
  ])

  const cells = dataPoints.map((dataPoint) => (
    <div key={dataPoint} className={c['grid-cell']}>
      <div className={c['grid-cell-content']}>
        <dt className={c['datapoint-label']}>
          {t(`dataPointLabel.${dataPoint}`)}
        </dt>
        <dd className={c['datapoint-figure']}>
          {thousandsFormatter(locale)(dataMap[dataPoint])}
        </dd>
      </div>
    </div>
  ))

  const readMoreUrl = t(
    `CountryStatisticsPopup.CountryReadMoreLink.${countryCode}`
  )
  cells.push(
    <div key="read-more" className={c['grid-cell']}>
      <div className={c['grid-cell-content']}>
        <a href={readMoreUrl} className={c['read-more-link']}>
          {t('readMoreLink').replace(
            '{countryName}',
            t(`NRC.Web.StaticTextDictionary.Contries.${countryCode}`)
          )}
        </a>
      </div>
    </div>
  )
  if (cells.length % 2 === 1) {
    cells.push(
      <div key="filler-cell" className={c['grid-cell']}>
        <div className={c['grid-cell-content']} />
      </div>
    )
  }

  return (
    <div className={c.container}>
      <dl className={c['facts-grid']}>{cells}</dl>
    </div>
  )
}

function makeDataPointToDataMap(dataPoints, preloadedWidgetData) {
  const dataMap = {}
  dataPoints.forEach((dataPoint) => {
    dataMap[dataPoint] = preloadedWidgetData.find(
      (d) => d.dataPoint === dataPoint
    ).data
  })
  return dataMap
}

export default StaticCountrySidebar
