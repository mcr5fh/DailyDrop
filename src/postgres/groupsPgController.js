'use strict'
const postgres = require('./postgresCore.js')
const queries = require("../sql/queries.js");

/*
 * GETS
 */

exports.getAllInfoForGroup = function (groupId, callback) {
    var getSongsQuery = {
        text: queries.GET_SUBMISSIONS_IN_GROUP,
        values: [groupId]
    }
    var getUsersQuery = {
        text: queries.GET_USERS_IN_GROUP,
        values: [groupId]
    }
    var getGroupInfoQuery = {
        text: queries.GET_GROUP_INFO,
        values: [groupId]
    }
    var group_info;
    var users = {};
    var songs = {};
    // Make SQL query to get rows
    postgres.execQuery(getSongsQuery, function (song_rows) {
        //transform
        console.log("In get all group info postgres.execQuery callback. Passing to sub callback!");
        songs = song_rows;
        console.log("Songs result: " + JSON.stringify(songs))
        postgres.execQuery(getUsersQuery, function (user_rows) {
            users = user_rows;
            console.log("Users result: " + JSON.stringify(users))
            postgres.execQuery(getGroupInfoQuery, function (group_rows) {
                //Group IDs are UUIDs thus unique, so we know this will (and should) only return one row
                group_info = group_rows[0];
                console.log("group_info result: " + JSON.stringify(group_info))
                group_info.users = users;
                group_info.songs = songs;
                callback(group_info)
            })
        });
    })
}

exports.getAllInfoForGroupSorted = function (groupId, callback) {
    var getSongsQuery = {
        text: queries.GET_SUBMISSIONS_IN_GROUP_TIME_BUCKET,
        values: [groupId]
    }
    var getUsersQuery = {
        text: queries.GET_USERS_IN_GROUP,
        values: [groupId]
    }
    var getGroupInfoQuery = {
        text: queries.GET_GROUP_INFO,
        values: [groupId]
    }
    var group_info;
    var users = {};
    var songs = {};
    // Make SQL query to get rows
    postgres.execQuery(getSongsQuery, function (song_rows) {
        //transform
        console.log("In get all group info SORTED postgres.execQuery callback. Passing to sub callback!");
        songs = song_rows;
        console.log("Songs result: " + JSON.stringify(songs))
        postgres.execQuery(getUsersQuery, function (user_rows) {
            users = user_rows;
            console.log("Users result: " + JSON.stringify(users))
            postgres.execQuery(getGroupInfoQuery, function (group_rows) {
                //Group IDs are UUIDs thus unique, so we know this will (and should) only return one row
                group_info = group_rows[0];
                console.log("group_info result: " + JSON.stringify(group_info))
                group_info.users = users;
                group_info.songs = songs;
                callback(group_info)
            })
        });
    })
}

exports.getSubmissionsInGroup = function (groupId, callback) {
    console.log(queries.GET_SUBMISSIONS_IN_GROUP);
    console.log(groupId);

    var query = {
        text: queries.GET_SUBMISSIONS_IN_GROUP,
        values: [groupId]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In postgres.execQuery callback. Passing to users callback!");
        callback(rows)
    })
}

exports.getUsersInGroup = function (groupId, callback) {
    console.log(queries.GET_USERS_IN_GROUP);
    console.log(groupId);

    var query = {
        text: queries.GET_USERS_IN_GROUP,
        values: [groupId]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In postgres.execQuery callback. Passing to users callback!");
        callback(rows)
    })
}


/*
 * INSERTS
 */
exports.insertGroup = function (groupName, userId, description, callback) {
    var query = {
        text: queries.INSERT_GROUP,
        values: [groupName, userId, description]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In INSERT GROUP postgres.execQuery callback. Passing to group callback!");
        callback(rows)
    })
}

exports.updateGroup = function (groupId, groupName, description, callback) {
    var query = {
        text: queries.UPDATE_GROUP,
        values: [groupName, description, groupId]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In INSERT GROUP execQuery callback. Passing to group callback!");
        callback(rows)
    })
}