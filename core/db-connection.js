var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'mydb'
});
var con = function () {

};

module.exports.pool = pool;