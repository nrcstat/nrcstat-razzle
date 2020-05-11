import React, { useRef } from 'react'
import { isServer } from '../../util/utils';
import loadable from '@loadable/component'

const Mapboxgl = loadable.lib(() => import('mapbox-gl/dist/mapbox-gl.js'), {ssr: false})

if (isServer()) {
  console.log("i'm GlobalMap and i'm server")
} else {
  console.log("i'm GlobalMap and i'm client")
}

function Loader() {
  return (
    <Mapboxgl>
      {({ default: mapboxgl }) => <GlobalMap mapboxgl={mapboxgl} />}
    </Mapboxgl>
  )
}

function GlobalMap({mapboxgl}) {
  console.log("GlobalMap here")
  console.log("mapbox gl be like:")
  console.log(mapboxgl)
  const containerRef = useRef(null)
  const onReady = ref => {
    if (isServer()) return null
    containerRef.current = ref
    mapboxgl.accessToken = 'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ';
    var map = new mapboxgl.Map({
      container: ref,
      style: 'mapbox://styles/nrcmaps/cji8nwz770e7x2slhf6n6lshg',
      center: [0, 0],
      minZoom: 2,
      maxZoom: 5,
    });

  }
  return <div ref={onReady} />
}

export default Loader