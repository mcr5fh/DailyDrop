'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const pg = require("pg");
const user = 'root';
const pwd = 'TuckedIn';
const dbEndpoint = 'dailydrop.c4noeotwvren.us-east-1.rds.amazonaws.com';
const dataBase = 'DailyDrop';
const conString = 'pg://' + user + ':' + pwd + '@' + dbEndpoint + ':5432/' + dataBase;

const rdsCore = require("./rdsCore.js");

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: conString,
    ssl: true,
    max: 20, // set pool max size to 20
    min: 4, // set min pool size to 4
    idleTimeoutMillis: 3000, // close idle clients after 1 second
    connectionTimeoutMillis: 2000, // return an error after 1 second if connection could not be established
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

const TEST_PREFIX = "_TEST_";

//If this lands on a "warm" machine, it will not execute the code above,
//since its already in memory
function execQuery(query, callback) {
    console.log("Executing the following query: " + JSON.stringify(query));

    // var client = new pg.Client(conString, function (err, client, done) {
    //     if (err) {
    //         console.log('error fetching client from pool', err);
    //     }
    // });
    query.values.forEach(checkForTestData);
    query.values.forEach(checkIfNull);

    var resultValues = [];

    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error executing query");
            console.log(err.stack);
            throw err;
        }
        else {
            console.log(result.rows);
            //if all groups for user, handle accordingly
            //rows is an array of anomyous objects
            result.rows.forEach(row => resultValues.push(row));
            // resultValues.push(result.rows[0]);
            console.log("*******************************************\n");
            console.log(resultValues);
            callback(resultValues);
        }
    });
};

//exec transaction
function execTransaction(queryList, callback) {
    console.log("Executing the following transaction: " + JSON.stringify(queryList));

    var resultValues = [];
    (async(() => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await(pool.connect())

        try {
            await(client.query('BEGIN'))

            queryList.forEach(queryObj => {
                queryObj.values.forEach(checkForTestData);
                queryObj.values.forEach(checkIfNull);
                console.log("Executing query: ", queryObj);
                const { rows } = await(client.query(queryObj))
                checkIfNull(rows);
                resultValues.push(rows)
            })
            await(client.query('COMMIT'))
            console.log("Transaction complete");
            callback(resultValues);
        } catch (e) {
            await(client.query('ROLLBACK'))
            console.log("Transaction failed. Rolled back");
            throw e
        } finally {
            client.release()
        }
    }))().catch(e => console.error(e.stack))
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
function checkIfNull(value) {
    if (!(typeof value !== 'undefined' && value)) {
        throw new Error("The supplied value cannot be null")
    } else if (value instanceof Array && value.length == 0) {
        throw new Error("The query result was null, meaning something went wrong")
    }
}

function concatObjects(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
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
                console.log("group_info result: " + JSON.stringify(group_info))
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
exports.addVoteToSubmission = function (submissionId, userId, callback) {
    var insertVote = {
        text: rdsCore.INSERT_VOTE,
        values: [submissionId, userId]
    }
    var incrementVote = {
        text: rdsCore.ADD_VOTE_TO_SUBMISSION,
        values: [submissionId]
    }
    // Make SQL query to get rows
    //TODO: this has to be a transaction
    execTransaction([insertVote, incrementVote], function (rows) {
        //transform
        console.log("In VOTE SUBMISSION execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.addPlayToSubmission = function (submissionId, userId, callback) {
    var insertPlay = {
        text: rdsCore.INSERT_PLAY,
        values: [submissionId, userId]
    }
    var incrementPlay = {
        text: rdsCore.ADD_PLAY_TO_SUBMISSION,
        values: [submissionId]
    }
    // Make SQL query to get rows
    execTransaction([insertPlay, incrementPlay], function (rows) {
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



