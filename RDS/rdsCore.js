'use strict';

const GET_SUBMISSIONS_IN_GROUP = '/v1/submission/{groupid}';
//We should also have one for on a date 
const GET_SUBMISSIONS_IN_GROUP_ON_DATE = '/v1/submission/{groupid}/{date????}';
const GET_USERS_IN_GROUP = '/v1/users/{groupid}';
const GET_GROUPS_FOR_USER = '/v1/users/{userid}/groups';

const GET_USERS_THAT_VOTED_ON_DATE = '/v1/users/{groupid}/date/{date}';

const INSER_USER = '/v1/users';
const INSERT_GROUP = '/v1/groups';
const INSERT_SUBMISSION = '/v1/submissions';

const VOTE_ON_SUBMISSION = '/v1/votes';

exports.getSqlQuery = function (event) {
	console.log("event: " + JSON.stringify(event));
	var resourcePath = event.resourcePath;
	var httpMethod = event.httpMethod;
	//Path parameters are used for GETS
	//Body is used for the updates
	var pathParams = event.params;
	var body = event.body;
	//Need to decide how these are going to be passed
	var sqlQuery, sqlValues;

	console.log('Calling method: ' + resourcePath);
	console.log('Body: ' + JSON.stringify(body));
	console.log('PathParams: ' + JSON.stringify(pathParams));

	//Don't have to check GET/POST becuase API gateway will take care of that
	switch (resourcePath) {
		/*
		 * Gets
		 */
		case GET_SUBMISSIONS_IN_GROUP:
			sqlQuery = "SELECT Songid, Userid, Groupid, SubmissionTime, NumVotes \
						FROM  dailydrop.Submission \
						WHERE Groupid=$1 ";
			sqlValues = [pathParams.groupid];
			break;
		case GET_USERS_IN_GROUP:
			sqlQuery = "SELECT dailydrop.User.Userid, Premium, Name, RefreshToken FROM dailydrop.User \
						JOIN dailydrop.Group_User on \
						dailydrop.User.Userid = dailydrop.Group_User.Userid \
						WHERE Groupid=$1;";
			sqlValues = [pathParams.groupid];
			break;
		case GET_GROUPS_FOR_USER:
			sqlQuery = "SELECT g.Groupid, Name, VoteTime, SubmissionTime \
						FROM dailydrop.Group AS g \
						JOIN dailydrop.Group_User AS gu on \
						gu.Groupid = g.Groupid \
						WHERE gu.Userid=$1;";
			sqlValues = [pathParams.userid];
			break;

		case GET_USERS_THAT_VOTED_ON_DATE:
			sqlQuery = "SELECT * FROM dailydrop.Submission \
						WHERE age(date $1, SubmissionTime) - interval '1 day' < interval '1 day'";
			sqlValues = [pathParams.date];
    	/*
    	 * Inserts
    	 */
		case INSER_USER:
			sqlQuery = 'INSERT INTO dailydrop.User(Userid, Premium, Name, RefreshToken) \
						VALUES($1, $2, $3, $4) \
						RETURNING Userid, Name, RefreshToken;';
			sqlValues = [body.userid, body.premium, body.name, body.rToken];
			break;
		case INSERT_GROUP:
			//Removed for debugging purposes ON CONFLICT (Groupid) DO NOTHING \
			sqlQuery = 'INSERT INTO dailydrop.Group(Groupid, Name, VoteTime, SubmissionTime) \
						VALUES($1, $2, $3, $4) \
						RETURNING Groupid, Name,  VoteTime, SubmissionTime;';
			sqlValues = [body.groupid, body.name, body.voteTime, body.submissionTime];
			break;
		case INSERT_SUBMISSION:
			sqlQuery = "INSERT INTO dailydrop.Submission (Songid, Userid, Groupid, SubmissionTime, NumVotes) \
						VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) \
						RETURNING Songid, Userid,SubmissionTime, NumVotes;";
			sqlValues = [body.songid, body.userid, body.groupid];
			break;
		/*
    	 * Updates
    	 * TODO : is this a POST or GET?
    	 */
		case VOTE_ON_SUBMISSION:
			//Where $1 is the person submitting the vote
			//Don't let the person vote on their own submission
			//If Row is non-exsistent, the result will contain zero rows
			sqlQuery = "UPDATE dailydrop.Submission as s \
						SET NumVotes = NumVotes + 1 \
						WHERE s.Songid=$1 \
						AND s.Userid!=$2 \
						AND s.Groupid=$3 \
						RETURNING NumVotes;";
			sqlValues = [pathParams.songid, pathParams.userid, pathParams.groupid];
			break;
	}

	return {
		text: sqlQuery,
		values: sqlValues
	};
};

exports.validateQueryResults = function (resultValues) {
	var successfulQuery = true;
	if (resultValues.length == 0) {
		return false;
	} else {
		resultValues.forEach(val => {
			if (val === null || val == "") {
				successfulQuery = false;
			}
		});
	}
	return successfulQuery;
};
