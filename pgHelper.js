'use strict';
var pg = require("pg");
var user = 'root';
var pwd = 'TuckedIn';
var dbEndpoint = 'dailydrop.c4noeotwvren.us-east-1.rds.amazonaws.com';
var dataBase = 'DailyDrop';
var conString = 'pg://' + user + ':' + pwd + '@' + dbEndpoint + ':5432/' + dataBase;

var rdsCore = require("./rdsCore.js");

//If this lands on a "warm" machine, it will not execute the code above,
//since its already in memory
function execQuery(query, callback) {
    console.log("Executing the following query: " + JSON.stringify(query));

    var client = new pg.Client(conString, function (err, client, done) {
        if (err) {
            console.log('error fetching client from pool', err);
        }
    });

    client.connect();
    var resultValues = [];

    client.query(query, (err, result) => {
        if (err) {
            console.log("Error executing query");
            console.log(err.stack);
            resultValues = {
                "Error detail:": err.detail,
                "Schema:": err.schema,
                "Table:": err.table,
                "Constraint:": err.constraint
            };
            client.end();
        }
        else {
            console.log(result);
            //if all groups for user, handle accordingly
            //rows is an array of anomyous objects
            result.rows.forEach(row => resultValues.push(row));
            console.log("*******************************************\n");
            console.log(resultValues);
            // client.end();
            callback(resultValues);
        }
    });
};

exports.getUserInfo = function (userId, callback) {
    console.log(rdsCore.GET_USER_INFO);
    console.log(userId);

    var query = {
        text: rdsCore.GET_USER_INFO,
        values: [userId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In execQuery callback. Passing to users callback!");
        callback(rows)
    })
}


/*
 * INSERTS 
 */
exports.insertUser = function (userId, premium, name, callback) {
    var query = {
        text: rdsCore.INSERT_USER,
        values: [userId, premium, name]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT USER execQuery callback. Passing to users callback!");
        callback(rows)
    })
}

exports.insertSubmission = function (songId, userId, groupId, callback) {
    var query = {
        text: rdsCore.INSERT_SUBMISSION,
        values: [songId, userId, groupId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

/*
 * Updates
 */
exports.voteOnSubmission = function (songId, groupId, callback) {
    var query = {
        text: rdsCore.VOTE_ON_SUBMISSION,
        values: [songId, groupId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In VOTE SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.getAllInfoForGroup = function (groupId, callback) {
    var getSongsQuery = {
        text: rdsCore.GET_SUBMISSIONS_IN_GROUP,
        values: [groupId]
    }
    var getUsersQuery = {
        text: rdsCore.GET_USERS_IN_GROUP,
        values: [groupId]
    }
    var res = {};
    // Make SQL query to get rows
    execQuery(getSongsQuery, function (rows) {
        //transform
        console.log("In VOTE SUBMISSION execQuery callback. Passing to sub callback!");
        res.songs = rows;
        console.log("Songs result: " + JSON.stringify(res))
        execQuery(getUsersQuery, function (rows) {
            res.users = rows;
            console.log("Users result: " + JSON.stringify(res))
            callback(res)
        })
    })
}