var dbConnection = require("./db-connection");

var con = dbConnection.getConnection();

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

    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function getListingsByAgentId(agentId) {
        console.log("Database Connected");
        var sql = "SELECT * FROM listing WHERE agent_id = " + agentId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
}

function getListingByListingId(listingId, callback) {
    var sql = "SELECT * FROM listing WHERE listing_id = " + listingId;
    console.log("Query to be executed: " + sql);
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function deleteListingByListingId(listingId) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "UPDATE listing SET status = 2 " + listingId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
}

function addListing(listing) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "INSERT INTO listing (title, description, price, is_biddable, area, status, agent_id, listed_date, customer_id, baths, beds) " +
            "VALUES(\"" + listing.title + "\", \"" + listing.description + "\", " + listing.price + ", " + listing.isBiddable + ", " +
            listing.area + ", 1, " + listing.agentId + ", now(), " + listing.customerId + ", " + listing.baths + ", " + listing.beds +")";
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
}

module.exports.getListings = getListings;
module.exports.getListingByListingId = getListingByListingId;