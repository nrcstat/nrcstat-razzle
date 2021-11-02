import React from 'react'
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
const GlobalMap = loadable(() =>
  import(/* webpackChunkName: "GlobalMap" */ './GlobalMap/GlobalMap')
)
const Line = loadable(() =>
  import(/* webpackChunkName: "Line" */ './Line/Line')
)
const Donut = loadable(() =>
  import(/* webpackChunkName: "Donut" */ './Donut/Donut')
)
const StaticTable = loadable(() =>
  import(/* webpackChunkName: "StaticTable" */ './StaticTable/StaticTable')
)
const CountryDashboard = loadable(() =>
  import(
    /* webpackChunkName: "CountryDashboard" */ './CountryDashboard/CountryDashboard'
  )
)
const CustomTable = loadable(() =>
  import(/* webpackChunkName: "CustomTable" */ './CustomTable/CustomTable')
)
const Pictogram = loadable(() =>
  import(/* webpackChunkName: "Pictogram" */ './Pictogram/Pictogram')
)
const Timeline = loadable(() =>
  import(/* webpackChunkName: "Timeline" */ './Timeline/Timeline')
)

const widgetMap = {
  GlobalMap: GlobalMap,
  Line: Line,
  Donut: Donut,
  StaticTable: StaticTable,
  CountryDashboard: CountryDashboard,
  CustomTable: CustomTable,
  Pictogram: Pictogram,
  Timeline: Timeline,
}

export const WidgetParamsContext = React.createContext()

function Widget(props) {
  const { type, locale } = props
  const SpecificWidget = widgetMap[type]
  const FixedLocaleContext = buildFixedLocaleContext(locale || 'nb-NO')
  return (
    <FixedLocaleContext>
      <WidgetParamsContext.Provider value={{ ...props }}>
        <div className="nrcstat__rootwidget">
          <SpecificWidget />
        </div>
      </WidgetParamsContext.Provider>
    </FixedLocaleContext>
  )
}

export default Widget
