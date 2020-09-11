
import { ENABLED_LOCALES } from '../config'

export const thousandsFormatter = locale => num => {
  if (typeof num === 'string' && num.indexOf('<strong>') !== -1) return num
  if (!locale || !ENABLED_LOCALES.includes(locale)) throw new Error('No enabled locale provided1')
  if (typeof num === 'string') num = parseFloat(num)
  return new Intl.NumberFormat(locale, { style: 'decimal' }).format(num)
}

export const thousandsFormatterWithPrecision = locale => precision => num => {
  if (typeof num === 'string' && num.indexOf('<strong>') !== -1) return num
  if (!locale || !ENABLED_LOCALES.includes(locale)) throw new Error('No enabled locale provided2')
  if (typeof num === 'string') num = parseFloat(num)
  return new Intl.NumberFormat(locale, { style: 'decimal', maximumFractionDigits: precision }).format(num)
}

export const percentFormatter = locale => num => {
  if (typeof num === 'string') num = parseFloat(num)
  if (!locale || !ENABLED_LOCALES.includes(locale)) throw new Error('No enabled locale provided3')
  if (num == 0 || !num) return '-'
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(num)
}

export const percentFormatterWithPrecision = locale => precision => num => {
  if (typeof num === 'string') num = parseFloat(num)
  if (!locale || !ENABLED_LOCALES.includes(locale)) throw new Error('No enabled locale provided4')
  if (num == 0 || !num) return '-'
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: precision }).format(num)
}
