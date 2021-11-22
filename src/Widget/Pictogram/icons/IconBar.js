import React, { useMemo, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isMobileDevice } from '@/util/widgetHelpers.js'

import c from '../Pictogram.module.scss'

export const IconBar =
  (Icon) =>
  ({ data, iconBaseColor, fillColor }) => {
    const ICON_COUNT = isMobileDevice() ? 5 : 10
    // eslint-disable-next-line
    const iconFillDegrees = useMemo(
      () =>
        Array(ICON_COUNT)
          .fill()
          .map((_, key) => {
            const rangeLowerEnd = key * (1 / ICON_COUNT)
            const rangeUpperEnd = (key + 1) * (1 / ICON_COUNT)
            if (data <= rangeLowerEnd) return 0
            if (data >= rangeUpperEnd) return 1

            // return data normalized to the range. See for more about how to do this:
            // https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
            return (data - rangeLowerEnd) / (rangeUpperEnd - rangeLowerEnd)
          }),
      [data]
    )

    return (
      <div className={c['icon-bar']}>
        {iconFillDegrees.map((fillDegree, key) => (
          <Icon
            horizontalFill={fillDegree}
            key={key}
            iconBaseColor={iconBaseColor}
            fillColor={fillColor}
          />
        ))}
      </div>
    )
  }
