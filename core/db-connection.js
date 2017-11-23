var mysql = require('mysql');

var con = mysql.createConnection({
    host:   process.env.SQL_HOST,
    port:   3306,
    user:   process.env.SQL_USR,
    password:   process.env.SQL_PWS,
    database:   process.env.SQL_DB
});
var con = function () {

};

module.exports.getConnection = getConnection;
