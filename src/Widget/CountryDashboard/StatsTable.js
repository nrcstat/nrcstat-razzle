import React, { useContext, useEffect, useState } from 'react'
import { getCountryStat } from './get-country-stat'
import c from './StatsTable.module.scss'
import { formatDataNumber } from '@/util/widgetHelpers.js'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { isServer } from '../../util/utils'

export function StatsTable() {
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const data = widgetParams.preloadedWidgetData

  const { countryCode, year, locale } = widgetParams
  const t = getNsFixedT(['Widget.Static.CountryDashboard', 'GeographicalNames'])

  const [selectedYear, setSelectedYear] = useState(String(year))
  // useEffect(() => {
  //   onAfterRender()
  // })

  const YEAR_OPTIONS = [
    {
      label: '2020',
      value: '2020',
    },
    {
      label: '2019',
      value: '2019',
    },
    {
      label: '2018',
      value: '2018',
    },

    {
      label: '2017',
      value: '2017',
    },
    {
      label: '2016',
      value: '2016',
    },
  ]
  if (year === 2021 || year === '2021') {
    YEAR_OPTIONS.unshift({
      label: '2021',
      value: '2021',
    })
  }

  const TABLE_ROWS = [
    {
      label: t('dataPoint.refugeesFromCountry'),
      totalDataPoint: 'totalRefugeesFromX',
      newInYearXDataPoint: 'newRefugeesFromXInYear',
    },
    {
      label: t('dataPoint.refugeesToCountry'),
      totalDataPoint: 'refugeesInXFromOtherCountriesInYear',
      newInYearXDataPoint: 'newRefugeesInXFromOtherCountriesInYear',
    },
    {
      label: t('dataPoint.idpsInCountry'),
      totalDataPoint: 'idpsInXInYear',
      newInYearXDataPoint: 'newIdpsInXInYear',
    },
    {
      label: t('dataPoint.voluntaryReturnsToCountry'),
      totalDataPoint: 'voluntaryReturnsToXInYear',
      newInYearXDataPoint: null,
    },
  ]
  if (locale === 'nb-NO') {
    TABLE_ROWS.push({
      label: t('dataPoint.asylumSeekersFromCountryToNorway'),
      totalDataPoint: 'asylumSeekersFromXToNorwayInYear',
      newInYearXDataPoint: null,
    })
  }

  const tableRows = TABLE_ROWS.map((row) => [
    row.label,
    getCountryStat(
      data,
      countryCode,
      row.newInYearXDataPoint,
      parseInt(selectedYear)
    ),
    getCountryStat(
      data,
      countryCode,
      row.totalDataPoint,
      parseInt(selectedYear)
    ),
  ]).map(([label, totalFigure, newInFigure]) => (
    <tr>
      <td>{label}</td>
      <td className={c['data-cell']}>
        {formatDataNumber(totalFigure ? totalFigure.data : null, locale, true)}
      </td>
      <td className={c['data-cell']}>
        {formatDataNumber(newInFigure ? newInFigure.data : null, locale, true)}
      </td>
    </tr>
  ))

  return (
    <>
      <div className={c['year-picker']}>
        {YEAR_OPTIONS.map(({ value, label }) => (
          <button
            className={`${c['year-button']} ${
              value === selectedYear ? c['year-button-active'] : ''
            }`}
            onClick={() => setSelectedYear(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={c['main-data-table-wrapper']}>
        <table className={c['main-data-table']}>
          <tbody>
            <tr>
              <td />
              <td className={c['data-header-cell']}>{t('header.totalIn')}</td>
              <td className={c['data-cell']}>{t('header.newIn')}</td>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    </>
  )
}
