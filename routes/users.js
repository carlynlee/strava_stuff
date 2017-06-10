var express = require('express');
var router = express.Router();
var http = require('http');
var parser = require('xml2json');


/* GET users listing. */
router.get('/', function(req, res) {



    res.send('respond with a resource');
});



module.exports = router;


//https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KEMT,KAJO,KFUL, LGB&hoursBeforeNow=1