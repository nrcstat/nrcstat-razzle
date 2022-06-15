import { useEventListener, useMouse } from '@umijs/hooks'
import React, { useContext, useRef, useState } from 'react'
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { FixedLocaleContext } from '../../services/i18n'
import { isClient, isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import { getCountryStat } from './get-country-stat'
import { formatDataPercentage } from '@/util/widgetHelpers.js'
import { useIntersection } from 'react-use'

const VISIBILITY_RENDER_THRESHOLD = 0.15

const colours = ['#D3D3D3', '#F3F3F3']

export function PercentageDonut({ dataPoint }) {
  const [show, setShow] = useState(true)
  useEventListener('resize', () => {
    setShow(false)
    setInterval(() => setShow(true))
  })
  if (show) return <Donut dataPoint={dataPoint} />
  else return null
}

// Datapoint has to be 'percentageWomenFleeingToCountry',
// or 'percentageChildrenFleeingToCountry'
function Donut({ dataPoint }) {
  if (isServer()) return null

  const widgetParams = useContext(WidgetParamsContext)
  const { year, countryCode, preloadedWidgetData, locale } = widgetParams

  const data = getCountryStat(
    preloadedWidgetData,
    countryCode,
    dataPoint,
    parseInt(year)
  ).data
  const remainder = 1 - data

  const donutData = [
    { name: '', value: data },
    { name: '', value: remainder },
  ]
  donutData.unshift({ name: '', value: 0 })

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  return (
    <div>
      <div
        style={{
          maxHeight: '230px',
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
              maxHeight: '230px',
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
                    data={donutData}
                    fill="#8884d8"
                    paddingAngle={0}
                    activeIndex={0}
                    activeShape={renderCenteredLabel(
                      formatDataPercentage(data, locale)
                    )}
                  >
                    {donutData.map((d, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={colours[i % colours.length]}
                        stroke={colours[i % colours.length]}
                      />
                    ))}
                  </Pie>
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
        <p
          style={{
            fontFamily: 'Roboto',
            color: '#474747',
            fontSize: '16px',
            fontWeight: '400',
            margin: 0,
            padding: 0,
            marginTop: '30px',
          }}
        >
          {t(`dataPoint.${dataPoint}`)}
        </p>
      </div>
    </div>
  )
}

if (isClient()) {
  window.centeredLabelCache = {}
}

function CenteredLabel(props) {
  const { locale } = useContext(WidgetParamsContext)
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
