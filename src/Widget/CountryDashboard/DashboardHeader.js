import { chain, last } from 'lodash'
import React, { useContext } from 'react'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import { getCountryStat } from './get-country-stat'
import c from './DashboardHeader.module.scss'

export function DashboardHeader() {
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, preloadedWidgetData, year } = widgetParams

  const t = getNsFixedT(['Widget.Static.CountryDashboard', 'GeographicalNames'])

  const population = getCountryStat(
    preloadedWidgetData,
    countryCode,
    'population',
    parseInt(year)
  ).data

  return (
    <div className={c['dashboard-header']}>
      <img
        src={flagImagesMap[countryCode]}
        style={{
          height: '2.4em',
          float: 'left',
          marginRight: '1em',
          border: '1px solid #d4d4d4',
        }}
      />
      <p
        style={{
          margin: 0,
          padding: 0,
          color: '#212121',
          fontFamily: "'Roboto'",
          fontWeight: 'bold',
          fontSize: '2em',
        }}
      >
        {t(`NRC.Web.StaticTextDictionary.Contries.${countryCode}`)}
      </p>
      <p
        style={{
          margin: '0.2em 0 0 0',
          padding: 0,
          color: '#5F5F5F',
          fontFamily: "'Roboto Condensed'",
          fontSize: '0.8em',
        }}
      >
        {t('population', { populationInMillions: population })}
      </p>
    </div>
  )
}

const req = require.context('../assets/flags', false)
// TOOD: use flow here instead, fp style, this below probably imports a lot of stuf
const flagImagesMap = chain(
  req.keys().map((file) => ({
    file: req(file),
    countryCode: last(file.split('/')).split('.')[0].toUpperCase(),
  }))
)
  .keyBy('countryCode')
  .mapValues('file')
  .value()
