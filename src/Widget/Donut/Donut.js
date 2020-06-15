import React, { useContext, useLayoutEffect, useState, useRef } from 'react'
import {
  ResponsiveContainer, LineChart, XAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Sector, Cell, Text, Label
} from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import { useMouse } from '@umijs/hooks'

import { formatDataNumber } from '../../util/widgetHelpers.js'

import './Donut.scss'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function Donut () {
  const widgetParams = useContext(WidgetParamsContext)
  const { widgetObject } = widgetParams

  const data = translateCustomData(widgetObject.customData)

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
          <Label position='center' fontFamily='Roboto' fontWeight='bold' content={func} value={widgetObject.config.title} />
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

const func = (props) => {
  const { cx, cy } = props.viewBox

  var width = 500; var height = 500

  var textNode = document.getElementById('t1')
  // var bb = textNode.getBBox()
  const bb = { width: 500, height: 500 }
  var widthTransform = width / bb.width
  var heightTransform = height / bb.height
  var value = widthTransform < heightTransform ? widthTransform : heightTransform
  value = 1

  return (
    <svg viewBox='0 0 300 300' preserveAspectRatio='xMidYMid meet'>
      <text x={150} y={150} size={50} textAnchor='middle' transform={`matrix(${value}, 0, 0, ${value}, 0, 0)`}>{props.value}</text>
    </svg>

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
