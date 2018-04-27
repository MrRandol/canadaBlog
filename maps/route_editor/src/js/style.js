import * as ol from 'openlayers'
/********************************

        Openlayers Styles

********************************/

const main_color = '#ff6d00'
const hover_color = '#ff0000'

// Fills
const white_fill = new ol.style.Fill({
 color: 'rgba(255,255,255,0.7)'
})
const text_fill = new ol.style.Fill({ color: main_color })
const text_hover_fill = new ol.style.Fill({ color: hover_color })

// Strokes
const classic_stroke = new ol.style.Stroke({
  color: main_color,
  width: 3
})
const hover_stroke = new ol.style.Stroke({
  color: hover_color,
  width: 5
})
const text_stroke = new ol.style.Stroke({
  color: '#ffffff', 
  width: 1
})

// Markers
const classic_marker = new ol.style.Circle({
  fill: white_fill,
  stroke: classic_stroke,
  radius: 5
})

const hover_marker = new ol.style.Circle({
  fill: white_fill,
  stroke: hover_stroke,
  radius: 10
})

// Marker Text

function textFromFeature(feature, hover = false) {
  var fill = hover ? text_hover_fill : text_fill
  var offsetX = hover ? 15 : 10
  return new ol.style.Text({
    font: '17px Open Sans,Calibri,sans-serif',
    textAlign: 'left',
    offsetX: offsetX,
    rotation: -35 * Math.PI / 180,
    fill: fill,
    stroke: text_stroke,
    text: feature.get("name") + "(" + feature.get("index") + ")"
  })
}


export function routePlacemarkStyleFunction(feature) {
  return [
   new ol.style.Style({
     image: classic_marker,
     fill: white_fill,
     stroke: classic_stroke,
     text: textFromFeature(feature)
   })
  ]
}

export function routePlacemarkHoverStyleFunction(feature) {
  return [
   new ol.style.Style({
     image: hover_marker,
     fill: white_fill,
     stroke: hover_stroke,
     text: textFromFeature(feature, true)
   })
  ]
}

export function routeLineStyleFunction(feature) {
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

