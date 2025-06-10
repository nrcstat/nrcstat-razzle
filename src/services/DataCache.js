import nodeFetch from 'node-fetch'
import { countryCodeToContinentCodeMap } from '../config'

const GORS_API_URL =
  'https://xixk4r4p6g.execute-api.eu-west-1.amazonaws.com/dev/gors'
const DISPLACEMENT_API_URL =
  'https://xixk4r4p6g.execute-api.eu-west-1.amazonaws.com/dev/global-displacement'

class DataCache {
  constructor() {
    this.data = []
  }

  transformGorsData(records) {
    const transformedData = []

    records.forEach((record) => {
      const { countryCode, year, ...dataPoints } = record

      // Convert each data point into a separate entry
      Object.entries(dataPoints).forEach(([dataPoint, value]) => {
        transformedData.push({
          data: value,
          dataPoint,
          countryCode,
          continentCode: countryCodeToContinentCodeMap[countryCode],
          year,
        })
      })
    })

    return transformedData
  }

  transformDisplacementData(records) {
    const transformedData = []

    records.forEach((record) => {
      // Rename CountryCode to countryCode and extract year
      const {
        CountryCode: countryCode,
        RegionCode_NRC: regionCodeNRC,
        year,
        // Exclude these fields from transformation
        CountryName_Norwegian,
        CountryName_English,
        RegionName_Norwegian,
        RegionName_English,
        ...dataPoints
      } = record

      // Convert each remaining data point into a separate entry
      Object.entries(dataPoints).forEach(([dataPoint, value]) => {
        transformedData.push({
          data: value,
          dataPoint,
          countryCode,
          regionCodeNRC,
          continentCode: countryCodeToContinentCodeMap[countryCode],
          year,
        })
      })
    })

    return transformedData
  }

  async initialize() {
    try {
      // Fetch data from both APIs in parallel
      const [gorsResponse, displacementResponse] = await Promise.all([
        nodeFetch(GORS_API_URL),
        nodeFetch(DISPLACEMENT_API_URL, {
          headers: { Bypass: 'vS!i@Z#No7Fa$SJ!GXN2' },
        }),
      ])

      const [gorsData, displacementData] = await Promise.all([
        gorsResponse.json(),
        displacementResponse.json(),
      ])

      if (!gorsData?.result?.records || !displacementData?.result?.records) {
        throw new Error('Invalid data format received from APIs')
      }

      // Transform and combine data from both sources
      const transformedGorsData = this.transformGorsData(
        gorsData.result.records,
      )
      const transformedDisplacementData = this.transformDisplacementData(
        displacementData.result.records,
      )
      this.data = [...transformedGorsData, ...transformedDisplacementData]

      console.log(`DataCache initialized with ${this.data.length} records`)
    } catch (error) {
      console.error('Failed to initialize DataCache:', error)
      throw error
    }
  }

  query(filter) {
    let results = [...this.data]

    if (filter?.where) {
      const where = filter.where

      // Handle year filter
      if (where.year) {
        if (typeof where.year === 'number') {
          results = results.filter((d) => d.year === where.year)
        } else if (where.year.inq) {
          results = results.filter((d) => where.year.inq.includes(d.year))
        }
      }

      // Handle dataPoint filter
      if (where.dataPoint) {
        if (typeof where.dataPoint === 'string') {
          results = results.filter((d) => d.dataPoint === where.dataPoint)
        } else if (where.dataPoint.inq) {
          results = results.filter((d) =>
            where.dataPoint.inq.includes(d.dataPoint),
          )
        }
      }

      // Handle countryCode filter
      if (where.countryCode) {
        if (typeof where.countryCode === 'string') {
          results = results.filter((d) => d.countryCode === where.countryCode)
        } else if (where.countryCode.inq) {
          results = results.filter((d) =>
            where.countryCode.inq.includes(d.countryCode),
          )
        }
      }

      // Handle continentCode and regionCodeNRC filter with nin (not in) operator
      if (where.continentCode?.nin) {
        results = results.filter(
          (d) => !where.continentCode.nin.includes(d.continentCode),
        )
      }
      if (where.regionCodeNRC?.nin) {
        results = results.filter(
          (d) => !where.regionCodeNRC.nin.includes(d.regionCodeNRC),
        )
      }

      // Handle regionCodeNRC filter
      if (where.regionCodeNRC) {
        if (typeof where.regionCodeNRC === 'string') {
          results = results.filter(
            (d) => d.regionCodeNRC === where.regionCodeNRC,
          )
        } else if (where.regionCodeNRC.inq) {
          results = results.filter((d) =>
            where.regionCodeNRC.inq.includes(d.regionCodeNRC),
          )
        }
      }
    }

    // Handle ordering
    if (filter?.order) {
      const [field, direction] = filter.order.split(' ')
      results.sort((a, b) => {
        const multiplier = direction?.toUpperCase() === 'DESC' ? -1 : 1
        return ((a[field] || 0) - (b[field] || 0)) * multiplier
      })
    }

    // Handle limit
    if (filter?.limit) {
      results = results.slice(0, filter.limit)
    }

    return results
  }
}

// Export a singleton instance
export const dataCache = new DataCache()
