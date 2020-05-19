import { includes } from 'lodash'
import * as helpers from './widgetHelpers'
import * as settings from './widgetBarHorizontalSettings.json'

/*

  svg:
  ---------------------------------------------------------------------------
  |                                                                         |
  | wrapperBox:                                                             |
  | ----------------------------------------------------------------------  |
  | |                                                                    |  |
  | |  title:                                                            |  |
  | |  ----------------------------------------------------------------  |  |
  | |  |                                                              |  |  |
  | |  ----------------------------------------------------------------  |  |
  | |                                                                    |  |
  | |  subtitle:                                                         |  |
  | |  --------------------------------------------                      |  |
  | |  |                                          |                      |  |
  | |  --------------------------------------------                      |  |
  | |                                                                    |  |
  | |  mainWrapper:                                                      |  |
  | |  ----------------------------------------------------------------  |  |
  | |  |                                                              |  |  |
  | |  |  main:                                                       |  |  |
  | |  |  ----------------------------------------------------------  |  |  |
  | |  |  |                                                        |  |  |  |
  | |  |  |  labelBesidesBar:            chart:                    |  |  |  |
  | |  |  |  --------------------        ------------------        |  |  |  |
  | |  |  |  |                  |        |                |        |  |  |  |
  | |  |  |  |                  |        |                |        |  |  |  |
  | |  |  |  |                  |        |                |        |  |  |  |
  | |  |  |  |                  |        |                |        |  |  |  |
  | |  |  |  --------------------        ------------------        |  |  |  |
  | |  |  |                                                        |  |  |  |
  | |  |  ----------------------------------------------------------  |  |  |
  | |  |                                                              |  |  |
  | |  ----------------------------------------------------------------  |  |
  | |                                                                    |  |
  | |  source:                                         social:           |  |
  | |  --------------------------------------------    ------------      |  |
  | |  |                                          |    | X  X  X  |      |  |
  | |  --------------------------------------------    ------------      |  |
  | |                                                                    |  |
  | |  linkbox                                                           |  |
  | |  ----------------------------------------------------------------  |  |
  | |  |                                                              |  |  |
  | |  ----------------------------------------------------------------  |  |
  | |                                                                    |  |
  | ----------------------------------------------------------------------  |
  |                                                                         |
  ---------------------------------------------------------------------------

*/

