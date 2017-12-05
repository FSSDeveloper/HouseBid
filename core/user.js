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
                image: image.image ? image.image.data : null,
                user_type: user.userType
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function updateUser(user, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "UPDATE user SET ? WHERE user_id = " + user.userId,
            values = {
                name: user.name,
                email: user.email,
                password: user.password,
                contact: user.contact,
                address: user.address,
                image: image.image ? image.image.data : null,
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else callback(null, user.login(body, function (err, data) {
                if (err) {
                    console.log("Error in Database Server: " + err);
                } else {
                    if(data.length === 0) {
                        res.status(404);
                    }
                    res.json(data);
                }
            }));
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

function getAgents(callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE user_type = 2";
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
module.exports.getAgents = getAgents;
module.exports.updateUser = updateUser;