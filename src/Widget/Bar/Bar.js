import { formatDataNumber, isMobileDevice } from '@/util/widgetHelpers.js'
import React, { useContext } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Label,
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

const COLOURS = ['#FED769']

function BarViz() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const { locale, widgetObject, preloadedWidgetData } = widgetParams

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Glossary', 'GeographicalNames'])

  const data = (() => {
    switch (widgetObject.dataType) {
      case 'custom':
        return translateCustomData(widgetObject.customData)

      case 'auto':
        return translatePreloadedData(preloadedWidgetData, t)

      default:
        throw new Error('Invalid widget dataType')
    }
  })()

  const yAxisWidth =
    measureText14RobotoCondensed(
      formatDataNumber(Math.max(...data.map((d) => d.value)), locale)
    ) + 15

  const {
    id,
    type,
    title,
    config: { subtitle, source, linkToSource },
    enableSocialMediaSharing,
    enablePopup,
    enableColourSchemeOverride,
    overridingColourScheme,
  } = widgetObject

  const colours = enableColourSchemeOverride
    ? overridingColourScheme.split(',')
    : COLOURS

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
            {enablePopup ? (
              <Tooltip
                formatter={(d, _, info) => {
                  return [formatDataNumber(d, locale, true)]
                }}
                labelFormatter={(a, b, c, d) => {
                  return b?.[0]?.payload?.name
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
            ) : null}

            <Bar dataKey="value" fill={console.log}>
              {data.map((entry, index) => (
                <Cell key={index} fill={colours[index % colours.length]} />
              ))}
              <LabelList
                dataKey="name"
                position={
                  { bar: 'insideLeft', column: 'insideBottomLeft' }[type]
                }
                angle={{ bar: 0, column: 270 }[type]}
                offset={{ bar: 20, column: 30 }[type]}
                style={{
                  fontFamily: 'Roboto Condensed',
                  fontSize: '18px',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                }}
                fill="#474747"
                formatter={(label) =>
                  // Neat trick! Convert label spaces to non-breaking spaces. Source:
                  // https://stackoverflow.com/a/52266005/16852998
                  label.toLocaleString().replace(/ /g, '\u00A0')
                }
                dominantBaseline={0}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* min-height to create a vertical space for the share button, even if no subtitle or source */}
      <div
        style={{
          marginLeft: '10px',
          textAlign: 'center',
          minHeight: enableSocialMediaSharing ? '3em' : '0',
        }}
      >
        {enableSocialMediaSharing ? (
          <div className={c['share-button-wrapper']}>
            <ShareButton widgetId={id} />
          </div>
        ) : null}
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
            {linkToSource ? (
              <a href={linkToSource} target="_blank">
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export default BarViz

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

function measureText14RobotoCondensed(text) {
  const ctx = window.document.createElement('canvas').getContext('2d')
  ctx.font = "14px 'Roboto Condensed"

  return ctx.measureText(text).width
}
