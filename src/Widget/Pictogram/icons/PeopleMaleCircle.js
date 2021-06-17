import React from "react";
import "./all-icons-style.scss";
import { Icon } from "./Icon.js";
import { IconBar } from "./IconBar"

export const PeopleMaleCircle = IconBar(PeopleMaleCircleIcon);

function PeopleMaleCircleIcon(props) {
  return (
    <Icon {...props}>
      {/* <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      > */}
      <g id="children_circle">
        {/* <circle
          id="Base"
          fill="#FF7602"
          fill-rule="nonzero"
          cx="34.5"
          cy="34.5"
          r="34.5"
        ></circle> */}
        <g transform="translate(60 60) scale(14)">
          <g id="male" transform="translate(7.000000, 6.000000)">
                <g id="g10" transform="translate(28.000000, 28.000000) scale(-1, 1) rotate(-180.000000) translate(-28.000000, -28.000000) translate(0.000000, -0.000000)">
                    <g id="g12">
                        <g id="g14-Clipped">
                            <g>
                                <g id="path-1"></g>
                                <g id="g14">
                                    <g transform="translate(16.000000, 1.000000)" id="Group">
                                        <g transform="translate(0.716417, 0.671642)">
                                            <g id="g20" transform="translate(5.707654, 43.212942)" fill="#FFFFFF" fill-rule="nonzero">
                                                <path d="M4.45771133,8.49751221 C6.77906451,8.49751221 8.66133312,6.61580082 8.66133312,4.29389043 C8.66133312,1.97253725 6.77906451,0.0908258579 4.45771133,0.0908258579 C2.13580094,0.0908258579 0.254089546,1.97253725 0.254089546,4.29389043 C0.254089546,6.61580082 2.13580094,8.49751221 4.45771133,8.49751221" id="path22"></path>
                                            </g>
                                            <g id="g24" transform="translate(0.224724, 0.311260)" fill="#FFFFFF" fill-rule="nonzero">
                                                <path d="M15.0447757,41.7910437 L14.1443181,41.7910437 L5.73707448,41.7910437 L4.83605958,41.7910437 C2.35924372,41.7910437 0.332656708,39.7644567 0.332656708,37.2870836 L0.332656708,36.9873026 L0.332656708,36.386626 L0.332656708,23.7763178 C0.332656708,22.8636014 1.07207958,22.1247358 1.98423876,22.1247358 C2.89584072,22.1247358 3.63526359,22.8636014 3.63526359,23.7763178 L3.63526359,36.386626 L4.53627849,36.386626 L4.53627849,2.75820889 C4.53627849,1.43705469 5.61727349,0.356616907 6.93787047,0.356616907 C8.25902467,0.356616907 9.34001967,1.43705469 9.34001967,2.75820889 L9.34001967,21.9748452 L10.5408157,21.9748452 L10.5408157,2.75820889 C10.5408157,1.43705469 11.6218107,0.356616907 12.9435221,0.356616907 C14.264119,0.356616907 15.345114,1.43705469 15.345114,2.75820889 L15.345114,36.386626 L16.2455717,36.386626 L16.2455717,23.7763178 C16.2455717,22.8636014 16.9849946,22.1247358 17.8971538,22.1247358 C18.809313,22.1247358 19.5487358,22.8636014 19.5487358,23.7763178 L19.5487358,36.386626 L19.5487358,36.9873026 L19.5487358,37.2870836 C19.5487358,39.7644567 17.5215916,41.7910437 15.0447757,41.7910437" id="path26"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
      </g>
      {/* </g> */}
    </Icon>
  );
}