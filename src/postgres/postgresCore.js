'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Errors = require("../constants/errors.js")
const pg = require("pg");
const user = 'root';
const pwd = 'TuckedIn';
const dbEndpoint = 'dailydrop.c4noeotwvren.us-east-1.rds.amazonaws.com';
const dataBase = 'DailyDrop';
const conString = 'pg://' + user + ':' + pwd + '@' + dbEndpoint + ':5432/' + dataBase;

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: conString,
    ssl: true,
    max: 20, // set pool max size to 20
    min: 4, // set min pool size to 4
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
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
exports.execQuery = function (query, callback) {
    console.log("Executing the following query: " + JSON.stringify(query));

    query.values.forEach(checkForTestData);
    // query.values.forEach(checkIfNull);

    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error executing query");
            console.log(err.stack);
            throw err;
        }
        else {
            var resultValues = [];
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
exports.execTransaction = function (queryList, callback) {
    console.log("Executing the following transaction: " + JSON.stringify(queryList));

    (async(() => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await(pool.connect())

        try {
            await(client.query('BEGIN'))
            var resultValues = [];
            queryList.forEach(queryObj => {
                //We don't want to run the query if there was an error parsing any info 
                queryObj.values.forEach(checkForTestData);
                // queryObj.values.forEach(checkIfNull);
                console.log("Executing query: ", queryObj);
                const { rows } = await(client.query(queryObj))
                checkIfNull(rows);
                //Iterate through the result rows to "flatten" the object
                rows.forEach(row => resultValues.push(row));
                console.log(resultValues);

            })
            await(client.query('COMMIT'))
            console.log("Transaction complete");
            callback(resultValues);
        } catch (e) {
            await(client.query('ROLLBACK'))
            console.log("Transaction failed. Rolled back: " + e.message);
            throw new Errors.BadRequestError(e.message);
        } finally {
            client.release()
        }
    }))().catch(e => { throw e; });
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
//Type is either input or output
//We don't allow blank inputs
function checkIfNull(value) {
    if (typeof value === 'undefined') {
        throw new Errors.BadRequestError("The query returned null")
    }
    //  if (value.length == 0) {
    //     throw new Errors.BadRequestError("The query " + type + " was null or blank, meaning something went wrong")
    // }
}

function concatObjects(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}




