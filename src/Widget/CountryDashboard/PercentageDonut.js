import { useEventListener, useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import { getCountryStat } from './get-country-stat'
import { formatDataPercentage } from '@/util/widgetHelpers.js'

const colours = ['#D3D3D3', '#F3F3F3']

export function PercentageDonut({ dataPoint }) {
  const [show, setShow] = useState(true)
  useEventListener('resize', () => {
    setShow(false)
    setInterval(() => setShow(true))
  })
  if (show) return <Donut dataPoint={dataPoint} />
  else return null
}

// Datapoint has to be 'percentageWomenFleeingToCountry',
// or 'percentageChildrenFleeingToCountry'
function Donut({ dataPoint }) {
  if (isServer()) return null

  const [viewBox, setViewBox] = useState(null)
  const widgetParams = useContext(WidgetParamsContext)
  const { year, countryCode, preloadedWidgetData, locale } = widgetParams

  const data = 0
  const remainder = 1 - data

  const donutData = [
    { name: '', value: data },
    { name: '', value: remainder },
  ]

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  return (
    <div ref={findElementEpiServerAncestorResetHeight}>
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={90}
              innerRadius="60%"
              endAngle={-360}
              data={donutData}
              fill="#8884d8"
              paddingAngle={0}
            >
              {donutData.map((d, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={colours[i % colours.length]}
                  stroke={colours[i % colours.length]}
                />
              ))}
              <Label
                position="center"
                content={<DonutTitle setViewBox={setViewBox} />}
                value={formatDataPercentage(data, locale)}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {viewBox && (
        <div
          style={{
            width: viewBox.outerRadius * 2,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            top: -(250 / 2 - viewBox.outerRadius),
          }}
        >
          <p
            style={{
              fontFamily: 'Roboto',
              color: '#474747',
              fontSize: '16px',
              fontWeight: '400',
              margin: 0,
              padding: 0,
              marginTop: '30px',
            }}
          >
            {t(`dataPoint.${dataPoint}`)}
          </p>
        </div>
      )}
    </div>
  )
}

class DonutTitle extends React.Component {
  textRef = React.createRef()

  state = {
    scale: 0,
    x: 0,
    y: 0,
  }

  componentDidMount() {
    this.props.setViewBox(this.props.viewBox)
    // Calculate scale transformation
    const textElement = this.textRef.current
    var bb = textElement.getBBox()
    const enclosingCircleRadius = this.props.viewBox.innerRadius
    const boundingBoxWidthHeight = enclosingCircleRadius * 2 * Math.SQRT1_2
    var widthTransform = boundingBoxWidthHeight / bb.width
    var heightTransform = boundingBoxWidthHeight / bb.height
    var scale =
      widthTransform < heightTransform ? widthTransform : heightTransform

    // Calculate (x,y) translate
    const { cx, cy } = this.props.viewBox
    const x = cx
    // TODO: this calculation is strange and a result of trial & error - fix it?
    const y = cy + (bb.height * scale) / 4

    this.setState({ scale, x, y })
  }

  render() {
    return (
      <g transform={`translate(${this.state.x}, ${this.state.y})`}>
        <text
          fontFamily="Roboto"
          fill="#474747"
          fontWeight="bold"
          textAnchor="middle"
          transform={`scale(${this.state.scale})`}
          ref={this.textRef}
        >
          {this.props.value}
        </text>
      </g>
    )
  }
}

function findElementEpiServerAncestorResetHeight(element) {
  let isParentNotNrcstatBlock
  do {
    element = element?.parentNode
    isParentNotNrcstatBlock = !element?.classList?.contains('nrcstat-block')
  } while (element && isParentNotNrcstatBlock)

  // The element is non-null and has a class of nrcstat-block
  if (element) {
    element.style.setProperty('height', 'auto')
  }
}
