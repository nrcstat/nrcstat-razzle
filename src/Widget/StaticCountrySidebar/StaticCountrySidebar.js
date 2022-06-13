import React from 'react'
import { useContext } from 'react'
import { FixedLocaleContext } from '../../services/i18n'
import { thousandsFormatter } from '../../util/tableWidgetFormatters'
import { isServer } from '../../util/utils'
import { CampIcon } from '../Pictogram/icons/Camp'
import { EducationIcon } from '../Pictogram/icons/Education'
import { FoodIcon } from '../Pictogram/icons/Food'
import { LegalIcon } from '../Pictogram/icons/Legal'
import { ShelterIcon } from '../Pictogram/icons/Shelter'
import { WASHIcon } from '../Pictogram/icons/WASH'
import { WidgetParamsContext } from '../Widget'
import c from './StaticCountrySidebar.module.scss'

function StaticCountrySidebar() {
  if (isServer()) return null

  const { dataPoints } = useContext(WidgetParamsContext)

  switch (true) {
    case dataPoints.every((dp) => globalDisplacementDataPoints.includes(dp)):
      return <GlobalDisplacementVariant />

    case dataPoints.every((dp) => gorsDataPoints.includes(dp)):
      return <GorsVariant />

    default:
      throw new Error(
        'Datapoints passed to <StaticCountrySidebar /> contain a mix of global displacement data points and GORS data points. It has to be either.'
      )
  }
}

function GlobalDisplacementVariant() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, locale, dataPoints, year, preloadedWidgetData } =
    widgetParams

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

  let renderCaptionBelowGrid = true

  if (cells.length % 2 !== 0) {
    renderCaptionBelowGrid = false
    cells.push(
      <div key="caption-cell" className={c['grid-cell']}>
        <div className={c['grid-cell-content']}>
          <Caption align="right" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${c.container} ${c['global-displacement-variant']}`}>
      <dl className={c['facts-grid']}>{cells}</dl>
      {renderCaptionBelowGrid ? (
        <Caption align="center" style={{ marginTop: '0.8em' }} />
      ) : null}
    </div>
  )
}

function GorsVariant() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode, locale, dataPoints, year, preloadedWidgetData } =
    widgetParams

  const dataMap = makeDataPointToDataMap(dataPoints, preloadedWidgetData)

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT([
    'Widget.Static.CountrySidebar',
    'GeographicalNames',
    'Widget.Static.GlobalRadialBarChartDisplacementMap.ADMIN-SETTINGS-ONLY-ADMINS-TOUCH-THIS',
  ])

  const readMoreUrl = t(
    `CountryStatisticsPopup.CountryReadMoreLink.${countryCode}`
  )

  return (
    <div className={`${c.container} ${c['gors-variant']}`}>
      <caption>
        {t('gorsVariant.title', {
          countryName: t(
            `NRC.Web.StaticTextDictionary.Contries.${countryCode}`
          ),
        })}
      </caption>

      {dataPoints.map((dataPoint) => {
        const Icon = gorsDataPointToIconMap[dataPoint]
        return (
          <div key={dataPoint} className={c['gors-grid']}>
            <figure className={c['gors-cell-icon']}>
              <Icon fillColor="#FF7602" />
            </figure>
            <dt className={`${c['gors-cell-label']} ${c['datapoint-label']}`}>
              {t(`dataPointLabel.${dataPoint}`)}
            </dt>
            <dd className={`${c['gors-cell-figure']} ${c['datapoint-figure']}`}>
              {thousandsFormatter(locale)(dataMap[dataPoint])}
            </dd>
          </div>
        )
      })}

      <div
        key="read-more"
        className={c['grid-cell']}
        style={{ marginTop: '1em' }}
      >
        <div className={c['grid-cell-content']}>
          <a href={readMoreUrl} className={c['read-more-link']}>
            {t('readMoreLink').replace(
              '{countryName}',
              t(`NRC.Web.StaticTextDictionary.Contries.${countryCode}`)
            )}
          </a>
        </div>
      </div>
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

function Caption({ align, style = {} }) {
  const { year } = useContext(WidgetParamsContext)
  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Widget.Static.CountrySidebar'])

  return (
    <caption style={{ textAlign: align, ...style }}>
      {t('figuresCaption', { YEAR: String(year) })}
    </caption>
  )
}

export default StaticCountrySidebar

// TODO: neither of these list of data points is coded anywhere in this repo. I should
// 1) do so. And 2) Eventually move razzle into the nrcstat-monorepo where both lists
// _are_ indeed coded in a config file.

const globalDisplacementDataPoints = [
  'totalRefugeesFromX',
  'refugeesInXFromOtherCountriesInYear',
  'idpsInXInYear',
  'newRefugeesFromXInYear',
  'newRefugeesInXFromOtherCountriesInYear',
  'newIdpsInXInYear',
  'percentageWomenFleeingToCountry',
  'percentageChildrenFleeingToCountry',
  'voluntaryReturnsToXInYear',
  'asylumSeekersFromXToNorwayInYear',
  'population',
]

const gorsDataPoints = [
  'gors_camp',
  'gors_education',
  'gors_icla',
  'gors_lfs',
  'gors_shelter',
  'gors_wash',
]

const gorsDataPointToIconMap = {
  gors_camp: CampIcon,
  gors_education: EducationIcon,
  gors_icla: LegalIcon,
  gors_lfs: FoodIcon,
  gors_shelter: ShelterIcon,
  gors_wash: WASHIcon,
}
