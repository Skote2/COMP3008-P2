const fs        = require('fs');
const express   = require('express');
const app       = express();
const mime      = require('mime-types');

const PORT      = 8080;
const rootDir   = "./files"

app.use((req, res, next) => {console.log('HTTP request for\n    ' + req.url); next();})

app.get('/', function (req, res) { 
    filePath = rootDir + "/index.html";
    fs.readFile(filePath, function(err, data) {
        if (err)
            res.send(404);
        else {
            res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
            res.write(data);
            res.end();
        }
    });
})

app.get('/*', function (req, res) { 
    filePath = rootDir + req.url;
    fs.readFile(filePath, function(err, data) {
        if (err)
            res.send(404);
        else {
            res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
            res.write(data);
            res.end();
        }
    });
})

app.listen(PORT, () => console.log('Example app listening on port ' + PORT + '!'))