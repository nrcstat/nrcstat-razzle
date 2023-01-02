import React from 'react'
import c from './Widget.module.scss'
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
const Bar = loadable(() => import(/* webpackChunkName: "Bar" */ './Bar/Bar'))
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
const StaticCountrySidebar = loadable(() =>
  import(
    /* webpackChunkName: "StaticCountrySidebar" */ './StaticCountrySidebar/StaticCountrySidebar'
  )
)
const Timeline = loadable(() =>
  import(/* webpackChunkName: "Timeline" */ './Timeline/Timeline')
)
const Table = loadable(() =>
  import(/* webpackChunkName: "Table" */ './Table/Table')
)
const BlankError = loadable(() =>
  import(/* webpackChunkName: "BlankError" */ './BlankError/BlankError')
)

const widgetMap = {
  GlobalMap: GlobalMap,
  Line: Line,
  Donut: Donut,
  Bar: Bar,
  Column: Bar,
  StaticTable: StaticTable,
  CountryDashboard: CountryDashboard,
  CustomTable: CustomTable,
  Pictogram: Pictogram,
  StaticCountrySidebar: StaticCountrySidebar,
  Timeline: Timeline,
  Table: Table,
  BlankError: BlankError,
}

export const WidgetParamsContext = React.createContext()

function Widget(props) {
  const { type, locale } = props
  const SpecificWidget = widgetMap[type]
  const FixedLocaleContext = buildFixedLocaleContext(locale || 'nb-NO')
  return (
    <FixedLocaleContext>
      <WidgetParamsContext.Provider value={{ ...props }}>
        <div className={c['nrcstat__rootwidget']}>
          <SpecificWidget />
        </div>
      </WidgetParamsContext.Provider>
    </FixedLocaleContext>
  )
}

export default Widget
