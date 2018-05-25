/********************************
        Custom Styles
********************************/
const main_color = '#7d0808'
const hover_color = '#7d0808'

// Common
const white_fill = new ol.style.Fill({
 color: 'rgba(255,255,255,0.7)'
})

// Normal Waypoint
const waypoint_stroke = new ol.style.Stroke({
  color: main_color,
  width: 1.5
})
const waypoint_marker = new ol.style.Circle({
  fill: white_fill,
  stroke: waypoint_stroke,
  radius: 5
})

// Hover Waypoint
const hover_stroke = new ol.style.Stroke({
  color: main_color,
  width: 5
})
const hover_marker = new ol.style.Circle({
  fill: new ol.style.Fill({color: '#ffdddd'}),
  stroke: hover_stroke,
  radius: 10
})


function waypointStyleFunction(feature) {
  return [
    new ol.style.Style({
      image: waypoint_marker,
      fill: white_fill,
      stroke: waypoint_stroke,
      zIndex: 1
    })
  ]
}

function waypointHoverStyleFunction(feature) {
  return [
    new ol.style.Style({
      image: hover_marker,
      fill: white_fill,
      stroke: hover_stroke,
      zIndex: 100
    })
  ]
}

function routeLineStyleFunction(feature) {
  return [
    new ol.style.Style({
      fill: white_fill,
      stroke: waypoint_stroke
    })
  ]
}

/********************************
    Automatic waypoints Layer
********************************/
var waypoints_auto_layer = new ol.layer.Vector({ 
  source: new ol.source.Vector(),
  style: waypointStyleFunction
})

function autoLinkWaypoints(features, waypoints_auto_layer) {
  if (!features || features.length != 1) {
    return
  }
  var coordinates = features[0].getGeometry().getCoordinates()
  var coord
  var waypoints_features = []
  var name
  var source = new ol.source.Vector()

  for (var index = 0; index < coordinates.length; index++) { 
    coord = coordinates[index]
    name = "waypoint_"
    name = name.concat(index+1)
    source.addFeature(new ol.Feature({
      geometry: new ol.geom.Point([coord[0], coord[1], coord[2]]),
      name: name,
      date: new Date(coord[3])
    }))
  }

  var clusterSource = new ol.source.Cluster({
    distance: parseInt(30, 10),
    source: source
  });
  waypoints_auto_layer.setSource(clusterSource)
}

/********************************
        Route Layer
********************************/
var route_source = new ol.source.Vector({
  url: "/gpstrack",
  format: new ol.format.KML({extractStyles:false})
})

var route = new ol.layer.Vector({ 
  source: route_source,
  style: routeLineStyleFunction
});

route_source.on('change', () => {
  var features = route_source.getFeatures().sort(featureSortingFunction)
  autoLinkWaypoints(features, waypoints_auto_layer)
})

function featureSortingFunction(f1, f2) {
  var i1 = f1.get("index") || 0
  var i2 = f2.get("index") || 0
  return i1 - i2
}

/********************************
        Bing Base Layer
********************************/
var bing = new ol.layer.Tile({
  visible: true,
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: 'AlWoguuHB5fubEl4l0x602tHSMOJJY0spFDE_qrlL8iXTzBbQb1o-wPlImvDW6Gf',
    imagerySet: 'Road',
    maxZoom: 19
  })
})


/********************************
        Map Interactions
********************************/
/*var hoverInteraction = new ol.interaction.Select({
  condition: ol.events.condition.pointerMove,
  layers:[waypoints_auto_layer],
  style: waypointHoverStyleFunction
});
*/

$(document).ready(function (){

  /********************************
            Map Creation
  ********************************/
  var map = new ol.Map({
    target: 'map',
    layers: [ bing, waypoints_auto_layer, route ],
    controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
    ]),
    view: new ol.View({
      center: [-11000000, 7800000],
      zoom: 4
   })
  });

  //map.addInteraction(hoverInteraction);


});