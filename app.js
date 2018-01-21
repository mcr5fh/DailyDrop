const express = require('express')
const app = express()
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const api = require("./dailydrop.js")


app.use(awsServerlessExpressMiddleware.eventContext())
app.get('/', (req, res) => {
    res.json("Hello world!")
})

// All the endpoints
app.get('/v1/groups/:user_id', api.getAllGroupsForUser)

app.get('/v1/users/:user_id/info', api.getUserInfo)


module.exports = app