// libraries
var express = require("express");
var sessions = require("express-session");
var bodyParser = require("body-parser");
var fileUpload = require('express-fileupload');

// local modules
var listing = require("./core/listing");
var user = require("./core/user");

// initializing express server
var app = express();

// default settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

// logs every type of request on server console
app.use(function (req, res, next) {
    console.log(req.method + " request for " + req.url);
    next();
});


/*******************************************************************************************
 *                                      ROUTERS START
 * *****************************************************************************************
 */

// HOMEPAGE
app.use(express.static("./"));

/** START - CUSTOMER **/
app.post("/signup", function (req, res) {
    var body = req.body;
    var image = req.files.image;
    console.log("Signup data received.");
    user.signUp(body, image, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
app.post("/login", function (req, res) {
    var body = req.body;
    console.log("Login data received.");
    user.login(body, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
            // res.json(err);
        } else {
            res.json(data);
        }
    });
});
/** END - CUSTOMER **/

/** START - LISTING **/
app.get("/search", function (req, res) {
    var city = req.query.city;
    var location = req.query.location;
    console.log(city + ", " + location);
    listing.getListings(city, location, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
app.get("/listing", function (req, res) {
    var listingId = req.query.listingId;
    console.log("Listing ID: " + listingId);
    listing.getListingByListingId(listingId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
/** END - LISTING **/

/*******************************************************************************************
 *                                      ROUTERS END
 * *****************************************************************************************
 */

// server starts at port 3000
app.listen(3000);
console.log("\n========================================");
console.log("Express Server is listening at port 3000");
console.log("========================================\n\n");