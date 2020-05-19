'use strict'

import { isNull, isUndefined } from 'lodash'
import * as d3 from 'd3'
export function isMobileDevice () {
  return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
};

function formatDataNumberNorwegian (number, forceFullFormat) {
  if (isNull(number) || isUndefined(number)) return '-'
  const num = parseFloat(number)
  return formatDataNumberEnglishNorwegian(num, 't', 'm', '.', forceFullFormat)
}

function formatDataNumberEnglish (number, forceFullFormat) {
  if (isNull(number) || isUndefined(number)) return 'N/A'
  const num = parseFloat(number)
  return formatDataNumberEnglishNorwegian(num, 'k', 'm', ',', forceFullFormat)
}

function formatDataNumberEnglishNorwegian (number, charThousand, charMillion, thousandsSeperator, forceFullFormat) {
  if (number < 1) return Number.parseFloat(number).toFixed(1)
  if (isMobileDevice() && !forceFullFormat) {
    // Below 1000
    if (number < 1000) return number.toString()
    // Below 1.000.000 (one million)
    else if (number < 1000 * 1000) return (number / 1000).toFixed(1) + charThousand
    // Above 1.000.000
    else return (number / (1000 * 1000)).toFixed(1) + charMillion
  } else {
    return d3.format(',')(number).replace(/,/g, thousandsSeperator)
  }
}

function formatDataPercentageNorwegian (percentageAsDecimal) {
  if (isNull(percentageAsDecimal) || isUndefined(percentageAsDecimal)) return '̶'
  const num = parseFloat(percentageAsDecimal)
  return (num * 100).toFixed(1).replace('.', ',') + ' %'
}

function formatDataPercentageEnglish (percentageAsDecimal) {
  if (isNull(percentageAsDecimal) || isUndefined(percentageAsDecimal)) return 'N/A'
  const num = parseFloat(percentageAsDecimal)
  return (num * 100).toFixed(1) + ' %'
}

export function formatDataNumber (number, locale, forceFullFormat = false) {
  if (locale === 'nb_NO') return formatDataNumberNorwegian(number, forceFullFormat)
  else return formatDataNumberEnglish(number, forceFullFormat)
}

export function formatDataPercentage (percentageAsDecimal, locale) {
  if (locale === 'nb_NO') return formatDataPercentageNorwegian(percentageAsDecimal)
  else return formatDataPercentageEnglish(percentageAsDecimal)
}

function formatAxisNumber (number) {
  const num = parseFloat(number)
  if (isMobileDevice()) {
    // Below 1000
    if (num < 1000) return num.toString()
    // Below 1.000.000 (one million)
    else if (num < 1000 * 1000) return (num / 1000).toFixed(1) + 'K'
    // Above 1.000.000
    else return (num / (1000 * 1000)).toFixed(1) + 'M'
  } else {
    return formatNumber(number)
  }
}

function formatNumber (number) {
  const num = parseFloat(number)
  return d3.format(',')(number).replace(/,/g, ' ')
}

function getTextWidth (text, textStyle) {
  var svg = d3.select('body').append('svg').style('display', 'block')
  svg.attr({
    width: '1000',
    height: '1000'
  })

  var text = svg.append('text').style('font', textStyle).text(text)

  var bbox = text.node().getBBox()

  svg.remove()

  return bbox.width
};

function getTextHeight (text, textStyle) {
  var svg = d3.select('body').append('svg').style('display', 'block')
  svg.attr({
    width: '1000',
    height: '1000'
  })

  var text = svg.append('text').style('font', textStyle).text(text)

  var bbox = text.node().getBBox()

  svg.remove()

  return bbox.height
};

/**
 * Function that takes the arguments {availableWidth, text and textStyle} and returns
 * those lines split into {lines and lineHeight}
 * @param params
 * @returns {{lines: Array, lineHeight: number}}
 */

