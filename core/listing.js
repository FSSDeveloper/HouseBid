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

function getListingsByUserId(agentId, callback) {
        var sql = "SELECT * FROM listing WHERE user_id = " + agentId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
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
    deleteListingImagesByListingId(listingId);
    var sql = "DELETE FROM listing WHERE listing_id = " + listingId;
    console.log("Query to be executed: " + sql);
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function deleteListingImagesByListingId(listingId) {
    var sql = "DELETE FROM listing_images WHERE listing_id = " + listingId;
    console.log("Query to be executed: " + sql);
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function addListing(listing, callback) {
    var sql = "INSERT INTO listing SET ?",
        values = {
            title : listing.title,
            description : listing.description,
            price : listing.price,
            is_biddable : listing.isBiddable,
            area : listing.area,
            status: listing.status,
            address: listing.address,
            expiry_date : listing.expiryDate,
            agent_id: listing.agentId,
            customer_id: listing.customerId,
            city : listing.city,
            location : listing.location,
            baths: listing.baths,
            beds: listing.baths
        };
    con.query(sql, values, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

module.exports.getListings = getListings;
module.exports.getListingByListingId = getListingByListingId;
module.exports.addListing = addListing;
module.exports.getListingsByUserId = getListingsByUserId;
module.exports.deleteListingByListingId = deleteListingByListingId;