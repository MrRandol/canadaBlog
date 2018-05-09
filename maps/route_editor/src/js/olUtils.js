import uid from 'uid'
import * as ol from 'openlayers'

import * as Style from './style.js'


export function createMap() {
   // Base Layer
    var bing = new ol.layer.Tile({
      visible: true,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: process.env.REACT_APP_BING_KEY,
        imagerySet: process.env.REACT_APP_BING_LAYER, 
        maxZoom: process.env.REACT_APP_BING_MAX_ZOOM
      })
    })

    // Route Layer (edit mode = can draw)
    var drawing_source = new ol.source.Vector({
      url: process.env.REACT_APP_ROUTE_KML_URL,
      format: new ol.format.KML({extractStyles:false}),
    });
    var drawing_route = new ol.layer.Vector({ 
      source: drawing_source,
      style: Style.routePlacemarkStyleFunction
    });

    // Automatic route drawing : takes all the points and binds them together
    var auto_route = new ol.layer.Vector({ 
      source: new ol.source.Vector(),
      style: Style.routeLineStyleFunction
    });

    var map = new ol.Map({
      layers: [bing, auto_route, drawing_route],
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
      ]),
      target: 'map',
      view: new ol.View({
        center: [-11000000, 7800000],
        zoom: 4
      })
    });

    // Drawing controls
    var modify = new ol.interaction.Modify({source: drawing_source});
    var draw = new ol.interaction.Draw({ source: drawing_source, type: 'Point', style: Style.drawingPointerStyleFunction });
    var snap = new ol.interaction.Snap({source: drawing_source});
    map.addInteraction(modify);
    map.addInteraction(draw);
    map.addInteraction(snap);

    draw.on('drawend', (event) => {
      if (event && event.feature) {
        event.feature.setId(uid())
        event.feature.set("index", drawing_source.getFeatures().length+1)
      }
    })


    // Listeners
    drawing_source.on('change', () => {
      var features = drawing_source.getFeatures().sort(featureSortingFunction)
      fill_auto_route_layer(features, auto_route)
    })

    return {map, drawing_route}
}

export function fill_auto_route_layer(features, auto_route) {

  if (!features || features.length <= 0) {
    return
  }

  var coordinates = []
  var feature
  for (var index = 0; index < features.length; index++) { 
    feature = features[index]
    coordinates.push(feature.getGeometry().getCoordinates())
  }

  var source = new ol.source.Vector({
    features: [new ol.Feature({
      geometry: new ol.geom.LineString(coordinates),
      name: 'Line'
    })]
  })

  auto_route.setSource(source)
}

export function generateKmlFromFeatures(f) {
  var format = new ol.format.KML({extractStyles:false, writeStyles:true})
  var features = f.sort(featureSortingFunction)
  var options = {featureProjection: "EPSG:3857", dataProjection: "EPSG:4326", decimals:2}
  return format.writeFeatures(features, options)
}

export function featureSortingFunction(f1, f2) {
  var i1 = f1.get("index") || 0
  var i2 = f2.get("index") || 0
  return i1 - i2
}

/********************************

    Generic feature actions

********************************/  

export function handleFeatureAction(action, feature, opts) {
  switch(action) {
    case "DELETE":
      deleteFeature(opts.layer, feature)
    break;
    case "UPDATE_INDEX":
      changeFeatureIndex(feature, opts.features, opts.new_index)
    break;
    default: 
      console.log("Feature action not existing !")
  }
}

function deleteFeature(layer, feature) {
  var drawing_source = layer.getSource()
  drawing_source.on('removefeature', (e) => {
    var features = drawing_source.getFeatures().sort(featureSortingFunction)
    for (var i=1; i<=features.length; i++) {
      var f = features[i-1]
      if (f) {
        f.set('index', i)
      }
    }
    drawing_source.un("removefeature");
  })

  drawing_source.removeFeature(feature)
}

export function changeFeatureIndex(feature, unsorted_features, _new_index) {
  var features = unsorted_features.sort(featureSortingFunction)

    var current_index = feature.get("index") - 1
    // This is done because we use "display" index (starts at 1 not 0)
    var new_index = _new_index - 1

    if (new_index > -1 && new_index < features.length) {
      var temp_element = features.splice(current_index, 1)[0]
      features.splice(new_index, 0, temp_element)
    }
    for (var i=1; i<=features.length; i++) {
      var f = features[i-1]
      if (f) {
        f.set('index', i)
      }
    }
}