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
    var draw = new ol.interaction.Draw({ source: drawing_source, type: 'Point' });
    var snap = new ol.interaction.Snap({source: drawing_source});
    map.addInteraction(modify);
    map.addInteraction(draw);
    map.addInteraction(snap);


    // Listeners
    drawing_source.on('change', () => {
      var features = drawing_source.getFeatures().sort(featureSortingFunction)
      fill_auto_route_layer(features, auto_route)
    })

    return drawing_route
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

function featureSortingFunction(f1, f2) {
  var i1 = f1.get("index") || 0
  var i2 = f2.get("index") || 0
  return i1 - i2
}
