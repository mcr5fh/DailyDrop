'use strict'
/*
 * This is the root of the Lambda.
 * It basically just wires up app.js to respond to the different http methods
 */
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app/app.js')
const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)