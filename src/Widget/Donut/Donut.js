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
import { isServer } from '../../util/utils'
import ShareButton from '../ShareButton'
import { WidgetParamsContext } from '../Widget'
import './Donut.scss'

const colours = ['#FF9C48', '#47A3B5', '#FED769', '#70A873', '#E5735F']

function DonutRerenderOnResize() {
  const [show, setShow] = useState(true)
  useEventListener('resize', () => {
    setShow(false)
    setInterval(() => setShow(true))
  })
  if (show) return <Donut />
  else return null
}

function Donut() {
  if (isServer()) return null

  const [viewBox, setViewBox] = useState(null)
  const widgetParams = useContext(WidgetParamsContext)
  const {
    widgetObject: {
      dataType,
      customData,
      title,
      id,
      config: { subtitle, source, linkToSource },
      enableSocialMediaSharing,
    },
    preloadedWidgetData,
  } = widgetParams

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Glossary', 'GeographicalNames'])

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

  // NOTE: the `container` class is added so that
  // nrcstat-monorepo/libs/widget-social-media-sharing/src/lib/index.ts:useRenderWidgetThumbnailBlob
  // can accurately target the container to render into a thumbnail image.
  return (
    <div className="container" ref={findElementEpiServerAncestorResetHeight}>
      <div style={{ width: '100%', height: '450px' }}>
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
            >
              {data.map((d, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={colours[i % colours.length]}
                  stroke={colours[i % colours.length]}
                />
              ))}
              <Label
                position="center"
                content={<DonutTitle setViewBox={setViewBox} />}
                value={title}
              />
            </Pie>

            <Tooltip
              active
              content={<CustomTooltip />}
              wrapperStyle={{ visibility: 'visible', foo: 'bar' }}
            />
          </PieChart>
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
          {}
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
              marginTop: '30px',
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
      )}
    </div>
  )
}

class DonutTitle extends React.Component {
  textRef = React.createRef()

  state = {
    scale: 0,
    x: 0,
    y: 0,
  }

  componentDidMount() {
    this.props.setViewBox(this.props.viewBox)
    // Calculate scale transformation
    const textElement = this.textRef.current
    var bb = textElement.getBBox()
    const enclosingCircleRadius = this.props.viewBox.innerRadius
    const boundingBoxWidthHeight = enclosingCircleRadius * 2 * Math.SQRT1_2
    var widthTransform = boundingBoxWidthHeight / bb.width
    var heightTransform = boundingBoxWidthHeight / bb.height
    var scale =
      widthTransform < heightTransform ? widthTransform : heightTransform

    // Calculate (x,y) translate
    const { cx, cy } = this.props.viewBox
    const x = cx
    // TODO: this calculation is strange and a result of trial & error - fix it?
    const y = cy + (bb.height * scale) / 4

    this.setState({ scale, x, y })
  }

  render() {
    return (
      <g transform={`translate(${this.state.x}, ${this.state.y})`}>
        <text
          fontFamily="Roboto"
          fill="#474747"
          fontWeight="bold"
          textAnchor="middle"
          transform={`scale(${this.state.scale})`}
          ref={this.textRef}
        >
          {this.props.value}
        </text>
      </g>
    )
  }
}

export default DonutRerenderOnResize

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
