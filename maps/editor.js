/********************************

      Route html display

********************************/
function fill_route_list(features) {
  var features_list = document.getElementById('route_placemarks')
  features_list.innerHTML = ""
  var feature
  for (var index = 0; index < features.length; index++) {
    feature = features[index]
    feature.style = routePlacemarkStyleFunction
    if (!feature.get("index")) {
      feature.set("index", get_next_index(features))
    }
    var n =feature.get("name")
    var i = feature.get("index")
    console.log(JSON.stringify("feat %s (%s)", n, i))
    features_list.appendChild(generateLI(feature))
  }
}

function get_next_index(features) {
  var max = 1
  var feat 
  for (var i = 0; i < features.length; i++) {
    feat = parseInt(features[i].get("index"))
    if (feat && feat >= max)
      max = feat + 1
  }
  return max
}

function generateLI(feature) {
  var li = document.createElement("li")

  var textInput = document.createElement('INPUT')
  textInput.setAttribute("type", "text")
  textInput.setAttribute("style", "width:auto;")

  var button = document.createElement('button')
  button.textContent = 'OK'
  button.onclick = () => {feature.set("name", textInput.value); update_drawing_layer()}

  li.appendChild(document.createTextNode((feature.get("index")) + "/ " + feature.get("name") ))
  li.appendChild(textInput)
  li.appendChild(button)
  return li
}


/********************************

        Openlayers Styles

********************************/      
function routePlacemarkStyleFunction(feature) {
  var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.4)'
  })
  var stroke = new ol.style.Stroke({
   color: '#ff6d00',
   width: 3
  })
  var text = new ol.style.Text({
    font: '17px Open Sans,Calibri,sans-serif',
    textAlign: 'left',
    offsetX: 10,
    rotation: -35 * Math.PI / 180,
    fill: new ol.style.Fill({ color: '#ff6d00' }),
    stroke: new ol.style.Stroke({
      color: '#fff', width: 1
    }),
    text: feature.get("name") + "(" + feature.get("index") + ")"
  })

  return [
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 5
     }),
     fill: fill,
     stroke: stroke,
     text: text
   })
  ]
}

function routeLineStyleFunction(feature) {
  var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.8)'
  })
  var stroke = new ol.style.Stroke({
   color: '#ff6d00',
   width: 1
  })

  return [
   new ol.style.Style({
     fill: fill,
     stroke: stroke
   })
  ]
}

/********************************

        Route drawing

********************************/  

function fill_auto_route_layer() {
  var features = drawing_source.getFeatures().sort(featureSortingFunction)

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