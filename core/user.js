//-- Imam Bux
//-- Farzaneh Sabzi

var mysql = require("./db-connection").pool;
var encryptionUtil = require("./encryptionUtil");

function login(user, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE email = " + 
                con.escape(user.email) + " AND password = " + con.escape(encryptionUtil.encrypt(user.password));
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
                password: encryptionUtil.encrypt(user.password),
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

function updateUser(user, image, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "UPDATE user SET ? WHERE user_id = " + con.escape(user.userId),
            values = {
                name: user.name,
                email: user.email,
                password: encryptionUtil.encrypt(user.password),
                contact: user.contact,
                address: user.address
                // image: image.image ? image.image.data : null,
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
        var sql = "SELECT user_id, name, email, contact, address, user_type FROM user WHERE user_id = " + con.escape(userId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function getUserImageById(userId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT image FROM user WHERE user_id = " + con.escape(userId);
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
module.exports.getUserImageById = getUserImageById;

