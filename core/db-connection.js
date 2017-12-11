// NOTE: DO NOT COMMIT YOUR LOCAL CONFIG TO GIT
//-- Imam Bux
//-- Farzaneh Sabzi


var mysql = require('mysql');

var pool = mysql.createPool({
    host:   process.env.SQL_HOST,
    port:   3306,
    user:   process.env.SQL_USR,
    password:   process.env.SQL_PWS,
    database:   process.env.SQL_DB
});

module.exports.pool = pool;
