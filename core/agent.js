var dbConnection = require("./db-connection");
var con = dbConnection.getConnection();

function getAgent(agentId) {
    console.log("Database Connected");
    var sql = "SELECT * FROM agents WHERE agent_id = " + agentId;
    console.log("Query to be executed: " + sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

module.exports.getAgent = getAgent;