var dbConnection = require("./db-connection");

// Database Credentials
var con = dbConnection.getConnection();
// Connects to Database
con.connect();

function getListings(city, location, callback) {
    var sql = "SELECT * FROM listing";
    if(city || location) {
        sql += " WHERE";
        if(city) {
            sql += (" city = '" + city + "'");
        }
        if(location) {
            if(city) {
                sql += " AND"
            }
            sql += (" location = '" + location + "'");
        }
    }
    console.log("Query to be executed: " + sql);

    var data;
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function getListingsByAgentId(agentId) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "SELECT * FROM listing WHERE agent_id = " + agentId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        con.end();
    });
}

function getListingByListingId(listingId) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "SELECT * FROM listing WHERE listing_id = " + listingId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

function deleteListingByListingId(listingId) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "UPDATE listing SET status = 2 " + listingId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

function addListing(listing) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "INSERT INTO listing (title, description, price, is_biddable, area, status, agent_id, listed_date, customer_id) " +
            "VALUES(\"" + listing.title + "\", \"" + listing.description + "\", " + listing.price + ", " + listing.isBiddable + ", " +
            listing.area + ", 1, " + listing.agentId + ", now(), " + listing.customerId + ")";
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

module.exports.getListings = getListings;