/********************************

      Route html display

********************************/
export function fill_route_list(features) {
  var features_list = document.getElementById('route_placemarks')
  features_list.innerHTML = ""
  var feature
  for (var index = 0; index < features.length; index++) {
    feature = features[index]
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

export function generateLI(feature) {
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

        Route drawing

********************************/  

export function fill_auto_route_layer() {
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


export function featureSortingFunction(f1, f2) {
  var i1 = f1.get("index") || 0
  var i2 = f2.get("index") || 0
  return i1 - i2
}
