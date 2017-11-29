
"use strict";

var SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: "b213a51bc3d948aa97b25f2cf7e3a3f3",
  clientSecret: "e2c6235a23b9483f8090070309b55494",
  redirectUri:
    "https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/Beta/authgrant"
});

//for now
const ROOT_USER_ID = "jsrsoccer9715";
//take in auth token into command because we need prompt to generate it
//event will have to have a refresh token in it
exports.call = function(event) {
  spotifyApi.setRefreshToken(event.refreshToken);
  return spotifyApi.refreshAccessToken().then(
    function(data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      return callSpotifyApi(event);
    },
    function(err) {
      console.log("Caught an errors calling Spotify Api: ", err);
    }
  ).then(
    function(response) {
        //response will be an object with the response body and response code
        // console.log(response);
        return response;
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
};

// Create a private playlist

function callSpotifyApi(event){
  var methodName = event.method;
  var spotifyFunction; 
  console.log('Calling method: ' + methodName);
  switch(methodName){
    case 'GetCurrentUser':
      return spotifyApi.getMe().then(function(data){return {body:data.body, respCode: data.statusCode}});
    case 'GetCurrentUserPlaylists':
      //Example options {'limit':5,'offset':0};
      return spotifyApi.getUserPlaylists(event.userId, event.options).then(function(data){return {body:data.body, respCode: data.statusCode}});
    case 'CreatePlaylist':
      //We want to create the playlist under the root user account, to facilitate adding songs, 
      // options { 'public' : false }
      return spotifyApi.createPlaylist(ROOT_USER_ID, event.playlistName, event.options).then(function(data){return {body:data.body, respCode: data.statusCode}});
    case 'FollowPlaylist':
      return spotifyApi.followPlaylist(event.playlistOwnerId, event.playlistId, event.options).then(function(data){return {body:data.body, respCode: data.statusCode}});
    case 'GetPlaylist':
      //{'fields':'tracks.items(added_at,added_by.id)'};
      return spotifyApi.getPlaylist(event.userId, event.playlistId).then(function(data){return {body:data.body, respCode: data.statusCode}});
    case 'AddSongToPlaylist':
      return spotifyApi.addTracksToPlaylist(ROOT_USER_ID, event.playlistId, event.tracksToAdd).then(function(data){return data.statusCode});
  }

  return spotifyFunction
}
