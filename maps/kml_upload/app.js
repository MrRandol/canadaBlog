const fs = require('fs');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

const port = process.env.PORT || 3003
const upload_path = process.env.UPLOAD_PATH || 'route.kml'

app.use(bodyParser.json())

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

app.get('/route', function (req, res) {
  fs.readFile(upload_path, (err, data) => {
          // throws an error, you could also catch it here
      if (err) {
        res.status(500).send(err)
      } else {
        // success case, the file has been read
        res.send(data)
      }

  })
})

app.post('/route', function (req, res) {

  let kml_content = req.body.kml

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
