process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
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
exports.handler = (event, context, callback) => {
	var client = new pg.Client(conString, function(err, client, done) {
		if (err) {
			console.log('error fetching client from pool', err);
		}
	});

	// allows for using callbacks as finish/error-handlers
 context.callbackWaitsForEmptyEventLoop = false;
  
	client.connect();

	var query = rdsCore.getSqlQuery(event);

	console.log("Request: " + JSON.stringify(event));
	console.log("Query: " + JSON.stringify(query));

	var resultValues = [];
	var statusCode;
	client.query(query, (err, result) => {
		if (err) {
			console.log("Error executing query");
			console.log(err.stack);
			statusCode = 400;
			resultValues = {
				"Error detail:" : err.detail,
				"Schema:" : err.schema,
				"Table:" : err.table,
				"Constraint:" : err.constraint
			};
		}
		else {
			//rows is an array of anomyous objects
			result.rows.forEach(row => resultValues.push(row));
			client.end();

			//The queries will return values inserted/retrieved from the DB
			//Make sure there was not an error
			var successfulQuery = rdsCore.validateQueryResults(resultValues);

			if (successfulQuery) {
				statusCode = 200;
				console.log("Successful Query. Result: " + resultValues);
			}
			else {
				statusCode = 500;
				console.log("Error in executing query. Result: " + resultValues);
			}
		}
		client.end();
		//Status code will be set by now
		var response = {
				"statusCode": statusCode,
				"headers": {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				},
				"body": JSON.stringify(resultValues),
				"isBase64Encoded": false
			};
		console.log(response);
		callback(null, response);
	});
};
