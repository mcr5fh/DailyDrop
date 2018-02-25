const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const api = require("./dailydrop.js")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())


app.get('/', (req, res) => {
    res.json("Hello world!")
})

// All the endpoints

/*
 * User Endpoints
 */
//This is going to get all groups, and all songs and users in those groups
// app.get('/v1/groups/:user_id', api.getAllInfoForUser)
app.get('/v1/users/:user_id/info', api.getUserInfo)
app.post('/v1/users', api.insertUser)
app.put('/v1/users/:user_id', api.updateUser)

/*
 * Group Endpoints
 */
//This is going to include all users and songs in the group
app.get('/v1/groups/:group_id/info', api.getAllInfoForGroup)
app.get('/v1/groups/:group_id/submissions', api.getSubmissionsInGroup)
app.get('/v1/groups/:group_id/users', api.getUsersInGroup)
app.put('/v1/groups/:group_id', api.updateGroup)
app.post('/v1/groups', api.insertGroup)

/*
 * Submission Endpoints
 */
// app.get('v1/submissions/:date', api.getAllSubmissions)
app.post('/v1/submissions', api.insertSubmission)

//Votes and plays
app.put('/v1/votes/:submission_id', api.addVoteToSubmission)
app.put('/v1/plays/:submission_id', api.addPlayToSubmission)

//Tags
app.post('/v1/tags', api.addTagToSubmission)
app.get('/v1/tags/:submission_id', api.getSubmissionTag)

module.exports = app