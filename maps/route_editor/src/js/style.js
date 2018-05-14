import * as ol from 'openlayers'

/********************************

        Openlayers Styles

********************************/

const main_color = '#7d0808'
//const hover_color = '#cc0000'
const hover_color = '#7d0808'

// Fills
const white_fill = new ol.style.Fill({
 color: 'rgba(255,255,255,0.7)'
})
const text_fill = new ol.style.Fill({ color: main_color })
const text_hover_fill = new ol.style.Fill({ color: hover_color })

// Strokes
const classic_stroke = new ol.style.Stroke({
  color: main_color,
  width: 1.5
})
const hover_stroke = new ol.style.Stroke({
  color: hover_color,
  width: 5
})

const text_stroke = new ol.style.Stroke({
  color: '#ffffff', 
  width: 2
})

// Markers
const classic_marker = new ol.style.Circle({
  fill: white_fill,
  stroke: classic_stroke,
  radius: 13
})

const hover_marker = new ol.style.Circle({
  //fill: white_fill,
  fill: new ol.style.Fill({color: '#ffdddd'}),
  stroke: hover_stroke,
  radius: 16
})

const drawing_marker = new ol.style.Circle({
  fill: new ol.style.Fill({ color: main_color }),
  stroke: new ol.style.Stroke({
    color: '#ffffff', 
    width: 2
  }),
  radius: 6
})
// Marker Text

function textFromFeature(feature, hover = false) {
  var fill = hover ? text_hover_fill : text_fill
  var font_size = hover ? "23px" : "17px"
  return new ol.style.Text({
    font: font_size + ' Open Sans,Calibri,sans-serif',
    textAlign: 'center',
    fill: fill,
    stroke: text_stroke,
    text: "" + feature.get("index")
  })
}

export function drawingPointerStyleFunction(feature) {
  return [
   new ol.style.Style({
     image: drawing_marker,
     fill: white_fill,
     stroke: classic_stroke,
     zIndex: 200,
     text: ol.style.Text({text: ""})
   })
  ]
}

export function routePlacemarkStyleFunction(feature) {
  return [
   new ol.style.Style({
     image: classic_marker,
     fill: white_fill,
     stroke: classic_stroke,
     zIndex: 1,
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
     zIndex: 100,
     text: textFromFeature(feature, true)
   })
  ]
}

export function routeLineStyleFunction(feature) {
  var fill = new ol.style.Fill({
   color: 'rgba(255,255,255,0.8)'
  })
  var stroke = new ol.style.Stroke({
   color: main_color,
   width: 1
  })

  return [
   new ol.style.Style({
     fill: fill,
     stroke: stroke
   })
  ]
}