import * as ol from 'openlayers'
/********************************

        Openlayers Styles

********************************/      
export function routePlacemarkStyleFunction(feature) {
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

