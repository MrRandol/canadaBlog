/********************************

        Route saving

********************************/  
export function saveRoute(kml) {
  console.log("Saving data :")
  console.log(kml)
  var username=process.env.REACT_APP_ROUTE_KML_SAVE_USERNAME
  var password=process.env.REACT_APP_ROUTE_KML_SAVE_PASSWORD
  return fetch(process.env.REACT_APP_ROUTE_KML_SAVE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    "credentials": "include",
    body:JSON.stringify({
      kml : kml
    })
  })
}