import { useEventListener, useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isClient, isServer } from '../../util/utils'
import { formatDataNumber } from '../../util/widgetHelpers'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import './Donut.scss'
import { useIntersection } from 'react-use'

const VISIBILITY_RENDER_THRESHOLD = 0.15

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function Donut() {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const {
    widgetObject: {
      dataType,
      customData,
      title,
      id,
      config: { subtitle, source, linkToSource },
      enableSocialMediaSharing,
      enablePopup,
    },
    preloadedWidgetData,
  } = widgetParams

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Glossary', 'GeographicalNames'])

  const data = (() => {
    switch (dataType) {
      case 'custom':
        return translateCustomData(customData)

      case 'auto':
        return translatePreloadedData(preloadedWidgetData, t)

      default:
        throw new Error('Invalid widget dataType')
    }
  })()
  data.unshift({ name: '', value: 0 })

  // NOTE: the `container` class is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image.
  return (
    <div className="container" ref={findElementEpiServerAncestorResetHeight}>
      <div
        style={{
          maxHeight: '450px',
        }}
      >
        <div
          style={{
            width: '100%',
            paddingTop: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              maxHeight: '450px',
            }}
          >
            <RenderOnVisible>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    startAngle={0}
                    innerRadius="60%"
                    endAngle={-360}
                    data={data}
                    fill="#8884d8"
                    paddingAngle={0}
                    activeIndex={0}
                    activeShape={renderCenteredLabel(title)}
                  >
                    {data.map((d, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={colours[i % colours.length]}
                        stroke={colours[i % colours.length]}
                      />
                    ))}
                  </Pie>

                  {enablePopup ? (
                    <Tooltip
                      content={<CustomTooltip />}
                      wrapperStyle={{ visibility: 'visible', foo: 'bar' }}
                    />
                  ) : null}
                </PieChart>
              </ResponsiveContainer>
            </RenderOnVisible>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
        }}
      >
        {enableSocialMediaSharing ? (
          <div style={{ position: 'absolute', right: '0', bottom: '0.25em' }}>
            <ShareButton widgetId={id} />
          </div>
        ) : null}
        <p
          style={{
            fontFamily: 'Roboto',
            color: '#474747',
            fontSize: '22px',
            fontWeight: '400',
            margin: 0,
            padding: 0,
          }}
        >
          {subtitle}
        </p>
        {source ? (
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
            {linkToSource ? (
              <a href={linkToSource} target="_blank">
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        ) : null}
      </div>
    </div>
  )
}

if (isClient()) {
  window.centeredLabelCache = {}
}

function CenteredLabel(props) {
  const { text, cx, cy, middleRadius } = props

  const [, forceUpdate] = useState()

  const afterTextRender = (textElement) => {
    if (window.centeredLabelCache[text]) return

    const availableWidthOrHeight = middleRadius
    window.bb = textElement

    if (!textElement) return
    const { width: currentWidth, height: currentHeight } = textElement.getBBox()

    var widthTransform = availableWidthOrHeight / currentWidth
    var heightTransform = availableWidthOrHeight / currentHeight
    var value =
      widthTransform < heightTransform ? widthTransform : heightTransform

    window.centeredLabelCache[text] = value

    forceUpdate()
  }

  return (
    <g
      onMouseOver={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <text
        x={cx}
        y={cy}
        dy={8}
        alignmentBaseline="middle"
        textAnchor="middle"
        fontFamily="Roboto"
        fill="#474747"
        fontWeight="bold"
        ref={afterTextRender}
        style={{
          fontSize: `${window.centeredLabelCache[text]}em`,
          visibility: window.centeredLabelCache[text] ? 'visible' : 'hidden',
        }}
      >
        {text}
      </text>
    </g>
  )
}

function renderCenteredLabel(text) {
  return function (props) {
    return <CenteredLabel {...props} text={text} />
  }
}

function RenderOnVisible({ children }) {
  const elementRef = useRef(null)
  const renderingWasTriggered = useRef(false)
  const intersection = useIntersection(elementRef, {
    root: null,
    rootMargin: '0px',
    threshold: VISIBILITY_RENDER_THRESHOLD,
  })

  if (
    !renderingWasTriggered.current &&
    intersection?.intersectionRatio > VISIBILITY_RENDER_THRESHOLD
  ) {
    renderingWasTriggered.current = true
  }

  return (
    <div ref={elementRef} style={{ width: '100%', height: '100%' }}>
      {renderingWasTriggered.current ? children : null}
    </div>
  )
}

export default Donut

function translateCustomData(customData) {
  const nameProperty = customData.columns[0].data
  const valueProperty = customData.columns[1].data
  return customData.data
    .map((item) => ({ name: item[nameProperty], value: item[valueProperty] }))
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

const CustomTooltip = ({ active, payload }) => {
  const containerElementRef = useRef(null)
  const { clientX, clientY, screenX, screenY, pageX, pageY } = useMouse()
  const { locale } = useContext(WidgetParamsContext)

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
        <span className="number">{formatDataNumber(value, locale, true)}</span>
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
