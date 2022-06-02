import React from 'react'
import { ArcSeries, LabelSeries, XYPlot } from 'react-vis'

const START_RADIUS = 0.3
const BAR_RADIUS_WIDTH = 0.1
const BAR_RADIUS_SPACING = 0.1
const HELPER_BAR_RADIUS_WIDTH = 0.04

export class RadialBarChart extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  1
  state = {
    zeroOutAllBars: true,
  }

  componentDidMount() {
    const el = this.myRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.6) {
            this.setState({ zeroOutAllBars: false })
          }
        })
      },
      { threshold: 0.6, rootMargin: '0px' }
    )
    observer.observe(el)
  }

  data() {
    const maxFigure = Math.max(...this.props.data.map((v) => v.figure))
    return this.props.data
      .sort((a, b) => a.figure - b.figure)
      .map((v, i) => {
        const radiusStart =
          START_RADIUS + (BAR_RADIUS_SPACING + BAR_RADIUS_WIDTH) * i
        const radiusEnd = radiusStart + BAR_RADIUS_WIDTH
        const helperBarRadiusStart =
          radiusStart +
          (radiusEnd - radiusStart) / 2 -
          HELPER_BAR_RADIUS_WIDTH / 2
        const helperBarRadiusEnd =
          helperBarRadiusStart + HELPER_BAR_RADIUS_WIDTH
        const angle = this.state.zeroOutAllBars
          ? 0
          : (v.figure / maxFigure) * 1.5 * Math.PI
        return [
          {
            angle: angle,
            radius0: radiusStart,
            radius: radiusEnd,
            color: v.colour,
            layer: 3,
            label: v.dataLabel,
            xOffsetForDataLabel: v.xOffsetForDataLabel,
            labelWidth: v.labelWidth,
            figure: v.figure,
          },
          {
            angle: angle,
            radius0: radiusStart,
            radius: radiusEnd,
            color: v.colour,
            layer: 2,
            label: v.label,
            labelWidth: v.labelWidth,
            figure: v.figure,
          },
          {
            angle0: angle,
            angle: 1.5 * Math.PI,
            radius0: helperBarRadiusStart,
            radius: helperBarRadiusEnd,
            color: 'rgb(186,186,186,0.72)',
            layer: 1,
          },
        ]
      })
      .flat()
      .sort((a, b) => a.layer - b.layer)
  }

  render() {
    const widthHeight = 290

    const RANGE = 6000000

    const data = this.data()

    const maxRadius = Math.max(...data.map((v) => v.radius))
    const maxFigure = Math.max(
      ...data.filter((v) => v.layer === 2).map((v) => v.figure)
    )

    return (
      <div ref={this.myRef}>
        {this.props.data.length > 0 && (
          <XYPlot
            className={`nrcstat-radial-chart ${this.props.data[0].iso}`}
            margin={{ left: 40, bottom: 0, top: 0, right: 40 }}
            width={widthHeight + 50}
            height={widthHeight + 50}
            xDomain={[-RANGE, RANGE]}
            yDomain={[-RANGE, RANGE]}
          >
            <ArcSeries
              animation="stiff"
              radiusDomain={[0, maxRadius]}
              data={this.data()}
              colorType="literal"
            />
            {data
              .filter((v) => v.layer === 2)
              .map((v, i) => {
                // const width = getTextWidth(v.label, '"Roboto Condensed"');
                const width = v.labelWidth
                return (
                  <LabelSeries
                    key={`${v.layer}-${i}`}
                    data={[
                      {
                        x: 0,
                        y: 0,
                        xOffset: -5,
                        yOffset: -50 + -32 * i,
                        label: v.label,
                      },
                    ]}
                    labelAnchorX="end"
                    style={{ fontFamily: 'Roboto Condensed' }}
                  />
                )
              })}
            {data
              .filter((v) => v.layer === 3)
              .map((v, i) => {
                // const width = getTextWidth(v.label, '"Roboto Condensed"');
                const width = v.labelWidth

                return (
                  <LabelSeries
                    key={`${v.layer}-${i}`}
                    data={[
                      {
                        x: 0,
                        y: 0,
                        xOffset: v.xOffsetForDataLabel,
                        yOffset: -49 + -32 * i,
                        label: v.label,
                      },
                    ]}
                    labelAnchorX="end"
                    style={{
                      fontFamily: 'Roboto Condensed',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  />
                )
              })}
          </XYPlot>
        )}
      </div>
    )
  }
}