function splitTextToLines (params) {
  function getTextBox (text, textStyle) {
    var svg = d3.select('body').append('svg').attr('width', avbWidth)

    var text = svg.append('text').style('font', textStyle).text(text)

    var bbox = text.node().getBBox()

    svg.remove()

    return bbox
  }

  var avbWidth = params.availableWidth
  var text = params.text
  var textStyle = params.textStyle

  var words = text.split(' ')

  var lines = []
  var lineIndex = 0
  var lineHeight = 0

  for (var i = 0; i < words.length; i++) {
    if (!lines[lineIndex]) lines[lineIndex] = ''
    var lineToTest = lines[lineIndex] + (lines[lineIndex] ? ' ' : '') + words[i]
    var bbox = getTextBox(lineToTest, textStyle)
    if (bbox.width > avbWidth && lineToTest.split(' ').length > 1) {
      lines[++lineIndex] = words[i]
    } else {
      lines[lineIndex] += (i > 0 ? ' ' : '') + words[i]
    }

    lineHeight = bbox.height
  }

  return { lines: lines, lineHeight: lineHeight }
};

function evaluateMaxSize (params) {
  var currentFontPxSize, lastFontPxSize, currentTotalHeight, lastRes, lastStyle, maxWidth
  currentFontPxSize = lastFontPxSize = currentTotalHeight = maxWidth = 1

  while (currentTotalHeight < params.maxHeight && maxWidth < params.maxWidth) {
    lastFontPxSize = currentFontPxSize
    currentFontPxSize++
    lastStyle = `${currentFontPxSize}px ${params.fontFamily}`
    lastRes = splitTextToLines({
      availableWidth: params.maxWidth,
      text: params.text,
      textStyle: lastStyle
    })

    maxWidth = _(lastRes.lines).map(line => getTextWidth(line, lastStyle)).max()

    currentTotalHeight = lastRes.lines.length * lastRes.lineHeight + params.lineSpacing * (lastRes.lines.length - 1)
  }

  return {
    lines: lastRes.lines,
    linePxSize: lastFontPxSize,
    lineHeight: lastRes.lineHeight,
    lineSpacing: params.lineSpacing,
    style: lastStyle
  }
}

function calculateMaxTextWidthFromArray (array, style) {
  var maxLegendLabelWidth =
      _.chain(array).map(l => getTextWidth(l, style))
        .max()
        .value()

  return maxLegendLabelWidth
}

function repairTextPlacements (parentEl) {
  $(parentEl).find('text.fix-my-tspan-children-position').each((i, v) => {
    var bbox = v.getBBox()
    var tspans = $(v).children('tspan')
    tspans.attr('dy', -bbox.y)
  })
}

function makeIcon (widgetId, wConfig, network, targetElementAttrId) {
  var icon
  var originalWidgetUrlToShare = window.location.href.split('#')[0]
  if (targetElementAttrId) originalWidgetUrlToShare += '#' + targetElementAttrId
  var href = 'https://api.nrcdata.no/api/widgets/' + widgetId + '/render/false?orgWUrl=' + encodeURIComponent(originalWidgetUrlToShare)
  if (network == 'facebook') {
    var url = 'https://www.facebook.com/dialog/share?' +
        'app_id=1769614713251596' +
        '&display=popup' +
        '&href=' + encodeURIComponent(href)
    icon = $(`<a target="_blank" href="${url}"><img src="${FACEBOOK_PNG}" width="32" height="32" style="cursor: pointer;" /></a>`)
  } else if (network == 'linkedin') {
    // https://developer.linkedin.com/docs/share-on-linkedin
    icon = $('<a target="_blank" href="http://www.linkedin.com/shareArticle?' +
        'url=' + href +
        '&mini=true' +
        '&title=' + (wConfig.title
      ? encodeURIComponent(wConfig.title.substr(0, 200))
      : encodeURIComponent(wConfig.subtitle.substr(0, 200))) +
        `"><img src="${LINKEDIN_PNG}" width="32" height="32" /></a>`
    )
  } else if (network == 'twitter') {
    // https://dev.twitter.com/web/tweet-button
    icon = $('<a target="_blank" href="https://twitter.com/intent/tweet?' +
        'text=' + href +
        `"><img src="${TWITTER_PNG}" width="32" height="32" /></a>`
    )
  }
  return icon
}

const FACEBOOK_PNG = 'data:image/png;base64,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'
const TWITTER_PNG = 'data:image/png;base64,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'
const LINKEDIN_PNG = 'data:image/png;base64,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'

export default {
  formatDataNumber,
  formatDataPercentage,
  isMobileDevice,
  formatAxisNumber,
  formatNumber,
  getTextWidth,
  getTextHeight,
  splitTextToLines,
  evaluateMaxSize,
  calculateMaxTextWidthFromArray,
  repairTextPlacements,
  makeIcon
}
