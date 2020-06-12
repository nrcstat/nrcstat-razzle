import React, { useContext, useLayoutEffect, useState, useRef } from 'react'
import {
  ResponsiveContainer, LineChart, XAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Sector, Cell
} from 'recharts'
import { isServer } from '../../util/utils'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { useMouse } from '@umijs/hooks'

import { formatDataNumber } from '../../util/widgetHelpers.js'

import './Donut.scss'

const colours = ['#70a873', '#70b8c7', '#ffb271', '#70d1e5', '#ea9282', '#fee08a', '#a9a9a9', '#e6e6e6', '#f5f5f5', '#707070']

function Donut () {
  const widgetParams = useContext(WidgetParamsContext)
  const { widgetObject } = widgetParams
  console.log(widgetParams)

  const data = translateCustomData(widgetObject.customData)
  console.log(data)
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          dataKey='value'
          startAngle={0}
          innerRadius='60%'
          endAngle={-360}
          data={data}
          fill='#8884d8'
          /* label */
          paddingAngle={0}
        >
          {data.map((d, i) => <Cell key={`cell-${i}`} fill={colours[i % colours.length]} stroke={colours[i % colours.length]} />)}
        </Pie>
        <Tooltip
          active
          content={<CustomTooltip />}
          wrapperStyle={{ visibility: 'visible', foo: 'bar' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default Donut

function translateCustomData (customData) {
  return customData
    .map(item => ({ name: item['0'], value: item['1'] }))
    .filter(item => Boolean(item.value))
}

const CustomTooltip = ({ active, payload }) => {
  const containerElementRef = useRef(null)
  const { formatDataNumber } = useContext(FixedLocaleContext)
  const { clientX, clientY, screenX, screenY, pageX, pageY } = useMouse()
  if (active) {
    const { name, value } = payload[0]
    const bounds = containerElementRef.current?.getBoundingClientRect()
    const style = {
      position: 'fixed',
      display: 'block'
    }
    if (bounds) {
      const { width, height } = bounds
      style.visibility = 'visible'
      style.left = `${clientX - width / 2}px`
      style.top = `${clientY - height}px`
    }
    return (
      <div className='nrcstat-d3-tip' style={style} ref={element => { containerElementRef.current = element }}>
        <span className='year'>{name}</span>
        <hr className='ruler' />
        <span className='number'>{formatDataNumber(value)}</span>
      </div>
    )
  }

  return null
}
