
import { round } from 'lodash'
import { format } from 'd3'

export function thousandsFormatter (num) {
  if (typeof num === 'string' && num.indexOf('<strong>') !== -1) return num
  if (typeof num === 'string') num = parseFloat(num)
  if (num == 0 || !num) return '-'
  return format(',')(num).replace(/,/g, ' ')
}

export function thousandsFormatterWithPrecision (precision) {
  return function (num) {
    if (typeof num === 'string' && num.indexOf('<strong>') !== -1) return num
    num = round(num, precision)
    return thousandsFormatter(num)
  }
}

export function percentFormatter (num) {
  if (typeof num === 'string') num = parseFloat(num)
  if (num == 0 || !num) return '-'
  return Math.round(num * 100) + '%'
}

export function percentFormatterWithPrecision (precision) {
  return function (num) {
    if (typeof num === 'string') num = parseFloat(num)
    if (num == 0 || !num) return '-'
    return round(num * 100, precision) + '%'
  }
}

export function populationNumberFormatter (num) {
  if (typeof num === 'string' && num.indexOf('<strong>') !== -1) return num
  if (typeof num === 'string') num = parseFloat(num)
  if (typeof num === 'number') { return num.toFixed(1) } else { return num }
}
