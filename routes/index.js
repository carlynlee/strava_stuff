var express = require('express');
var router = express.Router();
var parser = require('xml2json');
var http = require('http');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', { title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    //var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');



    http.get({
        host: 'aviationweather.gov',
        path: '/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString='+userName+'&hoursBeforeNow=1'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var contents_json=JSON.parse(parser.toJson(body));

            // Submit to the DB
            collection.insert({
                "username" : userName,
                "metars" : contents_json
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // If it worked, set the header so the address bar doesn't still say /adduser
                    //res.location("userlist");
                    // And forward to success page
                    res.redirect("userlist");
                }
            });
        });
    });



});

module.exports = router;