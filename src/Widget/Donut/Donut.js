import { useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import './Donut.scss'

import * as $ from 'jquery'
import { isClient } from '../../util/utils'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function Donut () {
  return (
    <>
      <DonutChart />
      <p>yo ho</p>
    </>
  )
}

function DonutChart () {
  const widgetParams = useContext(WidgetParamsContext)
  const { widgetObject } = widgetParams

  const data = translateCustomData(widgetObject.customData)

  console.log('hell')

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
          paddingAngle={0}
        >
          {data.map((d, i) => <Cell key={`cell-${i}`} fill={colours[i % colours.length]} stroke={colours[i % colours.length]} />)}
          <Label position='center' content={<DonutTitle />} value={widgetObject.config.title} />
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

class DonutTitle extends React.Component {
  textRef = React.createRef()

  state = {
    scale: 0,
    x: 0,
    y: 0
  }

  componentDidMount () {
    // Calculate scale transformation
    const textElement = this.textRef.current
    var bb = textElement.getBBox()
    const enclosingCircleRadius = this.props.viewBox.innerRadius
    const boundingBoxWidthHeight = enclosingCircleRadius * 2 * Math.SQRT1_2
    var widthTransform = boundingBoxWidthHeight / bb.width
    var heightTransform = boundingBoxWidthHeight / bb.height
    var scale = widthTransform < heightTransform ? widthTransform : heightTransform

    console.log(bb)

    // Calculate (x,y) translate
    const { cx, cy } = this.props.viewBox
    const x = cx
    // TODO: this calculation is strange and a result of trial & error - fix it?
    const y = cy + (bb.height * scale) / 12

    this.setState({ scale, x, y })
  }

  render () {
    console.log('hehe')
    return (
      <g transform={`translate(${this.state.x}, ${this.state.y})`}>
        <text fontFamily='Roboto' fill='#474747' fontWeight='bold' textAnchor='middle' alignmentBaseline='middle' transform={`scale(${this.state.scale})`} ref={this.textRef}>{this.props.value}</text>
      </g>
    )
  }
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
