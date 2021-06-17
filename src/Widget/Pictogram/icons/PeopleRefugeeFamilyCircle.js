import React from "react";
import "./all-icons-style.scss";
import { Icon } from "./Icon.js";
import { IconBar } from "./IconBar"

export const PeopleRefugeeFamilyCircle = IconBar(PeopleRefugeeFamilyCircleIcon);

function PeopleRefugeeFamilyCircleIcon(props) {
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
          <g transform="translate(12.000000, 13.000000)" id="g10">
                <g transform="translate(21.000000, 21.724377) scale(-1, 1) rotate(-180.000000) translate(-21.000000, -21.724377) translate(0.000000, 0.724377)">
                    <g id="g12">
                        <g id="g14-Clipped">
                            <g id="path16"></g>
                            <g id="g14">
                                <g transform="translate(0.835821, -0.417910)">
                                    <g id="g20" transform="translate(0.115301, 17.056388)">
                                        <path d="M8.77611918,4.59701481 L8.72095501,4.59617899 C7.75474607,4.59617899 6.97450729,5.35301479 6.94525356,6.31880581 L6.70829834,14.0188056 C6.69408938,14.4910444 6.87295505,14.9582683 7.1993431,15.300119 C7.35982071,15.4651936 7.70626846,15.7861489 8.25331323,16.1066862 C8.83128336,16.4443578 9.76782065,16.8476414 10.9492535,16.8484772 C10.9525967,16.8484772 10.9555221,16.8480593 10.9588654,16.8480593 C10.9985669,16.8509847 11.0378505,16.85391 11.0779699,16.85391 L12.1774922,16.85391 C11.6317012,17.2588652 10.9722385,17.5890145 10.2555221,17.8034025 C8.46770128,18.3383279 6.32716402,18.1515219 4.72364167,16.5906265 C-0.782746249,11.2300893 -2.18274621,1.1772537 5.12734316,0.389492528 C7.927761,0.0873432814 8.96752216,1.38453728 9.34991021,3.38382081 L9.34991021,4.71152227 C9.16811917,4.64340287 8.97546246,4.60328347 8.77611918,4.59701481" id="path22" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g24" transform="translate(9.819892, 0.168125)">
                                        <path d="M9.61194006,11.7014922 C8.02471622,12.1394624 7.18137295,12.6330146 7.11952221,12.6702086 L6.90388042,12.799343 L6.95444759,13.0459101 L9.61194006,26.1064471 L9.61194006,30.9349843 C9.82632811,30.9985067 10.0733132,31.0682977 10.3487162,31.1393425 C10.2250147,31.0553425 10.097552,30.9621485 9.96716393,30.8601783 L9.96716393,27.460059 C10.0996415,27.6543874 10.2300296,27.8307456 10.3579102,27.9916411 L8.01886547,16.4961787 L9.38292514,15.650328 L7.73928339,15.1212534 L7.30256698,12.9752833 C7.30256698,12.9752833 9.9700893,11.37594 15.0025668,11.37594 C16.1572533,11.37594 17.1861488,11.4607758 18.0879995,11.5899102 C18.1816115,14.3326564 18.6571936,16.480716 19.5051338,17.9826861 C20.1115219,19.06591 20.8453726,19.6192234 21.3067457,19.8348652 L20.9765965,21.459701 C20.8783875,21.7413726 20.8169547,22.0393427 20.7952234,22.3490144 L19.6476413,27.9891336 C19.6622682,27.9711635 19.6764771,27.9557008 19.6906861,27.9373127 C20.2611338,27.2076411 20.8863278,26.1515814 21.4634621,24.6425068 C21.9390442,25.2860889 22.6294323,25.7583277 23.4293128,25.9534919 C22.7385069,27.6305665 21.9657905,28.8462679 21.2068651,29.7309843 C20.8871637,30.1045963 20.5712234,30.4125963 20.2669846,30.6721186 C20.9289547,30.3198201 21.5495517,29.8722381 22.1154024,29.3005366 C22.3933129,29.0192829 22.7598203,28.8788649 23.1263278,28.8788649 C23.4878203,28.8788649 23.8488949,29.0155217 24.1259695,29.289253 C24.6842979,29.8413127 24.6893128,30.7419097 24.1368352,31.2998201 C23.2257905,32.2221484 22.201492,32.9133723 21.1358204,33.4177902 L20.1633428,32.1460887 L19.7780294,33.9577305 C19.2836413,34.1190439 18.7871637,34.2435812 18.2915219,34.342626 C17.5221488,33.3555216 16.3290145,32.7428649 15.006328,32.7428649 C14.6882981,32.7428649 14.3685967,32.7800589 14.0559996,32.8523574 C13.1202982,33.0705066 12.3074624,33.5920589 11.7232236,34.3376111 C9.91116393,34.0350439 8.52704456,33.586626 7.95743264,33.3868648 L2.65247755,33.3868648 C2.82005963,32.9225663 2.89444769,32.0391037 2.91032829,31.2045365 C3.06202977,31.1665067 3.20913425,31.1096709 3.34662678,31.0331933 C4.20208945,30.5567754 4.51092526,29.4727157 4.03408945,28.6164172 L0.569194016,22.3970741 C0.429194019,22.145492 0.231940293,21.9373726 -1.48471613e-15,21.7831636 L-1.48471613e-15,13.7973131 L1.68250742,14.287522 L-1.48471613e-15,12.5318803 L-1.48471613e-15,5.92680582 L1.56423877,6.20262671 L1.09032833,5.31414912 L0.675761177,4.60370138 L-1.48471613e-15,4.28525362 L-1.48471613e-15,2.4464477 C-1.48471613e-15,1.23283579 0.983761169,0.249910442 2.19695517,0.249910442 C3.41014917,0.249910442 4.39391034,1.23283579 4.39391034,2.4464477 L4.39391034,18.487104 L5.21761181,18.487104 L5.21761181,2.4464477 C5.21761181,1.23283579 6.20137298,0.249910442 7.41456698,0.249910442 C8.62776098,0.249910442 9.61194006,1.23283579 9.61194006,2.4464477 L9.61194006,11.7014922 Z" id="path26" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g28" transform="translate(10.446549, 33.850745)">
                                        <path d="M4.17910437,8.35820875 C6.38734312,8.35820875 8.17725353,6.56829834 8.17725353,4.36005959 C8.17725353,2.15182084 6.38734312,0.361910439 4.17910437,0.361910439 C1.97086562,0.361910439 0.180955219,2.15182084 0.180955219,4.36005959 C0.180955219,6.56829834 1.97086562,8.35820875 4.17910437,8.35820875" id="path30" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g32" transform="translate(6.933260, 21.602167)">
                                        <path d="M2.08955219,0.417910437 C2.14722383,0.425850736 2.20322383,0.437134317 2.258388,0.451761183 C2.27050741,0.454686556 2.28179099,0.45844775 2.29307457,0.461373123 C2.3382089,0.474328346 2.38208949,0.488955212 2.42471636,0.50608954 C2.43725367,0.511104465 2.44937307,0.515283569 2.46149248,0.520716405 C2.46734322,0.523223868 2.47402979,0.52531342 2.47988054,0.528238793 L2.47988054,0.529910435 C2.75152232,0.65026864 2.98889545,0.855462665 3.14519395,1.13588057 L6.61008939,7.3552237 C6.99205953,8.04101472 6.74591028,8.90650724 6.06011925,9.28889529 C5.37432822,9.67086543 4.50883571,9.42471618 4.12644766,8.73850724 L1.66788056,4.32495512 L1.55504474,4.85194018 L3.81677602,8.91152217 C4.04829841,9.32776096 4.43444765,9.62656692 4.880776,9.75486543 C4.37176108,10.67594 3.73820886,11.5639997 3.49122379,11.9016713 C2.71307456,11.7976116 2.07450741,11.5230445 1.61480593,11.254746 C1.03056714,10.9116415 0.703761176,10.5768953 0.638149238,10.5091938 C0.376119394,10.2346266 0.234029845,9.86394005 0.245731337,9.48447737 L0.482686555,1.78447757 C0.482686555,1.77194025 0.484776107,1.75982085 0.485611928,1.74770145 C0.486865659,1.72346264 0.488537301,1.69922384 0.491044764,1.67540294 C0.493970137,1.65116414 0.49731342,1.62692533 0.501074614,1.60268653 C0.504417898,1.58304474 0.507761181,1.56340295 0.511940286,1.54417907 C0.517373121,1.51659698 0.523641778,1.4894328 0.530746255,1.46268653 C0.53492536,1.44680593 0.539522375,1.43092534 0.5445373,1.41462683 C0.552895509,1.38662683 0.562507449,1.35862683 0.572537299,1.33146265 C0.577970135,1.31599997 0.583820881,1.3013731 0.590089537,1.28632833 C0.600955209,1.25999997 0.612656701,1.23367161 0.625194014,1.20817907 C0.633134313,1.19188057 0.641074611,1.17599997 0.64985073,1.16011937 C0.661970133,1.1371343 0.674925356,1.11456714 0.68829849,1.09199997 C0.699164162,1.07402982 0.710447743,1.05647759 0.722149236,1.03892535 C0.734686549,1.01970147 0.748059683,1.00131341 0.761850727,0.982925349 C0.775641772,0.963701468 0.790268637,0.945313409 0.804895502,0.92692535 C0.818268636,0.910626843 0.832059681,0.894746246 0.846268636,0.87928356 C0.862567143,0.860895501 0.87928356,0.842925352 0.896835798,0.825373114 C0.911880574,0.809910428 0.928179081,0.795283562 0.944059678,0.780656697 C0.961194006,0.765194011 0.977910423,0.749731325 0.996298483,0.734686549 C1.01594027,0.718388042 1.03599997,0.703343266 1.05647759,0.68788058 C1.07235818,0.676179088 1.08782087,0.664895506 1.10370146,0.653611924 C1.13044773,0.635641775 1.15802982,0.618925358 1.18561191,0.602626851 C1.19480594,0.597194015 1.20274624,0.591343269 1.21194027,0.585910433 C1.21444773,0.584656702 1.21695519,0.583820881 1.21946266,0.58256715 C1.26961191,0.554985061 1.3214328,0.529910435 1.37534325,0.508179092 C1.38202982,0.505671629 1.38871638,0.503999987 1.39540295,0.501074614 C1.43928355,0.484358197 1.48399996,0.469731332 1.52997011,0.457194018 C1.54585071,0.452597004 1.56214921,0.44883581 1.57802981,0.445074616 C1.61564175,0.436298497 1.6536716,0.429194019 1.69211936,0.423343273 C1.70925369,0.42083581 1.72597011,0.417910437 1.74310443,0.415820885 C1.79074622,0.410388049 1.83880592,0.407462676 1.88770145,0.406626856 C1.89271637,0.406626856 1.8977313,0.405791035 1.90274622,0.405791035 C1.90358204,0.405791035 1.90525368,0.406208945 1.9060895,0.406208945 C1.91988055,0.406208945 1.93325368,0.406208945 1.94746264,0.406626856 C1.99259697,0.407880587 2.03689547,0.412059691 2.08077607,0.417492527 C2.08370144,0.417492527 2.08662681,0.417492527 2.08955219,0.417910437" id="path34" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g36" transform="translate(20.972250, 0.237122)">
                                        <path d="M0,11.2835818 L0,10.2045371 L0,1.98799995 C0,1.00632833 0.795701473,0.211044771 1.77695518,0.211044771 C2.75820889,0.211044771 3.55391036,1.00632833 3.55391036,1.98799995 L3.55391036,9.88817886 L3.55391036,10.9546863 C2.18901487,10.9714027 1.00298505,11.1017908 0,11.2835818" id="path38" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g40" transform="translate(25.073414, 0.372191)">
                                        <path d="M2.92537306,5.85074612 L1.62232832,5.96901478 L3.59904469,7.14459684 L3.59904469,7.2871043 L3.59904469,8.40877591 C3.15062679,8.61313411 2.83761187,9.05779082 2.82465665,9.58644752 C2.81838799,9.85349229 2.81588053,10.1096714 2.81588053,10.358746 C2.81588053,10.5844176 2.81922381,10.8054923 2.82382082,11.0244773 C2.00053726,10.9091341 1.073194,10.8322385 0.0451343272,10.8197012 L0.0451343272,9.75319379 L0.0451343272,1.85301488 C0.0451343272,0.871343262 0.840417889,0.0760596996 1.82208951,0.0760596996 C2.8029253,0.0760596996 3.59904469,0.871343262 3.59904469,1.85301488 L3.59904469,4.70608943 L3.57689543,4.66597003 L2.92537306,5.85074612 Z" id="path42" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g44" transform="translate(20.684519, 32.937778)">
                                        <path d="M0.417910437,5.01492525 C0.896417888,7.06937296 2.95002978,8.34734307 5.00447749,7.86883562 C7.05850729,7.39032817 8.33605949,5.33713419 7.85796995,3.28226857 C7.37904459,1.22782086 5.32585061,-0.049731342 3.2714029,0.428776109 C1.21695519,0.906865649 -0.0605970134,2.96047754 0.417910437,5.01492525" id="path46" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g48" transform="translate(30.185462, 11.939409)">
                                        <path d="M0.5,0.5 L0.5,0.5275 C0.4995,0.5185 0.499,0.509 0.4985,0.4995 C0.499,0.5 0.4995,0.5 0.5,0.5" id="path50" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g52" transform="translate(28.000835, 0.238752)">
                                        <path d="M1.25373131,8.77611918 C1.79325369,8.78907441 2.22035815,9.23791022 2.20656711,9.77743259 C2.20071636,10.0214923 2.19779099,10.2597012 2.19779099,10.4920594 C2.19737308,13.1754624 2.55677606,14.8880593 2.95755216,15.9554026 L2.95755216,11.6956415 L3.64041782,11.8774325 L4.35128347,12.5882982 L4.35128347,11.4632833 L2.95755216,10.475343 L2.95755216,1.63988056 C2.95755216,0.855044755 3.59444767,0.218149248 4.37928347,0.218149248 C5.16411927,0.218149248 5.80101478,0.855044755 5.80101478,1.63988056 L5.80101478,7.65068638 L6.3342685,7.65068638 L6.3342685,1.63988056 C6.3342685,0.855044755 6.971164,0.218149248 7.75599981,0.218149248 C8.54083561,0.218149248 9.1773132,0.855044755 9.1773132,1.63988056 L9.1773132,4.8368954 L8.49737292,5.71743269 L9.1773132,5.68358195 L9.1773132,15.9554026 C9.57808931,14.8888952 9.93707438,13.1733728 9.93623856,10.4916415 C9.93623856,10.2605371 9.93373109,10.0210744 9.92871617,9.77450722 C9.91659677,9.23540275 10.3445371,8.78782068 10.8840594,8.77611918 L10.9057908,8.77611918 C11.4357012,8.77611918 11.870746,9.19946246 11.8828654,9.73188035 C11.8882982,9.99223856 11.8912236,10.2454923 11.8912236,10.4916415 C11.8899699,14.2294325 11.2447161,16.420119 10.5016714,17.7369548 C10.405552,17.908716 10.307343,18.0641787 10.2091341,18.2050145 L9.38585051,17.9191637 L9.57474603,18.9392831 C9.15976097,19.3216712 8.81247739,19.4729547 8.69462665,19.5072234 C8.65116396,19.5214323 8.60770128,19.5314622 8.56423859,19.5398204 C8.47731322,19.5678204 8.38537292,19.5874622 8.28883561,19.5874622 L7.90561174,19.5874622 C7.37235802,19.2514622 6.74298491,19.0542085 6.06764164,19.0542085 C5.39146255,19.0542085 4.76250734,19.2514622 4.22883572,19.5874622 L3.84644767,19.5874622 C3.74907453,19.5874622 3.65755215,19.5678204 3.56979096,19.5389846 C3.52632827,19.5310443 3.48370141,19.5214323 3.44065663,19.5072234 L3.44023872,19.5072234 C3.23880589,19.4487159 2.37164173,19.0558801 1.63319399,17.7373727 C0.889313411,16.4205369 0.244477606,14.2298504 0.243223875,10.4920594 C0.243223875,10.2463281 0.245731337,9.99223856 0.252417904,9.72895498 C0.265373128,9.19779081 0.699999983,8.77570127 1.22865669,8.77570127 C1.2374328,8.77570127 1.2453731,8.77611918 1.25373131,8.77611918" id="path54" fill="#FFFFFF" fill-rule="nonzero"></path>
                                    </g>
                                    <g id="g56" transform="translate(30.725402, 19.599122)">
                                        <path d="M3.3432835,6.26865656 C5.06047749,6.26865656 6.45253715,4.87617898 6.45253715,3.158985 C6.45253715,1.4413731 5.06047749,0.0493134316 3.3432835,0.0493134316 C1.62608951,0.0493134316 0.233611934,1.4413731 0.233611934,3.158985 C0.233611934,4.87617898 1.62608951,6.26865656 3.3432835,6.26865656" id="path58" fill="#FFFFFF" fill-rule="nonzero"></path>
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
