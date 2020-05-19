"use strict";

/**********************************************************************
 * NRC STAT WIDGET LIBRARY
 * Used to generate
 *
 * Dependencies:
 * JQuery
 * Async
 *
 * Structure of NrcStatWidgetLibrary inspired by:
 * https://carldanley.com/js-singleton-pattern/
 *
 */

// we suppose that $ is pre-loaded (on NRC website)

// Raygun for automatic error reporting
const $ = require('jquery')
window.$ = window.jQuery = $
const tooltipster = window.tooltipster = require('tooltipster')

const d3 = require('d3')
import d3Tip from "./../vendor-manipulated/d3-tip"
d3.tip = d3Tip

import './widgetLibrary.css'

require( 'datatables.net' )( window, $ );
require( 'datatables.net-responsive' )( window, $ );
require( 'datatables.net-colreorder' )( window, $ );
require( 'datatables.net-fixedheader' )( window, $ );
require( 'datatables.net-buttons' )( window, $ )
require( 'datatables.net-buttons/js/buttons.html5.js' )( window, $ )
import './datatables.scss'

import "tooltipster/dist/css/tooltipster.bundle.min.css"

//const { each, map, max, flatten, includes, cloneDeep } = require('lodash')
import { each, map, max, flatten, includes, cloneDeep, flattenDeep } from 'lodash'

const helpers = require('./widgetHelpers')
const helper = require('./widgetHelpers')
const async = require('async')
var mapHelper = require('./widgetLibraryMapHelper')
var drawWidgetBarHorizontal = require('./widgetBarHorizontal')
var drawWidgetTable = require('./widgetTable')

import { drawWidgetMainmap } from "../draw/static/mainmap/draw-static-mainmap";
import { drawWidgetMainmap as drawWidgetMainmapV2 } from "../draw/static/mainmap-v2/draw-static-mainmap";
import { drawWidgetGlobalDisplacementRadialBarChartMap } from "../draw/static/global-displacement-radial-bar-chart/draw-static-global-displacement-radial-bar-chart-map";
import { drawCountryDashboard } from '../draw/dynamic/country-dashboard/draw-dynamic-country-dashboard';

let lastWindowWidth = window.innerWidth

