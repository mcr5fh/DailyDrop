import unirest
import datetime

CANARY = "CANARY_" + str(datetime.datetime.now())
BASE_URL = "https://yyh6hsqj4g.execute-api.us-east-1.amazonaws.com/Beta"

CANARY_SUBMISSION_ID = "0ebdd5a6-d1e5-41a8-a61b-cf1d7b329387"
CANARY_GROUP_ID = "f672d1c7-b35b-4ff9-a6e5-255c1c7c54fe"
CANARY_USER_ID = CANARY


'''
INSERTS
'''
insert_user_path = "/v1/users"
insert_user_params = {"user_id": CANARY,
                      "premium": True,
                      "name": CANARY}
INSERT_USER = {"path": insert_user_path, "params": insert_user_params}

insert_submission_path = "/v1/submissions"
insert_submission_params = {"song_id": CANARY + "_song_id",
                            "song_name": CANARY + "_song_name",
                            "artist_name": CANARY + "_artist_name",
                            "user_id": CANARY,
                            "group_id": CANARY_GROUP_ID}
INSERT_SUBMISSION = {"path": insert_submission_path,
                     "params": insert_submission_params}

insert_group_path = "/v1/groups"
insert_group_params = {"name": CANARY,
                       "description": CANARY + " " + str(datetime.datetime.now()),
                       "creator_user_id": CANARY}
INSERT_GROUP = {"path": insert_group_path, "params": insert_group_params}


insert_play_path = "/v1/plays"
insert_play_params = {"submission_id": CANARY_SUBMISSION_ID,
                      "user_id": CANARY_USER_ID}
INSERT_PLAY = {"path": insert_play_path, "params": insert_play_params}

insert_tag_path = "/v1/tags"
insert_tag_params = {"submission_id": CANARY_SUBMISSION_ID, "tag": "CANARY"}
INSERT_TAG = {"path": insert_tag_path, "params": insert_tag_params}


'''
TODO: UPDATES
'''
update_group_path = "/v1/groups/" + CANARY_GROUP_ID
update_group_params = {}
UPDATE_GROUP = {"path": update_group_path, "params": update_group_params}

update_user_path = "/v1/users/{user_id}"
udate_user_params = {}


'''
GETS
'''
GET_USERS_IN_GROUP = {"path": "/v1/groups/" + CANARY_GROUP_ID + "/users"}
GET_INFO_FOR_GROUP_SORTED = {
    "path": "/v1/groups/" + CANARY_GROUP_ID + "/info-sorted"}
GET_INFO_FOR_GROUP = {"path": "/v1/groups/" + CANARY_GROUP_ID + "/info"}

# "/v1/groups/" + CANARY_GROUP_ID + "/submissions"
GET_TAGS_FOR_SUBMISSION = {"path": "/v1/tags/" + CANARY_SUBMISSION_ID}

GET_INFO_FOR_USER = {"path": "/v1/users/" + CANARY_USER_ID + "/info"}


GET_TESTS = [GET_USERS_IN_GROUP, GET_INFO_FOR_GROUP_SORTED, GET_INFO_FOR_GROUP,
             GET_INFO_FOR_USER]
# "/v1/groups/" + CANARY_GROUP_ID + "/submissions"GET_TAGS_FOR_SUBMISSION,

INSERT_TESTS = [INSERT_USER, INSERT_GROUP,
                INSERT_SUBMISSION, INSERT_PLAY, INSERT_TAG]
