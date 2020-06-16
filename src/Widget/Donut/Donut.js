import { useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Text as SvgText, Customized } from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { WidgetParamsContext } from '../Widget'
import './Donut.scss'

import * as $ from 'jquery'
import { isClient } from '../../util/utils'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function Donut () {
  const [viewBox, setViewBox] = useState(null)
  const widgetParams = useContext(WidgetParamsContext)
  const { widgetObject } = widgetParams

  const data = translateCustomData(widgetObject.customData)

  return (
    <div>
      <div style={{ width: '100%', height: '450px' }}>
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
              <Label position='center' content={<DonutTitle setViewBox={setViewBox} />} value={widgetObject.config.title} />
            </Pie>

            <Tooltip
              active
              content={<CustomTooltip />}
              wrapperStyle={{ visibility: 'visible', foo: 'bar' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {viewBox &&
        <div style={{ width: viewBox.outerRadius * 2, margin: '0 auto', textAlign: 'center', position: 'relative', top: (-(450 / 2 - viewBox.outerRadius)) }}>
          <p style={{ fontFamily: 'Roboto', color: '#474747', fontSize: '22px', fontWeight: '400', margin: 0, padding: 0, marginTop: '30px' }}>{widgetObject.config.subtitle}</p>
          <p style={{ fontFamily: 'Roboto', color: '#474747', fontSize: '16px', fontWeight: '300', margin: 0, padding: 0, marginTop: '10px' }}>{widgetObject.config.source}</p>
        </div>}
    </div>
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
    this.props.setViewBox(this.props.viewBox)
    // Calculate scale transformation
    const textElement = this.textRef.current
    var bb = textElement.getBBox()
    const enclosingCircleRadius = this.props.viewBox.innerRadius
    const boundingBoxWidthHeight = enclosingCircleRadius * 2 * Math.SQRT1_2
    var widthTransform = boundingBoxWidthHeight / bb.width
    var heightTransform = boundingBoxWidthHeight / bb.height
    var scale = widthTransform < heightTransform ? widthTransform : heightTransform

    // Calculate (x,y) translate
    const { cx, cy } = this.props.viewBox
    const x = cx
    // TODO: this calculation is strange and a result of trial & error - fix it?
    const y = cy + (bb.height * scale) / 4

    this.setState({ scale, x, y })
  }

  render () {
    return (
      <g transform={`translate(${this.state.x}, ${this.state.y})`}>
        <text fontFamily='Roboto' fill='#474747' fontWeight='bold' textAnchor='middle' transform={`scale(${this.state.scale})`} ref={this.textRef}>{this.props.value}</text>
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
