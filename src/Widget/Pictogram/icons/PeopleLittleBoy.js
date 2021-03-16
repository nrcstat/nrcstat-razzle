import React from 'react'
import './all-icons-style.scss'
import { PeopleIcon } from './PeopleIcon.js'
import { IconBar } from './IconBar'

export const PeopleLittleBoy = IconBar(PeopleLittleBoyIcon)

function PeopleLittleBoyIcon (props) {
  return (
    <PeopleIcon {...props}>
      {(fillColor, iconBaseColor, fillMaskId, baseMaskId) => (
        <>
          {[
            [fillColor, fillMaskId],
            [iconBaseColor, baseMaskId]
          ].map(([color, maskId], index) => (
            <g
              transform='matrix(1.3333333,0,0,-1.3333333,0,133.33333)'
              mask={`url(#${maskId})`}
              key={index}
            >
              <g>
                <g clipPath='url(#clipPath18)'>
                  <g transform='translate(49.9995,98.416)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c 6.302,0 11.412,-5.109 11.412,-11.411 0,-6.302 -5.11,-11.411 -11.412,-11.411 -6.302,0 -11.411,5.109 -11.411,11.411 C -11.411,-5.109 -6.302,0 0,0'
                    />
                  </g>
                  <g transform='translate(30.6553,37.3223)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c 0.057,-0.003 0.113,-0.004 0.168,-0.004 1.726,0 3.165,1.354 3.253,3.095 0.603,12.077 2.693,18.698 4.512,22.13 V -0.526 -30.521 c 0,-2.881 2.336,-5.217 5.217,-5.217 2.881,0 5.216,2.336 5.216,5.217 v 26.734 h 1.956 v -26.734 c 0,-2.881 2.336,-5.217 5.217,-5.217 2.881,0 5.217,2.336 5.217,5.217 V -0.526 25.21 c 0.063,-0.12 0.127,-0.235 0.191,-0.362 1.776,-3.522 3.738,-10.106 4.323,-21.757 0.086,-1.741 1.527,-3.095 3.251,-3.095 0.055,0 0.112,0.001 0.168,0.004 1.799,0.09 3.183,1.622 3.092,3.42 -0.717,13.983 -3.27,21.703 -6.029,26.191 -2.729,4.497 -5.903,5.563 -6.729,5.662 -0.329,0.057 -0.651,0.047 -0.965,0.007 -0.184,0.032 -0.37,0.056 -0.563,0.056 H 11.193 c -0.194,0 -0.381,-0.024 -0.566,-0.056 -0.313,0.039 -0.634,0.049 -0.961,-0.008 v 0.001 C 8.841,35.174 5.666,34.107 2.938,29.611 0.179,25.123 -2.375,17.405 -3.091,3.421 -3.183,1.622 -1.798,0.092 0,0'
                    />
                  </g>
                </g>
              </g>
            </g>
          ))}
        </>
      )}
    </PeopleIcon>
  )
}