function drawWidgetBarHorizontal(widgetObject, widgetData, targetSelector) {
  const wObject = widgetObject
  const widgetId = widgetObject.id
  const wData = widgetData
  const wConfig = widgetObject.config

  const target = $(targetSelector)
  const w = target.innerWidth()
  const h = target.innerHeight()

  let wrapperBox

  calculateBoxes()

  // Empty target
  target.empty()
  target.addClass("nrcstat")

  const svg = drawSvg(targetSelector, wrapperBox, w, h)
  const {gWrapper, gTitle, gMainWrapper, gMain, gLabelBesidesBar, gChart, gSubtitle, gSource, gLinkbox, gSocial} = drawGs(svg, wrapperBox, wData)


  //debugDrawRectangles()

  // Draw text in sections: title, subtitle, source, linkbox
  drawSectionText(wConfig.title, gTitle, wrapperBox.title, settings.title)
  drawSectionText(wConfig.subtitle, gSubtitle, wrapperBox.subtitle, settings.subtitle)
  drawSectionText(wConfig.source, gSource, wrapperBox.source, settings.source)

  drawLinkbox()

  drawMainWrapper()
  drawSocial()

  helpers.repairTextPlacements(target)

  function drawSvg() {
    d3.select(targetSelector).append("svg").attr({
      width: w,
      height: h
    })
    let svg = d3.select(`${targetSelector} svg`)
    return svg
  }

  function drawGs() {
    const gWrapper = svg.append("g")
    gWrapper.attr({
      transform: `translate(${wrapperBox.x},${wrapperBox.y})`,
    })

    const gTitle = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.title.x)},${Math.floor(wrapperBox.title.y)})`
    })
    const gMainWrapper = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.mainWrapper.x)},${Math.floor(wrapperBox.mainWrapper.y)})`
    })
    const gMain = gMainWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.mainWrapper.main.x)},${Math.floor(wrapperBox.mainWrapper.main.y)})`
    })
    const gChart = gMain.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.mainWrapper.main.chart.x)},${Math.floor(wrapperBox.mainWrapper.main.chart.y)})`
    })
    const gLabelBesidesBar = gMain.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.mainWrapper.main.labelBesideBar.x)},${Math.floor(wrapperBox.mainWrapper.main.labelBesideBar.y)})`,
      class: "labelBesidesBar"
    })


    const gSubtitle = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.subtitle.x)},${Math.floor(wrapperBox.subtitle.y)})`
    })
    const gSource = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.source.x)},${Math.floor(wrapperBox.source.y)})`
    })
    const gLinkbox = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.linkbox.x)},${Math.floor(wrapperBox.linkbox.y)})`
    })
    const gSocial = gWrapper.append("g").attr({
      transform: `translate(${Math.floor(wrapperBox.social.x)},${Math.floor(wrapperBox.social.y)})`
    })

    return {gWrapper, gTitle, gMainWrapper, gMain, gLabelBesidesBar, gChart, gSubtitle, gSource, gLinkbox, gSocial}
  }

  function drawSectionText(text, sectionG, sectionPosition, sectionStyle) {
    if (!text) return;
    const txt = sectionG.append("text").attr("class", "fix-my-tspan-children-position")
    const lineHeight = helpers.getTextHeight(sectionPosition.lines[0], sectionStyle.style)
    txt.attr("font-family", sectionStyle.fontFamily)
    txt.attr({
      "font-family": sectionStyle.fontFamily,
      "font-weight": sectionStyle.fontWeight
    })
    txt.selectAll("tspan").data(sectionPosition.lines).enter().append("tspan")
        .attr({
          "font-family": sectionStyle.fontFamily,
          "font-weight": sectionStyle.fontWeight,
          "font-size": sectionStyle.fontSize,
          "fill": sectionStyle.fontColor,
          "y": (line, i) => lineHeight * (i) + (i) * sectionStyle.lineSpacing,
          "x": 0,
          "dominant-baseline": "hanging"
        })
        .text(l => `${l}`)
  }

  function drawLinkbox() {
    if (!wConfig.linkbox) return;
    const txtWidth = helpers.getTextWidth(wConfig.linkbox, settings.linkbox.style)
    const txtHeight = helpers.getTextHeight(wConfig.linkbox, settings.linkbox.style)
    const linkboxClickHandler = function () {
      return window.open("http://" + wConfig.linkbox);
    }
    const linkboxRect = gLinkbox.append("rect").attr({
      width: Math.floor(txtWidth + settings.linkbox.horPadding * 2),
      height: Math.floor(wrapperBox.linkbox.h),
      fill: settings.linkbox.boxFillColor
    })
    linkboxRect.style("cursor", "pointer")
    linkboxRect.on("click", linkboxClickHandler)
    const gLinkboxInner = gLinkbox.append("g")
        .attr("transform", `translate(${settings.linkbox.horPadding},${settings.linkbox.verPadding})`)
    const txt = gLinkboxInner.append("text").attr("class", "fix-my-tspan-children-position")
    txt.on("click", linkboxClickHandler)
    txt.style("cursor", "pointer")

    const tSpan = txt.append("tspan")
    tSpan.attr({
      "font-family": settings.linkbox.fontFamily,
      "font-weight": settings.linkbox.fontWeight,
      "font-size": settings.linkbox.fontSize,
      "fill": settings.linkbox.fontColor,
      "dominant-baseline": "hanging"
    })
        .text(wConfig.linkbox)
    tSpan.on("click", linkboxClickHandler)
    tSpan.style("cursor", "pointer")
  }

  function drawMainWrapper() {

    const chartAreaW = wrapperBox.mainWrapper.main.chart.w
    const chartAreaH = wrapperBox.mainWrapper.main.chart.h

    const {ticks, colMargin, columnFillColor} = settings.chart

    const colHeight = chartAreaH / wData.length - colMargin

    let xMax = d3.max(_(wData).map(d => d.d).value())
    xMax += xMax / ticks

    const xScale = d3.scale.linear().domain([0, xMax]).range([0, chartAreaW])
    const xScaleAxis = d3.scale.linear().domain([0, xMax]).range([chartAreaW, 0])
    const xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(ticks)
        .tickFormat(d => helpers.formatDataNumber(d, "nb_NO"))

    const labels = wData.map(d => d.l)
    const labelHeight = helpers.getTextHeight(labels[0], settings.labelBesidesBar.style)
    wData.forEach((d, i) => {
      let y = i * (chartAreaH / wData.length) + colMargin
      const height = colHeight - colMargin
      y += ((height - labelHeight) / 2) * settings.labelBesidesBar.magicLabelYPositionMultiplier
      gLabelBesidesBar.append("text").append("tspan")
          .attr({
            "font-family": settings.labelBesidesBar.fontFamily,
            "font-weight": settings.labelBesidesBar.fontWeight,
            "font-size": settings.labelBesidesBar.fontSize,
            "fill": settings.labelBesidesBar.fontColor,
            "y": y,
            "x": 0,
            "dominant-baseline": "hanging"
          })
          .text(d.lbb)

    })

    gChart.append("g").attr(
        {
          "class": "y-axis",
          "transform": `translate(0,${chartAreaH})`
        })
        .call(xAxis)

    gChart.append("g").attr("class", "grid x axis")
        .attr({
          "transform": `translate(0,${chartAreaH})`
        })
        .call(xAxis.tickSize(-chartAreaH, 0, 0).tickFormat(""));

    var tip = d3.tip()
        .attr('class', 'nrcstat-d3-tip')
        .html(d => {
          var data = helpers.formatDataNumber(d.d, "nb_NO")
          return '<span class="year">' + d.p + '</span>' + '<hr class="ruler" />' + '<span class="number">' + data + '</span>';
        })
        .offset([-10, 0]);
    gChart.call(tip)

    gChart.selectAll("rect").data(wData).enter()
        .append("rect")
        .attr({
          x: (d, i) => 0,
          y: (d, i) => i * (chartAreaH / wData.length) + colMargin,
          width: d => xScale(d.d),
          height: () => colHeight - colMargin,
          fill: d => {
            if (includes(wObject.years, wObject.highlightYear)) {
              if (d.y == wObject.highlightYear) return columnFillColor;
              else return settings.chart.columnNotHighlightedColor;
            } else {
              return columnFillColor;
            }
          }
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
  }

  function drawSocial() {
    if (!wConfig.social) return;

    target.css('position', 'relative')
    const {icons, iconDiameter, horSpacing} = settings.social


    icons.forEach((s, i) => {
      const icon = helpers.makeIcon(widgetId, wConfig, s)
      icon.css({
        position: "absolute",
        width: iconDiameter,
        height: iconDiameter,
        top: wrapperBox.y + wrapperBox.social.y,
        left: wrapperBox.x + wrapperBox.social.x + i * (iconDiameter + horSpacing)
      })
      icon.children("img").css({
        width: iconDiameter,
        height: iconDiameter
      })

      target.append(icon)
    })
  }

  function calculateBoxes() {

    wrapperBox = {
      x: settings.wrapper.margin.left,
      y: settings.wrapper.margin.top,
      w: w - (settings.wrapper.margin.left + settings.wrapper.margin.right),
      h: h - (settings.wrapper.margin.top + settings.wrapper.margin.bottom),
      title: {},
      mainWrapper: {
        main: {
          labelBesideBar: {},
          chart: {}
        }
      },
      subtitle: {},
      source: {},
      linkbox: {},
      social: {}
    }

    calcBoxTitle()
    calcBoxSubtitleDimensions()
    calcBoxSourceDimensions()
    calcBoxSocialDimensions()
    calcBoxLinkboxDimensions()

    calcBoxSubtitlePosition()
    calcBoxMainWrapper()
    calcBoxMain()
    calcBoxSourcePosition()
    calcBoxLinkboxPosition()

    calcBoxSocialPosition()

  }

  function calcBoxTitle() {
    if (!wConfig.title) {
      wrapperBox.title = {x: 0, y: 0, w: 0, h: 0, lines: null}
      return
    }
    let titleBoxWidth = wrapperBox.w
    const r = helpers.splitTextToLines({
      availableWidth: titleBoxWidth,
      text: wConfig.title,
      textStyle: settings.title.style
    })
    const lineHeight = r.lineHeight
    const lines = r.lines
    const boxHeight = lineHeight * (lines.length) + (lines.length - 1) * settings.title.lineSpacing
    wrapperBox.title = {
      w: titleBoxWidth,
      h: boxHeight,
      x: 0,
      y: 0,
      lines: lines,
      lineHeight: lineHeight
    }
  }

  function calcBoxSubtitleDimensions() {
    if (!wConfig.subtitle) {
      wrapperBox.subtitle = {w: 0, h: 0}
      return
    }
    let subtitleBoxWidth = wrapperBox.w
    if (wConfig.social) {
      subtitleBoxWidth -= settings.social.widthPlusLeftMargin
    }
    const r = helpers.splitTextToLines({
      availableWidth: subtitleBoxWidth,
      text: wConfig.subtitle,
      textStyle: settings.subtitle.style
    })
    const lineHeight = r.lineHeight
    const lines = r.lines
    const boxHeight = lineHeight * (lines.length) + (lines.length - 1) * settings.subtitle.lineSpacing
    wrapperBox.subtitle = {
      w: subtitleBoxWidth,
      h: boxHeight,
      x: 0,
      y: 0,
      lines: lines,
      lineHeight: lineHeight
    }
  }

  function calcBoxSourceDimensions() {
    if (!wConfig.source) {
      // The source box's position is calculated based on the source box. If both the source box and subtitle boxes are
      // deactivated, the social box positioning will be strange if processed normally. If the social box is active but
      // the source + subtitle boxes are not, pretend the the source box has content to ensure correct social box drawing
      if (!wConfig.title) {
        if (wConfig.social) {
          wrapperBox.source = {
            w: wrapperBox.w - settings.social.widthPlusLeftMargin,
            h: settings.social.iconDiameter,
            doDraw: false
          }
        } else {
          wrapperBox.source = {w: wrapperBox.w - settings.social.widthPlusLeftMargin, h: 0, doDraw: false}
        }
      } else {
        wrapperBox.source = {w: wrapperBox.w - settings.social.widthPlusLeftMargin, h: 0, doDraw: false}
      }
      return
    }
    let sourceBoxWidth = wrapperBox.w
    if (wConfig.social) {
      sourceBoxWidth -= settings.social.widthPlusLeftMargin
    }
    let lineHeight = helpers.getTextHeight(wConfig.linkbox, settings.source.style)
    if (wConfig.social && !wConfig.subtitle) lineHeight = 32
    wrapperBox.source = {
      doDraw: true,
      w: sourceBoxWidth,
      h: lineHeight,
      x: 0,
      y: 0,
      lines: [wConfig.source],
      lineHeight: lineHeight
    }
  }

  function calcBoxSocialDimensions() {
    if (!wrapperBox.social) {
      wrapperBox.social = {w: null, h: null}
      return
    }
    const socialButtonCount = settings.social.icons.length
    const socialBoxWidth = socialButtonCount * settings.social.iconDiameter + (socialButtonCount - 1) * settings.social.horSpacing
    wrapperBox.social = {
      w: socialBoxWidth,
      h: settings.social.iconDiameter
    }
  }

  function calcBoxLinkboxDimensions() {
    if (!wConfig.linkbox) {
      wrapperBox.linkbox = {w: 0, h: 0}
      return
    }
    let linkboxWidth = wrapperBox.w
    const lineHeight = helpers.getTextHeight(wConfig.linkbox, settings.linkbox.style)
    const linkboxHeight = lineHeight + settings.linkbox.verPadding * 2
    wrapperBox.linkbox = {
      w: linkboxWidth,
      h: linkboxHeight,
      lines: [wConfig.linkbox],
      lineHeight: lineHeight
    }
  }

  function calcBoxSubtitlePosition() {
    const titleBottom = wrapperBox.title.y + wrapperBox.title.h
    if (wConfig.subtitle) {
      wrapperBox.subtitle.x = 0
      wrapperBox.subtitle.y = titleBottom + settings.subtitle.topMargin
    } else {
      wrapperBox.subtitle.x = 0
      wrapperBox.subtitle.y = titleBottom
    }
  }

  function calcBoxMainWrapper() {
    let w, h, y
    w = wrapperBox.w
    h = wrapperBox.h
    y = wrapperBox.subtitle.y + wrapperBox.subtitle.h + settings.mainWrapper.topMargin
    h -= (wrapperBox.subtitle.y + wrapperBox.subtitle.h + settings.mainWrapper.topMargin)
    /*
    if (wConfig.title) {
      h -= (wrapperBox.title.h + settings.mainWrapper.topMargin)
      //y = wrapperBox.subtitle.h + settings.mainWrapper.topMargin
    }
    if (wConfig.subtitle) {
      h -= (wrapperBox.subtitle.y + wrapperBox.subitle.h + settings.mainWrapper.topMargin)
      //y = wrapperBox.subtitle.h + settings.mainWrapper.topMargin
    }*/
    //if (wConfig.subtitle) h -= (wrapperBox.subtitle.h + settings.subtitle.topMargin)
    if (wConfig.source) h -= (wrapperBox.source.h + settings.source.topMargin)
    if (wConfig.linkbox) h -= (wrapperBox.linkbox.h + settings.linkbox.topMargin)

    wrapperBox.mainWrapper = {x: 0, y, w, h}
  }

  function calcBoxMain() {
    const labels = wData.map(d => d.lbb)

    const wrapperWidth = wrapperBox.mainWrapper.w
    const wrapperHeight = wrapperBox.mainWrapper.h

    wrapperBox.mainWrapper.main = {
      x: 0, y: 0,
      w: wrapperWidth,
      h: wrapperHeight
    }
    wrapperBox.mainWrapper.main.labelBesideBar = {
      x: settings.labelBesidesBar.leftMargin, y: 0,
      w: wrapperWidth,
      h: wrapperHeight
    }

    wrapperBox.mainWrapper.main.chart = {
      x: 0,
      y: 0,
      w: wrapperWidth,
      h: wrapperHeight
    }
  }

  function calcBoxSourcePosition() {
    const subtitleBottom = wrapperBox.mainWrapper.y + wrapperBox.mainWrapper.h
    if (wConfig.source) {
      wrapperBox.source.x = 0
      wrapperBox.source.y = subtitleBottom + settings.source.topMargin
    } else {
      wrapperBox.source.x = 0
      wrapperBox.source.y = subtitleBottom
    }
  }

  function calcBoxLinkboxPosition() {
    const sourceBottom = wrapperBox.source.y + wrapperBox.source.h
    if (wConfig.linkbox) {
      wrapperBox.linkbox.x = 0
      wrapperBox.linkbox.y = sourceBottom + settings.linkbox.topMargin
    } else {
      wrapperBox.linkbox.x = 0
      wrapperBox.linkbox.y = sourceBottom
    }
  }

  function calcBoxSocialPosition() {
    const x = wrapperBox.source.x + wrapperBox.source.w + settings.social.leftMargin
    const y = wrapperBox.source.y + wrapperBox.source.h - settings.social.iconDiameter
    wrapperBox.social.x = x
    wrapperBox.social.y = y + 30 // temp quickfix
  }

  function debugDrawRectangles(){
    const rectangles = [
      {g: gTitle, rect: wrapperBox.title, color: "blue"},
      //{g: gMainWrapper, rect: wrapperBox.mainWrapper, color: "pink"},
      {g: gLabelBesidesBar, rect: wrapperBox.mainWrapper.main.labelBesideBar, color: "cyan"},
      {g: gChart, rect: wrapperBox.mainWrapper.main.chart, color: "pink"},
      {g: gSubtitle, rect: wrapperBox.subtitle, color: "green"},
      {g: gSource, rect: wrapperBox.source, color: "yellow"},
      {g: gLinkbox, rect: wrapperBox.linkbox, color: "orange"},
      {g: gSocial, rect: wrapperBox.social, color: "red"},

      {g: gSocial, rect: wrapperBox.social, color: "red"}
    ]
    rectangles.forEach(o => o.g.append("rect").attr({
      width: Math.floor(o.rect.w),
      height: Math.floor(o.rect.h),
      fill: o.color
    }))
  }
}


module.exports = drawWidgetBarHorizontal
