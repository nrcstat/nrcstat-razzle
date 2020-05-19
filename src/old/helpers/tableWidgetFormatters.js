
import { round } from 'lodash'

function thousandsFormatter(num){

  if (typeof num == "string" && num.indexOf("<strong>") !== -1) return num;
  if (typeof num == "string") num = parseFloat(num)
  if (num == 0 || !num) return "-"
  return d3.format(",")(num).replace(/,/g, " ");
}

function thousandsFormatterWithPrecision(precision){
  return function(num){
    if (typeof num == "string" && num.indexOf("<strong>") !== -1) return num;
    num = round(num, precision)
    return thousandsFormatter(num)
  }
}

function percentFormatter(num){
  if (typeof num == "string") num = parseFloat(num)
  if (num == 0 || !num) return "-"
  return Math.round(num * 100) + "%"
}

function percentFormatterWithPrecision(precision){
  return function(num){
    if (typeof num == "string") num = parseFloat(num)
    if (num == 0 || !num) return "-"
    return round(num * 100, precision) + "%"
  }
}

function populationNumberFormatter(num){
  if (typeof num == "string" && num.indexOf("<strong>") !== -1) return num;
  if (typeof num == "string") num = parseFloat(num)
  if (typeof num == "number")
    return num.toFixed(1)
  else
    return num
}

module.exports = {
  thousandsFormatter,
  thousandsFormatterWithPrecision,
  percentFormatter,
  populationNumberFormatter,
  percentFormatterWithPrecision,
}
