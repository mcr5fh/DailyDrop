'use strict';


const GetUsers = '/v1/users/{playlistId}';
const GetUsersOnPlaylist = '/v1/users/{playlistId}';


exports.getSqlQuery = function(event){
	var resourcePath = event.resourcePath;
	var httpMethod = event.httpMethod;
	var pathParams = event.params;
	//Need to decide how these are going to be passed
	var sqlQuery, sqlValues;

  	console.log('Calling method: ' + resourcePath);
  	
  	switch(resourcePath){
  		//for path /user/
    	case 'GetUser':
    		break;
    	case GetUsersOnPlaylist:
    		sqlQuery = "SELECT dailydrop.User.UserID, Premium, Name, RefreshToken FROM dailydrop.User \
				JOIN dailydrop.Playlist_User on \
				dailydrop.User.UserID = dailydrop.Playlist_User.UserID \
				WHERE PlaylistID=$1;"
			sqlValues = [pathParams.playlistId];
    		break;
    	/*
    	 *Inserts
    	 */
    	case 'InsertUser':
    		sqlQuery = 'INSERT INTO dailydrop.User(UserID, Premium, Name, RefreshToken) \
				VALUES($1, $2, $3, $4) RETURNING UserID, Name, RefreshToken;';
			sqlValues = [pathParams.userId, pathParams.premium, pathParams.name, pathParams.rToken]
			break;
		case 'InsertPlaylist':
    		sqlQuery = 'INSERT INTO dailydrop.Playlist(UserID, Premium, Name, RefreshToken) \
				VALUES($1, $2, $3, $4) RETURNING UserID, Name, RefreshToken;';
			sqlValues = [pathParams.userId, pathParams.premium, pathParams.name, pathParams.rToken]
			break;
    }

	return {
		text: sqlQuery,
		values: sqlValues
	};
}



