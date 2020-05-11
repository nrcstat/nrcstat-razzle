import React from 'react'
import ReactDOM from 'react-dom'
import classes from './index.css'
import { isServer } from '../util/utils'
import loadable from '@loadable/component'

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

const widgetMap = {
  'GlobalMap': GlobalMap,
  'Line': Line,
  'Donut': Donut,
  'Pie': Pie,
}

function Widget({ widgetId, type, definition, data, localeDictionary }) {
  console.log("Widget is run")
  console.log(type)
  const SpecificWidget = widgetMap[type]
  return (
    <div className={classes.red}>
      I am widget
      <SpecificWidget type={type} />
    </div>
  )
}

export default Widget

const fetchData = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 500)
})
