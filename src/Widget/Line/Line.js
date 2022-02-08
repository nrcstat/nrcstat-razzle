import React, { useContext, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  Label,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
} from 'recharts'
import { isServer } from '../../util/utils'
import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'

import * as $ from 'jquery'

import './Line.scss'
import { WidgetParamsContext } from '../Widget'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function LineWidget() {
  if (isServer()) return null

  const {
    locale,
    widgetObject: {
      customData,
      title = '',
      config: { subtitle = '', linkbox = '', source = '' },
    },
  } = useContext(WidgetParamsContext)

  const fixEpiServerAncestorBlockHeight = (element) => {
    $(element).parents('.nrcstat-block').css('height', 'auto')
  }

  // This nubmer has been determined by multiple eyeball tests. When the y axis
  // shows low numbers (e.g. 50, 100, 200) there's a lot of whitespace available.
  // This margin is necessary to show numbers in the millions, e.g. 50 000 000.
  const yAxisWidth = isMobileDevice() ? 50 : 85

  const widgetBuiltByNewWidgetBuilder = customData.columns && customData.data
  const widgetBuiltByDeprecatedWidgetWizard = !widgetBuiltByNewWidgetBuilder
  const data = widgetBuiltByDeprecatedWidgetWizard
    ? translateCustomData_deprecated(customData)
    : translateCustomData(customData)

  return (
    <div ref={fixEpiServerAncestorBlockHeight}>
      <div style={{ marginLeft: '10px' }}>
        {title && (
          <p
            style={{
              fontFamily: 'Roboto Condensed',
              color: '#474747',
              fontSize: '24px',
              fontWeight: '400',
              margin: 0,
              padding: 0,
              marginBottom: '12px',
            }}
          >
            {title}
          </p>
        )}
        {subtitle && (
          <p
            style={{
              fontFamily: 'Roboto Condensed',
              color: '#919191',
              fontSize: '18px',
              fontWeight: '400',
              margin: 0,
              padding: 0,
              marginBottom: '30px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <LineChart
            margin={{ top: 5, right: source ? 18 : 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid vertical={false} />
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
                value={linkbox}
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
            <Tooltip
              formatter={(d, hoverLabel) => [
                formatDataNumber(d, locale),
                hoverLabel,
              ]}
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
            />
            <Legend
              align="center"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{
                bottom: -30,
                left: 20,
                fontFamily: 'Roboto Condensed',
                fontSize: '14px',
                marginLeft: '60px',
              }}
              label={{ fontFamily: 'Roboto Condensed' }}
            />
            {data.map((s, i) => (
              <Line
                dataKey="value"
                data={s.seriesData}
                name={s.seriesLegend}
                key={s.seriesLegend}
                stroke={colours[i % colours.length]}
                strokeWidth={3}
                dot={{ strokeWidth: 5 }}
                activeDot={{ r: 10 }}
              />
            ))}
            <Customized component={<SourceLabel source={source} />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LineWidget

function SourceLabel({ width, height, source }) {
  return (
    <g transform={`translate(${width - 10}, ${height - 100})`}>
      <text
        fontFamily="Roboto Condensed"
        fontSize="14px"
        fill="#919191"
        transform="rotate(90)"
        textAnchor="end"
      >
        {source}
      </text>
    </g>
  )
}

// TODO: this translator matches the "pre-2022" way of storing
// the custom data in the widget object, as created by the
// widget wizard. Eventually we'll want to move to the new way.
function translateCustomData_deprecated(customData) {
  return customData.map((series) => {
    series.seriesData = series.seriesData.filter((d) => Boolean(d.date))
    return series
  })
}
function translateCustomData(customData) {
  const dateKey = customData.columns[0].data
  return customData.columns.slice(1).map((column) => {
    return {
      seriesLegend: column.columnLabel,
      seriesData: customData.data
        .map((d) => ({
          date: d[dateKey],
          value: d[column.data],
        }))
        .filter((d) => Boolean(d.value)),
    }
  })
}
