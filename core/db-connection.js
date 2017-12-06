var mysql = require('mysql');

var pool = mysql.createPool({
    host:   "localhost",
    port:   3306,
    user:   "root",
    password:   "root",
    database:   "mydb"
});

module.exports.pool = pool;

var mysql = require("mysql");

    var con = mysql.createConnection({
        host:   "localhost",
        port:   3306,
        user:   "root",
        password:   "root",
        database:   "mydb"
});

    function getConnection() {
            return con;
        };

module.exports.getConnection = getConnection;
