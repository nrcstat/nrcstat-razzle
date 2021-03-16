import React from 'react'
import './all-icons-style.scss'
import { PeopleIcon } from './PeopleIcon.js'
import { IconBar } from './IconBar'

export const PeopleSchoolBoy = IconBar(PeopleSchoolBoyIcon)

function PeopleSchoolBoyIcon (props) {
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
                  <g transform='translate(30.0532,64.9639)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c 2.29,5.813 5.228,8.505 7.334,9.734 0.77,0.457 1.572,0.801 2.382,1.019 0.308,0.101 0.625,0.165 0.942,0.194 0.162,0.022 0.306,0.035 0.407,0.041 0.076,0.003 0.156,0.005 0.235,0.005 0.166,0 0.329,-0.01 0.49,-0.027 H 28.1 c 0.165,0.017 0.332,0.027 0.501,0.027 0.075,0 0.152,-10e-4 0.229,-0.005 0.098,-0.006 0.243,-0.019 0.405,-0.041 0.323,-0.029 0.642,-0.094 0.948,-0.195 0.804,-0.216 1.605,-0.561 2.381,-1.019 C 33.935,8.931 35.966,7.316 37.844,4.2 38.6,2.94 39.283,1.542 39.895,0.001 39.608,8.989 35.792,14.574 30.269,17.238 28.086,13.84 24.278,11.583 19.948,11.583 15.619,11.583 11.81,13.84 9.627,17.237 4.102,14.574 0.288,8.989 0,0'
                    />
                  </g>
                  <g transform='translate(36.7925,33.4414)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 v 19.222 l -0.507,0.243 c -0.665,-4.133 -1.124,-9.5 -1.118,-16.444 0,-0.408 10e-4,-0.813 0.006,-1.219 C -1.616,1.475 -1.649,1.156 -1.712,0.848 -1.173,0.544 -0.601,0.262 0,0'
                    />
                  </g>
                  <g transform='translate(63.7168,52.9063)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 -0.507,-0.243 v -19.222 c 0.601,0.261 1.172,0.543 1.71,0.847 -0.06,0.303 -0.094,0.614 -0.092,0.931 0.002,0.444 0.005,0.849 0.005,1.243 C 1.119,-9.492 0.662,-4.127 0,0'
                    />
                  </g>
                  <g transform='translate(62.1396,5.5303)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='M 0,0 V 36.547 H -24.277 V 0 c 0,-3.054 2.476,-5.53 5.53,-5.53 3.053,0 5.53,2.476 5.53,5.53 v 24.847 h 2.157 V 0 c 0,-3.054 2.477,-5.53 5.531,-5.53 C -2.477,-5.53 0,-3.054 0,0'
                    />
                  </g>
                  <g transform='translate(27.1406,36.4609)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='M 0,0 C 0,-0.422 0.001,-0.854 0.005,-1.299 0.023,-3.21 1.579,-4.744 3.485,-4.744 H 3.518 C 5.44,-4.726 6.981,-3.153 6.963,-1.232 6.958,-0.82 6.958,-0.409 6.958,0 c -0.013,13.803 1.805,21.77 3.667,26.158 0.115,0.632 0.226,1.268 0.329,1.903 0.627,3.795 1.049,7.597 1.161,9.897 C 11.709,37.8 11.266,37.597 10.789,37.314 8.458,35.953 5.691,33.023 3.617,27.35 1.528,21.656 0.004,13.148 0,0'
                    />
                  </g>
                  <g transform='translate(66.9805,68.6128)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c -1.594,2.646 -3.366,4.261 -4.907,5.163 -0.479,0.282 -0.921,0.486 -1.327,0.643 0.111,-2.299 0.534,-6.1 1.162,-9.896 0.103,-0.639 0.215,-1.28 0.331,-1.916 1.866,-4.384 3.671,-12.36 3.663,-26.145 0,-0.405 -0.002,-0.821 -0.004,-1.249 -0.011,-1.921 1.539,-3.487 3.461,-3.496 h 0.018 c 1.914,0 3.468,1.546 3.478,3.462 0.001,0.428 0.003,0.855 0.003,1.283 C 5.863,-14.63 3.188,-5.317 0,0'
                    />
                  </g>
                  <g transform='translate(41.9497,74.8608)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c -0.074,-2.454 -0.525,-6.562 -1.215,-10.772 -0.735,-4.413 -1.686,-8.81 -2.872,-11.512 v -8.208 H 20.19 v 8.21 c -1.185,2.701 -2.137,7.097 -2.872,11.509 C 16.627,-6.562 16.177,-2.455 16.103,0 Z'
                    />
                  </g>
                  <g transform='translate(50.001,100)'>
                    <path
                      fill={color}
                      className='path-thingy'
                      d='m 0,0 c 6.181,0 11.191,-5.01 11.191,-11.191 0,-6.181 -5.01,-11.191 -11.191,-11.191 -6.181,0 -11.191,5.01 -11.191,11.191 C -11.191,-5.01 -6.181,0 0,0'
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
