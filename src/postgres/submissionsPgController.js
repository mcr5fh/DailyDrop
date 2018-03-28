'use strict'
const postgres = require('./postgresCore.js')
const queries = require("../sql/queries.js");

/*
 * GETS
 */
exports.insertSubmission = function (songId, userId, groupId, songName, artistName, callback) {
    var query = {
        text: queries.INSERT_SUBMISSION,
        values: [songId, songName, artistName, userId, groupId]
    }
    // Make SQL query to get rows
    postgres.execTransaction([query], function (rows) {
        //transform
        console.log("In INSERT SUBMISSION postgres.execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.getSubmissionTag = function (submissionId, callback) {
    var getTag = {
        text: queries.GET_TAG,
        values: [submissionId]
    }
    // Make SQL query to get rows
    postgres.execQuery(getTag, function (rows) {
        //transform
        console.log("In PLAY SUBMISSION postgres.execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

/*
 * Updates/PUTs
 */
exports.addVoteToSubmission = function (submissionId, userId, callback) {
    var insertVote = {
        text: queries.INSERT_VOTE,
        values: [submissionId, userId]
    }
    // Make SQL query to get rows
    //TODO: this has to be a transaction
    postgres.execTransaction([insertVote], function (rows) {
        //transform
        console.log("In VOTE SUBMISSION postgres.execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.addPlayToSubmission = function (submissionId, userId, callback) {
    var insertPlay = {
        text: queries.INSERT_PLAY,
        values: [submissionId, userId]
    }
    // Make SQL query to get rows
    postgres.execTransaction([insertPlay], function (rows) {
        //transform
        console.log("In PLAY SUBMISSION postgres.execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

exports.addTagToSubmission = function (submissionId, tag, callback) {
    var insertTag = {
        text: queries.INSERT_TAG,
        values: [submissionId, tag]
    }
    // Make SQL query to get rows
    postgres.execQuery(insertTag, function (rows) {
        //transform
        console.log("In TAG SUBMISSION postgres.execQuery callback. Passing to sub callback!");
        callback(rows)
    })
}

