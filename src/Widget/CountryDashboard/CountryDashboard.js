import React, { useContext, useState } from 'react'
import 'react-vis/dist/style.css'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import c from './CountryDashboard.module.scss'
import './CountryDashboard.scss'
import { CountryMap } from './CountryMap'
import { DashboardHeader } from './DashboardHeader'
import { Ingress } from './Ingress'
import { PercentageDonut } from './PercentageDonut'
import { StatsInfoText } from './StatsInfoText'
import { StatsTable } from './StatsTable'

export default function CountryDashboard() {
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, year } = widgetParams
  const [selectedYear, setSelectedYear] = useState(parseInt(year))

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
          <CountryMap selectedYear={selectedYear} />
        </div>
        {isIngressNonEmpty ? (
          <div className={c['ingress']}>
            <Ingress />
          </div>
        ) : null}
      </div>

      <div className={c['donut-table-wrapper']}>
        <div style={{ flex: '1' }}>
          <StatsTable
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
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
