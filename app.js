// libraries
var express = require("express");
var sessions = require("express-session");
var bodyParser = require("body-parser");

// local modules
var listing = require("./core/listing");

// initializing express server
var app = express();


// logs every type of request on server console
app.use(function(req, res, next) {
    console.log(req.method + " request for " + req.url);
    next();
});


// provides GET and POST data in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/*******************************************************************************************
 *                                      ROUTERS START
 * *****************************************************************************************
 */

// HOMEPAGE
app.use(express.static("./"));

app.get("/search", function(req, res) {
    var city = req.query.city;
    var location = req.query.location;
    console.log(city + ", " + location);
    var result = listing.getListings(city, location, function(err, data){
        if (err) {
            console.log("Error in Database Server: " + err);            
        } else {       
            res.json(data);
        }
    });
});

/** START - CUSTOMER **/



/*******************************************************************************************
 *                                      ROUTERS END
 * *****************************************************************************************
 */

// server starts at port 3000
app.listen(3000);
console.log("\n========================================");
console.log("Express Server is listening at port 3000");
console.log("========================================\n\n");