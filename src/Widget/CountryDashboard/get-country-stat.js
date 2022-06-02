export function getCountryStat(rawData, countryCode, dataPoint, year) {
  const stats = rawData.filter(
    (c) => c.countryCode === countryCode && c.year === year
  )
  if (!stats) return null
  const data = stats.filter((d) => d.dataPoint === dataPoint)
  if (data && data.length > 0) return data[0]
  return null
}
