// libraries
var express = require("express");
var sessions = require("express-session");
var bodyParser = require("body-parser");
var fileUpload = require('express-fileupload');

// local modules
var listing = require("./core/listing");
var user = require("./core/user");
var message = require("./core/message");

// setting port
var port = process.env.PORT || '3000';
// initializing express server
var app = express();
app.set('port', port);



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

/** START - USER **/
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
app.post("/user/login", function (req, res) {
    var body = req.body;
    console.log("Login data received.");
    user.login(body, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
app.post("/user/profile", function (req, res) {
    var userId = req.body.userId;
    console.log("Profile request received.");
    user.getUserById(userId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
/** END - USER **/

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
// Gets listing if GET request
app.get("/agent/listing", function (req, res) {
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
app.get("/agent/listings", function (req, res) {
    var userId = req.query.userId;
    listing.getListingsByUserId(userId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
// Adds listing if POST request
app.post("/agent/listing", function (req, res) {
    var body = req.body;
    console.log("Add Profile request received.");
    listing.addListing(body, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
// Delete Listing
app.delete("/agent/listing", function (req, res) {
    var listingId = req.body.listingId;
    console.log("Add Profile request received.");
    listing.deleteListingByListingId(listingId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
/** END - LISTING **/

/** START - MESSAGE **/
// Adds message if POST
app.post("/user/message", function (req, res) {
    var message = req.body;
    console.log("Add Message request received.");
    message.addMessage(message, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
// Gets message if GET
app.get("/user/message", function (req, res) {
    var messageId = req.query.messageId;
    message.getMessageByMessageId(messageId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
// Inbox (All sent and received messages)
app.get("/user/messages", function (req, res) {
    var userId = req.query.userId;
    message.getMessagesByUserId(userId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
/** START - MESSAGE **/

/*******************************************************************************************
 *                                      ROUTERS END
 * *****************************************************************************************
 */

// server starts set at environment or 8000
app.listen(port, function() {
    console.log("\n========================================");
    console.log("Express Server is listening at port " + port);
    console.log("========================================\n\n");
});