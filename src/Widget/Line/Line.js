import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import * as $ from 'jquery'
import { flatten, groupBy } from 'lodash'
import React, { useContext } from 'react'
import {
  CartesianGrid,
  Customized,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import './Line.scss'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function LineWidget() {
  if (isServer()) return null

  const {
    locale,
    widgetObject: {
      id,
      customData,
      dataType,
      title = '',
      config: { subtitle = '', linkbox = '', source = '' },
      enableSocialMediaSharing,
    },
    preloadedWidgetData,
  } = useContext(WidgetParamsContext)

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Glossary', 'GeographicalNames'])

  const fixEpiServerAncestorBlockHeight = (element) => {
    $(element).parents('.nrcstat-block').css('height', 'auto')
  }

  // This nubmer has been determined by multiple eyeball tests. When the y axis
  // shows low numbers (e.g. 50, 100, 200) there's a lot of whitespace available.
  // This margin is necessary to show numbers in the millions, e.g. 50 000 000.
  // const yAxisWidth = isMobileDevice() ? 50 : 85

  const data = (() => {
    switch (dataType) {
      case 'custom':
        const widgetBuiltByNewWidgetBuilder =
          customData.columns && customData.data
        const widgetBuiltByDeprecatedWidgetWizard =
          !widgetBuiltByNewWidgetBuilder
        return widgetBuiltByDeprecatedWidgetWizard
          ? translateCustomData_deprecated(customData)
          : translateCustomData(customData)

      case 'auto':
        return translatePreloadedData(preloadedWidgetData, t)

      default:
        throw new Error('Invalid widget dataType')
    }
  })()

  const yAxisWidth =
    measureText14RobotoCondensed(
      formatDataNumber(
        Math.max(
          ...flatten(data.map(({ seriesData }) => seriesData)).map(
            (d) => d.value
          )
        ),
        locale
      )
    ) + 15

  // NOTE: the `container` class is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image.
  return (
    <div className="container" ref={fixEpiServerAncestorBlockHeight}>
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
      <div style={{ width: '100%', height: '450px', position: 'relative' }}>
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
        {enableSocialMediaSharing ? (
          <div style={{ position: 'absolute', right: '0', bottom: '-0.8em' }}>
            <ShareButton widgetId={id} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LineWidget

function SourceLabel({ width, height, source, ...props }) {
  return (
    <g
      transform={`translate(${width - 10}, ${
        height - 35 - props.graphicalItems.length * 21
      })`}
    >
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
function translatePreloadedData(data, t) {
  // What varies? The line widget always shows multiple years, which leaves countries or dataPoints
  const variant = identifyVariant(data)

  const grouped = groupBy(data, variant)

  return Object.entries(grouped).map(([variantKey, data]) => {
    return {
      seriesLegend: t(translationKeyForVariantKey(variant, variantKey)),
      seriesData: data.map((d) => ({
        date: d.year,
        value: d.data,
      })),
    }
  })
}
function identifyVariant(data) {
  if (data.length <= 1) return 'dataPoint'
  const variants = ['dataPoint', 'countryCode']
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i]
    const firstItem = data[0]
    const secondITem = data[1]
    if (firstItem[variant] !== secondITem[variant]) return variant
  }
  return 'dataPoint'
}
function translationKeyForVariant(variant) {
  switch (variant) {
    case 'dataPoint':
      return 'datapoint'
    case 'countryCode':
      return 'Glossary:country'
    default:
      throw new Error('Invalid variant')
  }
}
function translationKeyForVariantKey(variant, key) {
  switch (variant) {
    case 'dataPoint':
      return `Glossary:dataPoint.${key}.shortLabel`
    case 'countryCode':
      return `NRC.Web.StaticTextDictionary.Contries.${key}`
    default:
      throw new Error('Invalid variant')
  }
}

function measureText14RobotoCondensed(text) {
  const ctx = window.document.createElement('canvas').getContext('2d')
  ctx.font = "14px 'Roboto Condensed"

  return ctx.measureText(text).width
}
