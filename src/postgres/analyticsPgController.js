'use strict'
const postgres = require('./postgresCore.js')
const queries = require("../sql/queries.js");

exports.calculateTrendingAnalytics = function (callback) {
    console.log("Running trending analyics calculations");

    var query = {
        text: queries.TRENDING_ZSCORE_TRANSACTION,
        values: []
    }
    // Make SQL query to get rows
    postgres.execTransaction(query, function (rows) {
        //transform
        console.log("In postgres.execQuery callback. Passing to users callback!");
        callback(rows)
    })
}