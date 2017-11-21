var dbConnection = require("./db-connection");
var con = dbConnection.getConnection();

function login(user, callback) {
    var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE email = \"" + user.email + "\" AND password = \"" + user.password + "\"";
    console.log("Query to be inserted: " + sql);
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function signUp(user, image, callback) {
    var sql = "INSERT INTO user SET ?",
    values = {
        name : user.name,
        email : user.email,
        password : user.password,
        contact : user.contact,
        address : user.address,
        image: image ? image.data : null,
        user_type: user.usertype
    };
    con.query(sql, values, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function getUserById(userId, callback) {
    var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE user_id = " + userId;
    console.log("Query to be inserted: " + sql);
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

module.exports.signUp = signUp;
module.exports.login = login;