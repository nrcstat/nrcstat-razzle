import React from 'react'
import c from './all-icons-style.module.scss'
import { PeopleIcon } from './PeopleIcon.js'
import { IconBar } from './IconBar'

export const PeopleLittleGirl = IconBar(PeopleLittleGirlIcon)

function PeopleLittleGirlIcon(props) {
  return (
    <PeopleIcon {...props}>
      {(fillColor, iconBaseColor, fillMaskId, baseMaskId) => (
        <>
          {[
            [fillColor, fillMaskId],
            [iconBaseColor, baseMaskId],
          ].map(([color, maskId], index) => (
            <g
              transform="matrix(1.3333333,0,0,-1.3333333,0,133.33333)"
              mask={`url(#${maskId})`}
              key={index}
            >
              <g>
                <g clipPath="url(#clipPath18)">
                  <g transform="translate(48.8394,94.5903)">
                    <path
                      fill={color}
                      className={c['path-thingy']}
                      d="m 0,0 c 5.762,0 10.433,-4.671 10.433,-10.433 0,-5.762 -4.671,-10.433 -10.433,-10.433 -5.762,0 -10.433,4.671 -10.433,10.433 C -10.433,-4.671 -5.762,0 0,0"
                    />
                  </g>
                  <g transform="translate(28.5669,38.0518)">
                    <path
                      fill={color}
                      className={c['path-thingy']}
                      d="m 0,0 c 0.125,-0.015 0.25,-0.021 0.375,-0.021 1.633,0 3.044,1.228 3.234,2.89 0.955,8.364 2.835,13.797 4.732,17.316 C 6.842,11.42 5.112,-0.424 5.112,-8.366 c 0,-0.698 2.11,-1.212 5.216,-1.542 v -21.368 c 0,-2.341 1.897,-4.24 4.239,-4.24 2.341,0 4.238,1.899 4.238,4.24 v 20.933 c 0.976,-0.011 1.959,-0.011 2.934,0 v -20.933 c 0,-2.341 1.897,-4.24 4.239,-4.24 2.341,0 4.238,1.899 4.238,4.24 v 21.368 c 3.106,0.33 5.217,0.844 5.217,1.542 0,7.945 -1.732,19.795 -3.231,28.56 1.895,-3.517 3.777,-8.964 4.731,-17.324 0.19,-1.663 1.6,-2.891 3.235,-2.891 0.124,0 0.248,0.007 0.374,0.021 1.789,0.204 3.073,1.82 2.87,3.608 -1.434,12.583 -4.929,19.884 -8.408,24.101 -3.122,3.803 -6.18,4.956 -7.17,5.226 -1.477,0.491 -3.841,0.952 -7.563,0.952 -3.716,0 -6.079,-0.46 -7.558,-0.95 C 11.732,32.67 8.666,31.523 5.535,27.709 2.058,23.491 -1.438,16.19 -2.871,3.609 -3.074,1.82 -1.789,0.204 0,0"
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
