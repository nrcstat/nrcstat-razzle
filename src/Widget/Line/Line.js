import React, { useContext, useEffect } from 'react'
import { LineChart, Line, XAxis, Label, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { isServer, isClient } from '../../util/utils'
import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'

import * as $ from 'jquery'

import './Line.scss'
import { WidgetParamsContext } from '../Widget'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function LineWidget () {
  if (isServer()) return null

  const { locale, widgetObject: { customData, config: { title = '', subtitle = '', linkbox = '' } } } = useContext(WidgetParamsContext)

  const fixEpiServerAncestorBlockHeight = (element) => {
    $(element).parents('.nrcstat-block').css('height', 'auto')
  }

  const yAxisWidth = isMobileDevice() ? 50 : 85

  return (
    <div ref={fixEpiServerAncestorBlockHeight}>
      <div style={{ marginLeft: '10px' }}>
        {title && <p style={{ fontFamily: 'Roboto Condensed', color: '#474747', fontSize: '24px', fontWeight: '400', margin: 0, padding: 0, marginBottom: '12px' }}>{title}</p>}
        {subtitle && <p style={{ fontFamily: 'Roboto Condensed', color: '#919191', fontSize: '18px', fontWeight: '400', margin: 0, padding: 0, marginBottom: '30px' }}>{subtitle}</p>}
      </div>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <LineChart>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='date' allowDuplicatedCategory={false} tick axisLine={{ strokeWidth: 2, stroke: 'rgb(188,188,188)' }} tickMargin={5} padding={{ left: 10 }} tick={{ fontFamily: 'Roboto Condensed', fontSize: '14px', fill: '#474747' }}>
              <Label value={linkbox} offset={30} position='insideTopRight' style={{ fontFamily: 'Roboto Condensed', fontSize: '14px', fill: '#919191' }} />
            </XAxis>
            <YAxis dataKey='value' type='number' width={yAxisWidth} tickFormatter={d => formatDataNumber(d, locale)} tickMargin={5} tickLine={{ stroke: 'rgb(188,188,188)' }} tick={{ fontFamily: 'Roboto Condensed', fontSize: '14px', fill: '#474747' }} />
            <Tooltip
              formatter={(d, hoverLabel) => [formatDataNumber(d, locale), hoverLabel]}
              contentStyle={{ padding: '10px', border: '1px solid #474747', borderRadius: '3px' }} // text box
              labelStyle={{ fontFamily: 'Roboto Condensed', fontSize: '22px', color: '#474747', marginBottom: '10px', fontWeight: 'bold' }} //  year
              itemStyle={{ paddingBottom: '5px', fontFamily: 'Roboto Condensed', fontSize: '16px' }}
            />
            <Legend
              align='center'
              layout='vertical'
              iconType='circle'
              wrapperStyle={{
                bottom: -30,
                left: 20,
                fontFamily: 'Roboto Condensed',
                fontSize: '14px',
                marginLeft: '60px'
              }}
              label={{ fontFamily: 'Roboto Condensed' }}
            />
            {customData.map((s, i) => (
              <Line dataKey='value' data={cleanSeries(s.seriesData)} name={s.seriesLegend} key={s.seriesLegend} stroke={colours[i % colours.length]} strokeWidth={3} dot={{ strokeWidth: 5 }} activeDot={{ r: 10 }} />
            ))}

            {/* <Line type="linear" dataKey="pv" stroke="#FF7900" strokeWidth={4} dot={{ strokeWidth: 0, fill: '#FF7900', r: 6 }} activeDot={{r: 8}} legendType="circle" /> */}
            {/* <Line type="linear" dataKey="Antall flyktninger fra" stroke="#72C7E7" strokeWidth={4} dot={{ strokeWidth: 0, fill: '#72C7E7', r: 6 }} activeDot={{r: 8}} legendType="circle" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LineWidget

const renderCustomizedLabel = ({ cx, cy, index, value }) => {
  return (
    <text x={cx} y={cy} dominantBaseline='central'>
      {value}
    </text>
  )
}

function cleanSeries (seriesData) {
  return seriesData.filter(d => Boolean(d.date))
}
