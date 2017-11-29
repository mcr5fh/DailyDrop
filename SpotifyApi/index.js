process.env['PATH'] = process.env['PATH'] + ': ' + process.env['LAMBDA_TASK_ROOT']
'use strict'

var spotifyApi = require("./spotifyCore.js");

//If this lands on a "warm" machine, it will not execute the code above,
//since its already in memory
exports.handler = (event, context, callback) => {
	var response = spotifyApi.call(event).then(function(resp) {
		//do whatever you want with the data returned
		console.log("Body: " +resp.body);
		console.log("Code: " +resp.statusCode);
		callback(null, resp);
	});
};