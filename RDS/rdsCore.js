'use strict';

const GET_SUBMISSIONS_IN_GROUP = '/v1/submission/{groupId}';
//We should also have one for on a date 
const GET_SUBMISSIONS_IN_GROUP_ON_DATE = '/v1/submission/{groupId}/{date????}';
const GET_USERS_IN_GROUP = '/v1/users/{groupId}';
const GET_GROUPS_FOR_USER = '/v1/users/{userId}/groups';

const INSER_USER = '/v1/users';
const INSERT_GROUP = '/v1/groups';
const INSERT_SUBMISSION = '/v1/submissions';

const VOTE_ON_SUBMISSION = '/v1/votes';

exports.getSqlQuery = function (event) {
	var resourcePath = event.resourcePath;
	var httpMethod = event.httpMethod;
	//Path parameters are used for GETS
	//Body is used for the updates
	var pathParams = event.params;
	var body = JSON.parse(event.body);
	//Need to decide how these are going to be passed
	var sqlQuery, sqlValues;

	console.log('Calling method: ' + resourcePath);
	console.log('Body: ' + body);
	console.log('PathParams: ' + pathParams);

	//Don't have to check GET/POST becuase API gateway will take care of that
	switch (resourcePath) {
		/*
		 * Gets
		 */
		case GET_SUBMISSIONS_IN_GROUP:
			sqlQuery = "SELECT SongId, UserId, GroupId, SubmissionTime, NumVotes \
						FROM  dailydrop.Submission \
						WHERE GroupId=$1 ";
			sqlValues = [pathParams.groupId];
			break;
		case GET_USERS_IN_GROUP:
			sqlQuery = "SELECT dailydrop.User.UserId, Premium, Name, RefreshToken FROM dailydrop.User \
						JOIN dailydrop.Group_User on \
						dailydrop.User.UserId = dailydrop.Group_User.UserId \
						WHERE GroupId=$1;";
			sqlValues = [pathParams.groupId];
			break;
		case GET_GROUPS_FOR_USER:
			sqlQuery = "SELECT g.GroupId, Name, VoteTime, SubmissionTime \
						FROM dailydrop.Group AS g \
						JOIN dailydrop.Group_User AS gu on \
						gu.GroupId = g.GroupId \
						WHERE pu.UserId=$1;";
			sqlValues = [pathParams.userId];
			break;

    	/*
    	 * Inserts
    	 */
		case INSER_USER:
			sqlQuery = 'INSERT INTO dailydrop.User(UserId, Premium, Name, RefreshToken) \
						VALUES($1, $2, $3, $4) \
						RETURNING UserId, Name, RefreshToken;';
			sqlValues = [body.userId, body.premium, body.name, body.rToken];
			break;
		case INSERT_GROUP:
			//Removed for debugging purposes ON CONFLICT (GroupId) DO NOTHING \
			sqlQuery = 'INSERT INTO dailydrop.Group(GroupId, Name, VoteTime, SubmissionTime) \
						VALUES($1, $2, $3, $4) \
						RETURNING GroupId, Name,  VoteTime, SubmissionTime;';
			sqlValues = [body.groupId, body.name, body.voteTime, body.submissionTime];
			break;
		case INSERT_SUBMISSION:
			sqlQuery = "INSERT INTO dailydrop.Submission (SongId, UserId, GroupId, SubmissionTime, NumVotes) \
						VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) \
						RETURNING SongId, UserId,SubmissionTime, NumVotes;";
			sqlValues = [body.songId, body.userId, body.groupId];
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
						WHERE s.SongId=$1 \
						AND s.UserId!=$2 \
						AND s.GroupId=$3 \
						RETURNING NumVotes;";
			sqlValues = [pathParams.songId, pathParams.userId, pathParams.groupId];
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
		successfulQuery = false;
	} else {
		resultValues.forEach(val => {
			if (val === null || val == "") {
				successfulQuery = false;
			}
		});
	}
	return successfulQuery;
};
