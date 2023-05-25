import React from 'react'
import c from './all-icons-style.module.scss'
import { Icon } from './Icon.js'
import { IconBar } from './IconBar'

export const PeopleRefugeeFamilyAltCircle = IconBar(
  PeopleRefugeeFamilyAltCircleIcon
)

function PeopleRefugeeFamilyAltCircleIcon(props) {
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
          fill="#FD5A00"
          fill-rule="nonzero"
          cx="34.5"
          cy="34.5"
          r="34.5"
        ></circle> */}
        <g transform="translate(60 60) scale(14)">
          <g transform="translate(11.000000, 11.000000)" id="g10">
            <g transform="translate(24.000000, 24.000000) scale(-1, 1) rotate(-180.000000) translate(-24.000000, -24.000000) translate(0.000000, -0.000000)">
              <g id="g12">
                <g id="g14-Clipped">
                  <g id="path16"></g>
                  <g id="g14">
                    <g transform="translate(-0.477612, 7.641791)">
                      <g id="g20" transform="translate(0.343069, 24.067390)">
                        <path
                          d="M5.73134314,0.477611928 L5.57468643,0.846328337 C5.20788047,1.71032832 5.61241777,2.71235814 6.47641775,3.07964171 C6.68895506,3.16991037 6.91295505,3.21576111 7.14173116,3.21576111 C7.34280579,3.21576111 7.53623862,3.17659694 7.71868637,3.1111641 C7.91880577,4.09265661 7.73826846,5.15056704 7.12740281,6.04179089 C5.93146254,7.78746249 3.54579096,8.23259681 1.80059697,7.03617893 C0.0554029837,5.84071627 -0.390208945,3.4555223 0.805731323,1.7098507 C1.91283577,0.0940895499 4.03677602,-0.405014915 5.73134314,0.477611928"
                          id="path22"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g24" transform="translate(7.776573, 0.471307)">
                        <path
                          d="M2.02985069,23.9999994 L2.24859695,24.7398203 C2.46208948,25.4581486 3.13313424,25.9601187 3.88155213,25.9601187 C4.04537302,25.9601187 4.20823869,25.9362381 4.36632824,25.8894322 C5.26662673,25.6224471 5.78244761,24.6729546 5.51546254,23.7721785 L3.99665661,18.6440592 C4.3968954,17.8994622 4.76179092,17.128119 5.05647748,16.3477011 C4.58316406,16.0219697 4.0682984,15.6136115 3.54770139,15.1016116 C2.6751044,14.2390444 1.79964174,13.0798803 1.15391041,11.5859101 C0.583164156,10.2696117 0.198208941,8.69970127 0.11605969,6.88668639 L1.55414921,6.62591027 L0.105552227,5.68071627 C0.138029838,4.46710436 0.298029834,3.155582 0.610388035,1.7380298 C0.829611911,0.744119375 1.71032831,0.066865661 2.68752231,0.066865661 C2.83988052,0.066865661 2.99414917,0.0831044666 3.14841782,0.117492525 C4.2965969,0.370626847 5.02304464,1.50686563 4.76943271,2.6550447 C4.47617898,3.98471631 4.35725361,5.14101479 4.35725361,6.14399984 C4.35773123,6.7429252 4.39928346,7.28644757 4.47331331,7.78268636 C4.6409551,6.65552221 5.02591031,5.4896715 5.71462671,4.38399988 C6.69325356,2.8031044 8.25074605,1.39892533 10.4090744,0.300417894 C10.7185669,0.141850734 11.0500296,0.066865661 11.3752833,0.066865661 C12.1504474,0.066865661 12.8974325,0.491462665 13.2737907,1.22841787 C13.8087161,2.27582083 13.3931937,3.55820886 12.3462683,4.09313422 C10.7333729,4.92035808 9.85122363,5.80011925 9.33301468,6.62973117 C8.82005947,7.46268637 8.63235798,8.29898486 8.62853709,9.20023857 C8.62662664,9.56417886 8.66244754,9.93528332 8.72453709,10.3044773 L8.31140277,11.1679997 L7.28931324,11.6222087 L8.65194007,13.2126564 L9.56465647,12.8936116 C9.79677587,13.3860295 10.0303281,13.7943877 10.2008356,14.0704474 C10.2877609,14.2118205 10.3584475,14.3192832 10.4038206,14.3861489 C10.426746,14.4191041 10.4429848,14.4429847 10.4520594,14.4554026 C10.4530147,14.4573131 10.4544475,14.4587459 10.4549251,14.4601787 C10.5332535,14.5671638 10.5986863,14.6794026 10.6545669,14.7945071 C9.83164154,15.1001787 9.14340275,15.7234623 8.76943261,16.5497309 C8.4007162,17.363104 8.37158187,18.2710443 8.68680574,19.1063876 C8.94089529,19.7826861 9.39940274,20.3429249 9.99594004,20.7278801 C9.94913407,20.8439398 9.90185049,20.9585666 9.85313407,21.071283 C9.618149,21.2193427 9.38507438,21.3951039 9.1534326,21.5909248 L8.22638785,21.6157606 L8.58650724,22.1067457 C8.13564158,22.5451935 7.68573114,23.0399994 7.22674608,23.5448352 L6.91152221,23.8911039 C5.41229836,25.5331337 3.92167153,27.0065665 2.17886561,27.0065665 C1.8502686,27.0065665 1.51498503,26.9497307 1.18113429,26.8427456 C1.05313429,26.6975516 0.948059669,26.5346859 0.865910417,26.3565366 C1.03880594,26.196059 1.18113429,25.9997605 1.27665668,25.7733725 L2.02985069,23.9999994 Z"
                          id="path26"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g28" transform="translate(6.071116, 17.905337)">
                        <path
                          d="M5.25373121,0.955223857 C5.28334315,1.01826863 5.3091342,1.08226863 5.32871628,1.1491343 L6.89432819,6.43486551 C7.10829833,7.15653713 6.69659685,7.91498488 5.97492522,8.12895502 C5.2532536,8.34196994 4.49480586,7.93026846 4.28131333,7.20907445 L3.94459692,6.07235806 L4.27653721,5.29194017 L4.06495512,4.91797003 L2.66889546,8.20632815 C2.37468651,8.89934306 1.57420892,9.22268634 0.882149232,8.92799978 C0.189134324,8.63426844 -0.13373134,7.83426846 0.160477608,7.14173116 L2.37516412,1.92525368 L2.76441784,1.00776117 C2.78973127,0.947582066 2.81982083,0.890268634 2.85325366,0.834865651 C2.85994023,0.823880576 2.86614918,0.812895502 2.87283575,0.80238804 C2.90483575,0.751761175 2.93922381,0.70352237 2.97791037,0.657671625 C2.9831641,0.650985058 2.98937306,0.645253715 2.9951044,0.638567148 C3.02949246,0.598925358 3.06674619,0.561671628 3.10543276,0.525850733 C3.11450738,0.517253718 3.12358201,0.509134316 3.13265664,0.501014913 C3.17755216,0.462328347 3.22483574,0.426507452 3.27498499,0.393074617 C3.27976111,0.390208945 3.28453723,0.387820886 3.28883574,0.384955214 C3.33420887,0.356298499 3.38149245,0.330507454 3.43068648,0.30710447 C3.44262678,0.300895515 3.45504469,0.295164172 3.4674626,0.289432829 C3.5195223,0.266507456 3.57253722,0.245492531 3.62841782,0.228776114 C3.63080588,0.228298502 3.63223872,0.227343278 3.63414916,0.226865666 L3.63414916,0.226865666 C3.63749245,0.225910442 3.64035812,0.22543283 3.6437014,0.224955218 C3.7038805,0.207283577 3.76549244,0.193432831 3.82758199,0.184358204 C3.85623871,0.180537309 3.88489543,0.180537309 3.91307453,0.178149249 C3.94937304,0.175283578 3.98567154,0.170029846 4.02197005,0.170029846 C4.08740288,0.170029846 4.15283572,0.176716413 4.21826855,0.186268652 C4.23068646,0.1881791 4.24310437,0.189611936 4.25552228,0.191999995 C4.31713422,0.202507458 4.37826855,0.217313427 4.43892526,0.236895516 C4.45038795,0.240716412 4.46137302,0.245492531 4.47283571,0.249313427 C4.49958198,0.258865665 4.52728347,0.267940292 4.55402974,0.278925366 C4.57791033,0.288955217 4.60035809,0.301373127 4.62328347,0.312835813 C4.63522376,0.318567156 4.64716406,0.323820887 4.65862675,0.330029842 C4.71498496,0.359641782 4.76799988,0.393074617 4.81862675,0.428895512 C4.82817898,0.436059691 4.836776,0.44322387 4.84632824,0.450388048 C4.89456704,0.487164167 4.9408954,0.526328345 4.98340286,0.568835807 C4.98722376,0.572656702 4.99152226,0.576477598 4.99534316,0.580298493 C5.03976107,0.626149238 5.07988047,0.674865655 5.1171342,0.725492519 C5.12620883,0.737432817 5.13432823,0.749373116 5.14340286,0.761791026 C5.15820883,0.783283563 5.17205957,0.805253711 5.18543271,0.827701472 C5.20453718,0.858746247 5.22268644,0.890268634 5.23892524,0.923223858 C5.24417897,0.933253708 5.24895509,0.944716394 5.25373121,0.955223857"
                          id="path30"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g32" transform="translate(8.695212, 21.413253)">
                        <path
                          d="M12.4179101,6.80596997 C8.75558187,9.36119379 3.30459693,8.42411918 3.30459693,8.42411918 C3.30459693,8.42411918 9.09611918,10.979343 12.4179101,6.80596997 M9.71749229,0.108417899 C10.0952833,0.251223865 10.4888356,0.328119386 10.8933729,0.328119386 C11.1231042,0.328119386 11.348537,0.303283566 11.5677609,0.257910432 C12.0171937,0.521552217 12.4785669,0.966686534 12.9576116,1.63916413 C13.8416713,2.87952231 14.2538504,4.01719392 14.2911041,5.02638793 C14.2079996,5.20788046 14.1344474,5.39462672 14.0766564,5.58901478 C13.9519997,6.00788044 13.8922982,6.4348655 13.8951638,6.85946251 C12.7808952,9.05217887 9.47056693,10.2194624 5.74614911,9.87223855 C3.14364171,9.62961169 0.238805964,8.33910426 0.0152835817,6.17934312 C4.18770139,7.68429831 6.85755207,1.20501489 9.71749229,0.108417899"
                          id="path34"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g36" transform="translate(38.222471, 1.548036)">
                        <path
                          d="M0.955223857,5.25373121 C1.90423876,3.29647753 3.5997611,1.42471638 6.20274611,0.189611936 C6.44011924,0.0764179085 6.69038789,0.0229253726 6.93683565,0.0229253726 C7.57205951,0.0229253726 8.18196994,0.379701483 8.47426844,0.991522363 C8.8807162,1.84023876 8.52155203,2.85707456 7.67331324,3.26304469 C7.40059683,3.39486559 7.14746251,3.53241782 6.90865654,3.67474618 L5.91617896,2.35128352 L5.96919388,4.32334318 C5.05647749,5.05217898 4.45038795,5.87749239 4.01432826,6.75343267 C3.84859692,7.09158191 3.71056707,7.4392834 3.59689543,7.79223861 C2.61779098,7.41588041 1.52788056,7.08967146 0.324298499,6.84656699 C0.489552227,6.31737298 0.696358192,5.78388045 0.955223857,5.25373121"
                          id="path38"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g40" transform="translate(34.662304, 0.157660)">
                        <path
                          d="M-1.97572989e-05,6.20895507 C-0.0033432835,4.62662675 0.417432825,2.89337306 1.40513429,1.14483579 C1.71844772,0.589850732 2.29635815,0.27749253 2.89146261,0.27749253 C3.17420888,0.27749253 3.46125364,0.348179096 3.72537304,0.496716405 C4.54495511,0.959044752 4.83534316,1.9978507 4.37349243,2.81695515 C3.6518208,4.10555214 3.40967156,5.21217897 3.40680588,6.20895507 C3.40441783,6.91582072 3.53767155,7.58686548 3.75307453,8.20919382 C2.64597008,7.99283562 1.44286564,7.84907443 0.140895519,7.8037013 C0.0525373121,7.29552221 0.000955223857,6.76441774 -1.97572989e-05,6.20895507"
                          id="path42"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g44" transform="translate(33.264907, 8.445182)">
                        <path
                          d="M1.43283579,10.0298505 L0.285134321,9.41468633 C0.54734327,8.45277591 0.759880578,7.42782071 0.865432814,6.33504462 L1.56131339,6.81026849 L2.01552234,5.3334924 L2.86710441,4.82292525 L0.89408953,3.71008946 C0.805731323,2.54519397 0.575522374,1.31438803 0.153313429,0.0157611936 C0.323820887,0.0124179101 0.492417898,0.0109850744 0.660059685,0.0109850744 C9.51689528,0.0119402982 13.919522,4.65146257 14.8728354,5.79104463 C14.9129549,5.83880582 14.9463877,5.87988045 14.9740892,5.91426851 C14.8613728,6.1220297 14.6292534,6.54519387 14.2958802,7.1231043 C13.908537,7.79510428 13.3836415,8.67629829 12.7589251,9.66304453 L11.043343,9.50734305 L12.0262684,10.7968953 C11.6011937,11.4397609 11.1422087,12.10794 10.6579102,12.7804176 C10.0102684,12.1327758 9.34829827,11.813731 8.65098486,11.813731 C7.16608937,11.813731 5.84740284,13.2666265 4.45086556,14.8045369 L4.13564169,15.1508056 C3.60931334,15.7272832 3.08346261,16.281313 2.54758203,16.7598802 L2.23999994,11.2950445 C2.210388,10.7648953 1.90041786,10.2801191 1.43283579,10.0298505"
                          id="path46"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g48" transform="translate(31.072286, 21.004895)">
                        <path
                          d="M1.43283579,0 L1.68405966,4.47188049 C1.71128354,4.94567152 1.95247756,5.35880584 2.30973129,5.62101478 C2.07617905,5.67498493 1.83832831,5.70602971 1.59522384,5.70602971 C1.22411937,5.70602971 0.843940277,5.63677598 0.466149242,5.50113419 L0.412179094,5.4815521 C0.29468656,5.14244763 0.243104472,4.78614913 0.239761188,4.40597004 C0.234985069,3.19092529 0.795701473,1.72274623 1.43283579,0"
                          id="path50"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g52" transform="translate(22.977623, 24.269373)">
                        <path
                          d="M2.86567157,7.64179085 C4.89456704,8.2440595 7.0271043,7.08776102 7.62937294,5.05982077 C8.23164159,3.03140291 7.07486549,0.898388037 5.04644764,0.296597008 C3.01755216,-0.306149246 0.885492515,0.850149232 0.282746262,2.87856709 C-0.319044768,4.90698495 0.83725371,7.03952221 2.86567157,7.64179085"
                          id="path54"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g56" transform="translate(27.850746, 15.909731)">
                        <path
                          d="M6.686567,2.86567157 C7.05194012,3.06101485 7.29074609,3.43594021 7.31367146,3.85002975 L7.6274625,9.41420872 C7.63080578,9.47247738 7.62841772,9.52979081 7.62316399,9.58662663 C7.09158191,10.0231639 6.54710431,10.371343 5.98017895,10.5814923 C5.57134314,10.4109848 5.2733133,10.0198206 5.24656703,9.54841767 L5.24608942,9.54841767 L4.97098495,4.65194018 L0.790925353,2.41241785 C0.210149248,2.10149248 -0.00811940278,1.37886564 0.302805963,0.798089532 C0.51773133,0.396895512 0.929432813,0.168597011 1.35498504,0.168597011 C1.54459698,0.168597011 1.73802981,0.213970144 1.91713428,0.309970142 L6.686567,2.86567157 Z"
                          id="path58"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g60" transform="translate(31.407665, 20.288477)">
                        <path
                          d="M12.4179101,7.16417893 C8.75558187,9.71940274 3.30459693,8.78232814 3.30459693,8.78232814 C3.30459693,8.78232814 9.09611918,11.337552 12.4179101,7.16417893 M0.0152835817,6.53755208 C5.68931329,8.58411919 8.58555202,-4.13516408 12.9576116,1.99689547 C16.7746861,7.35092519 11.8075221,10.7954624 5.74614911,10.2304475 C3.14364171,9.98782065 0.238805964,8.69731322 0.0152835817,6.53755208"
                          id="path62"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g64" transform="translate(22.197779, 0.352143)">
                        <path
                          d="M4.77611928,16.7164175 C3.44310439,18.0083578 1.73659697,17.85791 0.825791024,17.1897309 C-0.0157611936,16.5721787 0.0491940286,15.280716 0.726447743,14.3727758 L1.23940295,15.958925 C1.41038802,16.4876414 1.89850742,16.8434623 2.4544477,16.8434623 C2.58770143,16.8434623 2.72047754,16.8224473 2.84847754,16.7808951 C3.17325365,16.6762981 3.43737305,16.4513429 3.59259693,16.1471041 C3.7478208,15.8438205 3.77504468,15.4975519 3.67092528,15.1727757 L2.60871635,11.8868057 C3.05385067,11.2382087 3.47223872,10.5480594 3.78507453,9.83928334 C3.59641782,9.70029826 3.4034626,9.5493729 3.20907455,9.385552 C2.51988053,8.80286545 1.80728354,8.05779084 1.2494328,7.111164 C0.692537296,6.16835805 0.299462679,5.00585062 0.301850739,3.6957611 C0.300895515,2.83653724 0.468537302,1.92286562 0.828179084,0.985313408 C1.04931341,0.408358199 1.59856712,0.0544477598 2.18125368,0.0544477598 C2.35319397,0.0544477598 2.52799994,0.0854925352 2.6985074,0.150447757 C3.44549245,0.436059691 3.81898498,1.27379101 3.53289543,2.02029846 C3.28883574,2.65934322 3.19761186,3.20811932 3.19713425,3.6957611 C3.1990447,4.43510437 3.40537305,5.05934316 3.74591035,5.64298493 C3.81134319,5.75665657 3.8839402,5.86746254 3.96035811,5.97635806 C3.99856706,5.54746255 4.08071632,5.1051939 4.21349243,4.66005958 L4.92943271,5.01635808 L4.4083581,4.10125363 C4.49050735,3.89922378 4.58364168,3.69719394 4.68967152,3.49659693 C5.24370136,2.44919397 6.13970134,1.46197011 7.40823862,0.632835805 C7.65277593,0.472358197 7.92835801,0.395462677 8.20059681,0.395462677 C8.67199978,0.395462677 9.13432813,0.626149238 9.41277588,1.04979102 C9.85122363,1.71844772 9.66447737,2.61588053 8.99629828,3.05432828 C8.07355204,3.66185065 7.55820877,4.27319392 7.24776101,4.85397003 C6.94017893,5.43665658 6.82794013,6.01361179 6.82602968,6.59725357 C6.82411923,7.26495504 6.98937296,7.93217891 7.18949236,8.47570128 C7.96322368,8.97002963 8.55450725,9.73898483 8.23355203,11.122149 C8.02531323,11.7688355 7.81373115,12.3348057 7.58447742,12.8520594 L6.38519387,13.1992833 L7.12644758,13.77194 C6.54949237,14.8078802 5.82829836,15.6842981 4.77611928,16.7164175"
                          id="path66"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g68" transform="translate(21.317874, 7.510734)">
                        <path
                          d="M1.91044771,0.955223857 L4.22638795,8.11892517 C4.38543273,8.61134307 4.11558199,9.13958186 3.62316409,9.29862663 C3.13074619,9.45814902 2.6025074,9.18782067 2.44346263,8.69540277 L1.1453134,4.67964167 L1.8139701,4.11032826 L0.883104456,3.86961184 L0.127522385,1.53170145 C-0.0315223873,1.03928356 0.238805964,0.511044763 0.731223862,0.351999991 C0.826746248,0.320955216 0.924179081,0.306626858 1.01970147,0.306626858 C1.41516414,0.306626858 1.78244772,0.558805956 1.91044771,0.955223857"
                          id="path70"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                      <g id="g72" transform="translate(16.512382, 15.246519)">
                        <path
                          d="M1.91044771,5.73134314 C3.33468648,6.37611924 5.01205958,5.74376105 5.65683568,4.31952228 C6.30161178,2.89528351 5.6697312,1.21791042 4.24549243,0.573134314 C2.82125366,-0.0716417893 1.14388057,0.560238792 0.499104465,1.98495517 C-0.145671638,3.40919394 0.486208943,5.08656704 1.91044771,5.73134314"
                          id="path74"
                          fill="#FFFFFF"
                          fill-rule="nonzero"
                        ></path>
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
  )
}
