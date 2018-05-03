/********************************

        Route saving

********************************/  
export function saveRoute(kml) {
  console.log("Saving data :")
  console.log(kml)
  return fetch(process.env.REACT_APP_ROUTE_KML_SAVE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      kml : kml
    })
  })
}