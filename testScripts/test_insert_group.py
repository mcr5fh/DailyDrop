import unirest

base_url="https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/Beta"

insert_group_path = "/v1/groups"
response = unirest.post(base_url + insert_group_path, headers={ "Accept": "application/json" }, 
params={ "name": "ThreeFriends", "description": "We are the Three Friends", "creator_user_id": "TestUser1" })


print "Response code: " + str(response.code) # The HTTP status code
print response.headers # The HTTP headers
print "Response body: " + str(response.body) # The parsed print response
print response.raw_body # The unparsed response
