'use strict';
var pg = require("pg");
var user = 'root';
var pwd = 'TuckedIn';
var dbEndpoint = 'dailydrop.c4noeotwvren.us-east-1.rds.amazonaws.com';
var dataBase = 'DailyDrop';
var conString = 'pg://' + user + ':' + pwd + '@' + dbEndpoint + ':5432/' + dataBase;

var rdsCore = require("./rdsCore.js");

const TEST_PREFIX = "_TEST_";

//If this lands on a "warm" machine, it will not execute the code above,
//since its already in memory
function execQuery(query, callback) {
    console.log("Executing the following query: " + JSON.stringify(query));

    query.values.forEach(checkForTestData);
    query.values.forEach(validateParams);

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



////////////////////////////////////////////
///////      Helper methods      ///////////
////////////////////////////////////////////

function checkForTestData(value, index, array) {
    if ((typeof value === 'string' || value instanceof String) && value.includes(TEST_PREFIX)) {
        var date = new Date();
        array[index] += date.toISOString();
        console.log("Found test data. Appended date:" + array[index]);
    }
}
function validateParams(value) {
    if (!(typeof value !== 'undefined' && value)) {
        throw new Error("The supplied value cannot be null")
    }
}
////////////////////////////////////////////
///////  Exported query methods  ///////////
////////////////////////////////////////////

/*
 * GETs
 */
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
        console.log();
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
    var getGroupInfoQuery = {
        text: rdsCore.GET_GROUP_INFO,
        values: [groupId]
    }
    var group_info;
    var users = {};
    var songs = {};
    // Make SQL query to get rows
    execQuery(getSongsQuery, function (song_rows) {
        //transform
        console.log("In get all group info execQuery callback. Passing to sub callback!");
        songs = song_rows;
        console.log("Songs result: " + JSON.stringify(songs))
        execQuery(getUsersQuery, function (user_rows) {
            users = user_rows;
            console.log("Users result: " + JSON.stringify(users))
            execQuery(getGroupInfoQuery, function (group_rows) {
                //Group IDs are UUIDs thus unique, so we know this will (and should) only return one row
                group_info = group_rows[0];
                group_info.users = users;
                group_info.songs = songs;
                console.log("group_info result: " + JSON.stringify(group_info))
                callback(group_info)
            })
        });
    })
}

exports.getSubmissionsInGroup = function (groupId, callback) {
    console.log(rdsCore.GET_SUBMISSIONS_IN_GROUP);
    console.log(groupId);

    var query = {
        text: rdsCore.GET_SUBMISSIONS_IN_GROUP,
        values: [groupId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In execQuery callback. Passing to users callback!");
        callback(rows)
    })
}

exports.getUsersInGroup = function (groupId, callback) {
    console.log(rdsCore.GET_USERS_IN_GROUP);
    console.log(groupId);

    var query = {
        text: rdsCore.GET_USERS_IN_GROUP,
        values: [groupId]
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
exports.insertUser = function (userId, premium, name, refreshToken, callback) {
    var query = {
        text: rdsCore.INSERT_USER,
        values: [userId, premium, name, refreshToken]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT USER execQuery callback. Passing to users callback!");
        callback(rows)
    })
}

exports.insertGroup = function (groupName, userId, description, callback) {
    var query = {
        text: rdsCore.INSERT_GROUP,
        values: [groupName, userId, description]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT GROUP execQuery callback. Passing to group callback!");
        callback(rows)
    })
}

exports.insertSubmission = function (songId, userId, groupId, songName, artistName, callback) {
    var query = {
        text: rdsCore.INSERT_SUBMISSION,
        values: [songId, songName, artistName, userId, groupId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

/*
 * Updates/PUTs
 */
exports.addVoteToSubmission = function (submissionId, callback) {
    var query = {
        text: rdsCore.ADD_VOTE_TO_SUBMISSION,
        values: [submissionId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In VOTE SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.addPlayToSubmission = function (submissionId, callback) {
    var query = {
        text: rdsCore.ADD_PLAY_TO_SUBMISSION,
        values: [submissionId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In PLAY SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.updateGroup = function (groupId, groupName, description, callback) {
    var query = {
        text: rdsCore.UPDATE_GROUP,
        values: [groupName, description, groupId]
    }
    // Make SQL query to get rows
    execQuery(query, function (rows) {
        //transform
        console.log("In INSERT GROUP execQuery callback. Passing to group callback!");
        callback(rows)
    })
}



