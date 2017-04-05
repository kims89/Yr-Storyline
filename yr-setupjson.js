var parseString = require('xml2js').parseString;
var http = require('http');
fs = require('fs');

var url = "http://www.yr.no/sted/Norge/Finnmark/Vadsø/Vadsø/varsel.xml"

function xmlToJson(url, callback) {
  var req = http.get(url, function(res) {
    var xml = '';

    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    });

    res.on('timeout', function(e) {
      callback(e, null);
    });

    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}


xmlToJson(url, function(err, data) {
  var jsondata = [];
  if (err) {
    return console.err(err);
  }
  var obsvr = JSON.stringify(data.weatherdata.observations);
  var byr=JSON.parse(obsvr.slice(1, -1));
  for(var x in byr.weatherstation){
    jsondata+=JSON.stringify(byr.weatherstation[x].$.temperature)+",";
}

  jsondata=jsondata.substring(0, jsondata.length - 1);
  console.log(jsondata);
  fs.writeFile('varsel.json', JSON.stringify(jsondata), function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });

});
