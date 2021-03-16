import React from 'react'
import './all-icons-style.scss'
import { PeopleIcon } from './PeopleIcon.js'
import { IconBar } from './IconBar'

export const PeopleFemale = IconBar(PeopleFemaleIcon)

function PeopleFemaleIcon (props) {
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
                  <g transform='translate(49.0801,95.8018)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c 4.166,0 7.544,-3.377 7.544,-7.544 0,-4.166 -3.378,-7.543 -7.544,-7.543 -4.167,0 -7.544,3.377 -7.544,7.543 C -7.544,-3.377 -4.167,0 0,0'
                    />
                  </g>
                  <g transform='translate(69.9092,48.5371)' id='g24'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 -6.372,23.97 c -0.947,3.563 -4.185,6.051 -7.871,6.051 h -6.587 -6.586 c -3.688,0 -6.924,-2.488 -7.871,-6.051 L -41.659,0 c -0.383,-1.438 0.474,-2.914 1.912,-3.296 0.231,-0.062 0.464,-0.092 0.693,-0.092 1.192,0 2.282,0.798 2.602,2.003 l 5.771,21.707 h 1.523 l -9.453,-35.563 h 9.16 v -25.326 c 0,-2.075 1.698,-3.772 3.772,-3.772 2.075,0 3.772,1.697 3.772,3.772 v 25.326 h 2.156 v -25.326 c 0,-2.075 1.696,-3.772 3.772,-3.772 2.074,0 3.771,1.697 3.771,3.772 v 25.326 h 9.16 l -9.453,35.563 h 1.522 l 5.771,-21.707 c 0.321,-1.206 1.41,-2.003 2.603,-2.003 0.228,0 0.461,0.03 0.693,0.091 C -0.474,-2.914 0.383,-1.438 0,0'
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
