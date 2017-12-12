//--Imam Bux
//--Farzaneh Sabzi
var mysql = require("./db-connection").pool;

function getAgent(agentId) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM agents WHERE agent_id = " + con.escape(agentId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {

            if (err) throw err;
            console.log(result);
        });
        con.release();
    });
}

module.exports.getAgent = getAgent;