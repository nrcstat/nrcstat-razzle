import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import { useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
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

  console.log(data)

  return (
    <div ref={findElementEpiServerAncestorResetHeight}>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <BarChart
            // width={500}
            // height={300}
            data={data}
            // maxBarSize={40}
            barCategoryGap={10}
            // margin={{
            //   top: 5,
            //   right: 30,
            //   left: 20,
            //   bottom: 5,
            // }}
          >
            <CartesianGrid
              strokeDasharray="1"
              vertical={false}
              strokeWidth={2}
            />
            <YAxis
              dataKey="value"
              type="number"
              width={yAxisWidth}
              tickFormatter={(d) => formatDataNumber(d, locale)}
              allowDecimals={false}
              tickMargin={5}
              tickLine={{ stroke: 'rgb(188,188,188)' }}
              tick={{
                fontFamily: 'Roboto Condensed',
                fontSize: '14px',
                fill: '#474747',
              }}
            />
            <Tooltip
              formatter={(d, _, info) => {
                return [formatDataNumber(d, locale)]
              }}
              labelFormatter={(a, b, c, d) => {
                return b[0]?.payload?.name
              }}
              contentStyle={{
                padding: '10px',
                border: '1px solid #474747',
                borderRadius: '3px',
              }} // text box
              labelStyle={{
                fontFamily: 'Roboto Condensed',
                fontSize: '22px',
                color: '#474747',
                marginBottom: '10px',
                fontWeight: 'bold',
              }} //  year
              itemStyle={{
                paddingBottom: '5px',
                fontFamily: 'Roboto Condensed',
                fontSize: '16px',
              }}
              cursor={{ fill: 'none' }}
            />
            <Bar dataKey="value" fill="#FED769">
              <LabelList
                dataKey="name"
                position="insideBottom"
                angle={270}
                offset={20}
                style={{
                  fontFamily: 'Roboto Condensed',
                  fontSize: '22px',
                  color: '#474747',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                }}
                dominantBaseline="middle"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
  const label = customData.columns[0].columnLabel
  const nameProperty = customData.columns[0].data
  const valueProperty = customData.columns[1].data
  return customData.data
    .map((item) => ({
      label,
      name: item[nameProperty],
      value: item[valueProperty],
    }))
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
