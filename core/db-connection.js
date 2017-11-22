var mysql = require("mysql");

var con = mysql.createConnection({
    host:   "localhost",
    port:   3306,
    user:   "root",
    password:   "root",
    database:   "mydb"
});

function getConnection() {
    if(!con){
        // Connects to Database
        con.connect();
    }
    return con;
};

module.exports.getConnection = getConnection;