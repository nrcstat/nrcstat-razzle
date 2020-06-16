import React, { useContext } from 'react'
import { LineChart, Line, XAxis, Label, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { isServer, isClient } from '../../util/utils'
import { formatDataNumber } from '@/util/widgetHelpers.js'

import './Line.scss'
import { WidgetParamsContext } from '../Widget'

const d = [{ seriesData: [{ 0: '2008', 1: 2008, 2: 42000000 }, { 0: '2009', 1: 2009, 2: 41200000 }, { 0: '2010', 1: 2010, 2: 43200000 }, { 0: '2011', 1: 2011, 2: 43700000 }, { 0: '2012', 1: 2012, 2: 42500000 }, { 0: '2013', 1: 2013, 2: 45200000 }, { 0: '2014', 1: 2014, 2: 51200000 }, { 0: '2015', 1: 2015, 2: 59500000 }, { 0: '2016', 1: 2016, 2: 65300000 }, { 0: '2017', 1: 2017, 2: 65600000 }, { 0: '2018', 1: 2018, 2: 68500000 }, { 0: '2019', 1: 2019, 2: 70754326 }, {}], seriesLegend: 'Totalt antall mennesker på flukt ved inngangen til året' }, { seriesData: [{ 0: '2008', 1: 2008, 2: 16000000 }, { 0: '2009', 1: 2009, 2: 15200000 }, { 0: '2010', 1: 2010, 2: 16100000 }, { 0: '2011', 1: 2011, 2: 16200000 }, { 0: '2012', 1: 2012, 2: 16100000 }, { 0: '2013', 1: 2013, 2: 16400000 }, { 0: '2014', 1: 2014, 2: 17900000 }, { 0: '2015', 1: 2015, 2: 21300000 }, { 0: '2016', 1: 2016, 2: 24500000 }, { 0: '2017', 1: 2017, 2: 25400000 }, { 0: '2018', 1: 2018, 2: 28500000 }, { 0: '2019', 1: 2019, 2: 29409386 }, { 0: null, 1: null, 2: null }], seriesLegend: 'Flyktninger' }, { seriesData: [{ 0: '2008', 1: 2008, 2: 26000000 }, { 0: '2009', 1: 2009, 2: 26000000 }, { 0: '2010', 1: 2010, 2: 27100000 }, { 0: '2011', 1: 2011, 2: 27500000 }, { 0: '2012', 1: 2012, 2: 26400000 }, { 0: '2013', 1: 2013, 2: 28800000 }, { 0: '2014', 1: 2014, 2: 33300000 }, { 0: '2015', 1: 2015, 2: 38200000 }, { 0: '2016', 1: 2016, 2: 40800000 }, { 0: '2017', 1: 2017, 2: 40300000 }, { 0: '2018', 1: 2018, 2: 40000000 }, { 0: '2019', 1: 2019, 2: 41344940 }, { 0: null, 1: null, 2: null }], seriesLegend: 'Internt fordrevne' }]

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function LineWidget () {
  if (isServer()) return null

  const { locale } = useContext(WidgetParamsContext)

  return (
    <ResponsiveContainer>
      <LineChart width={600} height={300}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='0' allowDuplicatedCategory={false} tick={false} axisLine={{ strokeWidth: 2, stroke: 'rgb(188,188,188)' }}>
          <Label value='Pages of my website' offset={-10} position='insideBottomLeft' />
        </XAxis>
        <YAxis dataKey='2' width={80} tickFormatter={d => formatDataNumber(d, locale)} tickLine={{ stroke: 'rgb(188,188,188)' }} tick={{ fontFamily: 'Roboto Condensed', fontSize: '14px', fill: 'black' }} />
        <Tooltip />
        <Legend
          wrapperStyle={{ bottom: -10, left: 20 }}
          align='center'
          layout='vertical'
          iconType='circle'
          wrapperStyle={{
            bottom: -30,
            fontFamily: 'Roboto Condensed'
          }}
          label={{ fontFamily: 'Roboto Condensed' }}
        />
        {d.map((s, i) => (
          <Line dataKey='2' data={s.seriesData} name={s.seriesLegend} key={s.seriesLegend} stroke={colours[i % colours.length]} strokeWidth={3} dot={{ strokeWidth: 5 }} activeDot={{ r: 10 }} />
        ))}

        {/* <Line type="linear" dataKey="pv" stroke="#FF7900" strokeWidth={4} dot={{ strokeWidth: 0, fill: '#FF7900', r: 6 }} activeDot={{r: 8}} legendType="circle" /> */}
        {/* <Line type="linear" dataKey="Antall flyktninger fra" stroke="#72C7E7" strokeWidth={4} dot={{ strokeWidth: 0, fill: '#72C7E7', r: 6 }} activeDot={{r: 8}} legendType="circle" /> */}
      </LineChart>
    </ResponsiveContainer>
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
