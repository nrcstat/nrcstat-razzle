import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import React, { useContext } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import c from './Bar.module.scss'

function BarViz() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const { locale, widgetObject, preloadedWidgetData } = widgetParams

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Glossary', 'GeographicalNames'])

  // This number has been determined by multiple eyeball tests. When the y axis
  // shows low numbers (e.g. 50, 100, 200) there's a lot of whitespace available.
  // This margin is necessary to show numbers in the millions, e.g. 50 000 000.
  const yAxisWidth = isMobileDevice() ? 50 : 85

  const data = (() => {
    switch (widgetObject.dataType) {
      case 'custom':
        const widgetBuiltByNewWidgetBuilder =
          widgetObject.customData.columns && widgetObject.customData.data
        const widgetBuiltByDeprecatedWidgetWizard =
          !widgetBuiltByNewWidgetBuilder
        return widgetBuiltByDeprecatedWidgetWizard
          ? translateCustomData_deprecated(widgetObject.customData)
          : translateCustomData(widgetObject.customData)

      case 'auto':
        return translatePreloadedData(preloadedWidgetData, t)

      default:
        throw new Error('Invalid widget dataType')
    }
  })()

  const {
    id,
    type,
    title,
    config: { subtitle, source },
  } = widgetObject

  const Axis = { bar: XAxis, column: YAxis }[type]
  const OtherAxis = { bar: YAxis, column: XAxis }[type]

  // NOTE: the `container` class (NOT the css moduels c.container) is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image.
  return (
    <div
      className={`container ${c.container}`}
      ref={findElementEpiServerAncestorResetHeight}
    >
      <div style={{ marginLeft: '10px', textAlign: 'center' }}>
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
      </div>
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer>
          <BarChart
            layout={{ bar: 'vertical', column: 'horizontal' }[type]}
            data={data}
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
              vertical={type === 'bar'}
              horizontal={type === 'column'}
              strokeWidth={2}
            />
            <Axis
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
            <OtherAxis hide axisLine={false} type="category" />
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
                position={
                  { bar: 'insideLeft', column: 'insideBottomLeft' }[type]
                }
                angle={{ bar: 0, column: 270 }[type]}
                offset={{ bar: 20, column: 30 }[type]}
                style={{
                  fontFamily: 'Roboto Condensed',
                  fontSize: '22px',
                  color: '#474747',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                }}
                formatter={(label) =>
                  // Neat trick! Convert label spaces to non-breaking spaces. Source:
                  // https://stackoverflow.com/a/52266005/16852998
                  label.toLocaleString().replace(/ /g, '\u00A0')
                }
                dominantBaseline="middle"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* min-height to create a vertical space for the share button, even if no subtitle or source */}
      <div
        style={{ marginLeft: '10px', textAlign: 'center', minHeight: '3em' }}
      >
        <div className={c['share-button-wrapper']}>
          <ShareButton widgetId={id} />
        </div>
        {subtitle && (
          <p
            style={{
              fontFamily: 'Roboto Condensed',
              color: '#919191',
              fontSize: '20px',
              fontWeight: '400',
              margin: 0,
              padding: 0,
              marginTop: '10px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </p>
        )}
        {source && (
          <p
            style={{
              fontFamily: 'Roboto',
              color: '#474747',
              fontSize: '14px',
              fontWeight: '300',
              margin: 0,
              padding: 0,
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            {source}
          </p>
        )}
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
function translatePreloadedData(data, t) {
  // What varies? Either we have multiple years, or countries, or dataPoints
  const variant = identifyVariant(data)

  return data.map((dataItem) => ({
    label: t(translationKeyForVariant(variant)),
    name: t(translationKeyForVariantKey(variant, dataItem[variant])),
    value: dataItem.data,
  }))
}
function identifyVariant(data) {
  if (data.length <= 1) return 'dataPoint'
  const variants = ['dataPoint', 'countryCode', 'year']
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
    case 'year':
      return 'year'
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
    case 'year':
      return key
    default:
      throw new Error('Invalid variant')
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
