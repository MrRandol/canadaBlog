/********************************
        Custom Styles
********************************/
const main_color = '#7d0808'
const hover_color = '#7d0808'
const marker = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg width="384" height="512" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -20 404 552"><path id="marker" fill="#7d0808" stroke="#fff" stroke-width="20" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>')
const hover_marker = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg width="384" height="512" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -20 404 552"><path id="marker" fill="#fff" stroke="#7d0808" stroke-width="20" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>')
var styleCache = {};

function waypointStyleFunction(feature, hover=false) {
  var size = feature.get('features').length
  var style = styleCache[size];
  if (!style) {
    if ( size > 1 ) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 25,
          /*stroke: new ol.style.Stroke({
            color: main_color,
            width: 4
          }),*/
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.8)'
          })
        }),
        text: new ol.style.Text({
          text: size.toString(),
          font: 'bold 20px Open Sans,Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: main_color,
          })
        })
      });
      styleCache[size] = style;
    } else {
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          opacity: 1,
          src: hover === true? hover_marker : marker,
          scale: 0.04,
          anchor: [0.5, 0.98]
        })
      });
      if (hover === true && feature.get("features")[0] && feature.get("features")[0].get("date")) {
          style.setText(new ol.style.Text({
            font: '15px Open Sans,Calibri,sans-serif',
            textAlign: 'center',
            fill:  new ol.style.Fill({ color: main_color }),
            text: feature.get("features")[0].get("date"),
            textBaseline: "bottom",
            backgroundFill:  new ol.style.Fill({ color: "#fff" }),
            padding: [3, 5, 3, 5],
            offsetY: -25
          }))
      }

    }
  }
  return style;
}

function waypointHoverStyleFunction(feature) {
  return waypointStyleFunction(feature, true)
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
    var date = new Date(coord[3]);

    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    var formattedDate = day + '/' + month + '/' + year

    source.addFeature(new ol.Feature({
      geometry: new ol.geom.Point([coord[0], coord[1], coord[2]]),
      name: name,
      date: formattedDate
    }))
  }

  var clusterSource = new ol.source.Cluster({
    distance: parseInt(40, 10),
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
  style: new ol.style.Style({
      fill: new ol.style.Fill({
         color: 'rgba(255,255,255,0.7)'
        }),
      stroke: new ol.style.Stroke({
        color: main_color,
        width: 1.5
      })
    })
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
$(document).ready(function (){

  /********************************
            Map Creation
  ********************************/
  var map = new ol.Map({
    target: 'map',
    layers: [ bing, route, waypoints_auto_layer ],
    controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
    ]),
    view: new ol.View({
      center: [-11000000, 7800000],
      zoom: 4
   })
  });

  var hoverInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    layers:[waypoints_auto_layer],
    style: waypointHoverStyleFunction,
    hitTolerance: 10
  });

  map.addInteraction(hoverInteraction);
});