'use strict'
const postgres = require('./postgresCore.js')
const queries = require("../sql/queries.js");

/*
 * GETs
 */
exports.getUserInfo = function (userId, callback) {
    console.log(queries.GET_USER_INFO);
    console.log(userId);

    var query = {
        text: queries.GET_USER_INFO,
        values: [userId]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log();
        callback(rows)
    })
}

/*
 * INSERTS 
 */
exports.insertUser = function (userId, premium, name, refreshToken, callback) {
    var query = {
        text: queries.INSERT_USER,
        values: [userId, premium, name, refreshToken]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In INSERT USER execQuery callback. Passing to users callback!");
        callback(rows)
    })
}

/*
 * UPDATES
 */
exports.updateUser = function (userId, premium, name, refreshToken, callback) {
    var query = {
        text: queries.UPDATE_USER,
        values: [name, premium, refreshToken, userId]
    }
    // Make SQL query to get rows
    postgres.execQuery(query, function (rows) {
        //transform
        console.log("In INSERT USER execQuery callback. Passing to users callback!");
        callback(rows)
    })
}
