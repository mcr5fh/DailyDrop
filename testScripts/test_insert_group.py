import unirest

base_url = "https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/Beta"

# insert_group_path = "/v1/groups"
insert_group_path = "/v1/submissions"
response = unirest.post(base_url + insert_group_path, headers={"Accept": "application/json"},
                        # params={"name": "ThreeFriends",
                        # "description": "We are the Three Friends",
                        # "creator_user_id": "TestUser1"}
                        params={"song_id": "song_id-1234",
                                "song_name": "_TEST_song_name",
                                "artist_name": "_TEST_artist_name",
                                "user_id": "TestUser1",
                                "group_id": "58c19e8a-98a0-46be-b94f-68f08c3ab82d"})

print "Response code: " + str(response.code)  # The HTTP status code
print response.headers  # The HTTP headers
print "Response body: " + str(response.body)  # The parsed print response
print response.raw_body  # The unparsed response
