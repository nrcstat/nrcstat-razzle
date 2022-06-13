import React from 'react'
import c from './all-icons-style.module.scss'
import { Icon } from './Icon.js'
import { IconBar } from './IconBar'

export const WASH = IconBar(WASHIcon)

export function WASHIcon(props) {
  return (
    <Icon {...props}>
      <g>
        <g>
          <g>
            <path
              className={c['st0']}
              d="M306.3,644.3c-16.4,22.4-75,105-75,142.8c0,44,35.5,79.5,79.2,79.5c43.7,0,79.2-35.6,79.2-79.5
				c0-37.8-58.6-120.4-75-142.8C312.7,641.4,308.4,641.4,306.3,644.3z"
            />
            <path
              className={c['st0']}
              d="M838.7,246h-39.6c-14.6,0-26.4,11.8-26.4,26.4v66H614.3v-66h59.4c10.9,0,19.8-8.9,19.8-19.8
				c0-10.9-8.9-19.8-19.8-19.8H488.8c-10.9,0-19.8,8.9-19.8,19.8c0,10.9,8.9,19.8,19.8,19.8h59.4v66h-134
				c-86.3,0-156.5,70.2-156.5,156.5v28.4h-13.2c-7.3,0-13.2,5.9-13.2,13.2v39.6c0,7.3,5.9,13.2,13.2,13.2h132
				c7.3,0,13.2-5.9,13.2-13.2v-39.6c0-7.3-5.9-13.2-13.2-13.2h-13.2v-28.4c0-28.1,22.8-50.9,50.9-50.9h358.5v66
				c0,14.6,11.8,26.4,26.4,26.4h39.6c14.6,0,26.4-11.8,26.4-26.4V272.4C865.2,257.8,853.3,246,838.7,246z"
            />
          </g>
        </g>
      </g>
    </Icon>
  )
}
