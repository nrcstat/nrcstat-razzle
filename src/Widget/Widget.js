import React from 'react'
import ReactDOM from 'react-dom'
import './Widget.scss'
import { isServer } from '../util/utils'
import loadable from '@loadable/component'
import { buildFixedLocaleContext } from '../services/i18n'

/*
import GlobalMap from './GlobalMap/GlobalMap'
import Line from './Line/Line'
import Donut from './Donut/Donut'
import Pie from './Pie/Pie'
*/
const GlobalMap = loadable(() => import(/* webpackChunkName: "GlobalMap" */ './GlobalMap/GlobalMap'))
const Line = loadable(() => import(/* webpackChunkName: "Line" */ './Line/Line'))
const Donut = loadable(() => import(/* webpackChunkName: "Donut" */ './Donut/Donut'))
const Pie = loadable(() => import(/* webpackChunkName: "Pie" */ './Pie/Pie'))
const StaticTable = loadable(() => import(/* webpackChunkName: "Pie" */ './StaticTable/StaticTable'))
const CountryDashboard = loadable(() => import(/* webpackChunkName: "Pie" */ './CountryDashboard/CountryDashboard'))

const widgetMap = {
  GlobalMap: GlobalMap,
  Line: Line,
  Donut: Donut,
  Pie: Pie,
  StaticTable: StaticTable,
  CountryDashboard: CountryDashboard
}

export const WidgetParamsContext = React.createContext()

function Widget (props) {
  const { type, locale } = props
  const SpecificWidget = widgetMap[type]
  const FixedLocaleContext = buildFixedLocaleContext(locale)
  return (
    <FixedLocaleContext>
      <WidgetParamsContext.Provider value={props}>
        <div className='nrcstat__rootwidget'>
          <SpecificWidget />
        </div>
      </WidgetParamsContext.Provider>
    </FixedLocaleContext>
  )
}

export default Widget
