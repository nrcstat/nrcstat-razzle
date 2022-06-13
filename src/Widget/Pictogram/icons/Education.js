import React from 'react'
import c from './all-icons-style.module.scss'
import { Icon } from './Icon.js'
import { IconBar } from './IconBar'

export const Education = IconBar(EducationIcon)

export function EducationIcon(props) {
  return (
    <Icon {...props}>
      <g>
        <g>
          <path
            className={c['st0']}
            d="M767.2,259.8h-54.4v108.7L672,354.9l-40.8,13.6V259.8H318.6v570.9h448.5c7.5,0,13.6-5.8,13.6-12.9v-545
			C780.7,265.6,774.6,259.8,767.2,259.8z M400.2,783.1c0,3.8-3,6.8-6.8,6.8h-27.2c-3.8,0-6.8-3-6.8-6.8V307.4c0-3.8,3-6.8,6.8-6.8
			h27.2c3.8,0,6.8,3,6.8,6.8V783.1z M665.2,572.4H488.5c-11.3,0-20.4-9.1-20.4-20.4s9.1-20.4,20.4-20.4h176.7
			c11.3,0,20.4,9.1,20.4,20.4S676.5,572.4,665.2,572.4z M665.2,490.9H488.5c-11.3,0-20.4-9.1-20.4-20.4c0-11.3,9.1-20.4,20.4-20.4
			h176.7c11.3,0,20.4,9.1,20.4,20.4C685.6,481.7,676.5,490.9,665.2,490.9z"
          />
        </g>
      </g>
    </Icon>
  )
}