const continentCodeNameMap = require('./assets/continentCodeNameMapEnglish.json')
const countryCodeNameMap = require('./assets/countryCodeNameMapEnglish.json')
const continentColorMap = require('./assets/continentColorMap.json')

  function WidgetLibrary() {
    var self = this;

    /**********************************************************************
     * WINDOW RESIZE HANDLER EVENT: REDRAW ALL WIDGETS
     */

    self.onResize = function () {
      each(self.widgets, function (w) {
        let count = 0;
        let interval = setInterval(function(){
          if (w.widgetObject.type == "mainmapv2" && window.innerWidth != lastWindowWidth) {
            const target = $(w.targetSelector)
            const orgStyle = target.data("orgStyle")
            target.attr("style", orgStyle)
            lastWindowWidth = window.innerWidth
            return self.drawWidget(w.widgetId);
          }
          count++
          if (count >= 5) clearInterval(interval)
        }, 100)

        // Only redraw non-table widgets
        if ( !_.includes(["table", "map", "mainmap", "mainmapv2", "dynamic-country-dashboard", "global-displacement-radial-bar-chart-map"], w.widgetObject.type) ) {
          console.log(w.widgetObject.type)
          return self.drawWidget(w.widgetId);
        }
      });
    };

    /**********************************************************************
     * PUBLIC FUNCTION: GENERATES WIDGET
     */

    self.generateWidget = function (params) {
      if (!params.targetSelector) return console.error("No targetSelector defined");
      if (!params.widgetId) return console.error("No widgetId defined");

      var targetSelector = params.targetSelector;
      var widgetId = params.widgetId;
      var locale = params.locale || 'nb_NO';

      var target = $(targetSelector);
      target.data('widgetId', widgetId);
      target.data('orgStyle', target.attr('style'));
      var targetElementAttrId = target.attr("id")

      if (!target) {
        console.error("Couldn't find any element with selector " + targetSelector);
        return;
      }

      self.widgets[widgetId] = {
        target: target,
        targetSelector: targetSelector,
        targetElementAttrId: targetElementAttrId,
        widgetId: widgetId,
        status: STATUS_LOADING,
        locale: locale
      };

      self.showMessageInTarget(target, "Loading widget...");

      // Special case: if the widget id contains "static-", it is one of the pre-defined table widgets. In this case, manually add certain
      // data to guide the below code flow onto the right track
      if (widgetId.indexOf("static") !== -1){
        params.widgetObject = {
          type: "table",
          id: widgetId
        }
        params.widgetData = true
      }
      
      // Special case: if the widget id is "global-displacement-radial-bar-chart-map-2019-0.1", it is the main map intended to be shown on the main page of flyktningregnskapet.no (in 2019)
      // In this case, add certain data to guide the below code flow onto the right track
      if (widgetId === 'global-displacement-radial-bar-chart-map-2019-0.1') {
        params.widgetObject = {
          type: "global-displacement-radial-bar-chart-map",
          id: widgetId
        }
        params.widgetData = true
      }

      // Check for widget id starting with 'dynamic_country_dashboard_', then pass on to appropriate renderer
      if (/^dynamic_country_dashboard_/.test(widgetId)) {
        params.widgetObject = {
          type: "dynamic-country-dashboard",
          id: widgetId
        }
        params.widgetData = true
      }

      // Special case: if the widget id is "mainmap-2018-0.1", it is the main map intended to be shown on the main page of flyktningregnskapet.no.
      // In this case, add certain data to guide the below code flow onto the right track
      if (widgetId === 'mainmap-2018-0.1') {
        params.widgetObject = {
          type: "mainmap",
          id: widgetId
        }
        params.widgetData = true
      }
      if (widgetId === 'mainmap-2018-0.2') {
        params.widgetObject = {
          type: "mainmapv2",
          id: widgetId
        }
        params.widgetData = true
      }

      // Use of clone twice below: necessary when widget library is used in widget wizard, to not
      // modify the original data. A bug appeared in relation to the preProcessCustomData
      if (params.widgetObject) {
        self.widgets[widgetId].widgetObject = cloneDeep(params.widgetObject);
        if (typeof self.widgets[widgetId].widgetObject.dataType != "undefined" && self.widgets[widgetId].widgetObject.dataType == "custom"){
          self.preProcessCustomData(widgetId)
          self.widgets[widgetId].status = STATUS_SUCCESS;
          self.drawWidget(widgetId);
          return;
        }
        if (params.widgetData) {
          self.widgets[widgetId].data = cloneDeep(params.widgetData);
          self.widgets[widgetId].status = STATUS_SUCCESS;
          self.drawWidget(widgetId);
        } else {
          self.loadWidgetData(widgetId, params.widgetObject);
        }
      } else {
        self.loadWidgetObject(widgetId);
      }
    };

    self.showMessageInTarget = function (target, message) {
      target.empty();
      target.css('padding', 0);
      target.append('<svg style="width: 100%; height: 100%;"><text x="50%" y="50%" dy=".3em" style="text-anchor: middle">' + message + '</text></svg>');
    };

    self.loadWidgetObject = function (widgetId) {
      $.getJSON(API_URL + "/widgets/" + widgetId).done(function (widgetObject) {
        self.widgets[widgetId].widgetObject = widgetObject;
        if (typeof self.widgets[widgetId].widgetObject.dataType != "undefined" && self.widgets[widgetId].widgetObject.dataType == "custom"){
          self.preProcessCustomData(widgetId)
          self.widgets[widgetId].status = STATUS_SUCCESS;
          self.drawWidget(widgetId);
          return;
        }
        self.loadWidgetData(widgetId, widgetObject);
      }).fail(function (jqxhr, textStatus, error) {
        self.widgets[widgetId].status = STATUS_ERROR;
        self.showMessageInTarget(self.widgets[widgetId].target, "Widget load failed, please retry");
      });
    };

    self.loadWidgetData = function (widgetId, widgetObject) {
      var wObj = widgetObject;
      $.getJSON(API_URL + "/datas/widgetData", {
        widgetType: wObj.type,
        dataPoints: wObj.dataPoints,
        years: wObj.years,
        countries: wObj.countries,
        formatPopup: wObj.config.formatPopup,
        formatBar: wObj.config.formatBar,
        legend: wObj.config.legend, // this is a boolean
        formatLegend: wObj.config.formatLegend,
        formatLabelBesidesBar: wObj.config.formatLabelBesidesBar,
        locale: wObj.config.locale
      }).done(function (json) {
        self.widgets[widgetId].data = json.dataSet;
        self.widgets[widgetId].status = STATUS_SUCCESS;
        self.drawWidget(widgetId);
      }).fail(function (jqxhr, textStatus, error) {
        self.showMessageInTarget(self.widgets[widgetId].target, "Widget load failed, please retry");
        self.widgets[widgetId].status = STATUS_ERROR;
      });
    };

    self.preProcessCustomData = function(widgetId) {
      var data = self.widgets[widgetId].widgetObject.customData
      var wType = self.widgets[widgetId].widgetObject.type
      function process(arr){
        arr = arr.map(function(element){
          switch(wType){
            case "donut":
              return { d: element[1], p: element[0] }
            case "bar":
              return { d: element[2], b: element[0], p: element[1] }
            case "bar-horizontal":
              return { d: element[3], p: element[2], lbb: element[0], b: element[1] }
            case "line":
              return { d: element[2], y: element[1], p: element[0] }
          }
        })
        arr = arr.filter(function(element){
          return !!element.d
        })
        return arr
      }
      if (wType == "line"){
        data = data.map(function(series){
          series.seriesData = process(series.seriesData)
          return series
        })
      } else if (wType == "donut" || wType == "bar" || wType == "bar-horizontal"){
        data = process(data)
      }
      self.widgets[widgetId].data = data
    }

    /**********************************************************************
     * DRAW WIDGET DISPATCHER FUNCTION
     */

    self.drawWidget = function (widgetId) {
      var wType = self.widgets[widgetId].widgetObject.type;
      var wDrawFunction = WIDGET_TYPE_MAP[wType];
      if (wDrawFunction) {
        // Loop until Roboto font has been loaded
        var timeoutId = setInterval(function(){
          if (self.robotoLoaded){
            clearInterval(timeoutId)
            try {
              wDrawFunction(widgetId);
            } catch (err) {
              self.showMessageInTarget(self.widgets[widgetId].target, "Widget load failed, please retry");
              console.log("Error on widget draw occured:", err);
            }
          }
        }, 10)
      } else {
        console.error("Invalid widget type", wType, "for widget", widgetId);
      }

      var wObj = self.widgets[widgetId].widgetObject;
    };

    /**********************************************************************
     * MAP WIDGET
     */

    self.mapboxInit = function(targetSelector, widgetId, widgetObject){
      mapboxgl.accessToken = 'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ';
      let latitude = widgetObject.zoomPosition.lat || 2.21
      let longitude = widgetObject.zoomPosition.lng || 46.2
      let zoomLevel = widgetObject.zoomLavel || 4
      const map = new mapboxgl.Map({
        container: targetSelector.replace("#", ""), // container id
        style: 'mapbox://styles/nrcmaps/cjh1zhk4s0wwa2spavnk3tpe7', //stylesheet location
        center: [longitude, latitude],
        zoom: zoomLevel,
        minZoom: 1,
        maxZoom: 9,
        attributionControl: false
      });

      const mapNav = new mapboxgl.NavigationControl()
      const fullScreen = new mapboxgl.FullscreenControl()
      map.addControl(mapNav, "top-left");
      map.addControl(fullScreen, "top-left");

      const interactions = ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate"]
      interactions.forEach(v => map[v].disable())

      $(targetSelector).addClass("nrcstat").data("mapExploreActive", false)
      self.widgets[widgetId].mapExploreActive = false

      d3.select(targetSelector).append("nav")
          .attr("class", "menu-ui nrcmenu toggle-map-explore")
          .append("a")
          .attr("type", "button")
          .style("cursor", "pointer")
          .on("click", self.mapExploreToggle)
          .text(function (d) {
            return LANG_EXPLORE_MAP[self.widgets[widgetId].language];
          });

      $(targetSelector).find(".toggle-map-explore a").data('widgetId', widgetId);

      self.widgets[widgetId].map = map
    }

    self.mapExploreToggle = function(){
      const widgetId = $(this).data('widgetId')
      const map = self.widgets[widgetId].map
      var mapExploreActive = self.widgets[widgetId].mapExploreActive
      const interactions = ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate"]

      if (!mapExploreActive) {
        $(this).attr('class', 'active');
        $(this).text(LANG_END_MAP_EXPLORE[self.widgets[widgetId].language]);
        interactions.forEach(v => map[v].enable())

        self.widgets[widgetId].mapExploreActive = true;
      } else {
        $(this).text(LANG_EXPLORE_MAP[self.widgets[widgetId].language]);
        $(this).attr('class', '');
        var wObj = self.widgets[widgetId].widgetObject;
        if (wObj.zoomLavel && wObj.zoomPosition) {
          map.setCenter([wObj.zoomPosition.lng, wObj.zoomPosition.lat]);
          map.setZoom(wObj.zoomLavel)
        } else {
          map.setCenter([40.50, 40])
          map.setZoom(2);
        }

        interactions.forEach(v => map[v].disable())

        self.widgets[widgetId].mapExploreActive = false;
      }
    }

    self.drawWidgetMapPolygons = function(widgetId){
      const map = self.widgets[widgetId].map
      const widgetObject = self.widgets[widgetId].widgetObject
      var mapFeaturesPolygons = widgetObject.mapFeatures.filter(f => f.geometry.type == "Polygon")
      /** On load Map Event */
      map.on('load', function(){
        mapHelper.addPolygonSource(map, "national-park", mapFeaturesPolygons);
        mapHelper.addPolygonLayer(map, "park-boundary", "fill", "national-park", "Polygon")
      });
      /**
       * On Click Map Event will showup the Popup
       */
      map.on('click', function (event) {
        var features = map.queryRenderedFeatures(event.point, { layers: ['park-boundary'] });
        if (!features.length) {
          return;
        }
        var mapFeaturesPolygons = features.map(f => {
              if(f.properties.label){
                var txt = `<h1>${f.properties.label}</h1><div>` + `<hr>` + f.properties.html;
                var popup = new mapboxgl.Popup({closeButton: false})
                    .setLngLat(map.unproject(event.point))
                    .setHTML(txt)
                    .addTo(map);
              }
            }
        )
      });
    }

    self.drawWidgetMapPolylines = function(widgetId){
      const map = self.widgets[widgetId].map
      const widgetObject = self.widgets[widgetId].widgetObject
      var mapPolylineObject = widgetObject.mapFeatures.filter(function( obj ) {
        return obj.geometry.type == "LineString";
      });
      var geojson = {
        "type": "FeatureCollection",
        "features": mapPolylineObject
      };
      /** On load Map Event */
      map.on('load', function(){
        mapHelper.addPolylineLayer(map, "LineString", "line", geojson);
      });
      /**
       * On Click Map Event will showup the Popup
       */
      map.on('click', function (event) {
        var features = map.queryRenderedFeatures(event.point, { layers: ['LineString'] });
        if (!features.length) {
          return;
        }
        var mapFeaturesPolygons = features.map(f => {
          var txt = `<h1>${f.properties.label}</h1><div>` + `<hr>` + f.properties.html;
          var popup = new mapboxgl.Popup({closeButton: false})
              .setLngLat(map.unproject(event.point))
              .setHTML(txt)
              .addTo(map);
        })
      });
    }

    self.drawWidgetMapMarkers = function(widgetId){
      const map = self.widgets[widgetId].map
      const widgetObject = self.widgets[widgetId].widgetObject

      let markers = widgetObject.mapFeatures.filter(f => f.geometry.type == "Point")
      markers.forEach(m => {
        let labelTitle = m.properties.label
        let labelIcon = m.properties.icones
        let geometry = m.geometry.coordinates

        map.on('load', function(){
          let labelElement = [geometry[0], geometry[1]];
          let el1
          if (labelTitle){
            el1 = $(`<div class="icon icon-${labelIcon}"><div class="left-arrow"><strong>${labelTitle}</strong></div></div>`);
          } else {
            el1 = $(`<div class="icon icon-${labelIcon} icon-without-label" />`);
          }
          // create the marker

          let marker = new mapboxgl.Marker(el1[0], {offset:[-25, -25]})
              .setLngLat(labelElement)
              .setPopup(popup)

          if (m.properties.label || m.properties.html){
            var txt = `<h1>${m.properties.label}</h1><div>` + `<hr>` + m.properties.html;
            var popup = new mapboxgl.Popup({closeButton: false})
                .setHTML(txt)

            marker.setPopup(popup)
          }

          marker.addTo(map)
        })
      })

    }

    self.drawWidgetMap = function (widgetId) {
      //self.widgets[widgetId].target.empty();
      var wObj = self.widgets[widgetId].widgetObject;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId

      $(wSelector).empty()

      if (widgetId == "592ef28bde8f9c4b3971e0c2"){
        self.mapboxInit(wSelector, widgetId, wObj)
        self.drawWidgetMapMarkers(widgetId)
        self.drawWidgetMapPolylines(widgetId)
        self.drawWidgetMapPolygons(widgetId)
        return;
      }

      // If .map is not set, this function has not been called before and we do a full mapbox initialization and
      // add map features
      if (!self.widgets[widgetId].map) {
        self.initMapbox(widgetId, wObj, wSelector);
        self.addMapFeatures(widgetId, wObj, wSelector);
        self.addInfoBox(wObj);
      } else {}
      // .map is set, meaning mapbox is already initialized and features already added, so we simply re-position the map

      /*
       var mapIconSize = self.widgets[widgetId].widgetObject.mapIconSize;
       var setMapIconSize = self.iconSizes(mapIconSize);
       setTimeout(function ()
       {
       self.switchIconsize(setMapIconSize);
       }, 300);
       */
    };

    /**********************************************************************
     * DEFINE MAPBOX
     */

    self.initMapbox = function (widgetId, wObj, selcetorName) {

      L.mapbox.accessToken = 'pk.eyJ1IjoibnJjbWFwcyIsImEiOiJjaW5hNTM4MXMwMDB4d2tseWZhbmFxdWphIn0._w6LWU9OWnXak36BkzopcQ';

      var map = self.widgets[widgetId].map = L.mapbox.map(selcetorName.split("#")[1]);

      // Set zoom level and map position
      if (wObj.zoomLavel && wObj.zoomPosition) {
        map.setView([wObj.zoomPosition.lat, wObj.zoomPosition.lng], wObj.zoomLavel);
      } else {
        map.setView([40.50, 40], 2);
      }

      // Assign NRC's mapbox style as the map widget's style layer
      L.mapbox.styleLayer('mapbox://styles/nrcmaps/cjh1zhk4s0wwa2spavnk3tpe7', { attributionControl: true }).addTo(map);
      map.options.minZoom = 2;
      map.options.maxZoom = 10;
      L.control.fullscreen().addTo(map);

      $(selcetorName).addClass("nrcstat").data('mapExploreActive', false);
      self.widgets[widgetId].mapExploreActive = false;

      d3.select(selcetorName).append("nav").attr("class", "menu-ui nrcmenu toggle-map-explore").append("a")
          .attr("type", "button").style("cursor", "pointer")
          .attr("id", "btnNrc").on("click", toggleMapExplore).text(function (d) {
        return LANG_EXPLORE_MAP[self.widgets[widgetId].locale];
      });

      $(selcetorName).find(".toggle-map-explore a").data('widgetId', widgetId);

      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.keyboard.disable();

      function toggleMapExplore(){
        var mapExploreActive = self.widgets[widgetId].mapExploreActive;

        if (!mapExploreActive) {
          $("#btnNrc").attr('class', 'active');
          $('#btnNrc').text(LANG_END_MAP_EXPLORE[self.widgets[widgetId].locale]);
          self.widgets[widgetId].map.dragging.enable();
          self.widgets[widgetId].map.touchZoom.enable();
          self.widgets[widgetId].map.doubleClickZoom.enable();
          self.widgets[widgetId].map.scrollWheelZoom.enable();
          self.widgets[widgetId].map.keyboard.enable();

          self.widgets[widgetId].mapExploreActive = true;
          /**********************************************************************
           * DISABLE ZOOM BUTTON
           */
          $('.leaflet-control-zoom-in').css('display', 'block');
          $('.leaflet-control-zoom-out').css('display', 'block');
        } else {
          $('#btnNrc').text(LANG_EXPLORE_MAP[self.widgets[widgetId].locale]);
          $("#btnNrc").attr('class', '');
          var wObj = self.widgets[widgetId].widgetObject;
          if (wObj.zoomLavel && wObj.zoomPosition) {
            self.widgets[widgetId].map.setView([wObj.zoomPosition.lat, wObj.zoomPosition.lng], wObj.zoomLavel);
          } else {
            self.widgets[widgetId].map.setView([40.50, 40], 2);
          }

          self.widgets[widgetId].map.dragging.disable();
          self.widgets[widgetId].map.touchZoom.disable();
          self.widgets[widgetId].map.doubleClickZoom.disable();
          self.widgets[widgetId].map.scrollWheelZoom.disable();
          self.widgets[widgetId].map.keyboard.disable();

          self.widgets[widgetId].mapExploreActive = false;
          /**********************************************************************
           * DISABLE ZOOM BUTTON
           */
          $('.leaflet-control-zoom-in').css('display', 'none');
          $('.leaflet-control-zoom-out').css('display', 'none');
        }
      }
    };

    self.addMapFeatures = function (widgetId, wObj, selcetorName) {
      self.geoJsonLayer = L.geoJson([], {
        pointToLayer: function pointToLayer(feature, latlng) {

          var props = feature.properties;

          var smallIcon = L.icon({
            iconSize: self.iconSizes(wObj.mapIconSize),
            //iconAnchor: [13, 27],
            labelAnchor: self.labelAnchors(wObj.mapIconSize),
            popupAnchor: [1, -24],
            iconUrl: ASSETS_URL + '/assets/img/svgIcons/' + props.icones + '.svg'
          });

          var marker = L.marker(latlng, { icon: smallIcon });

          var markerClassNames = [];
          if (props.label && !props.highlight) markerClassNames.push('marker-cursor');
          markerClassNames.push('marker-border-color-' + props.color);
          markerClassNames.push('marker-label');

          if (props.label && props.checked) {
            marker.bindLabel(props.label, {
              noHide: true,
              className: markerClassNames.join(' '),
              clickable: true
            });
          }

          return marker;
        },
        style: {
          "color": "#FF7602",
          "weight": 2,
          "opacity": 1
        },
        onEachFeature: function onEachFeature(feature, layer) {
          var props = feature.properties;
          //          props.html = "";
          if (props.label && !props.checked) {
            var text = '';
            if (props.icones) {
              text += '<img border="0" src="' + ASSETS_URL + '/assets/img/svgIcons/' + props.icones + '.svg" style="float: left; margin-right: 10px;" />';
            }

            text += '<div style="min-width: 150px; margin-top: 5px; margin-bottom: -10px;">' + '<h1 style="' + 'font-size: 16px !important; ' + 'color:#616161;">' + props.label + '</h1>' + (props.html ? '<hr />' : '') + '</div>';

            if (props.html) {
              text += props.html + '';
            }
            layer.bindPopup(text);
          }
        }
      }).addTo(self.widgets[widgetId].map);
      self.geoJsonLayer.addData(wObj.mapFeatures);
    };

    /**********************************************************************
     * ADD INFOBOX TO MAP
     */
    self.addInfoBox = function (wObj) {
      /**********************************************************************
       * WHEN IT'S RECTANGLE
       */
      if (wObj.mapFactBox.highlight || wObj.mapFactBox.label || wObj.mapFactBox.icon || wObj.mapFactBox.details) {
        /**********************************************************************
         * DISABLE ZOOM BUTTON
         */
        $('.leaflet-control-zoom-in').css('display', 'none');
        $('.leaflet-control-zoom-out').css('display', 'none');

        /**********************************************************************
         * ADDING RECTANGLE USING NORMAL DIV
         */
        self.mapFactBox = wObj.mapFactBox;
        if (self.mapFactBox.icon) {
          var str = '<div class="infoBox">'
          if(self.mapFactBox.highlight) str += '<h1 style="background-color: white; text-align: center;  min-width:100px;font-size: 15px; padding-left: 5px; padding-right: 5px; font-family: roboto; padding-top: 10px; padding-bottom: 10px;">' + self.mapFactBox.highlight + '</h1> '
          if(self.mapFactBox.icon || self.mapFactBox.label || self.mapFactBox.details) str += '<div style="text-align: center; background-color: #fec110; padding-left: 5px; padding-right: 5px; padding-top: 10px;">' + '<img border="0" src="' + ASSETS_URL + '/assets/img/svgIcons/' + self.mapFactBox.icon + '.svg" style="float: none;margin-top: -10px; margin-left: 5px; margin-right: 5px"/>' + '<span style="font-weight : bold; font-size: x-large; margin-right: 5px;  font-family: roboto;">' + self.mapFactBox.label + '</span>' + '</div><div class="forp" style="background-color: #fec110 ; min-width:100px; text-align: center; color: white; padding-left: 5px;padding-right: 5px; max-width: 400px; font-family: roboto;">' + self.mapFactBox.details + '</div>'
          str += '</div>'
          $(".nrcmenu").after(str);
        } else {
          var str = '<div class="infoBox">'
          if(self.mapFactBox.highlight) str += '<h1 style="background-color: white; text-align: center; min-width:100px; font-size: 15px; padding-left: 5px; padding-right: 5px; font-family: roboto; padding-top: 10px; padding-bottom: 10px;">' + self.mapFactBox.highlight + '</h1>'
          if(self.mapFactBox.icon || self.mapFactBox.label || self.mapFactBox.details) str += '<div style="text-align: center; background-color: #fec110; padding-top: 10px;">' + '<span style="font-weight : bold; font-size: x-large; margin-right: 5px; font-family: roboto;">' + self.mapFactBox.label + '</span>' + '</div><div class="forp" style="background-color: #fec110 ; min-width:100px; text-align: center; color: white; padding-left: 5px; padding-right: 5px; max-width: 400px; font-family: roboto;">' + self.mapFactBox.details + '</div>' + '</div>'
          str += '</div>'
          $(".nrcmenu").after(str);
        }

        /**********************************************************************
         * change position of infobox div and fullscreen button
         */
        if (wObj.mapFactBox.position == "topLeft") {
          $('.leaflet-top').css({ 'bottom': '20px', 'top': 'inherit', 'left': '7px' });
          $('.infoBox').css({ 'left': '20px', 'right': 'inherit' });
        }
        if (wObj.mapFactBox.position == "bottomLeft") {
          //$('.leaflet-left').css({'right':'20px', 'left':'inherit'});
          $('.infoBox').css({ 'left': '20px', 'right': 'inherit', 'bottom': '26px', 'top': 'inherit' });
        }
      }
    };

    self.iconSizes = function iconSizeMode(size) {
      var sizes = {
        "MODE_SMALL": [25, 25],
        "MODE_MEDIUM": [32, 32],
        "MODE_BIG": [45, 45]
      };

      return sizes[size];
    };

    self.labelAnchors = function iconSizeMode(size) {
      var sizes = {
        "MODE_SMALL": [-2, -8],
        "MODE_MEDIUM": [1, -7],
        "MODE_BIG": [8, -7]
      };

      return sizes[size];
    };

    /**********************************************************************
     * LINE WIDGET
     */

    self.drawWidgetLine = function (widgetId) {
      var wObj = self.widgets[widgetId].widgetObject;
      var wConfig = wObj.config;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId

      $(wSelector).empty();
      $(wSelector).css('padding', 0);

      var w, h, svg, g;

      svg = d3.select(wSelector).append("svg").attr("class", "nrcstat");

      /**********************************************************************
       * Take the width and height of the containing div and apply it to the
       * svg we've drawn inside of it
       */

      w = $(wSelector).innerWidth();
      h = $(wSelector).innerHeight();

      svg.attr("width", w).attr("height", h);

      /**********************************************************************
       * Precalculate how much height is needed for the title section
       */

      var sTitleLeftMargin = 15,
          sTitleRightMargin = 10,
          sTitleFont = "Roboto Condensed",
          sTitleSize = "24px",
          sTitleColor = "#333333",
          sTitleStyle = sTitleSize + " " + sTitleFont;

      var sTitleLines = helpers.splitTextToLines({
        availableWidth: w - sTitleLeftMargin - sTitleRightMargin,
        text: wObj.config.title,
        textStyle: sTitleStyle
      });
      var sTitleHeight = sTitleLines.lines.length * sTitleLines.lineHeight;

      /**********************************************************************
       * Precalculate how much width is needed for the numbers in the y-axis
       */

      var sChartFont = "Roboto Condensed",
          sChartSize = "14px",
          sChartStyle = sChartSize + " " + sChartFont,
          sChartYAxisWidths = map(_(wData).map(s => s.seriesData).flattenDeep().value(), function (d) {
            var dStr = helpers.formatDataNumber(d.d, "nb_NO")
            return helpers.getTextWidth(dStr, sChartStyle);
          }),
          sChartYAxisWidth = max(sChartYAxisWidths),
          // this "magic" number 10 is needed for some reason
          sChartYAxisMarginLeft = 30,
          sChartYAxisMarginRight = 5;

      /**********************************************************************
       * Precalculate how much width is needed for the legend (if enabled)
       */

      let sLegendLeftMargin, sLegendRightMargin, sLegendWidth, sLegendLabels, sLegendTextHeight
      let sLegendFont, sLegendFontSize, sLegendFontWeight, sLegendStyle, sLegendFontColor, sLegendSpacing
      if (wObj.config.legend){
        sLegendFont = "Roboto Condensed",
        sLegendFontSize = "14px",
        sLegendFontWeight = ""
        sLegendStyle = "14px Roboto Condensed",
        sLegendFontColor = "black",
        sLegendSpacing = 10
        sLegendLabels = _(wData).map(d => d.seriesLegend).value()
        const legendLabelsWidth = _(sLegendLabels).map(l => helpers.getTextWidth(l, sLegendStyle)).value()
        const maxLegendLabelWidth = max(legendLabelsWidth)
        sLegendLeftMargin = 15
        sLegendRightMargin = 5
        sLegendWidth = maxLegendLabelWidth
        sLegendTextHeight = helpers.getTextHeight(sLegendLabels[0], sLegendStyle)
      } else {
        sLegendFont = "Roboto Condensed"
        sLegendFontSize = "0px"
        sLegendStyle = "0px Roboto Condensed"
        sLegendSpacing = 10
        sLegendTextHeight = 0
        sLegendLeftMargin = 0
        sLegendRightMargin = 0
        sLegendWidth = 0
      }

      /**********************************************************************
       * Precalculate how much height is needed for the subtitle section
       */

      var sSubtitleLeftMargin = sTitleLeftMargin,
          sSubtitleRightMargin = sTitleRightMargin,
          sSubtitleFont = "Roboto Condensed",
          sSubtitleSize = "18px",
          sSubtitleStyle = sSubtitleSize + " " + sSubtitleFont;

      var sSubtitleLines = helpers.splitTextToLines({
        availableWidth: w - sSubtitleLeftMargin - sSubtitleRightMargin,
        text: wObj.config.subtitle,
        textStyle: sSubtitleStyle
      });
      var sSubtitleHeight = sSubtitleLines.lines.length * sSubtitleLines.lineHeight;

      /**********************************************************************
       * Prepare linkbox calculations
       */

      var sLinkboxFont = "Roboto Condensed",
          sLinkboxSize = "13px",
          sLinkboxStyle = "13px Roboto Condensed",
          sLinkboxTextWidth = helpers.getTextWidth(wObj.config.linkbox, sLinkboxStyle),
          sLinkboxTextHeight = helpers.getTextHeight(wObj.config.linkbox, sLinkboxStyle),
          sLinkboxPaddingHorizontal = 10,
          sLinkboxPaddingVertical = 3;

      /**********************************************************************
       * Prepare helper objects to get a good overview on the following
       * sections of the line widget:
       * - Title
       * - Chart
       * - Source / Subtitle / Social
       */

      var sTitle = {
        h: sTitleHeight,
        w: w - sTitleLeftMargin - sTitleRightMargin,
        m: { top: 25, right: sTitleRightMargin, bottom: 5, left: sTitleLeftMargin },
        s: 'title',
        l: sTitleLines
      },
          sSubtitle = {
            h: sSubtitleHeight,
            m: {
              top: 5, right: sTitleRightMargin, bottom: 0, left: sTitleLeftMargin
            },
            s: 'subtitle',
            l: sSubtitleLines
          },
          sChart = {
            h: null,
            m: {
              top: 0,
              right: 40,
              bottom: 5,
              left: sChartYAxisWidth + sChartYAxisMarginLeft + sChartYAxisMarginRight,
              leftRightBottomRect: 30
            },
            s: 'chart',
            pad: { left: 30, right: 30, top: 0, bottom: 20 }
          },

          sSource = { m: { left: 5 } },
          sSocial =
              (wConfig.social ?
                  { h: 32, m: { right: 30, top: 5 }, s: 'social', spacing: 9 } :
                  { h: 0, m: { right: 0, top: 0 }, s: 'social', spacing: 0});
      var sLinkbox = {
          h: sLinkboxTextHeight + sLinkboxPaddingVertical * 2,
          w: sLinkboxTextWidth + sLinkboxPaddingHorizontal * 2,
          m: { left: sTitleLeftMargin + 1 },
          pad: {
            top: sLinkboxPaddingVertical,
            right: sLinkboxPaddingHorizontal,
            bottom: sLinkboxPaddingVertical,
            left: sLinkboxPaddingHorizontal
          }
        };
      var sLegendHeight = sLegendTextHeight * sLegendLabels.length;
      var sLegendTopMargin = 40
      var sLegend = {
        h: sLegendHeight + sLegendTopMargin,
        w: sLinkboxTextWidth + sLinkboxPaddingHorizontal * 2,
        m: { left: sTitleLeftMargin + 1 },
      }

      sChart.w = w - sChart.m.left - sChart.m.right;

      /**********************************************************************
       * SECTION CALCULATIONS
       */

      var totalHeight = sTitle.m.top + sTitle.h + sTitle.m.bottom + sSubtitle.m.top + sSubtitle.h + sSubtitle.m.bottom + sLegend.h + sLegendTopMargin;
      sChart.h = h - totalHeight - (sChart.m.top + sChart.m.bottom) - 30;

      /** Calculate position objects **/
      /* TODO: remove this? */

      var sBackground = { m: { bottom: (sLinkboxTextHeight + sLinkboxPaddingVertical * 2) / 2 } };
      sTitle.p = { top: sTitle.m.top, left: sTitle.m.left };
      sSubtitle.p = { top: sTitle.m.top + sTitle.h + sTitle.m.bottom + sSubtitle.m.top, left: sSubtitle.m.left }
      sChart.p = { top: sSubtitle.p.top + sSubtitle.h + sSubtitle.m.bottom + sChart.m.top };
      //sChart.p = { top: sTitle.m.top + sTitle.h + sTitle.m.bottom + sChart.m.top };
      sSocial.p = {
        top: sChart.p.top + sChart.h + sChart.m.bottom + sSocial.m.top,
        left: sChart.m.left + sChart.w - 110
      };
      sSocial.w = sSocial.h * 3 + sSocial.spacing * 2;
      sLinkbox.p = {
        top: sChart.p.top + sChart.h + sChart.m.bottom + sSocial.m.top,
      }
      sLegend.p = { top: sChart.p.top + sChart.h + sLegendTopMargin, left: sLegendLeftMargin }

      /**********************************************************************
       * Remove all old elements from the svg since we are re-rendering
       * everything
       */

      svg.selectAll().remove();

      /**********************************************************************
       * INSERT BACKGROUND
       */

      if (wObj.config.drawBackground) {
        svg.append("rect").attr({
          x: 0,
          y: 0,
          width: w,
          height: h - sBackground.m.bottom,
          fill: "rgb(236,236,236)"
        });
      }

      /**********************************************************************
       * INSERT AXES + COLUMN RECTANGLES
       */

      var xMin = _(wData).map(s => s.seriesData).flattenDeep().first().y
      var xMax = _(wData).map(s => s.seriesData).flattenDeep().last().y
      var xScale = d3.scale.linear().domain([xMin, xMax])
          .range([sChart.pad.left, sChart.w - sChart.pad.right]);
      var ticks = 5;
      var yMax = _(wData).map(o => o.seriesData).flatten().map(o => o.d).value()
      yMax = max(yMax)
      yMax += yMax / ticks;

      var yScale = d3.scale.linear().domain([0, yMax]).range([sChart.pad.top, sChart.h - sChart.pad.bottom]);

      var yScaleAxis = d3.scale.linear().domain([0, yMax]).range([sChart.h - sChart.pad.top, sChart.pad.bottom]);
      var yAxis = d3.svg.axis().scale(yScaleAxis).orient("left").ticks(5).tickFormat(function (d) {
        return helpers.formatDataNumber(d, "nb_NO")
      });

      svg.append("g").attr("class", "y-axis").attr("transform", "translate(" + (sChartYAxisMarginLeft + sChartYAxisWidth) + "," + sChart.p.top + ")").call(yAxis);

      /**********************************************************************
       * DRAW HORIZONTAL Y AXIS LINES
       */

      var grid = svg.append("g").attr("class", "grid").attr("transform", "translate(" + sChart.m.left + "," + sChart.p.top + ")").call(yAxis.tickSize(-sChart.w, 0, 0).tickFormat(""));

      /**********************************************************************
       * DRAW VERTICAL X AXIS LINES
       */

      each(wObj.years, function (y, i) {
        svg.append("line").attr({
          x1: xScale(y) + sChart.m.left,
          x2: xScale(y) + sChart.m.left,
          y1: sChart.p.top + sChart.m.top,
          y2: sChart.p.top + sChart.h,
          stroke: "lightgrey"
        });
      });

      /**********************************************************************
       * DRAW BOTTOM RECTANGLE
       */

      svg.append("rect").attr("width", sChart.w).attr("height", 10).attr("x", sChart.m.left).attr("y", sChart.p.top + sChart.h - 10).attr("fill", "rgb(188,188,188)");

      /**********************************************************************
       * PREPARE FOR DRAWING LINES
       */

      g = svg.append("g");
      g.attr("transform", "translate(" + sChart.m.left + "," + sChart.p.top + ")");

      /**********************************************************************
       * PREPARE CIRCLE POPUPS
       */

      var tip = d3.tip().attr('class', 'nrcstat-d3-tip').html(function (d) {
        var data =  helpers.formatDataNumber(d.d, wConfig.locale)
        return '<span class="year">' + d.p + '</span>' + '<hr class="ruler" />' + '<span class="number">' + data + '</span>';
      }).offset([-10, 0]);

      g.call(tip);

      /**********************************************************************
       * INSERT LINE
       */

      var lineGen = d3.svg.line().x(function (d) {
        return xScale(d.y);
      }).y(function (d) {
        return sChart.h - yScale(d.d);
      });

      wData.map(series => series.seriesData).forEach(function (d, i) {
        var color = LINE_WIDGET_COLOURS[i % LINE_WIDGET_COLOURS.length];

        g.append('svg:path').attr('d', lineGen(d)).attr('stroke', color).attr('stroke-width', 2).attr('id', 'line_' + d.key).attr('fill', 'none');

        g.selectAll('svg').data(d).enter().append('circle').attr({
          cx: function cx(d) {
            return xScale(d.y);
          },
          cy: function cy(d) {
            return sChart.h - yScale(d.d);
          },
          r: 5,
          fill: color
        }).on('mouseover', function (d, i, a, b) {
          var circle = d3.select(this);
          circle.attr({
            r: 10,
            stroke: circle.attr("fill"),
            "stroke-width": 4,
            fill: "rgb(255,179,0)"
          });
          tip.show(d);
        }).on('mouseout', function (d, i) {
          var circle = d3.select(this);
          circle.attr({
            r: 5,
            fill: circle.attr("stroke"),
            "stroke-width": 0
          });
          tip.hide(d);
        });
      })


      /**********************************************************************
       * INSERT LEGEND
       */

      if (wObj.config.legend){

        // TODO: improve calculations

        let sLegendHeight = sLegendTextHeight * sLegendLabels.length
        sLegendHeight += sLegendSpacing * (sLegendLabels.length - 1)
        var sLegendTopOffset = sLegend.p.top
        var sLegendLeftOffset = sLegend.p.left

        var gLegend = svg.append("g")
            .attr("transform", `translate(${sLegendLeftOffset},${sLegendTopOffset})`)

        const labels = sLegendLabels
        const colors = LINE_WIDGET_COLOURS

        gLegend.selectAll("text").data(labels).enter().append("text")
            .attr({
              "x": (d, i) => self.settings.legend.bulletPointRadius * 2 + self.settings.legend.horSpacing,
              "y": (d, i) =>
              {
                var lineHeight = helpers.getTextHeight(d, self.settings.legend.style)
                return lineHeight * (i + self.settings.legend.magicLineHeightMultiplier) + i * self.settings.legend.verSpacing
              },
              "font-family": sLegendFont,
              "font-size": sLegendFontSize,
              "font-weight": sLegendFontWeight,
              "fill": sLegendFontColor
            })
            .text(d => d)

        gLegend.selectAll("circle").data(labels).enter().append("circle")
            .attr({
              "r": self.settings.legend.bulletPointRadius,
              "transform": (d, i) =>
              {
                var x          = self.settings.legend.bulletPointRadius
                var lineHeight = helpers.getTextHeight(d, self.settings.legend.style)
                var y          = lineHeight * (i + self.settings.legend.magicLineHeightMultiplier) + i * self.settings.legend.verSpacing - self.settings.legend.bulletPointRadius
                return `translate(${x},${y})`
              },
              "fill": (d, i) => colors[i % colors.length]
            })
      }

      /**********************************************************************
       * INSERT TITLE
       */

      each(sTitle.l.lines, function (line, i) {
        svg.append("text").attr("class", "title").text(line).attr("text-anchor", "start").attr("x", sTitle.p.left).attr("y", sTitle.p.top + i * sTitle.l.lineHeight + sTitle.l.lineHeight / 2)
        //.attr("transform", "translate(" + sTitle.p.left + "," + sTitle.p.top + ")")
          .attr("font-family", sTitleFont).attr("font-size", sTitleSize)
          .attr("fill", sTitleColor);
        //.attr("font-weight", "bold")
      });

      /**********************************************************************
       * INSERT SUBTITLE
       */

      each(sSubtitle.l.lines, function (line, i) {
        svg.append("text").attr("class", "subtitle").text(line).attr("text-anchor", "start").attr("x", sSubtitle.p.left).attr("y", sSubtitle.p.top + i * sSubtitle.l.lineHeight + sSubtitle.l.lineHeight / 2)
        //.attr("transform", "translate(" + sTitle.p.left + "," + sTitle.p.top + ")")
          .attr("font-family", sSubtitleFont).attr("font-size", sSubtitleSize);
      });

      /**********************************************************************
       * INSERT SOURCE
       */

      var sourceWidth = helpers.getTextWidth(wObj.config.source, 'bold 10px Roboto Condensed');

      svg.append("text").attr("class", "source").text(wObj.config.source)
      //.attr("text-anchor", "middle")
      //.attr("x", sSubtitle.p.left - 10)
      //.attr("y", sSubtitle.p.top)
        .attr("transform", "translate(" + (sChart.m.left + sChart.w + sSource.m.left) + "," + (sChart.p.top + sChart.h - sourceWidth + 1) + ")rotate(90)").attr("font-family", 'Roboto').attr("font-size", "10px").attr("font-weight", "bold").style("fill", "#8C8C8C").style("border-width", "1px");

      /**********************************************************************
       * INSERT SOCIAL
       */

      $(wSelector).css('position', 'relative')

      if (wConfig.social) {

        var social = [ 'facebook', 'linkedin', 'twitter' ]
        var socialCount = social.length
        var outerWidth = sSocial.w
        var innerWidth = (socialCount - 1) * self.settings.social.horSpacing + socialCount * self.settings.social.iconDiameter
        var leftOffset = sSocial.p.left + (outerWidth - innerWidth) / 2
        social.forEach((s, i) => {
          var icon = helpers.makeIcon(widgetId, wConfig, s, targetElementAttrId)
          icon.css({
            position: 'absolute',
            width: 32,
            height: 32,
            top: sSocial.p.top - 3,
            left: leftOffset - 5 + i * (self.settings.social.iconDiameter + self.settings.social.horSpacing)
          })

          $(wSelector).append(icon)
        })
      }

      /**********************************************************************
       * INSERT LINKBOX
       */

      if (wObj.config.linkbox) {
        var linkboxClickHandler = function linkboxClickHandler() {
          return window.open("http://" + wObj.config.linkbox);
        };
        var rect = svg.append("rect").attr({
          x: sLinkbox.m.left,
          y: sLinkbox.p.top,
          width: sLinkbox.w,
          height: sLinkbox.h,
          fill: "rgb(188,188,188)"
        }).on('click', linkboxClickHandler).style('cursor', 'pointer');
        svg.append("text").text(wObj.config.linkbox).attr({
          "font-family": sLinkboxFont,
          "font-size": sLinkboxSize,
          fill: "white",
          x: sLinkbox.m.left + sLinkbox.pad.left,
          y: sLinkbox.p.top + sLinkbox.pad.top + sLinkboxTextHeight - 3 // number 3 found through trial and error...
        }).style("font", sLinkboxStyle).on('click', linkboxClickHandler).style('cursor', 'pointer');
      }
    };

    /**********************************************************************
     * DONUT WIDGET
     */

    /*****************************************************************************************************************
     *                                                                                                               *
     *  wrapper:                                                                                                     *
     *  ***********************************************************************************************************  *
     *  *                                                                                                         *  *
     *  *  main:                                                             sidebar:                             *  *
     *  *  -----------------------------------------------------------       ----------------------------------   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  |  donutZone:                                             |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |  donut:                         |                    |       |                                |   *  *
     *  *  |  |  --------------------------     |                    |       |                                |   *  *
     *  *  |  |  |                         |    |                    |       |                                |   *  *
     *  *  |  |  |  title:                 |    |                    |       |                                |   *  *
     *  *  |  |  |  -------------------    |    |                    |       |                                |   *  *
     *  *  |  |  |  |                 |    |    |                    |       |                                |   *  *
     *  *  |  |  |  -------------------    |    |                    |       |                                |   *  *
     *  *  |  |  |                         |    |                    |       |                                |   *  *
     *  *  |  |  ---------------------------    |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  |  subtitle:                                              |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  |  description:                                           |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  |  source:                                                |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  |  social:                                                |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  |                                 |                    |       |                                |   *  *
     *  *  |  -----------------------------------                    |       |                                |   *  *
     *  *  |                                                         |       |                                |   *  *
     *  *  -----------------------------------------------------------       ----------------------------------   *  *
     *  *                                                                                                         *  *
     *  *                                                                                                         *  *
     *  ***********************************************************************************************************  *
     *  *                                                                                                            *
     *  *                                                                                                            *
     * ***************************************************************************************************************
     */


    self.drawWidgetDonut = function (widgetId)
    {
      var wConfig = self.widgets[widgetId].widgetObject.config;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      wConfig.widgetId = widgetId

      $(wSelector).empty();
      $(wSelector).css('padding', 0);

      var target = $(wSelector)
      var w      = target.innerWidth(),
          h      = target.innerHeight()

      var wrapperBox = self.calcBoxes(wConfig, wData, w, h)

      var svg = d3.select(wSelector).append("svg").attr({
        width: w,
        height: h
      })

      var {gWrapper, gMain, gSidebar, gLegend, gDonutZone, gDonut, gDonutTitle, gSocial, gSource, gDescription, gSubtitle} =
            self.drawWidgetDonutGs(svg, wrapperBox)

      self.drawWidgetDonutDonut(gDonut, wrapperBox, wData)

      if (wConfig.title){
        var donutTitleData = helpers.evaluateMaxSize({
          maxWidth: wrapperBox.main.donutZone.donut.title.w,
          maxHeight: wrapperBox.main.donutZone.donut.title.h,
          text: wConfig.title,
          fontFamily: self.settings.title.fontFamily,
          lineSpacing: 3
        })

        var titleHeight = donutTitleData.lineHeight * donutTitleData.lines.length + donutTitleData.lineSpacing * (donutTitleData.lines.length - 1 )
        var topOffset   = (wrapperBox.main.donutZone.donut.title.h - titleHeight) / 2
        gDonutTitle.selectAll("text").data(donutTitleData.lines).enter().append("text")
          .attr({
            "x": wrapperBox.main.donutZone.donut.title.w / 2,
            "y": (line, i) =>
            {
              var lineHeight = helpers.getTextHeight(line, self.settings.subtitle.style)
              return topOffset + donutTitleData.lineHeight * (i + self.settings.title.magicLineHeightMultiplier) + i * donutTitleData.lineSpacing
            },
            "font-family": self.settings.title.fontFamily,
            "font-size": donutTitleData.linePxSize,
            "text-anchor": "middle",
            "font-weight": self.settings.title.fontWeight,
            "fill": self.settings.title.fontColor
          }).text(d => d)
      }

      // {lines, linePxSize, lineHeight, lineSpacing, style}

      // We can draw "guide rectangles" during debugging
      //self.drawWidgetGuideRectangles(wConfig, wData, wrapperBox, gLegend, gSocial, gSource, gSubtitle, gDonutTitle)

      if (wConfig.legend){
        self.drawWidgetDonutLegend(wConfig, wData, gLegend)
      }
      if (wConfig.social) {
        self.drawWidgetDonutSocial(widgetId, wConfig, wData, gSocial, wrapperBox, targetElementAttrId)
      }
      if (wConfig.source){
        self.drawWidgetDonutSource(wConfig, wData, gSource, wrapperBox)
      }
      if (wConfig.description){
        self.drawWidgetDonutDescription(wConfig, wData, gDescription, wrapperBox)
      }
      if (wConfig.subtitle) {
        self.drawWidgetDonutSubtitle(wConfig, wData, gSubtitle, wrapperBox)
      }
    }

    self.drawWidgetDonutGs = function(svg, wrapperBox)
    {
      var gWrapper    = svg.append("g").attr({
        transform: `translate(${wrapperBox.x}, ${wrapperBox.y})`,
        class: "wrapper"
      })
      var gMain       = gWrapper.append("g").attr({
        transform: `translate(${wrapperBox.main.x}, ${wrapperBox.main.y})`,
        class: "main"
      })
      var gSidebar    = gWrapper.append("g").attr({
        transform: `translate(${wrapperBox.sidebar.x}, ${wrapperBox.sidebar.y})`,
        class: "sidebar"
      })
      var gLegend     = gSidebar.append("g").attr({
        transform: `translate(${wrapperBox.sidebar.legend.x}, ${wrapperBox.sidebar.legend.y})`,
        class: "legend"
      })
      var gDonutZone  = gMain.append("g").attr({
        transform: `translate(${wrapperBox.main.donutZone.x}, ${wrapperBox.main.donutZone.y})`,
        class: "donutZone"
      })
      var gDonut      = gDonutZone.append("g").attr({
        transform: `translate(${wrapperBox.main.donutZone.donut.x}, ${wrapperBox.main.donutZone.donut.y})`,
        class: "donut"
      })
      var gDonutTitle = gDonut.append("g").attr({
        transform: `translate(${wrapperBox.main.donutZone.donut.title.x}, ${wrapperBox.main.donutZone.donut.title.y})`,
        class: "donutTitle"
      })
      var gSocial     = gMain.append("g").attr({
        transform: `translate(${wrapperBox.main.social.x}, ${wrapperBox.main.social.y})`,
        class: "social"
      })
      var gSource     = gMain.append("g").attr({
        transform: `translate(${wrapperBox.main.source.x}, ${wrapperBox.main.source.y})`,
        class: "source"
      })
      var gDescription= gMain.append("g").attr({
        transform: `translate(${wrapperBox.main.description.x}, ${wrapperBox.main.description.y})`,
        class: "subtitle"
      })
      var gSubtitle   = gMain.append("g").attr({
        transform: `translate(${wrapperBox.main.subtitle.x}, ${wrapperBox.main.subtitle.y})`,
        class: "subtitle"
      })

      return {gWrapper, gMain, gSidebar, gLegend, gDonutZone, gDonut, gDonutTitle, gSocial, gSource, gDescription, gSubtitle}
    }

    self.drawWidgetGuideRectangles = function (wConfig, wData, wrapperBox, gLegend, gSocial, gSource, gSubtitle, gDonutTitle)
    {
      gLegend.append("rect").attr({
        fill: "red",
        width: wrapperBox.sidebar.legend.w,
        height: wrapperBox.sidebar.legend.h
      })

      // Draw in gMain: social, source, subtitle
      // social
      gSocial.append("rect").attr({
        fill: "purple",
        x: 0,
        y: 0,
        width: wrapperBox.main.social.w,
        height: wrapperBox.main.social.h,
      })
      // source
      gSource.append("rect").attr({
        fill: "cyan",
        x: 0,
        y: 0,
        width: wrapperBox.main.source.w,
        height: wrapperBox.main.source.h,
      })
      // subtitle
      gSubtitle.append("rect").attr({
        fill: "orange",
        x: 0,
        y: 0,
        width: wrapperBox.main.subtitle.w,
        height: wrapperBox.main.subtitle.h,
      })

      gDonutTitle.append("rect").attr({
        fill: "yellow",
        x: 0,
        y: 0,
        width: wrapperBox.main.donutZone.donut.title.w,
        height: wrapperBox.main.donutZone.donut.title.h,
      })
    }

    self.drawWidgetDonutDonut = function(gDonut, wrapperBox, wData)
    {

      // All code in this function adapted from https://bl.ocks.org/mbostock/32bd93b1cc0fbccc9bf9

      var {w, h} = wrapperBox.main.donutZone.donut
      var outerRadius = w / 2
      var innerRadius = outerRadius - self.settings.donut.arcWidth

      var pie = d3.layout.pie()
        .value(d => d.d)

      var arc = d3.svg.arc()
        .padRadius(outerRadius)
        .innerRadius(innerRadius);

      var svg = gDonut.append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

      svg.selectAll("path")
        .data(pie(wData))
        .enter().append("path")
        .each(function(d) { d.outerRadius = outerRadius - (self.settings.donut.arcWidth * self.settings.donut.onHoeverarcWidthPercentageIncrease); })
        .attr("d", arc)
        .attr("fill", (d, i) => self.settings.colors[i % self.settings.colors.length])
        .on("mouseover", arcTween(outerRadius, 0))
        .on("mouseout", arcTween(outerRadius - (self.settings.donut.arcWidth * self.settings.donut.onHoeverarcWidthPercentageIncrease) , 150))
        .on("mousemove", d => {
          var containerX = Math.floor(d3.event.pageX)
          var containerY = Math.floor(d3.event.pageY)

          var tipLine1 = d.data.p
          var tipLine2 = helpers.formatDataNumber(d.data.d, "nb_NO")
          var tipLine1Width = helpers.getTextWidth(tipLine1, "14px Roboto")
          var tipLine2Width = helpers.getTextWidth(tipLine2, "20px Roboto")
          var maxWidth = Math.max(tipLine1Width, tipLine2Width)
          var offsetX = maxWidth / 2 + 13
          var offsetY = 85

          containerX -= offsetX
          containerY -= offsetY

          if ($(".nrcstat-donut-d3-tip").length == 0){
            var tipHtml = `<div class="nrcstat-donut-d3-tip n" style="position: absolute; opacity: 1; pointer-events: all; box-sizing: border-box; left: ${containerX}px; top: ${containerY}px;">` +
              `<span class="year">${tipLine1}</span>` +
              '<hr class="ruler">' +
              `<span class="number">${tipLine2}</span>` +
              '</div>'
            var tipHtmlElement = $(tipHtml).appendTo('body')
          } else {
            $(".nrcstat-donut-d3-tip").css({
              left: `${containerX}px`,
              top: `${containerY}px`
            })
          }
        })

      function arcTween(outerRadius, delay) {
        return function() {
          $(".nrcstat-donut-d3-tip").remove()
          d3.select(this).transition().delay(delay).attrTween("d", function(d) {
            var i = d3.interpolate(d.outerRadius, outerRadius);
            return function(t) { d.outerRadius = i(t); return arc(d); };
          });
        };
      }
    }

    self.drawWidgetDonutLegend = function (wConfig, wData, gLegend)
    {
      /*gLegend.selectAll("circle").data(labels).enter().append("circle")
       .attr({

       })*/

      var labels = wData.map(d => d.p)
      var colors = self.settings.colors

      gLegend.selectAll("text").data(labels).enter().append("text")
        .attr({
          "x": (d, i) => self.settings.legend.bulletPointRadius * 2 + self.settings.legend.horSpacing,
          "y": (d, i) =>
          {
            var lineHeight = helpers.getTextHeight(d, self.settings.legend.style)
            return lineHeight * (i + self.settings.legend.magicLineHeightMultiplier) + i * self.settings.legend.verSpacing
          },
          "font-family": self.settings.legend.labelFontFamily,
          "font-size": self.settings.legend.labelFontSizePx,
          "font-weight": self.settings.legend.labelFontWeight,
          "fill": self.settings.legend.labelFontColor
        })
        .text(d => d)

      gLegend.selectAll("circle").data(labels).enter().append("circle")
        .attr({
          "r": self.settings.legend.bulletPointRadius,
          "transform": (d, i) =>
          {
            var x          = self.settings.legend.bulletPointRadius
            var lineHeight = helpers.getTextHeight(d, self.settings.legend.style)
            var y          = lineHeight * (i + self.settings.legend.magicLineHeightMultiplier) + i * self.settings.legend.verSpacing - self.settings.legend.bulletPointRadius
            return `translate(${x},${y})`
          },
          "fill": (d, i) => colors[i % colors.length]
        })
    }

    self.drawWidgetDonutSocial = function (widgetId, wConfig, wData, gSocial, wrapperBox, targetElementAttrId)
    {
      const targetSelector = self.widgets[widgetId].targetSelector
      $(targetSelector).css('position', 'relative')
      var social      = ['facebook', 'linkedin', 'twitter']
      var socialCount = social.length
      var outerWidth  = wrapperBox.main.social.w
      var innerWidth  = (socialCount - 1) * self.settings.social.horSpacing + socialCount * self.settings.social.iconDiameter
      var leftOffset  = wrapperBox.x + (outerWidth - innerWidth) / 2
      social.forEach((s, i) =>
      {
        var icon = helpers.makeIcon(widgetId, wConfig, s, targetElementAttrId)
        icon.css({
          position: 'absolute',
          width: 32,
          height: 32,
          top: wrapperBox.y + wrapperBox.main.y + wrapperBox.main.social.y - 3,
          left: leftOffset + i * (self.settings.social.iconDiameter + self.settings.social.horSpacing)
        })

        $(targetSelector).append(icon)
      })


    }

    self.drawWidgetDonutSource = function (wConfig, wData, gSource, wrapperBox)
    {
      var textHeight = helpers.getTextHeight(wConfig.source, self.settings.source.style)
      gSource.append("text")
        .attr({
          "x": (wrapperBox.main.source.w) / 2,
          "y": textHeight * 0.8,
          "font-family": self.settings.source.fontFamily,
          "font-size": self.settings.source.fontSizePx,
          "text-anchor": "middle",
          "font-weight": self.settings.source.fontWeight,
          "fill": self.settings.source.fontColor
        })
        .text(wConfig.source)
    }

    self.drawWidgetDonutDescription = function (wConfig, wData, gDescription, wrapperBox)
    {
      var lines = wrapperBox.main.description.lines
      gDescription.selectAll("text").data(lines).enter().append("text")
        .attr({
          "x": wrapperBox.main.description.w / 2,
          "y": (line, i) =>
          {
            var lineHeight = helpers.getTextHeight(line, self.settings.description.style)
            return lineHeight * (i + self.settings.description.magicLineHeightMultiplier) + i * self.settings.description.lineSpacing
          },
          "font-family": self.settings.description.fontFamily,
          "font-size": self.settings.description.fontSizePx,
          "text-anchor": "middle",
          "font-weight": self.settings.description.fontWeight,
          "fill": self.settings.description.fontColor
        })
        .text(d => d)
    }

    self.drawWidgetDonutSubtitle = function (wConfig, wData, gSubtitle, wrapperBox)
    {
      var lines = wrapperBox.main.subtitle.lines
      gSubtitle.selectAll("text").data(lines).enter().append("text")
        .attr({
          "x": wrapperBox.main.subtitle.w / 2,
          "y": (line, i) =>
          {
            var lineHeight = helpers.getTextHeight(line, self.settings.subtitle.style)
            return lineHeight * (i + self.settings.subtitle.magicLineHeightMultiplier) + i * self.settings.subtitle.lineSpacing
          },
          "font-family": self.settings.subtitle.fontFamily,
          "font-size": self.settings.subtitle.fontSizePx,
          "text-anchor": "middle",
          "font-weight": self.settings.subtitle.fontWeight,
          "fill": self.settings.subtitle.fontColor
        })
        .text(d => d)
    }

    self.calcBoxes = function (wConfig, wData, w, h)
    {
      let wrapperLeftMargin = self.settings.wrapper.margin.left
      let wrapperRightMargin = self.settings.wrapper.margin.right

      // If max widthAdjust to max width if setting set
      if (wConfig.maxWidth && wConfig.maxWidth < w) {
        const leftRightMargin = (w - wConfig.maxWidth) / 2
        wrapperLeftMargin = wrapperRightMargin = leftRightMargin
      }

      var wrapperBox = {
        x: wrapperLeftMargin,
        y: self.settings.wrapper.margin.top,
        w: w - (wrapperLeftMargin + wrapperRightMargin),
        h: h - (self.settings.wrapper.margin.top + self.settings.wrapper.margin.bottom),
        main: {
          donutZone: {
            donut: {
              title: {}
            }
          },
          subtitle: {}, description: {}, source: {}, link: {}, legend: {}, social: {}
        },
        sidebar: {legend: {}}
      }

      // Calculation functions for sub-sections calculate their own w+h, the outer function (here calcBoxes) takes care of the x+y
      self.calcBoxSidebar(wConfig, wData, wrapperBox) // Box: Sidebar and its child legend
      self.calcBoxMain(wConfig, wData, wrapperBox) // Box: Main
      self.calcBoxSocial(wConfig, wData, wrapperBox) // Box: Social
      self.calcBoxSource(wConfig, wData, wrapperBox) // Box: Source
      self.calcBoxDescription(wConfig, wData, wrapperBox) // Box: Description
      self.calcBoxSubtitle(wConfig, wData, wrapperBox) // Box: Subtitle
      self.calcBoxDonutZone(wConfig, wData, wrapperBox) // Box: DonutZone, its child donut (+ its child title)

      wrapperBox.sidebar.legend.y = wrapperBox.sidebar.legend.y

      return wrapperBox
    }

    self.calcBoxSidebar = function (wConfig, wData, wrapperBox)
    {
      if (!wConfig.legend) {
        wrapperBox.sidebar.w = 0
        wrapperBox.sidebar.h = 0
        wrapperBox.sidebar.x = 0
        wrapperBox.sidebar.y = 0
        return
      }

      var legendLabels            = _(wData).map(d => d.p).value()
      var maxLegendLabelWidth     = helpers.calculateMaxTextWidthFromArray(legendLabels, self.settings.legend.labelStyle)
      var legendLabelHeight       = helpers.getTextHeight(legendLabels[0], self.settings.legend.labelStyle)
      wrapperBox.sidebar.legend.w = maxLegendLabelWidth + self.settings.legend.bulletPointRadius * 2 + self.settings.legend.horSpacing
      wrapperBox.sidebar.legend.h = legendLabelHeight * legendLabels.length + self.settings.legend.verSpacing * (legendLabels.length - 1)
      wrapperBox.sidebar.w        = wrapperBox.sidebar.legend.w
      wrapperBox.sidebar.h        = wrapperBox.h
      wrapperBox.sidebar.x        = wrapperBox.w - wrapperBox.sidebar.w
      wrapperBox.sidebar.y        = 0
      wrapperBox.sidebar.legend.x = 0
      wrapperBox.sidebar.legend.y = (wrapperBox.sidebar.h - wrapperBox.sidebar.legend.h) / 2
    }

    self.calcBoxMain = function (wConfig, wData, wrapperBox)
    {
      wrapperBox.main.h = wrapperBox.h
      wrapperBox.main.w = wrapperBox.sidebar.w > 0 ?
        wrapperBox.w - (wrapperBox.sidebar.w + self.settings.wrapper.horSpacing) :
        wrapperBox.w
      wrapperBox.main.x = 0
      wrapperBox.main.y = 0
    }

    self.calcBoxSocial = function (wConfig, wData, wrapperBox)
    {
      if (wConfig.social) {
        var socialBoxHeight    = self.settings.social.iconDiameter
        wrapperBox.main.social = {
          w: wrapperBox.main.w,
          h: socialBoxHeight,
          x: 0,
          y: wrapperBox.main.h - socialBoxHeight
        }
      } else {
        wrapperBox.main.social = {x: 0, y: wrapperBox.main.h, w: 0, h: 0}
      }
    }

    self.calcBoxSource = function (wConfig, wData, wrapperBox)
    {
      if (wConfig.source) {
        var sourceLabelHeight  = helpers.getTextHeight(wConfig.source, self.settings.source.style)
        var sourceLabelWidth   = helpers.getTextWidth(wConfig.source, self.settings.source.style)
        var sourceBoxHeight    = sourceLabelHeight
        wrapperBox.main.source = {
          w: wrapperBox.main.w,
          h: sourceBoxHeight,
          x: 0,
          y: wrapperBox.main.social.y - self.settings.social.topMargin - sourceBoxHeight,
          txtW: sourceLabelWidth,
          txtH: sourceLabelHeight,
        }
      } else {
        wrapperBox.main.source = {x: 0, y: wrapperBox.main.social.y, w: 0, h: 0}
      }
    }

    self.calcBoxDescription = function (wConfig, wData, wrapperBox)
    {
      if (wConfig.description) {
        var descriptionBoxWidth     = wrapperBox.main.w
        var r                    = helpers.splitTextToLines({
          availableWidth: descriptionBoxWidth,
          text: wConfig.description,
          textStyle: self.settings.description.style
        })
        var lineHeight           = r.lineHeight
        var lines                = r.lines
        var descriptionBoxHeight = lineHeight * lines.length + (lines.length - 1) * self.settings.description.lineSpacing
        wrapperBox.main.description = {
          w: descriptionBoxWidth,
          h: descriptionBoxHeight,
          x: 0,
          y: wrapperBox.main.source.y - self.settings.source.topMargin - descriptionBoxHeight,
          lines: lines
        }
      } else {
        wrapperBox.main.description = {x: 0, y: wrapperBox.main.source.y, w: 0, h: 0}
      }
    }

    self.calcBoxSubtitle = function (wConfig, wData, wrapperBox)
    {
      if (wConfig.subtitle) {
        var subtitleBoxWidth     = wrapperBox.main.w
        var r                    = helpers.splitTextToLines({
          availableWidth: subtitleBoxWidth,
          text: wConfig.subtitle,
          textStyle: self.settings.subtitle.style
        })
        var lineHeight           = r.lineHeight
        var lines                = r.lines
        var subtitleBoxHeight    = lineHeight * lines.length + (lines.length - 1) * self.settings.subtitle.lineSpacing
        wrapperBox.main.subtitle = {
          w: subtitleBoxWidth,
          h: subtitleBoxHeight,
          x: 0,
          y: wrapperBox.main.description.y - self.settings.description.topMargin - subtitleBoxHeight,
          lines: lines
        }
      } else {
        wrapperBox.main.subtitle = {x: 0, y: wrapperBox.main.description.y, w: 0, h: 0}
      }
    }

    self.calcBoxDonutZone = function (wConfig, wData, wrapperBox)
    {
      wrapperBox.main.donutZone       = {
        x: 0,
        y: 0,
        w: wrapperBox.main.w,
        h: wrapperBox.main.subtitle.y - self.settings.subtitle.topMargin
      }
      var donutDiameter               = Math.min(wrapperBox.main.donutZone.w, wrapperBox.main.donutZone.h)
      wrapperBox.main.donutZone.donut = {
        w: donutDiameter,
        h: donutDiameter,
        x: (wrapperBox.main.donutZone.w - donutDiameter) / 2,
        y: (wrapperBox.main.donutZone.h - donutDiameter) / 2
      }
      var donutTitleH, donutTitleY
      var donutOuterRadius            = donutDiameter / 2,
          donutInnerRadius            = donutOuterRadius - self.settings.donut.arcWidth,
          donutTitleW                 = donutTitleH = donutInnerRadius * (1 / Math.sqrt(2)) * 2,
          donutTitleX = donutTitleY = self.settings.donut.arcWidth + donutInnerRadius * (1 - 1 / Math.sqrt(2))
      wrapperBox.main.donutZone.donut.title = {
        w: donutTitleW,
        h: donutTitleH,
        x: donutTitleX,
        y: donutTitleY
      }

    }

    /**********************************************************************
     * BAR WIDGET
     */

    self.drawWidgetBar = function (widgetId) {
      var wObj = self.widgets[widgetId].widgetObject;
      var wConfig = wObj.config;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId;

      $(wSelector).empty();
      $(wSelector).css('padding', 0);

      var w, h, svg, g;

      svg = d3.select(wSelector).append("svg").attr("class", "nrcstat");

      /**********************************************************************
       * Take the width and height of the containing div and apply it to the
       * svg we've drawn inside of it
       */

      w = $(wSelector).innerWidth();
      h = $(wSelector).innerHeight();

      svg.attr("width", w).attr("height", h);

      /**********************************************************************
       * Precalculate how much height is needed for the title section
       */

      var sTitleLeftMargin = 5,
          sTitleRightMargin = 5,
          sTitleFont = "Roboto Condensed",
          sTitleSize = "24px",
          sTitleStyle = sTitleSize + " " + sTitleFont,
          sTitleColor = "#333"

      var sTitleLines = helpers.splitTextToLines({
        availableWidth: w - sTitleLeftMargin - sTitleRightMargin,
        text: wObj.config.title,
        textStyle: sTitleStyle
      });
      var sTitleHeight = sTitleLines.lines.length * sTitleLines.lineHeight;

      /**********************************************************************
       * Precalculate how much width is needed for the numbers in the x-axis
       */

      var sChartFont = "Roboto Condensed",
          sChartSize = "14px",
          sChartStyle = sChartSize + " " + sChartFont,
          sChartYAxisWidths = map(flattenDeep(wData), function (d) {
            var dStr = helpers.formatDataNumber(d.d, wConfig.locale)
            return helpers.getTextWidth(dStr, sChartStyle);
          }),
          sChartYAxisWidth = max(sChartYAxisWidths) + 10,
          // this "magic" number 10 is needed for some reason
          sChartYAxisMarginLeft = 5,
          sChartYAxisMarginRight = 5,
          sChartMaxColumnWidth = 100;

      var sChartBarLabelFont = "Roboto Condensed",
          sChartBarLabelFontSize = "14px",
          sChartBarLabelFontWeight = "bold",
          sChartBarLabelStyle = "14px Roboto Condensed bold"

      /**********************************************************************
       * Prepare linkbox calculations
       */

      var sLinkboxFont = "Roboto Condensed",
          sLinkboxSize = "13px",
          sLinkboxStyle = "13px Roboto Condensed",
          sLinkboxTextWidth = helpers.getTextWidth(wObj.config.linkbox, sLinkboxStyle),
          sLinkboxTextHeight = helpers.getTextHeight(wObj.config.linkbox, sLinkboxStyle),
          sLinkboxPaddingHorizontal = 20,
          sLinkboxPaddingVertical = 3;

      /**********************************************************************
       * Prepare helper objects to get a good overview on the following
       * sections of the bar widget:
       * - Chart
       * - Title
       * - Source
       * - Social
       */

      var sChart = {
        h: null,
        m: {
          top: 15,
          right: 15,
          bottom: 5,
          left: sChartYAxisWidth + sChartYAxisMarginLeft + sChartYAxisMarginRight,
          leftRightBottomRect: 30
        },
        s: 'chart'
      },
          sTitle = {
            h: sTitleHeight,
            m: { top: 25, right: sTitleRightMargin, bottom: 5, left: sTitleLeftMargin },
            s: 'title',
            l: sTitleLines
          },
          sSource = { h: 10, m: { top: 5, right: 5, bottom: 5, left: 5 }, s: 'source' },
          sSocial = { h: 32, m: { top: 5, right: 5, bottom: 10, left: 5 }, s: 'social', spacing: 10 },
          sLinkbox = {
            h: sLinkboxTextHeight + sLinkboxPaddingVertical * 2,
            w: sLinkboxTextWidth + sLinkboxPaddingHorizontal * 2,
            m: { top: 0, right: 0, bottom: 0, left: 0 },
            pad: {
              top: sLinkboxPaddingVertical,
              right: sLinkboxPaddingHorizontal,
              bottom: sLinkboxPaddingVertical,
              left: sLinkboxPaddingHorizontal
            },
            s: 'linkbox'
          }
      if (!wConfig.social) sSocial = { h: 0, m: { top: 0, right: 0, bottom: 0, left: 0 }, s: 'social', spacing: 0 }
      var sections = [sChart, sTitle, sSource, sSocial, sLinkbox]
      var colMargin = 5;

      /**********************************************************************
       * SECTION CALCULATIONS
       */

      var totalHeight = 0;
      sections = map(sections, function (o) {
        var sectionW = w - (o.m.left + o.m.right);
        if (o.s != "linkbox") o.w = sectionW;
        if (o.s != "chart") totalHeight += o.m.top + o.h + o.m.bottom;
        return o;
      });
      sChart.h = h - totalHeight - (sChart.m.top + sChart.m.bottom);

      var cumulativeHeight = 0;

      /** Calculate position objects **/

      sections = map(sections, function (o, i) {
        if (i > 0) {
          cumulativeHeight += sections[i - 1].m.top + sections[i - 1].h + sections[i - 1].m.bottom;
        }

        o.p = {
          top: o.m.top + cumulativeHeight,
          right: o.m.right,
          bottom: o.m.bottom + cumulativeHeight,
          left: o.m.left
        };

        return o;
      });

      /**********************************************************************
       * Remove all old elements from the svg since we are re-rendering
       * everything
       */

      svg.selectAll().remove();

      /**********************************************************************
       * INSERT BACKGROUND
       */

      if (wObj.config.drawBackground) {
        svg.append("rect").attr({
          x: 0,
          y: 0,
          width: w,
          height: h,
          fill: "rgb(236,236,236)"
        });
      }

      /**********************************************************************
       * INSERT AXES + COLUMN RECTANGLES
       */

      var ticks = 5;
      var yMax = d3.max(flatten(wData), function (v) {
        return v.d;
      });
      yMax += yMax / ticks;

      var yScale = d3.scale.linear().domain([0, yMax]).range([0, sChart.h]);

      var yScaleAxis = d3.scale.linear().domain([0, yMax]).range([sChart.h, 0]);
      var yAxis = d3.svg.axis().scale(yScaleAxis).orient("left").ticks(ticks).tickFormat(function (d) {
        return ;
      });

      svg.append("g").attr("class", "y-axis").attr("transform", "translate(" + (sChartYAxisMarginLeft + sChartYAxisWidth) + "," + sChart.p.top + ")").call(yAxis);

      /**********************************************************************
       * DRAW HORIZONTAL Y AXIS LINES
       */

      svg.append("g").attr("class", "grid").attr("transform", "translate(" + sChart.m.left + "," + sChart.p.top + ")").call(yAxis.tickSize(-sChart.w, 0, 0).tickFormat(""));

      /**********************************************************************
       * DRAW BOTTOM RECTANGLE
       */

      svg.append("rect").attr("width", sChart.w).attr("height", 30).attr("x", sChart.p.left).attr("y", sChart.p.top + sChart.h - 15).attr("fill", "rgb(240,240,240)");

      /**********************************************************************
       * INSERT RECTANGLES + TOOLTIPS
       */

      var chartAreaWidth = sChart.w - sChart.m.leftRightBottomRect * 2;

      var colWidth = chartAreaWidth / wData.length - colMargin;

      var leftExtra = 0;

      if (colWidth > sChartMaxColumnWidth) {
        colWidth = sChartMaxColumnWidth;
        var newChartAreaWidth = colWidth * wData.length;
        var leftExtra = (chartAreaWidth - newChartAreaWidth) / 2;
        chartAreaWidth = newChartAreaWidth;
      }

      var tip = d3.tip().attr('class', 'nrcstat-d3-tip').html(function (d) {
        var data = helpers.formatDataNumber(d.d, wConfig.locale)
        return '<span class="year">' + d.p + '</span>' + '<hr class="ruler" />' + '<span class="number">' + data + '</span>';
      }).offset([-10, 0]);
      g = svg.append("g");
      g.attr("transform", "translate(" + (sChart.m.left + sChart.m.leftRightBottomRect + leftExtra) + "," + sChart.m.top + ")");

      g.call(tip);

      g.selectAll("rect").remove();
      g.selectAll("rect").data(wData).enter().append("rect").attr({
        "x": function x(d, i) {
          return i * (chartAreaWidth / wData.length) + colMargin;
        },
        "y": function y(d) {
          return sChart.h - yScale(d.d);
        },
        "width": colWidth - colMargin,
        "height": function height(d) {
          return yScale(d.d);
        },
        "fill": function fill(d) {
          if (includes(wObj.years, wObj.highlightYear)) {
            if (d.y == wObj.highlightYear) return "rgb(253,199,47)";else return "rgb(121,121,121)";
          } else {
            return "rgb(253,199,47)";
          }
        }
      }).on('mouseover', tip.show).on('mouseout', tip.hide);

      /************************************************
       * INSERT TEXT
       */

      g.selectAll("text").data(wData).enter().append("text")
        .text(function (d) {
          return d.b;
        })
        .attr({
          "font-family": sChartBarLabelFont,
          "font-size": sChartBarLabelFontSize,
          "font-weight": sChartBarLabelFontWeight
        })
        .attr("transform", function (d, i) {
          var x = i * (chartAreaWidth / wData.length) + colMargin + colWidth / 2 + 5,
              y = sChart.h - 25;
          return "translate(" + x + "," + y + ")rotate(270)";
        });

      /**********************************************************************
       * INSERT TITLE
       */

      each(sTitle.l.lines, function (line, i) {
        svg.append("text").attr("class", "title").text(line).attr("text-anchor", "middle").attr("x", sTitle.p.left + sTitle.w / 2).attr("y", sTitle.p.top + i * sTitle.l.lineHeight + sTitle.l.lineHeight / 2)
        //.attr("transform", "translate(" + sTitle.p.left + "," + sTitle.p.top + ")")
          .attr("font-family", sTitleFont).attr("font-size", sTitleSize)
          .attr("fill", sTitleColor)
        //.attr("font-weight", "bold")
      });

      /**********************************************************************
       * INSERT SOURCE
       */

      svg.append("text").attr("class", "source").text(wObj.config.source).attr("text-anchor", "middle").attr("x", sSource.p.left + sSource.w / 2).attr("y", sSource.p.top + sSource.h / 2)
      //.attr("transform", "translate(" + sTitle.p.left + "," + sTitle.p.top + ")")
        .attr("font-family", "Roboto").attr("font-size", "15px").attr("font-weight", "").style("fill", "#8C8C8C").style("border-width", "1px");

      /**********************************************************************
       * INSERT SOCIAL
       */
      if (wConfig.social) {
        $(wSelector).css('position', 'relative')
        var social = [ 'facebook', 'linkedin', 'twitter' ]
        var socialCount = social.length
        var outerWidth = w
        var innerWidth = (socialCount - 1) * self.settings.social.horSpacing + socialCount * self.settings.social.iconDiameter
        var leftOffset = sSocial.p.left + (outerWidth - innerWidth) / 2
        social.forEach((s, i) => {
          var icon = helpers.makeIcon(widgetId, wConfig, s, targetElementAttrId)
          icon.css({
            position: 'absolute',
            width: 32,
            height: 32,
            top: sSocial.p.top - 3,
            left: leftOffset - 5 + i * (self.settings.social.iconDiameter + self.settings.social.horSpacing)
          })

          $(wSelector).append(icon)
        })
      }

      /**********************************************************************
       * INSERT LINKBOX
       */

      if (wObj.config.linkbox) {
        var linkboxClickHandler = function linkboxClickHandler() {
          return window.open("http://" + wObj.config.linkbox);
        };
        var rect = svg.append("rect").attr({
          x: (w - sLinkbox.w) / 2,
          y: sLinkbox.p.top + 30,
          width: sLinkbox.w,
          height: sLinkbox.h,
          fill: "rgb(188,188,188)"
        }).on('click', linkboxClickHandler).style('cursor', 'pointer');
        svg.append("text").text(wObj.config.linkbox).attr({
          fill: "white",
          x: (w - sLinkbox.w) / 2 + sLinkbox.pad.left,
          y: h - sLinkbox.h + sLinkbox.pad.top + sLinkboxTextHeight - 3 + 30 // number 3 found through trial and error...
        }).style("font", sLinkboxStyle).on('click', linkboxClickHandler).style('cursor', 'pointer');
      }
    };

    /** TABLE WIDGET **/




    self.getTextWidth = function (text, textStyle) {
      var svg = d3.select("body").append("svg");
      svg.attr({
        width: "1000",
        height: "1000"
      })

      var text = svg.append("text").style("font", textStyle).text(text);

      var bbox = text.node().getBBox();

      svg.remove();

      return bbox.width;
    };

    self.drawWidgetBarHorizontal = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawWidgetBarHorizontal(wObject, wData, wSelector)
    }

    self.drawWidgetTableV2 = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawWidgetTable(wObject, wData, wSelector)
    }

    self.drawWidgetMainmap = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawWidgetMainmap(wObject, wData, wSelector)
    }

    self.drawWidgetMainmapV2 = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawWidgetMainmapV2(wObject, wData, wSelector)
    }

    self.drawWidgetGlobalDisplacementRadialBarChartMap = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawWidgetGlobalDisplacementRadialBarChartMap(wObject, wData, wSelector)
    }

    self.drawCountryDashboard = function(widgetId){
      var wObject = self.widgets[widgetId].widgetObject;
      var wData = self.widgets[widgetId].data;
      var wSelector = self.widgets[widgetId].targetSelector;
      var targetElementAttrId = self.widgets[widgetId].targetElementAttrId
      drawCountryDashboard(wObject, wData, wSelector);
    }

    /**********************************************************************
     * INITALIAZATION OF WIDGET LIBRARY
     */

    var API_URL = "https://api.nrcdata.no/api",
        ASSETS_URL = "https://lib.nrcdata.no",
        FACEBOOK_SVG = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="97.75px" height="97.75px" viewBox="0 0 97.75 97.75" style="enable-background:new 0 0 97.75 97.75;" xml:space="preserve"><g><path d="M48.875,0C21.882,0,0,21.882,0,48.875S21.882,97.75,48.875,97.75S97.75,75.868,97.75,48.875S75.868,0,48.875,0zM67.521,24.89l-6.76,0.003c-5.301,0-6.326,2.519-6.326,6.215v8.15h12.641L67.07,52.023H54.436v32.758H41.251V52.023H30.229V39.258h11.022v-9.414c0-10.925,6.675-16.875,16.42-16.875l9.851,0.015V24.89L67.521,24.89z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
        FACEBOOK_PNG = 'data:image/png;base64,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',
        TWITTER_SVG = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	width="97.75px" height="97.75px" viewBox="0 0 97.75 97.75" style="enable-background:new 0 0 97.75 97.75;" xml:space="preserve"><g><path d="M48.875,0C21.882,0,0,21.882,0,48.875S21.882,97.75,48.875,97.75S97.75,75.868,97.75,48.875S75.868,0,48.875,0z	 M78.43,35.841c0.023,0.577,0.035,1.155,0.035,1.736c0,20.878-15.887,42.473-42.473,42.473c-8.127,0-16.04-2.319-22.883-6.708c-0.143-0.091-0.202-0.268-0.145-0.427c0.057-0.158,0.218-0.256,0.383-0.237c1.148,0.137,2.322,0.205,3.487,0.205c6.323,0,12.309-1.955,17.372-5.664c-6.069-0.512-11.285-4.619-13.161-10.478c-0.039-0.122-0.011-0.255,0.073-0.351c0.085-0.096,0.215-0.138,0.339-0.115c1.682,0.319,3.392,0.34,5.04,0.072c-6.259-1.945-10.658-7.808-10.658-14.483l0.002-0.194c0.003-0.127,0.072-0.243,0.182-0.306c0.109-0.064,0.245-0.065,0.355-0.003c1.632,0.906,3.438,1.488,5.291,1.711c-3.597-2.867-5.709-7.213-5.709-11.862c0-2.682,0.71-5.318,2.054-7.623c0.06-0.103,0.166-0.169,0.284-0.178c0.119-0.012,0.234,0.04,0.309,0.132c7.362,9.03,18.191,14.59,29.771,15.305c-0.193-0.972-0.291-1.974-0.291-2.985c0-8.361,6.802-15.162,15.162-15.162c4.11,0,8.082,1.689,10.929,4.641c3.209-0.654,6.266-1.834,9.09-3.508c0.129-0.077,0.291-0.065,0.41,0.028c0.116,0.094,0.164,0.25,0.118,0.394c-0.957,2.993-2.823,5.604-5.33,7.489c2.361-0.411,4.652-1.105,6.831-2.072c0.146-0.067,0.319-0.025,0.424,0.098c0.104,0.124,0.113,0.301,0.023,0.435C83.759,31.175,81.299,33.744,78.43,35.841z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
        TWITTER_PNG = 'data:image/png;base64,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',
        LINKEDIN_PNG = 'data:image/png;base64,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',
        INSTAGRAM_SVG = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="97.75px" height="97.75px" viewBox="0 0 97.75 97.75" style="enable-background:new 0 0 97.75 97.75;" xml:space="preserve"><g><g><ellipse cx="48.944" cy="48.719" rx="14.465" ry="14.017"/><path d="M71.333,49.501c0,11.981-10.024,21.692-22.389,21.692s-22.389-9.711-22.389-21.692c0-2.147,0.324-4.221,0.924-6.18h-6.616v30.427c0,1.576,1.288,2.863,2.863,2.863h50.159c1.576,0,2.865-1.287,2.865-2.863V43.321h-6.341C71.008,45.28,71.333,47.354,71.333,49.501z"/><path d="M65.332,35.11h8.141c1.784,0,3.242-1.458,3.242-3.242v-7.762c0-1.785-1.458-3.243-3.242-3.243h-8.141c-1.785,0-3.243,1.458-3.243,3.243v7.762C62.088,33.651,63.547,35.11,65.332,35.11z"/><path d="M48.875,0C21.882,0,0,21.882,0,48.875S21.882,97.75,48.875,97.75S97.75,75.868,97.75,48.875S75.868,0,48.875,0zM75.645,84.891H22.106c-5.087,0-9.246-3.765-9.246-9.244V22.105c0-5.481,4.159-9.245,9.246-9.245h53.539c5.086,0,9.246,3.764,9.246,9.245v53.542C84.891,81.126,80.73,84.891,75.645,84.891z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>g',
        STATUS_LOADING = 1,
        STATUS_ERROR = 2,
        STATUS_SUCCESS = 3,
        LINE_WIDGET_COLOURS = ["#ff9e47", "#9abcba", "#dfc354", "#d37947", "#3b9eaa", "#3c845d", "#c3b071", "#eae7dd", "#d3d3d3", "#ededed"];
    var WIDGET_TYPE_MAP = {
      "map": self.drawWidgetMap,
      "line": self.drawWidgetLine,
      "donut": self.drawWidgetDonut,
      "bar": self.drawWidgetBar,
      "bar-horizontal": self.drawWidgetBarHorizontal,
      "table": self.drawWidgetTableV2,
      "mainmap": self.drawWidgetMainmap,
      "mainmapv2": self.drawWidgetMainmapV2,
      "global-displacement-radial-bar-chart-map": self.drawWidgetGlobalDisplacementRadialBarChartMap,
      "dynamic-country-dashboard": self.drawCountryDashboard,
    };
    var LANG_EXPLORE_MAP = { "en_US": "EXPLORE MAP", "nb_NO": "UTFORSK KART" },
        LANG_END_MAP_EXPLORE = { "en_US": "END EXPLORATION", "nb_NO": "AVSLUTT UTFORSKNING" };

    self.settings = {
      colors: ["#ff9e47", "#9abcba", "#dfc354", "#d37947", "#3b9eaa", "#3c845d", "#c3b071", "#eae7dd", "#d3d3d3", "#ededed"],
      wrapper: {
        horSpacing: 10,
        margin: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      },
      legend: {
        bulletPointRadius: 7,
        horSpacing: 5,
        verSpacing: 5,
        labelFontFamily: "Roboto Condensed", /* KEEP THESE IN SYNC!! */
        labelFontSize: 20,
        labelFontSizePx: "20px",
        labelStyle: "20px Roboto Condensed", /* include "bold" at end of this string if fontWeight = bold */
        labelFontWeight: "",
        labelFontColor: "black",
        magicLineHeightMultiplier: 1.2
      },
      social: {
        iconDiameter: 32,
        horSpacing: 10,
        topMargin: 15
      },
      source: {
        fontFamily: "Roboto",
        fontSize: 15,
        fontSizePx: "15px",
        style: "15px Roboto", /* include "bold" at end of this string if fontWeight = bold */
        fontWeight: "",
        fontColor: "greys",
        magicLineHeightMultiplier: 0.75,
        topMargin: 10
      },
      subtitle: {
        fontFamily: "Roboto", /* KEEP THESE IN SYNC!! */
        fontSize: 18,
        fontSizePx: "18px",
        style: "18px Roboto", /* include "bold" at end of this string if fontWeight = bold */
        fontWeight: "",
        fontColor: "black",
        magicLineHeightMultiplier: 0.75,
        lineSpacing: 10,
        topMargin: 10
      },
      description: {
        fontFamily: "Roboto", /* KEEP THESE IN SYNC!! */
        fontSize: 15,
        fontSizePx: "15px",
        style: "15px Roboto", /* include "bold" at end of this string if fontWeight = bold */
        fontWeight: "",
        fontColor: "black",
        magicLineHeightMultiplier: 0.75,
        lineSpacing: 2,
        topMargin: 5
      },
      title: {
        // TODO: including "bold" in the next line crashes the engine, fix this
        fontFamily: "Roboto", /* include "bold" at end of this string if fontWeight = bold */
        fontWeight: "bold",
        fontColor: "#333",
        magicLineHeightMultiplier: 0.75,
        lineSpacing: 5,
      },
      donut: {
        arcWidth: 40,
        onHoeverarcWidthPercentageIncrease: 0.2
      }
    }

    self.initFacebookSharing = function() {
      if (typeof FB == "undefined"){
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '1769614713251596',
            xfbml      : true,
            version    : 'v2.8'
          });
          FB.AppEvents.logPageView();
        };

        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }
    }

    self.initWebFontLoaderRoboto = function() {
      window.WebFontConfig = {
        active: function(){
          self.robotoLoaded = true
        },
        google: {
          families: [
              'Roboto:200,300,400,700',
              'Roboto+Condensed:400'
          ]
        }
      };

      (function(d) {
        var wf = d.createElement('script'), s = d.scripts[0];
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
        wf.async = true;
        s.parentNode.insertBefore(wf, s);
      })(document);
    }

    self.initTooltip = function() {
      //$(document).tooltip()
    }

    self.init = function () {
      self.widgets = {};
      self.initFacebookSharing()
      self.initWebFontLoaderRoboto()
      self.initTooltip()
      d3.select(window).on('resize', self.onResize);
    }();
  }

  /**********************************************************************
   * SINGLETON PATTERN IMPLEMENTATION
   */

var instance;

function createInstance() {
var object = new WidgetLibrary();
return object;
}

export function getInstance() {
  if (!instance) {
    instance = createInstance();
  }
  return instance;
}

