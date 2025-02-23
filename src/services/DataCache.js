import nodeFetch from 'node-fetch'

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
        year,
        // Exclude these fields from transformation
        CountryName_Norwegian,
        CountryName_English,
        RegionName_Norwegian,
        RegionName_English,
        RegionCode_NRC,
        ...dataPoints
      } = record

      // Convert each remaining data point into a separate entry
      Object.entries(dataPoints).forEach(([dataPoint, value]) => {
        transformedData.push({
          data: value,
          dataPoint,
          countryCode,
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
        nodeFetch(DISPLACEMENT_API_URL),
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
    // For now, just return all data
    // We'll implement filtering later
    return this.data
  }
}

// Export a singleton instance
export const dataCache = new DataCache()
