'use strict';
var fs = require("fs");

const QUERY_FOLDER = 'SqlQueries/';
//
const GET_SUBMISSIONS_IN_GROUP_PATH = '/v1/submission/{group_id}';
const GET_SUBMISSIONS_IN_GROUP_QUERY = '';
//We should also have one for on a date 
const GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH = '/v1/submission/{group_id}/{date????}';
const GET_USERS_IN_GROUP_PATH = '/v1/users/{group_id}';

const GET_ALL_GROUP_INFO_FOR_USER_PATH = '/v1/users/{user_id}/groups';
const GET_ALL_GROUP_INFO_FOR_USER_QUERY = QUERY_FOLDER + 'get_all_group_info_for_user.sql';

//should be something like this
const GET_USERS_THAT_VOTED_ON_DATE_PATH = '/v1/group/{group_id}/date/{date}';

const INSER_USER_PATH = '/v1/users';
const INSERT_GROUP_PATH = '/v1/groups';
const INSERT_SUBMISSION_PATH = '/v1/submissions';

const INSERT_WINNER_OF_THE_DAY_QUERY = QUERY_FOLDER + 'get_winner_of_the_day.sql';

const VOTE_ON_SUBMISSION_PATH = '/v1/votes';

exports.getSqlQuery = function (event) {
	console.log("event: " + JSON.stringify(event));
	var resourcePath = event.resourcePath;
	var httpMethod = event.httpMethod;
	//Path parameters are used for GETS
	//Body is used for the updates
	var pathParams = event.params;
	var body;
	if (event.body != "") {
		body = JSON.parse(event.body);
	}
	var sqlQuery, sqlValues;

	console.log('Calling method: ' + resourcePath);
	console.log('Body: ' + JSON.stringify(body));
	console.log('PathParams: ' + JSON.stringify(pathParams));

	//Don't have to check GET/POST becuase API gateway will take care of that
	switch (resourcePath) {
		/*
		 * Gets
		 */
		case GET_SUBMISSIONS_IN_GROUP_PATH:
			sqlQuery = "SELECT song_id, user_id, group_id, submission_time, num_votes \
						FROM  dailydrop.Submission \
						WHERE group_id=$1 ";
			sqlValues = [pathParams.group_id];
			break;
		case GET_USERS_IN_GROUP_PATH:
			sqlQuery = "SELECT dailydrop.User.user_id, premium, name, refresh_token FROM dailydrop.User \
						JOIN dailydrop.Group_User on \
						dailydrop.User.user_id = dailydrop.Group_User.user_id \
						WHERE group_id=$1;";
			sqlValues = [pathParams.group_id];
			break;
		case GET_ALL_GROUP_INFO_FOR_USER_PATH:
			sqlQuery = fs.readFileSync(GET_ALL_GROUP_INFO_FOR_USER_QUERY, 'utf8');
			sqlValues = [pathParams.user_id];
			break;

		case GET_USERS_THAT_VOTED_ON_DATE_PATH:
			sqlQuery = "SELECT * FROM dailydrop.Submission \
						WHERE age(date $1, submission_time) - interval '1 day' < interval '1 day'";
			sqlValues = [pathParams.date];
    	/*
    	 * Inserts
    	 */
		case INSER_USER_PATH:
			sqlQuery = 'INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) \
						VALUES($1, $2, $3, $4) \
						RETURNING user_id, name, refresh_token;';
			sqlValues = [body.user_id, body.premium, body.name, body.rToken];
			break;
		case INSERT_GROUP_PATH:
			//Removed for debugging purposes ON CONFLICT (group_id) DO NOTHING \
			sqlQuery = 'INSERT INTO dailydrop.Group(group_id, name, Vote_time, submission_time) \
						VALUES($1, $2, $3, $4) \
						RETURNING group_id, name,  Vote_time, submission_time;';
			sqlValues = [body.group_id, body.name, body.vote_time, body.submission_time];
			break;
		case INSERT_SUBMISSION_PATH:
			sqlQuery = "INSERT INTO dailydrop.Submission (song_id, user_id, group_id, submission_time, num_votes) \
						VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) \
						RETURNING song_id, user_id,submission_time, num_votes;";
			sqlValues = [body.song_id, body.user_id, body.group_id];
			break;
		/*
    	 * Updates
    	 * TODO : is this a POST or GET?
    	 */
		case VOTE_ON_SUBMISSION_PATH:
			//Where $1 is the person submitting the vote
			//Don't let the person vote on their own submission
			//If Row is non-exsistent, the result will contain zero rows
			sqlQuery = "UPDATE dailydrop.Submission as s \
						SET num_votes = num_votes + 1 \
						WHERE s.song_id=$1 \
						AND s.user_id!=$2 \
						AND s.group_id=$3 \
						RETURNING num_votes;";
			sqlValues = [pathParams.song_id, pathParams.user_id, pathParams.group_id];
			break;
	}

	//Add to json format to the response 
	// sqlQuery = "select array_agg(row) from (" + sqlQuery + ") row";
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
