import React, { useContext, useEffect } from 'react'
import { LineChart, Line, XAxis, Label, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { isServer, isClient } from '../../util/utils'
import { formatDataNumber } from '@/util/widgetHelpers.js'

import * as $ from 'jquery'

import './Line.scss'
import { WidgetParamsContext } from '../Widget'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function LineWidget () {
  if (isServer()) return null

  const { locale, widgetObject: { customData, config: { title, subtitle, linkbox } } } = useContext(WidgetParamsContext)

  const fixEpiServerAncestorBlockHeight = (element) => {
    $(element).parents('.nrcstat-block').css('height', 'auto')
  }

  return (
    <div ref={fixEpiServerAncestorBlockHeight}>
      <div style={{ marginLeft: '10px' }}>
        <p style={{ fontFamily: 'Roboto Condensed', color: '#333333', fontSize: '24px', fontWeight: '400', margin: 0, padding: 0, marginBottom: '12px' }}>{title}</p>
        <p style={{ fontFamily: 'Roboto Condensed', color: '#333333', fontSize: '18px', fontWeight: '400', margin: 0, padding: 0, marginBottom: '20px' }}>{subtitle}</p>
      </div>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <LineChart width={600} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='0' allowDuplicatedCategory={false} tick={false} axisLine={{ strokeWidth: 2, stroke: 'rgb(188,188,188)' }}>
              <Label value={linkbox} offset={-10} position='insideBottomLeft' />
            </XAxis>
            <YAxis dataKey='2' width={80} tickFormatter={d => formatDataNumber(d, locale)} tickLine={{ stroke: 'rgb(188,188,188)' }} tick={{ fontFamily: 'Roboto Condensed', fontSize: '14px', fill: 'black' }} />
            <Tooltip
              formatter={d => formatDataNumber(d, locale)}
            />
            <Legend
              align='center'
              layout='vertical'
              iconType='circle'
              wrapperStyle={{
                bottom: -30,
                left: 20,
                fontFamily: 'Roboto Condensed'
              }}
              label={{ fontFamily: 'Roboto Condensed' }}
            />
            {customData.map((s, i) => (
              <Line dataKey='2' data={s.seriesData} name={s.seriesLegend} key={s.seriesLegend} stroke={colours[i % colours.length]} strokeWidth={3} dot={{ strokeWidth: 5 }} activeDot={{ r: 10 }} />
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
