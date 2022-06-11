import { formatDataNumber } from '@/util/widgetHelpers.js'
import centroidsRaw from '@/Widget/assets/json/geo_entities_updated_manually'
import middleResolutionCountriesGeoJson from '@/Widget/assets/json/ne_110m_admin_0_countries.json'
import { clone, groupBy, includes, isNull, mapValues } from 'lodash'
import React, { useContext, useEffect } from 'react'
import ReactDOM from 'react-dom'
import 'react-vis/dist/style.css'
import { API_URL } from '../../config'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import c from './CountryDashboard.module.scss'
import './CountryDashboard.scss'
import { CountryMap } from './CountryMap'
import { DashboardHeader } from './DashboardHeader'
import { Ingress } from './Ingress'
import { PercentageDonut } from './PercentageDonut'
import { RadialBarChart } from './RadialBarChart'
import { StatsInfoText } from './StatsInfoText'
import { StatsTable } from './StatsTable'

export default function CountryDashboard() {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, year } = widgetParams

  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  let ingress = String(
    t(`countryIngress.${countryCode}`, { defaultValue: '' })
  ).trim()
  const isIngressNonEmpty = Boolean(ingress)

  return (
    <>
      <DashboardHeader />
      <div className={c['dashboard-map-and-ingress-wrapper']}>
        <div className={c['map']}>
          <CountryMap />
        </div>
        {isIngressNonEmpty ? (
          <div className={c['ingress']}>
            <Ingress />
          </div>
        ) : null}
      </div>

      <div className={c['donut-table-wrapper']}>
        <div style={{ flex: '1' }}>
          <StatsTable />
        </div>
        <div className={c['spacer']} />
        <div style={{ flex: '1' }}>
          <div className={c['donuts-wrapper']}>
            <div className={c['donut-wrapper']}>
              {year < 2021 ? (
                <PercentageDonut dataPoint="percentageWomenFleeingToCountry" />
              ) : (
                <PercentageDonut dataPoint="percentageWomenFleeingFromCountry" />
              )}
            </div>
            <div className={c['donut-wrapper']}>
              {year < 2021 ? (
                <PercentageDonut dataPoint="percentageChildrenFleeingToCountry" />
              ) : (
                <PercentageDonut dataPoint="percentageChildrenFleeingFromCountry" />
              )}
            </div>
          </div>
          <StatsInfoText />
        </div>
      </div>
    </>
  )
}
