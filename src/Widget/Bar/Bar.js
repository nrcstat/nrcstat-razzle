import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import { useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import './Bar.scss'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function BarViz() {
  if (isServer()) return null

  const [viewBox, setViewBox] = useState(null)
  const widgetParams = useContext(WidgetParamsContext)
  const { locale, widgetObject } = widgetParams

  const yAxisWidth = isMobileDevice() ? 50 : 85

  const widgetBuiltByNewWidgetBuilder =
    widgetObject.customData.columns && widgetObject.customData.data
  const widgetBuiltByDeprecatedWidgetWizard = !widgetBuiltByNewWidgetBuilder
  const data = widgetBuiltByDeprecatedWidgetWizard
    ? translateCustomData_deprecated(widgetObject.customData)
    : translateCustomData(widgetObject.customData)

  return (
    <div ref={findElementEpiServerAncestorResetHeight}>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <BarChart
            // width={500}
            // height={300}
            data={data}
            // margin={{
            //   top: 5,
            //   right: 30,
            //   left: 20,
            //   bottom: 5,
            // }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              allowDuplicatedCategory={false}
              tick
              axisLine={{ strokeWidth: 2, stroke: 'rgb(188,188,188)' }}
              tickMargin={5}
              padding={{ left: 10 }}
              tick={{
                fontFamily: 'Roboto Condensed',
                fontSize: '14px',
                fill: '#474747',
              }}
            >
              <Label
                value=""
                offset={30}
                position="insideTopRight"
                style={{
                  fontFamily: 'Roboto Condensed',
                  fontSize: '14px',
                  fill: '#919191',
                }}
              />
            </XAxis>
            <YAxis
              dataKey="value"
              type="number"
              width={yAxisWidth}
              tickFormatter={(d) => formatDataNumber(d, locale)}
              tickMargin={5}
              tickLine={{ stroke: 'rgb(188,188,188)' }}
              tick={{
                fontFamily: 'Roboto Condensed',
                fontSize: '14px',
                fill: '#474747',
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#FED769" />
          </BarChart>
          {/* <PieChart>
            <Pie
              dataKey="value"
              startAngle={0}
              innerRadius="60%"
              endAngle={-360}
              data={data}
              fill="#8884d8"
              paddingAngle={0}
            >
              {data.map((d, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={colours[i % colours.length]}
                  stroke={colours[i % colours.length]}
                />
              ))}
            </Pie>

            <Tooltip
              active
              content={<CustomTooltip />}
              wrapperStyle={{ visibility: 'visible', foo: 'bar' }}
            />
          </PieChart> */}
        </ResponsiveContainer>
      </div>
      {viewBox && (
        <div
          style={{
            width: viewBox.outerRadius * 2,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            top: -(450 / 2 - viewBox.outerRadius),
          }}
        >
          <p
            style={{
              fontFamily: 'Roboto',
              color: '#474747',
              fontSize: '22px',
              fontWeight: '400',
              margin: 0,
              padding: 0,
              marginTop: '30px',
            }}
          >
            {widgetObject.config.subtitle}
          </p>
          <p
            style={{
              fontFamily: 'Roboto',
              color: '#474747',
              fontSize: '16px',
              fontWeight: '300',
              margin: 0,
              padding: 0,
              marginTop: '10px',
            }}
          >
            {widgetObject.config.source}
          </p>
        </div>
      )}
    </div>
  )
}

export default BarViz

// TODO: this translator matches the "pre-2022" way of storing
// the custom data in the widget object, as created by the
// widget wizard. Eventually we'll want to move to the new way.
function translateCustomData_deprecated(customData) {
  return customData
    .map((item) => ({ name: item.hoverLabel, value: item.value }))
    .filter((item) => Boolean(item.value))
}
function translateCustomData(customData) {
  const nameProperty = customData.columns[0].data
  const valueProperty = customData.columns[1].data
  return customData.data
    .map((item) => ({ name: item[nameProperty], value: item[valueProperty] }))
    .filter((item) => Boolean(item.value))
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
      display: 'block',
    }
    if (bounds) {
      const { width, height } = bounds
      style.visibility = 'visible'
      style.left = `${clientX - width / 2}px`
      style.top = `${clientY - height}px`
    }
    return (
      <div
        className="nrcstat-d3-tip"
        style={style}
        ref={(element) => {
          containerElementRef.current = element
        }}
      >
        <span className="year">{name}</span>
        <hr className="ruler" />
        <span className="number">{formatDataNumber(value)}</span>
      </div>
    )
  }

  return null
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
