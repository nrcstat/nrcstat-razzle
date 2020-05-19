/**
 * This file contains the different functions for map manipulation
 */

/**
 * Add polygon source for multiple geometries (FeatureCollection)
 * @param {*} map 
 * @param {*} id 
 * @param {*} widgetObject 
 */
let addPolygonSource = (map, id, widgetObject) => {
    map.addSource(id, {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: widgetObject
        }
    });
}

/**
 * Add Polygon Layer for multiple geometries
 * @param {*} map 
 * @param {*} id 
 * @param {*} type 
 * @param {*} source 
 * @param {*} geometryType 
 */
let addPolygonLayer = (map, id, type, source, geometryType) => {
    map.addLayer({
        id: id,
        type: type,
        source: source,
        paint:{
            "fill-antialias": true,
            "fill-color": "#FF7602",
            "fill-opacity": 0.6,
            "fill-outline-color": "#FF7602"
        },
        "filter": ["==", "$type", geometryType]
    });
}

/**
 * Add Polyline Layer for multiple geometries
 * @param {*} map
 * @param {*} id 
 * @param {*} type 
 * @param {*} data
 */
let addPolylineLayer = (map, id, type, data) => {
    map.addLayer({
        id: id,
        type: type,
        source: {
            type: "geojson",
            data: data
        },
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#FF7602",
            "line-width": 2
        }
    });
}


module.exports = {
    addPolygonSource: addPolygonSource,
    addPolygonLayer: addPolygonLayer,
    addPolylineLayer: addPolylineLayer
};