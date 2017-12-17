//--Imam bux
//-- Farzaneh Sabzi


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

app.use(function (req, res, next) {
    console.log(req.method + " request for " + req.url);
    req.header("Access-Control-Allow-Origin", "*"); 
    req.url = req.url.replace(process.env.APP_CONX , "" );
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Headers','Content-Type');
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

/*******************************************************************************************
 *                                      ROUTERS START
 * *****************************************************************************************
 */

// public folder
app.use(express.static("./public_html"));

/** START - USER **/
app.post("/signup", function (req, res) {
    var body = req.body;
    var image = req.files ? req.files : null;
    console.log("Signup data received.");
    user.signUp(body, image, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
            if(err.code === "ER_DUP_ENTRY") {
                res.status(500).send({error: err.code});
            } else {
                res.sendStatus(500);
            }
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
            res.status()
            console.log("Error in Database Server: " + err);
        } else {
            if(data.length === 0) {
                res.status(404);
            }
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
// Profile Picture
app.get("/user/image", function (req, res) {
    var userId = req.query.userId;
    console.log("Profile request received.");
    user.getUserImageById(userId, function (err, data) {
        if (err || data[0].image == null) {
            if(data[0].image == null) {
                res.status(404).send({error: 'Image not found'});
            } else
                console.log("Error in Database Server: " + err);
        } else {
            res.writeHead(200, {'Content-Type': 'mimetype'});
            res.end(new Buffer(data[0].image, 'base64'));
        }
    });
});
// Fetchs all agents
app.get("/user/agents", function (req, res) {
    console.log("Request for fetching agents.");
    user.getAgents(function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
app.post("/user/update", function (req, res) {
    var body = req.body;
    console.log("Update Profile request received.");
    user.updateUser(body, null, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            user.login(body, function (err, data) {
                if (err) {
                    console.log("Error in Database Server: " + err);
                } else {
                    if(data.length === 0) {
                        res.status(404);
                    }
                    res.json(data);
                }
            });
        }
    });
});
/** END - USER **/

/** START - LISTING **/
app.get("/search", function (req, res) {
    listing.getListings(req.query, function (err, data) {
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
    console.log("userId=",userId);
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
    var imagesData = req.files ? req.files : null;
    console.log("Add Profile request received.");
    listing.addListing(body, imagesData, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
app.post("/agent/listing/update", function (req, res) {
    var body = req.body;
    console.log("Update Listing request received.");
    listing.updateListing(body, function (err, data) {
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
    console.log("Delete listing request received.");
    listing.deleteListingByListingId(listingId, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            res.json(data);
        }
    });
});
// Get Listing Image by listingId
app.get("/listing/image", function (req, res) {
    var listingId = req.query.listingId;
    var index = req.query.number - 1;
    console.log("Profile request received.");
    listing.getListingImageById(listingId, function (err, data) {
        if (err || data[index] == null) {
            res.status(404).send({error: 'Image not found'});
            }
        else {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(data[index].image);
        }
    });
});


// lisitng Cities--Farrukh
app.get("/listing/cities",function(req,result){

    listing.getCities(function(err,res){
        if(err) console.log("ERROR--Cannot get cities");
        else result.json(res);
    });

});
/** END - LISTING **/

/** START - MESSAGE **/
// Adds message if POST
app.post("/user/message", function (req, res) {
    var messageBody = req.body;
    console.log("Add Message request received.");
    message.addMessage(messageBody, function (err, data) {
        if (err) {
            console.log("Error in Database Server: " + err);
        } else {
            message.getMessageByMessageId(data.insertId, function (err, data) {
                if (err) {
                    console.log("Error in Database Server: " + err);
                } else {
                    res.json(data);
                }
            });
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
// Vijay Bhaskar
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

// Inbox (All sent and received messages)
// Vijay Bhaskar
app.get("/user/conversation", function (req, res) {
    var senderId = req.query.senderId;
    var receiverId = req.query.receiverId;
    message.getConversation(senderId, receiverId, function (err, data) {
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

app.listen(port, function() {
    console.log("\n========================================");
    console.log("Express Server is listening at port " + port);
    console.log("========================================\n\n");
});
