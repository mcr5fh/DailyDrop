process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']
'use strict'
var pg = require("pg")
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
			console.log('error fetching client from pool', err)
		}
	});

	client.connect();

	var query = rdsCore.getSqlQuery(event);

	console.log("Request: " + JSON.stringify(event));
	console.log("Query: " + JSON.stringify(query));

	client.query(query, (err, result) => {
		if (err) {
			console.log(err.stack)
		} else {
			//rows is an array of anomyous objects
			var res = [];
			result.rows.forEach(row => res.push(row));
			client.end();

			console.log("Done: " + res);
			var response = {
				"statusCode": 200,
				"headers": {
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
				},
				"body": JSON.stringify(res),
				"isBase64Encoded": false
			}
			callback(null, response);
		}
	});
};