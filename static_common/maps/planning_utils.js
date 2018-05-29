/********************************
        Custom Styles
********************************/
const main_color = '#7d0808'
const hover_color = '#7d0808'

// Common
const white_fill = new ol.style.Fill({
 color: 'rgba(255,255,255,0.9)'
})

function textFromFeature(feature, hover = false) {
  var font_size = hover ? "20px" : "17px"
  return new ol.style.Text({
    font: 'bold ' + font_size + ' Open Sans,Calibri,sans-serif',
    textAlign: 'center',
    fill: new ol.style.Fill({ color: main_color }),
    text: "" + feature.get("index")
  })
}

function waypointStyleFunction(feature) {
  return [
    new ol.style.Style({
      zIndex: 1,
      text: textFromFeature(feature),
      image: new ol.style.Circle({
        fill: white_fill,
        stroke: new ol.style.Stroke({
          color: main_color,
          width: 0.5
        }),
        radius: 17
      })
    })
  ]
}

function waypointHoverStyleFunction(feature) {
  return [
    new ol.style.Style({
      zIndex: 100,
      text: textFromFeature(feature, true),
      image: new ol.style.Circle({
        radius: 20,
        fill: new ol.style.Fill({color: '#ffdddd'}),
        stroke: new ol.style.Stroke({
          color: main_color,
          width: 2
        })
      })
    })
  ]
}

function routeLineStyleFunction(feature) {
  return [
    new ol.style.Style({
      fill: white_fill,
      stroke: new ol.style.Stroke({
        color: main_color,
        width: 2
      })
    })
  ]
}

/********************************
    Automatic waypoints link
********************************/
var waypoints_links_layer = new ol.layer.Vector({ 
  source: new ol.source.Vector(),
  style: routeLineStyleFunction
})

function autoLinkWaypoints(features, waypoints_links_layer) {
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
  waypoints_links_layer.setSource(source)
}

/********************************
        Waypoints Layer
********************************/
var waypoints_source = new ol.source.Vector({
  url: "/route",
  format: new ol.format.KML({extractStyles:false})
})

var route = new ol.layer.Vector({ 
  source: waypoints_source,
  style: waypointStyleFunction
});

waypoints_source.on('change', () => {
  var features = waypoints_source.getFeatures().sort(featureSortingFunction)
  autoLinkWaypoints(features, waypoints_links_layer)
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
var hoverInteraction = new ol.interaction.Select({
  condition: ol.events.condition.pointerMove,
  layers:[route],
  style: waypointHoverStyleFunction
});


$(document).ready(function (){
  /****************************************
    Popup Configuration (need DOM Loaded)
  ****************************************/
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  /********************************
            Map Creation
  ********************************/
  var map = new ol.Map({
    target: 'map',
    layers: [ bing, waypoints_links_layer, route ],
    overlays: [overlay],
    controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
    ]),
    view: new ol.View({
      center: [-11000000, 7800000],
      zoom: 4
   })
  });

  map.addInteraction(hoverInteraction);

  map.on('singleclick', function(e) {
    var features = map.getFeaturesAtPixel(e.pixel)
    if (features && features.length >= 1) {
      var feature = features[0]
      var coords = feature.getGeometry().getCoordinates();
      content.innerHTML = 
      '<h6>Etape #' + feature.get("index").trim() + ' : ' + feature.get("name") + '</h6>' + 
      '<hr style="margin:0;"/>' +
      '<p>' + feature.get("description") + '</p>'
      overlay.setPosition(coords);
    }
  });

});