const fs = require('fs');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

const port = process.env.PORT || 3003
const upload_path = process.env.UPLOAD_PATH || 'route.kml'

app.use(bodyParser.text())

app.get('/route', function (req, res) {
  fs.readFile(upload_path, (err, data) => {
          // throws an error, you could also catch it here
      if (err) {
        res.status(500).send(err)
      } else {
        // success case, the file was saved
        res.send(data)
      }

  })
})

app.post('/route', function (req, res) {

  let kml_content = req.body

  // write to a new file named 2pac.txt

  fs.writeFile(upload_path, kml_content, (err) => {  
      // throws an error, you could also catch it here
      if (err) {
        res.status(500).send(err)
      } else {
        // success case, the file was saved
        res.send('OK')
      }

  });
})

app.listen(port, function () {
  console.log("kml_upload listening on port %s!", port)
})
