var mysql = require("./db-connection").pool;

function login(user, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE email = \"" + user.email + "\" AND password = \"" + user.password + "\"";
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function signUp(user, image, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "INSERT INTO user SET ?",
            values = {
                name: user.name,
                email: user.email,
                password: user.password,
                contact: user.contact,
                address: user.address,
                image: image ? image.data : null,
                user_type: user.usertype
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function getUserById(userId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE user_id = " + userId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

module.exports.signUp = signUp;
module.exports.login = login;
module.exports.getUserById = getUserById;