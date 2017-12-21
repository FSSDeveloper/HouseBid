//-- Imam Bux
//-- Farzaneh Sabzi

var mysql = require("./db-connection").pool;

function getListings(query, callback) {
    var city = query.city;
    var location = query.location;
    var sortByPrice = query.sortByPrice;
    var sortByDate = query.sortByDate;
    var priceFrom = query.priceFrom;
    var priceTo = query.priceTo;
    var bathNo = query.bathNo;
    var bedNo = query.bedNo;
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM listing WHERE status NOT IN (2,4) ";
        if (city || location || priceFrom || priceTo || bathNo || bedNo) {
            //sql += " WHERE status NOT IN (2,4) ";
            if (city) {
                sql += (" AND UPPER(city) LIKE UPPER('%" + city + "%')");
            }
            if (location) {
                sql += (" AND UPPER(location) LIKE UPPER('%" + location + "%')");
            }
            if (priceFrom){
                sql += " AND price >= "+ priceFrom 
            }
            if (priceTo){
                sql += " AND price <= "+ priceTo 
            }         
            if (bathNo){
                sql += " AND baths = "+ bathNo 
            }   
             if (bedNo){
                sql += " AND beds = "+ bedNo 
            }   
     
        }

        if(sortByPrice || sortByDate) {
            sql += " ORDER BY "
            if(sortByPrice) {
                var orderByPrice = query.orderByPrice;
                sql += " price " + orderByPrice;
            }
            if(sortByDate) {
                if(sortByPrice) sql += ", ";
                var orderByDate = query.orderByDate;
                sql += " listed_date " + orderByDate;
            }

        }

        console.log("Query to be executed: " + sql);

        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}


//GET CITIES -- FARRUKh
function getCities(callback)
{
    mysql.getConnection(function(err,conn){
        conn.query("select distinct concat(ucase(Left(city,1)),substr(city,2)) as 'City' from listing order by city",function(err,result){
            if(err) callback(err,null);
            else callback(null,result);
        });
        conn.release();
    });
}


function getListingsByUserId(agentId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM listing WHERE status != 4 AND agent_id = " + con.escape(agentId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function getListingByListingId(listingId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT l.*, a.name 'agent_name', a.email 'agent_email', a.contact 'agent_contact', a.address 'agent_address' FROM listing l, user a \n\
        WHERE listing_id = " + con.escape(listingId) + " and l.agent_id = a.user_id";
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function deleteListingByListingId(listingId, callback) {
    mysql.getConnection(function(err, con) {
        //deleteListingImagesByListingId(listingId);
        var sql = "UPDATE listing SET status  = 4 WHERE listing_id = " + con.escape(listingId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

//function deleteListingImagesByListingId(listingId) {
//    mysql.getConnection(function(err, con) {
//        var sql = "DELETE FROM listing_images WHERE listing_id = " + con.escape(listingId);
//        console.log("Query to be executed: " + sql);
//        con.query(sql, function (err, result) {
//            if (err) return false;
//            else return true;
//        });
//        con.release();
//    });
//}

function addListing(listing, imagesData, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "INSERT INTO listing SET ?",
            values = {
                title: listing.title,
                description: listing.description,
                price: listing.price,
                is_biddable: listing.biddable ? (listing.biddable === "on" ? 1 : 0) : 0,
                area: listing.area,
                status: listing.status != null && listing.status != '' ? listing.status : 0,
                address: listing.address,
                agent_id: listing.agentId,
                customer_id: listing.customerId != null && listing.customerId != "null" ? listing.customerId : null,
                city: listing.city,
                location: listing.location,
                baths: listing.baths,
                beds: listing.beds,
                total_images: imagesData ? (imagesData.images instanceof Array ? imagesData.images.length : 1) : 0
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else {
                if(imagesData) {
                    if(imagesData.images instanceof Array) {
                        imagesData.images.forEach(function(img) {
                            addListingImage(result.insertId, img);
                        });
                    } else{
                        addListingImage(result.insertId, imagesData.images);
                    }
                }
                callback(null, result);
            }
        });
        con.release();
    });
}

function addListingImage(listingId, image) {
    mysql.getConnection(function(err, con) {
        var sql = "INSERT INTO listing_images SET ?",
            values = {
                listing_id: listingId,
                image: image ? image.data : null,
            };
        con.query(sql, values, function (err, result) {
            if (err) console.log("Error while uploading image.");
            else console.log("Image uploaded successfully");
        });
        con.release();
    });
}

function updateListing(listing, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "UPDATE listing SET ? WHERE listing_id = " + con.escape(listing.listingId),
            values = {
                title: listing.title,
                description: listing.description,
                price: listing.price,
                is_biddable: listing.isBiddable,
                area: listing.area,
                status: listing.status,
                address: listing.address,
                agent_id: listing.agentId,
                city: listing.city,
                location: listing.location,
                baths: listing.baths,
                beds: listing.beds
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}


function getListingImageById(listingId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT image FROM listing_images WHERE listing_id = " + con.escape(listingId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

module.exports.getListings = getListings;
module.exports.getListingByListingId = getListingByListingId;
module.exports.addListing = addListing;
module.exports.getListingsByUserId = getListingsByUserId;
module.exports.deleteListingByListingId = deleteListingByListingId;
module.exports.updateListing = updateListing;
module.exports.getListingImageById = getListingImageById;
module.exports.addListingImage = addListingImage;
module.exports.getCities = getCities;


